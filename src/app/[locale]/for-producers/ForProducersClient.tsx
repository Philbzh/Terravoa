'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Users,
  CreditCard,
  Eye,
  Leaf,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { PricingSection } from '@/components/producers/PricingSection'

const BENEFIT_KEYS = ['customers', 'payments', 'visibility', 'craft'] as const
const BENEFIT_ICONS = [Users, CreditCard, Eye, Leaf]

const STEP_KEYS = ['apply', 'curation', 'welcome', 'sell'] as const
const STEP_NUMBERS = ['01', '02', '03', '04']

export function ForProducersClient() {
  const t = useTranslations('forProducersPage')
  const tp = useTranslations('producerRatings')

  return (
    <PageContainer>
      <motion.div
        className="text-center mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary mb-6 inline-block">
          {t('hero.kicker')}
        </span>
        <h1
          className="font-serif text-primary mb-6 leading-[0.94]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          {t('hero.titleLine1')} <br className="hidden md:block" />
          {t('hero.titleLine2')}
        </h1>
        <p className="text-on-surface/80 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
      </motion.div>

      <motion.div className="max-w-5xl mx-auto mb-16 rounded-xl border border-secondary/25 bg-surface-container-low/90 px-6 py-8 md:px-10 md:py-9">
        <h2 className="font-serif text-xl text-primary mb-3 text-center md:text-left">{tp('title')}</h2>
        <p className="font-sans text-sm text-on-surface/80 leading-relaxed text-center md:text-left">{tp('body')}</p>
        <div className="mt-5 text-center md:text-left">
          <Link
            href="/terms"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4 hover:opacity-80"
          >
            {tp('termsLink')}
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24">
        {BENEFIT_KEYS.map((key, i) => {
          const Icon = BENEFIT_ICONS[i]
          return (
            <motion.div
              key={key}
              className="bg-surface-container-low rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Icon size={28} strokeWidth={1.2} className="text-secondary mb-4" />
              <h3 className="font-serif text-xl text-primary mb-3">{t(`benefits.${key}.title`)}</h3>
              <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                {t(`benefits.${key}.description`)}
              </p>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        className="mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-serif text-primary text-center mb-16"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {t('howItWorks.title')}
        </h2>
        <div className="max-w-5xl mx-auto space-y-12">
          {STEP_KEYS.map((key, i) => (
            <motion.div
              key={key}
              className="flex gap-8 items-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="font-serif text-5xl text-secondary/30 shrink-0 leading-none">
                {STEP_NUMBERS[i]}
              </span>
              <motion.div>
                <h3 className="font-serif text-xl text-primary mb-2">{t(`howItWorks.steps.${key}.title`)}</h3>
                <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                  {t(`howItWorks.steps.${key}.description`)}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <PricingSection />

      <motion.div
        className="max-w-4xl mx-auto text-center mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ShieldCheck size={32} strokeWidth={1.2} className="text-secondary mx-auto mb-4" />
        <p className="font-serif text-xl text-primary mb-3">{t('selectivity.title')}</p>
        <p className="text-on-surface-variant font-sans text-base leading-relaxed max-w-3xl mx-auto">
          {t('selectivity.body')}
        </p>
      </motion.div>

      <div className="bg-primary rounded-2xl p-10 md:p-16 text-center">
        <h2 className="font-serif text-3xl text-on-primary mb-4">{t('cta.title')}</h2>
        <p className="text-on-primary/80 font-sans max-w-lg mx-auto mb-8 leading-relaxed">{t('cta.body')}</p>
        <Link
          href="/for-producers/apply"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
        >
          {t('cta.applyNow')}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <p className="mt-8 font-sans text-xs text-on-primary/40">
          {t('cta.signInPrefix')}{' '}
          <Link
            href="/login/producer"
            className="text-on-primary/60 hover:text-on-primary underline underline-offset-4"
          >
            {t('cta.signInLink')}
          </Link>
        </p>
      </div>
    </PageContainer>
  )
}
