import type { Metadata } from 'next'
import { SavoirFaireClient } from './SavoirFaireClient'

export const metadata: Metadata = {
  title: 'Savoir-Faire — Our Selection Process',
  description: 'How Terravoa discovers and verifies Europe\'s finest small-batch producers — through personal visits, rigorous authenticity checks, and direct partnerships.',
}

export default function SavoirFairePage() {
  return <SavoirFaireClient />
}
