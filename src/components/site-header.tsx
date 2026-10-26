import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="prose-width flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-baseline gap-2 text-foreground">
          <span className="font-serif text-2xl tracking-tight">{SITE_NAME.replace(" IA", "")}</span>
          <span className="border border-foreground px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.14em]">
            IA
          </span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-5 text-sm">
          <Link href="/" className="hover:text-pine">
            Directorio
          </Link>
          <Link href="/patrocinio" className="hover:text-pine">
            Patrocinio
          </Link>
        </nav>
      </div>
    </header>
  );
}
