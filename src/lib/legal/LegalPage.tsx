import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { resolveLegalContent, type LegalSlug } from '@/lib/legal/resolve-content'

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
  const { Component, resolvedLocale } = await resolveLegalContent(slug, locale)
  const showFallback = resolvedLocale === 'en' && locale !== 'en'

  return (
    <LegalPageShell
      title={tPage('title')}
      lastUpdated={tPage('lastUpdated')}
      fallbackNotice={showFallback ? tCommon('fallbackNotice') : null}
    >
      <Component />
    </LegalPageShell>
  )
}
