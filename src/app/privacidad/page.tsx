import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Qué datos guarda Casos IA cuando te apuntas al boletín o compras un patrocinio.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <article className="reading shell py-10">
      <h1>Privacidad</h1>
      <div className="mt-8">
        <p>
          {SITE_NAME} guarda el correo de quien se apunta al boletín, y el nombre, el correo, el sitio y la frase de quien compra un patrocinio.
        </p>
        <p>
          El correo del boletín se usa para enviar notas del directorio. Puedes salir de la lista con el enlace de cada mensaje. No vendemos esa lista.
        </p>
        <p>
          El pago lo procesa Stripe. No guardamos el número de tarjeta. Stripe recibe los datos necesarios para cobrar.
        </p>
        <p>
          El sitio puede guardar el correo con Supabase y enviar mensajes con Resend. Esas herramientas procesan los datos para prestar el servicio.
        </p>
        <p>
          Las fichas marcadas como ejemplo inicial son texto de arranque. No describen a una persona o a un negocio identificable.
        </p>
      </div>
    </article>
  );
}
