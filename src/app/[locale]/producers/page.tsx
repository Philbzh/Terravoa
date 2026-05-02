import type { Metadata } from 'next'
import { ProducersClient } from './ProducersClient'
import { getAllProducers } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Producers',
  description: 'Meet the artisan producers behind every Terravoa product — small-batch makers from across Europe.',
}

export default async function ProducersPage() {
  const producers = await getAllProducers()
  return <ProducersClient producers={producers} />
}
