import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'

export async function GET() {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('order_items')
    .select(
      'id, quantity, price, order_id, product_id, products(name), orders(customer_name, status, created_at)',
    )
    .eq('producer_id', session.producer.id)
    .order('order_id', { ascending: false })
    .limit(8)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}
