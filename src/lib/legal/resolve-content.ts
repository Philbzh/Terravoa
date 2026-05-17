import { LegalSections } from '@/components/legal/LegalSections'
import { getLegalSections } from '@/content/legal/data'
import type { LegalLocale } from '@/lib/legal/types'
import { createElement } from 'react'

export type LegalSlug = 'privacy' | 'terms' | 'returns' | 'cookies'

function isLegalLocale(locale: string): locale is LegalLocale {
  return locale === 'en' || locale === 'de' || locale === 'fr' || locale === 'it' || locale === 'es' || locale === 'pt'
}

export async function resolveLegalContent(slug: LegalSlug, locale: string) {
  const resolvedLocale: LegalLocale = isLegalLocale(locale) ? locale : 'en'
  const sections = getLegalSections(slug, resolvedLocale)

  return {
    Component: function LegalContentSections() {
      return createElement(LegalSections, { sections })
    },
    resolvedLocale,
  }
}
