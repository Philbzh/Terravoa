import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireJsonContentType } from '@/lib/http'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const badContentType = requireJsonContentType(request)
  if (badContentType) return badContentType

  const ip = getClientIp(request)
  const rl = await rateLimit(`cart-abandon:${ip}`, 30, 60 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { email?: string; cart?: unknown; locale?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const cart = body.cart
  const locale = typeof body.locale === 'string' ? body.locale.slice(0, 5) : 'en'

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const admin = createAdminClient() as any

  // Upsert: update existing cart for this email, or create new
  const { data: existing } = await admin
    .from('abandoned_carts')
    .select('id')
    .eq('email', email)
    .is('recovered_at', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    await admin
      .from('abandoned_carts')
      .update({
        cart_json: cart,
        locale,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    await admin
      .from('abandoned_carts')
      .insert({
        email,
        cart_json: cart,
        locale,
      })
  }

  return NextResponse.json({ ok: true })
}
