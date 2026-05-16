import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import Link from 'next/link'

type CustomerRow = {
  email: string
  name: string
  orderCount: number
  totalSpent: number
  firstOrder: string
  lastOrder: string
}

const PAGE_SIZE = 25
const ORDERS_SCAN_LIMIT = 10_000
const ORDER_ITEMS_SCAN_LIMIT = 20_000

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function hrefFor(q: string, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/customers?${qs}` : '/admin/customers'
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = '', page: pageRaw } = await searchParams
  const page = getPage(pageRaw)
  const admin = createAdminClient()

  const { data, error } = await (admin as any)
    .from('orders')
    .select('id, customer_email, customer_name, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(ORDERS_SCAN_LIMIT)
  const { data: itemsData } = await (admin as any)
    .from('order_items')
    .select('order_id, tracking_number')
    .limit(ORDER_ITEMS_SCAN_LIMIT)

  const rows = (data ?? []) as {
    id: string
    customer_email: string
    customer_name: string
    total: number
    status: string
    created_at: string
  }[]
  const orderItems = (itemsData ?? []) as { order_id: string; tracking_number: string | null }[]
  const trackingByOrder = new Map<string, string[]>()
  for (const item of orderItems) {
    if (!item.tracking_number) continue
    const list = trackingByOrder.get(item.order_id) ?? []
    if (!list.includes(item.tracking_number)) list.push(item.tracking_number)
    trackingByOrder.set(item.order_id, list)
  }

  // Group by email
  const map = new Map<string, CustomerRow>()
  for (const row of rows) {
    const existing = map.get(row.customer_email)
    if (!existing) {
      map.set(row.customer_email, {
        email: row.customer_email,
        name: row.customer_name,
        orderCount: 1,
        totalSpent: row.total,
        firstOrder: row.created_at,
        lastOrder: row.created_at,
      })
    } else {
      existing.orderCount += 1
      existing.totalSpent += row.total
      if (row.created_at < existing.firstOrder) existing.firstOrder = row.created_at
      if (row.created_at > existing.lastOrder) existing.lastOrder = row.created_at
    }
  }

  let customers = Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)

  // Search filter
  const search = q.trim().toLowerCase()
  if (search) {
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search),
    )
  }

  const totalCount = customers.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const from = (page - 1) * PAGE_SIZE
  const paginated = customers.slice(from, from + PAGE_SIZE)
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null

  function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Customer overview with order history and spending."
        metrics={[
          { label: 'customers', value: totalCount },
        ]}
      />

      <form method="get" className="admin-toolbar">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email…"
          className="w-full sm:max-w-md rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
        />
        <button
          type="submit"
          className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="text-error font-sans text-sm mb-4">{error.message}</p>
      )}

      {paginated.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No customers yet. They will appear here once orders are placed.
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Customer
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">
                  Email
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  Orders
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  Total spent
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">
                  First order
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">
                  Last order
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginated.map((c) => (
                <tr key={c.email} className="hover:bg-surface-container-low/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-on-surface">{c.name}</p>
                    <p className="font-sans text-xs text-on-surface-variant sm:hidden">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-sans text-sm text-on-surface tabular-nums">{c.orderCount}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-sans text-sm text-primary tabular-nums">
                      &euro;{(c.totalSpent / 100).toFixed(2)}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant">{fmt(c.firstOrder)}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant">{fmt(c.lastOrder)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders?q=${encodeURIComponent(c.email)}`}
                      className="font-sans text-[11px] uppercase tracking-wide text-secondary hover:text-primary transition-colors"
                    >
                      View orders
                    </Link>
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
            Page {page} of {totalPages} ({totalCount} customers)
          </p>
          <div className="flex items-center gap-3">
            {prevPage ? (
              <Link
                href={hrefFor(q, prevPage)}
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
                href={hrefFor(q, nextPage)}
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
