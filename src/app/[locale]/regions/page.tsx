import type { Metadata } from 'next'
import { RegionsClient } from './RegionsClient'
import { getAllRegions } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Regions',
  description: 'Explore the European regions we source from — each with its own terroir, climate, and centuries-old tradition.',
}

export default async function RegionsPage() {
  const regions = await getAllRegions()
  return <RegionsClient regions={regions} />
}
