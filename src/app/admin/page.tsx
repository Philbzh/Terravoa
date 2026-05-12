import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminNavCounts } from '@/lib/admin/navigation'
import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { RevenueTrendChart } from '@/components/admin/RevenueTrendChart'
import { OrderStatusFunnel } from '@/components/admin/OrderStatusFunnel'
import { AnimatedKpiCard } from '@/components/ui/AnimatedKpiCard'
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Package,
  RotateCcw,
  Star,
  MessageSquare,
  ArrowUpCircle,
  CheckCircle2,
} from 'lucide-react'

async function getMetrics() {
  const admin = createAdminClient()

  const [producers, products, orders, ordersRevenue, customersRes] = await Promise.all([
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
  ])

  const customerCount = new Set(
    (customersRes.data ?? []).map((r: { customer_email: string }) => r.customer_email),
  ).size

  const allTotals = (ordersRevenue.data ?? []).map((r: { total: number }) => r.total ?? 0)
  const totalRevenueCents = allTotals.reduce((sum: number, t: number) => sum + t, 0)

  return {
    activeProducers: producers.count ?? 0,
    liveProducts: products.count ?? 0,
    totalOrders: orders.count ?? 0,
    customers: customerCount,
    totalRevenue: `€${(totalRevenueCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
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

type RecentApplicationRow = {
  id: string
  full_name: string
  business_name: string | null
  status: string
  created_at: string
}

async function getRecentApplications(): Promise<RecentApplicationRow[]> {
  const admin = createAdminClient()
  const { data } = await (admin as any)
    .from('producer_applications')
    .select('id, full_name, business_name, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return (data ?? []) as RecentApplicationRow[]
}

const cards = [
  { key: 'activeProducers', label: 'Active producers', iconName: 'Users'        as const, href: '/admin/producers' },
  { key: 'liveProducts',    label: 'Live products',    iconName: 'Package'      as const, href: '/admin/products' },
  { key: 'totalOrders',     label: 'Total orders',     iconName: 'ShoppingCart' as const, href: '/admin/orders' },
  { key: 'totalRevenue',    label: 'Total revenue',    iconName: 'Euro'         as const, href: '/admin/orders' },
]

export default async function AdminOverviewPage() {
  const [metrics, trendDays, statusCounts, recentOrders, recentApps, navCounts] = await Promise.all([
    getMetrics(),
    getRevenueTrend(),
    getOrderStatusCounts(),
    getRecentOrders(),
    getRecentApplications(),
    getAdminNavCounts(),
  ])

  const actionItems = [
    { count: navCounts.pendingApplications, label: 'Pending applications',    href: '/admin/applications',             icon: ClipboardList, tone: 'warning'  as const },
    { count: navCounts.pendingProducts,     label: 'Products awaiting review', href: '/admin/products?status=pending', icon: Package,       tone: 'warning'  as const },
    { count: navCounts.pendingReturns,      label: 'Return requests',          href: '/admin/returns',                 icon: RotateCcw,     tone: 'critical' as const },
    { count: navCounts.ratingAlerts,        label: 'Rating alerts',            href: '/admin/ratings',                 icon: Star,          tone: 'critical' as const },
    { count: navCounts.pendingReviews,      label: 'Reviews to moderate',      href: '/admin/reviews',                 icon: MessageSquare, tone: 'info'     as const },
    { count: navCounts.pendingPlanRequests, label: 'Plan upgrade requests',    href: '/admin/plan-requests',           icon: ArrowUpCircle, tone: 'info'     as const },
  ]

  const activeItems = actionItems.filter((item) => item.count > 0)
  const totalActionItems = activeItems.reduce((sum, item) => sum + item.count, 0)

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Control centre for the Terravoa marketplace."
      />

      {/* ── Snapshot KPIs ── */}
      <div className="mb-6">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          Snapshot
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      {/* ── Two-column: recent activity + action items ── */}
      <div className="grid xl:grid-cols-3 gap-4 mb-8">

        {/* Recent activity (2/3) */}
        <div className="xl:col-span-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10 bg-surface-container-low/30">
            <h2 className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-medium">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 font-sans text-xs text-secondary hover:text-primary transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="font-sans text-sm text-on-surface-variant">No orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                      {o.customer_name}
                    </p>
                    <p className="font-sans text-[11px] text-on-surface-variant">
                      {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={`font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    o.status === 'new'        ? 'bg-tertiary-fixed/30 text-tertiary'
                    : o.status === 'shipped'  ? 'bg-primary-fixed/40 text-primary'
                    : o.status === 'delivered'? 'bg-primary-fixed/30 text-primary'
                    : 'bg-secondary-container/50 text-secondary'
                  }`}>
                    {o.status}
                  </span>
                  <span className="font-serif text-sm text-primary tabular-nums shrink-0">
                    €{(o.total / 100).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Recent applications below orders in the same card */}
          <div className="border-t border-outline-variant/20">
            <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10 bg-surface-container-low/30">
              <h2 className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-medium">
                Recent applications
              </h2>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-1 font-sans text-xs text-secondary hover:text-primary transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="font-sans text-sm text-on-surface-variant">
                  No applications yet. Share the{' '}
                  <Link href="/for-producers/apply" className="text-secondary hover:underline">
                    application form
                  </Link>{' '}
                  with producers.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/10">
                {recentApps.map((app) => (
                  <Link
                    key={app.id}
                    href={`/admin/applications/${app.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-on-surface group-hover:text-primary transition-colors truncate">
                        {app.full_name}
                      </p>
                      {app.business_name && (
                        <p className="font-sans text-[11px] text-on-surface-variant truncate">{app.business_name}</p>
                      )}
                    </div>
                    <span className={`font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      app.status === 'pending'
                        ? 'bg-tertiary-fixed/30 text-tertiary'
                        : app.status === 'accepted'
                          ? 'bg-primary-fixed/40 text-primary'
                          : 'bg-error-container/50 text-error'
                    }`}>
                      {app.status}
                    </span>
                    <span className="font-sans text-[11px] text-on-surface-variant shrink-0">
                      {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action items sidebar (1/3) */}
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden h-fit">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10 bg-surface-container-low/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-tertiary" />
              <h2 className="font-sans text-xs uppercase tracking-wider text-on-surface-variant font-medium">
                Needs attention
              </h2>
            </div>
            {totalActionItems > 0 && (
              <span className="font-sans text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary">
                {totalActionItems}
              </span>
            )}
          </div>
          {activeItems.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-primary/50 mb-2" />
              <p className="font-sans text-sm text-on-surface">All clear</p>
              <p className="font-sans text-xs text-on-surface-variant mt-1">Nothing requires your attention right now.</p>
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-sans font-medium">
                <Link href="/admin/producers" className="text-secondary hover:text-primary hover:underline">Producers</Link>
                <Link href="/admin/orders" className="text-secondary hover:text-primary hover:underline">Orders</Link>
                <Link href="/admin/products" className="text-secondary hover:text-primary hover:underline">Products</Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {activeItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/40 transition-colors group"
                  >
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${
                        item.tone === 'critical'
                          ? 'bg-error-container/20 text-error'
                          : item.tone === 'warning'
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : 'bg-primary-fixed/30 text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-on-surface group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-sans text-sm font-semibold tabular-nums ${
                          item.tone === 'critical'
                            ? 'text-error'
                            : item.tone === 'warning'
                              ? 'text-tertiary'
                              : 'text-primary'
                        }`}
                      >
                        {item.count}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <RevenueTrendChart days={trendDays} />
        <OrderStatusFunnel counts={statusCounts} />
      </div>
    </div>
  )
}
