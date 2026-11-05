-- El listado público solo incluye patrocinios pagados en Stripe live.
-- Un cobro de prueba (sesión cs_test_, sandbox o e2e) no se publica,
-- aunque status sea paid y show_listing sea true.
-- livemode lo confirma el webhook. Una sesión cs_live_ sigue visible
-- si ese webhook todavía no escribía la columna.

alter table public.sponsors
  add column livemode boolean not null default false;

comment on column public.sponsors.livemode is
  'Verdadero solo cuando Stripe confirmó el pago en modo live.';

create or replace view public.sponsor_listings as
select id, name, website_url, blurb, created_at
from public.sponsors
where status = 'paid'
  and show_listing = true
  and coalesce(stripe_checkout_session_id, '') not like 'cs_test_%'
  and (
    livemode
    or coalesce(stripe_checkout_session_id, '') like 'cs_live_%'
  );

comment on view public.sponsor_listings is
  'Fichas de patrocinio pagadas en live. No incluye el correo ni cobros de prueba.';

-- security_invoker queda en falso a propósito, igual que en el esquema inicial:
-- la vista es el contrato público y la tabla base no tiene políticas para anon.
-- Así no se filtra el correo.

grant select on table public.sponsor_listings to anon, authenticated, service_role;
