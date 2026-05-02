-- ─────────────────────────────────────────────────────────────────────────────
-- Producer plan self-service
-- • producer_plan_requests: upgrade + add-on request queue
-- • desired_plan on producer_applications
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS producer_plan_requests (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id      uuid        NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  requester_email  text,
  request_type     text        NOT NULL CHECK (request_type IN ('plan_upgrade', 'addon_featured_placement', 'addon_homepage_feature')),
  current_plan     text,
  requested_plan   text        CHECK (requested_plan IN ('growth', 'premium')),
  message          text,
  status           text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes      text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE producer_plan_requests IS
  'Tracks producer-initiated upgrade and add-on requests. Admin approves to auto-apply changes.';

CREATE INDEX IF NOT EXISTS idx_plan_requests_status
  ON producer_plan_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plan_requests_producer
  ON producer_plan_requests (producer_id, created_at DESC);

-- desired_plan on applications — set by applicant during the apply form
ALTER TABLE producer_applications
  ADD COLUMN IF NOT EXISTS desired_plan text DEFAULT 'founding'
  CHECK (desired_plan IN ('founding', 'growth', 'premium'));

COMMENT ON COLUMN producer_applications.desired_plan IS
  'Plan tier the applicant selected on the apply form. Admin sees this during review.';
