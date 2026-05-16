import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyCronAuth } from '@/lib/cron-auth'
import { sendAbandonedCartReminder } from '@/lib/email/cart-emails'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const unauthorized = verifyCronAuth(request)
  if (unauthorized) return unauthorized

  const admin = createAdminClient() as any
  const now = new Date()

  // Find carts abandoned 1+ hours ago that haven't been reminded or recovered
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await admin
    .from('abandoned_carts')
    .select('id, email, cart_json, locale, updated_at')
    .is('reminder_sent_at', null)
    .is('recovered_at', null)
    .lte('updated_at', oneHourAgo)
    .gte('updated_at', twentyFourHoursAgo)
    .order('updated_at', { ascending: true })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const carts = (data ?? []) as {
    id: string
    email: string
    cart_json: { name?: string; slug?: string; quantity?: number }[]
    locale: string
    updated_at: string
  }[]

  let sent = 0
  let failed = 0

  for (const cart of carts) {
    try {
      await sendAbandonedCartReminder({
        to: cart.email,
        locale: cart.locale,
        items: cart.cart_json,
      })

      await admin
        .from('abandoned_carts')
        .update({ reminder_sent_at: now.toISOString() })
        .eq('id', cart.id)

      sent += 1
    } catch (e) {
      console.error('[cron/abandoned-carts] send failed', cart.email, e)
      failed += 1
    }
  }

  return NextResponse.json({ ok: true, processed: carts.length, sent, failed })
}
