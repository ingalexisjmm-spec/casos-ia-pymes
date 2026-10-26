"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CATEGORIES, DIFFICULTIES, type CategoryId, type Difficulty, type UseCase } from "@/lib/types";
import { categoryLabel, difficultyLabel } from "@/lib/validators";

type CategoryFilter = CategoryId | "todas";
type DifficultyFilter = Difficulty | "todas";

export function UseCaseExplorer({ cases }: { cases: UseCase[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("todas");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((item) => {
      if (category !== "todas" && !item.categories.includes(category)) return false;
      if (difficulty !== "todas" && item.difficulty !== difficulty) return false;
      if (!q) return true;
      const haystack = [item.title, item.summary, item.tools.join(" "), item.body]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [cases, category, difficulty, query]);

  return (
    <section className="prose-width pb-8" aria-labelledby="directorio-titulo">
      <div className="flex flex-col gap-4 border-b border-line pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="directorio-titulo" className="font-serif text-2xl tracking-tight">
            Directorio
          </h2>
          <p className="text-sm text-muted">
            {filtered.length} de {cases.length} {cases.length === 1 ? "ficha" : "fichas"}
          </p>
        </div>
        <div>
          <label htmlFor="buscar-casos" className="text-sm font-medium">
            Buscar
          </label>
          <input
            id="buscar-casos"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="WhatsApp, facturas, inventario…"
            className="mt-1 w-full border border-line bg-card px-3 py-2 text-base"
          />
        </div>
        <div>
          <p id="filtro-categoria" className="text-sm font-medium">
            Tema
          </p>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-labelledby="filtro-categoria">
            <FilterButton active={category === "todas"} onClick={() => setCategory("todas")}>
              Todos
            </FilterButton>
            {CATEGORIES.map((item) => (
              <FilterButton
                key={item.id}
                active={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </FilterButton>
            ))}
          </div>
        </div>
        <div>
          <p id="filtro-dificultad" className="text-sm font-medium">
            Dificultad
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="filtro-dificultad">
            <FilterButton active={difficulty === "todas"} onClick={() => setDifficulty("todas")}>
              Todas
            </FilterButton>
            {DIFFICULTIES.map((item) => (
              <FilterButton
                key={item.id}
                active={difficulty === item.id}
                onClick={() => setDifficulty(item.id)}
              >
                {item.label}
              </FilterButton>
            ))}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted">
            Fácil: se prueba con herramientas que ya usas. Medio: hay que ordenar datos o revisar con más cuidado.
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-muted">Ninguna ficha coincide con esa búsqueda.</p>
      ) : (
        <ol className="divide-y divide-line">
          {filtered.map((item, index) => (
            <li key={item.slug}>
              <Link
                href={`/casos/${item.slug}`}
                className="group grid gap-3 py-6 sm:grid-cols-[4rem_1fr] sm:gap-6"
              >
                <span className="font-serif text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tracking-wide text-muted uppercase">
                    <span>{item.categories.map((id) => categoryLabel(id)).join(" · ")}</span>
                    <span>{difficultyLabel(item.difficulty)}</span>
                    {item.isSeed ? <span className="text-clay normal-case tracking-normal">Ejemplo inicial</span> : null}
                  </span>
                  <span className="mt-2 block font-serif text-2xl tracking-tight group-hover:text-pine">
                    {item.title}
                  </span>
                  <span className="mt-2 block max-w-2xl text-sm leading-6 text-muted">{item.summary}</span>
                  <span className="mt-3 block text-sm text-foreground">
                    {item.tools.join(" · ")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "shrink-0 border border-foreground bg-foreground px-3 py-1.5 text-sm text-background"
          : "shrink-0 border border-line bg-card px-3 py-1.5 text-sm hover:border-foreground"
      }
    >
      {children}
    </button>
  );
}
