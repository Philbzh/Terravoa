import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function StripeConnectStatus() {
  const session = await getProducerForSession()
  const t = await getTranslations('producerPortal.partnership')

  if (!session?.producer) return null

  const p = session.producer as {
    stripe_connect_account_id?: string | null
    stripe_connect_payouts_enabled?: boolean
    stripe_connect_charges_enabled?: boolean
  }

  const hasAccount = Boolean(p.stripe_connect_account_id)
  const payoutsReady = Boolean(p.stripe_connect_payouts_enabled)

  return (
    <div className="max-w-xl mb-10 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
      <h2 className="font-serif text-lg text-primary mb-2">{t('stripeConnectTitle')}</h2>
      <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
        {t('stripeConnectBody')}
      </p>
      <dl className="space-y-2 font-sans text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">{t('stripeConnectAccount')}</dt>
          <dd className="text-on-surface font-medium">
            {hasAccount ? t('stripeConnectLinked') : t('stripeConnectNotLinked')}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">{t('stripeConnectPayouts')}</dt>
          <dd className="text-on-surface font-medium">
            {payoutsReady ? t('stripeConnectEnabled') : t('stripeConnectPending')}
          </dd>
        </div>
      </dl>
      {!payoutsReady && (
        <Link
          href="/contact"
          className="inline-block mt-4 text-secondary font-sans text-xs uppercase tracking-wider underline underline-offset-4"
        >
          {t('stripeConnectContact')}
        </Link>
      )}
    </div>
  )
}
