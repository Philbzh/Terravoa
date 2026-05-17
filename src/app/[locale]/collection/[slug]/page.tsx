import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Package, MapPin } from 'lucide-react'
import {
  getAllProducts,
  getProductBySlug,
  getProducerBySlug,
  getProductsByProducer,
} from '@/lib/content'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import { SITE_URL } from '@/lib/constants'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { StickyAddToCartBar } from '@/components/cart/StickyAddToCartBar'
import { ProductImageGallery, type GalleryImage } from '@/components/ui/ProductImageGallery'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/ui/ProductCard'
import { ReviewsList } from '@/components/reviews/ReviewsList'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'

export const revalidate = 60

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `${product.name} by ${product.producerName}, from ${product.origin}.`,
    openGraph: {
      images: product.imageSrc.startsWith('http') ? [product.imageSrc] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [tReviews, tNav] = await Promise.all([
    getTranslations('reviews'),
    getTranslations('nav'),
  ])

  const producer = await getProducerBySlug(product.producerSlug)

  // Compose gallery: product image + up to 2 producer images, deduplicated
  const seen = new Set<string>()
  const galleryImages: GalleryImage[] = [
    { src: product.imageSrc, alt: product.imageAlt || product.name },
    producer && { src: producer.heroImageSrc, alt: producer.heroImageAlt || producer.name },
    producer && { src: producer.secondaryImageSrc, alt: producer.secondaryImageAlt || producer.name },
  ]
    .filter((img): img is GalleryImage => !!img && !!img.src)
    .filter((img) => { if (seen.has(img.src)) return false; seen.add(img.src); return true })

  const related = (await getProductsByProducer(product.producerSlug))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageSrc.startsWith('http') ? product.imageSrc : undefined,
    brand: { '@type': 'Brand', name: product.producerName },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: (product.price / 100).toFixed(2),
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/collection/${product.slug}`,
      seller: { '@type': 'Organization', name: product.producerName },
    },
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
          { name: tNav('collection'), path: '/collection' },
          { name: product.name, path: `/collection/${product.slug}` },
        ]}
      />
      <div className="pt-24 pb-24">
        {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mb-10">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Collection
        </Link>
      </div>

      {/* Product detail */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <div className="relative">
            <ProductImageGallery images={galleryImages} />
            {product.badge && (
              <div className="absolute top-4 right-4 z-10">
                <Badge label={product.badge.label} variant={product.badge.variant} />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-outline-variant/20 bg-surface p-6 md:p-8">
            {/* Producer info — prominent, near the top */}
            {producer && (
              <Link
                href={`/producers/${producer.slug}`}
                className="flex items-center gap-4 group mb-6"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden relative shrink-0">
                  <Image
                    src={producer.imageSrc}
                    alt={producer.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized={isExternalUnoptimizedSrc(producer.imageSrc)}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-serif text-base text-primary group-hover:text-secondary transition-colors">
                    {producer.name}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant flex items-center gap-1">
                    <MapPin size={11} strokeWidth={1.5} />
                    {producer.region}, {producer.country}
                  </p>
                </div>
                <span className="text-on-surface-variant group-hover:text-secondary transition-colors text-xs font-sans uppercase tracking-widest flex items-center gap-1">
                  Story <ArrowRight size={12} />
                </span>
              </Link>
            )}

            <h1
              className="font-serif text-primary mb-3 leading-[0.96]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {product.name}
            </h1>
            <p className="font-serif text-2xl text-primary mb-6">
              &euro;{(product.price / 100).toFixed(2)}
            </p>

            <p className="text-on-surface/80 font-sans leading-relaxed mb-7">
              {product.description}
            </p>

            {/* Details */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {product.details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-center gap-2.5 text-on-surface-variant font-sans text-sm rounded-lg border border-outline-variant/20 bg-surface-container-low/30 px-3 py-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>

            {/* Sentinel: StickyAddToCartBar watches this going off-screen */}
            <div id="add-to-cart-sentinel" />
            <AddToCartButton
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageSrc: product.imageSrc,
                imageAlt: product.imageAlt,
                producerName: product.producerName,
                producerSlug: product.producerSlug,
                origin: product.origin,
              }}
            />

            {/* Direct shipping note */}
            <div className="mt-6 rounded-lg border border-outline-variant/20 bg-surface-container-low/30 px-4 py-3 flex items-start gap-3 text-on-surface-variant">
              <Package size={18} strokeWidth={1.5} className="text-secondary shrink-0 mt-0.5" />
              <span className="font-sans text-xs leading-relaxed">
                Shipped directly by {producer ? producer.name : 'the producer'} from {product.origin} for
                maximum freshness and full origin traceability.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="px-6 md:px-16 max-w-7xl mx-auto mt-20">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/20 p-5 md:p-7 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-8 lg:gap-10">
            <div>
              <h2 className="font-serif text-3xl text-primary mb-5">{tReviews('sectionTitle')}</h2>
              <div className="space-y-3 mb-6">
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{tReviews('intro')}</p>
                <p className="font-sans text-sm text-on-surface-variant/90 leading-relaxed">
                  {tReviews('introModeration')}
                </p>
              </div>
              <ReviewsList productSlug={slug} />
            </div>
            <div className="xl:pl-8 xl:border-l xl:border-outline-variant/20">
              <div className="rounded-xl border border-outline-variant/20 bg-surface p-5 md:p-6 xl:sticky xl:top-24">
                <h3 className="font-serif text-xl text-primary mb-5">{tReviews('writeHeading')}</h3>
                <ReviewForm productSlug={slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="px-6 md:px-16 max-w-7xl mx-auto mt-24">
          <h2
            className="font-serif text-primary mb-12"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            More from {product.producerName}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {related.map((p) => (
              <Link key={p.slug} href={`/collection/${p.slug}`}>
                <ProductCard
                  slug={p.slug}
                  name={p.name}
                  price={`€${(p.price / 100).toFixed(2)}`}
                  priceRaw={p.price}
                  origin={p.origin}
                  producer={p.producerName}
                  imageSrc={p.imageSrc}
                  imageAlt={p.imageAlt}
                  badge={p.badge}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>

      <StickyAddToCartBar
        product={{
          slug: product.slug,
          name: product.name,
          price: product.price,
          imageSrc: product.imageSrc,
          imageAlt: product.imageAlt,
          producerName: product.producerName,
          producerSlug: product.producerSlug,
          origin: product.origin,
        }}
      />
    </>
  )
}
