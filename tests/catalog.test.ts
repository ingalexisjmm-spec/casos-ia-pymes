import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedUseCases } from "../src/data/use-cases";
import { CATEGORIES } from "../src/lib/types";
import { isSafeHttpUrl, normalizeEmail, optionalWebsite } from "../src/lib/validators";

const categoryIds = new Set(CATEGORIES.map((item) => item.id));

const sourcedCases = new Map<string, string>([
  [
    "leer-audios-de-clientes",
    "https://faq.whatsapp.com/241617298315321/?cms_platform=android&locale=es_ES",
  ],
  ["preguntar-manuales-de-proveedores", "https://support.google.com/notebooklm/answer/16215270"],
  ["fondo-limpio-fotos-de-producto", "https://www.canva.com/help/background-remover/"],
  ["resumir-respuestas-abiertas", "https://support.google.com/docs/answer/16231981"],
]);

test("el directorio tiene 26 fichas únicas", () => {
  assert.equal(seedUseCases.length, 26);
  const slugs = new Set(seedUseCases.map((item) => item.slug));
  assert.equal(slugs.size, seedUseCases.length);
});

test("cada ficha tiene texto, herramientas y un slug válido", () => {
  for (const item of seedUseCases) {
    assert.ok(item.summary.length > 40);
    assert.ok(item.body.includes("\n\n"));
    assert.ok(item.tools.length > 0);
    assert.ok(item.categories.every((category) => categoryIds.has(category)));
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(item.body.toLowerCase().includes("pyme"), false, item.slug);
  }
});

test("las fichas de ejemplo no inventan una fuente", () => {
  const examples = seedUseCases.filter((item) => item.isSeed);
  assert.equal(examples.length, 22);
  for (const item of examples) {
    assert.equal(item.sourceUrl, null);
  }
});

test("las cuatro fichas nuevas citan la ayuda oficial y no son ejemplo inicial", () => {
  const sourced = seedUseCases.filter((item) => item.sourceUrl);
  assert.equal(sourced.length, 4);
  for (const item of sourced) {
    assert.equal(item.isSeed, false);
    assert.equal(item.sourceUrl, sourcedCases.get(item.slug));
    assert.equal(isSafeHttpUrl(item.sourceUrl ?? ""), true);
  }
});

test("la ficha y el directorio muestran la fuente en una pestaña nueva", () => {
  const page = readFileSync(new URL("../src/app/casos/[slug]/page.tsx", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../src/components/use-case-explorer.tsx", import.meta.url), "utf8");
  for (const source of [page, explorer]) {
    assert.match(source, /item\.sourceUrl/);
    assert.match(source, /Fuente/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /noopener/);
  }
});

test("la semilla sql coincide con las 26 fichas", () => {
  const sql = readFileSync(new URL("../supabase/seed.sql", import.meta.url), "utf8");
  assert.equal(sql.match(/, null, true\)/g)?.length, 22);
  assert.equal(sql.match(/, false\)/g)?.length, 4);
  for (const [slug, url] of sourcedCases) {
    assert.equal(sql.includes(`'${slug}'`), true);
    assert.equal(sql.includes(`'${url}'`), true);
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
