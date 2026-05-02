import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notoSerif, manrope } from '@/lib/fonts'
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'
import { routing } from '@/i18n/routing'
import { THEME_INIT_SCRIPT } from '@/lib/theme/init-script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/lib/env' // LOW-2: fail fast on missing critical server env vars
import './globals.css'

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'European producers',
    'artisan food',
    'buy food direct from producers',
    'European artisan marketplace',
    'olive oil',
    'terroir',
    'traditional craftsmanship',
    'small-batch producers',
    'European delicacies',
    'curated food online',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: `${SITE_NAME} — ${SITE_TAGLINE}`,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terravoa_eu',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: process.env.NEXT_PUBLIC_ROBOTS_INDEX === 'true'
    ? { index: true, follow: true, googleBot: { index: true, follow: true } }
    : { index: false, follow: false },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
  /** Absolute URL so localized pages never resolve to /{locale}/manifest.webmanifest by mistake. */
  manifest: `${SITE_URL}/manifest.webmanifest`,
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}

const LOCALE_PATH = new RegExp(`^\\/(${routing.locales.join('|')})(\\/|$)`)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const path = (await headers()).get('x-pathname') ?? ''
  const isStudio = path.startsWith('/studio')
  const htmlLang = path.match(LOCALE_PATH)?.[1] ?? 'en'

  return (
    <html lang={htmlLang} className="scroll-smooth" suppressHydrationWarning>
      {/* Inline script runs synchronously before first paint — prevents flash of wrong theme.
          Content is a static literal from '@/lib/theme/init-script' — see MED-1 note there. */}
      <head>
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${notoSerif.variable} ${manrope.variable} antialiased`}>
        {isStudio ? (
          <div className="fixed inset-0 z-[100] h-dvh overflow-hidden bg-[#101112]">
            {children}
          </div>
        ) : (
          children
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
