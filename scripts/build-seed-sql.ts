import { writeFileSync } from "node:fs";

import { seedUseCases } from "../src/data/use-cases";

function quote(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function textArray(values: readonly string[]): string {
  return `array[${values.map((value) => quote(value)).join(", ")}]::text[]`;
}

const rows = seedUseCases.map((item) => {
  return `  (${quote(item.slug)}, ${quote(item.title)}, ${quote(item.summary)}, ${quote(item.body)}, ${textArray(item.categories)}, ${textArray(item.tools)}, ${quote(item.difficulty)}, null, true)`;
});

const sql = `-- Contenido inicial de ejemplo.
-- No son casos de clientes ni resultados medidos.
-- Se genera desde src/data/use-cases.ts con: npm run db:seed-sql

insert into public.use_cases (
  slug,
  title,
  summary,
  body,
  categories,
  tools,
  difficulty,
  source_url,
  is_seed
) values
${rows.join(",\n")}
on conflict (slug) do nothing;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql, "utf8");
console.log(`Escribí ${seedUseCases.length} fichas en supabase/seed.sql`);
