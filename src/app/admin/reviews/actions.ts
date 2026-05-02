'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

export async function approveReview(id: string) {
  await assertAdminForServerAction()
  const admin = createAdminClient() as any
  const { error } = await admin.from('product_reviews').update({ approved: true }).eq('id', id)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'review.approved',
    entityType: 'product_review',
    entityId: id,
    metadata: { approved: true },
  })

  revalidatePath('/admin/reviews')
}

export async function deleteReview(id: string) {
  await assertAdminForServerAction()
  const admin = createAdminClient() as any
  const { error } = await admin.from('product_reviews').delete().eq('id', id)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'review.deleted',
    entityType: 'product_review',
    entityId: id,
  })

  revalidatePath('/admin/reviews')
}
