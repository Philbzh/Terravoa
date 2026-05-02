'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { logAuditEvent } from '@/lib/audit-log'
import type { OrdersRow, OrderItemsRow } from '@/lib/supabase/types'
import { sendBuyerTrackingUpdate } from '@/lib/email/order-emails'
import { toLegacyOrderStatus } from '@/lib/order-workflow'

export type FulfillmentResult = { ok: true } | { ok: false; error: string } | null
export type ConfirmResult   = { ok: true } | { ok: false; error: string } | null

const TRACKING_MAX = 512

async function syncOrderStatusFromLineItems(orderId: string) {
  const admin = createAdminClient()

  const { data: orderData } = await admin
    .from('orders')
    .select('status, fulfillment_status')
    .eq('id', orderId)
    .maybeSingle()

  const orderRow = orderData as (Pick<OrdersRow, 'status'> & { fulfillment_status?: string }) | null
  if (!orderRow?.status || orderRow.status === 'delivered') return

  const { data: trackingRows } = await admin
    .from('order_items')
    .select('tracking_number')
    .eq('order_id', orderId)

  const items = (trackingRows ?? []) as Pick<OrderItemsRow, 'tracking_number'>[]
  if (!items.length) return

  const hasTracking = (t: string | null) => Boolean(t && String(t).trim().length > 0)
  const allTracked = items.every((i) => hasTracking(i.tracking_number))
  const anyTracked = items.some((i) => hasTracking(i.tracking_number))

  const nextFulfillment = allTracked ? 'shipped' : anyTracked ? 'partially_acked' : 'awaiting_producer_ack'
  const next = toLegacyOrderStatus(nextFulfillment)

  if (next === orderRow.status && nextFulfillment === (orderRow.fulfillment_status ?? nextFulfillment)) return

  const { error } = await (admin as any)
    .from('orders')
    .update({
      status: next,
      fulfillment_status: nextFulfillment,
      ...(allTracked ? { shipped_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderId)

  if (error) {
    console.error('syncOrderStatusFromLineItems', error.message)
  }
}

/**
 * Step 1 of the 3-step flow: producer confirms they will fulfill the order.
 * Transitions order_item.status from 'pending' → 'producer_accepted'.
 */
export async function confirmOrderItem(
  _prev: ConfirmResult,
  formData: FormData,
): Promise<Exclude<ConfirmResult, null>> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Sign in as a linked producer to confirm orders.' }
  }

  const orderItemId = String(formData.get('order_item_id') ?? '').trim()
  if (!orderItemId) return { ok: false, error: 'Missing line item.' }

  const admin = createAdminClient()

  const { data: itemData, error: fetchError } = await admin
    .from('order_items')
    .select('id, producer_id, order_id, status')
    .eq('id', orderItemId)
    .maybeSingle()

  const row = itemData as Pick<OrderItemsRow, 'id' | 'producer_id' | 'order_id' | 'status'> | null

  if (fetchError || !row) return { ok: false, error: 'Line item not found.' }
  if (row.producer_id !== session.producer.id) return { ok: false, error: 'You can only confirm your own products.' }
  if (row.status !== 'pending') return { ok: false, error: 'Item is not in a confirmable state.' }

  const { error: updateError } = await (admin as any)
    .from('order_items')
    .update({ status: 'producer_accepted' })
    .eq('id', orderItemId)
    .eq('producer_id', session.producer.id)

  if (updateError) return { ok: false, error: updateError.message }

  if (session.email) {
    await logAuditEvent({
      action: 'producer.order_item.confirmed',
      actorEmail: session.email,
      entityType: 'order_item',
      entityId: row.id,
      metadata: { producer_id: session.producer.id, order_id: row.order_id },
    })
  }

  revalidatePath('/producer/orders')
  return { ok: true } as const
}

export async function updateProducerOrderItemFulfillment(
  _prev: FulfillmentResult,
  formData: FormData,
): Promise<Exclude<FulfillmentResult, null>> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Sign in as a linked producer to update orders.' }
  }

  const orderItemId = String(formData.get('order_item_id') ?? '').trim()
  if (!orderItemId) {
    return { ok: false, error: 'Missing line item.' }
  }

  let tracking = String(formData.get('tracking') ?? '').trim()
  if (tracking.length > TRACKING_MAX) {
    return { ok: false, error: `Tracking number must be at most ${TRACKING_MAX} characters.` }
  }

  const clearTracking = formData.get('clear_tracking') === '1'
  if (clearTracking) {
    tracking = ''
  }

  const admin = createAdminClient()

  const { data: itemData, error: fetchError } = await admin
    .from('order_items')
    .select('id, producer_id, order_id, tracking_number')
    .eq('id', orderItemId)
    .maybeSingle()

  const row = itemData as Pick<OrderItemsRow, 'id' | 'producer_id' | 'order_id' | 'tracking_number'> | null

  if (fetchError || !row) {
    return { ok: false, error: 'Line item not found.' }
  }

  if (row.producer_id !== session.producer.id) {
    return { ok: false, error: 'You can only update your own products.' }
  }

  const trackingValue = tracking.length > 0 ? tracking : null

  const { error: updateError } = await (admin as any)
    .from('order_items')
    .update({
      tracking_number: trackingValue,
      status: trackingValue ? 'shipped' : 'producer_accepted',
      // When tracking is entered, mark payout as due (Step 3 → triggers SEPA)
      payout_status: trackingValue ? 'due' : 'pending',
      ...(trackingValue ? { shipped_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderItemId)
    .eq('producer_id', session.producer.id)

  if (updateError) {
    return { ok: false, error: updateError.message }
  }

  const previousTracking = row.tracking_number?.trim() ?? ''
  const enteredTracking = trackingValue?.trim() ?? ''

  // LOW-6: record tracking changes in the audit log.
  if (session.email && enteredTracking !== previousTracking) {
    await logAuditEvent({
      action: enteredTracking
        ? 'producer.order_item.tracking_updated'
        : 'producer.order_item.tracking_cleared',
      actorEmail: session.email,
      entityType: 'order_item',
      entityId: row.id,
      metadata: {
        producer_id: session.producer.id,
        order_id: row.order_id,
        previous_tracking: previousTracking || null,
        next_tracking: enteredTracking || null,
      },
    })
  }
  if (enteredTracking && enteredTracking !== previousTracking) {
    try {
      const { data: orderData } = await admin
        .from('orders')
        .select('id, customer_email, customer_name')
        .eq('id', row.order_id)
        .maybeSingle()
      const order = orderData as Pick<OrdersRow, 'id' | 'customer_email' | 'customer_name'> | null
      if (order?.customer_email) {
        await sendBuyerTrackingUpdate({
          to: order.customer_email,
          customerName: order.customer_name ?? 'Customer',
          orderId: order.id,
          trackingNumber: enteredTracking,
        })
      }
    } catch (error) {
      console.error('[email] tracking update failed', error)
    }
  }

  await syncOrderStatusFromLineItems(row.order_id)

  revalidatePath('/producer/orders')
  revalidatePath('/admin/orders')
  return { ok: true } as const
}
