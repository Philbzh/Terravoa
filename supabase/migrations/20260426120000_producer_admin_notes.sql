create table if not exists public.producer_admin_notes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  producer_id uuid not null references public.producers(id) on delete cascade,
  actor_email text not null,
  note text not null
);

create index if not exists producer_admin_notes_producer_idx
  on public.producer_admin_notes (producer_id, created_at desc);
