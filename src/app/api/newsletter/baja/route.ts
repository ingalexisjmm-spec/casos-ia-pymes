import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let token = "";
  try {
    const body = (await request.json()) as { token?: unknown };
    token = typeof body.token === "string" ? body.token.trim() : "";
  } catch {
    token = "";
  }

  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "El enlace de baja no es válido." }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "La baja todavía no está conectada. Falta configurar Supabase." },
      { status: 503 },
    );
  }

  const { data, error } = await admin
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null)
    .select("id");

  if (error) {
    console.error("newsletter unsubscribe", error.code);
    return NextResponse.json({ error: "No pudimos actualizar la lista." }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({
      message: "Si ese correo estaba en la lista, ya no lo está.",
    });
  }

  return NextResponse.json({ message: "Listo. Ya no enviaremos el boletín a ese correo." });
}
