-- Minimal demo data for admin QA/testing.
-- Safe to run multiple times (idempotent by slug/email checks).

-- 1) Producers
insert into public.producers (
  name, slug, region, country, specialty, tagline, story, story_headline, quote,
  image_src, image_alt, status, plan
)
select
  'Demo Olive Estate',
  'demo-olive-estate',
  'Tuscany',
  'Italy',
  'Olive Oil',
  'Family olive groves since 1952.',
  'A small estate producing extra virgin olive oil with early harvest methods.',
  'Tuscan olive oil, estate bottled',
  'We bottle what we harvest.',
  '/images/placeholder-producer.jpg',
  'Olive trees on a hillside',
  'approved',
  'starter'
where not exists (
  select 1 from public.producers p where p.slug = 'demo-olive-estate'
);

insert into public.producers (
  name, slug, region, country, specialty, tagline, story, story_headline, quote,
  image_src, image_alt, status, plan
)
select
  'Demo Honey Farm',
  'demo-honey-farm',
  'Brittany',
  'France',
  'Honey',
  'Single-origin coastal honey.',
  'Family beekeeping operation focused on native flowers and low-intervention extraction.',
  'Coastal honey with floral notes',
  'Good bees, good honey.',
  '/images/placeholder-producer.jpg',
  'Beehives near wild flowers',
  'approved',
  'growth'
where not exists (
  select 1 from public.producers p where p.slug = 'demo-honey-farm'
);

-- 2) Products
with olive_producer as (
  select id from public.producers where slug = 'demo-olive-estate' limit 1
)
insert into public.products (
  producer_id, name, slug, price, origin, description, details, image_src, image_alt,
  badge_label, badge_variant, category, status
)
select
  op.id,
  'Extra Virgin Olive Oil 500ml',
  'demo-evoo-500',
  1890,
  'Tuscany, Italy',
  'Cold-pressed olive oil from early harvest olives.',
  array['Early harvest', 'Cold-pressed', 'Single estate'],
  '/images/placeholder-product.jpg',
  'Bottle of olive oil',
  'Producer',
  'producer',
  'Oils & Condiments',
  'approved'
from olive_producer op
where not exists (
  select 1 from public.products pr where pr.slug = 'demo-evoo-500'
);

with honey_producer as (
  select id from public.producers where slug = 'demo-honey-farm' limit 1
)
insert into public.products (
  producer_id, name, slug, price, origin, description, details, image_src, image_alt,
  badge_label, badge_variant, category, status
)
select
  hp.id,
  'Wildflower Honey 350g',
  'demo-wildflower-honey-350',
  1290,
  'Brittany, France',
  'Small-batch wildflower honey from coastal meadows.',
  array['Raw honey', 'Unfiltered', 'Seasonal harvest'],
  '/images/placeholder-product.jpg',
  'Jar of wildflower honey',
  null,
  null,
  'Honey & Preserves',
  'pending'
from honey_producer hp
where not exists (
  select 1 from public.products pr where pr.slug = 'demo-wildflower-honey-350'
);

-- 3) Producer application (to populate /admin/applications)
insert into public.producer_applications (
  full_name,
  business_name,
  company_registration_country,
  vat_id,
  email,
  country,
  region,
  product_description,
  story,
  shipping_speed,
  status,
  product_categories
)
select
  'Demo Applicant',
  'Mountain Dairy',
  'Spain',
  'ESB12345678',
  'demo.applicant@terravoa.test',
  'Spain',
  'Asturias',
  'Artisan dairy products from mountain pasture milk.',
  'Third-generation dairy with traditional methods.',
  'within48',
  'pending',
  array['cheese']
where not exists (
  select 1 from public.producer_applications pa where pa.email = 'demo.applicant@terravoa.test'
);

-- 4) One order + order items (to populate /admin/orders and /admin/customers)
with
olive_product as (
  select id, producer_id, price from public.products where slug = 'demo-evoo-500' limit 1
),
honey_product as (
  select id, producer_id, price from public.products where slug = 'demo-wildflower-honey-350' limit 1
),
ins_order as (
  insert into public.orders (
    customer_email,
    customer_name,
    shipping_address,
    status,
    total,
    stripe_payment_id
  )
  select
    'demo.customer@terravoa.test',
    'Demo Customer',
    '{"line1":"12 Market Street","city":"Berlin","postal_code":"10115","country":"DE"}'::jsonb,
    'processing',
    coalesce((select price from olive_product), 0) + coalesce((select price from honey_product), 0),
    'pi_demo_001'
  where not exists (
    select 1 from public.orders o where o.customer_email = 'demo.customer@terravoa.test' and o.stripe_payment_id = 'pi_demo_001'
  )
  returning id
),
target_order as (
  select id from ins_order
  union all
  select o.id from public.orders o
  where o.customer_email = 'demo.customer@terravoa.test' and o.stripe_payment_id = 'pi_demo_001'
  limit 1
)
insert into public.order_items (order_id, product_id, producer_id, quantity, price, tracking_number)
select
  to1.id,
  op.id,
  op.producer_id,
  1,
  op.price,
  '1ZDEMOOLIVE001'
from target_order to1
join olive_product op on true
where not exists (
  select 1 from public.order_items oi
  where oi.order_id = to1.id and oi.product_id = op.id
);

with
honey_product as (
  select id, producer_id, price from public.products where slug = 'demo-wildflower-honey-350' limit 1
),
target_order as (
  select o.id from public.orders o
  where o.customer_email = 'demo.customer@terravoa.test' and o.stripe_payment_id = 'pi_demo_001'
  limit 1
)
insert into public.order_items (order_id, product_id, producer_id, quantity, price, tracking_number)
select
  to1.id,
  hp.id,
  hp.producer_id,
  1,
  hp.price,
  null
from target_order to1
join honey_product hp on true
where not exists (
  select 1 from public.order_items oi
  where oi.order_id = to1.id and oi.product_id = hp.id
);

-- 5) Example review (so ratings/reviews screens are not empty)
insert into public.product_reviews (
  product_slug,
  reviewer_name,
  user_id,
  rating,
  body,
  approved
)
select
  'demo-evoo-500',
  'Demo Buyer',
  null,
  4,
  'Excellent flavor and fast delivery. Will buy again.',
  true
where exists (select 1 from public.products where slug = 'demo-evoo-500')
  and not exists (
    select 1
    from public.product_reviews r
    where r.product_slug = 'demo-evoo-500' and r.reviewer_name = 'Demo Buyer'
  );
