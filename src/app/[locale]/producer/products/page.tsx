import { Link } from '@/i18n/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { Plus } from 'lucide-react'
import { ProductSparkline } from '@/components/producer/ProductSparkline'

type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  image_src: string
  created_at: string
}

type SalesItem = {
  product_id: string
  quantity: number
  orders: { created_at: string } | null
}

async function getProducerProducts() {
  const session = await getProducerForSession()
  if (!session?.producer) return { products: [], sparklines: {} as Record<string, number[]> }

  const admin = createAdminClient()

  const [productsRes, salesRes] = await Promise.all([
    admin
      .from('products')
      .select('id, name, slug, price, category, status, image_src, created_at')
      .eq('producer_id', session.producer.id)
      .order('created_at', { ascending: false }),
    admin
      .from('order_items')
      .select('product_id, quantity, orders(created_at)')
      .eq('producer_id', session.producer.id),
  ])

  const products = (productsRes.data ?? []) as ProductRow[]

  // ── Build 14-day sparklines ───────────────────────────────────────────────
  const salesItems = (salesRes.data ?? []) as SalesItem[]
  const DAY_MS = 24 * 60 * 60 * 1000
  const now = Date.now()

  const sparklines: Record<string, number[]> = {}
  for (const item of salesItems) {
    const createdAt = item.orders?.created_at
    if (!createdAt) continue
    const daysAgo = Math.floor((now - new Date(createdAt).getTime()) / DAY_MS)
    if (daysAgo < 0 || daysAgo >= 14) continue
    const dayIdx = 13 - daysAgo   // 0 = 13 days ago, 13 = today
    if (!sparklines[item.product_id]) sparklines[item.product_id] = Array(14).fill(0)
    sparklines[item.product_id][dayIdx] += item.quantity
  }

  return { products, sparklines }
}

export default async function ProducerProductsPage() {
  const { products, sparklines } = await getProducerProducts()
  const t = await getTranslations('producerPortal.products')

  const statusLabel: Record<ProductRow['status'], string> = {
    approved: t('statusApproved'),
    pending: t('statusPending'),
    rejected: t('statusRejected'),
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
          <p className="text-on-surface-variant font-sans text-sm max-w-xl">
            {t('subtitle')}
          </p>
        </div>
        <Link
          href="/producer/products/new"
          className="shrink-0 inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-sans text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          {t('addProduct')}
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant mb-4">
            {t('emptyMessage')}
          </p>
          <Link
            href="/producer/products/new"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4"
          >
            {t('emptyLink')}
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  {t('colProduct')}
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">
                  {t('colCategory')}
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                  {t('colPrice')}
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">
                  14d
                </th>
                <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                  {t('colStatus')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-4 py-3.5">
                    <p className="font-sans text-sm text-on-surface">{p.name}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="font-sans text-xs text-on-surface-variant capitalize">{p.category}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-sans text-sm text-on-surface tabular-nums">
                      &euro;{(p.price / 100).toFixed(2)}
                    </p>
                  </td>
                  {/* Sparkline */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <ProductSparkline data={sparklines[p.id] ?? Array(14).fill(0)} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span
                      className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        p.status === 'approved'
                          ? 'bg-primary-fixed/40 text-primary'
                          : p.status === 'pending'
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : 'bg-error-container/50 text-error'
                      }`}
                    >
                      {statusLabel[p.status]}
                    </span>
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
