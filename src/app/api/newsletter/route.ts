import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { requireJsonContentType } from '@/lib/http'

// RFC 5322-inspired but practical: must have local@domain.tld
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: Request) {
  // LOW-9: enforce application/json content-type.
  const badContentType = requireJsonContentType(req)
  if (badContentType) return badContentType

  // ── Rate limit: 5 subscriptions per IP per hour ──
  const ip = getClientIp(req)
  const rl = await rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)
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

  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    // ── Validate email format properly ──
    if (!email || !EMAIL_REGEX.test(email) || email.length > 320) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await (admin as any)
      .from('newsletter_subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true })

    if (error) {
      console.error('[newsletter] upsert error:', error.message)
      return NextResponse.json({ error: 'Could not subscribe' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
