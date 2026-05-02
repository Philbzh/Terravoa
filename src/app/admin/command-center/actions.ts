'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import { sendProducerFulfillmentReminder } from '@/lib/email/ops-emails'

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
}

async function upsertFollowup(input: {
  orderId: string
  producerId: string
  status: 'open' | 'contacted' | 'snoozed' | 'resolved'
  incrementContact?: boolean
  nextFollowUpAt?: string | null
  notes?: string | null
}) {
  const admin = createAdminClient() as any
  const { data: existing } = await admin
    .from('producer_fulfillment_followups')
    .select('id, contact_count')
    .eq('order_id', input.orderId)
    .eq('producer_id', input.producerId)
    .maybeSingle()

  if (existing?.id) {
    await admin
      .from('producer_fulfillment_followups')
      .update({
        status: input.status,
        contact_count: input.incrementContact
          ? Number(existing.contact_count ?? 0) + 1
          : Number(existing.contact_count ?? 0),
        last_contacted_at: input.incrementContact ? new Date().toISOString() : undefined,
        next_follow_up_at: input.nextFollowUpAt ?? undefined,
        notes: input.notes ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  } else {
    await admin.from('producer_fulfillment_followups').insert({
      order_id: input.orderId,
      producer_id: input.producerId,
      status: input.status,
      contact_count: input.incrementContact ? 1 : 0,
      last_contacted_at: input.incrementContact ? new Date().toISOString() : null,
      next_follow_up_at: input.nextFollowUpAt ?? null,
      notes: input.notes ?? null,
    })
  }
}

export async function sendReminderNow(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  const producerId = String(formData.get('producer_id') ?? '').trim()
  if (!orderId || !producerId) return

  const admin = createAdminClient() as any
  const [{ data: producer }, { count }] = await Promise.all([
    admin.from('producers').select('id, name, user_id').eq('id', producerId).maybeSingle(),
    admin
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', orderId)
      .eq('producer_id', producerId)
      .is('tracking_number', null),
  ])

  if (producer?.user_id) {
    const { data: authData } = await admin.auth.admin.getUserById(producer.user_id)
    if (authData?.user?.email) {
      await sendProducerFulfillmentReminder({
        to: authData.user.email,
        producerName: producer.name ?? 'Producer',
        delayedCount: count ?? 1,
      })
    }
  }

  await upsertFollowup({
    orderId,
    producerId,
    status: 'contacted',
    incrementContact: true,
    nextFollowUpAt: hoursFromNow(24),
  })

  await logAdminAction({
    action: 'ops.fulfillment_reminder_sent',
    entityType: 'order',
    entityId: orderId,
    metadata: { producer_id: producerId },
  })
  revalidatePath('/admin/command-center')
}

export async function markContacted(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  const producerId = String(formData.get('producer_id') ?? '').trim()
  if (!orderId || !producerId) return

  await upsertFollowup({
    orderId,
    producerId,
    status: 'contacted',
    incrementContact: true,
    nextFollowUpAt: hoursFromNow(24),
  })
  revalidatePath('/admin/command-center')
}

export async function snoozeFollowup(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  const producerId = String(formData.get('producer_id') ?? '').trim()
  const hours = Number(formData.get('hours') ?? 24)
  if (!orderId || !producerId) return

  await upsertFollowup({
    orderId,
    producerId,
    status: 'snoozed',
    nextFollowUpAt: hoursFromNow(Math.max(1, hours)),
  })
  revalidatePath('/admin/command-center')
}

export async function resolveFollowup(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  const producerId = String(formData.get('producer_id') ?? '').trim()
  if (!orderId || !producerId) return

  await upsertFollowup({
    orderId,
    producerId,
    status: 'resolved',
    nextFollowUpAt: null,
  })
  revalidatePath('/admin/command-center')
}
