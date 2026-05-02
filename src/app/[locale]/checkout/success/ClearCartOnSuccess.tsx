'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'

export function ClearCartOnSuccess() {
  const clear = useCartStore((s) => s.clear)
  useEffect(() => {
    clear()
  }, [clear])
  return null
}
