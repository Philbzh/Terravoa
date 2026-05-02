import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed']

export async function PATCH(req: Request) {
  try {
    await requireAdminSession()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, status, admin_notes } = body as Record<string, unknown>

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 })
    }
    if (!status || !VALID_STATUSES.includes(status as string)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
    }

    const admin = createAdminClient() as any
    const { error } = await admin
      .from('return_requests')
      .update({
        status,
        admin_notes: typeof admin_notes === 'string' ? admin_notes.trim() || null : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('[admin/return-request] update error:', error.message)
      return NextResponse.json({ error: 'Failed to update.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/return-request] unexpected error:', e)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
