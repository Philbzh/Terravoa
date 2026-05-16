import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { absoluteUrl } from '@/lib/site-url'
import type { CartLine } from '@/lib/store/cart-store'
import { routing } from '@/i18n/routing'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireJsonContentType } from '@/lib/http'

const stripeSecret = process.env.STRIPE_SECRET_KEY

function normalizeLocale(raw: unknown): string {
  if (typeof raw !== 'string') return routing.defaultLocale
  return routing.locales.includes(raw as (typeof routing.locales)[number])
    ? raw
    : routing.defaultLocale
}

export async function POST(request: Request) {
  // LOW-9: reject non-JSON bodies early — before hitting the rate limiter.
  const badContentType = requireJsonContentType(request)
  if (badContentType) return badContentType

  // ── Rate limit: 20 checkout attempts per IP per hour ──
  const ip = getClientIp(request)
  const rl = await rateLimit(`checkout:${ip}`, 20, 60 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    )
  }

  if (!stripeSecret) {
    return NextResponse.json(
      { error: 'Payments are not configured.' },
      { status: 503 },
    )
  }

  type GiftData = { isGift?: boolean; recipientName?: string; message?: string; giftWrap?: boolean }
  let body: { items?: CartLine[]; locale?: string; gift?: GiftData; couponCode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const locale = normalizeLocale(body.locale)
  const base = `/${locale}`

  const items = body.items
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // ── Structure validation (slug, quantity only — price comes from DB) ──────
  for (const line of items) {
    if (
      typeof line.slug !== 'string' ||
      !line.slug.trim() ||
      typeof line.quantity !== 'number' ||
      line.quantity < 1 ||
      line.quantity > 99
    ) {
      return NextResponse.json({ error: 'Invalid line item' }, { status: 400 })
    }
  }

  // ── CRIT-2 fix: resolve authoritative prices from the database ────────────
  // The client MUST NOT supply prices. We fetch the canonical price for every
  // slug from the products table and use those values for the Stripe session.
  // If any slug is missing or not approved, the request is rejected outright.
  const admin = createAdminClient()
  const slugs = [...new Set(items.map((l) => l.slug))]

  type DbProductRow = { slug: string; price: number; name: string; status: string; stock_quantity: number | null }

  const { data: dbProductsRaw, error: dbErr } = await admin
    .from('products')
    .select('slug, price, name, status, stock_quantity')
    .in('slug', slugs)
    .eq('status', 'approved')

  if (dbErr) {
    console.error('[checkout] product lookup failed', dbErr.message)
    return NextResponse.json({ error: 'Failed to validate products' }, { status: 500 })
  }

  // Supabase's generic types collapse to `never` with deep joins in this
  // project — cast at the boundary like the rest of the codebase does.
  const dbProducts = (dbProductsRaw ?? []) as DbProductRow[]
  const productMap = new Map<string, DbProductRow>(dbProducts.map((p) => [p.slug, p]))

  for (const line of items) {
    const dbProduct = productMap.get(line.slug)
    if (!dbProduct) {
      return NextResponse.json(
        { error: `Product unavailable: ${line.slug}` },
        { status: 400 },
      )
    }
    // Check stock availability (null = unlimited)
    if (
      (dbProduct as any).stock_quantity !== null &&
      (dbProduct as any).stock_quantity !== undefined &&
      (dbProduct as any).stock_quantity < line.quantity
    ) {
      return NextResponse.json(
        { error: `Insufficient stock for: ${dbProduct.name}` },
        { status: 400 },
      )
    }
  }

  // ── Coupon validation (server-side re-check) ─────────────────────────────
  // The client already validated the code for UX feedback, but we re-check
  // authoritatively here before creating the Stripe session.
  type CouponRow = { id: string; code: string; discount_pct: number; expires_at: string | null; max_uses: number | null; use_count: number; is_active: boolean }
  let appliedCoupon: CouponRow | null = null

  const rawCouponCode = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : ''
  if (rawCouponCode) {
    const { data: couponRow } = await (admin as any)
      .from('coupons')
      .select('id, code, discount_pct, expires_at, max_uses, use_count, is_active')
      .eq('code', rawCouponCode)
      .maybeSingle()

    const coupon = couponRow as CouponRow | null
    const nowValid =
      coupon &&
      coupon.is_active &&
      (!coupon.expires_at || new Date(coupon.expires_at) >= new Date()) &&
      (coupon.max_uses === null || coupon.use_count < coupon.max_uses)

    if (rawCouponCode && !nowValid) {
      return NextResponse.json({ error: 'Coupon is no longer valid.' }, { status: 400 })
    }
    if (nowValid) appliedCoupon = coupon
  }

  const stripe = new Stripe(stripeSecret)

  // ── Gift messaging ───────────────────────────────────────────────────────
  const gift = body.gift
  const isGift       = gift?.isGift === true
  const giftWrap     = isGift && gift?.giftWrap === true
  const giftRecipient = isGift ? (gift?.recipientName ?? '').slice(0, 100).trim() : ''
  const giftMessage   = isGift ? (gift?.message ?? '').slice(0, 200).trim() : ''

  // Unit amounts come exclusively from the DB — never from the client body.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((line) => {
    const dbProduct = productMap.get(line.slug)!
    return {
      price_data: {
        currency: 'eur',
        unit_amount: dbProduct.price,          // ← DB price, not line.priceCents
        product_data: {
          name: dbProduct.name,                // ← DB name, not client-supplied name
          description: `${line.producerName} · ${line.origin}`,
          images: line.imageSrc.startsWith('http')
            ? [line.imageSrc]
            : [absoluteUrl(line.imageSrc)],
        },
      },
      quantity: line.quantity,
    }
  })

  if (giftWrap) {
    lineItems.push({
      price_data: {
        currency: 'eur',
        unit_amount: 350, // €3.50
        product_data: { name: 'Gift wrapping' },
      },
      quantity: 1,
    })
  }

  // ── Build Stripe coupon (percentage discount) ────────────────────────────
  // We use Stripe's built-in coupon/discount mechanism so the discount is
  // visible in the Stripe checkout UI and on the receipt.
  let stripeDiscounts: Stripe.Checkout.SessionCreateParams['discounts'] = undefined
  if (appliedCoupon) {
    // Create a one-off Stripe coupon that matches our DB record
    const stripeCoupon = await stripe.coupons.create({
      percent_off: appliedCoupon.discount_pct,
      duration: 'once',
      name: `${appliedCoupon.code} (${appliedCoupon.discount_pct}% off)`,
      metadata: { terravoa_coupon_id: appliedCoupon.id },
    })
    stripeDiscounts = [{ coupon: stripeCoupon.id }]
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
    success_url: `${absoluteUrl(`${base}/checkout/success`)}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: absoluteUrl(`${base}/checkout`),
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
        'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
        'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'NO', 'GB',
      ],
    },
    phone_number_collection: { enabled: true },
    metadata: {
      cart_slugs: items.map((i) => i.slug).join(','),
      /** `slug::qty|slug::qty` — used by webhooks to create `orders` / `order_items`. */
      cart_lines: items.map((i) => `${i.slug}::${i.quantity}`).join('|'),
      locale,
      is_gift:        isGift ? 'true' : 'false',
      gift_recipient: giftRecipient,
      gift_message:   giftMessage,
      gift_wrap:      giftWrap ? 'true' : 'false',
      coupon_code:    appliedCoupon?.code ?? '',
      coupon_id:      appliedCoupon?.id ?? '',
    },
  })

  if (!session.url) {
    return NextResponse.json(
      { error: 'Could not create checkout session' },
      { status: 500 },
    )
  }

  return NextResponse.json({ url: session.url })
}
