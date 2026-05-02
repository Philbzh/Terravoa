'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCartFlyStore } from '@/lib/store/cart-fly-store'

type FlyState = {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
} | null

export function CartFlyAnimation() {
  const { event, clear } = useCartFlyStore()
  const [flyState, setFlyState] = useState<FlyState>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!event) return

    const cartEl = document.querySelector('[data-cart-icon]')
    const rect = cartEl?.getBoundingClientRect()

    // Aim for the cart icon center, or top-right corner as fallback
    const toX = rect ? rect.left + rect.width / 2 : window.innerWidth - 40
    const toY = rect ? rect.top + rect.height / 2 : 24

    setFlyState({ id: event.id, fromX: event.fromX, fromY: event.fromY, toX, toY })
    clear()
  }, [event, clear])

  if (!mounted || !flyState) return null

  return createPortal(
    <motion.div
      key={flyState.id}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      initial={{
        x: flyState.fromX - 20,
        y: flyState.fromY - 20,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: flyState.toX - 20,
        y: flyState.toY - 20,
        opacity: 0,
        scale: 0.25,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.8 }}
      onAnimationComplete={() => setFlyState(null)}
    >
      <div className="w-10 h-10 rounded-full bg-secondary shadow-xl flex items-center justify-center">
        <ShoppingBag size={16} strokeWidth={1.8} className="text-on-secondary" />
      </div>
    </motion.div>,
    document.body,
  )
}
