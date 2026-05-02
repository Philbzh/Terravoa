import { getProducerForSession } from '@/lib/producer/server'
import { getTranslations } from 'next-intl/server'
import { Globe, Clock, Package } from 'lucide-react'

async function getProducerShipping() {
  const session = await getProducerForSession()
  if (!session?.producer) return null
  return { name: session.producer.name }
}

export default async function ProducerShippingPage() {
  const data = await getProducerShipping()
  const t = await getTranslations('producerPortal.shipping')

  const settings = [
    {
      icon: Globe,
      title: t('shippingCountriesTitle'),
      description: t('shippingCountriesDesc'),
      status: t('shippingCountriesStatus'),
    },
    {
      icon: Clock,
      title: t('handlingTimeTitle'),
      description: t('handlingTimeDesc'),
      status: t('handlingTimeStatus'),
    },
    {
      icon: Package,
      title: t('packagingTitle'),
      description: t('packagingDesc'),
      status: t('packagingStatus'),
    },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm max-w-xl mb-8">
        {t('subtitle', { name: data?.name ?? '' })}
      </p>

      <div className="space-y-4 mb-10">
        {settings.map(({ icon: Icon, title, description, status }) => (
          <div
            key={title}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 md:p-6 flex gap-5 items-start"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
              <Icon size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="font-sans text-sm text-on-surface font-medium">{title}</h3>
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/60">
                  {status}
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-8 text-center">
        <p className="font-sans text-sm text-on-surface-variant">
          {t('comingSoon')}
        </p>
      </div>
    </div>
  )
}
