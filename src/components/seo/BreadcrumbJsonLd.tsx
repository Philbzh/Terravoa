import { SITE_URL } from '@/lib/constants'

export type BreadcrumbItem = {
  name: string
  /** App path without locale, e.g. `/collection` or `/collection/olive-oil` */
  path: string
}

type Props = {
  locale: string
  items: BreadcrumbItem[]
}

function absoluteUrl(locale: string, path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}/${locale}${normalized}`
}

/**
 * Schema.org BreadcrumbList for product, region, story, and producer detail pages.
 */
export function BreadcrumbJsonLd({ locale, items }: Props) {
  if (items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      suppressHydrationWarning
    />
  )
}
