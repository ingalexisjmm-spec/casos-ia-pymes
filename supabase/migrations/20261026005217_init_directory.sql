-- Esquema de Casos IA.
-- Lectura pública solo de fichas publicadas y de patrocinios ya pagados.
-- Correos del boletín y datos de pago: solo la clave de servicio, desde el servidor.

create table public.use_cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  categories text[] not null default '{}',
  tools text[] not null default '{}',
  difficulty text not null,
  source_url text,
  is_seed boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint use_cases_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint use_cases_difficulty_check check (difficulty in ('facil', 'medio')),
  constraint use_cases_categories_check check (cardinality(categories) > 0),
  constraint use_cases_source_url_check check (
    source_url is null or source_url ~ '^https?://'
  )
);

comment on table public.use_cases is
  'Fichas del directorio de usos de IA para negocios.';

comment on column public.use_cases.is_seed is
  'Verdadero cuando la ficha es contenido inicial de ejemplo, no un caso reportado por un negocio.';

create index use_cases_published_idx on public.use_cases (published);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  source text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint newsletter_email_format check (
    email = lower(email)
    and char_length(email) <= 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
);

comment on table public.newsletter_subscribers is
  'Correos del boletín. Sin acceso para la clave anónima.';

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  website_url text,
  blurb text not null,
  status text not null default 'pending',
  show_listing boolean not null default true,
  stripe_checkout_session_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  constraint sponsors_status_check check (status in ('pending', 'paid', 'failed')),
  constraint sponsors_blurb_length check (char_length(blurb) between 1 and 160),
  constraint sponsors_website_check check (
    website_url is null or website_url ~ '^https?://'
  )
);

comment on table public.sponsors is
  'Solicitudes de patrocinio. El correo no se expone en la API pública.';

-- Proyección pública: sin correo ni estado interno.
-- security_invoker queda en falso a propósito: la vista es el contrato público
-- y la tabla base no tiene políticas para anon. Así no se filtra el correo.
create view public.sponsor_listings as
select id, name, website_url, blurb, created_at
from public.sponsors
where status = 'paid' and show_listing = true;

comment on view public.sponsor_listings is
  'Fichas de patrocinio ya pagadas. No incluye el correo.';

alter table public.use_cases enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.sponsors enable row level security;

revoke all on table public.use_cases from public, anon, authenticated;
revoke all on table public.newsletter_subscribers from public, anon, authenticated;
revoke all on table public.sponsors from public, anon, authenticated;
revoke all on table public.sponsor_listings from public, anon, authenticated;

grant select on table public.use_cases to anon, authenticated;
grant select, insert, update, delete on table public.use_cases to service_role;

grant select, insert, update, delete on table public.newsletter_subscribers to service_role;
grant select, insert, update, delete on table public.sponsors to service_role;

grant select on table public.sponsor_listings to anon, authenticated, service_role;

create policy "lectura publica de fichas publicadas"
  on public.use_cases
  for select
  to anon, authenticated
  using (published = true);
