import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { join } from "node:path";

/**
 * Fecha de la última edición del archivo.
 * Prefiere el commit de git. Si no hay historia, usa la fecha del archivo en disco.
 */
export function sourceLastModified(relativePath: string): Date {
  const fromGit = gitCommitDate(relativePath);
  if (fromGit) return fromGit;
  return statSync(join(/*turbopackIgnore: true*/ process.cwd(), relativePath)).mtime;
}

function gitCommitDate(relativePath: string): Date | null {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", relativePath], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (!iso) return null;
    const parsed = new Date(iso);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}
