import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, COMPANY_LEGAL_NAME } from '@/lib/constants'
import { routing } from '@/i18n/routing'

type Props = { locale: string }

/**
 * Organization + WebSite structured data (JSON-LD) for rich results eligibility.
 * SearchAction targets the collection page `q` query used by CollectionClient.
 */
export function SiteJsonLd({ locale }: Props) {
  const safeLocale = routing.locales.includes(locale as (typeof routing.locales)[number])
    ? locale
    : routing.defaultLocale

  const logoUrl = `${SITE_URL}/apple-icon.png`
  const searchTemplate = `${SITE_URL}/${safeLocale}/collection?q={search_term_string}`

  const sameAs = [process.env.NEXT_PUBLIC_SOCIAL_PROFILE_URL_1, process.env.NEXT_PUBLIC_SOCIAL_PROFILE_URL_2]
    .map((u) => u?.trim())
    .filter((u): u is string => Boolean(u))

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: logoUrl },
    description: SITE_DESCRIPTION,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@terravoa.com',
      contactType: 'customer service',
      availableLanguage: ['English', 'German', 'French', 'Italian', 'Spanish', 'Portuguese'],
    },
  }

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: `${SITE_NAME} — Taste the Origin`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: ['en', 'de', 'fr', 'it', 'es', 'pt'],
    potentialAction: {
      '@type': 'SearchAction',
      target: searchTemplate,
      'query-input': 'required name=search_term_string',
    },
  }

  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [organization, website],
  })

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} suppressHydrationWarning />
  )
}
