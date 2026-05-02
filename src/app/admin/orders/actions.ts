'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import Stripe from 'stripe'
import { sendBuyerRefundUpdate } from '@/lib/email/order-emails'
import {
  ORDER_FULFILLMENT_STATUSES,
  ORDER_PAYMENT_STATUSES,
  ORDER_PAYOUT_STATUSES,
  type OrderFulfillmentStatus,
  type OrderPaymentStatus,
  type OrderPayoutStatus,
  toLegacyOrderStatus,
} from '@/lib/order-workflow'

type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered'

async function enqueueLifecycleEmailJobs(orderId: string) {
  const admin = createAdminClient() as any
  const { data: order } = await admin
    .from('orders')
    .select('id, customer_email, customer_name, delivered_at')
    .eq('id', orderId)
    .maybeSingle()

  if (!order?.customer_email) return
  const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : new Date()
  const reviewAt = new Date(deliveredAt.getTime() + 3 * 24 * 60 * 60 * 1000)
  const winbackAt = new Date(deliveredAt.getTime() + 60 * 24 * 60 * 60 * 1000)

  const jobs: { kind: 'review_request' | 'winback_60d'; send_at: Date }[] = [
    { kind: 'review_request', send_at: reviewAt },
    { kind: 'winback_60d', send_at: winbackAt },
  ]

  for (const job of jobs) {
    const { data: existing } = await admin
      .from('email_jobs')
      .select('id')
      .eq('order_id', orderId)
      .eq('kind', job.kind)
      .is('sent_at', null)
      .maybeSingle()
    if (existing?.id) continue

    await admin.from('email_jobs').insert({
      kind: job.kind,
      order_id: orderId,
      customer_email: order.customer_email,
      payload: {
        customer_name: order.customer_name ?? 'Customer',
      },
      send_at: job.send_at.toISOString(),
    })
  }
}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  await assertAdminForServerAction()

  const admin = createAdminClient() as any
  const legacyToFulfillment: Record<OrderStatus, OrderFulfillmentStatus> = {
    new: 'awaiting_producer_ack',
    processing: 'acked',
    shipped: 'shipped',
    delivered: 'delivered',
  }
  const { error } = await admin
    .from('orders')
    .update({
      status,
      fulfillment_status: legacyToFulfillment[status],
      ...(status === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderId)

  if (error) throw new Error(error.message)

  await logAdminAction({
    action: `order.${status}`,
    entityType: 'order',
    entityId: orderId,
    metadata: { status },
  })

  if (status === 'delivered') {
    await enqueueLifecycleEmailJobs(orderId)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

export async function updateOrderWorkflow(formData: FormData) {
  await assertAdminForServerAction()

  const orderId = String(formData.get('order_id') ?? '').trim()
  const fulfillmentStatus = String(formData.get('fulfillment_status') ?? '').trim() as OrderFulfillmentStatus
  const paymentStatus = String(formData.get('payment_status') ?? '').trim() as OrderPaymentStatus
  const payoutStatus = String(formData.get('payout_status') ?? '').trim() as OrderPayoutStatus

  if (!orderId) throw new Error('Missing order id')
  if (!ORDER_FULFILLMENT_STATUSES.includes(fulfillmentStatus)) throw new Error('Invalid fulfillment status')
  if (!ORDER_PAYMENT_STATUSES.includes(paymentStatus)) throw new Error('Invalid payment status')
  if (!ORDER_PAYOUT_STATUSES.includes(payoutStatus)) throw new Error('Invalid payout status')

  const patch: Record<string, unknown> = {
    fulfillment_status: fulfillmentStatus,
    payment_status: paymentStatus,
    payout_status: payoutStatus,
    status: toLegacyOrderStatus(fulfillmentStatus),
  }

  if (fulfillmentStatus === 'shipped') patch.shipped_at = new Date().toISOString()
  if (fulfillmentStatus === 'delivered') patch.delivered_at = new Date().toISOString()
  if (fulfillmentStatus === 'closed') patch.closed_at = new Date().toISOString()

  const admin = createAdminClient() as any
  const { error } = await admin.from('orders').update(patch).eq('id', orderId)
  if (error) throw new Error(error.message)

  await logAdminAction({
    action: 'order.workflow_updated',
    entityType: 'order',
    entityId: orderId,
    metadata: {
      fulfillment_status: fulfillmentStatus,
      payment_status: paymentStatus,
      payout_status: payoutStatus,
    },
  })

  if (fulfillmentStatus === 'delivered') {
    await enqueueLifecycleEmailJobs(orderId)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

async function getStripePaymentIntentId(orderStripePaymentId: string): Promise<string> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) throw new Error('Missing STRIPE_SECRET_KEY')
  const stripe = new Stripe(stripeSecret)
  const session = await stripe.checkout.sessions.retrieve(orderStripePaymentId)
  const paymentIntent = session.payment_intent
  if (!paymentIntent) throw new Error('No payment intent on checkout session')
  return typeof paymentIntent === 'string' ? paymentIntent : paymentIntent.id
}

export async function refundOrder(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  if (!orderId) throw new Error('Missing order id')

  const admin = createAdminClient() as any
  const { data: orderData, error: orderErr } = await admin
    .from('orders')
    .select('id, customer_email, customer_name, stripe_payment_id, total')
    .eq('id', orderId)
    .maybeSingle()
  if (orderErr || !orderData) throw new Error(orderErr?.message ?? 'Order not found')
  if (!orderData.stripe_payment_id) throw new Error('Order has no Stripe payment reference')

  const paymentIntentId = await getStripePaymentIntentId(orderData.stripe_payment_id)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: Number(orderData.total),
    reason: 'requested_by_customer',
  })

  const { data: orderItems } = await admin
    .from('order_items')
    .select('id, price, quantity')
    .eq('order_id', orderId)

  for (const item of (orderItems ?? []) as { id: string; price: number; quantity: number }[]) {
    await admin
      .from('order_items')
      .update({
        status: 'refunded',
        refunded_cents: Number(item.price) * Number(item.quantity),
      })
      .eq('id', item.id)
  }

  const { error: updErr } = await admin
    .from('orders')
    .update({
      payment_status: 'refunded',
      fulfillment_status: 'refunded',
      status: 'shipped',
      payout_status: 'held',
      closed_at: new Date().toISOString(),
    })
    .eq('id', orderId)
  if (updErr) throw new Error(updErr.message)

  await logAdminAction({
    action: 'order.refund.full',
    entityType: 'order',
    entityId: orderId,
    metadata: { amount_cents: Number(orderData.total) },
  })

  try {
    await sendBuyerRefundUpdate({
      to: orderData.customer_email,
      customerName: orderData.customer_name,
      orderId,
      amountCents: Number(orderData.total),
      note: 'The full order amount has been refunded.',
    })
  } catch (e) {
    console.error('[email] refund notification failed', e)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}

export async function refundOrderItem(formData: FormData) {
  await assertAdminForServerAction()
  const orderId = String(formData.get('order_id') ?? '').trim()
  const itemId = String(formData.get('item_id') ?? '').trim()
  if (!orderId || !itemId) throw new Error('Missing order/item id')

  const admin = createAdminClient() as any
  const { data: orderData, error: orderErr } = await admin
    .from('orders')
    .select('id, customer_email, customer_name, stripe_payment_id')
    .eq('id', orderId)
    .maybeSingle()
  if (orderErr || !orderData) throw new Error(orderErr?.message ?? 'Order not found')
  if (!orderData.stripe_payment_id) throw new Error('Order has no Stripe payment reference')

  const { data: itemData, error: itemErr } = await admin
    .from('order_items')
    .select('id, price, quantity, refunded_cents')
    .eq('id', itemId)
    .eq('order_id', orderId)
    .maybeSingle()
  if (itemErr || !itemData) throw new Error(itemErr?.message ?? 'Order item not found')

  const lineTotal = Number(itemData.price) * Number(itemData.quantity)
  const alreadyRefunded = Number(itemData.refunded_cents ?? 0)
  const refundable = Math.max(0, lineTotal - alreadyRefunded)
  if (refundable < 1) throw new Error('This line item is already fully refunded')

  const paymentIntentId = await getStripePaymentIntentId(orderData.stripe_payment_id)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: refundable,
    reason: 'requested_by_customer',
  })

  const { error: itemUpdateErr } = await admin
    .from('order_items')
    .update({
      refunded_cents: lineTotal,
      status: 'refunded',
    })
    .eq('id', itemId)
  if (itemUpdateErr) throw new Error(itemUpdateErr.message)

  const { data: itemStatuses } = await admin
    .from('order_items')
    .select('id, status, refunded_cents, price, quantity')
    .eq('order_id', orderId)
  const lines = (itemStatuses ?? []) as {
    id: string
    status: string
    refunded_cents: number | null
    price: number
    quantity: number
  }[]
  const refundedSum = lines.reduce((sum, l) => sum + Number(l.refunded_cents ?? 0), 0)
  const fullyRefunded = lines.length > 0 && lines.every((l) => Number(l.refunded_cents ?? 0) >= l.price * l.quantity)

  const { error: orderUpdateErr } = await admin
    .from('orders')
    .update({
      payment_status: fullyRefunded ? 'refunded' : 'partially_refunded',
      fulfillment_status: fullyRefunded ? 'refunded' : 'partially_unavailable',
      status: fullyRefunded ? 'shipped' : 'processing',
      payout_status: 'held',
      ...(fullyRefunded ? { closed_at: new Date().toISOString() } : {}),
    })
    .eq('id', orderId)
  if (orderUpdateErr) throw new Error(orderUpdateErr.message)

  await logAdminAction({
    action: 'order.refund.line',
    entityType: 'order',
    entityId: orderId,
    metadata: {
      item_id: itemId,
      amount_cents: refundable,
      refunded_total_cents: refundedSum,
    },
  })

  try {
    await sendBuyerRefundUpdate({
      to: orderData.customer_email,
      customerName: orderData.customer_name,
      orderId,
      amountCents: refundable,
      note: 'A partial refund has been issued for one unavailable item.',
    })
  } catch (e) {
    console.error('[email] partial refund notification failed', e)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
}
