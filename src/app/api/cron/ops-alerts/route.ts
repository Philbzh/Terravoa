import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getOpsCommandCenterData } from '@/lib/admin/ops-command-center'
import { sendAdminOpsDigest, sendProducerFulfillmentReminder } from '@/lib/email/ops-emails'
import { verifyCronAuth } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function autoReopenStaleFollowups(admin: any): Promise<number> {
  const now = new Date()
  const resolvedSlaCutoffIso = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()

  const { data: followups } = await admin
    .from('producer_fulfillment_followups')
    .select('id, order_id, producer_id, status, next_follow_up_at, updated_at')
    .in('status', ['snoozed', 'resolved'])

  let reopened = 0

  for (const row of (followups ?? []) as Array<{
    id: string
    order_id: string
    producer_id: string
    status: 'snoozed' | 'resolved'
    next_follow_up_at: string | null
    updated_at: string
  }>) {
    const snoozedDue =
      row.status === 'snoozed' &&
      row.next_follow_up_at !== null &&
      new Date(row.next_follow_up_at).getTime() <= now.getTime()
    const resolvedDue = row.status === 'resolved' && row.updated_at <= resolvedSlaCutoffIso
    if (!snoozedDue && !resolvedDue) continue

    const { count } = await admin
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', row.order_id)
      .eq('producer_id', row.producer_id)
      .is('tracking_number', null)

    // Reopen only if the fulfillment issue still exists.
    if ((count ?? 0) < 1) continue

    await admin
      .from('producer_fulfillment_followups')
      .update({
        status: 'open',
        next_follow_up_at: null,
        updated_at: now.toISOString(),
      })
      .eq('id', row.id)

    reopened += 1
  }

  return reopened
}

export async function POST(request: Request) {
  const unauthorized = verifyCronAuth(request)
  if (unauthorized) return unauthorized

  const admin = createAdminClient() as any
  const autoReopened = await autoReopenStaleFollowups(admin)
  const data = await getOpsCommandCenterData()
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL?.trim()
  if (adminEmail) {
    await sendAdminOpsDigest({
      to: adminEmail,
      delayed24h: data.delayed24h,
      delayed48h: data.delayed48h,
      delayed72h: data.delayed72h,
      returnBacklog24h: data.returnBacklog24h,
      planBacklog48h: data.planBacklog48h,
    })
  }

  const criticalByProducer = new Map<string, { producerName: string; delayedCount: number }>()
  for (const row of data.delayedItems) {
    if (row.ageHours < 48) continue
    const existing = criticalByProducer.get(row.producerId)
    if (!existing) {
      criticalByProducer.set(row.producerId, { producerName: row.producerName, delayedCount: 1 })
    } else {
      existing.delayedCount += 1
    }
  }

  const producerIds = Array.from(criticalByProducer.keys())

  let producerRemindersSent = 0
  if (producerIds.length > 0) {
    const { data: producerRows } = await admin
      .from('producers')
      .select('id, name, user_id')
      .in('id', producerIds)

    for (const producer of (producerRows ?? []) as { id: string; name: string; user_id: string | null }[]) {
      if (!producer.user_id) continue
      const info = criticalByProducer.get(producer.id)
      if (!info) continue
      try {
        const { data: authData, error } = await admin.auth.admin.getUserById(producer.user_id)
        if (error || !authData?.user?.email) continue
        await sendProducerFulfillmentReminder({
          to: authData.user.email,
          producerName: producer.name ?? info.producerName,
          delayedCount: info.delayedCount,
        })
        producerRemindersSent += 1
      } catch {
        // Best-effort only
      }
    }
  }

  return NextResponse.json({
    ok: true,
    delayed24h: data.delayed24h,
    delayed48h: data.delayed48h,
    delayed72h: data.delayed72h,
    autoReopened,
    producerRemindersSent,
  })
}
