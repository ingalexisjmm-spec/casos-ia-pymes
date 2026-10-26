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
      <section className="shell pt-8 pb-2 sm:pt-10">
        <h1 className="max-w-3xl">Usos de IA para negocios</h1>
        <p className="lede">
          Ideas concretas para emprendedores y equipos. Cada ficha dice qué problema resuelve, qué herramientas usa y qué tan difícil es empezar.
        </p>
        <p className="mt-3">
          <a href="#boletin" className="link">
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
        Estás viendo el directorio guardado en el proyecto. Las fichas marcadas como ejemplo inicial no son casos de un cliente. Al conectar Supabase, el directorio lee la tabla de fichas.
      </p>
    );
  }

  return null;
}
