import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { absoluteUrl } from '@/lib/site-url'
import { escapeHtml } from '@/lib/email/escape-html'
import {
  resolveLocale,
  acceptedStrings,
  rejectedStrings,
  rejectionReasonWordings,
  type RejectionReasonCode,
} from '@/lib/email/i18n'

function emailFrom() {
  return process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`
}

async function sendHtmlEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set; skipping:', opts.subject)
    return
  }
  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: emailFrom(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })
  if (error) console.error('[email] Resend error:', error.message)
}

export async function sendApplicationAccepted(opts: {
  to: string
  name: string
  businessName?: string | null
  locale?: string | null
}) {
  const locale = resolveLocale(opts.locale)
  const t = acceptedStrings[locale]
  const displayName = escapeHtml(opts.businessName || opts.name || 'Producer')
  const portalUrl = absoluteUrl('/login/producer')

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:sans-serif;">
    <p style="font-family:Georgia,serif;font-size:22px;color:#1a1a1a;margin:0 0 20px;">
      ${escapeHtml(SITE_NAME)} — ${escapeHtml(t.greeting(displayName))}
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
      ${escapeHtml(t.intro)}
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 24px;">
      ${escapeHtml(t.body)}
    </p>
    <a href="${portalUrl}"
       style="display:inline-block;background:#2d5a4a;color:#fff;font-size:13px;font-weight:600;
              text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;
              padding:14px 28px;border-radius:99px;">
      ${escapeHtml(t.cta)}
    </a>
    <p style="font-size:13px;color:#888;margin:32px 0 0;line-height:1.6;">
      ${escapeHtml(t.closing)}<br>
      <br>
      ${escapeHtml(t.signoff)}
    </p>
  </div>`

  await sendHtmlEmail({
    to: opts.to,
    subject: t.subject,
    html,
  })
}

export async function sendApplicationRejected(opts: {
  to: string
  name: string
  businessName?: string | null
  locale?: string | null
  /** Stable reason codes from the admin rejection modal. Unknown codes are ignored. */
  reasons?: string[] | null
  /** Optional free-text note written by the admin, shown verbatim after the reasons list. */
  note?: string | null
}) {
  const locale = resolveLocale(opts.locale)
  const t = rejectedStrings[locale]
  const displayName = escapeHtml(opts.businessName || opts.name || 'Producer')
  const wordings = rejectionReasonWordings[locale]

  // Only render wordings we actually have a translation for. 'other' is
  // intentionally not in the wordings map — it contributes only the free
  // text note below.
  const reasonSentences = (opts.reasons ?? [])
    .filter((r): r is Exclude<RejectionReasonCode, 'other'> =>
      Object.prototype.hasOwnProperty.call(wordings, r),
    )
    .map((code) => wordings[code])

  const noteTrimmed = (opts.note ?? '').trim()
  const showReasonsBlock = reasonSentences.length > 0
  const showNoteBlock = noteTrimmed.length > 0

  const reasonsHtml = showReasonsBlock
    ? `
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 8px;">
      ${escapeHtml(t.reasonsLead)}
    </p>
    <ul style="font-size:15px;line-height:1.7;color:#444;margin:0 0 20px;padding:0 0 0 20px;">
      ${reasonSentences
        .map(
          (sentence) =>
            `<li style="margin:0 0 8px;">${escapeHtml(sentence)}</li>`,
        )
        .join('')}
    </ul>`
    : ''

  const noteHtml = showNoteBlock
    ? `
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 8px;">
      <em>${escapeHtml(t.noteLead)}</em>
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 20px;white-space:pre-wrap;">
      ${escapeHtml(noteTrimmed)}
    </p>`
    : ''

  const html = `
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;font-family:sans-serif;">
    <p style="font-family:Georgia,serif;font-size:20px;color:#1a1a1a;margin:0 0 20px;">
      ${escapeHtml(SITE_NAME)} — ${escapeHtml(t.greeting(displayName))}
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
      ${escapeHtml(t.thanksIntro)}
    </p>
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
      ${escapeHtml(t.decision)}
    </p>
    ${reasonsHtml}
    ${noteHtml}
    <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
      ${escapeHtml(t.gentleClose)}
    </p>
    <p style="font-size:13px;color:#888;margin:32px 0 0;line-height:1.6;">
      ${escapeHtml(t.signoff)}
    </p>
  </div>`

  await sendHtmlEmail({
    to: opts.to,
    subject: t.subject,
    html,
  })
}
