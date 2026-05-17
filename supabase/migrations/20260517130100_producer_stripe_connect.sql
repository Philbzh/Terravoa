-- Stripe Connect onboarding fields (account created via Terravoa admin / future Connect OAuth).

alter table public.producers
  add column if not exists stripe_connect_account_id text,
  add column if not exists stripe_connect_charges_enabled boolean not null default false,
  add column if not exists stripe_connect_payouts_enabled boolean not null default false,
  add column if not exists stripe_connect_onboarded_at timestamptz;

comment on column public.producers.stripe_connect_account_id is 'Stripe Connect account id (acct_...) when onboarded.';
