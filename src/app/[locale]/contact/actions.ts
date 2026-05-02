'use server'

import { headers } from 'next/headers'
import { createServerSupabase } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { SITE_NAME } from '@/lib/constants'
import { html } from '@/lib/email/html-template'
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
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`,
        to: adminEmail,
        subject: `[${SITE_NAME}] New contact message from ${first_name} ${last_name}`,
        // MED-2: every interpolated value is auto-escaped by the `html` tag.
        html: html`
          <div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
            <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;margin:0 0 16px;">
              New contact message
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>From:</strong> ${first_name} ${last_name}
              &lt;<a href="mailto:${email}">${email}</a>&gt;
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 16px;">
              <strong>Type:</strong> ${audience}
            </p>
            <p style="font-size:14px;line-height:1.7;color:#333;white-space:pre-wrap;border-left:3px solid #2d5a4a;padding-left:12px;margin:0;">
              ${message}
            </p>
          </div>`,
      })
    } catch (e) {
      console.error('[email] contact notification failed', e)
    }
  }

  return { ok: true }
}
