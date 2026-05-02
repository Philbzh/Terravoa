import type { Metadata } from 'next'
import { ApplyClient } from './ApplyClient'

export const metadata: Metadata = {
  title: 'Apply to Become a Producer',
  description: 'Apply to join Terravoa as a producer. We collaborate with carefully selected artisans across Europe who stand for authenticity, craftsmanship, and true origin.',
}

export default function ProducerApplicationPage() {
  return <ApplyClient />
}
