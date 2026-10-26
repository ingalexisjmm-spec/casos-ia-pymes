import "server-only";

function trimmed(value: string | undefined): string {
  return value?.trim() ?? "";
}

/**
 * Si las dos partes tienen valor, las concatena sin separador.
 * Si falta alguna, usa el valor completo.
 */
export function resolveSplitSecret(
  part1: string | undefined,
  part2: string | undefined,
  fallback: string | undefined,
): string {
  const left = trimmed(part1);
  const right = trimmed(part2);
  if (left && right) return left + right;
  return trimmed(fallback);
}

export function stripeSecretKey(): string {
  return resolveSplitSecret(
    process.env.CASOS_SK_1,
    process.env.CASOS_SK_2,
    process.env.STRIPE_SECRET_KEY,
  );
}

export function supabaseServiceRoleSecret(): string {
  return resolveSplitSecret(
    process.env.CASOS_SR_1,
    process.env.CASOS_SR_2,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
