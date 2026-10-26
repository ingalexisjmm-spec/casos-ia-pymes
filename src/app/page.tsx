import { JsonLd } from "@/components/json-ld";
import { SponsorStrip } from "@/components/sponsor-strip";
import { UseCaseExplorer } from "@/components/use-case-explorer";
import { getCatalog, getSponsorListings } from "@/lib/catalog";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import type { CatalogNotice } from "@/lib/types";

export default async function HomePage() {
  const [catalog, sponsors] = await Promise.all([getCatalog(), getSponsorListings()]);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: absoluteUrl("/"),
          inLanguage: "es",
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: catalog.cases.length,
            itemListElement: catalog.cases.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/casos/${item.slug}`),
              name: item.title,
            })),
          },
        }}
      />
      <section className="prose-width py-12 sm:py-16">
        <p className="text-sm font-semibold tracking-[0.16em] text-pine uppercase">Directorio</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
          Usos de IA para negocios
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Ideas concretas para emprendedores y equipos. Cada ficha dice qué problema resuelve, qué herramientas usa y qué tan difícil es empezar.
        </p>
        <p className="mt-4 text-sm">
          <a href="#boletin" className="font-semibold underline decoration-line underline-offset-4 hover:text-pine">
            Recibir notas cortas por correo
          </a>
        </p>
        <Notice notice={catalog.notice} count={catalog.cases.length} source={catalog.source} />
      </section>
      <UseCaseExplorer cases={catalog.cases} />
      <SponsorStrip sponsors={sponsors} />
    </>
  );
}

function Notice({
  notice,
  count,
  source,
}: {
  notice: CatalogNotice;
  count: number;
  source: "seed" | "supabase";
}) {
  if (count === 0 && source === "supabase") {
    return (
      <p className="mt-6 max-w-2xl border border-line bg-highlight px-4 py-3 text-sm leading-6">
        La base está conectada y todavía no hay fichas publicadas. Carga el contenido inicial con el archivo de semilla.
      </p>
    );
  }

  if (notice === "local-examples") {
    return (
      <p className="mt-6 max-w-2xl border border-line bg-highlight px-4 py-3 text-sm leading-6">
        Estás viendo los ejemplos iniciales del proyecto. No son casos de un cliente. Al conectar Supabase, el directorio lee la tabla de fichas.
      </p>
    );
  }

  return null;
}
