import 'server-only'

/**
 * Sliding-window rate limiter.
 *
 * HIGH-2 fix: when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are
 * set, counters live in Upstash Redis and survive across serverless
 * invocations (that's the only configuration safe for production on Vercel).
 * Without those env vars we fall back to an in-memory Map — correct in a
 * single long-lived Node.js process (e.g. local dev) but ineffective in
 * multi-instance environments. Starting in production, the fallback logs a
 * warning so misconfiguration doesn't go unnoticed.
 *
 * The Redis path uses Upstash's REST API via `fetch`, so the project doesn't
 * need to pull in @upstash/redis / @upstash/ratelimit packages. The protocol:
 *   POST {base}/pipeline
 *   body: JSON array of [ [cmd, ...args], [cmd, ...args] ]
 *   headers: Authorization: Bearer <token>
 *
 * We use an atomic INCR + EXPIRE pipeline — the classic fixed-window counter
 * that's good enough for abuse-prevention (not fairness-critical pacing).
 */

export interface RateLimitResult {
  success: boolean
  remaining: number
  /** Unix ms timestamp when the current window resets */
  resetAt: number
}

// ── In-memory fallback ──────────────────────────────────────────────────────

interface Entry {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, Entry>()
const MEMORY_MAX_ENTRIES = 10_000

const cleanupInterval = setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt < now) memoryStore.delete(key)
  }
  // MED-5 guard: if cleanup didn't prune enough, drop oldest entries.
  if (memoryStore.size > MEMORY_MAX_ENTRIES) {
    const excess = memoryStore.size - MEMORY_MAX_ENTRIES
    const iter = memoryStore.keys()
    for (let i = 0; i < excess; i++) {
      const k = iter.next().value
      if (k) memoryStore.delete(k)
    }
  }
}, 60_000)

if (cleanupInterval.unref) cleanupInterval.unref()

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || entry.resetAt < now) {
    const resetAt = now + windowMs
    memoryStore.set(key, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, resetAt }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

// ── Upstash Redis REST backend ──────────────────────────────────────────────

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '')
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

function redisConfigured(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN)
}

let warnedMissingRedis = false
function warnProductionFallback() {
  if (warnedMissingRedis) return
  warnedMissingRedis = true
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — ' +
        'falling back to in-memory limiter, which is INEFFECTIVE across serverless invocations.',
    )
  }
}

/**
 * Pipeline: INCR key  +  PEXPIRE key windowMs NX  +  PTTL key
 * The NX flag on PEXPIRE ensures the TTL is only set on first hit, so the
 * window is anchored at the first request (fixed window).
 */
async function redisRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // Namespaced under "rl:" so we don't collide with app data on the same DB.
  const k = `rl:${key}`
  const resp = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
    body: JSON.stringify([
      ['INCR', k],
      ['PEXPIRE', k, String(windowMs), 'NX'],
      ['PTTL', k],
    ]),
    // Rate limiter must never block longer than the request itself.
    signal: AbortSignal.timeout?.(1500),
    cache: 'no-store',
  })

  if (!resp.ok) {
    console.warn('[rate-limit] Upstash request failed, falling back', resp.status)
    return memoryRateLimit(key, limit, windowMs)
  }

  const out = (await resp.json()) as Array<{ result: unknown; error?: string }>
  const count = typeof out[0]?.result === 'number' ? (out[0].result as number) : 0
  const pttl = typeof out[2]?.result === 'number' ? (out[2].result as number) : windowMs
  const resetAt = Date.now() + (pttl > 0 ? pttl : windowMs)

  if (count > limit) {
    return { success: false, remaining: 0, resetAt }
  }
  return { success: true, remaining: Math.max(0, limit - count), resetAt }
}

/**
 * Increment + check a rate-limit counter.
 *
 * @param key      Unique key, e.g. `"newsletter:1.2.3.4"`
 * @param limit    Maximum allowed requests per window
 * @param windowMs Window duration in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (redisConfigured()) {
    try {
      return await redisRateLimit(key, limit, windowMs)
    } catch (e) {
      console.warn('[rate-limit] Upstash error, using memory fallback', e)
      return memoryRateLimit(key, limit, windowMs)
    }
  }
  warnProductionFallback()
  return memoryRateLimit(key, limit, windowMs)
}

// ── Client IP extraction ────────────────────────────────────────────────────
//
// LOW-5 fix: `x-forwarded-for` is appended by any client and can be spoofed
// to rotate fake IPs. On Vercel the trusted header set by the infrastructure
// is `x-vercel-forwarded-for` — client-supplied values are stripped. We
// prefer that, then fall back to `x-real-ip`, then parse `x-forwarded-for`
// only when running outside Vercel (e.g. local dev behind a proxy).

export function getClientIp(request: Request): string {
  const vercel = request.headers.get('x-vercel-forwarded-for')
  if (vercel) return vercel.split(',')[0]?.trim() || 'unknown'

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  // Only honour x-forwarded-for when we're clearly NOT on Vercel (otherwise
  // it is trivially spoofable by the client). Presence of VERCEL env var
  // identifies Vercel infrastructure.
  if (!process.env.VERCEL) {
    const xff = request.headers.get('x-forwarded-for')
    if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  }

  return 'unknown'
}

/**
 * Same as `getClientIp`, but reads the Headers object from `next/headers`
 * (server actions / server components). We accept a `Headers` instance so
 * callers don't need to worry about the async `headers()` wrapper.
 */
export function getClientIpFromHeaders(headers: Headers): string {
  const vercel = headers.get('x-vercel-forwarded-for')
  if (vercel) return vercel.split(',')[0]?.trim() || 'unknown'
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  if (!process.env.VERCEL) {
    const xff = headers.get('x-forwarded-for')
    if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  }
  return 'unknown'
}
