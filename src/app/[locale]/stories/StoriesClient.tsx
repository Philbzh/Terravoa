'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import type { Story } from '@/data/demo'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'

type TabRegion = { slug: string; name: string; count: number }

/**
 * Journal index — chronological list of region guides, now with a region
 * filter bar at the top. Region chips on each card link into the matching
 * `/regions/<slug>` page when we can resolve a slug for the story's region
 * name; for country-only tags ("Italy", "France") they render as plain text.
 */
export function StoriesClient({
  stories,
  regionSlugByName,
  tabRegions,
  activeSlug,
  totalCount,
}: {
  stories: Story[]
  /** lowercased region display name → region slug */
  regionSlugByName: Record<string, string>
  tabRegions: TabRegion[]
  activeSlug: string | null
  /** Number of stories before the region filter was applied — powers the "All" tab count. */
  totalCount: number
}) {
  const t = useTranslations('stories')

  function slugFor(regionName: string): string | undefined {
    return regionSlugByName[regionName.trim().toLowerCase()]
  }

  return (
    <PageContainer>
      <SectionHeader kicker="Journal" title={t('title')} subtitle={t('subtitle')} />

      {/* Region filter — URL-driven `?region=<slug>`. Every region from the
          homepage "Regional Archives" appears here so the editorial scope is
          visible at a glance. Empty buckets (count 0) still render, giving
          readers a sense of what's coming and a path to the region page via
          the "All regions" CTA below. */}
      {tabRegions.length > 0 && (
        <nav
          className="mb-8 flex flex-wrap gap-2 items-center"
          aria-label={t('filterByRegion')}
        >
          <Link
            href="/stories"
            aria-current={activeSlug === null ? 'page' : undefined}
            className={`inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-colors ${
              activeSlug === null
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/25 hover:border-primary/40 hover:text-primary'
            }`}
          >
            {t('allRegions')}
            <span
              className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                activeSlug === null
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'bg-outline-variant/15 text-on-surface-variant'
              }`}
            >
              {totalCount}
            </span>
          </Link>
          {tabRegions.map((r) => {
            const isActive = activeSlug === r.slug
            const isEmpty = r.count === 0
            return (
              <Link
                key={r.slug}
                href={`/stories?region=${r.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-colors ${
                  isActive
                    ? 'bg-primary text-on-primary border-primary'
                    : isEmpty
                      ? 'bg-surface-container-lowest text-on-surface-variant/60 border-outline-variant/20 hover:border-primary/30 hover:text-primary'
                      : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/25 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {r.name}
                <span
                  className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                    isActive
                      ? 'bg-on-primary/20 text-on-primary'
                      : 'bg-outline-variant/15 text-on-surface-variant'
                  }`}
                >
                  {r.count}
                </span>
              </Link>
            )
          })}
        </nav>
      )}

      {/* "All regions" CTA — resolves the "how do I get to /regions from the
          Journal?" navigation gap. Always visible, even when the filter bar
          is collapsed. */}
      <div className="mb-12 flex justify-start">
        <Link
          href="/regions"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-3 transition-all duration-300"
        >
          {t('browseAllRegions')}
          <ArrowRight size={12} strokeWidth={2} />
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant mb-5">
            {t('noStoriesForRegion')}
          </p>
          {activeSlug && (
            <Link
              href={`/regions/${activeSlug}`}
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary font-semibold hover:gap-3 transition-all duration-300"
            >
              {t('visitRegionPage')}
              <ArrowRight size={12} strokeWidth={2} />
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-outline-variant/10">
          {stories.map((story, i) => {
            const regionSlug = slugFor(story.region)
            return (
              <motion.div
                key={story.slug}
                className={i > 0 ? 'pt-16' : ''}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i === 0 ? 0.1 : 0 }}
              >
                <div className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-16">
                  {/* Image wrapper — the whole image is a link to the story,
                      but the overlay region chip is its own link so users
                      can pivot to the region page without reading the story
                      first. */}
                  <div
                    className={`aspect-[16/10] rounded-2xl overflow-hidden relative bg-surface-container-high ${
                      i % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <Link href={`/stories/${story.slug}`} className="absolute inset-0 z-[1]" aria-label={story.title}>
                      <Image
                        src={story.imageSrc}
                        alt={story.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority={i < 2}
                        unoptimized={isExternalUnoptimizedSrc(story.imageSrc)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />
                    </Link>
                    <div className="absolute bottom-6 left-6 z-[2]">
                      {regionSlug ? (
                        <Link
                          href={`/regions/${regionSlug}`}
                          className="bg-surface/88 backdrop-blur-md text-primary font-sans text-[10px] uppercase tracking-[0.22em] px-4 py-2 rounded-full shadow-sm hover:bg-surface transition-colors"
                        >
                          {story.region}
                        </Link>
                      ) : (
                        <span className="bg-surface/88 backdrop-blur-md text-primary font-sans text-[10px] uppercase tracking-[0.22em] px-4 py-2 rounded-full shadow-sm">
                          {story.region}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/stories/${story.slug}`}
                    className={i % 2 === 1 ? 'lg:order-1' : ''}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-px w-12 bg-secondary shrink-0" />
                      <span className="font-sans text-xs uppercase tracking-[0.22em] text-secondary font-semibold">
                        {story.readTime} read
                      </span>
                    </div>

                    <h2
                      className="font-serif text-primary mb-4 leading-[0.95] group-hover:text-secondary transition-colors duration-300"
                      style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
                    >
                      {story.title}
                    </h2>

                    <p className="font-serif italic text-on-surface-variant text-lg leading-relaxed mb-5">
                      {story.subtitle}
                    </p>

                    <p className="font-sans text-sm text-on-surface/65 leading-relaxed mb-8 max-w-lg">
                      {story.excerpt}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <span className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant/60">
                        {story.author} &bull;{' '}
                        {new Date(story.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <ArrowRight
                        size={16}
                        strokeWidth={2}
                        className="text-secondary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300 shrink-0"
                      />
                    </div>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
