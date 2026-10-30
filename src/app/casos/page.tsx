import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { getCatalog } from "@/lib/catalog";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { CATEGORIES, DIFFICULTIES, type UseCase } from "@/lib/types";

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
          <nav aria-label="En esta página" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href="#lista-completa" className="link">
              Lista completa
            </a>
            <a href="#por-tema" className="link">
              Por tema
            </a>
            <a href="#por-dificultad" className="link">
              Por dificultad
            </a>
          </nav>
          <section className="mt-10" aria-labelledby="lista-completa">
            <h2 id="lista-completa" className="scroll-mt-20">
              Lista completa
            </h2>
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
          </section>
          <section className="mt-14" aria-labelledby="por-tema">
            <h2 id="por-tema" className="scroll-mt-20">
              Por tema
            </h2>
            {CATEGORIES.map((category) => {
              const items = cases.filter((item) => item.categories.includes(category.id));
              if (items.length === 0) return null;
              const headingId = `tema-${category.id}`;
              return (
                <section key={category.id} className="mt-8" aria-labelledby={headingId}>
                  <h3 id={headingId}>{category.label}</h3>
                  <p className="nums mt-1 text-sm text-muted">{fichaCount(items.length)}</p>
                  <CaseLinkList items={items} />
                </section>
              );
            })}
          </section>
          <section className="mt-14" aria-labelledby="por-dificultad">
            <h2 id="por-dificultad" className="scroll-mt-20">
              Por dificultad
            </h2>
            {DIFFICULTIES.map((level) => {
              const items = cases.filter((item) => item.difficulty === level.id);
              if (items.length === 0) return null;
              const headingId = `dificultad-${level.id}`;
              return (
                <section key={level.id} className="mt-8" aria-labelledby={headingId}>
                  <h3 id={headingId}>{level.label}</h3>
                  <p className="nums mt-1 text-sm text-muted">{fichaCount(items.length)}</p>
                  <CaseLinkList items={items} />
                </section>
              );
            })}
          </section>
        </>
      )}
    </article>
  );
}

function fichaCount(count: number): string {
  return `${count} ${count === 1 ? "ficha" : "fichas"}`;
}

function CaseLinkList({ items }: { items: UseCase[] }) {
  return (
    <ul className="mt-3 border-t border-line">
      {items.map((item) => (
        <li key={item.slug} className="border-b border-line">
          <Link href={`/casos/${item.slug}`} className="block py-2.5 text-sm font-semibold hover:text-accent-ink">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
