import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

export type DelayedProducerItem = {
  orderId: string
  producerId: string
  producerName: string
  customerName: string
  customerEmail: string
  createdAt: string
  ageHours: number
  followupStatus: 'open' | 'contacted' | 'snoozed' | 'resolved'
  contactCount: number
  lastContactedAt: string | null
  nextFollowUpAt: string | null
}

export async function getOpsCommandCenterData() {
  const admin = createAdminClient() as any
  const now = Date.now()

  const [{ data: itemsRaw }, { data: returnsRaw }, { data: planRaw }, { data: followupsRaw }] = await Promise.all([
    admin
      .from('order_items')
      .select(`
        id,
        order_id,
        producer_id,
        tracking_number,
        status,
        orders(order_id:id, created_at, status, customer_name, customer_email),
        producers(id, name)
      `)
      .is('tracking_number', null),
    admin
      .from('return_requests')
      .select('id, order_id, customer_email, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    admin
      .from('producer_plan_requests')
      .select('id, producer_id, request_type, status, created_at, producers(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    admin
      .from('producer_fulfillment_followups')
      .select('order_id, producer_id, status, contact_count, last_contacted_at, next_follow_up_at'),
  ])

  const followupsByKey = new Map<
    string,
    {
      status: 'open' | 'contacted' | 'snoozed' | 'resolved'
      contact_count: number
      last_contacted_at: string | null
      next_follow_up_at: string | null
    }
  >()
  for (const row of (followupsRaw ?? []) as any[]) {
    followupsByKey.set(`${row.order_id}:${row.producer_id}`, row)
  }

  const delayedItems: DelayedProducerItem[] = ((itemsRaw ?? []) as any[])
    .map((row) => {
      const order = row.orders
      if (!order?.created_at) return null
      const ageHours = Math.max(0, Math.floor((now - new Date(order.created_at).getTime()) / (1000 * 60 * 60)))
      return {
        orderId: row.order_id,
        producerId: row.producer_id,
        producerName: row.producers?.name ?? 'Producer',
        customerName: order.customer_name ?? 'Customer',
        customerEmail: order.customer_email ?? '—',
        createdAt: order.created_at,
        ageHours,
        followupStatus:
          followupsByKey.get(`${row.order_id}:${row.producer_id}`)?.status ?? 'open',
        contactCount:
          Number(followupsByKey.get(`${row.order_id}:${row.producer_id}`)?.contact_count ?? 0),
        lastContactedAt:
          followupsByKey.get(`${row.order_id}:${row.producer_id}`)?.last_contacted_at ?? null,
        nextFollowUpAt:
          followupsByKey.get(`${row.order_id}:${row.producer_id}`)?.next_follow_up_at ?? null,
      } satisfies DelayedProducerItem
    })
    .filter((r): r is DelayedProducerItem => Boolean(r))
    .filter((r) => r.ageHours >= 24)
    .sort((a, b) => b.ageHours - a.ageHours)

  const delayed24h = delayedItems.length
  const delayed48h = delayedItems.filter((i) => i.ageHours >= 48).length
  const delayed72h = delayedItems.filter((i) => i.ageHours >= 72).length

  const returnBacklog24h = ((returnsRaw ?? []) as any[]).filter((r) => {
    const ageHours = Math.floor((now - new Date(r.created_at).getTime()) / (1000 * 60 * 60))
    return ageHours >= 24
  }).length

  const planBacklog48h = ((planRaw ?? []) as any[]).filter((r) => {
    const ageHours = Math.floor((now - new Date(r.created_at).getTime()) / (1000 * 60 * 60))
    return ageHours >= 48
  }).length

  const producerDelayMap = new Map<string, { producerId: string; producerName: string; delayedCount: number }>()
  for (const item of delayedItems) {
    const key = item.producerId
    const existing = producerDelayMap.get(key)
    if (!existing) {
      producerDelayMap.set(key, {
        producerId: item.producerId,
        producerName: item.producerName,
        delayedCount: 1,
      })
    } else {
      existing.delayedCount += 1
    }
  }
  const topDelayedProducers = Array.from(producerDelayMap.values())
    .sort((a, b) => b.delayedCount - a.delayedCount)
    .slice(0, 8)

  return {
    delayed24h,
    delayed48h,
    delayed72h,
    returnBacklog24h,
    planBacklog48h,
    delayedItems: delayedItems.slice(0, 30),
    topDelayedProducers,
  }
}
