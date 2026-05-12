import { createAdminClient } from '@/lib/supabase/admin'
import { setProducerStatus } from './actions'
import { CheckCircle, PauseCircle } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import Link from 'next/link'

type ProducerRow = {
  id: string
  name: string
  slug: string
  region: string
  country: string
  specialty: string
  status: 'pending' | 'approved' | 'suspended'
  plan: string | null
  created_at: string
}

const PAGE_SIZE = 25
const STATUS_OPTIONS = ['all', 'pending', 'approved', 'suspended'] as const
type ProducerStatusFilter = (typeof STATUS_OPTIONS)[number]

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getStatus(raw: string | undefined): ProducerStatusFilter {
  if (!raw) return 'all'
  return STATUS_OPTIONS.includes(raw as ProducerStatusFilter)
    ? (raw as ProducerStatusFilter)
    : 'all'
}

function hrefFor(q: string, status: ProducerStatusFilter, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (status !== 'all') sp.set('status', status)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/producers?${qs}` : '/admin/producers'
}

function ApproveButton({ id }: { id: string }) {
  return (
    <form action={async () => { 'use server'; await setProducerStatus(id, 'approved') }}>
      <button type="submit" title="Approve"
        className="inline-flex items-center gap-1 text-primary hover:opacity-70 transition-opacity font-sans text-xs uppercase tracking-wide">
        <CheckCircle size={14} strokeWidth={1.5} /> Approve
      </button>
    </form>
  )
}

function SuspendButton({ id }: { id: string }) {
  return (
    <form action={async () => { 'use server'; await setProducerStatus(id, 'suspended') }}>
      <button type="submit" title="Suspend"
        className="inline-flex items-center gap-1 text-error hover:opacity-70 transition-opacity font-sans text-xs uppercase tracking-wide">
        <PauseCircle size={14} strokeWidth={1.5} /> Suspend
      </button>
    </form>
  )
}

export default async function AdminProducersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q = '', status: rawStatus, page: pageRaw } = await searchParams
  const status = getStatus(rawStatus)
  const page = getPage(pageRaw)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const admin = createAdminClient()

  const base = (admin as any)
    .from('producers')
    .select('id, name, slug, region, country, specialty, status, plan, created_at')
    .order('created_at', { ascending: false })
    .range(from, to)
  const countBase = (admin as any)
    .from('producers')
    .select('id', { count: 'exact', head: true })
  const search = q.trim()
  const filter = search
    ? `name.ilike.%${search}%,slug.ilike.%${search}%,region.ilike.%${search}%,country.ilike.%${search}%,specialty.ilike.%${search}%,status.ilike.%${search}%`
    : null

  const listQuery = filter ? base.or(filter) : base
  const countQuery = filter ? countBase.or(filter) : countBase
  const makeStatusCountQuery = (s: Exclude<ProducerStatusFilter, 'all'>) => {
    const q = (admin as any).from('producers').select('id', { count: 'exact', head: true })
    const filtered = filter ? q.or(filter) : q
    return filtered.eq('status', s)
  }
  const [{ data, error }, countRes, pendingRes, approvedRes, suspendedRes] = await Promise.all([
    status !== 'all' ? listQuery.eq('status', status) : listQuery,
    status !== 'all' ? countQuery.eq('status', status) : countQuery,
    makeStatusCountQuery('pending'),
    makeStatusCountQuery('approved'),
    makeStatusCountQuery('suspended'),
  ])

  const list = (data ?? []) as ProducerRow[]
  const totalCount = countRes.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null
  const pending = pendingRes.count ?? 0
  const approved = approvedRes.count ?? 0
  const suspended = suspendedRes.count ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Producers"
        description="All registered producer accounts. Approve pending profiles, or suspend to hide their storefront and products."
        metrics={[
          { label: 'pending', value: pending },
          { label: 'approved', value: approved },
          { label: 'suspended', value: suspended },
        ]}
      />
      <form method="get" className="admin-toolbar">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by producer, slug, region, country, status…"
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
      <div className="admin-filter-row">
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={hrefFor(q, s, 1)}
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

      {error && <p className="text-error font-sans text-sm mb-4">{error.message}</p>}

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No producers registered yet. Accepted applications will create producer accounts here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-6 font-sans text-sm text-on-surface-variant">
            <span><strong className="text-tertiary">{pending}</strong> pending</span>
            <span><strong className="text-primary">{approved}</strong> approved</span>
            <span><strong className="text-error">{suspended}</strong> suspended</span>
          </div>

          <div className="admin-table-wrap overflow-x-auto">
            <table className="w-full text-left min-w-[860px]">
              <thead>
                <tr className="bg-surface-container-low/70">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Producer</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden sm:table-cell">Location</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden md:table-cell">Specialty</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 hidden lg:table-cell">Plan</th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">Status</th>
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
                      <p className="font-sans text-[11px] text-on-surface-variant/60">/producers/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant">{p.region}, {p.country}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant">{p.specialty}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        p.plan === 'premium'
                          ? 'bg-secondary/15 text-secondary'
                          : p.plan === 'growth'
                            ? 'bg-primary-fixed/30 text-primary'
                            : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {p.plan ?? 'founding'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        p.status === 'approved'
                          ? 'bg-primary-fixed/40 text-primary'
                          : p.status === 'pending'
                            ? 'bg-tertiary-fixed/30 text-tertiary'
                            : 'bg-error-container/50 text-error'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Link
                          href={`/admin/producers/${p.id}`}
                          className="font-sans text-[11px] uppercase tracking-wide text-secondary hover:text-primary transition-colors border border-secondary/25 rounded-full px-2.5 py-1"
                        >
                          Open editor
                        </Link>
                        {p.status !== 'approved' && <ApproveButton id={p.id} />}
                        {p.status !== 'suspended' && <SuspendButton id={p.id} />}
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
