import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

export const AUDIT_LOG_ENTITY_TYPES = [
  'all',
  'producer',
  'product',
  'product_review',
  'order',
  'producer_application',
] as const

export type AuditLogEntityFilter = (typeof AUDIT_LOG_ENTITY_TYPES)[number]

export type AdminAuditLogRow = {
  id: number
  created_at: string
  actor_email: string
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
}

const PAGE_SIZE = 30

function sanitizeOrTerm(raw: string): string {
  return raw.replace(/%/g, '\\%').replace(/,/g, ' ')
}

export function auditEntityAdminHref(entityType: string, entityId: string): string | null {
  switch (entityType) {
    case 'producer':
      return `/admin/producers/${entityId}`
    case 'product':
      return `/admin/products/${entityId}`
    case 'producer_application':
      return `/admin/applications/${entityId}`
    case 'order':
      return `/admin/orders?q=${encodeURIComponent(entityId)}`
    case 'product_review':
      return `/admin/reviews?q=${encodeURIComponent(entityId)}`
    default:
      return null
  }
}

export async function getAdminAuditLogsPage(opts: {
  page: number
  q: string
  entityType: AuditLogEntityFilter
}): Promise<{ rows: AdminAuditLogRow[]; totalCount: number; error?: string }> {
  const admin = createAdminClient() as any
  const page = Math.max(1, Math.floor(opts.page))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let listQuery = admin
    .from('admin_audit_logs')
    .select('id, created_at, actor_email, action, entity_type, entity_id, metadata')
    .order('created_at', { ascending: false })
    .range(from, to)

  let countQuery = admin.from('admin_audit_logs').select('id', { count: 'exact', head: true })

  if (opts.entityType !== 'all') {
    listQuery = listQuery.eq('entity_type', opts.entityType)
    countQuery = countQuery.eq('entity_type', opts.entityType)
  }

  const search = sanitizeOrTerm(opts.q.trim())
  if (search) {
    const pattern = `%${search}%`
    const orFilter = `actor_email.ilike.${pattern},action.ilike.${pattern},entity_id.ilike.${pattern}`
    listQuery = listQuery.or(orFilter)
    countQuery = countQuery.or(orFilter)
  }

  const [{ data, error }, countRes] = await Promise.all([listQuery, countQuery])

  if (error) {
    return { rows: [], totalCount: 0, error: error.message }
  }

  return {
    rows: (data ?? []) as AdminAuditLogRow[],
    totalCount: countRes.count ?? 0,
  }
}

export function auditLogPageSize(): number {
  return PAGE_SIZE
}
