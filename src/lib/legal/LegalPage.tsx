import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { LegalSections } from '@/components/legal/LegalSections'
import { getLegalSections, type LegalSlug } from '@/content/legal/data'
import type { LegalLocale } from '@/lib/legal/types'

function isLegalLocale(locale: string): locale is LegalLocale {
  return locale === 'en' || locale === 'de' || locale === 'fr' || locale === 'it' || locale === 'es' || locale === 'pt'
}

type Props = {
  slug: LegalSlug
  params: Promise<{ locale: string }>
}

export function createLegalMetadata(slug: LegalSlug) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>
  }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: `legalPages.${slug}` })
    return {
      title: t('metaTitle'),
      description: t('metaDescription'),
    }
  }
}

export async function LegalPage({ slug, params }: Props) {
  const { locale } = await params
  const tPage = await getTranslations({ locale, namespace: `legalPages.${slug}` })
  const tCommon = await getTranslations({ locale, namespace: 'legalPages' })
  const resolvedLocale: LegalLocale = isLegalLocale(locale) ? locale : 'en'
  const sections = getLegalSections(slug, resolvedLocale)
  const showFallback = resolvedLocale === 'en' && locale !== 'en'

  return (
    <LegalPageShell
      title={tPage('title')}
      lastUpdated={tPage('lastUpdated')}
      fallbackNotice={showFallback ? tCommon('fallbackNotice') : null}
    >
      <LegalSections sections={sections} />
    </LegalPageShell>
  )
}
