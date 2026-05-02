'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { Check, Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLAN_CONFIG } from '@/lib/partnership-plans'

const tiers = [
  {
    id: 'founding',
    badge: 'Founding',
    badgeNote: 'Limited to 50 producers',
    price: `€${PLAN_CONFIG.founding.monthlyFeeEur}`,
    period: '/month',
    commission: `${PLAN_CONFIG.founding.commissionPct}%`,
    commissionNote: 'per sale',
    headline: 'Start with no risk',
    features: [
      `Up to ${PLAN_CONFIG.founding.productLimit} products`,
      'Standard producer profile',
      'Direct order notifications',
      'Automatic payouts',
      'Priority onboarding support',
    ],
    highlight: false,
    cta: 'Apply for a founding spot',
    ctaVariant: 'outline' as const,
  },
  {
    id: 'growth',
    badge: 'Growth',
    badgeNote: 'Most popular',
    price: `€${PLAN_CONFIG.growth.monthlyFeeEur}`,
    period: '/month',
    commission: `${PLAN_CONFIG.growth.commissionPct}%`,
    commissionNote: 'per sale',
    headline: 'Scale your reach',
    features: [
      'Unlimited products',
      'Producer story page + photos',
      'Enhanced search visibility',
      'Sales analytics dashboard',
      'Customer review management',
      'Automatic payouts',
    ],
    highlight: true,
    cta: 'Apply now',
    ctaVariant: 'filled' as const,
  },
  {
    id: 'premium',
    badge: 'Premium',
    badgeNote: 'Top producers',
    price: `€${PLAN_CONFIG.premium.monthlyFeeEur}`,
    period: '/month',
    commission: `${PLAN_CONFIG.premium.commissionPct}%`,
    commissionNote: 'per sale',
    headline: 'Lead the platform',
    features: [
      'Everything in Growth',
      'Featured placement in search',
      'Homepage feature eligibility',
      'Dedicated partner support',
      'Priority content & story review',
      'Early access to new features',
    ],
    highlight: false,
    cta: 'Apply now',
    ctaVariant: 'outline' as const,
  },
]

const addons = [
  {
    name: 'Featured Placement',
    description: 'Appear at the top of category and search results.',
    price: 'from €25 / month',
  },
  {
    name: 'Homepage Feature',
    description: 'Your product or story featured on the Terravoa homepage.',
    price: '€100 / month',
  },
]

export function PricingSection() {
  return (
    <motion.section
      className="mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="font-serif text-3xl text-primary mb-3">
          Simple, transparent pricing
        </h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          No hidden fees. No long-term contracts. Cancel anytime.
          Final terms are confirmed during onboarding after selection.
        </p>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              'relative rounded-2xl border p-8 flex flex-col',
              tier.highlight
                ? 'bg-primary text-on-primary border-primary shadow-xl scale-[1.02]'
                : 'bg-surface-container-low border-outline-variant/20',
            )}
          >
            {/* Badge */}
            <div className="mb-6">
              <span
                className={cn(
                  'inline-block font-sans text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-1',
                  tier.highlight
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-secondary/10 text-secondary',
                )}
              >
                {tier.badge}
              </span>
              <p
                className={cn(
                  'font-sans text-xs mt-1',
                  tier.highlight ? 'text-on-primary/60' : 'text-on-surface-variant',
                )}
              >
                {tier.badgeNote}
              </p>
            </div>

            {/* Price */}
            <div className="mb-2">
              <span
                className={cn(
                  'font-serif text-5xl',
                  tier.highlight ? 'text-on-primary' : 'text-primary',
                )}
              >
                {tier.price}
              </span>
              <span
                className={cn(
                  'font-sans text-sm ml-1',
                  tier.highlight ? 'text-on-primary/60' : 'text-on-surface-variant',
                )}
              >
                {tier.period}
              </span>
            </div>

            {/* Commission */}
            <div
              className={cn(
                'font-sans text-xs mb-1',
                tier.highlight ? 'text-on-primary/70' : 'text-on-surface-variant',
              )}
            >
              + {tier.commission}{' '}
              <span className="opacity-70">{tier.commissionNote}</span>
            </div>

            {/* Headline */}
            <p
              className={cn(
                'font-serif text-base mb-6 mt-3 pb-6 border-b',
                tier.highlight
                  ? 'text-on-primary border-on-primary/10'
                  : 'text-primary border-outline-variant/20',
              )}
            >
              {tier.headline}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className={cn(
                      'mt-0.5 shrink-0',
                      tier.highlight ? 'text-secondary-fixed' : 'text-secondary',
                    )}
                  />
                  <span
                    className={cn(
                      'font-sans text-sm leading-snug',
                      tier.highlight ? 'text-on-primary/80' : 'text-on-surface/80',
                    )}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/for-producers/apply"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-sm font-medium transition-all',
                tier.ctaVariant === 'filled'
                  ? 'bg-secondary text-on-secondary hover:bg-secondary-container transition-colors duration-300'
                  : tier.highlight
                    ? 'border border-on-primary/30 text-on-primary hover:bg-on-primary/10'
                    : 'border border-primary/30 text-primary hover:bg-primary/5',
              )}
            >
              {tier.cta}
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Founding tier note */}
      <motion.p
        className="text-center font-sans text-xs text-on-surface-variant mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Zap size={11} className="inline mr-1 text-secondary" strokeWidth={2} />
        Founding tier is free for life for the first 50 accepted producers —
        no upgrade required.
      </motion.p>

      {/* Add-ons */}
      <div className="max-w-3xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-secondary text-center mb-6">
          Optional add-ons
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addons.map((addon) => (
            <div
              key={addon.name}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-6 py-5 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-serif text-base text-primary">{addon.name}</h4>
                <span className="font-sans text-xs text-secondary font-medium whitespace-nowrap">
                  {addon.price}
                </span>
              </div>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {addon.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
