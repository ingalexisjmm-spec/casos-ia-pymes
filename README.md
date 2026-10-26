# Casos IA

Directorio en español de usos de inteligencia artificial para negocios. Cada ficha describe un problema, las herramientas y la dificultad. El contenido inicial es de ejemplo: no son casos de clientes y no trae métricas.

Hecho con Next.js (App Router), TypeScript y Tailwind. Pensado para desplegar en Vercel, con Supabase, Resend y Stripe.

El aspecto es un catálogo denso en sans: tinta casi negra, superficie fría y un solo acento azul (`#246BFF`). El detalle está en `DESIGN.md`. El scroll es el del navegador.

## Requisitos

- Node.js 22
- Una cuenta de Supabase, otra de Resend y otra de Stripe cuando quieras boletín y pagos
- El directorio se puede ver en local sin esas claves

## Arranque local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000. Sin variables, verás las fichas de ejemplo que viven en `src/data/use-cases.ts`.

```bash
npm test
npm run lint
npm run build
```

## Variables de entorno

Copia `.env.example` a `.env.local`. No subas `.env.local` ni claves reales.

| Variable | Dónde se usa | Obligatoria para |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Enlaces canónicos, sitemap, retornos de Stripe | Producción |
| `NEXT_PUBLIC_SUPABASE_URL` | Lectura y escritura | Directorio en vivo, boletín, patrocinio |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Lectura de fichas publicadas (RLS) | Directorio en vivo |
| `SUPABASE_SERVICE_ROLE_KEY` | Insertar suscriptores y patrocinios. Solo servidor | Boletín y patrocinio |
| `RESEND_API_KEY` | Envío de correos | Confirmación del boletín y recibo |
| `RESEND_FROM_EMAIL` | Remitente, por ejemplo `Casos IA <hola@tudominio.com>` | Los mismos correos |
| `STRIPE_SECRET_KEY` | Checkout. Puede ser una clave restringida `rk_` | Cobrar el patrocinio |
| `STRIPE_PRICE_ID` | Precio único de USD 500 | Recomendado |
| `STRIPE_PAYMENT_LINK` | Alternativa si no creas la sesión desde el servidor | Alternativa de cobro |
| `STRIPE_WEBHOOK_SECRET` | Verificar `checkout.session.*` | Publicar la ficha tras el pago |

Si hay `STRIPE_SECRET_KEY` y no hay `STRIPE_PRICE_ID`, el servidor crea la sesión con un importe de USD 500. El texto del sitio dice ese precio: el precio en Stripe tiene que coincidir.

`SUPABASE_SERVICE_ROLE_KEY` no lleva prefijo `NEXT_PUBLIC_`. Si se filtra, da acceso de escritura a la base.

## Supabase

1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard) y crea un proyecto.
2. Abre el SQL Editor.
3. Pega y ejecuta `supabase/migrations/20261026005217_init_directory.sql`.
4. Pega y ejecuta `supabase/seed.sql`.
5. En Project Settings → Data API copia la URL del proyecto y la clave anon (o publishable) a `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. En las claves del proyecto copia la `service_role` a `SUPABASE_SERVICE_ROLE_KEY`.

La migración deja así el acceso:

- `use_cases`: la clave anon solo lee filas con `published = true`.
- `newsletter_subscribers` y `sponsors`: sin políticas para anon. Solo escribe el servidor con la clave de servicio.
- `sponsor_listings`: vista pública con nombre, enlace y frase de los patrocinios pagados. No incluye el correo.

Si cambias el texto de las fichas en `src/data/use-cases.ts`, regenera la semilla:

```bash
npm run db:seed-sql
```

Ese comando reescribe `supabase/seed.sql`. Vuelve a ejecutarlo en el SQL Editor. `on conflict (slug) do nothing` no pisa fichas que ya existan.

Para desarrollo local con la CLI de Supabase, `supabase db reset` aplica la migración y después `supabase/seed.sql`.

## Resend

1. Verifica un dominio en Resend (SPF, DKIM y, si puedes, DMARC).
2. Crea una API key de envío.
3. Pon `RESEND_FROM_EMAIL` con un correo de ese dominio.

`onboarding@resend.dev` solo entrega al correo de tu cuenta de Resend. No lo uses en producción.

El alta guarda el correo aunque el envío falle, y la respuesta lo dice. La bienvenida usa una clave de idempotencia para no duplicar el mensaje si hay un reintento. Cada correo incluye un enlace para salir de la lista.

## Stripe

El patrocinio es un pago único de USD 500: ficha en el directorio y mención en un envío del boletín. No promete visitas ni ventas.

1. Crea un producto de pago único, “Patrocinio Casos IA”, por USD 500.
2. Copia el `price_...` a `STRIPE_PRICE_ID`.
3. Para cobrar, usa una clave restringida (`rk_`) con permiso de escritura en Checkout Sessions, en lugar de la clave secreta completa, si tu cuenta ya lo permite. La variable sigue llamándose `STRIPE_SECRET_KEY`.
4. En local o en un sandbox, usa claves de prueba (`rk_test_` o `sk_test_`). El sitio avisa cuando detecta ese prefijo.
5. Si prefieres no crear la sesión desde el código, crea un Payment Link y pon la URL en `STRIPE_PAYMENT_LINK`.

El webhook no es un extra. Sin él, una persona puede pagar y la ficha no se publica, porque la página de retorno no marca el pago.

Eventos del endpoint:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

La ficha pasa a `paid` solo si `payment_status` no es `unpaid`. Así un método de pago lento no se publica antes de tiempo. La URL del endpoint es `https://TU_DOMINIO/api/stripe/webhook`. En local puedes reenviarla con la CLI de Stripe.

No actives impuestos automáticos en este código. Si más adelante usas Stripe Tax, primero tiene que existir un registro fiscal activo. Si no, Stripe no calcula impuesto y parece que sí.

La sesión de Checkout lleva `integration_identifier` `casos-ia-patrocinio-bvkrmnqx` para agruparla en el Dashboard.

## Desplegar en Vercel

1. Entra en [vercel.com/new](https://vercel.com/new).
2. Importa el repositorio de Git.
3. Framework Preset: Next.js. Root Directory: `./`.
4. Build Command: `npm run build`. Install Command: `npm install`. No cambies el directorio de salida.
5. En Environment Variables agrega todas las claves de `.env.example` para Production y, si quieres, para Preview. Hazlo antes del primer deploy que deba leer Supabase: el directorio se prerenderiza con las variables presentes en el build.
6. Deploy.
7. Cuando tengas el dominio, pon `NEXT_PUBLIC_SITE_URL` en `https://tu-dominio` (sin barra final) y vuelve a desplegar. El sitemap y los retornos de Stripe usan esa URL.
8. En Stripe, crea el webhook apuntando a `https://tu-dominio/api/stripe/webhook` con los tres eventos de arriba.
9. Copia el signing secret a `STRIPE_WEBHOOK_SECRET` y redeploy.

Las fichas leídas de Supabase se revalidan solas en unos 15 minutos. Un nuevo deploy también las refresca. El webhook invalida la lista de patrocinadores en cuanto el pago queda confirmado.

## Qué incluye esta versión

- Inicio con búsqueda y filtros por tema y dificultad.
- Ficha por caso, con fichas relacionadas.
- Alta al boletín y baja por enlace.
- Página de patrocinio con Stripe Checkout o Payment Link.
- Metadatos, Open Graph, `sitemap.xml` y `robots.txt`.
- Pie con enlace a [kvikklab.com](https://kvikklab.com) y al [cotizador](https://kvikklab.com/#cotizador).

## Qué queda fuera

- Cargar casos desde toda la web.
- Un panel para editar fichas.
- Trabajadores programados o agentes que publiquen solos.
- Métricas de negocio. Este directorio no las inventa.
