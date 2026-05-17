import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const limited = await rateLimit(`product-view:${ip}`, 120, 60_000)
  if (!limited.success) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  let body: { slug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const slug = String(body.slug ?? '').trim()
  if (!slug || slug.length > 120) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: product } = await (admin as any)
    .from('products')
    .select('id, producer_id')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle() as { data: { id: string; producer_id: string } | null }

  if (!product?.id || !product.producer_id) {
    return NextResponse.json({ ok: true })
  }

  await (admin as any).from('product_views').insert({
    product_id: product.id,
    producer_id: product.producer_id,
  })

  return NextResponse.json({ ok: true })
}
