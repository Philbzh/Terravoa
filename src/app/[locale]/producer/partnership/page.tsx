import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { canViewProducerCommercialTerms } from '@/lib/producer-dashboard-access'
import { getPartnershipPlanRates } from '@/lib/partnership-plans'

export default async function ProducerPartnershipPage() {
  const showRates = await canViewProducerCommercialTerms()
  const rates = getPartnershipPlanRates()
  const tp = await getTranslations('producerRatings')
  const t = await getTranslations('producerPortal.partnership')

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm max-w-xl mb-8 leading-relaxed">
        {t('subtitle')}
      </p>

      <div className="max-w-xl mb-10 rounded-xl border border-secondary/20 bg-surface-container-low/80 px-5 py-6">
        <h2 className="font-serif text-lg text-primary mb-2">{tp('title')}</h2>
        <p className="font-sans text-sm text-on-surface/80 leading-relaxed">{tp('body')}</p>
        <Link
          href="/terms"
          className="inline-block mt-4 text-secondary font-sans text-xs uppercase tracking-wider underline underline-offset-4"
        >
          {tp('termsLink')}
        </Link>
      </div>

      {!showRates && (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 mb-10">
          <p className="font-sans text-sm text-on-surface leading-relaxed mb-4">
            <strong className="font-medium text-primary">{t('qualitativeTitle')}</strong> —{' '}
            {t('qualitativeBody')}
          </p>
          <p className="font-sans text-sm text-on-surface-variant">
            {t('signInNote')}{' '}
            <code className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded">
              PRODUCER_DASHBOARD_PREVIEW=true
            </code>{' '}
            {t('signInNoteEnd')}
          </p>
          <Link
            href="/contact"
            className="inline-block mt-4 text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-2"
          >
            {t('requestAccess')}
          </Link>
        </div>
      )}

      {showRates && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <PlanCard
            title={t('planStarterTitle')}
            description={t('planStarterDesc')}
            monthlyEur={rates.starter.monthlyFeeEur}
            commissionPct={rates.starter.commissionPct}
            labelMonthly={t('monthlyMembership')}
            labelCommission={t('commissionOnSale')}
          />
          <PlanCard
            title={t('planGrowthTitle')}
            description={t('planGrowthDesc')}
            monthlyEur={rates.growth.monthlyFeeEur}
            commissionPct={rates.growth.commissionPct}
            labelMonthly={t('monthlyMembership')}
            labelCommission={t('commissionOnSale')}
          />
        </div>
      )}

      <h2 className="font-serif text-xl text-primary mb-4">{t('earningsTitle')}</h2>
      <p className="text-on-surface-variant font-sans text-sm mb-6 max-w-xl">
        {t('earningsSubtitle')}
      </p>
      <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-8 text-center">
        <p className="font-sans text-sm text-on-surface-variant">
          {t('noPayoutData')}
        </p>
      </div>
    </div>
  )
}

function PlanCard({
  title,
  description,
  monthlyEur,
  commissionPct,
  labelMonthly,
  labelCommission,
}: {
  title: string
  description: string
  monthlyEur: number | null
  commissionPct: number | null
  labelMonthly: string
  labelCommission: string
}) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8">
      <h3 className="font-serif text-xl text-primary mb-2">{title}</h3>
      <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
        {description}
      </p>
      <dl className="space-y-3 font-sans text-sm border-t border-outline-variant/15 pt-4">
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">{labelMonthly}</dt>
          <dd className="text-primary font-medium tabular-nums">
            {monthlyEur != null ? `€${monthlyEur.toFixed(2)}` : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">{labelCommission}</dt>
          <dd className="text-primary font-medium tabular-nums">
            {commissionPct != null ? `${commissionPct}%` : '—'}
          </dd>
        </div>
      </dl>
    </div>
  )
}
