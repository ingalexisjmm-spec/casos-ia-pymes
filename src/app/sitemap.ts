import type { MetadataRoute } from "next";

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
