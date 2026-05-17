'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

export async function approveDiscovery(id: string) {
  await assertAdminForServerAction()
  const admin = createAdminClient() as any
  const { error } = await admin
    .from('community_discoveries')
    .update({ status: 'approved' })
    .eq('id', id)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'discovery.approved',
    entityType: 'community_discovery',
    entityId: id,
    metadata: { status: 'approved' },
  })

  revalidatePath('/admin/discoveries')
}

export async function rejectDiscovery(id: string) {
  await assertAdminForServerAction()
  const admin = createAdminClient() as any
  const { error } = await admin
    .from('community_discoveries')
    .update({ status: 'rejected' })
    .eq('id', id)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'discovery.rejected',
    entityType: 'community_discovery',
    entityId: id,
    metadata: { status: 'rejected' },
  })

  revalidatePath('/admin/discoveries')
}

export async function deleteDiscovery(id: string) {
  await assertAdminForServerAction()
  const admin = createAdminClient() as any
  const { error } = await admin
    .from('community_discoveries')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'discovery.deleted',
    entityType: 'community_discovery',
    entityId: id,
  })

  revalidatePath('/admin/discoveries')
}
