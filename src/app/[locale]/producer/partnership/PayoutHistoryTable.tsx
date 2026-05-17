import { getProducerForSession } from '@/lib/producer/server'
import { getProducerPayoutHistory, producerNetCents } from '@/lib/producer/payouts'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const payoutStatusClass: Record<string, string> = {
  pending: 'bg-tertiary-fixed/30 text-tertiary',
  ready: 'bg-secondary-container/50 text-secondary',
  paid: 'bg-primary-fixed/40 text-primary',
  failed: 'bg-error-container/50 text-error',
}

export async function PayoutHistoryTable() {
  const session = await getProducerForSession()
  const t = await getTranslations('producerPortal.partnership')

  if (!session?.producer) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-8 text-center">
        <p className="font-sans text-sm text-on-surface-variant">{t('payoutSignIn')}</p>
      </div>
    )
  }

  const rows = await getProducerPayoutHistory(session.producer.id)

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-8 text-center">
        <p className="font-sans text-sm text-on-surface-variant">{t('noPayoutData')}</p>
      </div>
    )
  }

  const totalNet = rows.reduce((sum, row) => sum + producerNetCents(row), 0)
  const totalCommission = rows.reduce((sum, row) => {
    const gross = row.price * row.quantity
    return sum + (row.commission_cents ?? Math.round(gross * ((row.commission_rate_pct ?? 0) / 100)))
  }, 0)

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4">
          <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            {t('payoutTotalNet')}
          </p>
          <p className="font-serif text-2xl text-primary tabular-nums">
            €{(totalNet / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4">
          <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            {t('payoutTotalCommission')}
          </p>
          <p className="font-serif text-2xl text-on-surface-variant tabular-nums">
            €{(totalCommission / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
        <table className="w-full min-w-[640px] font-sans text-sm">
          <thead>
            <tr className="border-b border-outline-variant/15 bg-surface-container-low/80 text-left">
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColDate')}
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColProduct')}
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColGross')}
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColCommission')}
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColNet')}
              </th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-on-surface-variant font-medium">
                {t('payoutColStatus')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((row) => {
              const gross = row.price * row.quantity
              const commission =
                row.commission_cents ??
                Math.round(gross * ((row.commission_rate_pct ?? 0) / 100))
              const net = gross - commission
              const date = row.orders?.created_at ?? row.created_at
              const dateStr = date
                ? new Date(date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'
              const status = row.payout_status ?? 'pending'

              return (
                <tr key={row.id} className="bg-surface-container-lowest">
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{dateStr}</td>
                  <td className="px-4 py-3 text-on-surface">
                    <Link
                      href={`/producer/orders/${row.order_id}`}
                      className="hover:text-secondary underline-offset-2 hover:underline"
                    >
                      {row.products?.name ?? '—'}
                    </Link>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 font-mono">
                      {row.order_id.slice(0, 8)}…
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-on-surface">
                    €{(gross / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-on-surface-variant">
                    −€{(commission / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-primary font-medium">
                    €{(net / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        payoutStatusClass[status] ??
                        'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
