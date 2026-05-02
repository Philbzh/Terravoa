'use client'

import { motion, useInView } from 'framer-motion'
import { BookOpenCheck, Leaf, Handshake } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

const promiseIcons = [BookOpenCheck, Leaf, Handshake]
const promiseKeys = ['origins', 'sustainable', 'fair'] as const

export function CuratorsPromise() {
  const t = useTranslations('home.curatorsPromise')
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="bg-primary text-on-primary py-28 md:py-40 px-6 md:px-16 relative overflow-hidden"
    >
      {/* ── Vast ghosted word backdrop ── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
      >
        <span
          className="font-serif text-on-primary/[0.04] leading-none select-none whitespace-nowrap"
          style={{ fontSize: 'clamp(9rem, 24vw, 24rem)' }}
        >
          Integrity
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Header row ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-20 md:mb-28">
          <motion.h2
            className="font-serif text-on-primary leading-[0.88]"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {t('title')}
          </motion.h2>

          <motion.p
            className="font-sans text-on-primary/50 font-light text-sm leading-relaxed max-w-xs lg:text-right"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Every producer on our platform is personally visited, verified, and
            selected by our curatorial team.
          </motion.p>
        </div>

        {/* ── Three pillars — editorial grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-primary/10">
          {promiseKeys.map((key, i) => {
            const Icon = promiseIcons[i]
            return (
              <motion.div
                key={key}
                className="bg-primary px-8 md:px-12 pt-10 pb-14 group"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15 }}
              >
                {/* Icon — spring bounce-in */}
                <motion.div
                  className="mb-8"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={inView ? { scale: 1, rotate: 0 } : {}}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 16,
                    delay: 0.4 + i * 0.15,
                  }}
                >
                  <Icon size={28} strokeWidth={1.2} className="text-secondary" />
                </motion.div>

                {/* Step number */}
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-on-primary/25 mb-4">
                  {String(i + 1).padStart(2, '0')}
                </p>

                <h3 className="font-serif text-2xl md:text-3xl mb-5 leading-tight">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="font-sans text-on-primary/55 font-light text-sm leading-relaxed">
                  {t(`items.${key}.description`)}
                </p>

                {/* Accent bar — draws on scroll, extends further on hover */}
                <motion.div
                  className="h-px bg-secondary mt-8 group-hover:!w-20 transition-[width] duration-500"
                  initial={{ width: 0 }}
                  animate={inView ? { width: 48 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </motion.div>
            )
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="mt-16 pt-12 border-t border-on-primary/10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-primary/35">
            Our curation standards →
          </p>
          <button className="bg-secondary hover:bg-secondary-container transition-colors duration-300 px-8 py-3.5 rounded-full text-on-secondary font-sans font-semibold text-[11px] uppercase tracking-[0.2em]">
            {t('learnMore')}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
