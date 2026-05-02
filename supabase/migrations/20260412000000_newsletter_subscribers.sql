-- Newsletter subscribers table
-- Used by /api/newsletter to store email signups from the Footer form.

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz not null default now(),

  constraint newsletter_subscribers_email_key unique (email)
);

-- Only the service role (server-side) can read/write this table.
-- No direct browser access needed since we always go through /api/newsletter.
alter table public.newsletter_subscribers enable row level security;

create policy "Service role only"
  on public.newsletter_subscribers
  for all
  using (false);
