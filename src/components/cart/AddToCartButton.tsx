'use client'

import { useRef, useState } from 'react'
import { Minus, Plus, Check, ShoppingBag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartFlyStore } from '@/lib/store/cart-fly-store'
import { cn } from '@/lib/utils'

type Props = {
  product: {
    slug: string
    name: string
    price: number
    imageSrc: string
    imageAlt: string
    producerName: string
    producerSlug: string
    origin: string
  }
}

export function AddToCartButton({ product }: Props) {
  const addLine = useCartStore((s) => s.addLine)
  const triggerFly = useCartFlyStore((s) => s.trigger)
  const [justAdded, setJustAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function onAddToCart() {
    // Trigger the fly-to-cart animation from the button's center
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      triggerFly(rect.left + rect.width / 2, rect.top + rect.height / 2)
    }
    addLine({
      slug: product.slug,
      name: product.name,
      priceCents: product.price,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      producerName: product.producerName,
      producerSlug: product.producerSlug,
      origin: product.origin,
    }, qty)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Quantity selector */}
      <div
        className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant/30 px-2 py-1.5"
        aria-label="Quantity selector"
      >
        <button
          type="button"
          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-40"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1 || justAdded}
        >
          <Minus size={16} />
        </button>
        <span className="font-sans text-sm tabular-nums w-8 text-center">{qty}</span>
        <button
          type="button"
          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-40"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
          disabled={qty >= 99 || justAdded}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add to cart — spring press + icon/text swap */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onAddToCart}
        disabled={justAdded}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'relative w-full sm:w-auto justify-center overflow-hidden',
          'inline-flex items-center gap-2.5 font-sans font-semibold',
          'text-[11px] uppercase tracking-[0.2em] px-8 py-4 rounded-full',
          'transition-colors duration-300',
          justAdded
            ? 'bg-primary text-on-primary cursor-default'
            : 'bg-secondary text-on-secondary hover:bg-secondary-container',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span
              key="added"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Check size={14} strokeWidth={2.5} />
              Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingBag size={14} strokeWidth={1.8} />
              Add {qty > 1 ? `${qty} ` : ''}to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
