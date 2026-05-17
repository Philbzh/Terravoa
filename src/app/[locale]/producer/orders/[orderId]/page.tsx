import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { OrderItemFulfillmentForm } from '../OrderItemFulfillmentForm'
import { producerNetCents, type ProducerPayoutRow } from '@/lib/producer/payouts'

type OrderItemRow = {
  id: string
  quantity: number
  price: number
  tracking_number: string | null
  status: string | null
  payout_status: string | null
  commission_cents: number
  commission_rate_pct: number | null
  product_id: string
  products: { name: string }
  orders: {
    id: string
    customer_name: string
    shipping_address: Record<string, string>
    status: string
    created_at: string
  }
}

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

async function getProducerOrderItems(orderId: string, producerId: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('order_items')
    .select(
      'id, quantity, price, tracking_number, status, payout_status, commission_cents, commission_rate_pct, product_id, products(name), orders(id, customer_name, shipping_address, status, created_at)',
    )
    .eq('order_id', orderId)
    .eq('producer_id', producerId)

  return (data ?? []) as OrderItemRow[]
}

const statusColor: Record<string, string> = {
  new: 'bg-tertiary-fixed/30 text-tertiary',
  processing: 'bg-secondary-container/50 text-secondary',
  shipped: 'bg-primary-fixed/40 text-primary',
  delivered: 'bg-primary-fixed/40 text-primary',
}

export default async function ProducerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  const session = await getProducerForSession()
  const t = await getTranslations('producerPortal.orders')

  if (!session?.producer) {
    return (
      <div>
        <h1 className="font-serif text-3xl text-primary mb-4">{t('detailTitle')}</h1>
        <p className="font-sans text-sm text-on-surface-variant">{t('detailSignIn')}</p>
        <Link
          href="/login/producer"
          className="inline-block mt-4 text-secondary font-sans text-sm uppercase tracking-wider underline"
        >
          {t('detailSignInLink')}
        </Link>
      </div>
    )
  }

  const items = await getProducerOrderItems(orderId, session.producer.id)
  if (items.length === 0) notFound()

  const order = items[0].orders
  const ship = formatShippingAddress(order?.shipping_address)
  const dateStr = order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const payoutRows: ProducerPayoutRow[] = items.map((item) => ({
    id: item.id,
    order_id: orderId,
    quantity: item.quantity,
    price: item.price,
    commission_cents: item.commission_cents,
    commission_rate_pct: item.commission_rate_pct,
    payout_status: item.payout_status,
    created_at: order.created_at,
    products: item.products,
    orders: { created_at: order.created_at },
  }))
  const orderNet = payoutRows.reduce((sum, row) => sum + producerNetCents(row), 0)

  return (
    <div>
      <Link
        href="/producer/orders"
        className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider text-secondary mb-6 hover:underline"
      >
        <ArrowLeft size={14} />
        {t('detailBack')}
      </Link>

      <h1 className="font-serif text-3xl text-primary mb-1">{t('detailTitle')}</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8 font-mono">
        {orderId.slice(0, 8)}… · {dateStr}
      </p>

      <article className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm max-w-3xl">
        <header className="bg-surface-container-low/70 border-b border-outline-variant/15 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-sans text-sm text-on-surface font-medium">
                {order.customer_name}
              </p>
              {ship && (
                <p className="font-sans text-xs text-on-surface leading-relaxed mt-2">
                  <span className="text-on-surface-variant">{t('shipTo')} · </span>
                  {ship}
                </p>
              )}
            </div>
            <span
              className={`self-start font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full ${
                statusColor[order.status ?? ''] ??
                'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/10">
            {t('detailNetEarnings')}{' '}
            <span className="font-serif text-base text-primary tabular-nums">
              €{(orderNet / 100).toFixed(2)}
            </span>
          </p>
        </header>

        <div className="divide-y divide-outline-variant/10">
          {items.map((item) => (
            <div key={item.id} className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-1">
                <div>
                  <p className="font-sans text-sm text-on-surface font-medium">
                    {item.products?.name ?? 'Product'}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    {t('qty')} {item.quantity}
                  </p>
                </div>
                <span className="font-serif text-base text-primary tabular-nums">
                  €{((item.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
              {item.tracking_number && (
                <p className="font-sans text-xs text-on-surface-variant mb-3">
                  {t('tracking')}{' '}
                  <span className="font-mono text-on-surface">{item.tracking_number}</span>
                </p>
              )}
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
    </div>
  )
}
