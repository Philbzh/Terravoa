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
  recentOrders: {
    id: string
    status: string
    created_at: string
    trackingNumbers: string[]
  }[]
}

// MED-6: cap aggregation queries so a single admin page view can't try to
// materialise millions of rows. At scale these views should move to a
// materialised view / KPI cache, but until then the caps bound memory usage.
const ORDERS_SCAN_LIMIT = 10_000
const ORDER_ITEMS_SCAN_LIMIT = 20_000

export default async function AdminCustomersPage() {
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
        recentOrders: [
          {
            id: row.id,
            status: row.status,
            created_at: row.created_at,
            trackingNumbers: trackingByOrder.get(row.id) ?? [],
          },
        ],
      })
    } else {
      existing.orderCount += 1
      existing.totalSpent += row.total
      // created_at is sorted desc, so firstOrder = smallest date
      if (row.created_at < existing.firstOrder) existing.firstOrder = row.created_at
      if (row.created_at > existing.lastOrder) existing.lastOrder = row.created_at
      if (existing.recentOrders.length < 5) {
        existing.recentOrders.push({
          id: row.id,
          status: row.status,
          created_at: row.created_at,
          trackingNumbers: trackingByOrder.get(row.id) ?? [],
        })
      }
    }
  }

  const customers = Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)

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
        description="Customer overview with order history, shipment status, and tracking numbers entered by producers."
      />

      {error && (
        <p className="text-error font-sans text-sm mb-4">{error.message}</p>
      )}

      {customers.length === 0 ? (
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
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  Logistics
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {customers.map((c) => (
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
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders?q=${encodeURIComponent(c.email)}`}
                      className="font-sans text-[11px] text-secondary hover:underline block mb-2"
                    >
                      Open all orders for this customer
                    </Link>
                    <details>
                      <summary className="cursor-pointer font-sans text-xs text-secondary hover:underline">
                        View orders ({c.recentOrders.length})
                      </summary>
                      <div className="mt-2 space-y-2">
                        {c.recentOrders.map((o) => (
                          <div key={o.id} className="rounded-lg border border-outline-variant/15 px-3 py-2 bg-surface">
                            <p className="font-sans text-[11px] text-on-surface-variant">
                              {o.id.slice(0, 8)} · {fmt(o.created_at)}
                            </p>
                            <p className="font-sans text-xs text-on-surface mt-0.5">
                              Shipment status: <span className="capitalize">{o.status}</span>
                            </p>
                            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                              Tracking:{' '}
                              {o.trackingNumbers.length > 0 ? o.trackingNumbers.join(', ') : 'Not entered yet'}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Link
                                href={`/admin/orders/${o.id}`}
                                className="font-sans text-[11px] text-secondary hover:underline"
                              >
                                Open detail
                              </Link>
                              <Link
                                href={`/admin/orders?q=${encodeURIComponent(o.id)}`}
                                className="font-sans text-[11px] text-secondary hover:underline"
                              >
                                Open in list
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
