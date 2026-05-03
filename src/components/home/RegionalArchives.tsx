'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { RegionCard } from '@/components/ui/RegionCard'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import type { Region } from '@/data/demo'

/**
 * Homepage "Regional Archives" section.
 *
 * Regions are passed in from the server component parent (`src/app/[locale]/page.tsx`)
 * via `getAllRegions()` so the homepage automatically stays in sync with the
 * Journal filter bar and the `/regions` index. Previously this component kept
 * a hardcoded array of 6 regions and silently drifted when a new region was
 * added in Sanity / demo data.
 *
 * Layout: the first region becomes the double-height hero card on desktop;
 * the rest flow into a masonry grid underneath.
 */
export function RegionalArchives({ regions }: { regions: Region[] }) {
  const t = useTranslations('home.regionalArchives')

  if (regions.length === 0) return null

  const [heroRegion, ...restRegions] = regions

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 bg-surface-container-low">
      {/* ── Section header ── */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <div>
          <div className="h-px w-12 bg-secondary mb-5" />
          <h2
            className="font-serif text-primary leading-[0.92]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-3">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href="/regions"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-4 transition-all duration-300 shrink-0"
        >
          All regions <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </motion.div>

      {/* ── Masonry grid — first card double height ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
        {/* Hero card — spans 2 rows on sm+, 2 cols × 2 rows on lg */}
        <motion.div
          className="sm:row-span-2 lg:col-span-2 lg:row-span-2 h-full"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8 }}
        >
          <RegionCard
            slug={heroRegion.slug}
            name={heroRegion.name}
            specialty={heroRegion.specialty}
            imageSrc={heroRegion.imageSrc}
            imageAlt={heroRegion.imageAlt}
            href={`/regions/${heroRegion.slug}`}
            className="h-full"
          />
        </motion.div>

        {/* Remaining cards — staggered reveal */}
        {restRegions.map((region, i) => (
          <motion.div
            key={region.slug}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.12 }}
          >
            <RegionCard
              slug={region.slug}
              name={region.name}
              specialty={region.specialty}
              imageSrc={region.imageSrc}
              imageAlt={region.imageAlt}
              href={`/regions/${region.slug}`}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
