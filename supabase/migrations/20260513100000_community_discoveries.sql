-- Community Discoveries: user-submitted recommendations for regions
-- Submissions are moderated (pending → approved/rejected) before appearing on the site.

create table if not exists public.community_discoveries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  region_slug text not null,
  author_name text not null,
  author_location text,
  body text not null check (char_length(body) >= 20 and char_length(body) <= 800),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  user_id uuid references auth.users(id) on delete set null
);

create index idx_community_discoveries_region on community_discoveries (region_slug, status);
create index idx_community_discoveries_status on community_discoveries (status, created_at desc);

-- RLS: anyone can submit, only approved are publicly readable
alter table community_discoveries enable row level security;

create policy "Anyone can submit a discovery"
  on community_discoveries for insert
  with check (true);

create policy "Public can read approved discoveries"
  on community_discoveries for select
  using (status = 'approved');

-- Grants (Supabase October 2026 compliance)
grant insert on public.community_discoveries to anon;
grant select, insert on public.community_discoveries to authenticated;
grant select, insert, update, delete on public.community_discoveries to service_role;
