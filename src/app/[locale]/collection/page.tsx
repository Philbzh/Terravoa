import type { Metadata } from 'next'
import { CollectionClient } from './CollectionClient'
import { getAllProducts, getAllProducers } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Collection',
  description: 'Browse our curated collection of artisan products, sourced directly from Europe\'s finest small-batch producers.',
}

export default async function CollectionPage() {
  const [products, producers] = await Promise.all([
    getAllProducts(),
    getAllProducers(),
  ])
  return <CollectionClient products={products} producers={producers} />
}
