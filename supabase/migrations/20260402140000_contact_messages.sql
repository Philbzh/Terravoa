create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  audience    text not null,
  message     text not null
);

create index if not exists idx_contact_messages_created on contact_messages(created_at desc);

alter table contact_messages enable row level security;

drop policy if exists "Anyone can submit contact message" on contact_messages;
create policy "Anyone can submit contact message" on contact_messages for insert with check (true);
