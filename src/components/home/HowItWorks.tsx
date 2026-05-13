'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, CreditCard, Truck } from 'lucide-react'

const stepKeys = ['discover', 'order', 'delivered'] as const
const stepIcons = [Search, CreditCard, Truck]

export function HowItWorks() {
  const t = useTranslations('home.howItWorks')

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 bg-surface overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold mb-4">
            {t('subtitle')}
          </p>
          <h2
            className="font-serif text-primary leading-[0.95] max-w-xl mx-auto"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
          >
            {t('title')}
          </h2>
        </motion.div>

        {/* Steps — horizontal connected cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
          {stepKeys.map((key, i) => {
            const Icon = stepIcons[i]
            return (
              <motion.div
                key={key}
                className="relative flex flex-col items-center text-center px-8 md:px-10 py-10 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: i * 0.15 }}
              >
                {/* Connector line (desktop only, not on last) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-[3.25rem] left-[calc(50%+2.5rem)] right-0 h-px bg-outline-variant/30 z-0" />
                )}

                {/* Step number + icon circle */}
                <div className="relative z-10 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container-high group-hover:bg-secondary/10 transition-colors duration-300">
                    <Icon size={24} strokeWidth={1.3} className="text-secondary" />
                  </div>
                  <span className="absolute -top-2 -right-2 font-sans text-[10px] font-bold text-on-surface-variant/40 bg-surface-container rounded-full w-6 h-6 flex items-center justify-center border border-outline-variant/20">
                    {i + 1}
                  </span>
                </div>

                <h3
                  className="font-serif text-primary mb-3 leading-tight"
                  style={{ fontSize: 'clamp(1.3rem, 2vw, 1.6rem)' }}
                >
                  {t(`steps.${key}.title`)}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-[28ch]">
                  {t(`steps.${key}.description`)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
