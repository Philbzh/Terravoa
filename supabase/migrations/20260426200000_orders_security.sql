-- ═══════════════════════════════════════════════════════════════
-- Orders security hardening
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Unique constraint on stripe_payment_id ──────────────────
-- Guarantees idempotency even if two simultaneous Stripe webhook
-- deliveries both pass the application-level duplicate check.
-- The webhook handler now also catches code '23505' (unique_violation)
-- and returns { received: true, duplicate: true } gracefully.

alter table orders
  add constraint orders_stripe_payment_id_unique
  unique (stripe_payment_id);

-- ── 2. RLS policies for orders ─────────────────────────────────
-- Orders are currently created exclusively via the Stripe webhook
-- using the service role (which bypasses RLS).
--
-- Customers can view their own orders by matching their auth email.
-- This enables a future "My Orders" page without granting broad access.

create policy "Customers can view own orders"
  on orders
  for select
  using (
    customer_email = (
      select email from auth.users where id = auth.uid()
    )
  );

-- Customers must NOT be able to insert, update, or delete orders —
-- those operations are reserved for the service role (webhook / admin).
-- No insert/update/delete policies = denied for all non-service-role users.

-- ── 3. RLS policies for order_items ───────────────────────────
-- Customers can see items that belong to their own orders.

create policy "Customers can view own order items"
  on order_items
  for select
  using (
    order_id in (
      select id from orders
      where customer_email = (
        select email from auth.users where id = auth.uid()
      )
    )
  );

-- ── Notes ──────────────────────────────────────────────────────
-- Producers already have a policy to read their own order_items:
--   "Producers can read own order items" (defined in schema.sql)
-- Both policies coexist — Postgres evaluates OR across all matching
-- SELECT policies for a table.
