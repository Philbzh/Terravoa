import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllRegions,
  getRegionBySlug,
  getProductsByRegion,
  getProducersByRegion,
  getStoriesByRegion,
} from '@/lib/content'
import { RegionPageClient } from './RegionPageClient'

export const revalidate = 60

export async function generateStaticParams() {
  const regions = await getAllRegions()
  return regions.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const region = await getRegionBySlug(slug)
  if (!region) return {}
  return {
    title: `${region.name} — Origins | Terravoa`,
    description: region.description || `Discover producers, traditions, and products from ${region.name}.`,
    openGraph: {
      images: region.imageSrc.startsWith('http') ? [region.imageSrc] : undefined,
    },
  }
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const region = await getRegionBySlug(slug)
  if (!region) notFound()

  const [regionProducts, regionProducers, regionStories] = await Promise.all([
    getProductsByRegion(region.name),
    getProducersByRegion(region.name),
    getStoriesByRegion(region.name),
  ])

  return (
    <RegionPageClient
      region={region}
      producers={regionProducers}
      products={regionProducts}
      stories={regionStories}
    />
  )
}
