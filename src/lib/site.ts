export const SITE_NAME = "Casos IA";

export const SITE_DESCRIPTION =
  "Directorio de usos de inteligencia artificial para negocios. Cada ficha dice el problema, las herramientas y la dificultad, sin métricas inventadas.";

export const SPONSOR_PRICE_USD = 500;

export const SPONSOR_INTEGRATION_ID = "casos-ia-patrocinio-bvkrmnqx";

export const KVIKK_URL = "https://kvikklab.com";

export const KVIKK_QUOTE_URL = "https://kvikklab.com/#cotizador";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (raw && isAbsoluteHttp(raw)) return raw;
  return "http://localhost:3000";
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

function isAbsoluteHttp(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function stripeKeyMode(): "test" | "live" | "unknown" {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return "test";
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return "live";
  return "unknown";
}
