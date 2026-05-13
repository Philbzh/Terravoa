import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * Returns the current user's platform role for navbar rendering.
 * Lightweight — no sensitive data exposed, just the role string.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ role: null })
    }

    // Check admin first (root admin via env, or admin_user_access table)
    if (isAdminEmail(user.email)) {
      return NextResponse.json({ role: 'admin' })
    }

    const admin = createAdminClient()

    // Check admin_user_access table for non-root admins
    const { data: accessRow } = await (admin as any)
      .from('admin_user_access')
      .select('is_active')
      .eq('email', user.email.toLowerCase())
      .eq('is_active', true)
      .maybeSingle()

    if (accessRow) {
      return NextResponse.json({ role: 'admin' })
    }

    // Check if user is a linked producer
    const { data: producerRow } = await (admin as any)
      .from('producers')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle()

    if (producerRow) {
      return NextResponse.json({ role: 'producer', producerStatus: (producerRow as any).status })
    }

    // Regular customer
    return NextResponse.json({ role: 'customer' })
  } catch {
    return NextResponse.json({ role: null })
  }
}
