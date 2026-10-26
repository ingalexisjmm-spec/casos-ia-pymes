import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose-width py-20">
      <p className="text-sm font-semibold tracking-[0.16em] text-pine uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">No encontramos esa página</h1>
      <p className="mt-4 max-w-md text-muted">Puede que la ficha ya no esté publicada o que el enlace esté incompleto.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold underline">
        Volver al directorio
      </Link>
    </div>
  );
}
