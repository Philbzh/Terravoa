import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendBuyerReviewRequest, sendBuyerWinbackReminder } from '@/lib/email/order-emails'
import { verifyCronAuth } from '@/lib/cron-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getCustomerName(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'Customer'
  const value = (payload as Record<string, unknown>).customer_name
  return typeof value === 'string' && value.trim() ? value.trim() : 'Customer'
}

const MAX_ATTEMPTS = 5

export async function POST(request: Request) {
  const unauthorized = verifyCronAuth(request)
  if (unauthorized) return unauthorized

  const admin = createAdminClient() as any
  const nowIso = new Date().toISOString()
  const { data, error } = await admin
    .from('email_jobs')
    .select('id, kind, order_id, customer_email, payload, attempts')
    .is('sent_at', null)
    .lte('send_at', nowIso)
    .lt('attempts', MAX_ATTEMPTS)
    .order('send_at', { ascending: true })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const jobs = (data ?? []) as {
    id: number
    kind: string
    order_id: string | null
    customer_email: string
    payload: unknown
    attempts: number
  }[]

  let sent = 0
  let failed = 0

  for (const job of jobs) {
    try {
      const customerName = getCustomerName(job.payload)

      if (job.kind === 'review_request') {
        if (!job.order_id) throw new Error('Missing order_id for review_request')
        await sendBuyerReviewRequest({
          to: job.customer_email,
          customerName,
          orderId: job.order_id,
        })
      } else if (job.kind === 'winback_60d') {
        await sendBuyerWinbackReminder({
          to: job.customer_email,
          customerName,
        })
      } else {
        throw new Error(`Unsupported email job kind: ${job.kind}`)
      }

      await admin
        .from('email_jobs')
        .update({
          sent_at: new Date().toISOString(),
          attempts: Number(job.attempts ?? 0) + 1,
          last_error: null,
        })
        .eq('id', job.id)

      sent += 1
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown email job error'
      const newAttempts = Number(job.attempts ?? 0) + 1
      await admin
        .from('email_jobs')
        .update({
          attempts: newAttempts,
          last_error: message,
        })
        .eq('id', job.id)

      if (newAttempts >= MAX_ATTEMPTS) {
        console.error(
          `[email-jobs] dead-letter: job ${job.id} (${job.kind}) failed ${MAX_ATTEMPTS} times — last error: ${message}`,
        )
      }
      failed += 1
    }
  }

  // Count total dead-lettered jobs for monitoring
  const { count: deadLetterCount } = await admin
    .from('email_jobs')
    .select('id', { count: 'exact', head: true })
    .is('sent_at', null)
    .gte('attempts', MAX_ATTEMPTS)

  return NextResponse.json({
    ok: true,
    due: jobs.length,
    sent,
    failed,
    dead_letter: deadLetterCount ?? 0,
  })
}
