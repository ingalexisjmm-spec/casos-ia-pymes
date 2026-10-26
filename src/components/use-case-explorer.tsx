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
    <section className="shell pb-8 pt-6" aria-labelledby="directorio-titulo">
      <div className="grid gap-6 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-10">
        <div className="grid content-start gap-4 lg:sticky lg:top-16">
          <div>
            <label htmlFor="buscar-casos" className="field-label">
              Buscar
            </label>
            <input
              id="buscar-casos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="WhatsApp, facturas, inventario…"
              className="field mt-1.5"
            />
          </div>
          <div>
            <p id="filtro-categoria" className="field-label">
              Tema
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 lg:flex-col lg:gap-0" role="group" aria-labelledby="filtro-categoria">
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
            <p id="filtro-dificultad" className="field-label">
              Dificultad
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 lg:flex-col lg:gap-0" role="group" aria-labelledby="filtro-dificultad">
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

        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
            <h2 id="directorio-titulo">Directorio</h2>
            <p className="nums text-sm text-muted">
              {filtered.length} de {cases.length} {cases.length === 1 ? "ficha" : "fichas"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="py-8">
              <p>Ninguna ficha coincide con esa búsqueda.</p>
              <button type="button" className="btn btn-line mt-3" onClick={clearFilters}>
                Quitar filtros
              </button>
            </div>
          ) : (
            <ol>
              {filtered.map((item) => (
                <li key={item.slug}>
                  <Link href={`/casos/${item.slug}`} className="entry">
                    <span className="entry-title">{item.title}</span>
                    <span className="mt-0.5 block text-sm leading-5 text-muted">{item.summary}</span>
                    <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] leading-5 text-muted">
                      <span>{item.categories.map((id) => categoryLabel(id)).join(", ")}</span>
                      <span>{difficultyLabel(item.difficulty)}</span>
                      {item.isSeed ? <span>Ejemplo inicial</span> : null}
                      <span>{item.tools.join(", ")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
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
    <button type="button" aria-pressed={active} onClick={onClick} className="filter">
      {children}
    </button>
  );
}
