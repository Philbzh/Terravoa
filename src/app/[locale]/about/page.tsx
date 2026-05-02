import type { Metadata } from 'next'
import { AboutClient } from './AboutClient'

export const metadata: Metadata = {
  title: 'About Terravoa',
  description: 'Terravoa was born from a simple belief: true taste begins at the origin. We carefully select Europe\'s most authentic producers and connect them directly with those who seek authenticity — products defined by soil, climate, heritage, and craftsmanship.',
}

export default function AboutPage() {
  return <AboutClient />
}
