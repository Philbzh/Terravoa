import { setRequestLocale } from 'next-intl/server'
import { WishlistPageClient } from './WishlistPageClient'

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl text-primary mb-1">My Wishlist</h1>
        <p className="font-sans text-sm text-on-surface-variant mb-10">
          Items you&apos;ve saved for later
        </p>
        <WishlistPageClient />
      </div>
    </div>
  )
}
