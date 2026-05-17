import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CollectionClient } from './CollectionClient'
import { CollectionBreadcrumb } from './CollectionBreadcrumb'
import { getAllProducts, getAllProducers } from '@/lib/content'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'collectionPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [products, producers] = await Promise.all([
    getAllProducts(),
    getAllProducers(),
  ])
  return (
    <>
      <CollectionBreadcrumb locale={locale} />
      <CollectionClient products={products} producers={producers} />
    </>
  )
}
