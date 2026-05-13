'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { Resend } from 'resend'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { html } from '@/lib/email/html-template'
import { rateLimit, getClientIpFromHeaders } from '@/lib/rate-limit'
import {
  detectImageMime,
  MIME_TO_EXT,
  MAX_IMAGE_BYTES as MAX_FILE_BYTES,
} from '@/lib/image-mime'

async function uploadApplicationImages(
  admin: ReturnType<typeof createAdminClient>,
  applicationId: string,
  formData: FormData,
): Promise<{
  product_image_urls: string[]
  production_image_urls: string[]
  environment_image_urls: string[]
}> {
  const bucket = 'images'

  async function uploadGroup(
    files: File[],
    prefix: string,
  ): Promise<string[]> {
    const out: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue
      if (file.size > MAX_FILE_BYTES) continue

      const buf = Buffer.from(await file.arrayBuffer())

      // Validate content via magic bytes — never trust file.name or file.type
      const mime = detectImageMime(buf)
      if (!mime) {
        console.warn(`[upload] rejected non-image file from application ${applicationId}`)
        continue
      }

      const ext  = MIME_TO_EXT[mime]
      const path = `applications/${applicationId}/${prefix}/${i}.${ext}`

      const { error } = await admin.storage.from(bucket).upload(path, buf, {
        contentType: mime, // use server-validated MIME, never client-supplied
        upsert: true,
      })
      if (error) continue
      const { data: pub } = admin.storage.from(bucket).getPublicUrl(path)
      out.push(pub.publicUrl)
    }
    return out
  }

  const productFiles = formData.getAll('product_photos') as File[]
  const productionFiles = formData.getAll('production_photos') as File[]
  const environmentFiles = formData.getAll('environment_photos') as File[]

  const [product_image_urls, production_image_urls, environment_image_urls] =
    await Promise.all([
      uploadGroup(productFiles, 'product'),
      uploadGroup(productionFiles, 'production'),
      uploadGroup(environmentFiles, 'environment'),
    ])

  return { product_image_urls, production_image_urls, environment_image_urls }
}

export async function submitApplication(
  formData: FormData,
): Promise<{ success: true } | { success: false; error: string }> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return {
      success: false,
      error:
        'Application submission is not configured. Please try again later.',
    }
  }

  // HIGH-8: rate-limit application submissions to stop bots from filling the
  // storage bucket and review queue. 3 per IP per day and 2 per email per day.
  const hdrs = await headers()
  const ip = getClientIpFromHeaders(hdrs)
  const ipRl = await rateLimit(`apply:ip:${ip}`, 3, 24 * 60 * 60 * 1000)
  if (!ipRl.success) {
    return {
      success: false,
      error: 'Too many applications from this connection today. Please try again later.',
    }
  }
  const emailForRateLimit = String(formData.get('email') ?? '').trim().toLowerCase()
  if (emailForRateLimit) {
    const emailRl = await rateLimit(
      `apply:email:${emailForRateLimit}`,
      2,
      24 * 60 * 60 * 1000,
    )
    if (!emailRl.success) {
      return {
        success: false,
        error: 'We already have a recent application for this email.',
      }
    }
  }

  const confirmNoAlcohol = formData.get('confirm_no_alcohol')
  const confirmLocal    = formData.get('confirm_local')
  const confirmQuality  = formData.get('confirm_quality')
  const confirmCompany  = formData.get('confirm_company_registered')
  if (
    confirmNoAlcohol !== 'on' ||
    confirmLocal !== 'on' ||
    confirmQuality !== 'on' ||
    confirmCompany !== 'on'
  ) {
    return {
      success: false,
      error: 'Please confirm all declarations before submitting.',
    }
  }

  const product_categories = formData.getAll('product_categories') as string[]
  if (product_categories.length === 0) {
    return {
      success: false,
      error: 'Please select at least one product category.',
    }
  }

  // If the applicant selected "Other" and filled in a free-text label,
  // replace the generic "other" tag with "other:<label>" so admins can see
  // exactly what category was requested. Cap at 80 chars defensively.
  const otherLabelRaw = optionalString(formData.get('other_category_label'))
  if (otherLabelRaw && product_categories.includes('other')) {
    const cleaned = otherLabelRaw.replace(/\s+/g, ' ').slice(0, 80)
    const idx = product_categories.indexOf('other')
    product_categories[idx] = `other:${cleaned}`
  }

  const admin = createAdminClient()
  const sourceLanguage = (formData.get('locale') as string) || 'en'

  // Shipping experience value is locale-translated — map to boolean by position
  const shipExp = formData.get('shipping_experience')
  const shipExpBool =
    shipExp == null || shipExp === ''
      ? null
      : String(shipExp).toLowerCase().startsWith('y') || shipExp === 'Yes'
        ? true
        : false

  const payload = {
    // ── Step 1: About You ──
    full_name:           String(formData.get('full_name') ?? '').trim(),
    business_name:       String(formData.get('business_name') ?? '').trim(),
    company_registration_country: String(
      formData.get('company_registration_country') ?? '',
    ).trim(),
    vat_id:              String(formData.get('vat_id') ?? '').trim(),
    email:               String(formData.get('email') ?? '').trim(),
    phone:               optionalString(formData.get('phone')),
    country:             String(formData.get('country') ?? '').trim(),
    region:              String(formData.get('region') ?? '').trim(),
    production_location: optionalString(formData.get('production_location')),

    // ── Step 2: Products ──
    product_categories,
    product_description:    String(formData.get('product_description') ?? '').trim(),
    product_differentiator: optionalString(formData.get('product_differentiator')),
    pricing_range:          optionalString(formData.get('pricing_range')),
    desired_plan:           optionalDesiredPlan(formData.get('desired_plan')),

    // ── Step 3: Quality & Craft ──
    is_organic:          optionalString(formData.get('is_organic')),
    organic_certifier:   optionalString(formData.get('organic_certifier')),
    certifications:      (formData.getAll('certifications') as string[]).filter(Boolean),
    certification_body:  optionalString(formData.get('certification_body')),
    production_scale:    optionalString(formData.get('production_scale')),
    annual_production:   optionalString(formData.get('annual_production')),
    shelf_life:          optionalString(formData.get('shelf_life')),
    packaging_ready:     optionalString(formData.get('packaging_ready')),

    // ── Step 4: Story & Online presence ──
    story:       String(formData.get('story') ?? '').trim(),
    website:     optionalString(formData.get('website')),
    instagram:   optionalString(formData.get('instagram')),
    other_links: optionalString(formData.get('other_links')),

    // ── Step 5: Shipping & Confirmation ──
    shipping_countries:    optionalString(formData.get('shipping_countries')),
    shipping_speed:        String(formData.get('shipping_speed') ?? '').trim(),
    shipping_experience:   shipExpBool,
    no_alcohol_confirmed:  confirmNoAlcohol === 'on',

    // ── Media (filled after insert) ──
    product_image_urls:    [] as string[],
    production_image_urls: [] as string[],
    environment_image_urls:[] as string[],

    source_language: sourceLanguage,
  }

  if (
    !payload.full_name ||
    !payload.business_name ||
    !payload.company_registration_country ||
    !payload.vat_id ||
    !payload.email ||
    !payload.country ||
    !payload.region ||
    !payload.product_description ||
    !payload.story ||
    !payload.shipping_speed ||
    !payload.no_alcohol_confirmed
  ) {
    return { success: false, error: 'Please fill in all required fields and confirm the declarations.' }
  }

  const { data: rowRaw, error: insertError } = await admin
    .from('producer_applications')
    // Database generic has circular refs; Supabase infers Insert as never for this table.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PostgREST row type
    .insert(payload as any)
    .select('id')
    .single()

  const row = rowRaw as { id: string } | null

  if (insertError || !row?.id) {
    return {
      success: false,
      error:
        insertError?.message ??
        'Could not save your application. If this persists, contact us.',
    }
  }

  try {
    const urls = await uploadApplicationImages(admin, row.id, formData)
    const hasAny =
      urls.product_image_urls.length > 0 ||
      urls.production_image_urls.length > 0 ||
      urls.environment_image_urls.length > 0

    if (hasAny) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PostgREST Update type resolves to never
      const { error: updateError } = await (admin as any)
        .from('producer_applications')
        .update({
          product_image_urls: urls.product_image_urls,
          production_image_urls: urls.production_image_urls,
          environment_image_urls: urls.environment_image_urls,
        })
        .eq('id', row.id)

      if (updateError) {
        console.error('producer_applications image update:', updateError.message)
      }
    }
  } catch (e) {
    console.error('Application image upload failed:', e)
  }

  const resendKey = process.env.RESEND_API_KEY

  // P14: Send acknowledgement to applicant (non-blocking)
  if (resendKey && payload.email) {
    try {
      const resend = new Resend(resendKey)
      const firstName = payload.full_name.split(' ')[0] ?? payload.full_name
      const { error: ackErr } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`,
        to: payload.email,
        subject: `We received your application — ${SITE_NAME}`,
        html: html`
          <div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
            <p style="font-family:Georgia,serif;font-size:22px;color:#1a2e1a;margin:0 0 20px;">
              Thank you, ${firstName}.
            </p>
            <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 12px;">
              We have received your application to join <strong>${SITE_NAME}</strong>
              and will review it carefully.
              Our team typically responds within <strong>5–7 business days</strong>.
            </p>
            <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 20px;">
              While you wait, feel free to explore our marketplace at
              <a href="${SITE_URL}" style="color:#2d5a4a;">${SITE_URL}</a>.
            </p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0;" />
            <p style="font-size:11px;color:#888;line-height:1.6;margin:0;">
              ${SITE_NAME} · Connecting European artisan producers with discerning buyers
            </p>
          </div>`,
      })
      if (ackErr) console.error('[email] applicant acknowledgement Resend error:', ackErr.message)
    } catch (e) {
      console.error('[email] applicant acknowledgement failed', e)
    }
  }

  // Notify admin of new application (non-blocking)
  const adminEmail = process.env.ADMIN_CONTACT_EMAIL
  if (adminEmail && resendKey) {
    try {
      const resend = new Resend(resendKey)
      const { error: adminMailErr } = await resend.emails.send({
        from: process.env.EMAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`,
        to: adminEmail,
        subject: `[${SITE_NAME}] New producer application — ${payload.full_name}`,
        // MED-2: `html` tag auto-escapes every interpolated value.
        // SITE_URL is an env-controlled trusted string, safe to interpolate.
        html: html`
          <div style="max-width:520px;margin:0 auto;padding:24px;font-family:sans-serif;">
            <p style="font-family:Georgia,serif;font-size:18px;color:#1a1a1a;margin:0 0 16px;">
              New producer application
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>Contact:</strong> ${payload.full_name}
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>Business:</strong> ${payload.business_name}
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>Registered in:</strong> ${payload.company_registration_country}
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>VAT / tax ID:</strong> ${payload.vat_id}
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a>
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 4px;">
              <strong>Production location:</strong> ${payload.region}, ${payload.country}
            </p>
            <p style="font-size:13px;color:#555;margin:0 0 12px;">
              <strong>Categories:</strong> ${product_categories.join(', ')}
            </p>
            <p style="font-size:14px;line-height:1.7;color:#333;border-left:3px solid #2d5a4a;padding-left:12px;margin:0 0 20px;">
              ${payload.product_description}
            </p>
            <a href="${SITE_URL}/admin/applications"
               style="display:inline-block;background:#2d5a4a;color:#fff;font-size:12px;font-weight:600;
                      text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;
                      padding:10px 22px;border-radius:99px;">
              Review in Admin
            </a>
          </div>`,
      })
      if (adminMailErr)
        console.error('[email] admin application Resend error:', adminMailErr.message)
    } catch (e) {
      console.error('[email] admin application notification failed', e)
    }
  }

  return { success: true }
}

function optionalString(v: FormDataEntryValue | null): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

function optionalDesiredPlan(v: FormDataEntryValue | null): 'founding' | 'growth' | 'premium' {
  const raw = String(v ?? '').trim().toLowerCase()
  if (raw === 'growth' || raw === 'premium') return raw
  return 'founding'
}
