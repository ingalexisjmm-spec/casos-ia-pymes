import "server-only";

import Stripe from "stripe";

import { stripeSecretKey } from "@/lib/secrets";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = stripeSecretKey();
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

export function stripeKeyMode(): "test" | "live" | "unknown" {
  const key = stripeSecretKey();
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return "test";
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return "live";
  return "unknown";
}
