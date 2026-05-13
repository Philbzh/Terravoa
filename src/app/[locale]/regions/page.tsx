import type { Metadata } from 'next'
import { RegionsClient } from './RegionsClient'
import { getAllRegions } from '@/lib/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Origins — Discover European Regions',
  description: 'Explore the regions behind our producers — their terroir, traditions, and the culture that shapes artisan food across Europe.',
}

export default async function RegionsPage() {
  const regions = await getAllRegions()
  return <RegionsClient regions={regions} />
}
