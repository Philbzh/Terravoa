import 'server-only'

import crypto from 'crypto'
import { NextResponse } from 'next/server'

/**
 * Verify a cron-style request by a shared secret.
 *
 * LOW-8 fix: cron routes used to accept the secret via either
 * `Authorization: Bearer <secret>` or an `x-cron-secret` header — two
 * surfaces, one of which we rarely need. We unify on `Authorization: Bearer`,
 * which is what Vercel Cron sends out of the box. The alternate header
 * remains briefly supported (documented deprecation) but only when the
 * `ALLOW_LEGACY_CRON_HEADER` env flag is explicitly enabled, so production
 * can migrate once and then drop the fallback.
 *
 * Returns `null` when authorised; a 401/503 `NextResponse` otherwise.
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function verifyCronAuth(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 503 })
  }

  const bearer = request.headers.get('authorization') ?? ''
  const bearerSecret = bearer.startsWith('Bearer ') ? bearer.slice('Bearer '.length) : ''
  if (bearerSecret && safeEqual(bearerSecret, secret)) return null

  if (process.env.ALLOW_LEGACY_CRON_HEADER === 'true') {
    const headerSecret = request.headers.get('x-cron-secret') ?? ''
    if (headerSecret && safeEqual(headerSecret, secret)) {
      console.warn(
        '[cron-auth] request used deprecated x-cron-secret header; ' +
          'update scheduler to use Authorization: Bearer <CRON_SECRET>',
      )
      return null
    }
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
