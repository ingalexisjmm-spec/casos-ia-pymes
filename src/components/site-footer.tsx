import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { KVIKK_QUOTE_URL, KVIKK_URL, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="prose-width grid gap-10 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-serif text-3xl tracking-tight text-balance">
            ¿Quieres que te armemos el agente?
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">
            Si viste un caso parecido al tuyo, cuéntanos el proceso. Es el cotizador de Kvikk Lab, el estudio detrás de {SITE_NAME}.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={KVIKK_QUOTE_URL}
              className="bg-pine px-4 py-2 text-sm font-semibold text-white hover:bg-pine-ink"
            >
              Ir al cotizador
            </a>
            <a
              href={KVIKK_URL}
              className="border border-line bg-card px-4 py-2 text-sm font-semibold hover:border-foreground"
            >
              kvikklab.com
            </a>
          </div>
        </div>
        <div id="boletin">
          <h2 className="text-sm font-semibold tracking-wide text-foreground">Boletín</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Notas cortas sobre usos de IA para negocios. Sin promesas de resultados.
          </p>
          <div className="mt-4">
            <NewsletterForm source="footer" />
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="prose-width flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-muted">
          <p>{SITE_NAME}</p>
          <nav aria-label="Pie" className="flex gap-4">
            <Link href="/privacidad" className="hover:text-foreground">
              Privacidad
            </Link>
            <Link href="/patrocinio" className="hover:text-foreground">
              Patrocinio
            </Link>
            <a href={KVIKK_URL} className="hover:text-foreground">
              Kvikk Lab
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
