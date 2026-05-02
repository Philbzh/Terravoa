-- ═══════════════════════════════════════════════════════════════
-- Return requests — EU 14-day withdrawal workflow
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

create table if not exists return_requests (
  id             uuid        primary key default gen_random_uuid(),
  order_id       text        not null,
  customer_email text        not null,
  customer_name  text,
  reason         text        not null
                             check (reason in ('withdrawal', 'damaged', 'wrong_item', 'quality')),
  description    text,
  status         text        not null default 'pending'
                             check (status in ('pending', 'approved', 'rejected', 'completed')),
  admin_notes    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists return_requests_status_idx on return_requests (status, created_at desc);
create index if not exists return_requests_email_idx  on return_requests (customer_email);
create index if not exists return_requests_order_idx  on return_requests (order_id);

-- RLS: customers read/create their own requests; admins use service role
alter table return_requests enable row level security;

create policy "Customers can view own return requests"
  on return_requests for select
  using (customer_email = (select email from auth.users where id = auth.uid()));

create policy "Customers can insert own return requests"
  on return_requests for insert
  with check (customer_email = (select email from auth.users where id = auth.uid()));

-- updated_at trigger
create or replace function set_return_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_return_requests_updated_at
  before update on return_requests
  for each row execute procedure set_return_requests_updated_at();
