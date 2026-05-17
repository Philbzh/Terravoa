'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { RegionCard } from '@/components/ui/RegionCard'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion/variants'
import { motionDurations, motionEase, motionViewport } from '@/lib/motion/tokens'
import { useMotionConfig } from '@/lib/motion/use-motion-config'
import type { Region } from '@/data/demo'

/**
 * Homepage "Regional Archives" — horizontal snap rail (signature scroll moment).
 */
export function RegionalArchives({ regions }: { regions: Region[] }) {
  const t = useTranslations('home.regionalArchives')
  const { reduced, viewport } = useMotionConfig()

  if (regions.length === 0) return null

  return (
    <section className="py-24 md:py-32 bg-surface-container-low overflow-hidden">
      <motion.div
        className="px-6 md:px-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12"
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={viewport}
        variants={fadeInUp}
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
          {t('viewAll')} <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </motion.div>

      <div className="relative">
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-10 md:w-16 region-rail-fade-left',
            reduced && 'hidden',
          )}
          aria-hidden
        />
        <motion.div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:w-16 region-rail-fade-right',
            reduced && 'hidden',
          )}
          aria-hidden
        />

        <motion.div
          className={cn(
            'flex gap-4 md:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory',
            'px-6 md:px-16 pb-2',
            reduced ? 'flex-wrap' : '',
          )}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={viewport}
          transition={{ duration: motionDurations.slow, ease: motionEase.out }}
        >
          {regions.map((region, i) => (
            <motion.div
              key={region.slug}
              className={cn(
                'snap-center shrink-0',
                reduced
                  ? 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] h-[280px]'
                  : i === 0
                    ? 'w-[min(88vw,540px)] h-[min(70vh,520px)]'
                    : 'w-[min(72vw,360px)] h-[min(58vh,440px)]',
              )}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ ...motionViewport, margin: '-40px' }}
              transition={{
                duration: motionDurations.slow,
                delay: reduced ? 0 : i * 0.08,
                ease: motionEase.out,
              }}
            >
              <RegionCard
                slug={region.slug}
                name={region.name}
                specialty={region.specialty}
                imageSrc={region.imageSrc}
                imageAlt={region.imageAlt}
                href={`/regions/${region.slug}`}
                className="h-full min-h-[280px]"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
