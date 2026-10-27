import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const title = "Todos los casos de uso de IA para negocios";
const description =
  "Lista de todos los casos de uso de IA para negocios. Cada ficha indica el problema, las herramientas y la dificultad.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/casos" },
  openGraph: {
    title,
    description,
    url: "/casos",
  },
  twitter: {
    title,
    description,
  },
};

export default async function CasosIndexPage() {
  const catalog = await getCatalog();
  const cases = [...catalog.cases].sort((a, b) => a.title.localeCompare(b.title, "es"));

  return (
    <article className="shell py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: absoluteUrl("/casos"),
          inLanguage: "es",
          isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: cases.length,
            itemListElement: cases.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(`/casos/${item.slug}`),
              name: item.title,
            })),
          },
        }}
      />
      <h1 className="max-w-3xl">{title}</h1>
      <p className="lede">Cada ficha indica el problema, las herramientas y la dificultad.</p>
      <p className="mt-3">
        <Link href="/" className="link">
          Filtrar por tema o dificultad
        </Link>
      </p>
      {cases.length === 0 ? (
        <p className="note">Todavía no hay fichas publicadas.</p>
      ) : (
        <>
          <p className="nums mt-4 text-sm text-muted">
            {cases.length} {cases.length === 1 ? "ficha" : "fichas"}
          </p>
          <ol className="mt-4 border-t border-line">
            {cases.map((item) => (
              <li key={item.slug} className="entry">
                <Link href={`/casos/${item.slug}`} className="block">
                  <span className="entry-title">{item.title}</span>
                  <span className="mt-0.5 block text-sm leading-5 text-muted">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </article>
  );
}
