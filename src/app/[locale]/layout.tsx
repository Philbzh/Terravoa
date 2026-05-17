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
import { SmoothScroll } from '@/components/providers/SmoothScroll'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { routing } from '@/i18n/routing'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { openGraphLocaleForAppLocale } from '@/lib/seo/open-graph-locale'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type SeoMessages = {
  defaultTitle: string
  defaultDescription: string
  keywords: string[]
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

  const messages = await getMessages({ locale })
  const seo = messages.seo as SeoMessages

  const defaultTitle = seo.defaultTitle
  const defaultDescription = seo.defaultDescription
  const keywords = seo.keywords

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: defaultDescription,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      url: canonical,
      siteName: defaultTitle,
      title: defaultTitle,
      description: defaultDescription,
      locale: ogLocale,
      alternateLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@terravoa_eu',
      title: defaultTitle,
      description: defaultDescription,
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
          <SmoothScroll>
            <WishlistProvider>
              <Navbar />
              <PageTransition>{children}</PageTransition>
            <Footer />
            <CookieBanner />
            <SearchModal />
            <CartFlyAnimation />
            <ScrollToTop />
            </WishlistProvider>
          </SmoothScroll>
        </ThemeProvider>
      </PostHogProvider>
    </NextIntlClientProvider>
  )
}
