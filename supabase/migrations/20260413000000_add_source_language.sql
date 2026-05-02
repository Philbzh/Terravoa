ALTER TABLE producer_applications
ADD COLUMN IF NOT EXISTS source_language text DEFAULT 'en';
