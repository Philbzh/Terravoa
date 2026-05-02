import 'server-only'

import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

export type ProducerRow = Database['public']['Tables']['producers']['Row']
export type ProducerAccountState =
  | 'anonymous'
  | 'unlinked'
  | 'pending'
  | 'suspended'
  | 'approved'

/**
 * Current auth user + their producer row, or null when signed out.
 *
 * MED-8 fix: the `producer` field is populated **only** for producers whose
 * status is `approved`. Pending or suspended producers are returned with a
 * null `producer` and a descriptive `accountState` so the caller can render
 * the correct screen (instead of silently leaking dashboard data).
 *
 * The caller is expected to:
 *   - redirect anonymous users (session === null)
 *   - redirect or show a status page when accountState !== 'approved'
 *
 * Usage is restricted to the server (see `server-only` guard at top of file).
 */
export async function getProducerForSession(): Promise<{
  userId: string
  email: string | undefined
  producer: ProducerRow | null
  accountState: Exclude<ProducerAccountState, 'anonymous'>
} | null> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: row } = await admin
    .from('producers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const producerRow = (row ?? null) as ProducerRow | null

  let accountState: Exclude<ProducerAccountState, 'anonymous'>
  if (!producerRow) accountState = 'unlinked'
  else if (producerRow.status === 'approved') accountState = 'approved'
  else if (producerRow.status === 'suspended') accountState = 'suspended'
  else accountState = 'pending'

  return {
    userId: user.id,
    email: user.email ?? undefined,
    // Only approved producers expose their full row — pending/suspended are
    // intentionally hidden so downstream callers cannot accidentally serve
    // dashboard data to an inactive producer.
    producer: accountState === 'approved' ? producerRow : null,
    accountState,
  }
}
