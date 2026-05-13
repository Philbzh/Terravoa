-- ═══════════════════════════════════════════════════════════════
-- Explicit role grants for all public tables
--
-- Why: Starting October 30, 2026, Supabase will no longer auto-grant
-- access to public-schema tables. Without explicit GRANTs, supabase-js
-- and PostgREST will return 42501 errors.
--
-- Existing RLS policies remain the real access control — GRANTs only
-- make the table visible to PostgREST. A GRANT without a matching
-- RLS policy still returns zero rows.
--
-- Safe to re-run: all statements are idempotent.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. producers ─────────────────────────────────────────────
-- anon: read approved (RLS), authenticated: read/update own (RLS), service_role: all
grant select on public.producers to anon;
grant select, insert, update, delete on public.producers to authenticated;
grant select, insert, update, delete on public.producers to service_role;

-- ── 2. products ──────────────────────────────────────────────
-- anon: read approved (RLS), authenticated: read/insert/update own (RLS), service_role: all
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.products to service_role;

-- ── 3. orders ────────────────────────────────────────────────
-- service_role: all, authenticated: limited via RLS
grant select on public.orders to authenticated;
grant select, insert, update, delete on public.orders to service_role;

-- ── 4. order_items ───────────────────────────────────────────
-- authenticated: read own items (RLS), service_role: all
grant select on public.order_items to authenticated;
grant select, insert, update, delete on public.order_items to service_role;

-- ── 5. producer_applications ─────────────────────────────────
-- anon: insert (RLS allows anyone to submit), service_role: all
grant insert on public.producer_applications to anon;
grant insert on public.producer_applications to authenticated;
grant select, insert, update, delete on public.producer_applications to service_role;

-- ── 6. contact_messages ──────────────────────────────────────
-- anon: insert (RLS allows anyone to submit), service_role: all
grant insert on public.contact_messages to anon;
grant insert on public.contact_messages to authenticated;
grant select, insert, update, delete on public.contact_messages to service_role;

-- ── 7. newsletter_subscribers ────────────────────────────────
-- RLS blocks all browser access (using(false)). Only service_role.
grant select, insert, update, delete on public.newsletter_subscribers to service_role;

-- ── 8. regions ───────────────────────────────────────────────
-- anon: read all (RLS allows), service_role: all
grant select on public.regions to anon;
grant select on public.regions to authenticated;
grant select, insert, update, delete on public.regions to service_role;

-- ── 9. product_reviews ───────────────────────────────────────
-- anon: read approved (RLS), authenticated: read/insert/delete own (RLS)
grant select on public.product_reviews to anon;
grant select, insert, delete on public.product_reviews to authenticated;
grant select, insert, update, delete on public.product_reviews to service_role;

-- ── 10. wishlists ────────────────────────────────────────────
-- authenticated: manage own (RLS), service_role: all
grant select, insert, update, delete on public.wishlists to authenticated;
grant select, insert, update, delete on public.wishlists to service_role;

-- ── 11. return_requests ──────────────────────────────────────
-- authenticated: read/insert own (RLS), service_role: all
grant select, insert on public.return_requests to authenticated;
grant select, insert, update, delete on public.return_requests to service_role;

-- ══════════════════════════════════════════════════════════════
-- Internal / admin-only tables — service_role only
-- (RLS: using(false) blocks anon + authenticated entirely)
-- ══════════════════════════════════════════════════════════════

-- ── 12. admin_audit_logs ─────────────────────────────────────
grant select, insert, update, delete on public.admin_audit_logs to service_role;

-- ── 13. producer_admin_notes ─────────────────────────────────
grant select, insert, update, delete on public.producer_admin_notes to service_role;

-- ── 14. producer_payouts ─────────────────────────────────────
grant select, insert, update, delete on public.producer_payouts to service_role;

-- ── 15. email_jobs ───────────────────────────────────────────
grant select, insert, update, delete on public.email_jobs to service_role;

-- ── 16. producer_plan_requests ───────────────────────────────
grant select, insert, update, delete on public.producer_plan_requests to service_role;

-- ── 17. producer_fulfillment_followups ───────────────────────
grant select, insert, update, delete on public.producer_fulfillment_followups to service_role;

-- ── 18. admin_user_access ────────────────────────────────────
grant select, insert, update, delete on public.admin_user_access to service_role;

-- ══════════════════════════════════════════════════════════════
-- Sequences: grant usage so inserts with identity columns work
-- ══════════════════════════════════════════════════════════════
grant usage on all sequences in schema public to anon;
grant usage on all sequences in schema public to authenticated;
grant usage on all sequences in schema public to service_role;
