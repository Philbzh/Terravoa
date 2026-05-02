'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const LS_KEY = 'terravoa-wishlist'

/** Row shape from `wishlists` (not always present in generated DB types). */
type WishlistDbRow = {
  product_slug: string
  product_name: string
  product_price: number | null
  product_image: string | null
}

export interface WishlistProduct {
  slug: string
  name: string
  price?: number
  imageSrc?: string
}

interface WishlistContextValue {
  items: WishlistProduct[]
  isInWishlist: (slug: string) => boolean
  toggle: (product: WishlistProduct) => Promise<void>
  count: number
}

export const WishlistContext = createContext<WishlistContextValue>({
  items: [],
  isInWishlist: () => false,
  toggle: async () => {},
  count: 0,
})

export function useWishlist() {
  return useContext(WishlistContext)
}

function readLocalStorage(): WishlistProduct[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeLocalStorage(items: WishlistProduct[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

export function useWishlistState(): WishlistContextValue {
  const [items, setItems] = useState<WishlistProduct[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        await migrateLocalToSupabase(supabase, user.id)
        const { data } = await supabase
          .from('wishlists')
          .select('product_slug, product_name, product_price, product_image')
          .eq('user_id', user.id)
        if (data) {
          const rows = data as WishlistDbRow[]
          setItems(
            rows.map((r) => ({
              slug: r.product_slug,
              name: r.product_name,
              price: r.product_price ?? undefined,
              imageSrc: r.product_image ?? undefined,
            })),
          )
        }
      } else {
        setUserId(null)
        setItems(readLocalStorage())
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        await migrateLocalToSupabase(supabase, session.user.id)
        const { data } = await supabase
          .from('wishlists')
          .select('product_slug, product_name, product_price, product_image')
          .eq('user_id', session.user.id)
        if (data) {
          const rows = data as WishlistDbRow[]
          setItems(
            rows.map((r) => ({
              slug: r.product_slug,
              name: r.product_name,
              price: r.product_price ?? undefined,
              imageSrc: r.product_image ?? undefined,
            })),
          )
        }
      } else {
        setUserId(null)
        setItems(readLocalStorage())
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const toggle = useCallback(async (product: WishlistProduct) => {
    const supabase = createClient()
    const already = items.some((i) => i.slug === product.slug)

    if (userId) {
      if (already) {
        await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_slug', product.slug)
        setItems((prev) => prev.filter((i) => i.slug !== product.slug))
      } else {
        await supabase.from('wishlists').insert({
          user_id: userId,
          product_slug: product.slug,
          product_name: product.name,
          product_price: product.price ?? null,
          product_image: product.imageSrc ?? null,
        } as never)
        setItems((prev) => [...prev, product])
      }
    } else {
      const next = already
        ? items.filter((i) => i.slug !== product.slug)
        : [...items, product]
      writeLocalStorage(next)
      setItems(next)
    }
  }, [items, userId])

  const isInWishlist = useCallback((slug: string) => items.some((i) => i.slug === slug), [items])

  return { items, isInWishlist, toggle, count: items.length }
}

async function migrateLocalToSupabase(
  supabase: ReturnType<typeof createClient>,
  userId: string,
) {
  const local = readLocalStorage()
  if (local.length === 0) return
  await supabase.from('wishlists').upsert(
    local.map((p) => ({
      user_id: userId,
      product_slug: p.slug,
      product_name: p.name,
      product_price: p.price ?? null,
      product_image: p.imageSrc ?? null,
    })) as never,
    { onConflict: 'user_id,product_slug', ignoreDuplicates: true },
  )
  localStorage.removeItem(LS_KEY)
}
