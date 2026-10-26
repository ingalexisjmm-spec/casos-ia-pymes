import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="prose-width flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-baseline gap-2 text-foreground">
          <span className="text-2xl font-medium tracking-tight">{SITE_NAME.replace(" IA", "")}</span>
          <span className="mark-ia">IA</span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-5 text-[0.95rem]">
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
