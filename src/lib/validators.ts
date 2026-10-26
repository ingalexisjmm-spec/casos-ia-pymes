import { CATEGORIES, DIFFICULTIES, type CategoryId, type Difficulty } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const categoryIds = new Set<string>(CATEGORIES.map((item) => item.id));
const difficultyIds = new Set<string>(DIFFICULTIES.map((item) => item.id));

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (email.includes("..")) return null;
  if (!EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function cleanLine(value: string, max: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.username || url.password) return false;
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function optionalWebsite(value: string): string | null | "invalid" {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > 300) return "invalid";
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  if (!isSafeHttpUrl(withProtocol)) return "invalid";
  return withProtocol;
}

export function isCategoryId(value: string): value is CategoryId {
  return categoryIds.has(value);
}

export function isDifficulty(value: string): value is Difficulty {
  return difficultyIds.has(value);
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((item) => item.id === id)?.label ?? id;
}

export function difficultyLabel(id: Difficulty): string {
  return DIFFICULTIES.find((item) => item.id === id)?.label ?? id;
}
