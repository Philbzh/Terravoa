import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageContainer } from '@/components/ui/PageContainer'
import { Package, Truck, Globe, Clock, CreditCard, ShieldCheck, Thermometer, MapPin, AlertCircle } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'shipping' })
  return {
    title: t('title'),
    description: t('heroDescription'),
  }
}

export default async function ShippingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('shipping')

  const shippingInfo = [
    { icon: Truck, title: t('directTitle'), description: t('directDesc') },
    { icon: Package, title: t('separateTitle'), description: t('separateDesc') },
    { icon: Clock, title: t('timesTitle'), description: t('timesDesc') },
    { icon: Globe, title: t('areasTitle'), description: t('areasDesc') },
  ]

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-4 text-center">
          {t('title')}
        </h1>
        <p className="text-on-surface-variant font-sans text-center mb-3 max-w-xl mx-auto">
          {t('heroSubtitle')}
        </p>
        <p className="text-on-surface-variant/70 font-sans text-sm text-center mb-6 max-w-lg mx-auto">
          {t('heroDescription')}
        </p>
        <p className="text-on-surface-variant font-sans text-xs text-center mb-16">
          {t('lastUpdated')}
        </p>

        {/* Core shipping facts */}
        <div className="space-y-8 mb-16">
          {shippingInfo.map((info) => {
            const Icon = info.icon
            return (
              <div key={info.title} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
                  <Icon size={22} strokeWidth={1.2} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-primary mb-2">
                    {info.title}
                  </h3>
                  <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                    {info.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Shipping costs */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <h3 className="font-serif text-xl text-primary mb-4">{t('costsTitle')}</h3>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <div className="flex justify-between py-2 border-b border-outline-variant/10">
              <span>{t('costsUnder50')}</span>
              <span className="text-primary font-medium">{t('costsUnder50Price')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-outline-variant/10">
              <span>{t('costs50to99')}</span>
              <span className="text-primary font-medium">{t('costs50to99Price')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>{t('costsOver100')}</span>
              <span className="text-secondary font-medium">{t('costsOver100Price')}</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-sans text-xs mt-4">
            {t('costsNote')}
          </p>
        </div>

        {/* Temperature-controlled delivery */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <Thermometer size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">{t('tempTitle')}</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>{t('tempDesc1')}</p>
            <p>{t('tempDesc2')}</p>
            <p>{t('tempDesc3')}</p>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <MapPin size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">{t('trackingTitle')}</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>{t('trackingDesc1')}</p>
            <p>{t('trackingDesc2')}</p>
          </div>
        </div>

        {/* Lost parcels */}
        <div className="bg-surface-container-low rounded-xl p-8 mb-8">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <AlertCircle size={20} strokeWidth={1.2} className="text-secondary" />
            </div>
            <h3 className="font-serif text-xl text-primary mt-1">{t('lostTitle')}</h3>
          </div>
          <div className="space-y-3 font-sans text-sm text-on-surface/70">
            <p>{t('lostDesc1')}</p>
            <p>
              {t('lostDesc2', {
                email: 'hello@terravoa.com',
              })}
            </p>
            <p>{t('lostDesc3')}</p>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-surface-container-low rounded-xl p-8">
          <h3 className="font-serif text-xl text-primary mb-4">{t('paymentTitle')}</h3>
          <div className="space-y-4 font-sans text-sm text-on-surface/70">
            <div className="flex gap-4 items-start">
              <CreditCard size={18} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
              <p>{t('paymentDesc1')}</p>
            </div>
            <div className="flex gap-4 items-start">
              <ShieldCheck size={18} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
              <p>{t('paymentDesc2')}</p>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  )
}
