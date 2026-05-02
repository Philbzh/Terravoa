-- Admin access matrix for delegated dashboard users
create table if not exists admin_user_access (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  is_active boolean not null default true,
  can_supplier boolean not null default false,
  can_customer boolean not null default false,
  can_marketing boolean not null default false,
  can_finance boolean not null default false,
  can_operations boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table admin_user_access is
  'Delegated admin dashboard access rights by email.';

create index if not exists idx_admin_user_access_active on admin_user_access (is_active, email);
