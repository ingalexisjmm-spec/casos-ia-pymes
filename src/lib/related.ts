import type { UseCase } from "@/lib/types";

/** Tope de fichas relacionadas en cada caso. Antes eran tres. */
export const RELATED_CASE_LIMIT = 6;

/**
 * Fichas que comparten tema, las más cercanas primero.
 * Si un tema tiene menos de seis, se muestran las que hay.
 */
export function pickRelatedCases(item: UseCase, cases: readonly UseCase[]): UseCase[] {
  return cases
    .filter((candidate) => candidate.slug !== item.slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.categories.filter((category) => item.categories.includes(category)).length,
      sameDifficulty: candidate.difficulty === item.difficulty ? 1 : 0,
    }))
    .filter((row) => row.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.sameDifficulty - a.sameDifficulty ||
        a.candidate.title.localeCompare(b.candidate.title, "es"),
    )
    .slice(0, RELATED_CASE_LIMIT)
    .map((row) => row.candidate);
}
