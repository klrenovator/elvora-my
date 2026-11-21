-- ============================================================================
-- Elvora.my — Supabase schema
--
-- Run this once, in the Supabase SQL editor, on a fresh project.
-- It is idempotent: re-running it is safe and will not duplicate data.
--
-- Design notes that matter more than the DDL:
--
-- • Products store the whole trilingual document as `jsonb`. The TypeScript
--   `Product` type is the contract, and a row is a serialised one. This is
--   deliberately not fully normalised: the shape is nested and translated
--   (name/ms, description/zh, seo, faqs, specifications), and exploding it into
--   tables would create a dozen joins per page for no query anyone needs. A
--   few indexed columns are lifted out of the document for filtering.
--
-- • Order lines are stored as `jsonb` too, because they are an immutable
--   historical copy of what was agreed, not a live reference to a product. A
--   later price change must not rewrite an existing order.
--
-- • RLS is enabled on both tables with **no permissive policy for the anon
--   role**. The application connects with the service_role key from a server
--   action, which bypasses RLS. Everything else — the public anon key, any
--   leaked client — gets nothing. That is the intended posture for a shop whose
--   only browser-side database access is none at all.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id          text primary key,
  -- Lifted out of the document for filtering and admin listing.
  status      text not null default 'draft'
                check (status in ('draft', 'published')),
  category    text not null,
  sort_order  integer not null default 100,
  sku         text not null,
  -- Slug per language, lifted out so the storefront can look a page up without
  -- scanning every document.
  slug_en     text not null,
  slug_ms     text not null,
  slug_zh     text not null,
  -- The full Product document, exactly as the TypeScript type describes it.
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- One product per URL per language. Two rows sharing a slug would make the
-- page route ambiguous, and the build-time validator already treats that as an
-- error — so the database enforces it too.
create unique index if not exists products_slug_en_key on public.products (lower(slug_en));
create unique index if not exists products_slug_ms_key on public.products (lower(slug_ms));
create unique index if not exists products_slug_zh_key on public.products (lower(slug_zh));

create index if not exists products_status_order_idx on public.products (status, sort_order);
create index if not exists products_category_idx on public.products (category);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create table if not exists public.orders (
  reference      text primary key,
  -- Mirrors the OrderStatus union in src/lib/orders.ts. 'paid' is intentionally
  -- reachable only by a verified payment callback, which does not exist yet.
  status         text not null default 'pending-payment'
                   check (status in ('pending-payment', 'paid', 'expired', 'cancelled')),
  locale         text not null check (locale in ('en', 'ms', 'zh')),
  customer       jsonb not null,
  lines          jsonb not null,
  subtotal_sen   integer not null check (subtotal_sen >= 0),
  -- Shipping is quoted after the order, so it is genuinely absent rather than 0.
  shipping_sen   integer,
  total_sen      integer not null check (total_sen >= 0),
  -- Set only by a verified provider callback. Null means "no money has moved".
  payment        jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- A paid order must carry a payment record, and an unpaid order must not.
  -- Making this a constraint means a bug cannot quietly mark an order paid
  -- without proof of payment.
  constraint orders_paid_requires_payment
    check (
      (status = 'paid' and payment is not null)
      or (status <> 'paid' and payment is null)
    ),
  constraint orders_total_matches_subtotal
    check (total_sen = subtotal_sen + coalesce(shipping_sen, 0))
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Read this before "fixing" it by adding a policy.
--
-- The storefront and admin both run on the server (Next.js server components
-- and server actions) and connect with the service_role key, which bypasses
-- RLS by design. Therefore:
--
--   · anon (public key)        → no policies at all → no access
--   · authenticated (Supabase)  → no policies at all → no access
--   · service_role              → full access, server-side only
--
-- This is the safest configuration for a single-owner shop: there is no
-- browser-side database access to protect, so none is granted. If you later add
-- a customer account area that queries Supabase directly from the browser,
-- that is the moment to add scoped policies — and to re-read this comment.
-- ---------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Belt and braces: explicitly revoke the table grants PostgREST would
-- otherwise expose through the anon and authenticated roles.
revoke all on public.products from anon, authenticated;
revoke all on public.orders   from anon, authenticated;

-- Intentionally no CREATE POLICY statements. Absence of a policy is denial.

-- ---------------------------------------------------------------------------
-- Verification (run these after applying; all should return 0)
-- ---------------------------------------------------------------------------
--   select count(*) from pg_policies
--    where schemaname = 'public' and tablename in ('products','orders');
--   -- expect 0
--
--   select count(*) from information_schema.role_table_grants
--    where table_schema = 'public'
--      and table_name in ('products','orders')
--      and grantee in ('anon','authenticated');
--   -- expect 0
