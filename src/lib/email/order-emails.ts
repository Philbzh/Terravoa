import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { absoluteUrl } from '@/lib/site-url'
import { escapeHtml } from '@/lib/email/escape-html'
import { createAdminClient } from '@/lib/supabase/admin'
import { resolveLocale, buyerStrings, producerStrings } from '@/lib/email/i18n'

export type OrderEmailLine = {
  productName: string
  quantity: number
  unitCents: number
  lineTotalCents: number
  producerId: string
  producerName: string
}

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`
}

function emailFrom() {
  return (
    process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
  )
}

async function sendHtmlEmail(opts: {
  to: string
  subject: string
  html: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set; skipping:', opts.subject)
    return { sent: false as const, reason: 'no_api_key' as const }
  }

  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })

  if (error) {
    console.error('[email] Resend error:', error.message)
    return { sent: false as const, reason: 'resend_error' as const }
  }

  return { sent: true as const }
}

export async function sendBuyerOrderConfirmation(
  opts: {
    to: string
    customerName: string
    orderId: string
    lines: OrderEmailLine[]
    totalCents: number
  },
  rawLocale?: string | null,
) {
  const locale = resolveLocale(rawLocale)
  const t = buyerStrings[locale]

  const name = escapeHtml(opts.customerName || 'there')
  const rows = opts.lines
    .map(
      (l) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;font-family:Georgia,serif;font-size:14px;">
        ${escapeHtml(l.productName)}
        <div style="font-size:12px;color:#666;margin-top:4px;">${escapeHtml(l.producerName)}</div>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;font-family:sans-serif;font-size:13px;">${l.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-family:sans-serif;font-size:13px;">${formatMoney(l.lineTotalCents)}</td>
    </tr>`,
    )
    .join('')

  const orderRef = escapeHtml(opts.orderId.slice(0, 8))

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">${escapeHtml(t.greeting(name))}</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      ${escapeHtml(t.intro)}
    </p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.item)}</th>
          <th style="text-align:center;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.qty)}</th>
          <th style="text-align:right;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.total)}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-family:Georgia,serif;font-size:16px;color:#1a1a1a;">
      ${escapeHtml(t.totalPaid)}: <strong>${formatMoney(opts.totalCents)}</strong>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;">
      ${escapeHtml(t.orderRef)}: ${orderRef}…
    </p>
    <p style="margin-top:32px;">
      <a href="${absoluteUrl('/collection')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">${escapeHtml(t.cta)}</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:24px;">${escapeHtml(t.signoff)}</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: t.subject(orderRef),
    html,
  })
}

export async function sendProducerNewOrderEmail(
  opts: {
    to: string
    producerName: string
    orderId: string
    lines: Pick<OrderEmailLine, 'productName' | 'quantity' | 'lineTotalCents'>[]
    customerName: string
    shipToSummary: string
  },
  rawLocale?: string | null,
) {
  const locale = resolveLocale(rawLocale)
  const t = producerStrings[locale]

  const rows = opts.lines
    .map(
      (l) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;font-family:Georgia,serif;font-size:14px;">${escapeHtml(l.productName)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;font-family:sans-serif;font-size:13px;">${l.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-family:sans-serif;font-size:13px;">${formatMoney(l.lineTotalCents)}</td>
    </tr>`,
    )
    .join('')

  const orderRef = escapeHtml(opts.orderId.slice(0, 8))
  const producerName = escapeHtml(opts.producerName)

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">${escapeHtml(t.greeting(opts.producerName || 'Producer'))}</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      ${escapeHtml(t.intro)}
    </p>
    <p style="font-family:sans-serif;font-size:13px;color:#333;"><strong>${escapeHtml(t.shipTo)}:</strong> ${escapeHtml(opts.customerName)}</p>
    <p style="font-family:sans-serif;font-size:13px;color:#555;line-height:1.5;">${escapeHtml(opts.shipToSummary)}</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.product)}</th>
          <th style="text-align:center;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.qty)}</th>
          <th style="text-align:right;padding:8px 12px;font-family:sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#666;">${escapeHtml(t.tableHeaders.total)}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="font-family:sans-serif;font-size:12px;color:#888;">${escapeHtml(t.orderRef)}: ${orderRef}…</p>
    <p style="margin-top:24px;">
      <a href="${absoluteUrl('/producer/orders')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">${escapeHtml(t.cta)}</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">${escapeHtml(t.signoff)}</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: t.subject(producerName),
    html,
  })
}

export async function sendBuyerTrackingUpdate(opts: {
  to: string
  customerName: string
  orderId: string
  trackingNumber: string
}) {
  const name = escapeHtml(opts.customerName || 'there')
  const orderRef = escapeHtml(opts.orderId.slice(0, 8))
  const tracking = escapeHtml(opts.trackingNumber)
  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">Hello ${name},</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      A producer has updated your shipment information.
    </p>
    <p style="font-family:sans-serif;font-size:14px;color:#1a1a1a;">
      <strong>Order</strong>: ${orderRef}…<br />
      <strong>Tracking number</strong>: <span style="font-family:monospace">${tracking}</span>
    </p>
    <p style="margin-top:24px;">
      <a href="${absoluteUrl('/account/orders')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">View your orders</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">${escapeHtml(SITE_NAME)} Team</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: `Tracking update for your order ${orderRef}…`,
    html,
  })
}

export async function sendBuyerRefundUpdate(opts: {
  to: string
  customerName: string
  orderId: string
  amountCents: number
  note?: string
}) {
  const name = escapeHtml(opts.customerName || 'there')
  const orderRef = escapeHtml(opts.orderId.slice(0, 8))
  const amount = formatMoney(opts.amountCents)
  const note = opts.note ? `<p style="font-family:sans-serif;font-size:13px;color:#555;">${escapeHtml(opts.note)}</p>` : ''
  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">Hello ${name},</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      We have issued a refund for your order.
    </p>
    <p style="font-family:sans-serif;font-size:14px;color:#1a1a1a;">
      <strong>Order</strong>: ${orderRef}…<br />
      <strong>Refund amount</strong>: ${amount}
    </p>
    ${note}
    <p style="margin-top:24px;">
      <a href="${absoluteUrl('/account/orders')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">View your orders</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">${escapeHtml(SITE_NAME)} Team</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: `Refund processed for order ${orderRef}…`,
    html,
  })
}

export async function sendBuyerReviewRequest(opts: {
  to: string
  customerName: string
  orderId: string
}) {
  const name = escapeHtml(opts.customerName || 'there')
  const orderRef = escapeHtml(opts.orderId.slice(0, 8))
  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">Hello ${name},</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      We hope your order arrived well. Your feedback helps other customers and supports independent producers.
    </p>
    <p style="font-family:sans-serif;font-size:14px;color:#1a1a1a;">
      <strong>Order</strong>: ${orderRef}…
    </p>
    <p style="margin-top:24px;">
      <a href="${absoluteUrl('/account/orders')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">Review your recent order</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">${escapeHtml(SITE_NAME)} Team</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: `How was your order ${orderRef}…?`,
    html,
  })
}

export async function sendBuyerWinbackReminder(opts: {
  to: string
  customerName: string
}) {
  const name = escapeHtml(opts.customerName || 'there')
  const html = `
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;">Hello ${name},</p>
    <p style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#444;">
      It has been a while since your last order. We have added new seasonal selections from our producers that you may enjoy.
    </p>
    <p style="margin-top:24px;">
      <a href="${absoluteUrl('/collection')}" style="font-family:sans-serif;font-size:13px;color:#2d5a4a;text-decoration:underline;">Discover what is new</a>
    </p>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">${escapeHtml(SITE_NAME)} Team</p>
  </div>`

  return sendHtmlEmail({
    to: opts.to,
    subject: `A quick update from ${escapeHtml(SITE_NAME)}`,
    html,
  })
}

/** Ship-to one line for producer email (plain text friendly). */
function shipToOneLine(addr: Record<string, string>): string {
  const parts = [
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(' '),
    addr.state,
    addr.country,
  ]
    .filter(Boolean)
    .map((p) => String(p).trim())
    .filter(Boolean)
  return parts.join(', ') || addr.name || '—'
}

/**
 * Buyer confirmation + one email per producer with linked auth user.
 * Failures are logged; never throws.
 */
export async function notifyOrderEmails(opts: {
  customerEmail: string
  customerName: string
  orderId: string
  shippingAddress: Record<string, string>
  lines: OrderEmailLine[]
  totalCents: number
  customerLocale?: string | null
}) {
  try {
    await sendBuyerOrderConfirmation(
      {
        to: opts.customerEmail,
        customerName: opts.customerName,
        orderId: opts.orderId,
        lines: opts.lines,
        totalCents: opts.totalCents,
      },
      opts.customerLocale,
    )
  } catch (e) {
    console.error('[email] buyer confirmation failed', e)
  }

  const byProducer = new Map<string, OrderEmailLine[]>()
  for (const line of opts.lines) {
    const list = byProducer.get(line.producerId) ?? []
    list.push(line)
    byProducer.set(line.producerId, list)
  }

  const admin = createAdminClient() as any
  const shipSummary = shipToOneLine(opts.shippingAddress)

  for (const [producerId, plines] of byProducer) {
    try {
      const { data: producer } = await admin
        .from('producers')
        .select('id, name, user_id, preferred_language')
        .eq('id', producerId)
        .maybeSingle()

      if (!producer?.user_id) {
        console.warn('[email] producer has no user_id; skip producer email', producerId)
        continue
      }

      const { data: authData, error: authErr } =
        await admin.auth.admin.getUserById(producer.user_id)

      if (authErr || !authData?.user?.email) {
        console.warn('[email] no auth email for producer', producerId, authErr?.message)
        continue
      }

      await sendProducerNewOrderEmail(
        {
          to: authData.user.email,
          producerName: producer.name ?? 'Producer',
          orderId: opts.orderId,
          lines: plines.map((l) => ({
            productName: l.productName,
            quantity: l.quantity,
            lineTotalCents: l.lineTotalCents,
          })),
          customerName: opts.customerName,
          shipToSummary: shipSummary,
        },
        producer.preferred_language,
      )
    } catch (e) {
      console.error('[email] producer notification failed', producerId, e)
    }
  }
}
