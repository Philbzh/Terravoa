import type { Metadata } from 'next'
import { ForProducersClient } from './ForProducersClient'

export const metadata: Metadata = {
  title: 'For Producers — Join Terravoa',
  description: 'Sell your artisan products across Europe. Terravoa connects authentic small-batch producers with discerning customers who value true origin.',
}

export default function ForProducersPage() {
  return <ForProducersClient />
}
