import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Record a producer or admin action in the `admin_audit_logs` table.
 *
 * LOW-6 fix: producer mutations (tracking-number updates, product creation,
 * plan changes) used to leave no trail. We now log every producer-initiated
 * change so the admin team can reconstruct "who did what, when" after the
 * fact. Admin mutations already flow through existing audit paths.
 *
 * This helper is deliberately fire-and-forget: a failed audit write must
 * not abort the underlying mutation. Errors are logged and swallowed.
 */
export type AuditAction =
  | 'producer.product.created'
  | 'producer.product.updated'
  | 'producer.product.image.uploaded'
  | 'producer.order_item.tracking_updated'
  | 'producer.order_item.tracking_cleared'
  | 'producer.order_item.confirmed'
  | 'producer.plan.request_submitted'
  | 'producer.profile.bank_details_updated'

export async function logAuditEvent(input: {
  action: AuditAction
  actorEmail: string
  entityType:
    | 'product'
    | 'product_image'
    | 'order_item'
    | 'plan_request'
    | 'producer'
  entityId: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  try {
    const admin = createAdminClient() as any
    const { error } = await admin.from('admin_audit_logs').insert({
      actor_email: input.actorEmail,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      metadata: input.metadata ?? {},
    })
    if (error) {
      console.warn('[audit] insert failed', input.action, error.message)
    }
  } catch (e) {
    console.warn('[audit] write threw', input.action, e)
  }
}
