import type { MetadataRoute } from "next";

import { getCatalog } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const staticRoutes = ["/", "/patrocinio", "/privacidad"].map((path) => ({
    url: absoluteUrl(path),
  }));
  const cases = catalog.cases.map((item) => ({
    url: absoluteUrl(`/casos/${item.slug}`),
  }));
  return [...staticRoutes, ...cases];
}
