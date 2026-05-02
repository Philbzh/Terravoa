import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ReturnStatusForm } from './ReturnStatusForm'
import { RotateCcw } from 'lucide-react'
import Link from 'next/link'

type ReturnRequest = {
  id: string
  order_id: string
  customer_email: string
  customer_name: string | null
  reason: string
  description: string | null
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  admin_notes: string | null
  created_at: string
}

const REASON_LABELS: Record<string, string> = {
  withdrawal: '14-day withdrawal',
  damaged:    'Arrived damaged',
  wrong_item: 'Wrong item',
  quality:    'Quality issue',
}

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-tertiary-fixed/30 text-tertiary border-tertiary/20',
  approved:  'bg-primary-fixed/40 text-primary border-primary/20',
  rejected:  'bg-error/10 text-error border-error/20',
  completed: 'bg-surface-container-high text-on-surface-variant border-outline-variant/30',
}

export const metadata = { title: 'Returns — Admin' }

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: filterStatus } = await searchParams
  const admin = createAdminClient() as any

  let query = admin
    .from('return_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (filterStatus && filterStatus !== 'all') {
    query = query.eq('status', filterStatus)
  }

  const { data: requests, error } = await query
  const rows: ReturnRequest[] = requests ?? []

  // Counts per status for filter tabs
  const { data: counts } = await admin
    .from('return_requests')
    .select('status')

  const tally: Record<string, number> = { all: 0, pending: 0, approved: 0, rejected: 0, completed: 0 }
  for (const r of counts ?? []) {
    tally.all++
    tally[r.status] = (tally[r.status] ?? 0) + 1
  }

  const TABS = [
    { value: 'all',       label: 'All' },
    { value: 'pending',   label: 'Pending' },
    { value: 'approved',  label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected',  label: 'Rejected' },
  ]

  const active = filterStatus ?? 'all'

  return (
    <div>
      <AdminPageHeader
        title="Returns"
        description="Review and action customer return requests."
      />

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === 'all' ? '/admin/returns' : `/admin/returns?status=${tab.value}`}
            className={`font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
              active === tab.value
                ? 'bg-primary text-on-primary border-primary'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary'
            }`}
          >
            {tab.label}
            {tally[tab.value] > 0 && (
              <span className="ml-1.5 opacity-70">{tally[tab.value]}</span>
            )}
          </a>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending', value: tally.pending, tone: 'text-tertiary' },
          { label: 'Approved', value: tally.approved, tone: 'text-primary' },
          { label: 'Completed', value: tally.completed, tone: 'text-on-surface' },
          { label: 'Rejected', value: tally.rejected, tone: 'text-error' },
        ].map((kpi) => (
          <div key={kpi.label} className="admin-kpi-card rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
            <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">{kpi.label}</p>
            <p className={`font-serif text-2xl ${kpi.tone}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-error/10 border border-error/20 px-4 py-3 font-sans text-sm text-error">
          Failed to load return requests.
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface-container-low/30 p-14 text-center">
          <RotateCcw className="mx-auto mb-4 text-on-surface-variant/30" size={32} strokeWidth={1} />
          <p className="font-sans text-sm text-on-surface-variant">No return requests{filterStatus && filterStatus !== 'all' ? ` with status "${filterStatus}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm"
            >
              {/* Header */}
              <header className="bg-surface-container-low/60 border-b border-outline-variant/15 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">
                    Ref · <span className="font-mono">{r.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant">
                    {new Date(r.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`self-start sm:self-auto font-sans text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border ${
                    STATUS_STYLES[r.status] ?? 'bg-surface-container text-on-surface-variant border-outline-variant/20'
                  }`}
                >
                  {r.status}
                </span>
              </header>

              {/* Body */}
              <div className="px-5 py-4 grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                <div className="xl:col-span-8 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Customer</p>
                    <p className="font-sans text-sm text-on-surface">{r.customer_name ?? '—'}</p>
                    <p className="font-sans text-xs text-on-surface-variant">{r.customer_email}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Order</p>
                    <p className="font-mono text-xs text-on-surface">{r.order_id}</p>
                    <Link href={`/admin/orders/${r.order_id}`} className="font-sans text-xs text-secondary hover:underline">
                      Open order editor
                    </Link>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Reason</p>
                    <p className="font-sans text-sm text-on-surface">{REASON_LABELS[r.reason] ?? r.reason}</p>
                  </div>
                  {r.description && (
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Customer note</p>
                      <p className="font-sans text-sm text-on-surface leading-relaxed">{r.description}</p>
                    </div>
                  )}
                </div>

                <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-outline-variant/10 pt-4 xl:pt-0 xl:pl-5">
                  <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">Admin action</p>
                  <ReturnStatusForm requestId={r.id} currentStatus={r.status} currentNotes={r.admin_notes ?? ''} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
