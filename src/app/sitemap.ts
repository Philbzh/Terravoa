import type { MetadataRoute } from 'next'
import { getAllProducts, getAllProducers, getJournalStories, getAllRegions } from '@/lib/content'
import { SITE_URL } from '@/lib/constants'
import { routing } from '@/i18n/routing'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, producers, journalStories, regions] = await Promise.all([
    getAllProducts(),
    getAllProducers(),
    getJournalStories(),
    getAllRegions(),
  ])

  const now = new Date()

  const out: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    const prefix = `${SITE_URL}/${locale}`

    const staticPaths = [
      { path: '', priority: 1, changeFrequency: 'daily' as const },
      { path: '/collection', priority: 0.9, changeFrequency: 'daily' as const },
      { path: '/producers', priority: 0.8, changeFrequency: 'weekly' as const },
      { path: '/regions', priority: 0.7, changeFrequency: 'weekly' as const },
      { path: '/stories', priority: 0.7, changeFrequency: 'weekly' as const },
      { path: '/for-producers', priority: 0.5, changeFrequency: 'monthly' as const },
      { path: '/savoir-faire', priority: 0.55, changeFrequency: 'monthly' as const },
      { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
      { path: '/contact', priority: 0.4, changeFrequency: 'monthly' as const },
      { path: '/terms', priority: 0.35, changeFrequency: 'yearly' as const },
      { path: '/privacy', priority: 0.35, changeFrequency: 'yearly' as const },
      { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
      { path: '/shipping', priority: 0.45, changeFrequency: 'monthly' as const },
      { path: '/returns', priority: 0.45, changeFrequency: 'monthly' as const },
    ]

    for (const s of staticPaths) {
      out.push({
        url: `${prefix}${s.path}`,
        lastModified: now,
        changeFrequency: s.changeFrequency,
        priority: s.priority,
      })
    }

    for (const p of products) {
      out.push({
        url: `${prefix}/collection/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
    for (const p of producers) {
      out.push({
        url: `${prefix}/producers/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
    for (const s of journalStories) {
      out.push({
        url: `${prefix}/stories/${s.slug}`,
        lastModified: new Date(s.date),
        changeFrequency: 'monthly',
        priority: 0.65,
      })
    }
    for (const r of regions) {
      out.push({
        url: `${prefix}/regions/${r.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return out
}
