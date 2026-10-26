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

  function clearFilters() {
    setQuery("");
    setCategory("todas");
    setDifficulty("todas");
  }

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
      <div className="plate">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="directorio-titulo">Directorio</h2>
          <p className="label">
            {filtered.length} de {cases.length} {cases.length === 1 ? "ficha" : "fichas"}
          </p>
        </div>
        <div>
          <label htmlFor="buscar-casos" className="label">
            buscar
          </label>
          <input
            id="buscar-casos"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="WhatsApp, facturas, inventario…"
            className="field mt-2"
          />
        </div>
        <div>
          <p id="filtro-categoria" className="label">
            tema
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
          <p id="filtro-dificultad" className="label">
            dificultad
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
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Fácil: se prueba con herramientas que ya usas. Medio: hay que ordenar datos o revisar con más cuidado.
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>Ninguna ficha coincide con esa búsqueda.</p>
          <button type="button" className="btn btn-line mt-4" onClick={clearFilters}>
            Quitar filtros
          </button>
        </div>
      ) : (
        <ol className="mt-2 divide-y divide-line border-b border-line">
          {filtered.map((item, index) => (
            <li key={item.slug}>
              <Link href={`/casos/${item.slug}`} className="entry">
                <span className="index">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="label flex flex-wrap gap-x-3 gap-y-1">
                    <span>{item.categories.map((id) => categoryLabel(id)).join(" · ")}</span>
                    <span>{difficultyLabel(item.difficulty)}</span>
                    {item.isSeed ? <span className="text-clay">ejemplo inicial</span> : null}
                  </span>
                  <span className="entry-title">{item.title}</span>
                  <span className="mt-2 block max-w-2xl text-[0.98rem] leading-6 text-muted">{item.summary}</span>
                  <span className="mt-3 block text-[0.95rem]">{item.tools.join(" · ")}</span>
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
      className="chip"
    >
      {children}
    </button>
  );
}
