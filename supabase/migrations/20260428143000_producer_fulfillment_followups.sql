-- Track producer follow-up workflow for delayed direct-to-customer fulfillment
create table if not exists producer_fulfillment_followups (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  producer_id uuid not null references producers(id) on delete cascade,
  status text not null default 'open' check (status in ('open', 'contacted', 'snoozed', 'resolved')),
  contact_count integer not null default 0,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(order_id, producer_id)
);

create index if not exists idx_producer_fulfillment_followups_status
  on producer_fulfillment_followups (status, next_follow_up_at);
