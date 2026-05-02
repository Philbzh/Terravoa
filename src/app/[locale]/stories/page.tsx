import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { StoriesClient } from './StoriesClient'
import { getAllRegions, getJournalStories } from '@/lib/content'

export const revalidate = 60

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ region?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'stories' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function StoriesPage({ searchParams }: Props) {
  const [stories, regions, sp] = await Promise.all([
    getJournalStories(),
    getAllRegions(),
    searchParams,
  ])

  // Region filter is URL-driven (`?region=<slug>`). We keep a map of
  // slug → display name (from Regions content) so the filter pills always
  // use the canonical label even if a Story row stores a slightly different
  // casing. Counts are computed over the *full* journal list so admins can
  // see which regions have how much editorial before filtering.
  const slugByName = new Map<string, string>()
  regions.forEach((r) => slugByName.set(r.name.toLowerCase(), r.slug))

  const countsBySlug = new Map<string, number>()
  stories.forEach((s) => {
    const slug = slugByName.get(s.region.toLowerCase())
    if (!slug) return
    countsBySlug.set(slug, (countsBySlug.get(slug) ?? 0) + 1)
  })

  // Show every region that appears on the homepage, even when it has no
  // stories yet. A visible "0" makes the full editorial palette legible
  // and creates anticipation for regions that haven't been written up. The
  // empty bucket still opens the region page (via the "All regions" CTA
  // elsewhere) so it is never a dead end.
  const tabRegions = regions.map((r) => ({
    slug: r.slug,
    name: r.name,
    count: countsBySlug.get(r.slug) ?? 0,
  }))

  const activeSlug = sp.region && tabRegions.some((r) => r.slug === sp.region) ? sp.region : null
  const activeRegionName = activeSlug
    ? (tabRegions.find((r) => r.slug === activeSlug)?.name ?? null)
    : null

  const filteredStories = activeRegionName
    ? stories.filter((s) => s.region.toLowerCase() === activeRegionName.toLowerCase())
    : stories

  return (
    <StoriesClient
      stories={filteredStories}
      regionSlugByName={Object.fromEntries(slugByName)}
      tabRegions={tabRegions}
      activeSlug={activeSlug}
      totalCount={stories.length}
    />
  )
}
