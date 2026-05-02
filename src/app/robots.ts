import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
  const shouldIndex = process.env.NEXT_PUBLIC_ROBOTS_INDEX === 'true'

  return {
    rules: shouldIndex
      ? [
          {
            userAgent: '*',
            allow: '/',
            disallow: [
              '/admin/',
              '/producer/',
              '/account/',
              '/checkout/',
              '/cart',
              '/api/',
              '/studio/',
              '/login/',
            ],
          },
        ]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: shouldIndex ? `${SITE_URL}/sitemap.xml` : undefined,
  }
}
