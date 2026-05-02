import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { OrderIdCopyButton } from '@/components/admin/OrderIdCopyButton'
import {
  ORDER_FULFILLMENT_STATUSES,
  ORDER_PAYMENT_STATUSES,
  ORDER_PAYOUT_STATUSES,
  type OrderFulfillmentStatus,
  type OrderPaymentStatus,
  type OrderPayoutStatus,
} from '@/lib/order-workflow'
import { refundOrder, refundOrderItem, updateOrderWorkflow } from '../actions'

type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered'

type OrderDetails = {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  shipping_address: Record<string, string> | null
  status: OrderStatus
  fulfillment_status?: string
  payment_status?: string
  payout_status?: string
  total: number
  // Gift fields
  is_gift?: boolean
  gift_recipient?: string | null
  gift_message?: string | null
  gift_wrap?: boolean
}

type OrderItem = {
  id: string
  product_id: string
  producer_id: string
  quantity: number
  price: number
  tracking_number: string | null
  status?: string
  carrier?: string | null
  eta_at?: string | null
}

type ProductLite = { id: string; name: string; slug: string }
type ProducerLite = { id: string; name: string; slug: string }

type TimelineEvent = {
  at: string
  title: string
  detail: string
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadgeClass(status: OrderStatus) {
  switch (status) {
    case 'new':
      return 'bg-tertiary-fixed/30 text-tertiary'
    case 'processing':
      return 'bg-secondary-container/50 text-secondary'
    case 'shipped':
      return 'bg-primary-fixed/40 text-primary'
    case 'delivered':
      return 'bg-primary-fixed/40 text-primary'
    default:
      return 'bg-surface-container-high text-on-surface-variant'
  }
}

async function getOrderData(orderId: string) {
  const admin = createAdminClient() as any

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (orderError) throw new Error(orderError.message)
  if (!order) return null

  const { data: itemData, error: itemError } = await admin
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)

  if (itemError) throw new Error(itemError.message)
  const items = (itemData ?? []) as OrderItem[]

  const productIds = Array.from(new Set(items.map((i) => i.product_id)))
  const producerIds = Array.from(new Set(items.map((i) => i.producer_id)))

  const [{ data: productsData }, { data: producersData }, { data: auditData }] = await Promise.all([
    productIds.length > 0
      ? admin.from('products').select('id, name, slug').in('id', productIds)
      : Promise.resolve({ data: [] }),
    producerIds.length > 0
      ? admin.from('producers').select('id, name, slug').in('id', producerIds)
      : Promise.resolve({ data: [] }),
    admin
      .from('admin_audit_logs')
      .select('created_at, actor_email, action, metadata')
      .eq('entity_type', 'order')
      .eq('entity_id', orderId)
      .order('created_at', { ascending: true }),
  ])

  return {
    order: order as OrderDetails,
    items,
    products: (productsData ?? []) as ProductLite[],
    producers: (producersData ?? []) as ProducerLite[],
    auditLogs:
      ((auditData ?? []) as {
        created_at: string
        actor_email: string
        action: string
        metadata: Record<string, unknown>
      }[]),
  }
}

function buildTimeline(input: {
  order: OrderDetails
  items: OrderItem[]
  auditLogs: { created_at: string; actor_email: string; action: string; metadata: Record<string, unknown> }[]
}): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      at: input.order.created_at,
      title: 'Order created',
      detail: `${input.order.customer_name} (${input.order.customer_email}) placed this order.`,
    },
  ]

  for (const log of input.auditLogs) {
    if (!log.action.startsWith('order.')) continue
    const status = String(log.metadata?.status ?? log.action.replace('order.', ''))
    events.push({
      at: log.created_at,
      title: `Status changed to ${status}`,
      detail: `Updated by ${log.actor_email}.`,
    })
  }

  const withTracking = input.items.filter((i) => Boolean(i.tracking_number)).length
  if (input.items.length > 0 && withTracking > 0) {
    events.push({
      at: input.order.updated_at,
      title: 'Tracking progress',
      detail: `${withTracking}/${input.items.length} line items currently have tracking numbers.`,
    })
  }

  return events.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getOrderData(id)
  if (!data) notFound()

  const { order, items, products, producers, auditLogs } = data
  const productById = new Map(products.map((p) => [p.id, p]))
  const producerById = new Map(producers.map((p) => [p.id, p]))
  const timeline = buildTimeline({ order, items, auditLogs })
  const hasWorkflowColumns =
    typeof order.fulfillment_status === 'string' &&
    typeof order.payment_status === 'string' &&
    typeof order.payout_status === 'string'

  const fulfillmentStatus = (hasWorkflowColumns
    ? order.fulfillment_status
    : 'awaiting_producer_ack') as OrderFulfillmentStatus
  const paymentStatus = (hasWorkflowColumns ? order.payment_status : 'paid') as OrderPaymentStatus
  const payoutStatus = (hasWorkflowColumns ? order.payout_status : 'not_due') as OrderPayoutStatus

  const distinctTracking = Array.from(new Set(items.map((i) => i.tracking_number).filter(Boolean)))

  return (
    <div>
      <AdminPageHeader
        title={`Order ${order.id.slice(0, 8)}`}
        description="Order timeline, shipment details, and item-level producer context."
      >
        <div className="mt-4 flex flex-wrap items-center gap-3 font-sans text-xs">
          <Link href="/admin/orders" className="text-secondary hover:underline">
            Back to all orders
          </Link>
          <Link href={`/admin/orders?q=${encodeURIComponent(order.customer_email)}`} className="text-secondary hover:underline">
            More orders from this customer
          </Link>
          <OrderIdCopyButton orderId={order.id} />
        </div>
      </AdminPageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <section className="rounded-xl border border-outline-variant/20 p-6 bg-surface-container-lowest">
          <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-3">Order summary</h2>
          <div className="grid sm:grid-cols-2 gap-3 font-sans text-sm">
            <p>
              <span className="text-on-surface-variant">Customer:</span> {order.customer_name}
            </p>
            <p>
              <span className="text-on-surface-variant">Email:</span> {order.customer_email}
            </p>
            <p>
              <span className="text-on-surface-variant">Created:</span> {fmtDateTime(order.created_at)}
            </p>
            <p>
              <span className="text-on-surface-variant">Last update:</span> {fmtDateTime(order.updated_at)}
            </p>
            <p>
              <span className="text-on-surface-variant">Total:</span>{' '}
              <span className="text-primary font-medium">&euro;{(order.total / 100).toFixed(2)}</span>
            </p>
            <p>
              <span className="text-on-surface-variant">Status:</span>{' '}
              <span
                className={`inline-block ml-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${statusBadgeClass(order.status)}`}
              >
                {order.status}
              </span>
            </p>
          </div>
          {hasWorkflowColumns ? (
            <div className="mt-4 pt-4 border-t border-outline-variant/15">
              <form action={updateOrderWorkflow}>
              <input type="hidden" name="order_id" value={order.id} />
              <div className="grid sm:grid-cols-3 gap-3">
                <label className="block">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant">Fulfillment</span>
                  <select
                    name="fulfillment_status"
                    defaultValue={fulfillmentStatus}
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
                  >
                    {ORDER_FULFILLMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant">Payment</span>
                  <select
                    name="payment_status"
                    defaultValue={paymentStatus}
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
                  >
                    {ORDER_PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant">Payout</span>
                  <select
                    name="payout_status"
                    defaultValue={payoutStatus}
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
                  >
                    {ORDER_PAYOUT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className="mt-3 font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Save workflow
              </button>
              </form>
              <form action={refundOrder} className="mt-3">
                <input type="hidden" name="order_id" value={order.id} />
                <button
                  type="submit"
                  className="font-sans text-xs uppercase tracking-wider border border-error/35 text-error px-3 py-1.5 rounded-full hover:bg-error/8 transition-colors"
                >
                  Refund full order
                </button>
              </form>
            </div>
          ) : (
            <p className="mt-4 pt-4 border-t border-outline-variant/15 font-sans text-xs text-on-surface-variant">
              Workflow fields are not available yet. Run migration <code>20260426150000_order_workflow_states.sql</code>.
            </p>
          )}
          </section>

          <section className="rounded-xl border border-outline-variant/20 overflow-x-auto">
            <table className="w-full text-left min-w-[820px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Product</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Producer</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">Qty</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">Unit price</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">Line total</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Item status</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {items.map((item) => {
                  const product = productById.get(item.product_id)
                  const producer = producerById.get(item.producer_id)
                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-4 py-3">
                        {product ? (
                          <Link href={`/admin/products/${product.id}`} className="font-sans text-sm text-secondary hover:underline">
                            {product.name}
                          </Link>
                        ) : (
                          <span className="font-sans text-sm text-on-surface-variant">Unknown product</span>
                        )}
                        {product?.slug && <p className="font-sans text-xs text-on-surface-variant">{product.slug}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {producer ? (
                          <Link href={`/admin/producers/${producer.id}`} className="font-sans text-sm text-secondary hover:underline">
                            {producer.name}
                          </Link>
                        ) : (
                          <span className="font-sans text-sm text-on-surface-variant">Unknown producer</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">&euro;{(item.price / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-sans text-sm tabular-nums">
                        &euro;{((item.price * item.quantity) / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-on-surface-variant">
                        {item.status ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-on-surface-variant">
                        {item.tracking_number ? item.tracking_number : 'Not entered yet'}
                        {item.carrier && (
                          <p className="text-[11px] text-on-surface-variant/80 mt-0.5">Carrier: {item.carrier}</p>
                        )}
                        {item.eta_at && (
                          <p className="text-[11px] text-on-surface-variant/80">ETA: {fmtDate(item.eta_at)}</p>
                        )}
                        <form action={refundOrderItem} className="mt-2">
                          <input type="hidden" name="order_id" value={order.id} />
                          <input type="hidden" name="item_id" value={item.id} />
                          <button
                            type="submit"
                            className="font-sans text-[11px] uppercase tracking-wider border border-error/30 text-error px-2.5 py-1 rounded-full hover:bg-error/8 transition-colors"
                          >
                            Refund line
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="xl:col-span-4 xl:sticky xl:top-24 space-y-4">
          <section className="rounded-xl border border-outline-variant/20 p-5 bg-surface-container-lowest">
            <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-3">Shipment</h2>
            <p className="font-sans text-sm text-on-surface mb-1">
              Line items: <strong>{items.length}</strong>
            </p>
            <p className="font-sans text-sm text-on-surface mb-1">
              With tracking: <strong>{items.filter((i) => i.tracking_number).length}</strong>
            </p>
            <p className="font-sans text-sm text-on-surface">
              Distinct tracking numbers: <strong>{distinctTracking.length}</strong>
            </p>
            <p className="font-sans text-xs text-on-surface-variant mt-3">
              Tracking is entered per producer line item and emailed to the buyer automatically.
            </p>
          </section>

          {order.shipping_address && (
            <section className="rounded-xl border border-outline-variant/20 p-5 bg-surface-container-lowest">
              <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-3">Shipping address</h2>
              <div className="font-sans text-sm text-on-surface space-y-1">
                {Object.entries(order.shipping_address).map(([k, v]) => (
                  <p key={k}>
                    <span className="text-on-surface-variant">{k}:</span> {String(v)}
                  </p>
                ))}
              </div>
            </section>
          )}

          {order.is_gift && (
            <section className="rounded-xl border border-secondary/25 bg-secondary/5 p-5">
          <h2 className="font-sans text-sm uppercase tracking-wider text-secondary mb-3">🎁 Gift order</h2>
          <div className="grid sm:grid-cols-2 gap-3 font-sans text-sm">
            {order.gift_recipient && (
              <p>
                <span className="text-on-surface-variant">Recipient:</span>{' '}
                <span className="text-on-surface font-medium">{order.gift_recipient}</span>
              </p>
            )}
            {order.gift_wrap && (
              <p>
                <span className="text-on-surface-variant">Gift wrap:</span>{' '}
                <span className="text-on-surface font-medium">Yes (+€3.50)</span>
              </p>
            )}
            {order.gift_message && (
              <div className="sm:col-span-2">
                <p className="text-on-surface-variant mb-1">Message to recipient:</p>
                <p className="bg-surface-container rounded-lg px-4 py-3 text-on-surface italic leading-relaxed">
                  &ldquo;{order.gift_message}&rdquo;
                </p>
              </div>
            )}
          </div>
            </section>
          )}

          <section className="rounded-xl border border-outline-variant/20 p-5 bg-surface-container-lowest">
            <h2 className="font-sans text-sm uppercase tracking-wider text-on-surface-variant mb-4">Timeline</h2>
            <ol className="space-y-3 max-h-[26rem] overflow-auto pr-1">
              {timeline.map((e, idx) => (
                <li key={`${e.at}-${idx}`} className="border-l-2 border-outline-variant/30 pl-3 py-1">
                  <p className="font-sans text-sm text-on-surface">{e.title}</p>
                  <p className="font-sans text-xs text-on-surface-variant">{e.detail}</p>
                  <p className="font-sans text-[11px] text-on-surface-variant/80 mt-0.5">{fmtDate(e.at)}</p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  )
}
