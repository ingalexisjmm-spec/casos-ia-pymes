import type { Metadata } from "next";
import { Suspense } from "react";

import { SponsorForm } from "@/components/sponsor-form";
import { SPONSOR_PRICE_USD, stripeKeyMode } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patrocinio",
  description: `Espacio de patrocinio en Casos IA: ficha en el directorio y mención en el boletín, por USD ${SPONSOR_PRICE_USD}.`,
  alternates: { canonical: "/patrocinio" },
};

export default function PatrocinioPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const mode = stripeKeyMode();

  return (
    <div className="prose-width grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <p className="text-sm font-semibold tracking-[0.16em] text-pine uppercase">Patrocinio</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
          Un espacio en el directorio
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
          Para quien tiene un producto útil para negocios que están viendo cómo usar IA. El precio publicado es USD {SPONSOR_PRICE_USD}, pago único.
        </p>
        <ul className="mt-6 max-w-xl space-y-3 text-sm leading-6">
          <li className="border-t border-line pt-3">Ficha con tu nombre, un enlace y una frase.</li>
          <li className="border-t border-line pt-3">Mención en un envío del boletín.</li>
          <li className="border-t border-line pt-3">
            No incluye una cantidad prometida de visitas, clics o ventas.
          </li>
        </ul>
        {mode === "test" ? (
          <p className="mt-6 max-w-xl border border-line bg-highlight px-4 py-3 text-sm leading-6">
            La clave de Stripe es de prueba. Puedes recorrer el pago sin un cargo real.
          </p>
        ) : null}
        <Suspense fallback={null}>
          <CheckoutNotice searchParams={searchParams} />
        </Suspense>
      </div>
      <SponsorForm />
    </div>
  );
}

async function CheckoutNotice({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  if (estado === "pagado") {
    return (
      <p className="mt-6 max-w-xl border border-line bg-card px-4 py-3 text-sm leading-6" role="status">
        Stripe te devolvió a esta página. Publicamos la ficha cuando el pago queda confirmado. Volver aquí no basta: la confirmación llega por el webhook.
      </p>
    );
  }
  if (estado === "cancelado") {
    return (
      <p className="mt-6 max-w-xl border border-line bg-card px-4 py-3 text-sm leading-6" role="status">
        El pago se canceló. No registramos un cobro por esta vuelta.
      </p>
    );
  }
  return null;
}
