import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { getCatalog, getRelatedCases, getUseCase } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { categoryLabel, difficultyLabel } from "@/lib/validators";

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getUseCase(slug);
  if (!item) return { title: "Ficha no encontrada" };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/casos/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: `/casos/${item.slug}`,
    },
  };
}

export default function CasoPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="prose-width py-16 text-muted">Cargando ficha…</p>}>
      <CasoBody params={params} />
    </Suspense>
  );
}

async function CasoBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getUseCase(slug);
  if (!item) notFound();
  const related = await getRelatedCases(item);

  return (
    <article className="prose-width py-14 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: item.title,
          description: item.summary,
          inLanguage: "es",
          url: absoluteUrl(`/casos/${item.slug}`),
          isPartOf: { "@type": "WebSite", name: "Casos IA", url: absoluteUrl("/") },
        }}
      />
      <p className="label">
        <Link href="/" className="hover:text-pine">
          directorio
        </Link>
      </p>
      <p className="label mt-8">
        {item.categories.map((id) => categoryLabel(id)).join(" · ")}
        {" · "}
        {difficultyLabel(item.difficulty)}
        {item.isSeed ? " · ejemplo inicial" : ""}
      </p>
      <h1 className="mt-3 max-w-3xl">{item.title}</h1>
      <p className="lede">{item.summary}</p>
      {item.isSeed ? (
        <p className="note">
          Ejemplo inicial. Describe una forma de trabajar, no el resultado de un negocio real.
        </p>
      ) : null}
      <div className="reading mt-8">
        <Prose text={item.body} />
      </div>
      <dl className="mt-10 grid max-w-2xl gap-6 border-t border-line pt-6 text-[0.95rem] sm:grid-cols-2">
        <div>
          <dt className="label">herramientas</dt>
          <dd className="mt-1">{item.tools.join(", ")}</dd>
        </div>
        <div>
          <dt className="label">dificultad</dt>
          <dd className="mt-1">{difficultyLabel(item.difficulty)}</dd>
        </div>
        {item.sourceUrl ? (
          <div className="sm:col-span-2">
            <dt className="label">fuente</dt>
            <dd className="mt-1">
              <a href={item.sourceUrl} className="underline hover:text-pine" rel="nofollow noopener noreferrer">
                {item.sourceUrl}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      {related.length > 0 ? (
        <section className="mt-14 max-w-2xl" aria-labelledby="relacionados">
          <h2 id="relacionados">También en este tema</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {related.map((candidate) => (
              <li key={candidate.slug}>
                <Link href={`/casos/${candidate.slug}`} className="block py-3 hover:text-pine">
                  {candidate.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
