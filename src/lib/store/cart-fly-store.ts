import { create } from 'zustand'

interface FlyEvent {
  id: number
  fromX: number
  fromY: number
}

interface CartFlyStore {
  event: FlyEvent | null
  trigger: (fromX: number, fromY: number) => void
  clear: () => void
}

export const useCartFlyStore = create<CartFlyStore>((set) => ({
  event: null,
  trigger: (fromX, fromY) => set({ event: { id: Date.now(), fromX, fromY } }),
  clear: () => set({ event: null }),
}))
