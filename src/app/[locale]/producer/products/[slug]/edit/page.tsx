import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { EditProductForm } from './EditProductForm'

type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  origin: string
  description: string
  details: string[]
  image_src: string
  image_alt: string
  stock_quantity: number | null
  producer_id: string
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getProducerForSession()
  if (!session?.producer) return notFound()

  const admin = createAdminClient() as any
  const { data } = await admin
    .from('products')
    .select('id, name, slug, price, category, origin, description, details, image_src, image_alt, stock_quantity, producer_id')
    .eq('slug', slug)
    .eq('producer_id', session.producer.id)
    .maybeSingle()

  const product = data as ProductRow | null
  if (!product) return notFound()

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-8">Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  )
}
