import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { EuropeStrip } from '@/components/home/EuropeStrip'
import { HowItWorks } from '@/components/home/HowItWorks'
import { StoryOfTheWeek } from '@/components/home/StoryOfTheWeek'
import { RegionalArchives } from '@/components/home/RegionalArchives'
import { CuratedCollection } from '@/components/home/CuratedCollection'
import { CuratorsPromise } from '@/components/home/CuratorsPromise'
import { ProducerCTA } from '@/components/home/ProducerCTA'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { getJournalStories, getHomepageProducts, getAllRegions } from '@/lib/content'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'

/** Homepage title/description tuned for search while matching brand positioning. */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${SITE_TAGLINE} — Curated European Artisan Food`,
    description: SITE_DESCRIPTION,
    openGraph: {
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
    },
  }
}

export default async function HomePage() {
  const [journal, homepage, regions] = await Promise.all([
    getJournalStories(),
    getHomepageProducts(),
    getAllRegions(),
  ])
  const journalHighlight = journal[0]

  return (
    <>
      <Hero />
      <CuratedCollection
        products={homepage.products}
        subtitleOverride={homepage.subtitleOverride}
      />
      <EuropeStrip />
      <HowItWorks />
      {journalHighlight ? <StoryOfTheWeek story={journalHighlight} /> : null}
      <RegionalArchives regions={regions} />
      <TestimonialsSection />
      <CuratorsPromise />
      <ProducerCTA />
    </>
  )
}
