-- ═══════════════════════════════════════════════════════════════
-- Gift messaging fields on orders
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

alter table orders
  add column if not exists is_gift        boolean default false,
  add column if not exists gift_recipient text,
  add column if not exists gift_message   text,
  add column if not exists gift_wrap      boolean default false;

comment on column orders.is_gift        is 'True when customer marked this as a gift at checkout';
comment on column orders.gift_recipient is 'Recipient name entered by customer';
comment on column orders.gift_message   is 'Personal message (max 200 chars)';
comment on column orders.gift_wrap      is 'True when customer requested gift wrapping (+€3.50)';
