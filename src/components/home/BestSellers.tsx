'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import type { Product } from '@/data/demo'

interface Props {
  products: Product[]
}

function formatPrice(cents: number): string {
  return `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * BestSellers
 *
 * "Just show me what works." Distinct from CuratedCollection: surfaces
 * products flagged with badge.variant === 'bestseller'. Targeted by the
 * #bestsellers anchor link in FastPaths.
 *
 * Visually distinct from CuratedCollection: lighter background,
 * eyebrow with star icon to underline the social-proof framing.
 */
export function BestSellers({ products }: Props) {
  const t = useTranslations('home.bestSellers')

  if (products.length === 0) return null

  return (
    <section id="bestsellers" className="py-24 px-6 md:px-16 bg-surface scroll-mt-20">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-5">
            <Star size={14} strokeWidth={2} className="text-secondary fill-secondary" />
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold">
              {t('eyebrow')}
            </p>
          </div>
          <h2
            className="font-serif text-primary leading-[0.92]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-on-surface-variant mt-3">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href="/collection"
          className="hidden sm:inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-4 transition-all duration-300 shrink-0"
        >
          {t('viewAll')} <span aria-hidden>→</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product, i) => (
          <motion.div
            key={product.slug || product.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={product.slug ? `/collection/${product.slug}` : '/collection'}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                price={formatPrice(product.price)}
                priceRaw={product.price}
                origin={product.origin}
                producer={product.producerName}
                imageSrc={product.imageSrc}
                imageAlt={product.imageAlt || product.name}
                badge={product.badge}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
