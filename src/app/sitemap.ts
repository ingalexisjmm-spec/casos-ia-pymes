import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getCatalog } from "@/lib/catalog";
import { buildSitemapEntries } from "@/lib/sitemap-entries";
import { absoluteUrl } from "@/lib/site";
import { sourceLastModified } from "@/lib/source-date";

const STATIC_PAGES = [
  { path: "/", file: "src/app/page.tsx" },
  { path: "/casos", file: "src/app/casos/page.tsx" },
  { path: "/patrocinio", file: "src/app/patrocinio/page.tsx" },
  { path: "/privacidad", file: "src/app/privacidad/page.tsx" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Sin esto, Next deja sitemap.xml estático en el build. Las fichas
  // publicadas después no entran hasta el próximo deploy.
  await connection();
  const catalog = await getCatalog();
  return buildSitemapEntries({
    cases: catalog.cases,
    toAbsoluteUrl: absoluteUrl,
    staticPages: STATIC_PAGES.map((page) => ({
      path: page.path,
      lastModified: sourceLastModified(page.file),
    })),
    casesContentDate: sourceLastModified("src/data/use-cases.ts"),
  });
}
