import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function ProducerSupportPage() {
  const t = await getTranslations('producerPortal.support')

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm max-w-xl mb-8">
        {t('subtitle')}
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center rounded-full bg-primary text-on-primary px-6 py-3 font-sans text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {t('contactLink')}
      </Link>
    </div>
  )
}
