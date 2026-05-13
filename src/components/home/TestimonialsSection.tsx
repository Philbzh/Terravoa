'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

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

const ROTATE_INTERVAL = 6000

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-secondary fill-secondary' : 'text-outline-variant/40'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const [offset, setOffset] = useState(0)
  const [paused, setPaused] = useState(false)

  const advance = useCallback(() => {
    setOffset((o) => (o + 1) % testimonials.length)
  }, [])

  const retreat = useCallback(() => {
    setOffset((o) => (o - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(advance, ROTATE_INTERVAL)
    return () => clearInterval(id)
  }, [paused, advance])

  // Get 3 visible (desktop) or 1 (mobile)
  const visible = Array.from({ length: 3 }, (_, i) =>
    testimonials[(offset + i) % testimonials.length],
  )

  return (
    <section
      className="py-24 md:py-32 px-6 md:px-16 bg-surface-container-low"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-5 mb-5">
              <div className="h-px w-14 bg-secondary shrink-0" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold">
                Verified purchases
              </span>
            </div>
            <h2
              className="font-serif text-primary leading-[0.92]"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)' }}
            >
              What our customers say
            </h2>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={retreat}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={advance}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Desktop: 3-column cards */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={offset}
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {visible.map((t) => (
                <div
                  key={`${t.id}-${offset}`}
                  className="relative flex flex-col rounded-2xl bg-surface p-7 shadow-sm border border-outline-variant/15 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Quote accent */}
                  <div className="absolute -top-3 left-7">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                      <Quote size={14} strokeWidth={1.5} className="text-secondary" />
                    </div>
                  </div>

                  <div className="mt-3 mb-5">
                    <StarRating rating={t.rating} />
                  </div>

                  <p className="font-sans text-sm text-on-surface leading-relaxed flex-1 mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="pt-5 border-t border-outline-variant/15">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-sm font-semibold text-primary">{t.name}</p>
                        <p className="font-sans text-[11px] text-on-surface-variant">{t.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-sans text-[10px] uppercase tracking-wider text-secondary font-medium">{t.region}</p>
                        <p className="font-sans text-[10px] text-on-surface-variant/60 leading-tight max-w-[120px]">{t.product}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={offset}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl bg-surface p-7 shadow-sm border border-outline-variant/15"
            >
              <div className="absolute -top-3 left-7">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                  <Quote size={14} strokeWidth={1.5} className="text-secondary" />
                </div>
              </div>
              <div className="mt-3 mb-5">
                <StarRating rating={testimonials[offset].rating} />
              </div>
              <p className="font-sans text-sm text-on-surface leading-relaxed mb-6">
                &ldquo;{testimonials[offset].text}&rdquo;
              </p>
              <div className="pt-5 border-t border-outline-variant/15">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-sm font-semibold text-primary">{testimonials[offset].name}</p>
                    <p className="font-sans text-[11px] text-on-surface-variant">{testimonials[offset].location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-secondary font-medium">{testimonials[offset].region}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant/60 leading-tight max-w-[120px]">{testimonials[offset].product}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOffset(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === offset
                  ? 'w-6 h-1.5 bg-secondary'
                  : 'w-1.5 h-1.5 bg-outline-variant/40 hover:bg-outline-variant'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
