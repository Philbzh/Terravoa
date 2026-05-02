import { Link } from '@/i18n/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { CheckCircle2, Circle, ArrowRight, AlertTriangle } from 'lucide-react'
import { AnimatedKpiCard } from '@/components/ui/AnimatedKpiCard'
import { LiveOrderFeed } from '@/components/producer/LiveOrderFeed'
import { OnboardingTour } from '@/components/producer/OnboardingTour'

async function getProducerData() {
  const session = await getProducerForSession()
  if (!session) return { kind: 'signed_out' as const }
  if (!session.producer) return { kind: 'no_producer' as const, email: session.email }

  const admin = createAdminClient()

  const [itemsRes, productCountRes, unfulfilledRes] = await Promise.all([
    admin
      .from('order_items')
      .select('price, quantity, order_id, tracking_number, orders(status)')
      .eq('producer_id', session.producer.id),
    admin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('producer_id', session.producer.id),
    admin
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('producer_id', session.producer.id)
      .is('tracking_number', null),
  ])

  type OrderItem = { price: number; quantity: number; order_id: string; tracking_number: string | null; orders: { status: string } | null }
  const orderItems = (itemsRes.data ?? []) as OrderItem[]

  const revenue        = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const uniqueOrders   = new Set(orderItems.map((i) => i.order_id)).size

  // Earned revenue = shipped + delivered orders
  const earnedRevenue = orderItems
    .filter((i) => i.orders?.status === 'delivered' || i.orders?.status === 'shipped')
    .reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Unfulfilled = items with no tracking number
  const unfulfilledCount = unfulfilledRes.count ?? 0

  return {
    kind: 'ok' as const,
    name: session.producer.name,
    status: session.producer.status,
    orderCount: uniqueOrders,
    revenue,
    earnedRevenue,
    unfulfilledCount,
    productCount: productCountRes.count ?? 0,
  }
}

function fmt(cents: number) {
  return `€${(cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default async function ProducerDashboardPage() {
  const data = await getProducerData()
  const t = await getTranslations('producerPortal.dashboard')

  const metrics =
    data.kind === 'ok'
      ? [
          { label: t('metricOrders'),        value: String(data.orderCount),    iconName: 'ShoppingBag' as const },
          { label: t('metricRevenue'),        value: fmt(data.revenue),          iconName: 'Euro'        as const },
          {
            label: t('metricPendingPayouts'),
            value: fmt(data.earnedRevenue),
            iconName: 'Clock' as const,
            sub: data.earnedRevenue > 0 ? 'From shipped & delivered orders' : 'No fulfilled orders yet',
          },
        ]
      : [
          { label: t('metricOrders'),        value: '0',     iconName: 'ShoppingBag' as const },
          { label: t('metricRevenue'),        value: '€0.00', iconName: 'Euro'        as const },
          { label: t('metricPendingPayouts'), value: '€0.00', iconName: 'Clock'       as const },
        ]

  return (
    <div>
      {/* Onboarding tour — client, checks localStorage, no-op if already seen */}
      <OnboardingTour />

      <h1 className="font-serif text-3xl text-primary mb-2">
        {t('welcome')}{data.kind === 'ok' ? `, ${data.name}` : ''}
      </h1>
      {data.kind === 'signed_out' && (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low/80 p-5 mb-8 max-w-xl">
          <p className="font-sans text-sm text-on-surface mb-3">
            {t('signedOutMessage')}
          </p>
          <Link
            href="/login/producer"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4"
          >
            {t('signedOutLink')}
          </Link>
        </div>
      )}
      {data.kind === 'no_producer' && (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-5 mb-8 max-w-xl">
          <p className="font-sans text-sm text-on-surface mb-2">
            {t('noProducerMessage')}
            {data.email ? ` (${data.email})` : ''}.
          </p>
          <p className="font-sans text-xs text-on-surface-variant">
            {t('noProducerHelp')}
          </p>
        </div>
      )}
      <p className="text-on-surface-variant font-sans text-sm leading-relaxed max-w-xl mb-10">
        {t('intro')}
      </p>

      {/* Fulfillment alert */}
      {data.kind === 'ok' && data.unfulfilledCount > 0 && (
        <div className="flex items-start gap-3 bg-secondary/10 border border-secondary/25 rounded-xl px-5 py-4 mb-8 max-w-2xl">
          <AlertTriangle className="text-secondary shrink-0 mt-0.5" size={18} strokeWidth={1.5} />
          <div>
            <p className="font-sans text-sm font-medium text-on-surface">
              {data.unfulfilledCount} item{data.unfulfilledCount !== 1 ? 's' : ''} awaiting shipment
            </p>
            <Link
              href="/producer/orders"
              className="font-sans text-xs text-secondary uppercase tracking-wider hover:underline"
            >
              Go to orders <ArrowRight size={10} className="inline" />
            </Link>
          </div>
        </div>
      )}

      {data.kind === 'ok' && (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 mb-12 max-w-2xl">
          <p className="font-serif text-lg text-primary mb-1">{t('setupTitle')}</p>
          <p className="font-sans text-xs text-on-surface-variant mb-6 max-w-md">
            {t('setupSubtitle')}
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3">
              {data.productCount > 0 ? (
                <CheckCircle2 className="shrink-0 text-secondary mt-0.5" size={18} strokeWidth={1.5} />
              ) : (
                <Circle className="shrink-0 text-on-surface-variant/40 mt-0.5" size={18} strokeWidth={1.5} />
              )}
              <div>
                <p className="font-sans text-sm text-on-surface font-medium">{t('listProductsTitle')}</p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  {data.productCount > 0
                    ? t('listProductsCount', { count: data.productCount })
                    : t('listProductsEmpty')}
                </p>
                {data.productCount === 0 && (
                  <Link
                    href="/producer/products/new"
                    className="inline-flex items-center gap-1 mt-2 text-secondary font-sans text-xs uppercase tracking-wider"
                  >
                    {t('addProductLink')} <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </li>
            <li className="flex gap-3">
              {data.orderCount > 0 ? (
                <CheckCircle2 className="shrink-0 text-secondary mt-0.5" size={18} strokeWidth={1.5} />
              ) : (
                <Circle className="shrink-0 text-on-surface-variant/40 mt-0.5" size={18} strokeWidth={1.5} />
              )}
              <div>
                <p className="font-sans text-sm text-on-surface font-medium">{t('fulfilOrdersTitle')}</p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  {data.orderCount > 0
                    ? t('fulfilOrdersActive')
                    : t('fulfilOrdersEmpty')}
                </p>
                <Link
                  href="/producer/orders"
                  className="inline-flex items-center gap-1 mt-2 text-secondary font-sans text-xs uppercase tracking-wider"
                >
                  {t('ordersLink')} <ArrowRight size={12} />
                </Link>
              </div>
            </li>
            <li className="flex gap-3">
              <CheckCircle2 className="shrink-0 text-secondary mt-0.5" size={18} strokeWidth={1.5} />
              <div>
                <p className="font-sans text-sm text-on-surface font-medium">{t('publicProfileTitle')}</p>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  {t('publicProfileDesc')}
                </p>
                <Link
                  href="/producer/profile"
                  className="inline-flex items-center gap-1 mt-2 text-secondary font-sans text-xs uppercase tracking-wider"
                >
                  {t('viewProfileLink')} <ArrowRight size={12} />
                </Link>
              </div>
            </li>
          </ul>
        </div>
      )}

      {/* Metrics */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {metrics.map((metric, i) => (
          <AnimatedKpiCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            iconName={metric.iconName}
            sub={'sub' in metric ? metric.sub : undefined}
            index={i}
          />
        ))}
      </div>

      {/* Live order feed — polls /api/producer/recent-orders every 30 s */}
      {data.kind === 'ok' && <LiveOrderFeed />}

      {/* Quick links */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8">
        <p className="font-serif text-lg text-primary mb-4">{t('quickLinksTitle')}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/producer/orders"
            className="rounded-lg border border-outline-variant/20 px-4 py-3 font-sans text-sm text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
          >
            {t('quickLinkOrders')}
          </Link>
          <Link
            href="/producer/products"
            className="rounded-lg border border-outline-variant/20 px-4 py-3 font-sans text-sm text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
          >
            {t('quickLinkProducts')}
          </Link>
          <Link
            href="/producer/profile"
            className="rounded-lg border border-outline-variant/20 px-4 py-3 font-sans text-sm text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors"
          >
            {t('quickLinkProfile')}
          </Link>
        </div>
      </div>
    </div>
  )
}
