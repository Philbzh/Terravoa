import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/** Tweak these to match your risk appetite (approved reviews only). */
export const RATING_ALERT_RULES = {
  /** Red: short window looks bad with enough volume */
  criticalAvg7d: 3,
  minReviews7dCritical: 2,
  criticalAvg30d: 3,
  minReviews30dCritical: 3,
  /** Amber: worth watching */
  warnAvg7d: 3.5,
  minReviews7dWarn: 2,
  warnAvg30d: 3.5,
  minReviews30dWarn: 3,
} as const

export type ProducerRatingRow = {
  producerId: string
  name: string
  slug: string
  /** All approved reviews for this producer’s products */
  reviewCount: number
  avgAll: number | null
  count7d: number
  avg7d: number | null
  count30d: number
  avg30d: number | null
  status: 'ok' | 'warn' | 'critical'
}

type ReviewRow = {
  product_slug: string
  rating: number
  created_at: string
}

function windowStats(
  ratings: { rating: number; created_at: string }[],
  days: number,
): { count: number; avg: number | null } {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  const inWindow = ratings.filter((r) => new Date(r.created_at).getTime() >= cutoff)
  if (inWindow.length === 0) return { count: 0, avg: null }
  const sum = inWindow.reduce((s, r) => s + r.rating, 0)
  return { count: inWindow.length, avg: Math.round((sum / inWindow.length) * 10) / 10 }
}

function allTimeAvg(ratings: { rating: number }[]): number | null {
  if (ratings.length === 0) return null
  const sum = ratings.reduce((s, r) => s + r.rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

function classify(row: Omit<ProducerRatingRow, 'status'>): 'ok' | 'warn' | 'critical' {
  const r = RATING_ALERT_RULES

  const crit7 =
    row.avg7d != null &&
    row.avg7d < r.criticalAvg7d &&
    row.count7d >= r.minReviews7dCritical
  const crit30 =
    row.avg30d != null &&
    row.avg30d < r.criticalAvg30d &&
    row.count30d >= r.minReviews30dCritical
  if (crit7 || crit30) return 'critical'

  const warn7 =
    row.avg7d != null && row.avg7d < r.warnAvg7d && row.count7d >= r.minReviews7dWarn
  const warn30 =
    row.avg30d != null && row.avg30d < r.warnAvg30d && row.count30d >= r.minReviews30dWarn
  if (warn7 || warn30) return 'warn'

  return 'ok'
}

/**
 * Loads approved reviews, maps to producers via products.slug, returns sorted rows + alert count.
 */
export async function getProducerRatingDashboard(): Promise<{
  rows: ProducerRatingRow[]
  alertCount: number
}> {
  const admin = createAdminClient() as any

  const [{ data: reviewsRaw }, { data: productsRaw }, { data: producersRaw }] = await Promise.all([
    admin.from('product_reviews').select('product_slug, rating, created_at').eq('approved', true),
    admin.from('products').select('slug, producer_id'),
    admin.from('producers').select('id, name, slug').eq('status', 'approved'),
  ])

  const reviews = (reviewsRaw ?? []) as ReviewRow[]
  const slugToProducer = new Map<string, string>()
  for (const p of productsRaw ?? []) {
    if (p.slug && p.producer_id) slugToProducer.set(p.slug, p.producer_id)
  }

  const byProducer = new Map<string, { rating: number; created_at: string }[]>()
  for (const rev of reviews) {
    const pid = slugToProducer.get(rev.product_slug)
    if (!pid) continue
    const list = byProducer.get(pid) ?? []
    list.push({ rating: rev.rating, created_at: rev.created_at })
    byProducer.set(pid, list)
  }

  const rows: ProducerRatingRow[] = []

  for (const prod of producersRaw ?? []) {
    const ratings = byProducer.get(prod.id) ?? []
    const w7 = windowStats(ratings, 7)
    const w30 = windowStats(ratings, 30)
    const base = {
      producerId: prod.id,
      name: prod.name,
      slug: prod.slug,
      reviewCount: ratings.length,
      avgAll: allTimeAvg(ratings),
      count7d: w7.count,
      avg7d: w7.avg,
      count30d: w30.count,
      avg30d: w30.avg,
    }
    rows.push({
      ...base,
      status: classify(base),
    })
  }

  rows.sort((a, b) => {
    const order = { critical: 0, warn: 1, ok: 2 }
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
    const av = (a.avg30d ?? a.avgAll ?? 999) - (b.avg30d ?? b.avgAll ?? 999)
    if (av !== 0) return av
    return a.name.localeCompare(b.name)
  })

  const alertCount = rows.filter((r) => r.status !== 'ok').length

  return { rows, alertCount }
}
