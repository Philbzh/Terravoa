'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Check, Zap, ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { PLAN_CONFIG, type PlanId } from '@/lib/partnership-plans'

const TIER_IDS: PlanId[] = ['founding', 'growth', 'premium']

const TIER_FEATURE_KEYS: Record<PlanId, readonly string[]> = {
  founding: ['productLimit', 'profile', 'notifications', 'payouts', 'onboarding'],
  growth: ['unlimited', 'story', 'visibility', 'analytics', 'reviews', 'payouts'],
  premium: ['allGrowth', 'searchFeatured', 'homepageEligible', 'support', 'contentReview', 'earlyAccess'],
}

const ADDON_KEYS = ['featuredPlacement', 'homepageFeature'] as const

function formatMonthlyEur(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function PricingSection() {
  const locale = useLocale()
  const t = useTranslations('forProducersPage.pricing')

  return (
    <motion.section
      className="mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-14">
        <h2 className="font-serif text-3xl text-primary mb-3">{t('title')}</h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {TIER_IDS.map((tierId, i) => {
          const config = PLAN_CONFIG[tierId]
          const highlight = tierId === 'growth'
          const price = formatMonthlyEur(config.monthlyFeeEur, locale)
          const commission = `${config.commissionPct}%`
          const featureKeys = TIER_FEATURE_KEYS[tierId]

          return (
            <motion.div
              key={tierId}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                'relative rounded-2xl border p-8 flex flex-col',
                highlight
                  ? 'bg-primary text-on-primary border-primary shadow-xl scale-[1.02]'
                  : 'bg-surface-container-low border-outline-variant/20',
              )}
            >
              <div className="mb-6">
                <span
                  className={cn(
                    'inline-block font-sans text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-1',
                    highlight ? 'bg-secondary text-on-secondary' : 'bg-secondary/10 text-secondary',
                  )}
                >
                  {t(`tiers.${tierId}.badge`)}
                </span>
                <p
                  className={cn(
                    'font-sans text-xs mt-1',
                    highlight ? 'text-on-primary/60' : 'text-on-surface-variant',
                  )}
                >
                  {t(`tiers.${tierId}.badgeNote`)}
                </p>
              </div>

              <div className="mb-2">
                <span
                  className={cn(
                    'font-serif text-5xl',
                    highlight ? 'text-on-primary' : 'text-primary',
                  )}
                >
                  {price}
                </span>
                <span
                  className={cn(
                    'font-sans text-sm ml-1',
                    highlight ? 'text-on-primary/60' : 'text-on-surface-variant',
                  )}
                >
                  {t('perMonth')}
                </span>
              </div>

              <motion.div
                className={cn(
                  'font-sans text-xs mb-1',
                  highlight ? 'text-on-primary/70' : 'text-on-surface-variant',
                )}
              >
                + {commission}{' '}
                <span className="opacity-70">{t('perSale')}</span>
              </motion.div>

              <p
                className={cn(
                  'font-serif text-base mb-6 mt-3 pb-6 border-b',
                  highlight
                    ? 'text-on-primary border-on-primary/10'
                    : 'text-primary border-outline-variant/20',
                )}
              >
                {t(`tiers.${tierId}.headline`)}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {featureKeys.map((featureKey) => {
                  const label =
                    featureKey === 'productLimit' && config.productLimit !== null
                      ? t(`tiers.${tierId}.features.productLimit`, { count: config.productLimit })
                      : t(`tiers.${tierId}.features.${featureKey}`)

                  return (
                    <li key={featureKey} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={cn(
                          'mt-0.5 shrink-0',
                          highlight ? 'text-secondary-fixed' : 'text-secondary',
                        )}
                      />
                      <span
                        className={cn(
                          'font-sans text-sm leading-snug',
                          highlight ? 'text-on-primary/80' : 'text-on-surface/80',
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <Link
                href="/for-producers/apply"
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium transition-all',
                  highlight
                    ? 'bg-secondary text-on-secondary hover:bg-secondary-container transition-colors duration-300'
                    : 'border border-primary/30 text-primary hover:bg-primary/5',
                )}
              >
                {t(`tiers.${tierId}.cta`)}
                <ArrowRight size={14} strokeWidth={2} />
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.p
        className="text-center font-sans text-xs text-on-surface-variant mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Zap size={11} className="inline mr-1 text-secondary" strokeWidth={2} />
        {t('foundingNote')}
      </motion.p>

      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-secondary text-center mb-6">
          {t('addonsTitle')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ADDON_KEYS.map((addonKey) => (
            <div
              key={addonKey}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-6 py-5 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-serif text-base text-primary">{t(`addons.${addonKey}.name`)}</h4>
                <span className="font-sans text-xs text-secondary font-medium whitespace-nowrap">
                  {t(`addons.${addonKey}.price`)}
                </span>
              </div>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {t(`addons.${addonKey}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
