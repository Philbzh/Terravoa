import { createServerSupabase as createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Package, ArrowLeft, RotateCcw } from 'lucide-react'
import { OrderTimeline } from '@/components/account/OrderTimeline'
import Image from 'next/image'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

type OrderItem = {
  id: string
  quantity: number
  price: number
  tracking_number: string | null
  products: { name: string; image_src: string; origin: string } | null
}

type Order = {
  id: string
  created_at: string
  status: 'new' | 'processing' | 'shipped' | 'delivered'
  total: number
  items: OrderItem[]
}

const statusColor: Record<string, string> = {
  new: 'bg-tertiary-fixed/30 text-tertiary',
  processing: 'bg-secondary-container/50 text-secondary',
  shipped: 'bg-primary-fixed/40 text-primary',
  delivered: 'bg-primary-fixed/30 text-primary',
}

export default async function AccountOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login?next=/account/orders`)

  const t = await getTranslations({ locale, namespace: 'accountOrders' })
  const admin = createAdminClient()

  const { data: rawOrders } = await (admin as any)
    .from('orders')
    .select(`
      id, created_at, status, total,
      order_items (
        id, quantity, price, tracking_number,
        products ( name, image_src, origin )
      )
    `)
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false })

  const orders: Order[] = (rawOrders ?? []).map((o: any) => ({
    id: o.id,
    created_at: o.created_at,
    status: o.status,
    total: o.total,
    items: o.order_items ?? [],
  }))

  const statusLabel: Record<string, string> = {
    new: t('statusNew'),
    processing: t('statusProcessing'),
    shipped: t('statusShipped'),
    delivered: t('statusDelivered'),
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-surface">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          {t('back')}
        </Link>

        <h1 className="font-serif text-3xl text-primary mb-1">{t('title')}</h1>
        <p className="font-sans text-sm text-on-surface-variant mb-10">
          {t('subtitle')}
        </p>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-14 text-center">
            <Package className="mx-auto mb-4 text-on-surface-variant/30" size={36} strokeWidth={1} />
            <p className="font-sans text-sm text-on-surface-variant mb-1">{t('emptyTitle')}</p>
            <p className="font-sans text-xs text-on-surface-variant/60 mb-6">
              {t('emptyDesc')}
            </p>
            <Link
              href="/collection"
              className="font-sans text-xs uppercase tracking-[0.12em] font-semibold bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              {t('exploreCta')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm"
              >
                <header className="bg-surface-container-low/70 border-b border-outline-variant/15 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mb-0.5">
                      {t('orderPrefix')} · <span className="font-mono">{order.id.slice(0, 8)}…</span>
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className={`font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        statusColor[order.status] ?? 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    <span className="font-serif text-base text-primary tabular-nums">
                      €{(order.total / 100).toFixed(2)}
                    </span>
                    <Link
                      href={`/account/returns/new?order=${order.id}`}
                      className="inline-flex items-center gap-1 font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60 hover:text-secondary transition-colors"
                    >
                      <RotateCcw size={11} strokeWidth={1.5} />
                      {t('returnCta')}
                    </Link>
                  </div>
                </header>

                <div className="divide-y divide-outline-variant/10">
                  {order.items.map((item) => (
                    <div key={item.id} className="px-5 py-4 flex items-start gap-4">
                      {item.products?.image_src && (
                        <Image
                          src={item.products.image_src}
                          alt={item.products.name}
                          width={56}
                          height={56}
                          className="w-14 h-14 object-cover rounded-lg border border-outline-variant/15 shrink-0 bg-surface-container-low"
                          unoptimized={isExternalUnoptimizedSrc(item.products.image_src)}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-on-surface font-medium truncate">
                          {item.products?.name ?? 'Product'}
                        </p>
                        {item.products?.origin && (
                          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                            {item.products.origin}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-sans text-xs text-on-surface-variant">
                            {t('qty', { count: item.quantity })}
                          </p>
                          <p className="font-sans text-xs text-on-surface tabular-nums">
                            €{((item.price * item.quantity) / 100).toFixed(2)}
                          </p>
                        </div>
                        {item.tracking_number && (
                          <p className="font-sans text-xs text-secondary mt-1.5">
                            {t('tracking')}:{' '}
                            <span className="font-mono text-on-surface">{item.tracking_number}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 border-t border-outline-variant/10 bg-surface-container-low/30">
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-on-surface-variant pt-4 pb-1">
                    {t('progress')}
                  </p>
                  <OrderTimeline
                    status={order.status}
                    trackingNumber={order.items.find((i) => i.tracking_number)?.tracking_number}
                    className="pb-2"
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
