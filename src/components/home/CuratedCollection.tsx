'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ui/ProductCard'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/data/demo'

interface Props {
  products: Product[]
  subtitleOverride?: string
}

function formatPrice(cents: number): string {
  return `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function CuratedCollection({ products, subtitleOverride }: Props) {
  const t = useTranslations('home.curatedCollection')

  return (
    <section className="relative py-28 md:py-36 px-6 md:px-16 bg-primary overflow-hidden">
      {/* Ghosted backdrop word */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-start justify-end overflow-hidden pointer-events-none"
      >
        <span
          className="font-serif text-on-primary/[0.03] leading-none select-none -mt-8 pr-4"
          style={{ fontSize: 'clamp(10rem, 28vw, 26rem)' }}
        >
          Curated
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div>
            <div className="flex items-center gap-5 mb-6">
              <div className="h-px w-14 bg-secondary shrink-0" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold">
                {subtitleOverride ?? t('subtitle')}
              </span>
            </div>
            <h2
              className="font-serif text-on-primary leading-[0.92]"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)' }}
            >
              {t('title')}
            </h2>
          </div>
          <Link
            href="/collection"
            className="hidden sm:inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-4 transition-all duration-300 shrink-0"
          >
            {t('viewAll')} <ArrowRight size={12} strokeWidth={2} />
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
                  invertText
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-12 text-center">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-secondary font-semibold"
          >
            {t('viewAll')} <ArrowRight size={12} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
