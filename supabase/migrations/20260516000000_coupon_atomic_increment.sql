-- Atomic coupon use_count increment that respects max_uses.
-- Called from the Stripe webhook after confirmed payment.
-- Returns the new use_count, or -1 if the coupon was already at max.
CREATE OR REPLACE FUNCTION increment_coupon_use_count(coupon_uuid UUID)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE coupons
  SET use_count = use_count + 1
  WHERE id = coupon_uuid
    AND (max_uses IS NULL OR use_count < max_uses)
  RETURNING use_count INTO new_count;

  IF new_count IS NULL THEN
    RETURN -1;
  END IF;

  RETURN new_count;
END;
$$;
