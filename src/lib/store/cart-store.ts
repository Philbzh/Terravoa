import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartLine = {
  slug: string
  name: string
  priceCents: number
  imageSrc: string
  imageAlt: string
  producerName: string
  producerSlug: string
  origin: string
  quantity: number
}

type CartState = {
  hydrated: boolean
  lines: CartLine[]
  setHydrated: (ready: boolean) => void
  addLine: (product: Omit<CartLine, 'quantity'>, qty?: number) => void
  removeLine: (slug: string) => void
  setQty: (slug: string, qty: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      lines: [],
      setHydrated: (ready) => set({ hydrated: ready }),
      addLine: (product, qty = 1) => {
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.slug === product.slug
                  ? { ...l, quantity: l.quantity + qty }
                  : l,
              ),
            }
          }
          return { lines: [...state.lines, { ...product, quantity: qty }] }
        })
      },
      removeLine: (slug) =>
        set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.slug !== slug)
              : state.lines.map((l) =>
                  l.slug === slug ? { ...l, quantity: qty } : l,
                ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: 'terravoa-cart',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export function cartTotalCents(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.priceCents * l.quantity, 0)
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0)
}
