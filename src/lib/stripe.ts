import "server-only";

import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!client) {
    client = new Stripe(key, {
      appInfo: { name: "Casos IA", url: "https://kvikklab.com" },
    });
  }
  return client;
}

export function stripePriceId(): string {
  return process.env.STRIPE_PRICE_ID?.trim() ?? "";
}

export function stripePaymentLink(): string {
  return process.env.STRIPE_PAYMENT_LINK?.trim() ?? "";
}

export function stripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
}
