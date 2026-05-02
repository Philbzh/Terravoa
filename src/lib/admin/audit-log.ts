import 'server-only'

import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type AuditLogInput = {
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
}

/**
 * Best-effort admin audit logging.
 * Logging failures never block business actions.
 */
export async function logAdminAction(input: AuditLogInput): Promise<void> {
  try {
    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const actorEmail = user?.email
    if (!actorEmail) return

    const admin = createAdminClient() as any
    const { error } = await admin.from('admin_audit_logs').insert({
      actor_email: actorEmail,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      metadata: input.metadata ?? {},
    })

    if (error) {
      // Common during rollout before migration is applied.
      console.warn('[admin-audit] insert failed:', error.message)
    }
  } catch (error) {
    console.warn('[admin-audit] unexpected failure', error)
  }
}
