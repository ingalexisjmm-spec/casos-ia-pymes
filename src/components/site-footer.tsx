import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { KVIKK_QUOTE_URL, KVIKK_URL, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="prose-width grid gap-12 py-14 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="h2">¿Quieres que te armemos el agente?</p>
          <p className="mt-3 max-w-md text-[0.95rem] leading-6 text-muted">
            Si viste un caso parecido al tuyo, cuéntanos el proceso. Es el cotizador de Kvikk Lab, el estudio detrás de {SITE_NAME}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={KVIKK_QUOTE_URL} className="btn btn-olive">
              Ir al cotizador
            </a>
            <a href={KVIKK_URL} className="btn btn-line">
              kvikklab.com
            </a>
          </div>
        </div>
        <div id="boletin">
          <h2 className="label text-foreground">boletín</h2>
          <p className="mt-3 text-[0.95rem] leading-6 text-muted">
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
