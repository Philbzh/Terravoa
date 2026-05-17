import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { BarChart3, TrendingUp, Eye, ShoppingBag } from 'lucide-react'

async function getAnalytics(producerId: string) {
  const admin = createAdminClient() as any

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

  const [recentItems, priorItems, productViews, topProducts] = await Promise.all([
    // Orders last 30 days
    admin
      .from('order_items')
      .select('price, quantity, created_at')
      .eq('producer_id', producerId)
      .gte('created_at', thirtyDaysAgo),
    // Orders 30-60 days ago (for comparison)
    admin
      .from('order_items')
      .select('price, quantity')
      .eq('producer_id', producerId)
      .gte('created_at', sixtyDaysAgo)
      .lt('created_at', thirtyDaysAgo),
    // Product view count (if table exists, otherwise graceful fallback)
    admin
      .from('product_views')
      .select('id', { count: 'exact', head: true })
      .eq('producer_id', producerId)
      .gte('created_at', thirtyDaysAgo)
      .then((r: any) => r.count ?? 0)
      .catch(() => 0),
    // Top selling products
    admin
      .from('order_items')
      .select('quantity, products(name, slug)')
      .eq('producer_id', producerId)
      .gte('created_at', thirtyDaysAgo)
      .order('quantity', { ascending: false })
      .limit(5),
  ])

  type Item = { price: number; quantity: number; created_at?: string }
  const recent = (recentItems.data ?? []) as Item[]
  const prior = (priorItems.data ?? []) as Item[]

  const recentRevenue = recent.reduce((s, i) => s + i.price * i.quantity, 0)
  const priorRevenue = prior.reduce((s, i) => s + i.price * i.quantity, 0)
  const revenueGrowth = priorRevenue > 0
    ? Math.round(((recentRevenue - priorRevenue) / priorRevenue) * 100)
    : null

  const recentOrders = recent.length
  const priorOrders = prior.length
  const ordersGrowth = priorOrders > 0
    ? Math.round(((recentOrders - priorOrders) / priorOrders) * 100)
    : null

  type TopProduct = { quantity: number; products: { name: string; slug: string } | null }
  // Aggregate top products by slug
  const productMap = new Map<string, { name: string; qty: number }>()
  for (const item of (topProducts.data ?? []) as TopProduct[]) {
    if (!item.products) continue
    const key = item.products.slug
    const existing = productMap.get(key)
    if (existing) {
      existing.qty += item.quantity
    } else {
      productMap.set(key, { name: item.products.name, qty: item.quantity })
    }
  }
  const topSelling = [...productMap.values()]
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  return {
    recentRevenue,
    revenueGrowth,
    recentOrders,
    ordersGrowth,
    productViews: productViews as number,
    topSelling,
  }
}

export default async function ProducerAnalyticsPage() {
  const session = await getProducerForSession()
  if (!session?.producer) redirect('/login/producer')

  const [t, tSidebar] = await Promise.all([
    getTranslations('producerPortal.analytics'),
    getTranslations('producerPortal.sidebar'),
  ])
  const data = await getAnalytics(session.producer.id)

  function growthBadge(growth: number | null) {
    if (growth === null) return null
    const positive = growth >= 0
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-600'}`}>
        <TrendingUp size={12} className={positive ? '' : 'rotate-180'} />
        {positive ? '+' : ''}{growth}%
      </span>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-primary mb-2">{tSidebar('analytics')}</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8">{t('subtitle')}</p>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-secondary" />
            <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">{t('revenue')}</span>
          </div>
          <p className="font-serif text-2xl text-primary">€{(data.recentRevenue / 100).toFixed(0)}</p>
          {growthBadge(data.revenueGrowth)}
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={16} className="text-secondary" />
            <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">{t('orders')}</span>
          </div>
          <p className="font-serif text-2xl text-primary">{data.recentOrders}</p>
          {growthBadge(data.ordersGrowth)}
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-secondary" />
            <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">{t('productViews')}</span>
          </div>
          <p className="font-serif text-2xl text-primary">{data.productViews}</p>
        </div>
      </div>

      {/* Top selling products */}
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-secondary" />
          <h2 className="font-sans text-sm font-medium text-on-surface">{t('topSelling')}</h2>
        </div>
        {data.topSelling.length === 0 ? (
          <p className="font-sans text-sm text-on-surface-variant">{t('noSales')}</p>
        ) : (
          <div className="space-y-3">
            {data.topSelling.map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-sans text-sm text-on-surface">{product.name}</span>
                <span className="font-mono text-xs text-on-surface-variant">{t('sold', { count: product.qty })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
