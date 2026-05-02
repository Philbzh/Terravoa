ALTER TABLE producers ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en';
ALTER TABLE orders    ADD COLUMN IF NOT EXISTS customer_locale   text DEFAULT 'en';
