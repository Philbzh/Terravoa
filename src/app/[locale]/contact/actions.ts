'use server'

import { headers } from 'next/headers'
import { createServerSupabase } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { escapeHtml } from '@/lib/email/escape-html'
import { html, raw } from '@/lib/email/html-template'
import { rateLimit, getClientIpFromHeaders } from '@/lib/rate-limit'

// Contact form length guards — also prevent DB bloat on unbounded inputs.
const NAME_MAX    = 120
const EMAIL_MAX   = 320
const AUDIENCE_MAX = 60
const MESSAGE_MAX = 4_000

export async function submitContactMessage(
  _prev: { ok?: boolean; error?: string } | undefined,
  formData: FormData,
): Promise<{ ok?: boolean; error?: string }> {
  // HIGH-7: rate limit before touching the DB or sending email — 5/IP/hour
  // and 3/email/hour to prevent both anonymous flooding and targeted spam.
  const hdrs = await headers()
  const ip = getClientIpFromHeaders(hdrs)

  const first_name = String(formData.get('first_name') ?? '').trim().slice(0, NAME_MAX)
  const last_name = String(formData.get('last_name') ?? '').trim().slice(0, NAME_MAX)
  const email = String(formData.get('email') ?? '').trim().slice(0, EMAIL_MAX).toLowerCase()
  const audience = String(formData.get('audience') ?? '').trim().slice(0, AUDIENCE_MAX)
  const message = String(formData.get('message') ?? '').trim().slice(0, MESSAGE_MAX)

  if (!first_name || !last_name || !email || !audience || !message) {
    return { error: 'Please fill in all fields.' }
  }

  const ipRl = await rateLimit(`contact:ip:${ip}`, 5, 60 * 60 * 1000)
  if (!ipRl.success) {
    return { error: 'Too many messages from this connection. Please try again later.' }
  }
  if (email) {
    const emailRl = await rateLimit(`contact:email:${email}`, 3, 60 * 60 * 1000)
    if (!emailRl.success) {
      return { error: 'Too many messages from this email recently. Please try again later.' }
    }
  }

  const supabase = await createServerSupabase()
  const { error } = await (supabase as any).from('contact_messages').insert({
    first_name,
    last_name,
    email,
    audience,
    message,
  })

  if (error) {
    console.error('contact_messages insert:', error.message)
    return { error: 'Could not send your message. Please try again later.' }
  }

  // Notify admin via email (non-blocking)
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL
  const resendKey = process.env.RESEND_API_KEY
  if (adminEmail && resendKey) {
    try {
      const resend = new Resend(resendKey)
      const receivedAt = new Date().toLocaleString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
      const emailHref = encodeURIComponent(email)
      const emailAnchor = raw(
        `<a href="mailto:${emailHref}" style="color:#1e4336;font-weight:600;text-decoration:underline;text-underline-offset:2px;">${escapeHtml(email)}</a>`,
      )
      const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${SITE_NAME} - your message`)}`
      const replyButton = raw(
        `<a href="${escapeHtml(replyHref)}" style="display:inline-block;padding:12px 26px;background:#2d5a4a;color:#f8faf8;font-size:14px;font-weight:600;text-decoration:none;font-family:'Segoe UI',Arial,sans-serif;mso-line-height-rule:exactly;line-height:14px;border-radius:6px;">Reply to sender</a>`,
      )
      const { error: sendError } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`,
        to: adminEmail,
        subject: `[${SITE_NAME}] Contact · ${first_name} ${last_name} · ${audience}`,
        /* Table-first layout: Outlook ignores many div widths; fixed label column avoids a huge gap. */
        html: html`
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;background:#edf1ed;">
            <tr>
              <td align="center" style="padding:28px 12px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="border-collapse:collapse;width:100%;max-width:560px;background:#ffffff;border:1px solid #cfd9d2;">
                  <tr>
                    <td bgcolor="#2d5a4a" style="background:#2d5a4a;padding:22px 28px;">
                      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:26px;font-weight:600;color:#f8faf8;">
                        ${SITE_NAME}
                      </p>
                      <p style="margin:8px 0 0;font-size:11px;line-height:14px;color:#d8e8df;text-transform:uppercase;letter-spacing:0.14em;font-family:'Segoe UI',Arial,sans-serif;">
                        Contact form
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:22px 28px 6px;font-family:'Segoe UI',Arial,sans-serif;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:15px;line-height:22px;color:#1f2e1f;">
                        <tr>
                          <td width="132" valign="top" style="width:132px;max-width:132px;padding:0 16px 14px 0;border-bottom:1px solid #e8eee9;font-size:12px;line-height:18px;color:#5f7264;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                            Name
                          </td>
                          <td valign="top" style="padding:0 0 14px 0;border-bottom:1px solid #e8eee9;font-size:16px;line-height:22px;font-weight:600;color:#142414;">
                            ${first_name} ${last_name}
                          </td>
                        </tr>
                        <tr>
                          <td width="132" valign="top" style="width:132px;max-width:132px;padding:14px 16px 14px 0;border-bottom:1px solid #e8eee9;font-size:12px;line-height:18px;color:#5f7264;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                            Email
                          </td>
                          <td valign="top" style="padding:14px 0;border-bottom:1px solid #e8eee9;font-size:15px;line-height:22px;">
                            ${emailAnchor}
                          </td>
                        </tr>
                        <tr>
                          <td width="132" valign="top" style="width:132px;max-width:132px;padding:14px 16px 14px 0;border-bottom:1px solid #e8eee9;font-size:12px;line-height:18px;color:#5f7264;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">
                            Topic
                          </td>
                          <td valign="top" style="padding:14px 0;border-bottom:1px solid #e8eee9;font-size:15px;line-height:22px;color:#2a3d2a;">
                            ${audience}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 28px 20px;font-family:'Segoe UI',Arial,sans-serif;">
                      <p style="margin:0 0 10px;font-size:12px;line-height:16px;color:#5f7264;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
                        Their message
                      </p>
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f3f7f4;border:1px solid #d5e0d8;">
                        <tr>
                          <td style="padding:18px 20px;font-size:16px;line-height:26px;color:#1a2e1a;white-space:pre-wrap;">
                            ${message}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 28px 24px;font-family:'Segoe UI',Arial,sans-serif;">
                      ${replyButton}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 28px 26px;font-family:'Segoe UI',Arial,sans-serif;">
                      <p style="margin:0;font-size:12px;line-height:18px;color:#7a8c7e;">
                        Received ${receivedAt}. You can also start a reply from the green button — it opens a message to their address.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 28px 22px;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;line-height:16px;color:#8a9a8a;">
                      Internal · ${SITE_NAME} contact form · not shown to customers
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`,
      })
      if (sendError) console.error('[email] contact Resend error:', sendError.message)
    } catch (e) {
      console.error('[email] contact notification failed', e)
    }
  }

  return { ok: true }
}
