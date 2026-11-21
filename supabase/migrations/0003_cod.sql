-- ============================================================================
-- Elvora.my — Cash on Delivery
--
-- Run AFTER 0001_init.sql. Idempotent: re-running is safe.
--
-- Adds two columns to public.orders:
--
--   payment_method_id  how the customer agreed to pay  ('cod')
--   payment_status     whether the money has arrived
--
-- Why payment_status is separate from status
-- ------------------------------------------
-- They answer different questions. `status` is the order's lifecycle; `status
-- = 'pending-payment'` means "not settled". `payment_status` says *why*, which
-- for Cash on Delivery is usually `on-delivery`: the cash is expected at the
-- door, and the shop is not paid yet.
--
-- Collapsing them would make it impossible to express the states that matter
-- once real orders flow: "delivered but the customer did not have the cash"
-- (order outstanding, payment `unpaid`) and "cancelled before dispatch"
-- (order `cancelled`, payment `not-required`) are the same order status with
-- opposite accounting consequences.
--
-- Nothing here enables an online gateway. `cod` is the only method, and no
-- column, constraint or policy mentions a gateway.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Columns
--
-- Added with defaults so the existing rows are correct without a backfill:
-- every order placed before this migration was a Cash on Delivery order, and
-- none of them had been paid.
-- ---------------------------------------------------------------------------

alter table public.orders
  add column if not exists payment_method_id text not null default 'cod';

alter table public.orders
  add column if not exists payment_status text not null default 'on-delivery';

-- ---------------------------------------------------------------------------
-- Constraints
--
-- Dropped first and recreated, so re-running this file converges rather than
-- failing on an existing constraint of the same name.
-- ---------------------------------------------------------------------------

alter table public.orders drop constraint if exists orders_payment_method_known;
alter table public.orders
  add constraint orders_payment_method_known
  -- Only methods the application can actually take. Adding an online method
  -- means adding its id here in the same migration that implements it, which
  -- keeps the database and the code from disagreeing.
  check (payment_method_id in ('cod'));

alter table public.orders drop constraint if exists orders_payment_status_known;
alter table public.orders
  add constraint orders_payment_status_known
  check (payment_status in ('on-delivery', 'unpaid', 'paid', 'not-required'));

-- The important one: a paid order must have both a payment record (already
-- enforced by orders_paid_requires_payment) and a payment_status of 'paid'.
-- Without this, a bug could leave status = 'paid' while payment_status still
-- claimed the cash was on its way, and the shop would not know what it held.
alter table public.orders drop constraint if exists orders_paid_status_agrees;
alter table public.orders
  add constraint orders_paid_status_agrees
  check (
    (status = 'paid' and payment_status = 'paid')
    or (status <> 'paid' and payment_status <> 'paid')
  );

-- A cancelled order cannot owe money. Either it was cancelled before anything
-- was due (not-required), or it was paid and then cancelled, which the
-- `paid = paid` clause above already permits.
alter table public.orders drop constraint if exists orders_cancelled_settles;
alter table public.orders
  add constraint orders_cancelled_settles
  check (status <> 'cancelled' or payment_status in ('not-required', 'paid'));

-- ---------------------------------------------------------------------------
-- Index
--
-- The owner reconciles cash by payment status ("what is still owed to us?"),
-- so that is the column worth indexing.
-- ---------------------------------------------------------------------------

create index if not exists orders_payment_status_idx
  on public.orders (payment_status);

-- ---------------------------------------------------------------------------
-- Security
--
-- Unchanged from 0001: RLS is on, and there is no policy for anon or
-- authenticated. The application reaches these columns with the service_role
-- key from a server action. New columns inherit the table's protection, so
-- nothing extra is required — but the grants are re-asserted here so a partial
-- run of 0001 cannot leave this table readable.
-- ---------------------------------------------------------------------------

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Verification (run after applying)
-- ---------------------------------------------------------------------------
--   select payment_method_id, payment_status, count(*)
--     from public.orders group by 1, 2;
--   -- expect legacy rows under ('cod', 'on-delivery')
--
--   select conname from pg_constraint
--    where conrelid = 'public.orders'::regclass and contype = 'c';
--   -- expect orders_payment_method_known, orders_payment_status_known,
--   --        orders_paid_status_agrees, orders_cancelled_settles,
--   --        orders_paid_requires_payment, orders_total_matches_subtotal
--
-- Then: npm run db:verify
