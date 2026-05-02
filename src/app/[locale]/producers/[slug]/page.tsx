import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getAllProducers,
  getProducerBySlug,
  getProductsByProducer,
  getProducerFeatureStory,
} from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { ProducerProfile } from './ProducerProfile'

export const revalidate = 60

export async function generateStaticParams() {
  const producers = await getAllProducers()
  return producers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const producer = await getProducerBySlug(slug)
  if (!producer) return {}
  return {
    title: producer.name,
    description: producer.tagline || `Discover ${producer.name} — ${producer.specialty} from ${producer.region}, ${producer.country}.`,
    openGraph: {
      images: producer.imageSrc.startsWith('http') ? [producer.imageSrc] : undefined,
    },
  }
}

export default async function ProducerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const producer = await getProducerBySlug(slug)
  if (!producer) notFound()

  const producerProducts = await getProductsByProducer(slug)
  const featureStory = await getProducerFeatureStory(slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: producer.name,
    description: producer.tagline,
    image: producer.imageSrc.startsWith('http') ? producer.imageSrc : undefined,
    address: {
      '@type': 'PostalAddress',
      addressRegion: producer.region,
      addressCountry: producer.country,
    },
    url: `${SITE_URL}/producers/${producer.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProducerProfile
        producer={producer}
        products={producerProducts}
        featureStory={featureStory}
      />
    </>
  )
}
