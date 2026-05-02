import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StarRating } from '@/components/ui/StarRating'
import { approveReview, deleteReview } from './actions'
import Link from 'next/link'

interface ReviewRow {
  id: string
  product_slug: string
  reviewer_name: string
  rating: number
  body: string
  approved: boolean
  created_at: string
}

const PAGE_SIZE = 25
const STATUS_OPTIONS = ['all', 'pending', 'published'] as const
type ReviewStatusFilter = (typeof STATUS_OPTIONS)[number]

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getStatus(raw: string | undefined): ReviewStatusFilter {
  if (!raw) return 'all'
  return STATUS_OPTIONS.includes(raw as ReviewStatusFilter) ? (raw as ReviewStatusFilter) : 'all'
}

function hrefFor(q: string, status: ReviewStatusFilter, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (status !== 'all') sp.set('status', status)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/reviews?${qs}` : '/admin/reviews'
}

async function getReviews(
  q: string,
  status: ReviewStatusFilter,
  page: number,
): Promise<{ rows: ReviewRow[]; total: number }> {
  const admin = createAdminClient() as any
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const base = admin
    .from('product_reviews')
    .select('id, product_slug, reviewer_name, rating, body, approved, created_at')
    .order('approved', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to)
  const countBase = admin.from('product_reviews').select('id', { count: 'exact', head: true })

  const search = q.trim()
  const filter = search
    ? `reviewer_name.ilike.%${search}%,product_slug.ilike.%${search}%,body.ilike.%${search}%,id.ilike.%${search}%`
    : null

  const listQuery = filter ? base.or(filter) : base
  const countQuery = filter ? countBase.or(filter) : countBase
  const approvedFilter =
    status === 'all' ? null : status === 'published'
  const [{ data }, countRes] = await Promise.all([
    approvedFilter == null ? listQuery : listQuery.eq('approved', approvedFilter),
    approvedFilter == null ? countQuery : countQuery.eq('approved', approvedFilter),
  ])
  return { rows: (data ?? []) as ReviewRow[], total: countRes.count ?? 0 }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q = '', status: rawStatus, page: pageRaw } = await searchParams
  const status = getStatus(rawStatus)
  const page = getPage(pageRaw)
  const { rows: reviews, total } = await getReviews(q, status, page)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null
  const pending = reviews.filter((r) => !r.approved)
  const approved = reviews.filter((r) => r.approved)

  return (
    <div>
      <AdminPageHeader
        title="Product Reviews"
        description="Approve or remove customer reviews. Only approved reviews appear on product pages."
      />
      <form method="get" className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by reviewer, product slug, text…"
          className="w-full sm:max-w-md rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
        />
        <button
          type="submit"
          className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors"
        >
          Search
        </button>
        {status !== 'all' && <input type="hidden" name="status" value={status} />}
      </form>
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={hrefFor(q, s, 1)}
            className={`font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
              status === s
                ? 'border-secondary/40 text-secondary bg-secondary/10'
                : 'border-outline-variant/30 text-on-surface-variant hover:text-primary'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="font-sans text-sm text-on-surface-variant">No reviews yet.</p>
      )}

      {pending.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl text-primary mb-4">
            Pending approval
            <span className="ml-2 font-sans text-sm text-secondary">({pending.length})</span>
          </h2>
          <div className="space-y-4">
            {pending.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h2 className="font-serif text-xl text-primary mb-4">
            Published
            <span className="ml-2 font-sans text-sm text-on-surface-variant">({approved.length})</span>
          </h2>
          <div className="space-y-4">
            {approved.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="font-sans text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            {prevPage ? (
              <Link
                href={hrefFor(q, status, prevPage)}
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
                href={hrefFor(q, status, nextPage)}
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

function ReviewCard({ review }: { review: ReviewRow }) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div>
          <p className="font-serif text-base text-primary">{review.reviewer_name}</p>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">
            on <span className="text-secondary">/collection/{review.product_slug}</span>
            {' · '}{fmt(review.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StarRating rating={review.rating} size="sm" />
          {review.approved ? (
            <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-fixed/30 text-primary">
              Published
            </span>
          ) : (
            <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary">
              Pending
            </span>
          )}
        </div>
      </div>

      <p className="font-sans text-sm text-on-surface/80 leading-relaxed mb-4">{review.body}</p>

      <div className="flex gap-3">
        {!review.approved && (
          <form action={approveReview.bind(null, review.id)}>
            <button
              type="submit"
              className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/8 transition-colors"
            >
              Approve
            </button>
          </form>
        )}
        <form action={deleteReview.bind(null, review.id)}>
          <button
            type="submit"
            className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-error/25 text-error hover:bg-error/8 transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}
