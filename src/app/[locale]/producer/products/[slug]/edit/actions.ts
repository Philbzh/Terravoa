'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { logAuditEvent } from '@/lib/audit-log'

export type UpdateProductInput = {
  productId: string
  name: string
  priceEur: string
  category: string
  origin: string
  description: string
  details: string[]
  imageUrl: string
  imageAlt: string
  stockQuantity: string
}

export type UpdateProductResult =
  | { ok: true }
  | { ok: false; error: string }

const NAME_MAX = 120
const ORIGIN_MAX = 120
const DESCRIPTION_MAX = 4_000
const DETAIL_MAX = 240
const DETAILS_COUNT = 6
const IMAGE_URL_MAX = 1_024
const IMAGE_ALT_MAX = 240
const PRICE_MIN_CENTS = 50
const PRICE_MAX_CENTS = 1_000_000
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

export async function updateProducerProduct(
  input: UpdateProductInput,
): Promise<UpdateProductResult> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Please sign in to your producer account.' }
  }

  const admin = createAdminClient() as any
  const producerId = session.producer.id

  // Verify ownership
  const { data: existing } = await admin
    .from('products')
    .select('id, producer_id, slug')
    .eq('id', input.productId)
    .maybeSingle()

  if (!existing || existing.producer_id !== producerId) {
    return { ok: false, error: 'Product not found.' }
  }

  const name = String(input.name ?? '').trim().slice(0, NAME_MAX)
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
  if (!origin) return { ok: false, error: 'Origin is required.' }
  if (!description) return { ok: false, error: 'Description is required.' }
  if (!CATEGORY_WHITELIST.has(category)) {
    return { ok: false, error: 'Please pick a valid category.' }
  }

  const priceCents = Math.round(parseFloat(String(input.priceEur ?? '')) * 100)
  if (!Number.isFinite(priceCents) || priceCents < PRICE_MIN_CENTS || priceCents > PRICE_MAX_CENTS) {
    return { ok: false, error: 'Please enter a valid price between €0.50 and €10 000.' }
  }

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

  // Parse stock quantity — empty string means unlimited (NULL)
  const rawStock = String(input.stockQuantity ?? '').trim()
  let stockQuantity: number | null = null
  if (rawStock !== '') {
    const parsed = parseInt(rawStock, 10)
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { ok: false, error: 'Stock quantity must be 0 or greater.' }
    }
    stockQuantity = parsed
  }

  const { error: updateError } = await admin
    .from('products')
    .update({
      name,
      price: priceCents,
      category,
      origin,
      description,
      details,
      image_src: imageUrl || '/images/placeholder-product.svg',
      image_alt: imageAlt || name,
      stock_quantity: stockQuantity,
    })
    .eq('id', input.productId)
    .eq('producer_id', producerId)

  if (updateError) {
    console.error('[producer] product update failed', updateError.message)
    return { ok: false, error: 'Could not save changes. Please try again.' }
  }

  if (session.email) {
    await logAuditEvent({
      action: 'producer.product.updated',
      actorEmail: session.email,
      entityType: 'product',
      entityId: input.productId,
      metadata: { slug: existing.slug, name, price_cents: priceCents, category },
    })
  }

  revalidatePath('/producer/products')
  revalidatePath(`/collection/${existing.slug}`)
  revalidatePath('/admin/products')
  return { ok: true }
}
