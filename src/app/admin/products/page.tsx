import { createAdminClient } from '@/lib/supabase/admin'
import { setProductStatus } from './actions'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { FeaturedToggle } from '@/components/admin/FeaturedToggle'
import Link from 'next/link'
import { getProductLimit, isPlanId } from '@/lib/partnership-plans'

type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  producer_id: string
  is_featured: boolean
  featured_rank: number | null
}

type ProducerLookup = {
  id: string
  name: string
  plan: string | null
}

const PAGE_SIZE = 25
const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'] as const
type ProductStatusFilter = (typeof STATUS_OPTIONS)[number]

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getStatus(raw: string | undefined): ProductStatusFilter {
  if (!raw) return 'all'
  return STATUS_OPTIONS.includes(raw as ProductStatusFilter)
    ? (raw as ProductStatusFilter)
    : 'all'
}

function hrefFor(
  q: string,
  status: ProductStatusFilter,
  page: number,
  producerId?: string | null,
) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (status !== 'all') sp.set('status', status)
  if (page > 1) sp.set('page', String(page))
  if (producerId) sp.set('producer_id', producerId)
  const qs = sp.toString()
  return qs ? `/admin/products?${qs}` : '/admin/products'
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function getProducerId(raw: string | undefined): string | null {
  if (!raw) return null
  return UUID_RE.test(raw) ? raw : null
}

function ApproveButton({ id }: { id: string }) {
  return (
    <form action={async () => { 'use server'; await setProductStatus(id, 'approved') }}>
      <button
        type="submit"
        title="Approve"
        className="inline-flex items-center gap-1 text-primary hover:opacity-70 transition-opacity font-sans text-xs uppercase tracking-wide"
      >
        <CheckCircle size={15} strokeWidth={1.5} />
        Approve
      </button>
    </form>
  )
}

function RejectButton({ id }: { id: string }) {
  return (
    <form action={async () => { 'use server'; await setProductStatus(id, 'rejected') }}>
      <button
        type="submit"
        title="Reject"
        className="inline-flex items-center gap-1 text-error hover:opacity-70 transition-opacity font-sans text-xs uppercase tracking-wide"
      >
        <XCircle size={15} strokeWidth={1.5} />
        Reject
      </button>
    </form>
  )
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; producer_id?: string }>
}) {
  const { q = '', status: rawStatus, page: pageRaw, producer_id: rawProducerId } = await searchParams
  const status = getStatus(rawStatus)
  const page = getPage(pageRaw)
  const producerIdFilter = getProducerId(rawProducerId)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const admin = createAdminClient()

  // When scoped to a specific producer, fetch their name + plan so the
  // toolbar can render a clear "You're filtering products by X" banner.
  let focusedProducer: ProducerLookup | null = null
  if (producerIdFilter) {
    const { data } = await (admin as any)
      .from('producers')
      .select('id, name, plan')
      .eq('id', producerIdFilter)
      .maybeSingle()
    focusedProducer = (data ?? null) as ProducerLookup | null
  }

  const applyProducerFilter = <T extends { eq: (col: string, val: string) => T }>(qb: T): T =>
    producerIdFilter ? qb.eq('producer_id', producerIdFilter) : qb

  const base = applyProducerFilter(
    (admin as any)
      .from('products')
      .select('id, name, slug, price, category, status, created_at, producer_id, is_featured, featured_rank')
      .order('status', { ascending: true }) // pending first
      .order('created_at', { ascending: false })
      .range(from, to),
  )
  const countBase = applyProducerFilter(
    (admin as any).from('products').select('id', { count: 'exact', head: true }),
  )
  const search = q.trim()
  const filter = search
    ? `name.ilike.%${search}%,slug.ilike.%${search}%,category.ilike.%${search}%,status.ilike.%${search}%`
    : null

  const listQuery = filter ? base.or(filter) : base
  const countQuery = filter ? countBase.or(filter) : countBase
  const makeStatusCountQuery = (s: Exclude<ProductStatusFilter, 'all'>) => {
    const q = applyProducerFilter(
      (admin as any).from('products').select('id', { count: 'exact', head: true }),
    )
    const filtered = filter ? q.or(filter) : q
    return filtered.eq('status', s)
  }
  const [{ data, error }, countRes, pendingRes, approvedRes, rejectedRes] = await Promise.all([
    status !== 'all' ? listQuery.eq('status', status) : listQuery,
    status !== 'all' ? countQuery.eq('status', status) : countQuery,
    makeStatusCountQuery('pending'),
    makeStatusCountQuery('approved'),
    makeStatusCountQuery('rejected'),
  ])

  const list = (data ?? []) as ProductRow[]

  // Bulk-fetch the producers referenced by this page of results so each row
  // can show the producer's name + plan chip without N+1 queries.
  const producerIds = Array.from(new Set(list.map((p) => p.producer_id))).filter(Boolean)
  const producersById = new Map<string, ProducerLookup>()
  if (producerIds.length > 0) {
    const { data: producerRows } = await (admin as any)
      .from('producers')
      .select('id, name, plan')
      .in('id', producerIds)
    ;(producerRows ?? []).forEach((p: ProducerLookup) => {
      producersById.set(p.id, p)
    })
  }

  const totalCount = countRes.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null
  const pending = pendingRes.count ?? 0
  const approved = approvedRes.count ?? 0
  const rejected = rejectedRes.count ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Product approval"
        description="Quality gate before products appear in the collection. Approve to publish, reject to send back to the producer."
        metrics={[
          { label: 'pending', value: pending },
          { label: 'approved', value: approved },
          { label: 'rejected', value: rejected },
          { label: 'featured', value: list.filter((p) => p.is_featured).length },
        ]}
      />

      {/* When we arrived here via a producer deep-link, show a clear banner
          with producer identity + a one-click "clear filter" affordance. */}
      {focusedProducer && (
        <div className="mb-6 rounded-xl border border-primary/25 bg-primary-fixed/15 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">
              Filtered to
            </span>
            <Link
              href={`/admin/producers/${focusedProducer.id}`}
              className="font-serif text-base text-primary hover:underline"
            >
              {focusedProducer.name}
            </Link>
            {(() => {
              const plan = isPlanId(focusedProducer.plan) ? focusedProducer.plan : 'founding'
              const cap = getProductLimit(plan)
              return (
                <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 capitalize">
                  {plan} · {cap === null ? 'unlimited' : `up to ${cap}`}
                </span>
              )
            })()}
          </div>
          <Link
            href={hrefFor(q, status, 1, null)}
            className="inline-flex items-center gap-1 font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
          >
            <X size={12} /> Clear filter
          </Link>
        </div>
      )}

      <form method="get" className="admin-toolbar">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by product, slug, category, status…"
          className="w-full sm:max-w-md rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
        />
        <button
          type="submit"
          className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors"
        >
          Search
        </button>
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
        {producerIdFilter && <input type="hidden" name="producer_id" value={producerIdFilter} />}
      </form>
      <div className="admin-filter-row">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={hrefFor(q, s, 1, producerIdFilter)}
            className={`admin-filter-chip ${
              status === s
                ? 'border-secondary/40 text-secondary bg-secondary/10'
                : 'border-outline-variant/30 text-on-surface-variant hover:text-primary'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-error font-sans text-sm mb-4">{error.message}</p>
      )}

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No products submitted yet. Once producers list items, they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="admin-table-wrap overflow-x-auto">
            <table className="w-full text-left min-w-[960px]">
              <thead>
                <tr className="bg-surface-container-low/70">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Product</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden lg:table-cell">Producer</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">Price</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">Submitted</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Status</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">Featured</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {list.map((p) => (
                  <tr
                    key={p.id}
                    className={`transition-colors even:bg-surface-container-low/15 ${
                      p.status === 'pending' ? 'bg-tertiary-fixed/10 hover:bg-tertiary-fixed/15' : 'hover:bg-surface-container-low/30'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm text-on-surface font-medium">{p.name}</p>
                      <p className="font-sans text-[11px] text-on-surface-variant/60">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {(() => {
                        const prod = producersById.get(p.producer_id)
                        if (!prod) {
                          return <span className="font-sans text-[11px] text-on-surface-variant/60">—</span>
                        }
                        const plan = isPlanId(prod.plan) ? prod.plan : 'founding'
                        return (
                          <div className="flex flex-col gap-1">
                            <Link
                              href={`/admin/producers/${prod.id}`}
                              className="font-sans text-xs text-secondary hover:underline truncate max-w-[180px]"
                              title={prod.name}
                            >
                              {prod.name}
                            </Link>
                            <span
                              className={`inline-block w-fit font-sans text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full capitalize ${
                                plan === 'premium'
                                  ? 'bg-secondary/15 text-secondary border border-secondary/20'
                                  : plan === 'growth'
                                    ? 'bg-primary/8 text-primary border border-primary/15'
                                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/20'
                              }`}
                            >
                              {plan}
                            </span>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant capitalize">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant tabular-nums">
                        €{(p.price / 100).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant">
                        {new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        p.status === 'pending'
                          ? 'bg-tertiary-fixed/30 text-tertiary'
                          : p.status === 'approved'
                            ? 'bg-primary-fixed/40 text-primary'
                            : 'bg-error-container/50 text-error'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {p.status === 'approved' ? (
                        <FeaturedToggle
                          productId={p.id}
                          isFeatured={p.is_featured}
                          rank={p.featured_rank}
                        />
                      ) : (
                        <span className="font-sans text-[11px] text-on-surface-variant/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="font-sans text-[11px] uppercase tracking-wide text-secondary hover:text-primary transition-colors border border-secondary/25 rounded-full px-2.5 py-1"
                        >
                          Open editor
                        </Link>
                        {p.status !== 'approved' && <ApproveButton id={p.id} />}
                        {p.status !== 'rejected' && <RejectButton id={p.id} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                href={hrefFor(q, status, prevPage, producerIdFilter)}
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
                href={hrefFor(q, status, nextPage, producerIdFilter)}
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
