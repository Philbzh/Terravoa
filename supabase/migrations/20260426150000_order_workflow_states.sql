alter table public.orders
  add column if not exists fulfillment_status text not null default 'awaiting_producer_ack',
  add column if not exists payment_status text not null default 'paid',
  add column if not exists payout_status text not null default 'not_due',
  add column if not exists shipped_at timestamptz,
  add column if not exists delivered_at timestamptz,
  add column if not exists closed_at timestamptz;

alter table public.order_items
  add column if not exists status text not null default 'pending',
  add column if not exists carrier text,
  add column if not exists tracking_url text,
  add column if not exists eta_at date,
  add column if not exists shipped_at timestamptz,
  add column if not exists refunded_cents integer;

create table if not exists public.producer_payouts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  producer_id uuid not null references public.producers(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  amount_cents integer not null,
  commission_cents integer not null default 0,
  status text not null default 'scheduled',
  scheduled_at timestamptz not null default now(),
  paid_at timestamptz,
  stripe_transfer_id text
);

create index if not exists producer_payouts_order_idx on public.producer_payouts(order_id);
create index if not exists producer_payouts_producer_idx on public.producer_payouts(producer_id);
create index if not exists producer_payouts_status_idx on public.producer_payouts(status);

create table if not exists public.email_jobs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null,
  order_id uuid references public.orders(id) on delete cascade,
  customer_email text not null,
  payload jsonb not null default '{}'::jsonb,
  send_at timestamptz not null,
  sent_at timestamptz,
  attempts integer not null default 0,
  last_error text
);

create index if not exists email_jobs_due_idx on public.email_jobs(send_at, sent_at);
create index if not exists email_jobs_kind_idx on public.email_jobs(kind);

update public.orders
set fulfillment_status = case
  when status = 'new' then 'awaiting_producer_ack'
  when status = 'processing' then 'acked'
  when status = 'shipped' then 'shipped'
  when status = 'delivered' then 'delivered'
  else 'acked'
end
where fulfillment_status is not null;

update public.order_items
set status = case
  when coalesce(tracking_number, '') <> '' then 'shipped'
  else 'pending'
end
where status is not null;
