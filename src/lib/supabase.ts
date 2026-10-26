import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function serverClient(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function supabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

export function supabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
}

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl() && (supabaseAnonKey() || supabaseServiceRoleKey()));
}

/** Lectura pública. Prefiere la clave anon, sujeta a RLS. */
export function createReadClient(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = supabaseAnonKey() || supabaseServiceRoleKey();
  if (!url || !key) return null;
  return serverClient(url, key);
}

/** Escritura de boletín y patrocinios. Solo clave de servicio, solo en el servidor. */
export function createAdminClient(): SupabaseClient | null {
  const url = supabaseUrl();
  const key = supabaseServiceRoleKey();
  if (!url || !key) return null;
  return serverClient(url, key);
}
