import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

// MED-6: bounded scans — same reasoning as in /admin/customers. The finance
// summary cap is intentionally larger because aggregates depend on totals.
const ORDERS_SCAN_LIMIT = 20_000
const ORDER_ITEMS_SCAN_LIMIT = 40_000

async function getFinanceData() {
  const admin = createAdminClient()

  const [ordersRes, itemsRes] = await Promise.all([
    (admin as any).from('orders').select('total, status, created_at').limit(ORDERS_SCAN_LIMIT),
    (admin as any)
      .from('order_items')
      .select('price, quantity, order_id, producer_id, commission_cents, commission_rate_pct, producers(id, name)')
      .limit(ORDER_ITEMS_SCAN_LIMIT),
  ])

  const allOrders = (ordersRes.data ?? []) as { total: number; status: string; created_at: string }[]
  const allItems  = (itemsRes.data  ?? []) as {
    price: number
    quantity: number
    order_id: string
    producer_id: string
    commission_cents: number
    commission_rate_pct: number | null
    producers: { id: string; name: string } | null
  }[]

  const grossRevenue    = allOrders.reduce((s, o) => s + o.total, 0)
  const completedOrders = allOrders.filter((o) => o.status === 'delivered' || o.status === 'shipped')
  const completedRevenue = completedOrders.reduce((s, o) => s + o.total, 0)

  // Month-over-month
  const now       = new Date()
  const thisStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const thisMonth = allOrders
    .filter((o) => new Date(o.created_at) >= thisStart)
    .reduce((s, o) => s + o.total, 0)
  const lastMonth = allOrders
    .filter((o) => {
      const d = new Date(o.created_at)
      return d >= lastStart && d <= lastEnd
    })
    .reduce((s, o) => s + o.total, 0)

  const momChange =
    lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : null

  // Total commission earned across all items
  const totalCommission = allItems.reduce((s, i) => s + (i.commission_cents ?? 0), 0)

  // Per-producer revenue + commission
  const byProducer = new Map<
    string,
    { name: string; revenue: number; commission: number; orders: Set<string>; units: number }
  >()

  for (const item of allItems) {
    const pid  = item.producer_id
    const name = item.producers?.name ?? 'Unknown'
    if (!byProducer.has(pid)) {
      byProducer.set(pid, { name, revenue: 0, commission: 0, orders: new Set(), units: 0 })
    }
    const p = byProducer.get(pid)!
    p.revenue    += item.price * item.quantity
    p.commission += item.commission_cents ?? 0
    p.orders.add(item.order_id)
    p.units += item.quantity
  }

  const producerRows = Array.from(byProducer.entries())
    .map(([id, p]) => ({ id, name: p.name, revenue: p.revenue, commission: p.commission, orders: p.orders.size, units: p.units }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    grossRevenue,
    completedRevenue,
    totalCommission,
    orderCount: allOrders.length,
    completedCount: completedOrders.length,
    thisMonth,
    lastMonth,
    momChange,
    producerRows,
  }
}

function fmt(cents: number) {
  return `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const metadata = { title: 'Finance — Admin' }

export default async function AdminFinancePage() {
  const d = await getFinanceData()
  const topProducer = d.producerRows[0]
  const top3Revenue = d.producerRows.slice(0, 3).reduce((sum, p) => sum + p.revenue, 0)
  const top3Share = d.grossRevenue > 0 ? (top3Revenue / d.grossRevenue) * 100 : 0

  const cards = [
    { label: 'Gross revenue',      value: fmt(d.grossRevenue) },
    { label: 'Completed revenue',  value: fmt(d.completedRevenue) },
    { label: 'Platform commission', value: fmt(d.totalCommission),
      sub: d.grossRevenue > 0
        ? `${((d.totalCommission / d.grossRevenue) * 100).toFixed(1)}% effective rate`
        : 'No sales yet' },
    { label: 'This month',         value: fmt(d.thisMonth),
      sub: d.momChange !== null
        ? `${d.momChange >= 0 ? '+' : ''}${d.momChange.toFixed(1)}% vs last month`
        : 'First month' },
    { label: 'Last month',         value: fmt(d.lastMonth) },
    { label: 'Total orders',       value: String(d.orderCount) },
    { label: 'Fulfilled orders',   value: String(d.completedCount) },
  ]

  return (
    <div>
      <AdminPageHeader
        title="Finance"
        description="Revenue overview and per-producer breakdown. Stripe Connect payout detail coming in the next update."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
          {/* ── Metric cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cards.map(({ label, value, sub }) => (
              <div
                key={label}
                className="admin-kpi-card rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4"
              >
                <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
                  {label}
                </p>
                <p className="font-serif text-2xl text-primary">{value}</p>
                {sub && (
                  <p className={`font-sans text-xs mt-1 ${sub.startsWith('+') ? 'text-primary' : sub.startsWith('-') ? 'text-error' : 'text-on-surface-variant'}`}>
                    {sub}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ── Per-producer revenue ── */}
          <div className="mb-8">
            <h2 className="font-serif text-xl text-primary mb-4">Revenue by producer</h2>

            {d.producerRows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-8 text-center">
                <p className="font-sans text-sm text-on-surface-variant">
                  No sales data yet. Revenue will appear here once orders are placed.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Producer</th>
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right hidden sm:table-cell">Orders</th>
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right hidden md:table-cell">Units sold</th>
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">Gross revenue</th>
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right hidden lg:table-cell">Commission</th>
                      <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right hidden xl:table-cell">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {d.producerRows.map((p, idx) => {
                      const share = d.grossRevenue > 0
                        ? ((p.revenue / d.grossRevenue) * 100).toFixed(1)
                        : '0.0'
                      return (
                        <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-sans text-[10px] text-on-surface-variant/50 tabular-nums w-4">{idx + 1}</span>
                              <p className="font-sans text-sm text-on-surface font-medium">{p.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            <span className="font-sans text-sm text-on-surface tabular-nums">{p.orders}</span>
                          </td>
                          <td className="px-4 py-3 text-right hidden md:table-cell">
                            <span className="font-sans text-sm text-on-surface tabular-nums">{p.units}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-serif text-base text-primary tabular-nums">{fmt(p.revenue)}</span>
                          </td>
                          <td className="px-4 py-3 text-right hidden lg:table-cell">
                            <span className="font-sans text-sm text-secondary tabular-nums">{fmt(p.commission)}</span>
                          </td>
                          <td className="px-4 py-3 text-right hidden xl:table-cell">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                <div
                                  className="h-full bg-primary/60 rounded-full"
                                  style={{ width: `${share}%` }}
                                />
                              </div>
                              <span className="font-sans text-xs text-on-surface-variant tabular-nums w-10 text-right">
                                {share}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {d.producerRows.length > 1 && (
                    <tfoot>
                      <tr className="bg-surface-container-low/40 border-t border-outline-variant/20">
                        <td className="px-4 py-3 font-sans text-xs text-on-surface-variant" colSpan={2}>
                          Total across {d.producerRows.length} producers
                        </td>
                        <td className="px-4 py-3 text-right hidden md:table-cell">
                          <span className="font-sans text-xs text-on-surface-variant tabular-nums">
                            {d.producerRows.reduce((s, p) => s + p.units, 0)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-serif text-base text-primary tabular-nums">{fmt(d.grossRevenue)}</span>
                        </td>
                        <td className="px-4 py-3 text-right hidden lg:table-cell">
                          <span className="font-sans text-sm text-secondary tabular-nums">{fmt(d.totalCommission)}</span>
                        </td>
                        <td className="hidden xl:table-cell" />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>

        <aside className="xl:col-span-4 xl:sticky xl:top-24 space-y-4">
          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-3">Concentration risk</h2>
            <p className="font-sans text-sm text-on-surface">
              Top 3 producers generate{' '}
              <span className="font-semibold text-primary">{top3Share.toFixed(1)}%</span> of gross revenue.
            </p>
            {topProducer && (
              <p className="font-sans text-xs text-on-surface-variant mt-2">
                Top producer: <span className="text-on-surface">{topProducer.name}</span> ({fmt(topProducer.revenue)}).
              </p>
            )}
          </section>

          <section className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-3">Commission tracking</h2>
            <p className="font-sans text-sm text-on-surface-variant mb-2">
              Commission is captured at the time of each sale and stored immutably per order item — rate changes never affect historical records.
            </p>
            <p className="font-sans text-xs text-on-surface-variant">
              Producer payout schedules and Stripe fee reporting will be available after Stripe Connect integration.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
