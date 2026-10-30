import { cacheLife, cacheTag } from "next/cache";

import { seedUseCases } from "@/data/use-cases";
import { pickRelatedCases } from "@/lib/related";
import type { Catalog, SponsorListing, UseCase } from "@/lib/types";
import { createReadClient, hasSupabaseConfig } from "@/lib/supabase";
import { isCategoryId, isDifficulty, isSafeHttpUrl } from "@/lib/validators";

const CATALOG_LIFE = {
  stale: 60 * 60,
  revalidate: 60 * 15,
  expire: 60 * 60 * 24,
} as const;

type UseCaseRow = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  categories: string[] | null;
  tools: string[] | null;
  difficulty: string;
  source_url: string | null;
  is_seed: boolean;
  updated_at: string | null;
};

function mapRow(row: UseCaseRow): UseCase | null {
  if (!isDifficulty(row.difficulty)) return null;
  const categories = (row.categories ?? []).filter(isCategoryId);
  if (categories.length === 0) return null;
  const sourceUrl = row.source_url && isSafeHttpUrl(row.source_url) ? row.source_url : null;
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    categories,
    tools: (row.tools ?? []).map((tool) => tool.trim()).filter(Boolean),
    difficulty: row.difficulty,
    sourceUrl,
    isSeed: row.is_seed,
    updatedAt: timestamp(row.updated_at),
  };
}

function timestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife(CATALOG_LIFE);
  cacheTag("use-cases");

  if (!hasSupabaseConfig()) {
    return { cases: seedUseCases, source: "seed", notice: "local-examples" };
  }

  const supabase = createReadClient();
  if (!supabase) {
    return { cases: seedUseCases, source: "seed", notice: "local-examples" };
  }

  const { data, error } = await supabase
    .from("use_cases")
    .select("slug, title, summary, body, categories, tools, difficulty, source_url, is_seed, updated_at")
    .eq("published", true)
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`No se pudo leer use_cases (${error.code ?? "sin código"}).`);
  }

  const cases = (data ?? [])
    .map((row) => mapRow(row as UseCaseRow))
    .filter((item): item is UseCase => item !== null);

  return { cases, source: "supabase", notice: null };
}

export async function getUseCase(slug: string): Promise<UseCase | null> {
  const catalog = await getCatalog();
  return catalog.cases.find((item) => item.slug === slug) ?? null;
}

export async function getRelatedCases(item: UseCase): Promise<UseCase[]> {
  const catalog = await getCatalog();
  return pickRelatedCases(item, catalog.cases);
}

type SponsorRow = {
  id: string;
  name: string;
  website_url: string | null;
  blurb: string;
};

export async function getSponsorListings(): Promise<SponsorListing[]> {
  "use cache";
  cacheLife(CATALOG_LIFE);
  cacheTag("sponsors");

  if (!hasSupabaseConfig()) return [];

  const supabase = createReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("sponsor_listings")
    .select("id, name, website_url, blurb")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("No se pudieron leer los patrocinios públicos", error.code);
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const sponsor = row as SponsorRow;
      const website = sponsor.website_url && isSafeHttpUrl(sponsor.website_url) ? sponsor.website_url : null;
      return {
        id: sponsor.id,
        name: sponsor.name,
        websiteUrl: website,
        blurb: sponsor.blurb,
      };
    })
    .filter((sponsor) => sponsor.name && sponsor.blurb);
}
