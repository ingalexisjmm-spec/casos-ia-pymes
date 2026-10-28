import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-16">
      <h1>No encontramos esa página</h1>
      <p className="lede">Puede que la ficha ya no esté publicada o que el enlace esté incompleto.</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link href="/" className="btn btn-accent">
          Volver al directorio
        </Link>
        <Link href="/casos" className="link">
          Ver todos los casos
        </Link>
      </div>
    </div>
  );
}
