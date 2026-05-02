'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const stepKeys = ['discover', 'order', 'delivered'] as const

export function HowItWorks() {
  const t = useTranslations('home.howItWorks')

  return (
    <section className="py-28 md:py-36 px-6 md:px-16 bg-surface overflow-hidden">
      {/* ── Section header — editorial left-aligned ── */}
      <motion.div
        className="mb-20 md:mb-28 max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary mb-5">
          {t('subtitle')}
        </p>
        <h2
          className="font-serif text-primary leading-[0.9]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          {t('title')}
        </h2>
      </motion.div>

      {/* ── Steps — editorial grid with ghost numbers ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-outline-variant/10">
        {stepKeys.map((key, i) => (
          <motion.div
            key={key}
            className="relative bg-surface px-8 md:px-12 pt-8 pb-12 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: i * 0.15 }}
          >
            {/* Giant ghost number — decorative backdrop */}
            <div
              aria-hidden
              className="font-serif leading-none select-none text-primary/[0.05] mb-4 transition-colors duration-500 group-hover:text-primary/[0.07]"
              style={{ fontSize: 'clamp(5rem, 14vw, 9rem)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Accent bar */}
            <div className="h-px w-12 bg-secondary mb-7 transition-all duration-500 group-hover:w-20" />

            <h3
              className="font-serif text-primary mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)' }}
            >
              {t(`steps.${key}.title`)}
            </h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-[26ch]">
              {t(`steps.${key}.description`)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
