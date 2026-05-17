'use client'

import { useTranslations } from 'next-intl'

export type RegionLabelFallback = {
  name: string
  specialty: string
}

/** Localized region card title + specialty line (canonical English stays in CMS/demo for lookups). */
export function useRegionLabels(slug: string, fallback: RegionLabelFallback) {
  const t = useTranslations('regions.catalog')
  const nameKey = `${slug}.name`
  const specialtyKey = `${slug}.specialty`

  return {
    name: t.has(nameKey) ? t(nameKey) : fallback.name,
    specialty: t.has(specialtyKey) ? t(specialtyKey) : fallback.specialty,
  }
}
