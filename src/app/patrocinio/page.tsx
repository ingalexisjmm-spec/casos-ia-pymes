import type { Metadata } from "next";
import { Suspense } from "react";

import { SponsorForm } from "@/components/sponsor-form";
import { SPONSOR_PRICE_USD } from "@/lib/site";
import { stripeKeyMode } from "@/lib/stripe";

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
    <div className="shell grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <h1>Un espacio en el directorio</h1>
        <p className="lede">
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
          <p className="note">
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
      <p className="note" role="status">
        Stripe te devolvió a esta página. Publicamos la ficha cuando el pago queda confirmado. Volver aquí no basta: la confirmación llega por el webhook.
      </p>
    );
  }
  if (estado === "cancelado") {
    return (
      <p className="note" role="status">
        El pago se canceló. No registramos un cobro por esta vuelta.
      </p>
    );
  }
  return null;
}
