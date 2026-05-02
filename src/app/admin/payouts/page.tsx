import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { markPayoutPaid } from './actions'
import { Euro, Building2, AlertTriangle } from 'lucide-react'

/** Wraps markPayoutPaid so the form action signature is `void`. */
async function markPayoutPaidAction(formData: FormData): Promise<void> {
  'use server'
  await markPayoutPaid(formData)
}

// ── Types ────────────────────────────────────────────────────────────────────

type PayoutItem = {
  id: string
  order_id: string
  quantity: number
  price: number
  commission_rate_pct: number | null
  commission_cents: number
  payout_status: string | null
  producer_id: string
  // joined
  producers: {
    name: string
    bank_iban: string | null
    bank_bic: string | null
    bank_account_name: string | null
  } | null
  products: { name: string } | null
}

type ProducerPayoutGroup = {
  producerId: string
  producerName: string
  bankIban: string | null
  bankBic: string | null
  bankAccountName: string | null
  items: PayoutItem[]
  totalNetCents: number
}

// ── Data fetching ────────────────────────────────────────────────────────────

async function getDuePayouts(): Promise<ProducerPayoutGroup[]> {
  const admin = createAdminClient()

  const { data, error } = await (admin as any)
    .from('order_items')
    .select(
      'id, order_id, quantity, price, commission_rate_pct, commission_cents, payout_status, producer_id, producers(name, bank_iban, bank_bic, bank_account_name), products(name)',
    )
    .eq('payout_status', 'due')
    .order('producer_id', { ascending: true })

  if (error) {
    console.error('[admin/payouts] fetch failed', error.message)
    return []
  }

  const rows = (data ?? []) as PayoutItem[]

  // Group by producer
  const map = new Map<string, ProducerPayoutGroup>()

  for (const row of rows) {
    const pid = row.producer_id
    if (!map.has(pid)) {
      const p = row.producers
      map.set(pid, {
        producerId: pid,
        producerName: p?.name ?? 'Unknown producer',
        bankIban: p?.bank_iban ?? null,
        bankBic: p?.bank_bic ?? null,
        bankAccountName: p?.bank_account_name ?? null,
        items: [],
        totalNetCents: 0,
      })
    }

    const group = map.get(pid)!
    const gross = row.price * row.quantity
    const commission = row.commission_cents ?? Math.round(gross * ((row.commission_rate_pct ?? 0) / 100))
    const net = gross - commission

    group.items.push(row)
    group.totalNetCents += net
  }

  return [...map.values()]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function eur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`
}

function maskIban(iban: string | null) {
  if (!iban) return null
  if (iban.length <= 8) return iban
  return `${iban.slice(0, 4)}${'·'.repeat(iban.length - 8)}${iban.slice(-4)}`
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPayoutsPage() {
  const groups = await getDuePayouts()
  const grandTotal = groups.reduce((s, g) => s + g.totalNetCents, 0)

  return (
    <div>
      <AdminPageHeader
        title="Payouts"
        description="Producer payouts waiting for manual SEPA transfer. Mark as paid after you have processed the bank transfer."
      />

      {/* Summary bar */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-3">
          <Euro size={16} className="text-secondary" />
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
              Total due
            </p>
            <p className="font-serif text-xl text-primary tabular-nums">{eur(grandTotal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-3">
          <Building2 size={16} className="text-secondary" />
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
              Producers
            </p>
            <p className="font-serif text-xl text-primary">{groups.length}</p>
          </div>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-16 text-center max-w-lg mx-auto">
          <Euro size={36} strokeWidth={1} className="mx-auto mb-4 text-on-surface-variant/35" />
          <p className="font-sans text-sm text-on-surface-variant">
            No payouts pending. All producers have been paid.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const missingBank = !group.bankIban || !group.bankAccountName
            const itemIds = group.items.map((i) => i.id)

            return (
              <article
                key={group.producerId}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm"
              >
                {/* Producer header */}
                <header className="bg-surface-container-low/70 border-b border-outline-variant/15 px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-serif text-lg text-primary">{group.producerName}</p>
                      {group.bankAccountName && (
                        <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                          {group.bankAccountName}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-4 font-mono text-xs text-on-surface">
                        {group.bankIban && (
                          <span>
                            <span className="text-on-surface-variant font-sans">IBAN </span>
                            {maskIban(group.bankIban)}
                          </span>
                        )}
                        {group.bankBic && (
                          <span>
                            <span className="text-on-surface-variant font-sans">BIC </span>
                            {group.bankBic}
                          </span>
                        )}
                      </div>

                      {missingBank && (
                        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-error/10 border border-error/20 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-error">
                          <AlertTriangle size={11} />
                          Bank details missing — cannot process SEPA
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">
                        Net due
                      </p>
                      <p className="font-serif text-2xl text-primary tabular-nums">
                        {eur(group.totalNetCents)}
                      </p>
                    </div>
                  </div>
                </header>

                {/* Line items */}
                <div className="divide-y divide-outline-variant/10">
                  {group.items.map((item) => {
                    const gross = item.price * item.quantity
                    const comm = item.commission_cents ?? Math.round(gross * ((item.commission_rate_pct ?? 0) / 100))
                    const net = gross - comm

                    return (
                      <div
                        key={item.id}
                        className="px-5 py-4 sm:px-6 grid grid-cols-[1fr_auto] gap-2 items-center"
                      >
                        <div>
                          <p className="font-sans text-sm text-on-surface">
                            {item.products?.name ?? 'Product'}
                          </p>
                          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                            Qty {item.quantity} · Order{' '}
                            <span className="font-mono">{item.order_id.slice(0, 8)}…</span>
                          </p>
                        </div>
                        <div className="text-right font-sans text-xs text-on-surface-variant tabular-nums">
                          <p>Gross {eur(gross)}</p>
                          <p>Comm −{eur(comm)}</p>
                          <p className="font-semibold text-on-surface">Net {eur(net)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Mark as paid action */}
                <footer className="bg-surface-container-low/40 border-t border-outline-variant/15 px-5 py-4 sm:px-6 flex items-center justify-between gap-4">
                  <p className="font-sans text-xs text-on-surface-variant">
                    Transfer {eur(group.totalNetCents)} via SEPA to the account above, then mark as paid.
                  </p>
                  <form action={markPayoutPaidAction}>
                    <input
                      type="hidden"
                      name="order_item_ids"
                      value={JSON.stringify(itemIds)}
                    />
                    <button
                      type="submit"
                      disabled={missingBank}
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mark as paid
                    </button>
                  </form>
                </footer>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
