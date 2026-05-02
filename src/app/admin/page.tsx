import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RevenueTrendChart } from '@/components/admin/RevenueTrendChart'
import { OrderStatusFunnel } from '@/components/admin/OrderStatusFunnel'
import { AnimatedKpiCard } from '@/components/ui/AnimatedKpiCard'

async function getMetrics() {
  const admin = createAdminClient()

  const [applications, producers, products, orders, ordersRevenue, customersRes, subsRes] = await Promise.all([
    (admin as any)
      .from('producer_applications')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    (admin as any)
      .from('producers')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    (admin as any)
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved'),
    (admin as any)
      .from('orders')
      .select('id', { count: 'exact', head: true }),
    (admin as any)
      .from('orders')
      .select('total'),
    (admin as any)
      .from('orders')
      .select('customer_email'),
    (admin as any)
      .from('newsletter_subscribers')
      .select('id', { count: 'exact', head: true }),
  ])

  const customerCount = new Set(
    (customersRes.data ?? []).map((r: { customer_email: string }) => r.customer_email),
  ).size

  const allTotals = (ordersRevenue.data ?? []).map((r: { total: number }) => r.total ?? 0)
  const totalRevenueCents = allTotals.reduce((sum: number, t: number) => sum + t, 0)
  const orderCount = orders.count ?? 0
  const avgOrderCents = orderCount > 0 ? Math.round(totalRevenueCents / orderCount) : 0

  return {
    pendingApplications: applications.count ?? 0,
    activeProducers: producers.count ?? 0,
    liveProducts: products.count ?? 0,
    totalOrders: orderCount,
    customers: customerCount,
    subscribers: subsRes.count ?? 0,
    totalRevenue: `€${(totalRevenueCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    avgOrder: avgOrderCents > 0 ? `€${(avgOrderCents / 100).toFixed(2)}` : '—',
  }
}

async function getRevenueTrend() {
  const admin = createAdminClient()
  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const { data } = await (admin as any)
    .from('orders')
    .select('created_at, total')
    .gte('created_at', since.toISOString())

  // Build a full 30-day map (fills missing days with 0)
  const byDay = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    byDay.set(d.toISOString().slice(0, 10), 0)
  }
  for (const o of (data ?? []) as { created_at: string; total: number }[]) {
    const key = o.created_at.slice(0, 10)
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + o.total)
  }

  return Array.from(byDay.entries()).map(([date, revenue]) => ({
    date,
    label: new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    }),
    revenue,
  }))
}

async function getOrderStatusCounts() {
  const admin = createAdminClient()
  const { data } = await (admin as any).from('orders').select('status')
  const counts = { new: 0, processing: 0, shipped: 0, delivered: 0 }
  for (const o of (data ?? []) as { status: string }[]) {
    if (o.status in counts) counts[o.status as keyof typeof counts]++
  }
  return counts
}

async function getRecentApplications() {
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('producer_applications')
    .select('id, full_name, business_name, email, country, region, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getMonthlyGrowth() {
  const admin = createAdminClient()
  const now = new Date()

  // This month: 1st of current month → now
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  // Last month: 1st → last day
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  const [thisRes, lastRes] = await Promise.all([
    (admin as any).from('orders').select('total').gte('created_at', thisMonthStart),
    (admin as any).from('orders').select('total').gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
  ])

  const sum = (rows: { total: number }[]) => rows.reduce((s, r) => s + (r.total ?? 0), 0)
  const thisCents = sum((thisRes.data ?? []) as { total: number }[])
  const lastCents = sum((lastRes.data ?? []) as { total: number }[])
  const pct = lastCents === 0 ? null : Math.round(((thisCents - lastCents) / lastCents) * 100)

  return { thisCents, lastCents, pct }
}

type TopProducerRow = { producer_id: string; name: string; revenue: number; orders: number }

async function getTopProducers(): Promise<TopProducerRow[]> {
  const admin = createAdminClient()
  // Sum order_items grouped by producer, joined with producer name
  const { data } = await (admin as any)
    .from('order_items')
    .select('producer_id, price, quantity, producers(name)')

  if (!data) return []

  type RawRow = { producer_id: string; price: number; quantity: number; producers: { name: string } | null }
  const map = new Map<string, TopProducerRow>()

  for (const row of data as RawRow[]) {
    const id   = row.producer_id
    const name = row.producers?.name ?? 'Unknown'
    const rev  = (row.price ?? 0) * (row.quantity ?? 1)
    if (!map.has(id)) map.set(id, { producer_id: id, name, revenue: 0, orders: 0 })
    const p = map.get(id)!
    p.revenue += rev
    p.orders  += 1
  }

  return [...map.values()]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

type RecentOrderRow = {
  id: string
  customer_name: string
  status: string
  total: number
  created_at: string
}

async function getRecentOrders(): Promise<RecentOrderRow[]> {
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('orders')
    .select('id, customer_name, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(8)
  return (data ?? []) as RecentOrderRow[]
}

const cards = [
  { key: 'pendingApplications', label: 'Pending applications',   iconName: 'ClipboardList' as const, href: '/admin/applications' },
  { key: 'activeProducers',     label: 'Active producers',       iconName: 'Users'         as const, href: '/admin/producers' },
  { key: 'liveProducts',        label: 'Live products',          iconName: 'Package'       as const, href: '/admin/products' },
  { key: 'totalOrders',         label: 'Total orders',           iconName: 'ShoppingCart'  as const, href: '/admin/orders' },
  { key: 'totalRevenue',        label: 'Total revenue',          iconName: 'Euro'          as const, href: '/admin/orders' },
  { key: 'avgOrder',            label: 'Avg. order value',       iconName: 'TrendingUp'    as const, href: '/admin/orders' },
  { key: 'customers',           label: 'Customers',              iconName: 'UserCheck'     as const, href: '/admin/customers' },
  { key: 'subscribers',         label: 'Newsletter subscribers', iconName: 'Mail'          as const, href: '/admin/subscribers' },
]

export default async function AdminOverviewPage() {
  const [metrics, recent, trendDays, statusCounts, growth, topProducers, recentOrders] = await Promise.all([
    getMetrics(),
    getRecentApplications(),
    getRevenueTrend(),
    getOrderStatusCounts(),
    getMonthlyGrowth(),
    getTopProducers(),
    getRecentOrders(),
  ])

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Control centre for applications, producers, products, orders, customers, and newsletter subscribers."
      />

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map(({ key, label, iconName, href }, i) => (
          <AnimatedKpiCard
            key={key}
            label={label}
            value={String(metrics[key as keyof typeof metrics])}
            iconName={iconName}
            href={href}
            index={i}
          />
        ))}
      </div>

      {/* ── Revenue trend + Order funnel ── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <RevenueTrendChart days={trendDays} />
        <OrderStatusFunnel counts={statusCounts} />
      </div>

      {/* ── Monthly growth + Top producers ── */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">

        {/* Monthly growth card */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            This month vs last month
          </p>
          <div className="flex items-end gap-3 mb-4">
            <p className="font-serif text-2xl text-primary">
              €{(growth.thisCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {growth.pct !== null && (
              <span className={`font-sans text-sm font-semibold mb-0.5 ${growth.pct >= 0 ? 'text-secondary' : 'text-error'}`}>
                {growth.pct >= 0 ? '+' : ''}{growth.pct}%
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-on-surface-variant">
            Last month: €{(growth.lastCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Top 5 producers by revenue */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-4">
            Top producers — all time
          </p>
          {topProducers.length === 0 ? (
            <p className="font-sans text-sm text-on-surface-variant/60">No order data yet.</p>
          ) : (
            <ol className="space-y-2.5">
              {topProducers.map((p, i) => {
                const maxRev = topProducers[0].revenue
                const pct = maxRev > 0 ? Math.round((p.revenue / maxRev) * 100) : 0
                return (
                  <li key={p.producer_id} className="grid grid-cols-[1.2rem_1fr_auto] items-center gap-2">
                    <span className="font-sans text-[10px] text-on-surface-variant/50 tabular-nums">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-sans text-xs text-on-surface truncate">{p.name}</span>
                        <span className="font-sans text-xs text-on-surface-variant ml-2 shrink-0 tabular-nums">
                          €{(p.revenue / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full rounded-full bg-secondary/70 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>

      {/* ── Recent orders feed ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-primary">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="font-sans text-sm text-on-surface-variant">No orders yet.</p>
        ) : (
          <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {['Customer', 'Date', 'Total', 'Status'].map((h) => (
                    <th key={h} className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-5 py-3 font-sans text-sm text-on-surface">{o.customer_name}</td>
                    <td className="px-4 py-3 font-sans text-xs text-on-surface-variant">
                      {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-serif text-sm text-primary tabular-nums">
                      €{(o.total / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        o.status === 'new'        ? 'bg-tertiary-fixed/30 text-tertiary'
                        : o.status === 'shipped'  ? 'bg-primary-fixed/40 text-primary'
                        : o.status === 'delivered'? 'bg-primary-fixed/30 text-primary'
                        : 'bg-secondary-container/50 text-secondary'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent applications ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-primary">Recent applications</h2>
          <Link
            href="/admin/applications"
            className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-on-surface-variant font-sans text-sm">
            No applications yet. Share the{' '}
            <Link href="/for-producers/apply" className="text-secondary hover:underline">
              application form
            </Link>{' '}
            with producers.
          </p>
        ) : (
          <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                    Name
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">
                    Location
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">
                    Date
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recent.map(
                  (app: {
                    id: string
                    full_name: string
                    business_name: string | null
                    email: string
                    country: string
                    region: string
                    status: string
                    created_at: string
                  }) => (
                    <tr key={app.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-sans text-sm text-on-surface">{app.full_name}</p>
                        {app.business_name && (
                          <p className="font-sans text-xs text-on-surface-variant">{app.business_name}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="font-sans text-xs text-on-surface-variant">
                          {app.region}, {app.country}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-sans text-xs text-on-surface-variant">
                          {new Date(app.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            app.status === 'pending'
                              ? 'bg-tertiary-fixed/30 text-tertiary'
                              : app.status === 'accepted'
                                ? 'bg-primary-fixed/40 text-primary'
                                : 'bg-error-container/50 text-error'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
