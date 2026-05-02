'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'

export async function upsertAdminAccess(formData: FormData) {
  await assertAdminForServerAction()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const fullName = String(formData.get('full_name') ?? '').trim() || null
  if (!email) return

  const payload = {
    email,
    full_name: fullName,
    is_active: formData.get('is_active') === 'on',
    can_supplier: formData.get('can_supplier') === 'on',
    can_customer: formData.get('can_customer') === 'on',
    can_marketing: formData.get('can_marketing') === 'on',
    can_finance: formData.get('can_finance') === 'on',
    can_operations: formData.get('can_operations') === 'on',
    updated_at: new Date().toISOString(),
  }

  const admin = createAdminClient() as any
  await admin.from('admin_user_access').upsert(payload, { onConflict: 'email' })

  await logAdminAction({
    action: 'admin_user_access.upserted',
    entityType: 'admin_user_access',
    entityId: email,
    metadata: payload,
  })

  revalidatePath('/admin/user-settings')
}

export async function removeAdminAccess(formData: FormData) {
  await assertAdminForServerAction()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) return
  const admin = createAdminClient() as any
  await admin.from('admin_user_access').delete().eq('email', email)

  await logAdminAction({
    action: 'admin_user_access.deleted',
    entityType: 'admin_user_access',
    entityId: email,
  })

  revalidatePath('/admin/user-settings')
}
