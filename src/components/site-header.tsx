"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  const path = usePathname();
  const onDirectory = path === "/" || path.startsWith("/casos");
  const onSponsor = path.startsWith("/patrocinio");

  return (
    <header className="site-header">
      <div className="shell flex items-center justify-between gap-4 py-3">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-foreground">
          {SITE_NAME}
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-4">
          <Link href="/" className="nav-link" aria-current={onDirectory ? "page" : undefined}>
            Directorio
          </Link>
          <Link href="/patrocinio" className="nav-link" aria-current={onSponsor ? "page" : undefined}>
            Patrocinio
          </Link>
        </nav>
      </div>
    </header>
  );
}
