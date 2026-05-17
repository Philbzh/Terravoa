import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { requireAdminSession } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireJsonContentType } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'completed']

export async function PATCH(req: Request) {
  const badContentType = requireJsonContentType(req)
  if (badContentType) return badContentType

  try {
    await requireAdminSession()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 30 requests per minute per IP
  const hdrs = await headers()
  const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = await rateLimit(`admin-return-request:${ip}`, 30, 60_000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
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
