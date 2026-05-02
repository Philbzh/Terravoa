'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const features = [
  'Direct access to 50,000+ curated buyers across Europe',
  'No upfront costs — revenue share only',
  'Full logistics support & certified packaging',
]

export function ProducerCTA() {
  const t = useTranslations('home.producerCTA')

  return (
    <section className="relative overflow-hidden bg-primary py-28 md:py-40 px-6 md:px-16">
      {/* ── Decorative — large ghosted serif text ── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none"
      >
        <span
          className="font-serif text-on-primary/[0.04] leading-none select-none pr-8 md:pr-20"
          style={{ fontSize: 'clamp(8rem, 22vw, 22rem)' }}
        >
          Join
        </span>
      </div>

      {/* ── Decorative circle ── */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-on-primary/5 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-secondary/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
        {/* ── Left: editorial text ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-secondary mb-8 block">
            {t('eyebrow')}
          </span>
          <h2
            className="font-serif text-on-primary leading-[0.88] mb-8"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            {t('title')}
          </h2>
          <p className="font-sans text-on-primary/60 font-light leading-relaxed text-base md:text-lg max-w-md">
            {t('body')}
          </p>
        </motion.div>

        {/* ── Right: features + CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          {/* Feature list */}
          <ul className="space-y-5 mb-12">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <CheckCircle
                  size={18}
                  strokeWidth={1.5}
                  className="text-secondary shrink-0 mt-0.5"
                />
                <span className="font-sans text-sm text-on-primary/75 leading-relaxed">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* CTA button + secondary link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link
              href="/for-producers"
              className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold bg-secondary hover:bg-secondary-container transition-colors duration-300 px-9 py-5 rounded-full text-on-secondary group"
            >
              {t('cta')}
              <ArrowRight
                size={14}
                strokeWidth={2}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
            <Link
              href="/for-producers#plans"
              className="font-sans text-xs uppercase tracking-[0.18em] text-on-primary/45 hover:text-on-primary/70 transition-colors underline underline-offset-4"
            >
              View plans →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
