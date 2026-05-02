'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { staggerContainer, staggerItem, testimonialEnter } from '@/lib/motion/variants'

const testimonials = [
  {
    id: 1,
    name: 'Charlotte M.',
    location: 'Berlin, Germany',
    rating: 5,
    text: "The fleur de sel arrived beautifully packed. I've been using it on everything from salads to dark chocolate — it adds a completely different dimension. I hadn't realised salt could taste like this.",
    product: 'Fleur de Sel de Guérande',
    region: 'Brittany',
  },
  {
    id: 2,
    name: 'Marco F.',
    location: 'Milan, Italy',
    rating: 5,
    text: "Rossi Estate oil is genuinely something special — peppery, green, alive. I've stopped buying oil from the supermarket since discovering Terravoa. Two bottles in, still surprised every time.",
    product: 'Extra Virgin Cold-Pressed Oil',
    region: 'Tuscany',
  },
  {
    id: 3,
    name: 'Sophie L.',
    location: 'Lyon, France',
    rating: 5,
    text: "The salted butter caramel is extraordinary. I ordered two jars and they were gone within a week. Already on my fourth order. You've been warned.",
    product: 'Caramel au Beurre Salé',
    region: 'Brittany',
  },
  {
    id: 4,
    name: 'Anna K.',
    location: 'Vienna, Austria',
    rating: 5,
    text: "Hans's wildflower honey is unlike anything in a supermarket. Complex, floral, with a faint hint of pine. I can actually taste the season. Extraordinary.",
    product: 'Wildflower Forest Honey',
    region: 'Black Forest',
  },
  {
    id: 5,
    name: 'Pedro A.',
    location: 'Lisbon, Portugal',
    rating: 5,
    text: "The terracotta vase is one of the most beautiful things I own. It was a gift for my wife — she held it for a full minute before saying anything. That says everything.",
    product: 'Hand-Thrown Terracotta Vase',
    region: 'Alentejo',
  },
  {
    id: 6,
    name: 'Marie-Claire D.',
    location: 'Paris, France',
    rating: 5,
    text: "I was sceptical about ordering lavender soap online. Maison Lavande changed that completely. Six weeks of curing makes all the difference. I won't go back to anything else.",
    product: 'Lavender Savon de Marseille',
    region: 'Provence',
  },
]

const CARDS_VISIBLE = 3
const ROTATE_INTERVAL = 5200

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          className={i < rating ? 'text-secondary fill-secondary' : 'text-outline-variant/40'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm">
      <Quote
        size={22}
        strokeWidth={1.2}
        className="text-secondary/40 mb-4 shrink-0"
      />
      <p className="font-sans text-sm text-on-surface leading-relaxed flex-1 mb-5">
        "{t.text}"
      </p>
      <div className="mt-auto">
        <StarRating rating={t.rating} />
        <div className="mt-2.5 flex items-start justify-between gap-3">
          <div>
            <p className="font-sans text-sm font-semibold text-on-surface">{t.name}</p>
            <p className="font-sans text-[11px] text-on-surface-variant">{t.location}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-sans text-[10px] uppercase tracking-wider text-secondary">{t.region}</p>
            <p className="font-sans text-[10px] text-on-surface-variant/70 leading-tight max-w-[120px]">{t.product}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)

  const advance = useCallback(() => {
    setOffset((o) => (o + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(advance, ROTATE_INTERVAL)
    return () => clearInterval(id)
  }, [paused, advance])

  // Visible indices (wrapping)
  const visible = Array.from({ length: CARDS_VISIBLE }, (_, i) =>
    testimonials[(offset + i) % testimonials.length],
  )

  return (
    <section
      className="py-24 md:py-32 px-6 md:px-16 bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <motion.div
        className="mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="h-px w-12 bg-secondary mb-5" />
        <h2
          className="font-serif text-primary leading-[0.92]"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
        >
          What our customers say
        </h2>
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-3">
          Verified purchases · European producers
        </p>
      </motion.div>

      {/* Desktop: 3-column grid with stagger */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={offset}
            className="grid grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {visible.map((t) => (
              <motion.div key={`${t.id}-${offset}`} variants={staggerItem}>
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: single card with cross-fade */}
      <div className="md:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={offset}
            variants={testimonialEnter}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TestimonialCard t={testimonials[offset]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOffset(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === offset
                ? 'w-5 h-1.5 bg-secondary'
                : 'w-1.5 h-1.5 bg-outline-variant/40 hover:bg-outline-variant'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
