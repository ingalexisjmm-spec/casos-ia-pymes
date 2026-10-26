import Link from "next/link";

export default function NotFound() {
  return (
    <div className="prose-width py-20">
      <p className="label">404</p>
      <h1 className="mt-4">No encontramos esa página</h1>
      <p className="lede">Puede que la ficha ya no esté publicada o que el enlace esté incompleto.</p>
      <Link href="/" className="btn btn-line mt-6">
        Volver al directorio
      </Link>
    </div>
  );
}
