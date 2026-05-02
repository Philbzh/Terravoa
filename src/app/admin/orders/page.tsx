import { createAdminClient } from '@/lib/supabase/admin'
import { setOrderStatus } from './actions'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import Link from 'next/link'

type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered'

type OrderRow = {
  id: string
  customer_name: string
  customer_email: string
  status: OrderStatus
  total: number
  created_at: string
}

const PAGE_SIZE = 25
const STATUS_OPTIONS = ['all', 'new', 'processing', 'shipped', 'delivered'] as const
type OrderStatusFilter = (typeof STATUS_OPTIONS)[number]

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getStatus(raw: string | undefined): OrderStatusFilter {
  if (!raw) return 'all'
  return STATUS_OPTIONS.includes(raw as OrderStatusFilter) ? (raw as OrderStatusFilter) : 'all'
}

function hrefFor(q: string, status: OrderStatusFilter, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (status !== 'all') sp.set('status', status)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/orders?${qs}` : '/admin/orders'
}

const statusColor: Record<string, string> = {
  new: 'bg-tertiary-fixed/30 text-tertiary',
  processing: 'bg-secondary-container/50 text-secondary',
  shipped: 'bg-primary-fixed/40 text-primary',
  delivered: 'bg-primary-fixed/40 text-primary',
}

function StatusButtons({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const next: Record<OrderStatus, OrderStatus | null> = {
    new: 'processing',
    processing: 'shipped',
    shipped: 'delivered',
    delivered: null,
  }

  const nextStatus = next[current]

  if (!nextStatus) {
    return (
      <span className="font-sans text-[10px] text-on-surface-variant/40 uppercase tracking-wider">
        Complete
      </span>
    )
  }

  return (
    <form action={async () => { 'use server'; await setOrderStatus(orderId, nextStatus) }}>
      <button
        type="submit"
        className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors"
      >
        Mark {nextStatus}
      </button>
    </form>
  )
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q = '', status: rawStatus, page: pageRaw } = await searchParams
  const status = getStatus(rawStatus)
  const page = getPage(pageRaw)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const admin = createAdminClient()

  const base = (admin as any)
    .from('orders')
    .select('id, customer_name, customer_email, status, total, created_at')
    .order('created_at', { ascending: false })
    .range(from, to)
  const countBase = (admin as any)
    .from('orders')
    .select('id', { count: 'exact', head: true })
  const search = q.trim()
  const filter = search
    ? `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,id.ilike.%${search}%`
    : null

  const listQuery = filter ? base.or(filter) : base
  const countQuery = filter ? countBase.or(filter) : countBase
  // Per-tab counts — same search filter (`q`) applies to each count so the
  // badge numbers stay coherent with what the user actually searched for.
  const makeStatusCountQuery = (s: Exclude<OrderStatusFilter, 'all'>) => {
    const qb = (admin as any).from('orders').select('id', { count: 'exact', head: true })
    const filtered = filter ? qb.or(filter) : qb
    return filtered.eq('status', s)
  }
  const [
    { data, error },
    countRes,
    newRes,
    processingRes,
    shippedRes,
    deliveredRes,
  ] = await Promise.all([
    status !== 'all' ? listQuery.eq('status', status) : listQuery,
    status !== 'all' ? countQuery.eq('status', status) : countQuery,
    makeStatusCountQuery('new'),
    makeStatusCountQuery('processing'),
    makeStatusCountQuery('shipped'),
    makeStatusCountQuery('delivered'),
  ])

  const list = (data ?? []) as OrderRow[]
  const totalCount = countRes.count ?? 0
  const statusCounts: Record<OrderStatusFilter, number> = {
    all:        (newRes.count ?? 0) + (processingRes.count ?? 0) + (shippedRes.count ?? 0) + (deliveredRes.count ?? 0),
    new:        newRes.count        ?? 0,
    processing: processingRes.count ?? 0,
    shipped:    shippedRes.count    ?? 0,
    delivered:  deliveredRes.count  ?? 0,
  }
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Marketplace-wide order overview. Advance each order through: new → processing → shipped → delivered."
      />
      <form method="get" className="admin-toolbar">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by customer, email, or order ID…"
          className="w-full sm:max-w-md rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
        />
        <button
          type="submit"
          className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors"
        >
          Search
        </button>
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
      </form>
      {/* Status tabs with live per-bucket counts — helps the admin spot
          where orders are piling up without eyeballing the table. */}
      <nav
        className="admin-filter-row"
        aria-label="Filter orders by status"
      >
        {STATUS_OPTIONS.map((s) => {
          const isActive = status === s
          return (
            <Link
              key={s}
              href={hrefFor(q, s, 1)}
              aria-current={isActive ? 'page' : undefined}
              className={`admin-filter-chip inline-flex items-center gap-2 ${
                isActive
                  ? 'border-secondary/40 text-secondary bg-secondary/10'
                  : 'border-outline-variant/30 text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="capitalize">{s}</span>
              <span
                className={`text-[10px] font-medium rounded-full px-1.5 py-0.5 ${
                  isActive
                    ? 'bg-secondary/20 text-secondary'
                    : 'bg-outline-variant/15 text-on-surface-variant'
                }`}
              >
                {statusCounts[s]}
              </span>
            </Link>
          )
        })}
      </nav>
      {list.length > 0 && (
        <p className="font-sans text-sm text-on-surface-variant mb-8">
          Total revenue:{' '}
          <span className="font-serif text-primary">
            &euro;{(list.reduce((s, o) => s + o.total, 0) / 100).toFixed(2)}
          </span>{' '}
          across {list.length} order{list.length !== 1 ? 's' : ''}.
        </p>
      )}

      {error && (
        <p className="text-error font-sans text-sm mb-4">{error.message}</p>
      )}

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No orders yet. Orders will appear here once customers complete checkout.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="bg-surface-container-low/70">
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Customer
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">
                  Order ID
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">
                  Date
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Total
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Status
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {list.map((o) => (
                <tr key={o.id} className="even:bg-surface-container-low/15 hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-on-surface">{o.customer_name}</p>
                    <p className="font-sans text-xs text-on-surface-variant">{o.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-sans text-xs text-secondary hover:underline font-mono"
                    >
                      {o.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant">
                      {new Date(o.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-on-surface tabular-nums">
                      &euro;{(o.total / 100).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        statusColor[o.status] ?? 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusButtons orderId={o.id} current={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="font-sans text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            {prevPage ? (
              <Link
                href={hrefFor(q, status, prevPage)}
                className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary"
              >
                Previous
              </Link>
            ) : (
              <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant/40">
                Previous
              </span>
            )}
            {nextPage ? (
              <Link
                href={hrefFor(q, status, nextPage)}
                className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary"
              >
                Next
              </Link>
            ) : (
              <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant/40">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
