import type { Metadata } from 'next'
import { CollectionClient } from './CollectionClient'
import { CollectionBreadcrumb } from './CollectionBreadcrumb'
import { getAllProducts, getAllProducers } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The Collection',
  description: 'Browse our curated collection of artisan products, sourced directly from Europe\'s finest small-batch producers.',
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [products, producers] = await Promise.all([
    getAllProducts(),
    getAllProducers(),
  ])
  return (
    <>
      <CollectionBreadcrumb locale={locale} />
      <CollectionClient products={products} producers={producers} />
    </>
  )
}
