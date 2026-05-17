import { getTranslations } from 'next-intl/server'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'

type Props = { locale: string }

export async function CollectionBreadcrumb({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' })
  return (
    <BreadcrumbJsonLd
      locale={locale}
      items={[{ name: t('collection'), path: '/collection' }]}
    />
  )
}
