-- ─────────────────────────────────────────────────────────────────────────────
-- Producer tier system
-- • Rename plan values: starter → founding, add premium
-- • Add featured_placement and commission_rate_pct to producers
-- • Add commission_rate_pct + commission_cents to order_items
--
-- This migration is written to be idempotent — every step is guarded so it can
-- be replayed against a database where it has already partially (or fully) run,
-- including environments where `producers_plan_check` was added in a previous
-- attempt.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Convert plan column from enum → text so we can rename values freely
--    (no-op if it's already text).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'producers'
      AND column_name  = 'plan'
      AND udt_name    <> 'text'
  ) THEN
    ALTER TABLE producers ALTER COLUMN plan TYPE text;
  END IF;
END$$;

-- 2. Rename existing 'starter' records to 'founding'
UPDATE producers SET plan = 'founding' WHERE plan = 'starter';

-- 3. Add check constraint with all three valid tiers — drop first so re-runs
--    replace the existing constraint cleanly.
ALTER TABLE producers DROP CONSTRAINT IF EXISTS producers_plan_check;
ALTER TABLE producers
  ADD CONSTRAINT producers_plan_check
  CHECK (plan IN ('founding', 'growth', 'premium'));

-- 4. Drop the old enum (no longer referenced)
DROP TYPE IF EXISTS plan_type CASCADE;

-- 5. New columns on producers
ALTER TABLE producers
  ADD COLUMN IF NOT EXISTS featured_placement   boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS commission_rate_pct  numeric(5,2) DEFAULT NULL;

COMMENT ON COLUMN producers.featured_placement IS
  'When true, producer appears at top of listings (Featured Placement add-on).';
COMMENT ON COLUMN producers.commission_rate_pct IS
  'Override commission %. NULL = use plan default (founding 15%, growth 12%, premium 8%).';

-- 6. New columns on order_items for accurate historical commission tracking
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS commission_rate_pct  numeric(5,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS commission_cents      integer      NOT NULL DEFAULT 0;

COMMENT ON COLUMN order_items.commission_rate_pct IS
  'Commission % captured at time of sale — immutable after insert.';
COMMENT ON COLUMN order_items.commission_cents IS
  'Terravoa commission amount in cents captured at time of sale.';

-- 7. Index for quick featured listing sorts
CREATE INDEX IF NOT EXISTS idx_producers_featured_placement
  ON producers (featured_placement DESC, created_at DESC)
  WHERE status = 'approved';
