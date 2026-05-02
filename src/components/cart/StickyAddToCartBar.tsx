'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartFlyStore } from '@/lib/store/cart-fly-store'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

type Product = {
  slug: string
  name: string
  price: number
  imageSrc: string
  imageAlt: string
  producerName: string
  producerSlug: string
  origin: string
}

export function StickyAddToCartBar({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const addLine = useCartStore((s) => s.addLine)
  const triggerFly = useCartFlyStore((s) => s.trigger)

  // Watch for the main add-to-cart sentinel scrolling off screen
  useEffect(() => {
    const sentinel = document.getElementById('add-to-cart-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  function onAdd() {
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
    }, 1)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 88, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 88, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-surface/96 backdrop-blur-md border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-7xl mx-auto flex items-center gap-4 px-6 md:px-10 py-3">
            {/* Thumbnail */}
            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
              <Image
                src={product.imageSrc}
                alt={product.name}
                width={44}
                height={44}
                className="object-cover w-full h-full"
                unoptimized={isExternalUnoptimizedSrc(product.imageSrc)}
              />
            </div>

            {/* Name + price */}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-sm text-primary leading-tight truncate">
                {product.name}
              </p>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                €{(product.price / 100).toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            {/* CTA */}
            <motion.button
              ref={buttonRef}
              type="button"
              onClick={onAdd}
              disabled={justAdded}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className={[
                'inline-flex items-center gap-2 font-sans font-semibold shrink-0',
                'text-[11px] uppercase tracking-[0.2em] px-6 py-3 rounded-full',
                'transition-colors duration-300',
                justAdded
                  ? 'bg-primary text-on-primary cursor-default'
                  : 'bg-secondary text-on-secondary hover:bg-secondary-container',
              ].join(' ')}
            >
              <AnimatePresence mode="wait" initial={false}>
                {justAdded ? (
                  <motion.span
                    key="added"
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Check size={13} strokeWidth={2.5} />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ShoppingBag size={13} strokeWidth={1.8} />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
