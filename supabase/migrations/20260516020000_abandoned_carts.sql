-- Abandoned cart tracking for recovery emails.
-- Carts are upserted on checkout page load and deleted on successful payment.
CREATE TABLE IF NOT EXISTS abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cart_json JSONB NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reminder_sent_at TIMESTAMPTZ DEFAULT NULL,
  recovered_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts (email);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_reminder ON abandoned_carts (reminder_sent_at, updated_at)
  WHERE recovered_at IS NULL;

-- RLS: only service role can access (used by cron and API routes)
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
