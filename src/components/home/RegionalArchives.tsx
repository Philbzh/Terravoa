'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { RegionCard } from '@/components/ui/RegionCard'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'

const regions = [
  {
    slug: 'brittany',
    name: 'Brittany',
    specialty: 'Fleur de Sel · Salted Caramel · Butter Biscuits',
    imageSrc: '/images/regions/brittany/coast.jpg',
    imageAlt: 'Rocky Atlantic coastline of Brittany with salt marshes at low tide',
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    specialty: 'Olive Oil · Truffles · Pasta',
    imageSrc: '/images/regions/italy.jpg',
    imageAlt: 'Rolling Tuscan hills with cypress trees and terracotta farmhouses',
  },
  {
    slug: 'black-forest',
    name: 'Black Forest',
    specialty: 'Wildflower Honey · Smoked Ham · Spiced Cakes',
    imageSrc: '/images/regions/germany.jpg',
    imageAlt: 'Dense Black Forest pine canopy with morning mist',
  },
  {
    slug: 'andalusia',
    name: 'Andalusia',
    specialty: 'Paprika · Saffron · Preserves',
    imageSrc: '/images/regions/spain-seville.jpg',
    imageAlt: 'Sun-drenched Andalusian village with whitewashed walls',
  },
  {
    slug: 'alentejo',
    name: 'Alentejo',
    specialty: 'Cork · Wine · Sheep Cheese',
    imageSrc: '/images/regions/portugal.jpg',
    imageAlt: 'Golden wheat plains of Alentejo at harvest time',
  },
  {
    slug: 'alsace',
    name: 'Alsace',
    specialty: 'Charcuterie · Mustard · Christmas Spices',
    imageSrc: 'https://picsum.photos/seed/alsace-colmar/800/600',
    imageAlt: 'Colourful half-timbered houses along a canal in Colmar',
  },
]

export function RegionalArchives() {
  const t = useTranslations('home.regionalArchives')

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
            {...regions[0]}
            href={`/regions/${regions[0].slug}`}
            className="h-full"
          />
        </motion.div>

        {/* Remaining cards — staggered reveal */}
        {regions.slice(1).map((region, i) => (
          <motion.div
            key={region.name}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.12 }}
          >
            <RegionCard
              {...region}
              href={`/regions/${region.slug}`}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
