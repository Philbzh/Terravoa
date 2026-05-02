-- ─────────────────────────────────────────────────────────────────────────────
-- Producer application — rejection reasons + admin note
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Adds structured rejection metadata to `producer_applications` so that the
-- rejection email sent to the producer can list the specific reasons the
-- application was not moved forward, alongside an optional free-text note
-- from the curation team.
--
-- • `rejection_reasons`  array of stable codes (see RejectionReasonCode
--                        in `src/lib/email/i18n.ts`). We intentionally do
--                        NOT use an enum or a lookup table — the code list
--                        evolves in application code, and persisting an
--                        enum would couple db migrations to wording changes.
--                        Unknown codes are silently ignored by the email
--                        renderer.
--
-- • `rejection_note`     optional admin-authored sentence (~500 chars, not
--                        enforced at the DB layer so that we can relax the
--                        limit without a migration if needed).
--
-- Both columns are NULLable / default empty so existing rows remain valid
-- and the pre-launch accept flow is entirely unchanged.
-- ─────────────────────────────────────────────────────────────────────────────

do $$
begin
  if to_regclass('public.producer_applications') is null then
    raise notice '[app-rejection] producer_applications table does not exist — skipping. Apply schema.sql first.';
  else
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name   = 'producer_applications'
        and column_name  = 'rejection_reasons'
    ) then
      execute $sql$
        alter table public.producer_applications
          add column rejection_reasons text[] not null default '{}'::text[]
      $sql$;
    end if;

    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name   = 'producer_applications'
        and column_name  = 'rejection_note'
    ) then
      execute $sql$
        alter table public.producer_applications
          add column rejection_note text
      $sql$;
    end if;
  end if;
end$$;
