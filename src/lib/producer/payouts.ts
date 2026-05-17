import { createAdminClient } from '@/lib/supabase/admin'

export type ProducerPayoutRow = {
  id: string
  order_id: string
  quantity: number
  price: number
  commission_cents: number
  commission_rate_pct: number | null
  payout_status: string | null
  created_at: string
  products: { name: string } | null
  orders: { created_at: string } | null
}

export async function getProducerPayoutHistory(producerId: string): Promise<ProducerPayoutRow[]> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('order_items')
    .select(
      'id, order_id, quantity, price, commission_cents, commission_rate_pct, payout_status, created_at, products(name), orders(created_at)',
    )
    .eq('producer_id', producerId)
    .order('created_at', { ascending: false })
    .limit(100)

  return (data ?? []) as ProducerPayoutRow[]
}

export function producerNetCents(row: ProducerPayoutRow) {
  const gross = row.price * row.quantity
  const commission =
    row.commission_cents ??
    Math.round(gross * ((row.commission_rate_pct ?? 0) / 100))
  return gross - commission
}
