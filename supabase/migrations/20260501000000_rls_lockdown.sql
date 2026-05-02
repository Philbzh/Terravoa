-- ═══════════════════════════════════════════════════════════════
-- RLS lockdown for internal / service-role-only tables
-- Fix for audit item HIGH-4 (Supabase RLS policy audit).
--
-- Context: seven tables were created by earlier migrations that never
-- called `enable row level security`. Every Supabase public-schema table
-- is reachable from the browser via PostgREST + the NEXT_PUBLIC anon key
-- unless RLS is explicitly enabled. That means, before this migration,
-- any site visitor could read/write these tables — including
-- admin_user_access (effectively making themselves an admin).
--
-- All seven tables are accessed exclusively via the service role in
-- application code (createAdminClient, server-only). A `using (false)`
-- policy therefore produces zero application regressions while closing
-- the hole entirely — service role bypasses RLS and keeps working.
--
-- This migration is defensive:
--   * Each `alter table … enable row level security` is wrapped in a
--     to_regclass existence check, so a missing table is reported via
--     RAISE NOTICE instead of aborting the whole migration.
--   * Policies are dropped-if-exists before creation, so replays don't
--     error out with "policy already exists".
--   * Re-running the migration is always safe.
--
-- If NOTICE messages flag missing tables, apply the earlier migrations
-- that create them (supabase/migrations/…), then re-run this file. It
-- will be a no-op for tables already locked down.
-- ═══════════════════════════════════════════════════════════════

-- ── Helper: run a lockdown block against a table only if it exists ──
-- We inline the logic per table because PL/pgSQL doesn't let us parameterise
-- policy names cleanly without dynamic SQL, and we want the file to remain
-- easy to audit by eye.

-- ── 1. admin_user_access ──────────────────────────────────────
do $$
begin
  if to_regclass('public.admin_user_access') is null then
    raise notice '[rls-lockdown] skipping admin_user_access — table does not exist; apply 20260428130000_admin_user_access.sql first';
  else
    execute 'alter table public.admin_user_access enable row level security';
    execute 'drop policy if exists "Service role only" on public.admin_user_access';
    execute $p$create policy "Service role only" on public.admin_user_access for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 2. admin_audit_logs ───────────────────────────────────────
do $$
begin
  if to_regclass('public.admin_audit_logs') is null then
    raise notice '[rls-lockdown] skipping admin_audit_logs — table does not exist; apply 20260426112500_admin_audit_logs.sql first';
  else
    execute 'alter table public.admin_audit_logs enable row level security';
    execute 'drop policy if exists "Service role only" on public.admin_audit_logs';
    execute $p$create policy "Service role only" on public.admin_audit_logs for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 3. producer_payouts ───────────────────────────────────────
do $$
begin
  if to_regclass('public.producer_payouts') is null then
    raise notice '[rls-lockdown] skipping producer_payouts — table does not exist; apply 20260426150000_order_workflow_states.sql first';
  else
    execute 'alter table public.producer_payouts enable row level security';
    execute 'drop policy if exists "Service role only" on public.producer_payouts';
    execute $p$create policy "Service role only" on public.producer_payouts for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 4. email_jobs ─────────────────────────────────────────────
do $$
begin
  if to_regclass('public.email_jobs') is null then
    raise notice '[rls-lockdown] skipping email_jobs — table does not exist; apply 20260426150000_order_workflow_states.sql first';
  else
    execute 'alter table public.email_jobs enable row level security';
    execute 'drop policy if exists "Service role only" on public.email_jobs';
    execute $p$create policy "Service role only" on public.email_jobs for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 5. producer_admin_notes ───────────────────────────────────
do $$
begin
  if to_regclass('public.producer_admin_notes') is null then
    raise notice '[rls-lockdown] skipping producer_admin_notes — table does not exist; apply 20260426120000_producer_admin_notes.sql first';
  else
    execute 'alter table public.producer_admin_notes enable row level security';
    execute 'drop policy if exists "Service role only" on public.producer_admin_notes';
    execute $p$create policy "Service role only" on public.producer_admin_notes for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 6. producer_plan_requests ─────────────────────────────────
do $$
begin
  if to_regclass('public.producer_plan_requests') is null then
    raise notice '[rls-lockdown] skipping producer_plan_requests — table does not exist; apply 20260428010000_producer_plan_requests.sql first';
  else
    execute 'alter table public.producer_plan_requests enable row level security';
    execute 'drop policy if exists "Service role only" on public.producer_plan_requests';
    execute $p$create policy "Service role only" on public.producer_plan_requests for all using (false) with check (false)$p$;
  end if;
end$$;

-- ── 7. producer_fulfillment_followups ─────────────────────────
do $$
begin
  if to_regclass('public.producer_fulfillment_followups') is null then
    raise notice '[rls-lockdown] skipping producer_fulfillment_followups — table does not exist; apply 20260428143000_producer_fulfillment_followups.sql first';
  else
    execute 'alter table public.producer_fulfillment_followups enable row level security';
    execute 'drop policy if exists "Service role only" on public.producer_fulfillment_followups';
    execute $p$create policy "Service role only" on public.producer_fulfillment_followups for all using (false) with check (false)$p$;
  end if;
end$$;

-- ═══════════════════════════════════════════════════════════════
-- Defence-in-depth: idempotently re-enable RLS on tables that were
-- enabled in schema.sql originally. If schema.sql was ever applied
-- selectively on a fresh Supabase project, this guarantees the
-- protection is active regardless. Each block is independently
-- guarded so a partial schema doesn't abort the whole file.
-- ═══════════════════════════════════════════════════════════════

do $$
declare
  t text;
  tables constant text[] := array[
    'producers',
    'products',
    'orders',
    'order_items',
    'producer_applications',
    'contact_messages',
    'regions',
    'newsletter_subscribers'
  ];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is null then
      raise notice '[rls-lockdown] skipping %: table does not exist', t;
    else
      execute format('alter table public.%I enable row level security', t);
    end if;
  end loop;
end$$;

-- ═══════════════════════════════════════════════════════════════
-- Post-migration verification (read-only, safe to re-run).
--
-- 1. Every public table has RLS enabled:
--
--    select tablename, rowsecurity
--    from pg_tables
--    where schemaname = 'public'
--    order by rowsecurity, tablename;
--
-- 2. Spot-check which tables have at least one policy:
--
--    select tablename, count(*) as n_policies
--    from pg_policies
--    where schemaname = 'public'
--    group by tablename
--    order by tablename;
--
-- Any table with rowsecurity = true AND n_policies = 0 is a
-- deliberate "deny all" — that's correct for the seven internal
-- tables above, and intended for newsletter_subscribers. Anything
-- else in that state probably wants investigation.
-- ═══════════════════════════════════════════════════════════════
