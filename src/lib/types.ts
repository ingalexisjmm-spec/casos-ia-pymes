export const CATEGORIES = [
  { id: "ventas", label: "Ventas" },
  { id: "marketing", label: "Marketing" },
  { id: "atencion", label: "Atención al cliente" },
  { id: "operaciones", label: "Operaciones" },
  { id: "finanzas", label: "Finanzas" },
  { id: "equipo", label: "Equipo" },
  { id: "administracion", label: "Administración" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const DIFFICULTIES = [
  { id: "facil", label: "Fácil" },
  { id: "medio", label: "Medio" },
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number]["id"];

export type UseCase = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  categories: CategoryId[];
  tools: string[];
  difficulty: Difficulty;
  sourceUrl: string | null;
  isSeed: boolean;
};

export type SponsorListing = {
  id: string;
  name: string;
  websiteUrl: string | null;
  blurb: string;
};

export type CatalogNotice = "local-examples" | "database-unavailable" | null;

export type Catalog = {
  cases: UseCase[];
  source: "seed" | "supabase";
  notice: CatalogNotice;
};
