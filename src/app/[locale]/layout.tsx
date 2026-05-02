import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'
import { SearchModal } from '@/components/search/SearchModal'
import { CartFlyAnimation } from '@/components/cart/CartFlyAnimation'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { WishlistProvider } from '@/components/providers/WishlistProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { routing } from '@/i18n/routing'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'
import { openGraphLocaleForAppLocale } from '@/lib/seo/open-graph-locale'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const h = await headers()
  const raw = h.get('x-pathname')?.split('?')[0] ?? `/${locale}`
  const segments = raw.split('/').filter(Boolean)
  const first = segments[0]
  const pathAfterLocale =
    first && routing.locales.includes(first as (typeof routing.locales)[number])
      ? segments.slice(1).join('/')
      : segments.join('/')
  const suffix = pathAfterLocale ? `/${pathAfterLocale}` : ''

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}${suffix}`
  }
  languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${suffix}`

  const canonical = `${SITE_URL}/${locale}${suffix}`

  const ogLocale = openGraphLocaleForAppLocale(locale)
  const alternateLocale = routing.locales
    .filter((l) => l !== locale)
    .map((l) => openGraphLocaleForAppLocale(l))

  return {
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      url: canonical,
      siteName: `${SITE_NAME} — ${SITE_TAGLINE}`,
      locale: ogLocale,
      alternateLocale,
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SiteJsonLd locale={locale} />
      <PostHogProvider>
        <ThemeProvider>
          <WishlistProvider>
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
            <CookieBanner />
            <SearchModal />
            <CartFlyAnimation />
            <ScrollToTop />
          </WishlistProvider>
        </ThemeProvider>
      </PostHogProvider>
    </NextIntlClientProvider>
  )
}
