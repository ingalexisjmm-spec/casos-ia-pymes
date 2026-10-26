import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-16">
      <h1>No encontramos esa página</h1>
      <p className="lede">Puede que la ficha ya no esté publicada o que el enlace esté incompleto.</p>
      <Link href="/" className="btn btn-accent mt-5">
        Volver al directorio
      </Link>
    </div>
  );
}
