import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { requireJsonContentType } from '@/lib/http'

export async function POST(request: Request) {
  const badContentType = requireJsonContentType(request)
  if (badContentType) return badContentType

  // 10 validation attempts per IP per hour
  const ip = getClientIp(request)
  const rl = await rateLimit(`coupon:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      },
    )
  }

  let body: { code?: string; subtotalCents?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
  if (!code) {
    return NextResponse.json({ error: 'No coupon code provided.' }, { status: 400 })
  }

  const subtotalCents = typeof body.subtotalCents === 'number' ? body.subtotalCents : 0

  const admin = createAdminClient()
  const { data: coupon, error: dbErr } = await (admin as any)
    .from('coupons')
    .select('id, code, discount_pct, expires_at, max_uses, use_count, is_active, description')
    .eq('code', code)
    .maybeSingle()

  if (dbErr) {
    console.error('[coupons] lookup failed', dbErr.message)
    return NextResponse.json({ error: 'Could not validate coupon.' }, { status: 500 })
  }

  if (!coupon || !coupon.is_active) {
    return NextResponse.json({ error: 'Invalid or inactive coupon code.' }, { status: 404 })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired.' }, { status: 410 })
  }

  if (coupon.max_uses !== null && coupon.use_count >= coupon.max_uses) {
    return NextResponse.json({ error: 'This coupon has reached its usage limit.' }, { status: 410 })
  }

  const discountCents = Math.round(subtotalCents * (coupon.discount_pct / 100))

  return NextResponse.json({
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    discountPct: coupon.discount_pct,
    discountCents,
    description: coupon.description ?? null,
  })
}
