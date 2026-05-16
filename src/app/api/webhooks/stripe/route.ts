import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyOrderEmails } from '@/lib/email/order-emails'
import type { OrdersInsert } from '@/lib/supabase/types'
import { getEffectiveCommissionPct } from '@/lib/partnership-plans'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function parseCartLines(raw: string): { slug: string; qty: number }[] {
  return raw.split('|').filter(Boolean).map((segment) => {
    const sep = segment.indexOf('::')
    if (sep === -1) {
      throw new Error('Invalid cart_lines segment')
    }
    const slug = segment.slice(0, sep)
    const qty = Number.parseInt(segment.slice(sep + 2), 10)
    if (!slug || !Number.isFinite(qty) || qty < 1 || qty > 99) {
      throw new Error('Invalid cart line')
    }
    return { slug, qty }
  })
}

function shippingToRecord(
  session: Stripe.Checkout.Session,
): Record<string, string> {
  const cust = session.customer_details
  const ship = session.collected_information?.shipping_details
  const phone = cust?.phone ?? ''
  const email = cust?.email ?? session.customer_email ?? ''
  const fallbackName =
    ship?.name ??
    cust?.name ??
    session.collected_information?.individual_name ??
    ''

  if (!ship?.address) {
    return {
      name: fallbackName,
      email,
      phone,
    }
  }
  const a = ship.address
  return {
    name: ship.name ?? fallbackName,
    email,
    phone,
    line1: a.line1 ?? '',
    line2: a.line2 ?? '',
    city: a.city ?? '',
    state: a.state ?? '',
    postal_code: a.postal_code ?? '',
    country: a.country ?? '',
  }
}

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret || !webhookSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const body = await request.text()
  const stripe = new Stripe(stripeSecret)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (e) {
    console.error('Stripe webhook signature verification failed', e)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle refund events
  if (event.type === 'charge.refunded') {
    return handleChargeRefunded(event, stripe)
  }

  // Handle failed payment events
  if (event.type === 'payment_intent.payment_failed') {
    return handlePaymentFailed(event)
  }

  // Handle dispute events
  if (event.type === 'charge.dispute.created') {
    return handleDisputeCreated(event)
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (session.mode !== 'payment') {
    return NextResponse.json({ received: true })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ received: true, skipped: 'not_paid' })
  }

  const sessionId = session.id
  const admin = createAdminClient() as any

  const { data: existing } = await admin
    .from('orders')
    .select('id')
    .eq('stripe_payment_id', sessionId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  const full = await stripe.checkout.sessions.retrieve(sessionId)

  const cartLinesRaw = full.metadata?.cart_lines
  if (!cartLinesRaw) {
    console.error('checkout.session.completed missing cart_lines metadata', sessionId)
    return NextResponse.json({ error: 'Missing cart_lines' }, { status: 400 })
  }

  let parsedLines: { slug: string; qty: number }[]
  try {
    parsedLines = parseCartLines(cartLinesRaw)
  } catch {
    console.error('Invalid cart_lines', sessionId, cartLinesRaw)
    return NextResponse.json({ error: 'Invalid cart_lines' }, { status: 400 })
  }

  const stripeLines = await stripe.checkout.sessions.listLineItems(sessionId, {
    limit: 100,
  })

  // Gift wrap adds an extra Stripe line item — filter it out before comparing
  const isGiftWrap = full.metadata?.gift_wrap === 'true'
  const productLines = isGiftWrap
    ? stripeLines.data.filter((l) => {
        const name = (l as any).description ?? (l.price?.product as any)?.name ?? ''
        return name !== 'Gift wrapping'
      })
    : stripeLines.data

  if (productLines.length !== parsedLines.length) {
    console.error(
      'Stripe line items count mismatch',
      sessionId,
      productLines.length,
      parsedLines.length,
    )
    return NextResponse.json({ error: 'Line item mismatch' }, { status: 400 })
  }

  const customerEmail =
    full.customer_details?.email ?? full.customer_email ?? ''
  const customerName =
    full.collected_information?.shipping_details?.name ??
    full.customer_details?.name ??
    full.collected_information?.individual_name ??
    'Customer'

  if (!customerEmail) {
    console.error('No customer email on session', sessionId)
    return NextResponse.json({ error: 'No customer email' }, { status: 400 })
  }

  const amountTotal = full.amount_total ?? 0
  if (amountTotal < 1) {
    return NextResponse.json({ received: true, skipped: 'zero_total' })
  }

  const shippingAddress = shippingToRecord(full)

  // ── Gift fields from metadata ────────────────────────────────────────────
  const isGift       = full.metadata?.is_gift === 'true'
  const giftRecipient = full.metadata?.gift_recipient?.trim() || null
  const giftMessage   = full.metadata?.gift_message?.trim() || null
  const giftWrap      = full.metadata?.gift_wrap === 'true'

  const orderInsert: OrdersInsert = {
    customer_email: customerEmail,
    customer_name: customerName,
    shipping_address: shippingAddress,
    status: 'new',
    fulfillment_status: 'awaiting_producer_ack',
    payment_status: 'paid',
    payout_status: 'not_due',
    total: amountTotal,
    stripe_payment_id: sessionId,
    ...(isGift && {
      is_gift:        true,
      gift_recipient: giftRecipient,
      gift_message:   giftMessage,
      gift_wrap:      giftWrap,
    }),
  }

  let orderRow: { id: string } | null = null
  let orderErr: { message?: string; code?: string } | null = null
  {
    const attempt = await admin.from('orders').insert(orderInsert as any).select('id').single()
    orderRow = attempt.data as { id: string } | null
    orderErr = attempt.error
  }

  // Fallback: schema may not have the new workflow columns yet
  if (orderErr?.message?.includes('fulfillment_status') || orderErr?.message?.includes('payment_status') || orderErr?.message?.includes('payout_status')) {
    const fallbackInsert: OrdersInsert = {
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
      status: 'new',
      total: amountTotal,
      stripe_payment_id: sessionId,
    } as OrdersInsert
    const fallback = await admin.from('orders').insert(fallbackInsert as any).select('id').single()
    orderRow = fallback.data as { id: string } | null
    orderErr = fallback.error
  }

  // Idempotency safety-net: the unique constraint on stripe_payment_id catches
  // two simultaneous webhooks that both passed the duplicate-check above.
  // PostgreSQL error code 23505 = unique_violation.
  if (orderErr?.code === '23505') {
    console.warn('[webhook] duplicate order insert caught by unique constraint', sessionId)
    return NextResponse.json({ received: true, duplicate: true })
  }

  if (orderErr || !orderRow?.id) {
    console.error('orders insert failed', orderErr?.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const orderId = orderRow.id as string

  const itemRows: {
    order_id: string
    product_id: string
    producer_id: string
    quantity: number
    price: number
    status: string
    commission_rate_pct: number
    commission_cents: number
  }[] = []

  const emailLinesDraft: {
    productName: string
    quantity: number
    unitCents: number
    lineTotalCents: number
    producerId: string
  }[] = []

  for (let i = 0; i < parsedLines.length; i++) {
    const { slug, qty } = parsedLines[i]
    const stripeLine = productLines[i]

    if (stripeLine.quantity !== qty) {
      await admin.from('orders').delete().eq('id', orderId)
      console.error('Quantity mismatch', sessionId, i, stripeLine.quantity, qty)
      return NextResponse.json({ error: 'Quantity mismatch' }, { status: 400 })
    }

    const { data: product, error: pErr } = await admin
      .from('products')
      .select('id, producer_id, price, status, name, producers(plan, commission_rate_pct)')
      .eq('slug', slug)
      .eq('status', 'approved')
      .maybeSingle()

    if (pErr || !product) {
      await admin.from('orders').delete().eq('id', orderId)
      console.error('Product not found or not approved', slug, pErr?.message)
      return NextResponse.json({ error: 'Product not found' }, { status: 400 })
    }

    // ── CRIT-3 fix: DB price is the authoritative unit amount ────────────────
    // We never trust Stripe's reported `unit_amount` as canonical — it was
    // supplied to Stripe during session creation and could have been tampered
    // with despite the CRIT-2 guard (defence in depth). The DB value is the
    // single source of truth for what we bill and what producers earn.
    const dbUnitAmount = (product as { price: number }).price
    if (typeof dbUnitAmount !== 'number' || dbUnitAmount < 1) {
      await admin.from('orders').delete().eq('id', orderId)
      console.error('[webhook] DB product has invalid price', slug, dbUnitAmount)
      return NextResponse.json({ error: 'Invalid product price' }, { status: 500 })
    }

    // Defence-in-depth: surface any Stripe/DB divergence (stale cart, tampered
    // session, or incident) and refuse to record the order at a wrong price.
    const stripeUnitAmount =
      stripeLine.quantity && stripeLine.amount_total != null
        ? Math.round(stripeLine.amount_total / stripeLine.quantity)
        : typeof stripeLine.price === 'object' &&
            stripeLine.price &&
            'unit_amount' in stripeLine.price &&
            stripeLine.price.unit_amount != null
          ? stripeLine.price.unit_amount
          : null

    if (stripeUnitAmount != null && stripeUnitAmount !== dbUnitAmount) {
      await admin.from('orders').delete().eq('id', orderId)
      console.error(
        '[webhook] price mismatch — stripe vs db',
        sessionId,
        slug,
        { stripe: stripeUnitAmount, db: dbUnitAmount },
      )
      return NextResponse.json({ error: 'Price mismatch' }, { status: 400 })
    }

    const unitAmount = dbUnitAmount

    const producer = (product as any).producers
    const commissionRatePct = getEffectiveCommissionPct(
      producer?.plan ?? null,
      producer?.commission_rate_pct ?? null,
    )
    const commissionCents = Math.round(unitAmount * qty * commissionRatePct / 100)

    itemRows.push({
      order_id: orderId,
      product_id: product.id,
      producer_id: product.producer_id,
      quantity: qty,
      price: unitAmount,
      status: 'pending',
      commission_rate_pct: commissionRatePct,
      commission_cents: commissionCents,
    })

    emailLinesDraft.push({
      productName: (product as { name: string }).name,
      quantity: qty,
      unitCents: unitAmount,
      lineTotalCents: unitAmount * qty,
      producerId: product.producer_id,
    })
  }

  let { error: itemsErr } = await admin.from('order_items').insert(itemRows as any)
  if (itemsErr?.message?.includes('status')) {
    const fallbackRows = itemRows.map(({ status: _status, ...rest }) => rest)
    const fallback = await admin.from('order_items').insert(fallbackRows as any)
    itemsErr = fallback.error
  }

  if (itemsErr) {
    await admin.from('orders').delete().eq('id', orderId)
    console.error('order_items insert failed', itemsErr.message)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  // Atomically increment coupon use_count only after confirmed payment.
  const couponId = full.metadata?.coupon_id
  if (couponId) {
    await admin.rpc('increment_coupon_use_count', { coupon_uuid: couponId })
  }

  // Mark abandoned cart as recovered
  if (customerEmail) {
    await admin
      .from('abandoned_carts')
      .update({ recovered_at: new Date().toISOString() })
      .eq('email', customerEmail)
      .is('recovered_at', null)
  }

  // Atomically decrement stock for each purchased product.
  for (const { slug, qty } of parsedLines) {
    await admin.rpc('decrement_product_stock', { product_slug: slug, qty })
  }

  const producerIds = [...new Set(emailLinesDraft.map((l) => l.producerId))]
  const { data: producerRows } = await admin
    .from('producers')
    .select('id, name')
    .in('id', producerIds)

  const nameByProducer = new Map<string, string>(
    (producerRows ?? []).map((p: { id: string; name: string }) => [p.id, p.name]),
  )

  try {
    await notifyOrderEmails({
      customerEmail,
      customerName,
      orderId,
      shippingAddress,
      lines: emailLinesDraft.map((l) => ({
        ...l,
        producerName: nameByProducer.get(l.producerId) ?? 'Producer',
      })) satisfies import('@/lib/email/order-emails').OrderEmailLine[],
      totalCents: amountTotal,
      customerLocale: full.metadata?.locale ?? 'en',
    })
  } catch (e) {
    console.error('[webhook] notifyOrderEmails failed', e)
  }

  return NextResponse.json({ received: true, order_id: orderId })
}

// ── Refund handler ──────────────────────────────────────────────────────────

async function handleChargeRefunded(event: Stripe.Event, stripe: Stripe) {
  const charge = event.data.object as Stripe.Charge
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id

  if (!paymentIntentId) {
    return NextResponse.json({ received: true, skipped: 'no_pi' })
  }

  // Find the checkout session associated with this payment intent
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntentId,
    limit: 1,
  })

  const sessionId = sessions.data[0]?.id
  if (!sessionId) {
    return NextResponse.json({ received: true, skipped: 'no_session' })
  }

  const admin = createAdminClient() as any
  const isFullRefund = charge.refunded

  await admin
    .from('orders')
    .update({
      payment_status: isFullRefund ? 'refunded' : 'partially_refunded',
    })
    .eq('stripe_payment_id', sessionId)

  console.info(
    `[webhook] charge.refunded: session=${sessionId} full=${isFullRefund} amount=${charge.amount_refunded}`,
  )

  return NextResponse.json({ received: true, refunded: true })
}

// ── Failed payment handler ──────────────────────────────────────────────────

async function handlePaymentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent
  const lastError = paymentIntent.last_payment_error

  console.warn(
    `[webhook] payment_intent.payment_failed: pi=${paymentIntent.id} error=${lastError?.message ?? 'unknown'}`,
  )

  // No order exists yet for failed payments (order is only created on success)
  // Log for ops monitoring — could trigger an alert email in the future
  return NextResponse.json({ received: true, failed: true })
}

// ── Dispute handler ─────────────────────────────────────────────────────────

async function handleDisputeCreated(event: Stripe.Event) {
  const dispute = event.data.object as Stripe.Dispute
  const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge?.id

  console.error(
    `[webhook] charge.dispute.created: dispute=${dispute.id} charge=${chargeId} amount=${dispute.amount} reason=${dispute.reason}`,
  )

  // Notify admin via ops email
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL?.trim()
  if (adminEmail) {
    const { sendAdminOpsDigest } = await import('@/lib/email/ops-emails')
    try {
      await sendAdminOpsDigest({
        to: adminEmail,
        delayed24h: 0,
        delayed48h: 0,
        delayed72h: 0,
        returnBacklog24h: 0,
        planBacklog48h: 0,
        disputeAlert: `Dispute ${dispute.id} opened for €${(dispute.amount / 100).toFixed(2)} — reason: ${dispute.reason}`,
      })
    } catch (e) {
      console.error('[webhook] dispute alert email failed', e)
    }
  }

  return NextResponse.json({ received: true, dispute: true })
}
