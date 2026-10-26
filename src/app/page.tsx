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
      <section className="prose-width pt-14 pb-10 sm:pt-20">
        <p className="label">directorio · {catalog.cases.length} fichas</p>
        <h1 className="mt-4 max-w-3xl">Usos de IA para negocios</h1>
        <p className="lede">
          Ideas concretas para emprendedores y equipos. Cada ficha dice qué problema resuelve, qué herramientas usa y qué tan difícil es empezar.
        </p>
        <p className="mt-5">
          <a href="#boletin" className="font-medium text-pine underline decoration-line underline-offset-4">
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
      <p className="note">
        La base está conectada y todavía no hay fichas publicadas. Carga el contenido inicial con el archivo de semilla.
      </p>
    );
  }

  if (notice === "local-examples") {
    return (
      <p className="note">
        Estás viendo los ejemplos iniciales del proyecto. No son casos de un cliente. Al conectar Supabase, el directorio lee la tabla de fichas.
      </p>
    );
  }

  return null;
}
