-- Add stock tracking to products.
-- NULL means unlimited/untracked (default for existing products).
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT NULL;

-- Atomic stock decrement used during checkout webhook processing.
-- Returns the new stock level, or -1 if insufficient stock.
CREATE OR REPLACE FUNCTION decrement_product_stock(product_slug TEXT, qty INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  new_stock INT;
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - qty
  WHERE slug = product_slug
    AND stock_quantity IS NOT NULL
    AND stock_quantity >= qty
  RETURNING stock_quantity INTO new_stock;

  -- NULL means either product not found, or stock is untracked (NULL column)
  IF new_stock IS NULL THEN
    -- Check if product has untracked stock (NULL = unlimited)
    PERFORM 1 FROM products WHERE slug = product_slug AND stock_quantity IS NULL;
    IF FOUND THEN
      RETURN 0; -- untracked, allow
    END IF;
    RETURN -1; -- insufficient stock
  END IF;

  RETURN new_stock;
END;
$$;
