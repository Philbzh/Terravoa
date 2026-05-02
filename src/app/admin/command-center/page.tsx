import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getOpsCommandCenterData } from '@/lib/admin/ops-command-center'
import { markContacted, resolveFollowup, sendReminderNow, snoozeFollowup } from './actions'

function ageBadge(hours: number) {
  if (hours >= 72) return 'bg-error-container/60 text-error'
  if (hours >= 48) return 'bg-tertiary-fixed/35 text-tertiary'
  return 'bg-surface-container-high text-on-surface-variant'
}

function followupBadge(status: 'open' | 'contacted' | 'snoozed' | 'resolved') {
  if (status === 'resolved') return 'bg-primary-fixed/40 text-primary'
  if (status === 'contacted') return 'bg-secondary-container/50 text-secondary'
  if (status === 'snoozed') return 'bg-tertiary-fixed/30 text-tertiary'
  return 'bg-surface-container-high text-on-surface-variant'
}

export default async function AdminCommandCenterPage() {
  const data = await getOpsCommandCenterData()

  return (
    <div>
      <AdminPageHeader
        title="Command Center"
        description="Producer-direct operations monitoring: delayed fulfillment, return backlog, and producer escalation priorities."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <Metric label="Untracked >=24h" value={String(data.delayed24h)} tone="warn" />
        <Metric label="Untracked >=48h" value={String(data.delayed48h)} tone="warn" />
        <Metric label="Untracked >=72h" value={String(data.delayed72h)} tone="danger" />
        <Metric label="Returns >=24h" value={String(data.returnBacklog24h)} tone="neutral" />
        <Metric label="Plan req >=48h" value={String(data.planBacklog48h)} tone="neutral" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-primary">Delayed producer fulfillment</h2>
            <Link href="/admin/orders?status=processing" className="font-sans text-xs text-secondary hover:underline">
              Open orders
            </Link>
          </div>
          {data.delayedItems.length === 0 ? (
            <p className="font-sans text-sm text-on-surface-variant">No delayed items right now.</p>
          ) : (
            <div className="space-y-2">
              {data.delayedItems.map((row) => (
                <article key={`${row.orderId}-${row.producerId}`} className="rounded-lg border border-outline-variant/15 bg-surface px-3 py-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-sm text-on-surface">
                      <strong>{row.producerName}</strong> · {row.customerName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${ageBadge(row.ageHours)}`}>
                        {row.ageHours}h
                      </span>
                      <span className={`font-sans text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${followupBadge(row.followupStatus)}`}>
                        {row.followupStatus}
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">{row.customerEmail}</p>
                  {row.lastContactedAt && (
                    <p className="font-sans text-[11px] text-on-surface-variant mt-1">
                      Last contacted: {new Date(row.lastContactedAt).toLocaleString('en-GB')}
                      {row.nextFollowUpAt
                        ? ` · Next follow-up: ${new Date(row.nextFollowUpAt).toLocaleString('en-GB')}`
                        : ''}
                      {row.contactCount > 0 ? ` · Contact count: ${row.contactCount}` : ''}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3">
                    <Link href={`/admin/orders/${row.orderId}`} className="font-sans text-[11px] text-secondary hover:underline">
                      Open order
                    </Link>
                    <Link href={`/admin/producers/${row.producerId}`} className="font-sans text-[11px] text-secondary hover:underline">
                      Open producer
                    </Link>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <form action={sendReminderNow}>
                      <input type="hidden" name="order_id" value={row.orderId} />
                      <input type="hidden" name="producer_id" value={row.producerId} />
                      <button type="submit" className="font-sans text-[10px] uppercase tracking-wider border border-secondary/35 text-secondary rounded-full px-2.5 py-1 hover:bg-secondary/8">
                        Send reminder now
                      </button>
                    </form>
                    <form action={markContacted}>
                      <input type="hidden" name="order_id" value={row.orderId} />
                      <input type="hidden" name="producer_id" value={row.producerId} />
                      <button type="submit" className="font-sans text-[10px] uppercase tracking-wider border border-outline-variant/35 text-on-surface-variant rounded-full px-2.5 py-1 hover:text-on-surface">
                        Mark contacted
                      </button>
                    </form>
                    <form action={snoozeFollowup} className="flex items-center gap-1">
                      <input type="hidden" name="order_id" value={row.orderId} />
                      <input type="hidden" name="producer_id" value={row.producerId} />
                      <input type="hidden" name="hours" value="24" />
                      <button type="submit" className="font-sans text-[10px] uppercase tracking-wider border border-outline-variant/35 text-on-surface-variant rounded-full px-2.5 py-1 hover:text-on-surface">
                        Snooze 24h
                      </button>
                    </form>
                    <form action={resolveFollowup}>
                      <input type="hidden" name="order_id" value={row.orderId} />
                      <input type="hidden" name="producer_id" value={row.producerId} />
                      <button type="submit" className="font-sans text-[10px] uppercase tracking-wider border border-primary/30 text-primary rounded-full px-2.5 py-1 hover:bg-primary/8">
                        Resolve
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-primary">Producer risk ranking</h2>
            <Link href="/admin/producers" className="font-sans text-xs text-secondary hover:underline">
              Open producers
            </Link>
          </div>
          {data.topDelayedProducers.length === 0 ? (
            <p className="font-sans text-sm text-on-surface-variant">No current producer delay risk.</p>
          ) : (
            <div className="space-y-2">
              {data.topDelayedProducers.map((p) => (
                <div key={p.producerId} className="rounded-lg border border-outline-variant/15 bg-surface px-3 py-2.5 flex items-center justify-between gap-3">
                  <p className="font-sans text-sm text-on-surface">{p.producerName}</p>
                  <span className="font-sans text-xs text-on-surface-variant">{p.delayedCount} delayed item(s)</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'neutral' | 'warn' | 'danger'
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-error'
      : tone === 'warn'
        ? 'text-tertiary'
        : 'text-primary'
  return (
    <div className="admin-kpi-card rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4">
      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{label}</p>
      <p className={`font-serif text-3xl ${toneClass}`}>{value}</p>
    </div>
  )
}
