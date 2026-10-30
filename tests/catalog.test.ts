import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { seedUseCases } from "../src/data/use-cases";
import { buildCaseMetadata } from "../src/lib/case-metadata";
import { pickRelatedCases, RELATED_CASE_LIMIT } from "../src/lib/related";
import { SHARE_IMAGE_PATH } from "../src/lib/share-image";
import { buildSitemapEntries, caseLastModified } from "../src/lib/sitemap-entries";
import { sourceLastModified } from "../src/lib/source-date";
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
    "src/app/casos/page.tsx",
    "src/app/casos/[slug]/page.tsx",
    "src/app/layout.tsx",
    "src/app/not-found.tsx",
    "src/app/patrocinio/page.tsx",
    "src/app/sitemap.ts",
    "src/components/site-header.tsx",
    "src/components/site-footer.tsx",
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

test("el índice /casos lista las fichas y entra en el sitemap", () => {
  const page = readFileSync(new URL("../src/app/casos/page.tsx", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  const header = readFileSync(new URL("../src/components/site-header.tsx", import.meta.url), "utf8");
  const home = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const ficha = readFileSync(new URL("../src/app/casos/[slug]/page.tsx", import.meta.url), "utf8");

  assert.match(page, /Todos los casos de uso de IA para negocios/);
  assert.match(page, /canonical: "\/casos"/);
  assert.match(page, /item\.summary/);
  assert.match(page, /href=\{`\/casos\/\$\{item\.slug\}`\}/);
  assert.match(sitemap, /"\/casos"/);
  assert.match(header, /href="\/casos"/);
  assert.match(home, /href="\/casos"/);
  assert.match(ficha, /BreadcrumbList/);
  assert.match(ficha, /absoluteUrl\("\/casos"\)/);
  assert.match(ficha, /getRelatedCases/);
  assert.match(ficha, /También en este tema/);
  assert.match(ficha, /buildCaseMetadata/);
  assert.match(page, /id="lista-completa"/);
  assert.match(page, /id="por-tema"/);
  assert.match(page, /id="por-dificultad"/);
  assert.match(page, /CATEGORIES\.map/);
  assert.match(page, /DIFFICULTIES\.map/);
  assert.match(sitemap, /lastModified/);
  assert.match(sitemap, /sourceLastModified/);
});

test("cada ficha publica su propio título y descripción en Twitter y una imagen", () => {
  for (const item of seedUseCases) {
    const metadata = buildCaseMetadata(item);
    const ogTitle = metadata.openGraph?.title;
    const ogDescription = metadata.openGraph?.description;
    assert.equal(ogTitle, item.title);
    assert.equal(ogDescription, item.summary);
    assert.equal(metadata.twitter?.title, ogTitle);
    assert.equal(metadata.twitter?.description, ogDescription);
    const ogImages = metadata.openGraph?.images;
    const twitterImages = metadata.twitter?.images;
    assert.ok(Array.isArray(ogImages) && ogImages.length > 0, item.slug);
    assert.ok(Array.isArray(twitterImages) && twitterImages.length > 0, item.slug);
    assert.equal(imageUrl(ogImages[0]), SHARE_IMAGE_PATH);
    assert.equal(imageUrl(twitterImages[0]), SHARE_IMAGE_PATH);
  }

  const custom = buildCaseMetadata({
    ...seedUseCases[0],
    shareImageUrl: "https://cdn.example/ficha.png",
  });
  const customImages = custom.openGraph?.images;
  const customTwitter = custom.twitter?.images;
  assert.ok(Array.isArray(customImages));
  assert.ok(Array.isArray(customTwitter));
  assert.equal(imageUrl(customImages[0]), "https://cdn.example/ficha.png");
  assert.equal(imageUrl(customTwitter[0]), "https://cdn.example/ficha.png");
});

test("las fichas relacionadas suben de tres a un máximo de seis del mismo tema", () => {
  assert.equal(RELATED_CASE_LIMIT, 6);
  for (const item of seedUseCases) {
    const related = pickRelatedCases(item, seedUseCases);
    const possible = seedUseCases.filter(
      (candidate) =>
        candidate.slug !== item.slug &&
        candidate.categories.some((category) => item.categories.includes(category)),
    ).length;
    assert.equal(related.length, Math.min(RELATED_CASE_LIMIT, possible), item.slug);
    assert.ok(related.every((candidate) => candidate.slug !== item.slug));
    assert.ok(
      related.every((candidate) => candidate.categories.some((category) => item.categories.includes(category))),
    );
  }

  const whatsapp = seedUseCases.find((item) => item.slug === "whatsapp-fuera-de-horario");
  assert.ok(whatsapp);
  const related = pickRelatedCases(whatsapp, seedUseCases);
  assert.ok(related.length >= 5 && related.length <= 6);
  assert.equal(related[0]?.slug, "leer-audios-de-clientes");
  assert.equal(related[1]?.slug, "seguimiento-despues-de-la-compra");
});

test("el sitemap lleva lastmod en cada URL", () => {
  const contentDate = new Date("2026-10-28T17:55:00.000Z");
  const homeDate = new Date("2026-10-27T12:00:00.000Z");
  const updated = new Date("2026-10-01T08:30:00.000Z");
  const entries = buildSitemapEntries({
    toAbsoluteUrl: (path) => `https://casos-ia.example${path}`,
    staticPages: [{ path: "/", lastModified: homeDate }],
    casesContentDate: contentDate,
    cases: [
      seedUseCases[0],
      { ...seedUseCases[1], updatedAt: updated.toISOString() },
      { ...seedUseCases[2], updatedAt: "no-es-fecha" },
    ],
  });
  assert.equal(entries.length, 4);
  assert.ok(entries.every((entry) => entry.lastModified instanceof Date && !Number.isNaN(entry.lastModified.getTime())));
  assert.equal(entries[0]?.url, "https://casos-ia.example/");
  assert.equal(entries[0]?.lastModified.toISOString(), homeDate.toISOString());
  assert.equal(entries[1]?.lastModified.toISOString(), contentDate.toISOString());
  assert.equal(entries[2]?.lastModified.toISOString(), updated.toISOString());
  assert.equal(caseLastModified({ ...seedUseCases[2], updatedAt: "no-es-fecha" }, contentDate).toISOString(), contentDate.toISOString());
});

test("la fecha de las fuentes del sitio es una fecha real", () => {
  const date = sourceLastModified("src/data/use-cases.ts");
  assert.equal(Number.isNaN(date.getTime()), false);
  assert.ok(date.getTime() <= Date.now());
});

function imageUrl(image: unknown): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  if (image instanceof URL) return image.toString();
  if (typeof image === "object" && "url" in image) {
    const url = image.url;
    if (typeof url === "string") return url;
    if (url instanceof URL) return url.toString();
  }
  return undefined;
}

test("normaliza correos y direcciones", () => {
  assert.equal(normalizeEmail("  Hola@Empresa.com "), "hola@empresa.com");
  assert.equal(normalizeEmail("no-es-correo"), null);
  assert.equal(optionalWebsite(""), null);
  assert.equal(optionalWebsite("kvikklab.com"), "https://kvikklab.com");
  assert.equal(optionalWebsite("javascript:alert(1)"), "invalid");
  assert.equal(isSafeHttpUrl("https://kvikklab.com/#cotizador"), true);
});
