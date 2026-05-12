-- Featured products: allow admins to feature products on the homepage
-- with a sortable rank controlling display order.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_rank integer DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_products_featured
  ON products (is_featured, featured_rank)
  WHERE is_featured = true;
