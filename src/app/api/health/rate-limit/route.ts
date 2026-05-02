import { NextResponse } from 'next/server'
import { verifyCronAuth } from '@/lib/cron-auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * Diagnostic health check for the rate limiter.
 *
 * Confirms that:
 *   1. Upstash Redis env vars are set.
 *   2. A round-trip to Upstash succeeds (actual network + auth check).
 *   3. The counter is returning sane numbers.
 *   4. Which forwarded-IP header the edge is delivering.
 *
 * Gated by CRON_SECRET (reusing the cron auth helper) because it leaks
 * a little bit of operational detail that shouldn't be publicly readable.
 *
 * Typical usage:
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *        https://terravoa.com/api/health/rate-limit
 *
 * Response is never cached.
 *
 * NOTE: this folder is named `health` (not `_health`). Next.js treats any
 * folder prefixed with `_` as a private folder and excludes it from the
 * router, so `/api/_health/...` would return 404.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const unauthorised = verifyCronAuth(request)
  if (unauthorised) return unauthorised

  const now = Date.now()
  const probeKey = `healthcheck:${now}`

  const redisConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  )

  let firstHit: Awaited<ReturnType<typeof rateLimit>> | null = null
  let secondHit: Awaited<ReturnType<typeof rateLimit>> | null = null
  let error: string | null = null

  try {
    firstHit = await rateLimit(probeKey, 5, 10_000)
    secondHit = await rateLimit(probeKey, 5, 10_000)
  } catch (e) {
    error = e instanceof Error ? e.message : String(e)
  }

  const counterAdvanced =
    firstHit != null &&
    secondHit != null &&
    firstHit.remaining === secondHit.remaining + 1

  // Report which header the upstream proxy is actually sending — lets us
  // spot misconfigured reverse proxies in front of the app.
  const ipSource = (() => {
    if (request.headers.get('x-vercel-forwarded-for')) return 'x-vercel-forwarded-for'
    if (request.headers.get('x-real-ip')) return 'x-real-ip'
    if (request.headers.get('x-forwarded-for')) return 'x-forwarded-for'
    return 'none'
  })()

  const ip = getClientIp(request)

  // "healthy" means: we intended to use Redis and it worked, OR we're in a
  // non-production environment where the memory fallback is fine.
  const healthy =
    error == null &&
    counterAdvanced &&
    (redisConfigured || process.env.NODE_ENV !== 'production')

  const body = {
    healthy,
    redis: {
      configured: redisConfigured,
      url_host: process.env.UPSTASH_REDIS_REST_URL
        ? safeHost(process.env.UPSTASH_REDIS_REST_URL)
        : null,
    },
    counter: {
      advanced: counterAdvanced,
      first: firstHit,
      second: secondHit,
    },
    ip: {
      detected: ip,
      source: ipSource,
      on_vercel: Boolean(process.env.VERCEL),
    },
    env: process.env.NODE_ENV,
    error,
  }

  return NextResponse.json(body, {
    status: healthy ? 200 : 503,
    headers: { 'cache-control': 'no-store' },
  })
}

function safeHost(url: string): string {
  try {
    return new URL(url).host
  } catch {
    return 'invalid-url'
  }
}
