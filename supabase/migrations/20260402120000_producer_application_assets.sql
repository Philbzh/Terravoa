-- Add optional application assets (run in Supabase SQL Editor if the table already exists)

alter table producer_applications
  add column if not exists other_links text;

alter table producer_applications
  add column if not exists product_image_urls text[] default '{}';

alter table producer_applications
  add column if not exists production_image_urls text[] default '{}';

alter table producer_applications
  add column if not exists environment_image_urls text[] default '{}';
