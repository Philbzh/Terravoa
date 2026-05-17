import type { LegalLocale, LegalSection } from '@/lib/legal/types'
import { cookiesSections } from './cookies'
import { privacySections } from './privacy'
import { returnsSections } from './returns'
import { termsSections } from './terms'

export type LegalSlug = 'privacy' | 'terms' | 'returns' | 'cookies'

const sectionsBySlug: Record<LegalSlug, Record<LegalLocale, LegalSection[]>> = {
  privacy: privacySections,
  terms: termsSections,
  returns: returnsSections,
  cookies: cookiesSections,
}

export function getLegalSections(slug: LegalSlug, locale: LegalLocale): LegalSection[] {
  return sectionsBySlug[slug][locale]
}
