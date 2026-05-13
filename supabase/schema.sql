-- ═══════════════════════════════════════════════════════════════
-- TERROVA — Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════

-- ── Enums ──
create type producer_status as enum ('pending', 'approved', 'suspended');
create type product_status  as enum ('pending', 'approved', 'rejected');
create type order_status    as enum ('new', 'processing', 'shipped', 'delivered');
create type application_status as enum ('pending', 'accepted', 'rejected');
create type plan_type       as enum ('starter', 'growth');

-- ── Producers ──
create table producers (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  user_id          uuid references auth.users(id) on delete set null,
  name             text not null,
  slug             text not null unique,
  region           text not null,
  country          text not null,
  specialty        text not null,
  tagline          text not null default '',
  story            text not null default '',
  story_headline   text not null default '',
  quote            text not null default '',
  image_src        text not null default '',
  image_alt        text not null default '',
  hero_image_src   text,
  hero_image_alt   text,
  secondary_image_src text,
  secondary_image_alt text,
  established      text,
  badges           text[] default '{}',
  savoir_faire     jsonb default '[]',
  status           producer_status default 'pending',
  plan             plan_type
);

create index idx_producers_slug   on producers(slug);
create index idx_producers_status on producers(status);

-- ── Products ──
create table products (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  producer_id      uuid not null references producers(id) on delete cascade,
  name             text not null,
  slug             text not null unique,
  price            integer not null, -- cents
  origin           text not null,
  description      text not null default '',
  details          text[] default '{}',
  image_src        text not null default '',
  image_alt        text not null default '',
  badge_label      text,
  badge_variant    text, -- 'producer' | 'bestseller'
  category         text not null default '',
  status           product_status default 'pending'
);

create index idx_products_slug        on products(slug);
create index idx_products_producer_id on products(producer_id);
create index idx_products_status      on products(status);

-- ── Orders ──
create table orders (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  customer_email    text not null,
  customer_name     text not null,
  shipping_address  jsonb not null default '{}',
  status            order_status default 'new',
  total             integer not null, -- cents
  stripe_payment_id text
);

create index idx_orders_status on orders(status);

-- ── Order Items ──
create table order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id) on delete cascade,
  product_id      uuid not null references products(id),
  producer_id     uuid not null references producers(id),
  quantity        integer not null default 1,
  price           integer not null, -- cents at time of order
  tracking_number text
);

create index idx_order_items_order_id    on order_items(order_id);
create index idx_order_items_producer_id on order_items(producer_id);

-- ── Producer Applications ──
create table producer_applications (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz default now(),
  full_name                      text not null,
  business_name                  text,
  company_registration_country   text,
  vat_id                         text,
  email                  text not null,
  phone                  text,
  country                text not null,
  region                 text not null,
  production_location    text,
  product_categories     text[] default '{}',
  product_description    text not null,
  product_differentiator text,
  story                  text not null,
  website                text,
  instagram              text,
  shipping_countries     text,
  shipping_speed         text not null,
  shipping_experience    boolean,
  status                 application_status default 'pending',
  reviewed_at            timestamptz,
  notes                  text,
  other_links            text,
  product_image_urls     text[] default '{}',
  production_image_urls  text[] default '{}',
  environment_image_urls text[] default '{}'
);

create index idx_applications_status on producer_applications(status);
create index idx_applications_email  on producer_applications(email);

-- ── Contact messages (public insert, admin read via service role) ──
create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  audience    text not null,
  message     text not null
);

create index idx_contact_messages_created on contact_messages(created_at desc);

-- ── Newsletter subscribers ──
create table newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

create index idx_newsletter_email on newsletter_subscribers(email);

-- ── Regions ──
create table regions (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  country          text not null,
  specialty        text not null,
  description      text not null default '',
  long_description text not null default '',
  image_src        text not null default '',
  image_alt        text not null default ''
);

-- ── Auto-update timestamps ──
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_producers_updated  before update on producers  for each row execute function update_updated_at();
create trigger trg_products_updated   before update on products   for each row execute function update_updated_at();
create trigger trg_orders_updated     before update on orders     for each row execute function update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════════

alter table newsletter_subscribers enable row level security;
alter table producers              enable row level security;
alter table products               enable row level security;
alter table orders                 enable row level security;
alter table order_items            enable row level security;
alter table producer_applications  enable row level security;
alter table contact_messages       enable row level security;
alter table regions                enable row level security;

-- Public read access for approved content
create policy "Public can read approved producers"  on producers  for select using (status = 'approved');
create policy "Public can read approved products"   on products   for select using (status = 'approved');
create policy "Public can read regions"             on regions    for select using (true);

-- Producers can manage their own data
create policy "Producers can read own data"    on producers for select using (auth.uid() = user_id);
create policy "Producers can update own data"  on producers for update using (auth.uid() = user_id);

create policy "Producers can read own products"   on products for select using (producer_id in (select id from producers where user_id = auth.uid()));
create policy "Producers can insert own products" on products for insert with check (producer_id in (select id from producers where user_id = auth.uid()));
create policy "Producers can update own products" on products for update using (producer_id in (select id from producers where user_id = auth.uid()));

-- Producers can see their own orders
create policy "Producers can read own order items" on order_items for select using (producer_id in (select id from producers where user_id = auth.uid()));

-- Anyone can submit an application (no auth required)
create policy "Anyone can submit application" on producer_applications for insert with check (true);

-- Contact form
create policy "Anyone can submit contact message" on contact_messages for insert with check (true);

-- Newsletter (service role only — inserts go through /api/newsletter server route)
create policy "No direct browser access to newsletter" on newsletter_subscribers for all using (false);

-- ═══════════════════════════════════════════════════════════════
-- Storage bucket for images
-- ═══════════════════════════════════════════════════════════════

-- Run separately in Supabase Dashboard → Storage → New Bucket
-- Bucket name: "images"
-- Public: yes
-- Allowed MIME types: image/jpeg, image/png, image/webp
