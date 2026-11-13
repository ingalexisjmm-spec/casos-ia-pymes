/**
 * Fechas de las rutas que no salen de la base.
 * Van fijas en el bundle: el sitemap se arma en cada request y en ese
 * runtime no están los archivos fuente, así que no se puede mirar su mtime.
 * Si cambia una de estas páginas, actualiza aquí la fecha del commit.
 */
export const SITEMAP_CASE_FALLBACK_LAST_MODIFIED = new Date("2026-11-02T14:14:45.000Z");

export const STATIC_SITEMAP_PAGES: readonly { path: string; lastModified: Date }[] = [
  { path: "/", lastModified: new Date("2026-10-28T20:18:01.000Z") },
  { path: "/casos", lastModified: new Date("2026-11-02T14:14:52.000Z") },
  { path: "/patrocinio", lastModified: new Date("2026-10-26T12:49:37.000Z") },
  { path: "/privacidad", lastModified: new Date("2026-10-26T02:09:12.000Z") },
];
