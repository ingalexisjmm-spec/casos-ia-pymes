export const SITE_NAME = "Casos IA";

export const SITE_DESCRIPTION =
  "Directorio de usos de inteligencia artificial para negocios. Cada ficha dice el problema, las herramientas y la dificultad, sin métricas inventadas.";

/** Precio de lanzamiento que cobra Stripe Checkout, en centavos (USD 149). */
export const SPONSOR_LAUNCH_PRICE_CENTS = 14900;

/** Mismo importe en dólares. Sale de los centavos para que las dos cifras no se separen. */
export const SPONSOR_LAUNCH_PRICE_USD = SPONSOR_LAUNCH_PRICE_CENTS / 100;

/** Precio de lista para sponsors internacionales. Solo referencia; no es un cobro. */
export const SPONSOR_LIST_PRICE_USD = 500;

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
