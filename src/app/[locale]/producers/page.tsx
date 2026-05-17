import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ProducersClient } from './ProducersClient'
import { getAllProducers } from '@/lib/content'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'producersPage' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function ProducersPage() {
  const producers = await getAllProducers()
  return <ProducersClient producers={producers} />
}
