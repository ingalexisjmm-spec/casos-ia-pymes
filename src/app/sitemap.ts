import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getCatalog } from "@/lib/catalog";
import { buildSitemapEntries } from "@/lib/sitemap-entries";
import { SITEMAP_CASE_FALLBACK_LAST_MODIFIED, STATIC_SITEMAP_PAGES } from "@/lib/sitemap-static";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Sin esto, Next deja sitemap.xml estático en el build. Las fichas
  // publicadas después no entran hasta el próximo deploy.
  await connection();
  const catalog = await getCatalog();
  return buildSitemapEntries({
    cases: catalog.cases,
    toAbsoluteUrl: absoluteUrl,
    staticPages: STATIC_SITEMAP_PAGES,
    casesContentDate: SITEMAP_CASE_FALLBACK_LAST_MODIFIED,
  });
}
