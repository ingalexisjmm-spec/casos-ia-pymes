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
    <Suspense fallback={<p className="shell py-16 text-muted">Cargando ficha…</p>}>
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
    <article className="shell py-10">
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Casos",
              item: absoluteUrl("/casos"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: item.title,
              item: absoluteUrl(`/casos/${item.slug}`),
            },
          ],
        }}
      />
      <nav aria-label="Ruta" className="mb-4 text-sm">
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          <li>
            <Link href="/casos" className="link font-normal">
              Casos
            </Link>
            <span aria-hidden="true" className="text-muted">
              {" "}
              /{" "}
            </span>
          </li>
          <li aria-current="page" className="text-muted">
            {item.title}
          </li>
        </ol>
      </nav>
      <h1 className="max-w-3xl">{item.title}</h1>
      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
        <span>{item.categories.map((id) => categoryLabel(id)).join(", ")}</span>
        <span>{difficultyLabel(item.difficulty)}</span>
        {item.isSeed ? <span>Ejemplo inicial</span> : null}
      </p>
      <p className="lede">{item.summary}</p>
      {item.isSeed ? (
        <p className="note">
          Ejemplo inicial. Describe una forma de trabajar, no el resultado de un negocio real.
        </p>
      ) : null}
      <div className="reading mt-8">
        <Prose text={item.body} />
      </div>
      <dl className="mt-8 grid max-w-2xl gap-5 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="field-label">Herramientas</dt>
          <dd className="mt-1">{item.tools.join(", ")}</dd>
        </div>
        <div>
          <dt className="field-label">Dificultad</dt>
          <dd className="mt-1">{difficultyLabel(item.difficulty)}</dd>
        </div>
        {item.sourceUrl ? (
          <div className="sm:col-span-2">
            <dt className="field-label">Fuente</dt>
            <dd className="mt-1">
              <a
                href={item.sourceUrl}
                className="link font-normal break-all"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
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
                <Link href={`/casos/${candidate.slug}`} className="block py-2.5 text-sm font-semibold hover:text-accent-ink">
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
