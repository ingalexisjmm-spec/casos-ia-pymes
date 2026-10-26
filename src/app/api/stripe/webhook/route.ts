import { revalidateTag } from "next/cache";
import type Stripe from "stripe";

import { sendSponsorReceipt } from "@/lib/email";
import { getStripe, stripeWebhookSecret } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = stripeWebhookSecret();
  if (!stripe || !secret) {
    return new Response("Webhook no configurado.", { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Falta la firma.", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return new Response("Firma inválida.", { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded" &&
    event.type !== "checkout.session.async_payment_failed"
  ) {
    return new Response("OK");
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const sponsorId = session.client_reference_id || session.metadata?.sponsor_id;
  if (!sponsorId) return new Response("OK");

  const admin = createAdminClient();
  if (!admin) return new Response("Sin base de datos.", { status: 500 });

  if (event.type === "checkout.session.async_payment_failed") {
    const { error } = await admin
      .from("sponsors")
      .update({ status: "failed", stripe_checkout_session_id: session.id })
      .eq("id", sponsorId)
      .neq("status", "paid");
    if (error) return new Response("Error al registrar el fallo.", { status: 500 });
    return new Response("OK");
  }

  if (session.payment_status === "unpaid") {
    return new Response("OK");
  }

  const { data: sponsor, error: readError } = await admin
    .from("sponsors")
    .select("id, email, name, status")
    .eq("id", sponsorId)
    .maybeSingle();

  if (readError) return new Response("Error de lectura.", { status: 500 });
  if (!sponsor || sponsor.status === "paid") return new Response("OK");

  const { error: updateError } = await admin
    .from("sponsors")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      stripe_checkout_session_id: session.id,
    })
    .eq("id", sponsorId)
    .neq("status", "paid");

  if (updateError) return new Response("Error al registrar el pago.", { status: 500 });

  await sendSponsorReceipt(String(sponsor.email), String(sponsor.name), session.id);
  revalidateTag("sponsors", "max");
  return new Response("OK");
}
