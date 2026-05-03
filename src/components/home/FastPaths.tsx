'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Globe2, Gift, Star, ArrowRight } from 'lucide-react'

/**
 * FastPaths
 *
 * Three editorial cards giving first-time visitors clear entry points
 * matching the most common shopping intents:
 *
 *  - "I'm thinking of a country/region I love"  → /regions
 *  - "I need a gift"                            → /collection?category=gift (placeholder)
 *  - "Just show me what works"                  → #bestsellers anchor on this page
 *
 * Persona research showed visitors hesitate when they have to invent
 * their own path through the catalogue. Three labelled doors fix that.
 */
export function FastPaths() {
  const t = useTranslations('home.fastPaths')

  const paths = [
    {
      icon: Globe2,
      title: t('byCountry.title'),
      subtitle: t('byCountry.subtitle'),
      cta: t('byCountry.cta'),
      href: '/regions',
    },
    {
      icon: Gift,
      title: t('giftSets.title'),
      subtitle: t('giftSets.subtitle'),
      cta: t('giftSets.cta'),
      href: '/collection',
    },
    {
      icon: Star,
      title: t('bestSellers.title'),
      subtitle: t('bestSellers.subtitle'),
      cta: t('bestSellers.cta'),
      href: '#bestsellers',
    },
  ]

  return (
    <section className="py-20 md:py-24 px-6 md:px-16 bg-surface">
      <motion.div
        className="max-w-2xl mx-auto text-center mb-12 md:mb-14"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-secondary font-semibold mb-3">
          {t('eyebrow')}
        </p>
        <h2
          className="font-serif text-primary leading-[1.05]"
          style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)' }}
        >
          {t('title')}
        </h2>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {paths.map(({ icon: Icon, title, subtitle, cta, href }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
          >
            <Link
              href={href}
              className="group block h-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 rounded-2xl p-7 md:p-8 transition-colors duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 mb-5 group-hover:bg-secondary/20 transition-colors duration-300">
                <Icon size={18} strokeWidth={1.5} className="text-secondary" />
              </div>
              <h3
                className="font-serif text-primary leading-tight mb-2"
                style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)' }}
              >
                {title}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-5">
                {subtitle}
              </p>
              <span className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.18em] text-secondary font-semibold group-hover:gap-3 transition-all duration-300">
                {cta}
                <ArrowRight size={12} strokeWidth={2} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
