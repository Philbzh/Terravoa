import { sanityClient, isSanityConfigured } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Producer, Product, Region, Story, StoryKind, SubscriptionInterval } from '@/data/demo'

const qProducts = `*[_type == "product" && defined(slug.current)] | order(name asc) {
  "slug": slug.current,
  name,
  price,
  origin,
  description,
  details,
  category,
  badge,
  image,
  isFeatured,
  featuredOrder,
  isPreOrder,
  preOrderAvailableFrom,
  season,
  subscriptionAvailable,
  subscriptionIntervals,
  subscriptionDiscount,
  producer->{
    "slug": slug.current,
    name,
    region,
    country,
    image,
    heroImage,
    secondaryImage
  }
}`

/** Fetches only products marked isFeatured == true, sorted by featuredOrder then _updatedAt. */
const qFeaturedProducts = `*[_type == "product" && defined(slug.current) && isFeatured == true]
  | order(featuredOrder asc, _updatedAt desc)
  [0...8] {
  "slug": slug.current,
  name,
  price,
  origin,
  description,
  details,
  category,
  badge,
  image,
  isFeatured,
  featuredOrder,
  isPreOrder,
  preOrderAvailableFrom,
  season,
  subscriptionAvailable,
  subscriptionIntervals,
  subscriptionDiscount,
  producer->{
    "slug": slug.current,
    name,
    region,
    country,
    image
  }
}`

const qProducers = `*[_type == "producer" && defined(slug.current)] | order(name asc) {
  "slug": slug.current,
  name,
  region,
  administrativeRegion,
  country,
  specialty,
  tagline,
  storyHeadline,
  story,
  quote,
  image,
  heroImage,
  secondaryImage,
  established,
  badges,
  savoirFaire
}`

const qRegions = `*[_type == "region" && defined(slug.current)] | order(name asc) {
  "slug": slug.current,
  name,
  country,
  specialty,
  description,
  longDescription,
  image,
  productCount,
  producerCount
}`

const qStories = `*[_type == "story" && defined(slug.current)] | order(date desc) {
  "slug": slug.current,
  kind,
  title,
  subtitle,
  excerpt,
  body,
  author,
  date,
  readTime,
  image,
  region,
  "producerSlug": producer->slug.current
}`

type RawProducer = {
  slug: string
  name: string
  region?: string
  administrativeRegion?: string
  country?: string
  specialty?: string
  tagline?: string
  storyHeadline?: string
  story?: string
  quote?: string
  image?: unknown
  heroImage?: unknown
  secondaryImage?: unknown
  established?: string
  badges?: string[]
  savoirFaire?: { title?: string; description?: string }[]
}

function mapProducer(raw: RawProducer): Producer {
  const img = urlForImage(raw.image)
  return {
    slug: raw.slug,
    name: raw.name,
    region: raw.region ?? '',
    administrativeRegion: raw.administrativeRegion ?? '',
    country: raw.country ?? '',
    specialty: raw.specialty ?? '',
    tagline: raw.tagline ?? '',
    story: raw.story ?? '',
    storyHeadline: raw.storyHeadline ?? '',
    quote: raw.quote ?? '',
    imageSrc: img || '/images/products/olive-oil.jpg',
    imageAlt: '',
    heroImageSrc: urlForImage(raw.heroImage) || img || '/images/regions/italy.jpg',
    heroImageAlt: '',
    secondaryImageSrc: urlForImage(raw.secondaryImage) || img || '/images/products/olive-oil.jpg',
    secondaryImageAlt: '',
    established: raw.established ?? '',
    badges: raw.badges ?? [],
    savoirFaire: (raw.savoirFaire ?? []).map((s) => ({
      title: s.title ?? '',
      description: s.description ?? '',
    })),
  }
}

type RawProduct = {
  slug: string
  name: string
  price: number
  origin?: string
  description?: string
  details?: string[]
  category?: string
  badge?: {
    label?: string
    variant?: 'producer' | 'bestseller' | 'new' | 'limited' | 'seasonal' | 'sale'
  }
  image?: unknown
  producer?: RawProducer & { slug: string; name: string }
  isFeatured?: boolean
  featuredOrder?: number
  isPreOrder?: boolean
  preOrderAvailableFrom?: string
  season?: string
  subscriptionAvailable?: boolean
  subscriptionIntervals?: SubscriptionInterval[]
  subscriptionDiscount?: number
}

function mapProduct(raw: RawProduct): Product {
  const img = urlForImage(raw.image)
  const p = raw.producer
  return {
    slug: raw.slug,
    name: raw.name,
    price: raw.price,
    origin: raw.origin ?? '',
    producerSlug: p?.slug ?? '',
    producerName: p?.name ?? '',
    description: raw.description ?? '',
    details: raw.details ?? [],
    imageSrc: img || '/images/products/olive-oil.jpg',
    imageAlt: '',
    category: raw.category ?? '',
    badge:
      raw.badge?.label && raw.badge?.variant
        ? { label: raw.badge.label, variant: raw.badge.variant }
        : undefined,
    isFeatured: raw.isFeatured ?? false,
    featuredOrder: raw.featuredOrder,
    isPreOrder: raw.isPreOrder ?? false,
    preOrderAvailableFrom: raw.preOrderAvailableFrom,
    season: raw.season,
    subscriptionAvailable: raw.subscriptionAvailable ?? false,
    subscriptionIntervals: raw.subscriptionIntervals,
    subscriptionDiscount: raw.subscriptionDiscount,
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) return []
  const raw = await sanityClient.fetch<RawProduct[]>(qFeaturedProducts)
  return raw.map(mapProduct)
}

// ── Homepage collection singleton ────────────────────────────────────────────

/** Shared product projection — reused in both qProducts and the collection query. */
const PRODUCT_PROJECTION = `{
  "slug": slug.current,
  name,
  price,
  origin,
  description,
  details,
  category,
  badge,
  image,
  isPreOrder,
  preOrderAvailableFrom,
  season,
  subscriptionAvailable,
  subscriptionIntervals,
  subscriptionDiscount,
  producer->{
    "slug": slug.current,
    name,
    region,
    country,
    image
  }
}`

export type HomepageCollection = {
  subtitleOverride?: string
  products: Product[]
}

type RawRegion = {
  slug: string
  name: string
  country?: string
  specialty?: string
  description?: string
  longDescription?: string
  image?: unknown
  productCount?: number
  producerCount?: number
}

function mapRegion(raw: RawRegion): Region {
  const img = urlForImage(raw.image)
  return {
    slug: raw.slug,
    name: raw.name,
    country: raw.country ?? '',
    specialty: raw.specialty ?? '',
    description: raw.description ?? '',
    longDescription: raw.longDescription ?? '',
    imageSrc: img || '/images/regions/italy.jpg',
    imageAlt: '',
    productCount: raw.productCount ?? 0,
    producerCount: raw.producerCount ?? 0,
  }
}

type RawStory = {
  slug: string
  kind?: StoryKind
  title: string
  subtitle?: string
  excerpt?: string
  body?: string
  author?: string
  date?: string
  readTime?: string
  image?: unknown
  region?: string
  producerSlug?: string
}

function inferStoryKind(raw: RawStory): StoryKind {
  if (raw.kind === 'regionGuide' || raw.kind === 'producerFeature') return raw.kind
  return raw.producerSlug ? 'producerFeature' : 'regionGuide'
}

function mapStory(raw: RawStory): Story {
  const img = urlForImage(raw.image)
  return {
    slug: raw.slug,
    kind: inferStoryKind(raw),
    title: raw.title,
    subtitle: raw.subtitle ?? '',
    excerpt: raw.excerpt ?? '',
    body: raw.body ?? '',
    author: raw.author ?? '',
    date: raw.date ?? '',
    readTime: raw.readTime ?? '',
    imageSrc: img || '/images/stories/maremma.jpg',
    imageAlt: '',
    region: raw.region ?? '',
    producerSlug: raw.producerSlug,
  }
}

export async function fetchSanityProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) return []
  const raw = await sanityClient.fetch<RawProduct[]>(qProducts)
  return raw.map(mapProduct)
}

export async function fetchSanityProducers(): Promise<Producer[]> {
  if (!isSanityConfigured()) return []
  const raw = await sanityClient.fetch<RawProducer[]>(qProducers)
  return raw.map(mapProducer)
}

export async function fetchSanityRegions(): Promise<Region[]> {
  if (!isSanityConfigured()) return []
  const raw = await sanityClient.fetch<RawRegion[]>(qRegions)
  return raw.map(mapRegion)
}

export async function fetchSanityStories(): Promise<Story[]> {
  if (!isSanityConfigured()) return []
  const raw = await sanityClient.fetch<RawStory[]>(qStories)
  return raw.map(mapStory)
}
