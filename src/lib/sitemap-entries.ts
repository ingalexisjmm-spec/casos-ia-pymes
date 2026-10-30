import type { UseCase } from "@/lib/types";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
};

export function caseLastModified(item: UseCase, contentDate: Date): Date {
  if (!item.updatedAt) return contentDate;
  const parsed = new Date(item.updatedAt);
  return Number.isNaN(parsed.getTime()) ? contentDate : parsed;
}

export function buildSitemapEntries({
  cases,
  toAbsoluteUrl,
  staticPages,
  casesContentDate,
}: {
  cases: readonly UseCase[];
  toAbsoluteUrl: (path: string) => string;
  staticPages: readonly { path: string; lastModified: Date }[];
  casesContentDate: Date;
}): SitemapEntry[] {
  const pages = staticPages.map((page) => ({
    url: toAbsoluteUrl(page.path),
    lastModified: page.lastModified,
  }));
  const fichas = cases.map((item) => ({
    url: toAbsoluteUrl(`/casos/${item.slug}`),
    lastModified: caseLastModified(item, casesContentDate),
  }));
  return [...pages, ...fichas];
}
