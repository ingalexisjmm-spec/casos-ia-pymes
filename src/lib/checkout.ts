import { SPONSOR_INTEGRATION_ID, SPONSOR_PRICE_USD, absoluteUrl } from "@/lib/site";
import { getStripe, stripePaymentLink, stripePriceId } from "@/lib/stripe";

export type CheckoutStart = {
  url: string;
  sessionId: string | null;
};

export async function startSponsorCheckout(input: {
  sponsorId: string;
  email: string;
  name: string;
}): Promise<CheckoutStart> {
  const stripe = getStripe();
  const priceId = stripePriceId();
  const paymentLink = stripePaymentLink();

  if (stripe) {
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        locale: "es-419",
        customer_email: input.email,
        client_reference_id: input.sponsorId,
        integration_identifier: SPONSOR_INTEGRATION_ID,
        success_url: absoluteUrl("/patrocinio?estado=pagado"),
        cancel_url: absoluteUrl("/patrocinio?estado=cancelado"),
        metadata: {
          sponsor_id: input.sponsorId,
          sponsor_name: input.name.slice(0, 200),
        },
        line_items: [
          priceId
            ? { price: priceId, quantity: 1 }
            : {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: SPONSOR_PRICE_USD * 100,
                  product_data: {
                    name: "Patrocinio Casos IA",
                    description: "Ficha en el directorio y mención en un envío del boletín.",
                  },
                },
              },
        ],
      },
      { idempotencyKey: `sponsor-checkout/${input.sponsorId}` },
    );

    if (!session.url) {
      throw new Error("Stripe no devolvió la URL de pago.");
    }

    return { url: session.url, sessionId: session.id };
  }

  if (paymentLink) {
    const url = new URL(paymentLink);
    url.searchParams.set("prefilled_email", input.email);
    url.searchParams.set("client_reference_id", input.sponsorId);
    return { url: url.toString(), sessionId: null };
  }

  throw new Error("Pago no configurado.");
}

export function paymentsConfigured(): boolean {
  return Boolean(getStripe() || stripePaymentLink());
}
