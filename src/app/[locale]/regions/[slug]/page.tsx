import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllRegions,
  getRegionBySlug,
  getProductsByRegion,
  getProducersByRegion,
  getStoriesByRegion,
} from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import type { CommunityDiscovery } from '@/data/demo'
import { RegionPageClient } from './RegionPageClient'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { getTranslations } from 'next-intl/server'

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

async function fetchCommunityDiscoveries(regionSlug: string): Promise<CommunityDiscovery[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/community-discovery?region=${regionSlug}`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.discoveries ?? []
  } catch {
    return []
  }
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const region = await getRegionBySlug(slug)
  if (!region) notFound()

  const tRegions = await getTranslations({ locale, namespace: 'regions' })

  const [regionProducts, regionProducers, regionStories, communityDiscoveries] = await Promise.all([
    getProductsByRegion(region.name),
    getProducersByRegion(region.name),
    getStoriesByRegion(region.name),
    fetchCommunityDiscoveries(slug),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: region.name,
    description: region.description,
    image: region.imageSrc.startsWith('http') ? region.imageSrc : undefined,
    url: `${SITE_URL}/regions/${region.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tRegions('title'), path: '/regions' },
          { name: region.name, path: `/regions/${region.slug}` },
        ]}
      />
      <RegionPageClient
        region={region}
        producers={regionProducers}
        products={regionProducts}
        stories={regionStories}
        communityDiscoveries={communityDiscoveries}
      />
    </>
  )
}
