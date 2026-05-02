'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { logAuditEvent } from '@/lib/audit-log'
import { slugify } from '@/lib/utils'
import { getProductLimit, PLAN_CONFIG, isPlanId } from '@/lib/partnership-plans'

export type CreateProductInput = {
  name: string
  slug: string
  priceEur: string
  category: string
  origin: string
  description: string
  details: string[]
  imageUrl: string
  imageAlt: string
}

export type CreateProductResult =
  | { ok: true; slug: string }
  | { ok: false; error: string }

const NAME_MAX         = 120
const SLUG_MAX         = 120
const ORIGIN_MAX       = 120
const DESCRIPTION_MAX  = 4_000
const DETAIL_MAX       = 240
const DETAILS_COUNT    = 6
const IMAGE_URL_MAX    = 1_024
const IMAGE_ALT_MAX    = 240
const PRICE_MIN_CENTS  = 50         // €0.50 — matches client min
const PRICE_MAX_CENTS  = 1_000_000  // €10 000 — guard against runaway inserts
const CATEGORY_WHITELIST = new Set([
  'oilsCondiments',
  'cheeseDairy',
  'honeyPreserves',
  'winesSpirits',
  'breadPastry',
  'charcuterie',
  'spicesHerbs',
  'vinegarFerments',
  'ceramicsCraft',
  'bodyCare',
  'other',
])

/**
 * Create a product for the currently signed-in producer.
 *
 * HIGH-1 fix: the previous client-side insert trusted `producer_id` from the
 * browser, which — in the absence of perfect RLS — could let a producer list
 * products under another producer's account. This action derives `producer_id`
 * from the session server-side, ignoring anything the client might supply.
 *
 * Security invariants:
 *   - Only signed-in producers with `status='approved'` can reach this path
 *     (enforced by `getProducerForSession`, which returns null `producer`
 *     for pending/suspended accounts — MED-8).
 *   - The `producer_id` is taken from the DB row, never from the form.
 *   - Founding-plan product cap is enforced here, not just in the UI.
 *   - All string inputs are length-limited and trimmed before insert.
 */
export async function createProducerProduct(
  input: CreateProductInput,
): Promise<CreateProductResult> {
  const session = await getProducerForSession()
  if (!session) {
    return { ok: false, error: 'Please sign in to your producer account.' }
  }
  if (!session.producer) {
    // Pending/suspended/unlinked accounts
    return {
      ok: false,
      error:
        session.accountState === 'pending'
          ? 'Your producer account is still under review.'
          : session.accountState === 'suspended'
            ? 'Your producer account is currently suspended. Contact support.'
            : 'This account is not linked to an approved producer profile.',
    }
  }

  const name = String(input.name ?? '').trim().slice(0, NAME_MAX)
  const rawSlug = String(input.slug ?? '').trim() || slugify(name)
  const slug = rawSlug.slice(0, SLUG_MAX)
  const origin = String(input.origin ?? '').trim().slice(0, ORIGIN_MAX)
  const description = String(input.description ?? '').trim().slice(0, DESCRIPTION_MAX)
  const category = String(input.category ?? '').trim()
  const imageUrl = String(input.imageUrl ?? '').trim().slice(0, IMAGE_URL_MAX)
  const imageAlt = String(input.imageAlt ?? '').trim().slice(0, IMAGE_ALT_MAX)
  const details = Array.isArray(input.details)
    ? input.details
        .map((d) => String(d ?? '').trim().slice(0, DETAIL_MAX))
        .filter((d) => d.length > 0)
        .slice(0, DETAILS_COUNT)
    : []

  if (!name) return { ok: false, error: 'Product name is required.' }
  if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    return { ok: false, error: 'The URL slug is invalid.' }
  }
  if (!origin) return { ok: false, error: 'Origin is required.' }
  if (!description) return { ok: false, error: 'Description is required.' }
  if (!CATEGORY_WHITELIST.has(category)) {
    return { ok: false, error: 'Please pick a valid category.' }
  }

  const priceCents = Math.round(parseFloat(String(input.priceEur ?? '')) * 100)
  if (!Number.isFinite(priceCents) || priceCents < PRICE_MIN_CENTS || priceCents > PRICE_MAX_CENTS) {
    return { ok: false, error: 'Please enter a valid price between €0.50 and €10 000.' }
  }

  // Optional image URL must be http(s) when present — prevents javascript: etc.
  if (imageUrl) {
    try {
      const u = new URL(imageUrl)
      if (u.protocol !== 'http:' && u.protocol !== 'https:') {
        return { ok: false, error: 'Image URL must start with http or https.' }
      }
    } catch {
      return { ok: false, error: 'Image URL is not valid.' }
    }
  }

  const admin = createAdminClient() as any
  const producerId = session.producer.id
  const producerPlan = (session.producer as { plan: string | null }).plan ?? null

  // Enforce plan-based product cap server-side. `null` = unlimited (Growth +
  // Premium). Uses PLAN_CONFIG as the single source of truth so any future
  // cap change lives in one file.
  const productLimit = getProductLimit(producerPlan)
  if (productLimit !== null) {
    const { count } = await admin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('producer_id', producerId)
    if ((count ?? 0) >= productLimit) {
      const currentPlan = isPlanId(producerPlan) ? producerPlan : 'founding'
      const nextPlan = currentPlan === 'founding' ? 'growth' : 'premium'
      const nextCap = PLAN_CONFIG[nextPlan].productLimit
      return {
        ok: false,
        error:
          `Your ${currentPlan} plan is limited to ${productLimit} products. ` +
          `Upgrade to ${nextPlan} to list ${nextCap === null ? 'unlimited' : `up to ${nextCap}`} products.`,
      }
    }
  }

  const { data: insertedRaw, error: insertError } = await admin
    .from('products')
    .insert({
      producer_id: producerId, // ← derived server-side, never from client
      name,
      slug,
      price: priceCents,
      category,
      origin,
      description,
      details,
      image_src: imageUrl || '/images/placeholder-product.svg',
      image_alt: imageAlt || name,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insertError) {
    // Unique violation on (producer_id, slug) becomes a friendlier message.
    if (insertError.code === '23505') {
      return { ok: false, error: 'You already have a product with this URL slug.' }
    }
    console.error('[producer] product insert failed', insertError.message)
    return { ok: false, error: 'Could not save the product. Please try again.' }
  }

  const inserted = (insertedRaw ?? null) as { id: string } | null

  // LOW-6: best-effort audit trail — never block the producer on a log failure.
  if (inserted?.id && session.email) {
    await logAuditEvent({
      action: 'producer.product.created',
      actorEmail: session.email,
      entityType: 'product',
      entityId: inserted.id,
      metadata: {
        producer_id: producerId,
        slug,
        name,
        price_cents: priceCents,
        category,
      },
    })
  }

  revalidatePath('/producer/products')
  revalidatePath('/admin/products')
  return { ok: true, slug }
}
