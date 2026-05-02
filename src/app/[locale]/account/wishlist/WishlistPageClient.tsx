'use client'

import { Link } from '@/i18n/navigation'
import { useWishlist } from '@/lib/wishlist'
import { ProductCard } from '@/components/ui/ProductCard'

export function WishlistPageClient() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <p className="font-serif text-2xl text-primary/60">Your wishlist is empty</p>
        <p className="font-sans text-sm text-on-surface-variant max-w-xs mx-auto">
          Discover the collection and save your favourites for later.
        </p>
        <Link
          href="/collection"
          className="inline-block font-sans text-xs uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors underline underline-offset-4"
        >
          Discover the collection
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
      {items.map((product) => (
        <Link key={product.slug} href={`/collection/${product.slug}`}>
          <ProductCard
            slug={product.slug}
            name={product.name}
            price={product.price !== undefined ? `€${(product.price / 100).toFixed(2)}` : ''}
            priceRaw={product.price}
            origin=""
            producer=""
            imageSrc={product.imageSrc ?? '/images/products/placeholder.jpg'}
            imageAlt={product.name}
          />
        </Link>
      ))}
    </div>
  )
}
