-- Product view analytics for producer dashboard (last 30 days KPI).

create table if not exists public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  producer_id uuid not null references public.producers(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists product_views_producer_created_idx
  on public.product_views (producer_id, created_at desc);

create index if not exists product_views_product_created_idx
  on public.product_views (product_id, created_at desc);

alter table public.product_views enable row level security;

-- No public policies: writes go through service role API; reads via admin client in producer portal.

comment on table public.product_views is 'Anonymous product page views for producer analytics.';
