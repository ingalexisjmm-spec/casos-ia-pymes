import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedUseCases } from "../src/data/use-cases";
import { CATEGORIES } from "../src/lib/types";
import { isSafeHttpUrl, normalizeEmail, optionalWebsite } from "../src/lib/validators";

const categoryIds = new Set(CATEGORIES.map((item) => item.id));

test("el contenido inicial tiene entre 15 y 25 fichas únicas", () => {
  assert.ok(seedUseCases.length >= 15 && seedUseCases.length <= 25);
  const slugs = new Set(seedUseCases.map((item) => item.slug));
  assert.equal(slugs.size, seedUseCases.length);
});

test("las fichas iniciales están marcadas como ejemplo y no inventan una fuente", () => {
  for (const item of seedUseCases) {
    assert.equal(item.isSeed, true);
    assert.equal(item.sourceUrl, null);
    assert.ok(item.summary.length > 40);
    assert.ok(item.body.includes("\n\n"));
    assert.ok(item.tools.length > 0);
    assert.ok(item.categories.every((category) => categoryIds.has(category)));
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  }
});

test("el contenido público no usa la palabra local que el producto evita", () => {
  const files = [
    "src/data/use-cases.ts",
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "src/app/patrocinio/page.tsx",
    "src/components/sponsor-form.tsx",
    "src/lib/email.ts",
    "src/lib/site.ts",
    "README.md",
    "supabase/migrations/20261026005217_init_directory.sql",
  ];
  const banned = new RegExp(`p${"y"}me?s?`, "i");
  for (const file of files) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.equal(banned.test(text), false, file);
  }
});

test("normaliza correos y direcciones", () => {
  assert.equal(normalizeEmail("  Hola@Empresa.com "), "hola@empresa.com");
  assert.equal(normalizeEmail("no-es-correo"), null);
  assert.equal(optionalWebsite(""), null);
  assert.equal(optionalWebsite("kvikklab.com"), "https://kvikklab.com");
  assert.equal(optionalWebsite("javascript:alert(1)"), "invalid");
  assert.equal(isSafeHttpUrl("https://kvikklab.com/#cotizador"), true);
});
