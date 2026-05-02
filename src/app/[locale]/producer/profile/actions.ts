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
