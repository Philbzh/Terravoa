create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  reviewer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) >= 20),
  approved boolean not null default false,
  created_at timestamptz default now()
);
alter table public.product_reviews enable row level security;
-- Anyone can read approved reviews
create policy "Read approved reviews" on public.product_reviews
  for select using (approved = true);
-- Authenticated users can insert their own
create policy "Insert own review" on public.product_reviews
  for insert with check (auth.uid() = user_id);
-- Users can delete their own pending reviews
create policy "Delete own review" on public.product_reviews
  for delete using (auth.uid() = user_id);
