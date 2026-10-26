import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveSplitSecret, stripeSecretKey, supabaseServiceRoleSecret } from "../src/lib/secrets";
import { stripeKeyMode } from "../src/lib/stripe";
import { supabaseServiceRoleKey } from "../src/lib/supabase";

const SECRET_ENV =
  /process\.env\.(?:STRIPE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|CASOS_SK_[12]|CASOS_SR_[12])\b|process\.env\[["'](?:STRIPE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|CASOS_SK_[12]|CASOS_SR_[12])["']\]/;

test("resolveSplitSecret concatena solo cuando ambas partes tienen valor", () => {
  assert.equal(resolveSplitSecret("aaa", "bbb", "full"), "aaabbb");
  assert.equal(resolveSplitSecret(" aaa ", " bbb ", "full"), "aaabbb");
  assert.equal(resolveSplitSecret("aaa", "", " full "), "full");
  assert.equal(resolveSplitSecret("", "bbb", "full"), "full");
  assert.equal(resolveSplitSecret(" ", "bbb", "full"), "full");
  assert.equal(resolveSplitSecret(undefined, "bbb", undefined), "");
  assert.equal(resolveSplitSecret(undefined, undefined, "  "), "");
});

test("los lectores de entorno usan las partes y, si falta alguna, la clave completa", () => {
  const keys = [
    "CASOS_SK_1",
    "CASOS_SK_2",
    "STRIPE_SECRET_KEY",
    "CASOS_SR_1",
    "CASOS_SR_2",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const previous = new Map(keys.map((key) => [key, process.env[key]]));
  const set = (key: string, value: string | undefined) => {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  };

  try {
    set("CASOS_SK_1", "sk_test_");
    set("CASOS_SK_2", "part");
    set("STRIPE_SECRET_KEY", "sk_live_ignored");
    assert.equal(stripeSecretKey(), "sk_test_part");
    assert.equal(stripeKeyMode(), "test");

    set("CASOS_SK_2", " ");
    set("STRIPE_SECRET_KEY", " rk_live_full ");
    assert.equal(stripeSecretKey(), "rk_live_full");
    assert.equal(stripeKeyMode(), "live");

    set("CASOS_SK_1", undefined);
    set("CASOS_SK_2", undefined);
    set("STRIPE_SECRET_KEY", undefined);
    assert.equal(stripeSecretKey(), "");
    assert.equal(stripeKeyMode(), "unknown");

    set("CASOS_SR_1", "sr_");
    set("CASOS_SR_2", "part");
    set("SUPABASE_SERVICE_ROLE_KEY", "full-role");
    assert.equal(supabaseServiceRoleSecret(), "sr_part");
    assert.equal(supabaseServiceRoleKey(), "sr_part");

    set("CASOS_SR_1", undefined);
    set("SUPABASE_SERVICE_ROLE_KEY", " full-role ");
    assert.equal(supabaseServiceRoleKey(), "full-role");
  } finally {
    for (const [key, value] of previous) set(key, value);
  }
});

test("solo secrets.ts lee las claves de Stripe y de la service role", () => {
  const hits: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(?:ts|tsx|js|mjs)$/.test(entry)) continue;
      const relative = path.relative(process.cwd(), full);
      if (relative === path.join("src", "lib", "secrets.ts")) continue;
      const text = readFileSync(full, "utf8");
      if (SECRET_ENV.test(text)) hits.push(relative);
    }
  }

  walk(path.join(process.cwd(), "src"));
  assert.deepEqual(hits, []);
});
