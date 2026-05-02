'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import {
  sendApplicationAccepted,
  sendApplicationRejected,
} from '@/lib/email/application-emails'
import {
  REJECTION_REASON_CODES,
  type RejectionReasonCode,
} from '@/lib/email/i18n'

const MAX_NOTE_LENGTH = 500

/** Maps country code to preferred portal language. */
function countryToLanguage(country: string): 'de' | 'fr' | 'en' {
  const de = ['DE', 'AT', 'CH', 'LI']
  const fr = ['FR', 'BE', 'LU', 'MC', 'CH']
  const upper = country.toUpperCase()
  if (de.includes(upper)) return 'de'
  if (fr.includes(upper)) return 'fr'
  return 'en'
}

/**
 * P1: Creates the `producers` row and sends a Supabase auth invite when an
 * application is accepted.  Idempotent — if the row already exists the insert
 * is silently skipped (no duplicate key error propagated).
 */
async function provisionProducerOnAccept(app: {
  id: string
  email: string
  full_name: string
  business_name: string | null
  country: string
  region: string
  source_language: string | null
  desired_plan: 'founding' | 'growth' | 'premium' | null
}) {
  const admin = createAdminClient()

  // Derive slug from business name (or full name), lowercase, hyphens
  const base = (app.business_name ?? app.full_name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

  // Unique slug: append short timestamp suffix to avoid collisions
  const slug = `${base}-${Date.now().toString(36)}`

  const preferredLanguage = (app.source_language as 'en' | 'de' | 'fr' | null)
    ?? countryToLanguage(app.country)

  const { data: inserted, error: insertError } = await (admin as any)
    .from('producers')
    .insert({
      name: app.business_name ?? app.full_name,
      slug,
      region: app.region,
      country: app.country,
      specialty: '',
      tagline: '',
      story: '',
      story_headline: '',
      quote: '',
      image_src: '',
      image_alt: '',
      badges: [],
      savoir_faire: [],
      status: 'pending',          // admin approves profile separately
      plan: app.desired_plan ?? 'founding',  // honour plan chosen on the apply form
      featured_placement: false,
      preferred_language: preferredLanguage,
      bank_iban: null,
      bank_bic: null,
      bank_account_name: null,
    })
    .select('id')
    .maybeSingle()

  if (insertError) {
    console.error('[provision] producers insert failed', insertError.message)
    return
  }

  const producerId = (inserted as { id: string } | null)?.id
  if (!producerId) return

  // Link the application to the producer row
  await (admin as any)
    .from('producer_applications')
    .update({ producer_id: producerId })
    .eq('id', app.id)

  // Send Supabase magic-link invite so the producer can set their password.
  // This creates a Supabase auth user and fires the invitation email.
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    app.email,
    {
      data: {
        role: 'producer',
        producer_id: producerId,
        full_name: app.full_name,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/producer/accept-invite`,
    },
  )

  if (inviteError) {
    // Don't fail — the producers row exists; admin can re-send invite manually.
    console.error('[provision] auth invite failed', inviteError.message)
  }
}

export async function updateApplicationStatus(
  id: string,
  status: 'accepted' | 'rejected',
  options?: { reasons?: string[] | null; note?: string | null },
) {
  try {
    await assertAdminForServerAction()
  } catch {
    return { ok: false as const, error: 'Unauthorized' }
  }

  const admin = createAdminClient()

  // Fetch applicant details before updating (for the email + provisioning)
  const { data: app } = await (admin as any)
    .from('producer_applications')
    .select('id, email, full_name, business_name, country, region, source_language, desired_plan')
    .eq('id', id)
    .maybeSingle()

  // Sanitise the rejection payload: whitelist known codes and cap the free-text note.
  const sanitisedReasons: RejectionReasonCode[] =
    status === 'rejected' && Array.isArray(options?.reasons)
      ? Array.from(
          new Set(
            options!.reasons!.filter((r): r is RejectionReasonCode =>
              (REJECTION_REASON_CODES as readonly string[]).includes(r),
            ),
          ),
        )
      : []

  const sanitisedNote: string | null =
    status === 'rejected' && typeof options?.note === 'string'
      ? options.note.trim().slice(0, MAX_NOTE_LENGTH) || null
      : null

  const update: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
  }
  if (status === 'rejected') {
    update.rejection_reasons = sanitisedReasons
    update.rejection_note = sanitisedNote
  } else {
    // Clear any previous rejection metadata on re-acceptance.
    update.rejection_reasons = []
    update.rejection_note = null
  }

  const { error } = await (admin as any)
    .from('producer_applications')
    .update(update)
    .eq('id', id)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  await logAdminAction({
    action: `application.${status}`,
    entityType: 'producer_application',
    entityId: id,
    metadata: {
      status,
      ...(status === 'rejected'
        ? {
            rejection_reasons: sanitisedReasons,
            rejection_note_present: Boolean(sanitisedNote),
          }
        : {}),
    },
  })

  if (app?.email) {
    // P1: Provision producer account automatically on acceptance
    if (status === 'accepted') {
      try {
        await provisionProducerOnAccept(app)
      } catch (e) {
        console.error('[provision] unexpected error', e)
      }
    }

    // Send notification email (non-blocking)
    try {
      const locale = app.source_language ?? 'en'
      if (status === 'accepted') {
        await sendApplicationAccepted({
          to: app.email,
          name: app.full_name ?? '',
          businessName: app.business_name,
          locale,
        })
      } else {
        await sendApplicationRejected({
          to: app.email,
          name: app.full_name ?? '',
          businessName: app.business_name,
          locale,
          reasons: sanitisedReasons,
          note: sanitisedNote,
        })
      }
    } catch (e) {
      console.error('[email] application status email failed', e)
    }
  }

  revalidatePath('/admin/applications')
  revalidatePath(`/admin/applications/${id}`)
  return { ok: true as const }
}

export async function acceptApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return
  await updateApplicationStatus(id, 'accepted')
}

/**
 * Accepts multipart form data from `<RejectApplicationModal>`:
 *   - id      (hidden input)
 *   - reasons (repeated checkbox field; one entry per ticked reason code)
 *   - note    (optional free-text, capped server-side at MAX_NOTE_LENGTH)
 *
 * Also remains compatible with callers that send just `id`, in which case
 * the producer receives the email without any reasons or note — identical
 * behaviour to the old flow.
 */
export async function rejectApplication(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const reasons = formData.getAll('reasons').map(String).filter(Boolean)
  const noteRaw = formData.get('note')
  const note = typeof noteRaw === 'string' ? noteRaw : null
  await updateApplicationStatus(id, 'rejected', { reasons, note })
}
