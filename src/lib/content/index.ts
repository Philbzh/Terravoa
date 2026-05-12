import * as demo from '@/data/demo'
import {
  fetchSanityProducts,
  fetchSanityProducers,
  fetchSanityRegions,
  fetchSanityStories,
  fetchFeaturedProducts,
  type HomepageCollection,
} from '@/lib/content/sanity'
import { isSanityConfigured } from '@/sanity/lib/client'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Product, Producer, Region, Story } from '@/data/demo'

export type { HomepageCollection }

function sortStoriesByDateDesc(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => b.date.localeCompare(a.date))
}

// ── Supabase: load approved products + their producers ──────────────────────
async function loadSupabaseProducts(): Promise<Product[]> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('products')
      .select(`
        id, slug, name, price, origin, description, details,
        image_src, image_alt, badge_label, badge_variant, category,
        producers ( slug, name, region, country, featured_placement )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return []

    const mapped = data.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      origin: p.origin,
      producerSlug: p.producers?.slug ?? '',
      producerName: p.producers?.name ?? '',
      description: p.description ?? '',
      details: Array.isArray(p.details) ? p.details : [],
      imageSrc: p.image_src,
      imageAlt: p.image_alt ?? p.name,
      badge: p.badge_label
        ? { label: p.badge_label, variant: p.badge_variant ?? 'producer' }
        : undefined,
      category: p.category,
      _featuredProducer: p.producers?.featured_placement === true,
    }))
    // Products from featured-placement producers bubble to top
    mapped.sort((a: any, b: any) => Number(b._featuredProducer) - Number(a._featuredProducer))
    return mapped
  } catch {
    return []
  }
}

// ── Supabase: load approved producers ───────────────────────────────────────
async function loadSupabaseProducers(): Promise<Producer[]> {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('producers')
      .select('*')
      .eq('status', 'approved')
      .order('featured_placement', { ascending: false })
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return []

    return data.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      region: p.region ?? '',
      administrativeRegion: p.administrative_region ?? '',
      country: p.country ?? '',
      specialty: p.specialty ?? '',
      tagline: p.tagline ?? '',
      story: p.story ?? '',
      storyHeadline: p.story_headline ?? '',
      quote: p.quote ?? '',
      imageSrc: p.image_src ?? '',
      imageAlt: p.image_alt ?? p.name,
      heroImageSrc: p.hero_image_src ?? p.image_src ?? '',
      heroImageAlt: p.hero_image_alt ?? p.name,
      secondaryImageSrc: p.secondary_image_src ?? '',
      secondaryImageAlt: p.secondary_image_alt ?? '',
      established: p.established ?? '',
      badges: p.badges ?? [],
      savoirFaire: p.savoir_faire ?? [],
    }))
  } catch {
    return []
  }
}

// ── Generic helper: try Sanity → Supabase → demo ────────────────────────────
async function resolve<T>(
  sanityLoader: () => Promise<T[]>,
  supabaseLoader: () => Promise<T[]>,
  fallback: T[],
): Promise<T[]> {
  // 1. Try Sanity if configured
  if (isSanityConfigured()) {
    try {
      const data = await sanityLoader()
      if (Array.isArray(data) && data.length > 0) return data
    } catch (e) {
      console.error('[content] Sanity fetch failed.', e)
    }
  }

  // 2. Try Supabase
  const supabaseData = await supabaseLoader()
  if (supabaseData.length > 0) return supabaseData

  // 3. Demo fallback
  return fallback
}

export async function getAllProducts(): Promise<Product[]> {
  return resolve(
    () => fetchSanityProducts(),
    () => loadSupabaseProducts(),
    demo.products,
  )
}

export async function getAllProducers(): Promise<Producer[]> {
  return resolve(
    () => fetchSanityProducers(),
    () => loadSupabaseProducers(),
    demo.producers,
  )
}

export async function getAllRegions(): Promise<Region[]> {
  if (isSanityConfigured()) {
    try {
      const data = await fetchSanityRegions()
      if (data.length > 0) return data
    } catch {}
  }
  return demo.regions
}

export async function getAllStories(): Promise<Story[]> {
  if (isSanityConfigured()) {
    try {
      const data = await fetchSanityStories()
      if (data.length > 0) return data
    } catch {}
  }
  return demo.stories
}

/** Regional guides only — the public Journal index and SEO landing pages. */
export async function getJournalStories(): Promise<Story[]> {
  const all = await getAllStories()
  return sortStoriesByDateDesc(all.filter((s) => s.kind === 'regionGuide'))
}

/** Long-form producer portrait linked from the producer profile (not listed in the Journal). */
export async function getProducerFeatureStory(
  producerSlug: string,
): Promise<Story | undefined> {
  const all = await getAllStories()
  return all.find((s) => s.kind === 'producerFeature' && s.producerSlug === producerSlug)
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getAllProducts()
  return products.find((p) => p.slug === slug)
}

export async function getProducerBySlug(slug: string): Promise<Producer | undefined> {
  const producers = await getAllProducers()
  return producers.find((p) => p.slug === slug)
}

export async function getRegionBySlug(slug: string): Promise<Region | undefined> {
  const regions = await getAllRegions()
  return regions.find((r) => r.slug === slug)
}

/**
 * Resolve a human-readable region name (e.g. "Tuscany", "Black Forest") back
 * to its slug (e.g. "tuscany", "black-forest"). Used to turn `Story.region`
 * into a deep-link target on `/regions/<slug>`.
 *
 * Matching is case-insensitive on the display name. Stories sometimes carry
 * a country name ("Italy", "France") rather than a specific region; in that
 * case we return `undefined` and the caller should render the chip as plain
 * text rather than a broken link.
 */
export async function getRegionSlugByName(name: string): Promise<string | undefined> {
  if (!name) return undefined
  const needle = name.trim().toLowerCase()
  const regions = await getAllRegions()
  return regions.find((r) => r.name.toLowerCase() === needle)?.slug
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  const stories = await getAllStories()
  return stories.find((s) => s.slug === slug)
}

export async function getProductsByProducer(producerSlug: string): Promise<Product[]> {
  const products = await getAllProducts()
  return products.filter((p) => p.producerSlug === producerSlug)
}

/**
 * Returns the products to show in the "Curated Collection" section on the homepage.
 *
 * Resolution order:
 *   1. Sanity products with isFeatured == true, ordered by featuredOrder then updatedAt
 *   2. Supabase products with is_featured == true, ordered by featured_rank
 *   3. First 4 products from the active data source (Supabase or demo)
 *
 * To feature a product: use Sanity Studio or toggle the star in the admin dashboard.
 */
export async function getHomepageProducts(): Promise<HomepageCollection> {
  // 1. Try Sanity
  if (isSanityConfigured()) {
    try {
      const featured = await fetchFeaturedProducts()
      if (featured.length > 0) return { products: featured }
    } catch (e) {
      console.error('[content] Homepage products fetch failed.', e)
    }
  }

  // 2. Try Supabase featured products (admin-toggled)
  try {
    const supabaseFeatured = await loadFeaturedProducts()
    if (supabaseFeatured.length > 0) return { products: supabaseFeatured }
  } catch {
    // fall through
  }

  // 3. No Sanity or nothing published yet — first 4 from Supabase / demo
  const all = await getAllProducts()
  return { products: all.slice(0, 4) }
}

async function loadFeaturedProducts(): Promise<Product[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('products')
    .select(`
      id, slug, name, price, origin, description, details,
      image_src, image_alt, badge_label, badge_variant, category,
      producers ( slug, name, region, country )
    `)
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('featured_rank', { ascending: true, nullsFirst: false })
    .limit(8)

  if (error || !data || data.length === 0) return []

  return data.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    origin: p.origin,
    producerSlug: p.producers?.slug ?? '',
    producerName: p.producers?.name ?? '',
    description: p.description ?? '',
    details: Array.isArray(p.details) ? p.details : [],
    imageSrc: p.image_src,
    imageAlt: p.image_alt ?? p.name,
    badge: p.badge_label
      ? { label: p.badge_label, variant: p.badge_variant ?? 'producer' }
      : undefined,
    category: p.category,
  }))
}

/**
 * Returns products flagged as bestsellers (badge.variant === 'bestseller').
 * Used by the homepage BestSellers section to give first-time visitors
 * a clear "show me what works" entry point.
 */
export async function getBestSellers(): Promise<Product[]> {
  const all = await getAllProducts()
  return all.filter((p) => p.badge?.variant === 'bestseller')
}

export async function getProductsByRegion(regionName: string): Promise<Product[]> {
  const products = await getAllProducts()
  return products.filter((p) => p.origin === regionName)
}

export async function getProducersByRegion(regionName: string): Promise<Producer[]> {
  const producers = await getAllProducers()
  return producers.filter((p) => p.region === regionName || p.country === regionName)
}

export async function getStoriesByRegion(regionName: string): Promise<Story[]> {
  const stories = await getAllStories()
  return sortStoriesByDateDesc(
    stories.filter((s) => s.kind === 'regionGuide' && s.region === regionName),
  )
}
