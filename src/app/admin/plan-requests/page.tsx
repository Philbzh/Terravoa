import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { approvePlanRequest, rejectPlanRequest } from './actions'

type PlanRequestRow = {
  id: string
  producer_id: string
  request_type: string
  current_plan: string | null
  requested_plan: string | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  requester_email: string | null
  created_at: string
  producer: {
    name: string
    slug: string
  } | null
}

export default async function AdminPlanRequestsPage() {
  const admin = createAdminClient()
  const { data: rowsRaw } = await (admin as any)
    .from('producer_plan_requests')
    .select('id, producer_id, request_type, current_plan, requested_plan, message, status, admin_notes, requester_email, created_at, producer:producers(name, slug)')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (rowsRaw ?? []) as PlanRequestRow[]

  return (
    <div>
      <AdminPageHeader
        title="Plan & add-on requests"
        description="Approve producer upgrades and optional add-ons. Plan and featured placement updates are applied automatically."
      />

      {rows.length === 0 ? (
        <p className="font-sans text-sm text-on-surface-variant">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <article
              key={row.id}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <p className="font-serif text-lg text-primary">{labelForType(row.request_type, row.requested_plan)}</p>
                <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface border border-outline-variant/20 text-on-surface-variant">
                  {row.status}
                </span>
              </div>

              <p className="font-sans text-sm text-on-surface-variant mb-1">
                Producer:{' '}
                <Link
                  href={`/admin/producers/${row.producer_id}`}
                  className="text-secondary hover:underline"
                >
                  {row.producer?.name ?? row.producer_id}
                </Link>
                {row.current_plan ? ` · Current plan: ${row.current_plan}` : ''}
              </p>
              <p className="font-sans text-xs text-on-surface-variant mb-2">
                {new Date(row.created_at).toLocaleString('en-GB')}
                {row.requester_email ? ` · ${row.requester_email}` : ''}
              </p>

              {row.message && (
                <p className="font-sans text-sm text-on-surface/80 mb-3">{row.message}</p>
              )}

              {row.status === 'pending' ? (
                <div className="flex flex-wrap items-center gap-2">
                  <form action={approvePlanRequest}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectPlanRequest} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={row.id} />
                    <input
                      name="admin_notes"
                      placeholder="Reason (optional)"
                      className="rounded-full border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-xs text-on-surface"
                    />
                    <button
                      type="submit"
                      className="font-sans text-xs uppercase tracking-wider border border-error/30 text-error px-4 py-2 rounded-full hover:bg-error/5 transition-colors"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              ) : row.admin_notes ? (
                <p className="font-sans text-xs text-on-surface-variant">Admin notes: {row.admin_notes}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function labelForType(type: string, requestedPlan: string | null): string {
  if (type === 'plan_upgrade') return `Plan upgrade to ${requestedPlan ?? '—'}`
  if (type === 'addon_featured_placement') return 'Featured Placement add-on'
  if (type === 'addon_homepage_feature') return 'Homepage Feature add-on'
  return type
}
