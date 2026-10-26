import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";

import "./globals.css";

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — Usos de inteligencia artificial para negocios`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_419",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Usos de inteligencia artificial para negocios`,
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Usos de inteligencia artificial para negocios`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-card focus:px-3 focus:py-2"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
