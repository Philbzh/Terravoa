import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  AUDIT_LOG_ENTITY_TYPES,
  auditEntityAdminHref,
  auditLogPageSize,
  getAdminAuditLogsPage,
  type AuditLogEntityFilter,
} from '@/lib/admin/audit-log-list'

function getPage(raw: string | undefined): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

function getEntityType(raw: string | undefined): AuditLogEntityFilter {
  if (!raw) return 'all'
  return AUDIT_LOG_ENTITY_TYPES.includes(raw as AuditLogEntityFilter)
    ? (raw as AuditLogEntityFilter)
    : 'all'
}

function hrefFor(q: string, entityType: AuditLogEntityFilter, page: number) {
  const sp = new URLSearchParams()
  if (q.trim()) sp.set('q', q.trim())
  if (entityType !== 'all') sp.set('type', entityType)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `/admin/audit-log?${qs}` : '/admin/audit-log'
}

function fmt(d: string) {
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function metadataPreview(meta: Record<string, unknown>): string {
  try {
    const s = JSON.stringify(meta)
    return s.length > 140 ? `${s.slice(0, 140)}…` : s
  } catch {
    return '—'
  }
}

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>
}) {
  const { q = '', type: rawType, page: pageRaw } = await searchParams
  const entityType = getEntityType(rawType)
  const page = getPage(pageRaw)
  const pageSize = auditLogPageSize()

  const { rows, totalCount, error } = await getAdminAuditLogsPage({ page, q, entityType })
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const prevPage = page > 1 ? page - 1 : null
  const nextPage = page < totalPages ? page + 1 : null

  return (
    <div>
      <AdminPageHeader
        title="Audit log"
        description="Immutable record of admin actions (who did what, on which entity). Use filters to investigate support or compliance questions."
      />

      <form method="get" className="flex flex-col sm:flex-row gap-3 sm:items-end mb-6 flex-wrap">
        <div className="flex flex-col gap-1 w-full sm:max-w-md">
          <label htmlFor="audit-q" className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
            Search
          </label>
          <input
            id="audit-q"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Actor email, action, or entity id…"
            className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="audit-type" className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
            Entity type
          </label>
          <select
            id="audit-type"
            name="type"
            defaultValue={entityType}
            className="rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface min-w-[12rem]"
          >
            {AUDIT_LOG_ENTITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'all' ? 'All types' : t}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="font-sans text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors self-start sm:self-end"
        >
          Apply
        </button>
      </form>

      {error && <p className="text-error font-sans text-sm mb-4">{error}</p>}

      {rows.length === 0 && !error ? (
        <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
          <p className="font-sans text-sm text-on-surface-variant">
            No audit entries match your filters yet. Actions from admin tools will appear here after the migration is
            applied and changes are made.
          </p>
        </div>
      ) : (
        <>
          <p className="font-sans text-xs text-on-surface-variant mb-4">
            Showing {rows.length} of {totalCount} entr{totalCount === 1 ? 'y' : 'ies'}.
          </p>
          <div className="rounded-xl border border-outline-variant/20 overflow-x-auto">
            <table className="w-full text-left min-w-[880px]">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 whitespace-nowrap">
                    When
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                    Actor
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                    Action
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3">
                    Entity
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 min-w-[200px]">
                    Metadata
                  </th>
                  <th className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 text-right">
                    Open
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {rows.map((row) => {
                  const href = auditEntityAdminHref(row.entity_type, row.entity_id)
                  return (
                    <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors align-top">
                      <td className="px-4 py-3 font-sans text-xs text-on-surface-variant whitespace-nowrap">
                        {fmt(row.created_at)}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-on-surface break-all max-w-[180px]">
                        {row.actor_email}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-on-surface font-mono">{row.action}</td>
                      <td className="px-4 py-3">
                        <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
                          {row.entity_type}
                        </p>
                        <p className="font-sans text-xs text-on-surface font-mono break-all">{row.entity_id}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-on-surface-variant break-all">
                        {metadataPreview(row.metadata)}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {href ? (
                          <Link
                            href={href}
                            className="font-sans text-xs text-secondary hover:underline"
                          >
                            In admin
                          </Link>
                        ) : (
                          <span className="font-sans text-xs text-on-surface-variant/50">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="font-sans text-xs text-on-surface-variant">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-3">
            {prevPage ? (
              <Link
                href={hrefFor(q, entityType, prevPage)}
                className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary"
              >
                Previous
              </Link>
            ) : (
              <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant/40">Previous</span>
            )}
            {nextPage ? (
              <Link
                href={hrefFor(q, entityType, nextPage)}
                className="font-sans text-xs uppercase tracking-wider text-secondary hover:text-primary"
              >
                Next
              </Link>
            ) : (
              <span className="font-sans text-xs uppercase tracking-wider text-on-surface-variant/40">Next</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
