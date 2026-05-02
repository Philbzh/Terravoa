import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import {
  getAllRegions,
  getRegionBySlug,
  getProductsByRegion,
  getProducersByRegion,
  getStoriesByRegion,
} from '@/lib/content'
import { ProductCard } from '@/components/ui/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

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
    title: region.name,
    description: region.description || `Explore ${region.specialty} from ${region.name} — ${region.producerCount} producers, ${region.productCount} products.`,
    openGraph: {
      images: region.imageSrc.startsWith('http') ? [region.imageSrc] : undefined,
    },
  }
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const region = await getRegionBySlug(slug)
  if (!region) notFound()

  const regionProducts = await getProductsByRegion(region.name)
  const regionProducers = await getProducersByRegion(region.name)
  const regionStories = await getStoriesByRegion(region.name)

  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-10">
        <Link
          href="/regions"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          All Regions
        </Link>
      </div>

      {/* Hero */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-20">
        <div className="relative h-[420px] md:h-[540px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-container/80 to-tertiary-container/60 mb-10">
          <Image
            src={region.imageSrc}
            alt={region.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1200px"
            priority
            unoptimized={isExternalUnoptimizedSrc(region.imageSrc)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14 z-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-secondary shrink-0" />
              <p className="text-white/60 font-sans text-[10px] uppercase tracking-[0.28em]">
                {region.specialty}
              </p>
            </div>
            <h1
              className="font-serif text-white leading-[0.9]"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
            >
              {region.name}
            </h1>
          </div>
        </div>
        <p className="font-sans text-on-surface/80 leading-relaxed max-w-3xl text-lg">
          {region.longDescription}
        </p>
      </div>

      {/* Producers from this region */}
      {regionProducers.length > 0 && (
        <div className="px-6 md:px-16 max-w-7xl mx-auto mb-24">
          <h2
            className="font-serif text-primary mb-10"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Producers in {region.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regionProducers.map((producer) => (
              <Link
                key={producer.slug}
                href={`/producers/${producer.slug}`}
                className="group bg-surface-container-low rounded-xl p-8 hover:shadow-[0_20px_50px_rgba(26,28,26,0.06)] transition-shadow duration-500"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container-high overflow-hidden relative mb-5">
                  <Image
                    src={producer.imageSrc}
                    alt={producer.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={isExternalUnoptimizedSrc(producer.imageSrc)}
                  />
                </div>
                <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors mb-1">
                  {producer.name}
                </h3>
                <p className="font-serif italic text-on-surface-variant text-sm mb-3">
                  {producer.tagline}
                </p>
                <div className="flex gap-2">
                  {producer.badges.map((badge) => (
                    <Badge key={badge} label={badge} variant="producer" />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products from this region */}
      {regionProducts.length > 0 && (
        <div className="px-6 md:px-16 max-w-7xl mx-auto mb-24">
          <h2
            className="font-serif text-primary mb-10"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Products from {region.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {regionProducts.map((product) => (
              <Link key={product.slug} href={`/collection/${product.slug}`}>
                <ProductCard
                  slug={product.slug}
                  name={product.name}
                  price={`€${(product.price / 100).toFixed(2)}`}
                  priceRaw={product.price}
                  origin={product.origin}
                  producer={product.producerName}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt}
                  badge={product.badge}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stories from this region */}
      {regionStories.length > 0 && (
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <h2
            className="font-serif text-primary mb-10"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Stories from {region.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regionStories.map((story) => (
              <Link
                key={story.slug}
                href={`/stories/${story.slug}`}
                className="group bg-surface-container-low rounded-xl overflow-hidden"
              >
                <div className="aspect-[16/9] relative bg-surface-container-high">
                  <Image
                    src={story.imageSrc}
                    alt={story.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={isExternalUnoptimizedSrc(story.imageSrc)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-8">
                  <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.15em]">
                    {story.readTime} read &bull; {story.date}
                  </span>
                  <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors mt-2 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-on-surface/70 font-sans text-sm line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
