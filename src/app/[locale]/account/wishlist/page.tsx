import { setRequestLocale, getTranslations } from 'next-intl/server'
import { WishlistPageClient } from './WishlistPageClient'

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'accountWishlist' })

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-primary mb-1">{t('title')}</h1>
        <p className="font-sans text-sm text-on-surface-variant mb-10">
          {t('subtitle')}
        </p>
        <WishlistPageClient />
      </div>
    </div>
  )
}
