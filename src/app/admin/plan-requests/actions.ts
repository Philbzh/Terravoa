'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAdminForServerAction } from '@/lib/auth/require-admin'
import { logAdminAction } from '@/lib/admin/audit-log'
import {
  sendPlanRequestApproval,
  sendPlanRequestRejection,
} from '@/lib/email/plan-emails'

export async function approvePlanRequest(formData: FormData) {
  try {
    await assertAdminForServerAction()
  } catch {
    return
  }

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const admin = createAdminClient()
  const { data: req } = await (admin as any)
    .from('producer_plan_requests')
    .select('id, producer_id, request_type, requested_plan, requester_email, status, producer:producers(name)')
    .eq('id', id)
    .maybeSingle()

  if (!req || req.status !== 'pending') return

  if (req.request_type === 'plan_upgrade' && req.requested_plan) {
    await (admin as any)
      .from('producers')
      .update({ plan: req.requested_plan })
      .eq('id', req.producer_id)
  }

  if (req.request_type === 'addon_featured_placement') {
    await (admin as any)
      .from('producers')
      .update({ featured_placement: true })
      .eq('id', req.producer_id)
  }

  await (admin as any)
    .from('producer_plan_requests')
    .update({
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  await logAdminAction({
    action: 'producer_plan_request.approved',
    entityType: 'producer_plan_request',
    entityId: id,
    metadata: {
      producerId: req.producer_id,
      requestType: req.request_type,
      requestedPlan: req.requested_plan,
    },
  })

  if (req.requester_email) {
    await sendPlanRequestApproval({
      producerEmail: req.requester_email,
      producerName: req.producer?.name ?? 'Producer',
      requestType: req.request_type,
      requestedPlan: req.requested_plan,
    })
  }

  revalidatePath('/admin/plan-requests')
  revalidatePath('/admin/producers')
}

export async function rejectPlanRequest(formData: FormData) {
  try {
    await assertAdminForServerAction()
  } catch {
    return
  }

  const id = String(formData.get('id') ?? '')
  const adminNotes = String(formData.get('admin_notes') ?? '').trim() || null
  if (!id) return

  const admin = createAdminClient()
  const { data: req } = await (admin as any)
    .from('producer_plan_requests')
    .select('id, producer_id, request_type, requester_email, status, producer:producers(name)')
    .eq('id', id)
    .maybeSingle()

  if (!req || req.status !== 'pending') return

  await (admin as any)
    .from('producer_plan_requests')
    .update({
      status: 'rejected',
      admin_notes: adminNotes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  await logAdminAction({
    action: 'producer_plan_request.rejected',
    entityType: 'producer_plan_request',
    entityId: id,
    metadata: {
      producerId: req.producer_id,
      requestType: req.request_type,
      adminNotes,
    },
  })

  if (req.requester_email) {
    await sendPlanRequestRejection({
      producerEmail: req.requester_email,
      producerName: req.producer?.name ?? 'Producer',
      requestType: req.request_type,
      adminNotes,
    })
  }

  revalidatePath('/admin/plan-requests')
}
