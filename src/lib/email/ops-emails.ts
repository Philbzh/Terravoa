import { Resend } from 'resend'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { escapeHtml } from '@/lib/email/escape-html'

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return
  try {
    const resend = new Resend(key)
    await resend.emails.send({ from: emailFrom(), to, subject, html })
  } catch (e) {
    console.error('[ops-email] send failed', e)
  }
}

export async function sendProducerFulfillmentReminder(opts: {
  to: string
  producerName: string
  delayedCount: number
}) {
  await send(
    opts.to,
    `${SITE_NAME} — Shipping update needed for ${opts.delayedCount} order item(s)`,
    `<div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:20px;color:#182a1b;margin:0 0 14px;">
        Hello ${escapeHtml(opts.producerName)},
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 10px;">
        You currently have <strong>${opts.delayedCount}</strong> order item(s) without tracking updates.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 16px;">
        As Terravoa is producer-direct, timely shipping updates are essential for customer trust.
      </p>
      <a href="${SITE_URL}/producer/orders" style="display:inline-block;background:#182a1b;color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:10px 22px;border-radius:99px;">
        Update shipping now
      </a>
    </div>`,
  )
}

export async function sendAdminOpsDigest(opts: {
  to: string
  delayed24h: number
  delayed48h: number
  delayed72h: number
  returnBacklog24h: number
  planBacklog48h: number
}) {
  await send(
    opts.to,
    `[${SITE_NAME}] Ops digest — producer-direct fulfillment`,
    `<div style="max-width:540px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:20px;color:#182a1b;margin:0 0 14px;">
        Operations digest
      </p>
      <ul style="margin:0 0 18px 18px;padding:0;font-size:14px;line-height:1.8;color:#333;">
        <li>Untracked producer items >=24h: <strong>${opts.delayed24h}</strong></li>
        <li>Untracked producer items >=48h: <strong>${opts.delayed48h}</strong></li>
        <li>Untracked producer items >=72h: <strong>${opts.delayed72h}</strong></li>
        <li>Pending return requests >=24h: <strong>${opts.returnBacklog24h}</strong></li>
        <li>Pending plan requests >=48h: <strong>${opts.planBacklog48h}</strong></li>
      </ul>
      <a href="${SITE_URL}/admin/command-center" style="display:inline-block;background:#182a1b;color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:10px 22px;border-radius:99px;">
        Open Command Center
      </a>
    </div>`,
  )
}
