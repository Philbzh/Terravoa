'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import { createServerSupabase } from '@/lib/supabase/server'

export async function setProducerStatus(id: string, status: 'approved' | 'suspended' | 'pending') {
  try {
    await assertAdminForServerAction()
  } catch {
    return { ok: false as const, error: 'Unauthorized' }
  }

  const admin = createAdminClient()
  const { error } = await (admin as any)
    .from('producers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }

  await logAdminAction({
    action: `producer.${status}`,
    entityType: 'producer',
    entityId: id,
    metadata: { status },
  })

  revalidatePath('/admin/producers')
  revalidatePath('/producers')
  revalidatePath('/collection')
  return { ok: true }
}

export async function updateProducerDetails(formData: FormData) {
  try {
    await assertAdminForServerAction()
  } catch {
    return { ok: false as const, error: 'Unauthorized' }
  }

  const id = String(formData.get('id') ?? '').trim()
  if (!id) return { ok: false as const, error: 'Missing producer id.' }

  const rawPlan = String(formData.get('plan') ?? 'founding').trim()
  const plan = (['founding', 'growth', 'premium'].includes(rawPlan) ? rawPlan : 'founding') as 'founding' | 'growth' | 'premium'

  const rawCommission = String(formData.get('commission_rate_pct') ?? '').trim()
  const commission_rate_pct = rawCommission === '' ? null : Math.min(50, Math.max(0, parseFloat(rawCommission)))

  const featured_placement = formData.get('featured_placement') === 'on'

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
    region: String(formData.get('region') ?? '').trim(),
    country: String(formData.get('country') ?? '').trim(),
    specialty: String(formData.get('specialty') ?? '').trim(),
    tagline: String(formData.get('tagline') ?? '').trim(),
    status: String(formData.get('status') ?? 'pending').trim() as 'approved' | 'suspended' | 'pending',
    plan,
    commission_rate_pct: isNaN(commission_rate_pct as number) ? null : commission_rate_pct,
    featured_placement,
    updated_at: new Date().toISOString(),
  }

  if (!payload.name || !payload.slug) {
    return { ok: false as const, error: 'Name and slug are required.' }
  }

  const admin = createAdminClient()
  const { error } = await (admin as any).from('producers').update(payload).eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  await logAdminAction({
    action: 'producer.updated',
    entityType: 'producer',
    entityId: id,
    metadata: { fields: ['name', 'slug', 'region', 'country', 'specialty', 'tagline', 'status', 'plan', 'featured_placement', 'commission_rate_pct'] },
  })

  revalidatePath('/admin/producers')
  revalidatePath(`/admin/producers/${id}`)
  revalidatePath('/producers')
  revalidatePath('/collection')
  return { ok: true as const }
}

export async function addProducerAdminNote(formData: FormData) {
  try {
    await assertAdminForServerAction()
  } catch {
    return { ok: false as const, error: 'Unauthorized' }
  }

  const producerId = String(formData.get('producer_id') ?? '').trim()
  const note = String(formData.get('note') ?? '').trim()
  if (!producerId) return { ok: false as const, error: 'Missing producer id.' }
  if (!note) return { ok: false as const, error: 'Note cannot be empty.' }

  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const actorEmail = user?.email
  if (!actorEmail) return { ok: false as const, error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await (admin as any).from('producer_admin_notes').insert({
    producer_id: producerId,
    actor_email: actorEmail,
    note,
  })

  if (error) return { ok: false as const, error: error.message }

  await logAdminAction({
    action: 'producer.note_added',
    entityType: 'producer',
    entityId: producerId,
    metadata: { noteLength: note.length },
  })

  revalidatePath(`/admin/producers/${producerId}`)
  return { ok: true as const }
}
