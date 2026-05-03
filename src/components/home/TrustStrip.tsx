'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MapPin, HandHeart, Package, ShieldCheck } from 'lucide-react'

/**
 * TrustStrip
 *
 * Slim horizontal band that surfaces our four hardest differentiators
 * directly under the hero, before users decide to scroll on.
 *
 * Persona feedback: first-time visitors needed an immediate answer to
 * "why YOU vs any other gourmet shop?" — this is that answer.
 */
export function TrustStrip() {
  const t = useTranslations('home.trustStrip')

  const items = [
    { icon: MapPin, label: t('directFromProducers') },
    { icon: HandHeart, label: t('handSelected') },
    { icon: Package, label: t('shipsFromOrigin') },
    { icon: ShieldCheck, label: t('notInSupermarkets') },
  ]

  return (
    <section className="bg-surface border-y border-outline-variant/40 py-5 md:py-6 px-4">
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2.5 md:gap-3 text-on-surface-variant"
          >
            <Icon size={16} strokeWidth={1.5} className="shrink-0 text-secondary" />
            <span className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-medium leading-tight">
              {label}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
