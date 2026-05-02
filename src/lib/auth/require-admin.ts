import 'server-only'

import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/auth'

export type AdminAccess = {
  isRootAdmin: boolean
  canSupplier: boolean
  canCustomer: boolean
  canMarketing: boolean
  canFinance: boolean
  canOperations: boolean
}

const FULL_ACCESS: AdminAccess = {
  isRootAdmin: true,
  canSupplier: true,
  canCustomer: true,
  canMarketing: true,
  canFinance: true,
  canOperations: true,
}

async function getAdminAccessForEmail(email: string): Promise<AdminAccess | null> {
  if (isAdminEmail(email)) return FULL_ACCESS
  try {
    const admin = createAdminClient() as any
    const { data } = await admin
      .from('admin_user_access')
      .select('is_active, can_supplier, can_customer, can_marketing, can_finance, can_operations')
      .eq('email', email.toLowerCase())
      .maybeSingle()
    if (!data || data.is_active !== true) return null
    return {
      isRootAdmin: false,
      canSupplier: data.can_supplier === true,
      canCustomer: data.can_customer === true,
      canMarketing: data.can_marketing === true,
      canFinance: data.can_finance === true,
      canOperations: data.can_operations === true,
    }
  } catch {
    return null
  }
}

/** Use in Server Components / layouts: ensures the user is signed in and has dashboard rights. */
export async function requireAdminSession() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/login/admin?next=/admin')
  }
  const access = await getAdminAccessForEmail(user.email)
  if (!access) {
    redirect('/login/admin?error=forbidden')
  }
  return { user, access }
}

export async function requireAdminArea(
  area: 'supplier' | 'customer' | 'marketing' | 'finance' | 'operations',
) {
  const session = await requireAdminSession()
  if (session.access.isRootAdmin) return session
  const allowed =
    area === 'supplier'
      ? session.access.canSupplier
      : area === 'customer'
        ? session.access.canCustomer
        : area === 'marketing'
          ? session.access.canMarketing
          : area === 'finance'
            ? session.access.canFinance
            : session.access.canOperations
  if (!allowed) {
    redirect('/admin?error=forbidden-area')
  }
  return session
}

/** Use at the start of every admin server action that mutates data. */
export async function assertAdminForServerAction(): Promise<void> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) {
    throw new Error('Unauthorized')
  }
  const access = await getAdminAccessForEmail(user.email)
  if (!access) {
    throw new Error('Unauthorized')
  }
}
