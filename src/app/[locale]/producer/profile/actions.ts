'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { logAuditEvent } from '@/lib/audit-log'

export type ProfileResult = { ok: true } | { ok: false; error: string } | null

const IBAN_RE = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,}$/   // basic IBAN structure
const BIC_RE  = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/ // 8 or 11 chars

/**
 * Strip spaces and uppercase — users often paste IBANs with spaces.
 */
function normalizeIban(raw: string) {
  return raw.replace(/\s+/g, '').toUpperCase()
}

export async function updateBankDetails(
  _prev: ProfileResult,
  formData: FormData,
): Promise<Exclude<ProfileResult, null>> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Not authenticated.' }
  }

  const rawIban       = String(formData.get('bank_iban') ?? '').trim()
  const rawBic        = String(formData.get('bank_bic') ?? '').trim().toUpperCase()
  const accountName   = String(formData.get('bank_account_name') ?? '').trim()

  const iban = normalizeIban(rawIban)

  if (iban && !IBAN_RE.test(iban)) {
    return { ok: false, error: 'Invalid IBAN format.' }
  }
  if (rawBic && !BIC_RE.test(rawBic)) {
    return { ok: false, error: 'Invalid BIC/SWIFT format.' }
  }
  if (accountName.length > 200) {
    return { ok: false, error: 'Account name is too long.' }
  }

  const admin = createAdminClient()

  const { error } = await (admin as any)
    .from('producers')
    .update({
      bank_iban: iban || null,
      bank_bic: rawBic || null,
      bank_account_name: accountName || null,
    })
    .eq('id', session.producer.id)

  if (error) return { ok: false, error: error.message }

  if (session.email) {
    await logAuditEvent({
      action: 'producer.profile.bank_details_updated',
      actorEmail: session.email,
      entityType: 'producer',
      entityId: session.producer.id,
      metadata: { iban_set: Boolean(iban), bic_set: Boolean(rawBic) },
    })
  }

  revalidatePath('/producer/profile')
  return { ok: true } as const
}

export async function updatePreferredLanguage(
  _prev: ProfileResult,
  formData: FormData,
): Promise<Exclude<ProfileResult, null>> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Not authenticated.' }
  }

  const lang = String(formData.get('preferred_language') ?? '').trim()
  if (!['en', 'de', 'fr'].includes(lang)) {
    return { ok: false, error: 'Invalid language.' }
  }

  const admin = createAdminClient()

  const { error } = await (admin as any)
    .from('producers')
    .update({ preferred_language: lang })
    .eq('id', session.producer.id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/producer/profile')
  return { ok: true } as const
}

const PROFILE_TEXT_MAX = {
  specialty: 120,
  tagline: 200,
  story_headline: 200,
  story: 8000,
  quote: 500,
} as const

export async function updatePublicProfile(
  _prev: ProfileResult,
  formData: FormData,
): Promise<Exclude<ProfileResult, null>> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Not authenticated.' }
  }

  const specialty = String(formData.get('specialty') ?? '').trim()
  const tagline = String(formData.get('tagline') ?? '').trim()
  const story_headline = String(formData.get('story_headline') ?? '').trim()
  const story = String(formData.get('story') ?? '').trim()
  const quote = String(formData.get('quote') ?? '').trim()

  if (!specialty || !tagline || !story_headline || !story) {
    return { ok: false, error: 'Please fill in specialty, tagline, story headline, and story.' }
  }
  if (specialty.length > PROFILE_TEXT_MAX.specialty) {
    return { ok: false, error: 'Specialty is too long.' }
  }
  if (tagline.length > PROFILE_TEXT_MAX.tagline) {
    return { ok: false, error: 'Tagline is too long.' }
  }
  if (story_headline.length > PROFILE_TEXT_MAX.story_headline) {
    return { ok: false, error: 'Story headline is too long.' }
  }
  if (story.length > PROFILE_TEXT_MAX.story) {
    return { ok: false, error: 'Story is too long.' }
  }
  if (quote.length > PROFILE_TEXT_MAX.quote) {
    return { ok: false, error: 'Quote is too long.' }
  }

  const admin = createAdminClient()
  const { error } = await (admin as any)
    .from('producers')
    .update({
      specialty,
      tagline,
      story_headline,
      story,
      quote: quote || null,
    })
    .eq('id', session.producer.id)

  if (error) return { ok: false, error: error.message }

  if (session.email) {
    await logAuditEvent({
      action: 'producer.profile.public_updated',
      actorEmail: session.email,
      entityType: 'producer',
      entityId: session.producer.id,
    })
  }

  revalidatePath('/producer/profile')
  revalidatePath(`/producers/${session.producer.slug}`)
  return { ok: true } as const
}
