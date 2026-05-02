import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendReturnRequestConfirmation,
  sendReturnRequestAdminNotification,
} from '@/lib/email/return-emails'

const VALID_REASONS = ['withdrawal', 'damaged', 'wrong_item', 'quality'] as const
type ReturnReason = (typeof VALID_REASONS)[number]

export async function POST(req: Request) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const supabase = await createServerSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Parse & validate input ───────────────────────────────────────────────
    const body = await req.json()
    const { orderId, reason, description, customerName } = body as Record<string, unknown>

    if (!orderId || typeof orderId !== 'string' || orderId.trim().length === 0) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    }
    if (!reason || !VALID_REASONS.includes(reason as ReturnReason)) {
      return NextResponse.json({ error: 'Please select a valid reason.' }, { status: 400 })
    }
    const normalizedReason = reason as ReturnReason
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Invalid description.' }, { status: 400 })
    }

    const admin = createAdminClient() as any

    // ── Verify order belongs to this customer ────────────────────────────────
    const { data: order } = await admin
      .from('orders')
      .select('id, customer_email, created_at')
      .eq('id', orderId.trim())
      .eq('customer_email', user.email)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    // ── Enforce 14-day window for voluntary withdrawal ───────────────────────
    if (normalizedReason === 'withdrawal') {
      const orderDate = new Date(order.created_at)
      const daysSince = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSince > 14) {
        return NextResponse.json(
          { error: 'The 14-day withdrawal period has expired for this order.' },
          { status: 422 },
        )
      }
    }

    // ── Prevent duplicate open requests ─────────────────────────────────────
    const { count } = await admin
      .from('return_requests')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', orderId.trim())
      .neq('status', 'rejected')

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'A return request already exists for this order.' },
        { status: 409 },
      )
    }

    // ── Persist ──────────────────────────────────────────────────────────────
    const name =
      typeof customerName === 'string' && customerName.trim()
        ? customerName.trim()
        : user.email.split('@')[0]

    const { data: request, error: insertError } = await admin
      .from('return_requests')
      .insert({
        order_id: orderId.trim(),
        customer_email: user.email,
        customer_name: name,
        reason: normalizedReason,
        description: typeof description === 'string' ? description.trim() || null : null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !request) {
      console.error('[return-request] insert error:', insertError?.message)
      return NextResponse.json({ error: 'Failed to save request.' }, { status: 500 })
    }

    // ── Send emails (non-blocking) ───────────────────────────────────────────
    const emailOpts = {
      customerEmail: user.email,
      customerName: name,
      orderId: orderId.trim(),
      reason: normalizedReason,
      description: typeof description === 'string' ? description.trim() : '',
      returnRequestId: request.id as string,
    }
    await Promise.allSettled([
      sendReturnRequestConfirmation(emailOpts),
      sendReturnRequestAdminNotification(emailOpts),
    ])

    return NextResponse.json({ ok: true, id: request.id })
  } catch (e) {
    console.error('[return-request] unexpected error:', e)
    return NextResponse.json({ error: 'Unexpected error.' }, { status: 500 })
  }
}
