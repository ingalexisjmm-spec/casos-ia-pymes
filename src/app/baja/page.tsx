import type { Metadata } from "next";
import { Suspense } from "react";

import { UnsubscribeForm } from "@/components/unsubscribe-form";

export const metadata: Metadata = {
  title: "Salir del boletín",
  robots: { index: false, follow: false },
};

export default function BajaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <div className="shell max-w-xl py-10">
      <h1>Salir de la lista</h1>
      <p className="lede">Si este enlace es de un correo nuestro, confirma y dejamos de escribirte.</p>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Cargando…</p>}>
        <UnsubscribeGate searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function UnsubscribeGate({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <UnsubscribeForm token={token ?? ""} />;
}
