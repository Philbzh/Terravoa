'use client'

import { useLocale, useTranslations } from 'next-intl'
import { REGION_NAME_TO_SLUG } from '@/lib/i18n/collection-labels'

export const PRODUCER_SPECIALTY_TO_KEY: Record<string, string> = {
  'Olive Oil': 'oliveOil',
  Honey: 'honey',
  Preserves: 'preserves',
  Ceramics: 'ceramics',
  'Savon & Lavender': 'savonLavender',
  'Body Care': 'bodyCare',
  Spices: 'spices',
}

const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  Italy: 'IT',
  France: 'FR',
  Germany: 'DE',
  Spain: 'ES',
  Portugal: 'PT',
  Austria: 'AT',
  Greece: 'GR',
  Switzerland: 'CH',
  Netherlands: 'NL',
  Belgium: 'BE',
}

export function useProducerDisplayLabels() {
  const locale = useLocale()
  const tSpecialties = useTranslations('producersPage.specialties')
  const tRegionCatalog = useTranslations('regions.catalog')
  const tCatalog = useTranslations('producersPage.catalog')

  const labelRegion = (region: string) => {
    const slug = REGION_NAME_TO_SLUG[region]
    const key = slug ? `${slug}.name` : ''
    if (slug && tRegionCatalog.has(key)) return tRegionCatalog(key)
    return region
  }

  const labelSpecialty = (specialty: string) => {
    const key = PRODUCER_SPECIALTY_TO_KEY[specialty]
    if (key && tSpecialties.has(key)) return tSpecialties(key)
    return specialty
  }

  const labelCountry = (country: string) => {
    const iso = COUNTRY_NAME_TO_ISO[country]
    if (!iso) return country
    try {
      return new Intl.DisplayNames([locale], { type: 'region' }).of(iso) ?? country
    } catch {
      return country
    }
  }

  const labelTagline = (slug: string, fallback: string) => {
    const key = `${slug}.tagline`
    if (tCatalog.has(key)) return tCatalog(key)
    return fallback
  }

  return { labelRegion, labelSpecialty, labelCountry, labelTagline }
}
