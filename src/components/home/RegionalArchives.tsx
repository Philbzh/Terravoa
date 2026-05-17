'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { RegionCard } from '@/components/ui/RegionCard'
import { useTranslations } from 'next-intl'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/motion/variants'
import { motionDurations, motionEase, motionViewport } from '@/lib/motion/tokens'
import { useMotionConfig } from '@/lib/motion/use-motion-config'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Region } from '@/data/demo'

const SCROLL_STEP_RATIO = 0.85

/**
 * Homepage "Regional Archives" — horizontal snap rail with uniform card sizes.
 */
export function RegionalArchives({ regions }: { regions: Region[] }) {
  const t = useTranslations('home.regionalArchives')
  const { reduced, viewport } = useMotionConfig()
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = useCallback(() => {
    const el = railRef.current
    if (!el || reduced) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8)
  }, [reduced])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener('scroll', updateScrollButtons, { passive: true })
    const ro = new ResizeObserver(updateScrollButtons)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollButtons)
      ro.disconnect()
    }
  }, [updateScrollButtons, regions.length])

  const scrollRail = (direction: 'left' | 'right') => {
    const el = railRef.current
    if (!el) return
    const delta = el.clientWidth * SCROLL_STEP_RATIO * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: reduced ? 'auto' : 'smooth' })
  }

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
        <motion.div>
          <motion.div className="h-px w-12 bg-secondary mb-5" />
          <h2
            className="font-serif text-primary leading-[0.92]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-3">
            {t('subtitle')}
          </p>
          {!reduced && regions.length > 3 && (
            <p className="font-sans text-xs text-on-surface-variant/70 mt-2 hidden sm:block">
              {t('scrollHint')}
            </p>
          )}
        </motion.div>
        <Link
          href="/regions"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-4 transition-all duration-300 shrink-0"
        >
          {t('viewAll')} <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </motion.div>

      <div className="relative group/rail">
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 z-10 w-10 md:w-16 region-rail-fade-left',
            reduced && 'hidden',
          )}
          aria-hidden
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:w-16 region-rail-fade-right',
            reduced && 'hidden',
          )}
          aria-hidden
        />

        {!reduced && canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollRail('left')}
            aria-label={t('scrollPrevious')}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-outline-variant/30 bg-surface/95 backdrop-blur-sm shadow-md flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors opacity-0 group-hover/rail:opacity-100 focus:opacity-100"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
        )}
        {!reduced && canScrollRight && (
          <button
            type="button"
            onClick={() => scrollRail('right')}
            aria-label={t('scrollNext')}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-outline-variant/30 bg-surface/95 backdrop-blur-sm shadow-md flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors opacity-0 group-hover/rail:opacity-100 focus:opacity-100 max-sm:opacity-100"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        )}

        <motion.div
          ref={railRef}
          className={cn(
            'flex gap-4 md:gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory',
            'px-6 md:px-16 pb-2 scroll-smooth',
            reduced ? 'flex-wrap' : 'cursor-grab active:cursor-grabbing',
          )}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={viewport}
          transition={{ duration: motionDurations.slow, ease: motionEase.out }}
          onScroll={updateScrollButtons}
        >
          {regions.map((region, i) => (
            <motion.div
              key={region.slug}
              className={cn(
                'snap-center shrink-0',
                reduced
                  ? 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] h-[280px]'
                  : 'w-[min(72vw,360px)] h-[min(58vh,440px)]',
                !reduced && i === regions.length - 1 && 'mr-6 md:mr-16',
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
