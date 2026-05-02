import 'server-only'

import { createClient, type SanityClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export function isSanityConfigured(): boolean {
  if (process.env.NEXT_PUBLIC_SANITY_FORCE_DEMO === '1') return false
  return projectId.trim().length > 0
}

export const sanityClient: SanityClient = createClient({
  projectId: projectId || 'missing',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})
