import { Resend } from 'resend'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { escapeHtml } from '@/lib/email/escape-html'

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

async function send(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) { console.warn('[plan-email] RESEND_API_KEY not set'); return }
  try {
    const resend = new Resend(key)
    await resend.emails.send({ from: emailFrom(), to, subject, html })
  } catch (e) {
    console.error('[plan-email] send failed', e)
  }
}

const PLAN_LABELS: Record<string, string> = {
  founding: 'Founding (€0/mo · 15%)',
  growth:   'Growth (€39/mo · 12%)',
  premium:  'Premium (€89/mo · 8%)',
}

const ADDON_LABELS: Record<string, string> = {
  addon_featured_placement:  'Featured Placement (from €25/month)',
  addon_homepage_feature:    'Homepage Feature (€100/month)',
}

function adminBtn(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#182a1b;color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:10px 22px;border-radius:99px;">${label}</a>`
}

// ── Producer receives confirmation ────────────────────────────────────────────
export async function sendPlanRequestConfirmation(opts: {
  producerEmail: string
  producerName: string
  requestType: string
  requestedPlan?: string | null
}) {
  const isAddon = opts.requestType.startsWith('addon_')
  const label = isAddon
    ? (ADDON_LABELS[opts.requestType] ?? opts.requestType)
    : `${PLAN_LABELS[opts.requestedPlan ?? ''] ?? opts.requestedPlan} plan`

  await send(
    opts.producerEmail,
    `${SITE_NAME} — Your request has been received`,
    `<div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:20px;color:#182a1b;margin:0 0 16px;">
        Request received, ${escapeHtml(opts.producerName)} 👋
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 12px;">
        We've received your request for <strong>${escapeHtml(label)}</strong>.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 20px;">
        Our team will review it and get back to you within 1–2 business days.
        Once approved, your account will be updated automatically.
      </p>
      <p style="font-size:12px;color:#888;margin:0;">
        Questions? Reply to this email or visit your
        <a href="${SITE_URL}/producer/plan" style="color:#944925;">producer portal</a>.
      </p>
    </div>`,
  )
}

// ── Admin receives notification ───────────────────────────────────────────────
export async function sendPlanRequestAdminNotification(opts: {
  producerName: string
  producerEmail: string
  requestType: string
  requestedPlan?: string | null
  message?: string | null
  requestId: string
}) {
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL
  if (!adminEmail) return

  const isAddon = opts.requestType.startsWith('addon_')
  const label = isAddon
    ? (ADDON_LABELS[opts.requestType] ?? opts.requestType)
    : `upgrade to ${PLAN_LABELS[opts.requestedPlan ?? ''] ?? opts.requestedPlan}`

  await send(
    adminEmail,
    `[${SITE_NAME}] Plan request — ${escapeHtml(opts.producerName)}`,
    `<div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:18px;color:#182a1b;margin:0 0 16px;">
        New plan request
      </p>
      <p style="font-size:13px;color:#555;margin:0 0 4px;">
        <strong>Producer:</strong> ${escapeHtml(opts.producerName)} (${escapeHtml(opts.producerEmail)})
      </p>
      <p style="font-size:13px;color:#555;margin:0 0 12px;">
        <strong>Request:</strong> ${escapeHtml(label)}
      </p>
      ${opts.message ? `<p style="font-size:13px;color:#555;border-left:3px solid #ccc;padding-left:12px;margin:0 0 20px;">${escapeHtml(opts.message)}</p>` : ''}
      ${adminBtn('Review in Admin', `${SITE_URL}/admin/plan-requests`)}
    </div>`,
  )
}

// ── Producer receives approval ────────────────────────────────────────────────
export async function sendPlanRequestApproval(opts: {
  producerEmail: string
  producerName: string
  requestType: string
  requestedPlan?: string | null
}) {
  const isAddon = opts.requestType.startsWith('addon_')
  const label = isAddon
    ? (ADDON_LABELS[opts.requestType] ?? opts.requestType)
    : `${PLAN_LABELS[opts.requestedPlan ?? ''] ?? opts.requestedPlan} plan`

  await send(
    opts.producerEmail,
    `${SITE_NAME} — Your request has been approved ✓`,
    `<div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:20px;color:#182a1b;margin:0 0 16px;">
        Great news, ${escapeHtml(opts.producerName)}!
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 12px;">
        Your request for <strong>${escapeHtml(label)}</strong> has been approved and is now active on your account.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 20px;">
        ${isAddon
          ? 'Your products and profile will now receive featured placement in search results and listings.'
          : 'Your new plan benefits are active immediately. Visit your portal to see your updated commission rate and features.'}
      </p>
      <a href="${SITE_URL}/producer/plan" style="display:inline-block;background:#182a1b;color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:10px 22px;border-radius:99px;">
        View your plan
      </a>
    </div>`,
  )
}

// ── Producer receives rejection ───────────────────────────────────────────────
export async function sendPlanRequestRejection(opts: {
  producerEmail: string
  producerName: string
  requestType: string
  adminNotes?: string | null
}) {
  await send(
    opts.producerEmail,
    `${SITE_NAME} — Update on your request`,
    `<div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
      <p style="font-family:Georgia,serif;font-size:20px;color:#182a1b;margin:0 0 16px;">
        Hi ${escapeHtml(opts.producerName)},
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 12px;">
        Thank you for your request. Unfortunately we're unable to process it at this time.
      </p>
      ${opts.adminNotes ? `<p style="font-size:14px;color:#444;line-height:1.7;border-left:3px solid #ccc;padding-left:12px;margin:0 0 16px;">${escapeHtml(opts.adminNotes)}</p>` : ''}
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 20px;">
        If you have questions, please don't hesitate to reach out — we're happy to discuss options.
      </p>
      <a href="mailto:${process.env.ADMIN_CONTACT_EMAIL ?? 'hello@terravoa.com'}" style="display:inline-block;background:#182a1b;color:#fff;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;padding:10px 22px;border-radius:99px;">
        Contact us
      </a>
    </div>`,
  )
}
