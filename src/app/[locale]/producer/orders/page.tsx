import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { OrderItemFulfillmentForm } from './OrderItemFulfillmentForm'
import { Package } from 'lucide-react'
import { Link } from '@/i18n/navigation'

function formatShippingAddress(addr: Record<string, string> | null | undefined) {
  if (!addr || typeof addr !== 'object') return null
  const pick = (...keys: string[]) =>
    keys.map((k) => addr[k]).filter((v) => v && String(v).trim()) as string[]
  const fromKeys = pick(
    'line1',
    'line2',
    'address_line1',
    'address_line2',
    'city',
    'state',
    'postal_code',
    'postcode',
    'country',
  )
  if (fromKeys.length) return fromKeys.join(', ')
  const vals = Object.values(addr).filter((v) => v && String(v).trim())
  return vals.length ? vals.join(', ') : null
}

type OrderItemWithOrder = {
  id: string
  quantity: number
  price: number
  tracking_number: string | null
  status: string | null
  payout_status: string | null
  order_id: string
  product_id: string
  orders: {
    id: string
    customer_name: string
    // HIGH-5: customer_email deliberately omitted — GDPR Art. 5(1)(c) data
    // minimisation. Producers never need the raw customer email; platform
    // communication is routed through Terravoa.
    shipping_address: Record<string, string>
    status: string
    created_at: string
  }
  products: {
    name: string
  }
}

function groupByOrderId(items: OrderItemWithOrder[]): OrderItemWithOrder[][] {
  const orderIds = [...new Set(items.map((i) => i.order_id))]
  return orderIds.map((id) => items.filter((i) => i.order_id === id))
}

async function getProducerOrders() {
  const session = await getProducerForSession()
  if (!session?.producer) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('order_items')
    .select(
      // customer_email intentionally excluded — see HIGH-5 in type above.
      'id, quantity, price, tracking_number, status, payout_status, order_id, product_id, orders(id, customer_name, shipping_address, status, created_at), products(name)',
    )
    .eq('producer_id', session.producer.id)
    .order('order_id', { ascending: false })

  return (data ?? []) as OrderItemWithOrder[]
}

const statusColor: Record<string, string> = {
  new: 'bg-tertiary-fixed/30 text-tertiary',
  processing: 'bg-secondary-container/50 text-secondary',
  shipped: 'bg-primary-fixed/40 text-primary',
  delivered: 'bg-primary-fixed/40 text-primary',
}

export default async function ProducerOrdersPage() {
  const items = await getProducerOrders()
  const groups = groupByOrderId(items)
  const t = await getTranslations('producerPortal.orders')

  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl text-primary mb-2 tracking-tight">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm max-w-xl mb-8 leading-relaxed">
        {t('subtitle')}
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 md:p-16 text-center max-w-lg mx-auto">
          <Package
            className="mx-auto mb-4 text-on-surface-variant/35"
            size={36}
            strokeWidth={1}
          />
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            {t('emptyMessage')}
          </p>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-10">
          {groups.map((group) => {
            const order = group[0]?.orders
            const ship = formatShippingAddress(order?.shipping_address)
            const dateStr = order?.created_at
              ? new Date(order.created_at).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'

            return (
              <article
                key={group[0].order_id}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm"
              >
                <header className="bg-surface-container-low/70 border-b border-outline-variant/15 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-1">
                        <Link
                          href={`/producer/orders/${group[0].order_id}`}
                          className="hover:text-secondary underline-offset-2 hover:underline"
                        >
                          {t('orderLabel')} · {group[0].order_id.slice(0, 8)}…
                        </Link>
                      </p>
                      <p className="font-sans text-sm text-on-surface font-medium">
                        {order?.customer_name ?? t('customer')}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant mt-1">{dateStr}</p>
                    </div>
                    <span
                      className={`self-start font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        statusColor[order?.status ?? ''] ??
                        'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {order?.status ?? '—'}
                    </span>
                  </div>
                  {ship && (
                    <p className="font-sans text-xs text-on-surface leading-relaxed mt-3 pt-3 border-t border-outline-variant/10">
                      <span className="text-on-surface-variant">{t('shipTo')} · </span>
                      {ship}
                    </p>
                  )}
                </header>

                <div className="divide-y divide-outline-variant/10">
                  {group.map((item) => (
                    <div key={item.id} className="px-4 py-5 sm:px-6 sm:py-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
                        <div>
                          <p className="font-sans text-sm text-on-surface font-medium">
                            {item.products?.name ?? 'Product'}
                          </p>
                          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                            {t('qty')} {item.quantity}
                          </p>
                        </div>
                        <span className="font-serif text-base text-primary tabular-nums sm:text-right">
                          €{((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                      {item.tracking_number && (
                        <p className="font-sans text-xs text-on-surface-variant mb-3">
                          {t('tracking')}{' '}
                          <span className="font-mono text-on-surface">{item.tracking_number}</span>
                        </p>
                      )}
                      <p className="font-sans text-[11px] text-on-surface-variant mb-3">
                        Item status: <span className="text-on-surface">{item.status ?? 'pending'}</span>
                      </p>
                      <OrderItemFulfillmentForm
                        orderItemId={item.id}
                        initialTracking={item.tracking_number}
                        status={item.status ?? 'pending'}
                        payoutStatus={item.payout_status}
                      />
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
