'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

export type MarkPaidResult = { ok: true } | { ok: false; error: string }

/**
 * Mark a batch of order_item ids as paid.
 * Called from the admin payout dashboard — one item or an entire producer batch.
 */
export async function markPayoutPaid(formData: FormData): Promise<MarkPaidResult> {
  try {
    await assertAdminForServerAction()
  } catch {
    return { ok: false, error: 'Unauthorized' }
  }

  // Accepts either a single id or a JSON array of ids (bulk)
  const raw = String(formData.get('order_item_ids') ?? '')
  let ids: string[] = []
  try {
    const parsed = JSON.parse(raw)
    ids = Array.isArray(parsed) ? parsed : [raw]
  } catch {
    ids = [raw]
  }

  ids = ids.filter(Boolean)
  if (!ids.length) return { ok: false, error: 'No items specified.' }

  const admin = createAdminClient()

  const { error } = await (admin as any)
    .from('order_items')
    .update({ payout_status: 'paid' })
    .in('id', ids)
    .eq('payout_status', 'due')       // idempotent: only update items that are actually due

  if (error) return { ok: false, error: error.message }

  await logAdminAction({
    action: 'payout.marked_paid',
    entityType: 'order_item',
    entityId: ids.join(','),
    metadata: { item_count: ids.length },
  })

  revalidatePath('/admin/payouts')
  return { ok: true }
}
