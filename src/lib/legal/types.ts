export type LegalTextPart =
  | { text: string }
  | { mailto: string; label?: string }
  | { href: string; label: string; external?: boolean }
  | { internal: string; label: string }

export type LegalBlock =
  | { type: 'p'; parts: LegalTextPart[] }
  | { type: 'ul'; items: Array<{ strong?: string; text: string } | string> }
  | { type: 'ol'; items: LegalTextPart[][] }
  | { type: 'h3'; text: string }
  | { type: 'box'; title?: string; parts: LegalTextPart[]; italic?: boolean }
  | { type: 'cookieEntries'; entries: Array<{ codes: string[]; title?: string; body: string }> }
  | { type: 'cta'; title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }

export type LegalSection = {
  heading: string
  blocks: LegalBlock[]
}

export type LegalLocale = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt'

export const LEGAL_LOCALES: LegalLocale[] = ['en', 'de', 'fr', 'it', 'es', 'pt']
