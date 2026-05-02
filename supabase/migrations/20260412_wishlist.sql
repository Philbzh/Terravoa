create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_slug text not null,
  product_name text not null,
  product_price numeric,
  product_image text,
  created_at timestamptz default now(),
  unique(user_id, product_slug)
);
alter table public.wishlists enable row level security;
create policy "Users manage own wishlist" on public.wishlists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
