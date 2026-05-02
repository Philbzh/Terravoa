import type { AppLocale } from '@/i18n/routing'

/** BCP 47-style tags for Open Graph `locale` / `alternateLocale`. */
export function openGraphLocaleForAppLocale(locale: string): string {
  const map: Record<AppLocale, string> = {
    en: 'en_GB',
    de: 'de_DE',
    fr: 'fr_FR',
    it: 'it_IT',
    es: 'es_ES',
    pt: 'pt_PT',
  }
  return map[locale as AppLocale] ?? 'en_GB'
}
