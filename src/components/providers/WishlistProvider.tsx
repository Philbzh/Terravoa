'use client'

import { WishlistContext, useWishlistState } from '@/lib/wishlist'

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const value = useWishlistState()
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
