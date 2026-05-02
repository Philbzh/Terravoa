import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { escapeHtml } from '@/lib/email/escape-html'

export type ReturnEmailOpts = {
  customerEmail: string
  customerName: string
  orderId: string
  reason: string
  description: string
  returnRequestId: string
}

const REASON_LABELS: Record<string, string> = {
  withdrawal:  '14-day right of withdrawal',
  damaged:     'Item arrived damaged',
  wrong_item:  'Wrong item received',
  quality:     'Quality issue',
}

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

async function sendHtml(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — skipping:', subject)
    return
  }
  const resend = new Resend(key)
  const { error } = await resend.emails.send({ from: emailFrom(), to, subject, html })
  if (error) console.error('[email] Resend error:', error.message)
}

// ── Customer confirmation ────────────────────────────────────────────────────
export async function sendReturnRequestConfirmation(opts: ReturnEmailOpts) {
  const reasonLabel = REASON_LABELS[opts.reason] ?? opts.reason

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1c1a;padding:32px 24px;background:#faf9f6">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#944925;margin:0 0 28px;font-family:Manrope,sans-serif">
        ${escapeHtml(SITE_NAME)} · Return Request
      </p>
      <h1 style="font-size:24px;font-weight:400;margin:0 0 16px;color:#182a1b;line-height:1.2">
        We've received your return request
      </h1>
      <p style="font-size:15px;line-height:1.7;margin:0 0 28px;color:#434842;font-family:Manrope,sans-serif">
        Dear ${escapeHtml(opts.customerName)},<br><br>
        Thank you for reaching out. We've received your return request and will review it
        within 2 business days. You'll receive a follow-up email with return instructions.
      </p>

      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;margin-bottom:28px;border:1px solid #e9e8e5">
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px;border-bottom:1px solid #e9e8e5">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Reference</span><br>
            <span style="font-size:14px;font-family:monospace;color:#182a1b">${escapeHtml(opts.returnRequestId.slice(0, 8).toUpperCase())}</span>
          </td>
        </tr>
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px;border-bottom:1px solid #e9e8e5">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Order</span><br>
            <span style="font-size:14px;font-family:monospace;color:#182a1b">${escapeHtml(opts.orderId.slice(0, 8).toUpperCase())}…</span>
          </td>
        </tr>
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Reason</span><br>
            <span style="font-size:14px;color:#182a1b;font-family:Manrope,sans-serif">${escapeHtml(reasonLabel)}</span>
          </td>
        </tr>
      </table>

      <p style="font-size:13px;color:#434842;line-height:1.7;font-family:Manrope,sans-serif">
        Questions? Reply to this email or write to us at
        <a href="mailto:hello@terravoa.com" style="color:#944925;text-decoration:none">hello@terravoa.com</a>.
      </p>
      <hr style="border:none;border-top:1px solid #e9e8e5;margin:28px 0">
      <p style="font-size:11px;color:#737872;font-family:Manrope,sans-serif;letter-spacing:0.08em">
        ${escapeHtml(SITE_NAME)} · Taste the Origin
      </p>
    </div>
  `

  await sendHtml(
    opts.customerEmail,
    `Return request received — ${SITE_NAME}`,
    html,
  )
}

// ── Admin notification ───────────────────────────────────────────────────────
export async function sendReturnRequestAdminNotification(opts: ReturnEmailOpts) {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'hello@terravoa.com'
  const reasonLabel = REASON_LABELS[opts.reason] ?? opts.reason
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1c1a;padding:32px 24px;background:#faf9f6">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#944925;margin:0 0 28px;font-family:Manrope,sans-serif">
        ${escapeHtml(SITE_NAME)} · Admin Alert
      </p>
      <h1 style="font-size:22px;font-weight:400;margin:0 0 20px;color:#182a1b;line-height:1.2">
        New return request
      </h1>

      <table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;margin-bottom:28px;border:1px solid #e9e8e5">
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px;border-bottom:1px solid #e9e8e5">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Reference</span><br>
            <span style="font-size:13px;font-family:monospace;color:#182a1b">${escapeHtml(opts.returnRequestId)}</span>
          </td>
        </tr>
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px;border-bottom:1px solid #e9e8e5">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Customer</span><br>
            <span style="font-size:14px;color:#182a1b;font-family:Manrope,sans-serif">
              ${escapeHtml(opts.customerName)} &mdash; ${escapeHtml(opts.customerEmail)}
            </span>
          </td>
        </tr>
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px;border-bottom:1px solid #e9e8e5">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Order ID</span><br>
            <span style="font-size:13px;font-family:monospace;color:#182a1b">${escapeHtml(opts.orderId)}</span>
          </td>
        </tr>
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px${opts.description ? ';border-bottom:1px solid #e9e8e5' : ''}">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Reason</span><br>
            <span style="font-size:14px;color:#182a1b;font-family:Manrope,sans-serif">${escapeHtml(reasonLabel)}</span>
          </td>
        </tr>
        ${opts.description ? `
        <tr style="background:#f4f3f1">
          <td style="padding:14px 20px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#737872;font-family:Manrope,sans-serif">Customer note</span><br>
            <span style="font-size:14px;color:#182a1b;font-family:Manrope,sans-serif">${escapeHtml(opts.description)}</span>
          </td>
        </tr>` : ''}
      </table>

      <a href="${siteUrl}/admin/returns"
         style="display:inline-block;background:#182a1b;color:#ffffff;font-family:Manrope,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;padding:11px 28px;border-radius:999px;text-decoration:none">
        Review in Admin
      </a>
    </div>
  `

  await sendHtml(adminEmail, `New return request from ${opts.customerEmail}`, html)
}
