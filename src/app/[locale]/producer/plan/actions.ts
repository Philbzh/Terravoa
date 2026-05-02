'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import {
  sendPlanRequestConfirmation,
  sendPlanRequestAdminNotification,
} from '@/lib/email/plan-emails'

type Result = { ok: true; requestId: string } | { ok: false; error: string }

export async function submitPlanRequest(formData: FormData): Promise<Result> {
  const session = await getProducerForSession()
  if (!session?.producer) return { ok: false, error: 'Not authenticated.' }

  const producer = session.producer
  const requestType = String(formData.get('request_type') ?? '').trim()
  const requestedPlan = String(formData.get('requested_plan') ?? '').trim() || null
  const message = String(formData.get('message') ?? '').slice(0, 1000).trim() || null

  const validTypes = ['plan_upgrade', 'addon_featured_placement', 'addon_homepage_feature']
  if (!validTypes.includes(requestType)) {
    return { ok: false, error: 'Invalid request type.' }
  }

  if (requestType === 'plan_upgrade') {
    const validPlans = ['growth', 'premium']
    if (!requestedPlan || !validPlans.includes(requestedPlan)) {
      return { ok: false, error: 'Please select a plan to upgrade to.' }
    }
    if (producer.plan === requestedPlan) {
      return { ok: false, error: `You are already on the ${requestedPlan} plan.` }
    }
  }

  const admin = createAdminClient()
  const producerEmail = session.email ?? ''
  const producerName  = producer.name

  // Check for existing pending request of same type
  const { data: existing } = await (admin as any)
    .from('producer_plan_requests')
    .select('id')
    .eq('producer_id', producer.id)
    .eq('request_type', requestType)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return { ok: false, error: 'You already have a pending request of this type. We\'ll be in touch soon.' }
  }

  const { data: row, error } = await (admin as any)
    .from('producer_plan_requests')
    .insert({
      producer_id:    producer.id,
      requester_email: producerEmail || null,
      request_type:   requestType,
      current_plan:   producer.plan ?? 'founding',
      requested_plan: requestedPlan,
      message,
    })
    .select('id')
    .single()

  if (error || !row?.id) {
    return { ok: false, error: 'Failed to submit request. Please try again.' }
  }

  await Promise.allSettled([
    sendPlanRequestConfirmation({ producerEmail, producerName, requestType, requestedPlan }),
    sendPlanRequestAdminNotification({
      producerName, producerEmail, requestType, requestedPlan, message, requestId: row.id,
    }),
  ])

  revalidatePath('/producer/plan')
  return { ok: true, requestId: row.id }
}
