'use client'

import { useTranslations } from 'next-intl'

/** Canonical English category strings from CMS/demo → message key under collectionPage.categories */
export const CATEGORY_TO_KEY: Record<string, string> = {
  Oils: 'oils',
  Honey: 'honey',
  Preserves: 'preserves',
  Ceramics: 'ceramics',
  'Body Care': 'bodyCare',
  Spices: 'spices',
  Spreads: 'spreads',
  'Pâte à tartiner': 'spreads',
}

/** Region display names from CMS → regions.catalog slug */
export const REGION_NAME_TO_SLUG: Record<string, string> = {
  Brittany: 'brittany',
  Tuscany: 'tuscany',
  'Black Forest': 'black-forest',
  Andalusia: 'andalusia',
  Alentejo: 'alentejo',
  Alsace: 'alsace',
  Provence: 'provence',
}

const BADGE_LABEL_TO_KEY: Record<string, string> = {
  Organic: 'organic',
  Bestseller: 'bestseller',
  New: 'new',
  Limited: 'limited',
  Seasonal: 'seasonal',
  Sale: 'sale',
  'Pre-order': 'preorder',
  Subscription: 'subscription',
}

export function useProductBadgeLabel(label: string) {
  const t = useTranslations('productBadges')
  if (!label) return label
  const key = BADGE_LABEL_TO_KEY[label]
  if (key && t.has(key)) return t(key)
  return label
}
