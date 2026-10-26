import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  SPONSOR_LAUNCH_PRICE_CENTS,
  SPONSOR_LAUNCH_PRICE_USD,
  SPONSOR_LIST_PRICE_USD,
} from "../src/lib/site";

function source(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("el cobro de lanzamiento es USD 149 y el de lista queda en 500", () => {
  assert.equal(SPONSOR_LAUNCH_PRICE_CENTS, 14900);
  assert.equal(SPONSOR_LAUNCH_PRICE_USD, 149);
  assert.equal(SPONSOR_LIST_PRICE_USD, 500);
  assert.notEqual(SPONSOR_LAUNCH_PRICE_USD, SPONSOR_LIST_PRICE_USD);
});

test("Checkout usa los centavos de lanzamiento y no el precio de lista", () => {
  const checkout = source("src/lib/checkout.ts");
  assert.match(checkout, /unit_amount:\s*SPONSOR_LAUNCH_PRICE_CENTS/);
  assert.doesNotMatch(checkout, /SPONSOR_LIST_PRICE_USD/);
  assert.doesNotMatch(checkout, /price:\s*priceId/);
  assert.doesNotMatch(checkout, /stripePriceId/);
});

test("la página de patrocinio separa el precio que se cobra del de lista", () => {
  const page = source("src/app/patrocinio/page.tsx");
  assert.match(page, /Precio de lanzamiento:/);
  assert.match(page, /pago único/);
  assert.match(page, /Precio de lista \/ sponsors internacionales:/);
  assert.match(page, /SPONSOR_LAUNCH_PRICE_USD/);
  assert.match(page, /SPONSOR_LIST_PRICE_USD/);
  assert.match(page, /No incluye una cantidad prometida de visitas, clics o ventas/);
});

test("el botón y el recibo dicen el importe que se cobra", () => {
  const form = source("src/components/sponsor-form.tsx");
  const email = source("src/lib/email.ts");
  assert.match(form, /Pagar USD \$\{SPONSOR_LAUNCH_PRICE_USD\} con Stripe/);
  assert.match(email, /precio de lanzamiento, USD \$\{SPONSOR_LAUNCH_PRICE_USD\}/);
  assert.doesNotMatch(email, /USD 500/);
  assert.doesNotMatch(form, /SPONSOR_LIST_PRICE_USD/);
});
