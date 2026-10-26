import { NextResponse } from "next/server";

import { paymentsConfigured, startSponsorCheckout } from "@/lib/checkout";
import { absoluteUrl } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase";
import { cleanLine, normalizeEmail, optionalWebsite } from "@/lib/validators";

export async function POST(request: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object") body = parsed as Record<string, unknown>;
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "No entendimos el formulario." }, { status: 400 });
  }

  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ url: absoluteUrl("/") });
  }

  const name = typeof body.name === "string" ? cleanLine(body.name, 80) : "";
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : null;
  const blurb = typeof body.blurb === "string" ? cleanLine(body.blurb, 160) : "";
  const website = typeof body.website === "string" ? optionalWebsite(body.website) : null;

  if (name.length < 2) {
    return NextResponse.json({ error: "Escribe el nombre del negocio o producto." }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 });
  }
  if (blurb.length < 8) {
    return NextResponse.json({ error: "La frase de la ficha es muy corta." }, { status: 400 });
  }
  if (website === "invalid") {
    return NextResponse.json({ error: "El sitio web no parece una dirección válida." }, { status: 400 });
  }

  if (!paymentsConfigured()) {
    return NextResponse.json(
      {
        error:
          "El pago no está configurado. Agrega STRIPE_SECRET_KEY y, si quieres, STRIPE_PRICE_ID o STRIPE_PAYMENT_LINK.",
      },
      { status: 503 },
    );
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Falta configurar Supabase para registrar el patrocinio." },
      { status: 503 },
    );
  }

  const { data, error } = await admin
    .from("sponsors")
    .insert({
      name,
      email,
      website_url: website,
      blurb,
      status: "pending",
      show_listing: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("sponsor insert", error?.code);
    return NextResponse.json({ error: "No pudimos registrar el patrocinio." }, { status: 500 });
  }

  const sponsorId = data.id as string;

  try {
    const checkout = await startSponsorCheckout({ sponsorId, email, name });
    if (checkout.sessionId) {
      await admin
        .from("sponsors")
        .update({ stripe_checkout_session_id: checkout.sessionId })
        .eq("id", sponsorId);
    }
    return NextResponse.json({ url: checkout.url });
  } catch (checkoutError) {
    console.error("sponsor checkout", checkoutError instanceof Error ? checkoutError.message : "error");
    await admin.from("sponsors").update({ status: "failed" }).eq("id", sponsorId);
    return NextResponse.json({ error: "No pudimos abrir el pago en Stripe." }, { status: 502 });
  }
}
