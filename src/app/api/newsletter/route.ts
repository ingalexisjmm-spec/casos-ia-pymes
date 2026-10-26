import { NextResponse } from "next/server";

import { sendNewsletterWelcome } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase";
import { normalizeEmail } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) {
    return NextResponse.json({ error: "No entendimos el formulario." }, { status: 400 });
  }

  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ message: "Listo. Guardamos tu correo." });
  }

  const email = typeof body.email === "string" ? normalizeEmail(body.email) : null;
  if (!email) {
    return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "web";
  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "El boletín todavía no está conectado. Falta configurar Supabase." },
      { status: 503 },
    );
  }

  const { data: existing, error: readError } = await admin
    .from("newsletter_subscribers")
    .select("id, unsubscribe_token, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  if (readError) {
    console.error("newsletter read", readError.code);
    return NextResponse.json({ error: "No pudimos guardar el correo." }, { status: 500 });
  }

  if (existing && !existing.unsubscribed_at) {
    return NextResponse.json({ message: "Este correo ya está en la lista." });
  }

  let token = existing?.unsubscribe_token as string | undefined;

  if (existing) {
    const { error } = await admin
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: null, source })
      .eq("id", existing.id);
    if (error) {
      console.error("newsletter resubscribe", error.code);
      return NextResponse.json({ error: "No pudimos guardar el correo." }, { status: 500 });
    }
  } else {
    const { data, error } = await admin
      .from("newsletter_subscribers")
      .insert({ email, source })
      .select("unsubscribe_token")
      .single();
    if (error || !data) {
      console.error("newsletter insert", error?.code);
      return NextResponse.json({ error: "No pudimos guardar el correo." }, { status: 500 });
    }
    token = data.unsubscribe_token as string;
  }

  const emailSent = token ? await sendNewsletterWelcome(email, token) : false;
  return NextResponse.json({
    message: emailSent
      ? "Listo. Te enviamos un correo de bienvenida."
      : "Guardamos tu correo. El aviso por email se envía cuando Resend está configurado.",
  });
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}
