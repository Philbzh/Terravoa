'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'

const regions = [
  { name: 'Brittany', country: 'France', flag: '🇫🇷', highlight: 'Fleur de sel · Salted caramel' },
  { name: 'Tuscany', country: 'Italy', flag: '🇮🇹', highlight: 'Olive oil · Truffles' },
  { name: 'Andalusia', country: 'Spain', flag: '🇪🇸', highlight: 'Paprika · Saffron' },
  { name: 'Black Forest', country: 'Germany', flag: '🇩🇪', highlight: 'Wildflower honey' },
  { name: 'Alentejo', country: 'Portugal', flag: '🇵🇹', highlight: 'Sheep cheese · Cork' },
  { name: 'Provence', country: 'France', flag: '🇫🇷', highlight: 'Lavender · Herbes' },
  { name: 'Sicily', country: 'Italy', flag: '🇮🇹', highlight: 'Capers · Blood orange' },
  { name: 'Basque Country', country: 'Spain', flag: '🇪🇸', highlight: "Piment d'Espelette" },
]

export function EuropeStrip() {
  const t = useTranslations('home.europeStrip')

  return (
    <section className="py-20 md:py-28 px-6 md:px-16 bg-surface-container overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin size={14} strokeWidth={1.5} className="text-secondary" />
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold">
              {t('eyebrow')}
            </p>
          </div>
          <h2
            className="font-serif text-primary leading-[1]"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
          >
            Eight countries. Hundreds of artisans. One platform.
          </h2>
        </motion.div>

        {/* Region pills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              className="group relative rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 hover:border-secondary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-base leading-none">{region.flag}</span>
                <span className="font-serif text-sm text-primary font-medium leading-tight">
                  {region.name}
                </span>
              </div>
              <p className="font-sans text-[10px] text-on-surface-variant/70 leading-relaxed">
                {region.highlight}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
