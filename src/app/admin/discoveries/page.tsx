import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { approveDiscovery, rejectDiscovery, deleteDiscovery } from './actions'
import Link from 'next/link'

interface DiscoveryRow {
  id: string
  region_slug: string
  author_name: string
  author_location: string | null
  body: string
  status: string
  created_at: string
}

const PAGE_SIZE = 25
const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'] as const
type StatusFilter = (typeof STATUS_OPTIONS)[number]

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getStatus(raw: string | undefined): StatusFilter {
  if (!raw) return 'pending'
  return STATUS_OPTIONS.includes(raw as StatusFilter) ? (raw as StatusFilter) : 'pending'
}

function hrefFor(q: string, status: StatusFilter, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (status !== 'pending') sp.set('status', status)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/discoveries?${qs}` : '/admin/discoveries'
}

async function getDiscoveries(
  q: string,
  status: StatusFilter,
  page: number,
): Promise<{ rows: DiscoveryRow[]; total: number }> {
  const admin = createAdminClient() as any
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = admin
    .from('community_discoveries')
    .select('id, region_slug, author_name, author_location, body, status, created_at')
    .order('created_at', { ascending: false })
    .range(from, to)

  let countQuery = admin
    .from('community_discoveries')
    .select('id', { count: 'exact', head: true })

  if (status !== 'all') {
    query = query.eq('status', status)
    countQuery = countQuery.eq('status', status)
  }

  const search = q.trim()
  if (search) {
    const filter = `author_name.ilike.%${search}%,body.ilike.%${search}%,region_slug.ilike.%${search}%`
    query = query.or(filter)
    countQuery = countQuery.or(filter)
  }

  const [{ data }, countRes] = await Promise.all([query, countQuery])
  return { rows: (data ?? []) as DiscoveryRow[], total: countRes.count ?? 0 }
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default async function AdminDiscoveriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const sp = await searchParams
  const q = sp.q ?? ''
  const status = getStatus(sp.status)
  const page = getPage(sp.page)
  const { rows, total } = await getDiscoveries(q, status, page)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <AdminPageHeader
        title="Community Discoveries"
        description={`${total} ${status === 'all' ? 'total' : status} submission${total !== 1 ? 's' : ''}`}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <Link
            key={opt}
            href={hrefFor(q, opt, 1)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              status === opt
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </Link>
        ))}

        <form action={`/admin/discoveries`} method="GET" className="ml-auto flex gap-2">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search..."
            className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      {rows.length === 0 ? (
        <p className="text-on-surface-variant text-sm py-12 text-center">
          No discoveries found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low text-left">
                <th className="px-4 py-3 font-medium text-on-surface-variant">Author</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Region</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Content</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Status</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Date</th>
                <th className="px-4 py-3 font-medium text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-lowest/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-on-surface">{row.author_name}</p>
                    {row.author_location && (
                      <p className="text-xs text-on-surface-variant">{row.author_location}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{row.region_slug}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-on-surface line-clamp-2">{row.body}</p>
                  </td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{fmt(row.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {row.status === 'pending' && (
                        <>
                          <form action={approveDiscovery.bind(null, row.id)}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={rejectDiscovery.bind(null, row.id)}>
                            <button
                              type="submit"
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                            >
                              Reject
                            </button>
                          </form>
                        </>
                      )}
                      {row.status === 'rejected' && (
                        <form action={approveDiscovery.bind(null, row.id)}>
                          <button
                            type="submit"
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                          >
                            Approve
                          </button>
                        </form>
                      )}
                      <form action={deleteDiscovery.bind(null, row.id)}>
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={hrefFor(q, status, page - 1)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container-low transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={hrefFor(q, status, page + 1)}
                className="px-3 py-1.5 rounded-lg border border-outline-variant/30 text-xs hover:bg-surface-container-low transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
