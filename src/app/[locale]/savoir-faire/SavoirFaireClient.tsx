'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Search, Users, ShieldCheck, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageContainer } from '@/components/ui/PageContainer'

export function SavoirFaireClient() {
  const t = useTranslations('savoirFaire')

  const steps = [
    { icon: Search, number: '01', titleKey: 'step1Title' as const, descKey: 'step1Desc' as const },
    { icon: Users, number: '02', titleKey: 'step2Title' as const, descKey: 'step2Desc' as const },
    { icon: ShieldCheck, number: '03', titleKey: 'step3Title' as const, descKey: 'step3Desc' as const },
    { icon: Heart, number: '04', titleKey: 'step4Title' as const, descKey: 'step4Desc' as const },
  ]

  return (
    <PageContainer>
      <motion.div
        className="max-w-3xl mx-auto text-center mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary mb-6 inline-block">
          {t('kicker')}
        </span>
        <h1
          className="font-serif text-primary mb-8 leading-[0.94]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          {t('title')}
        </h1>
        <p className="text-on-surface/80 font-sans text-lg leading-relaxed">
          {t('intro')}
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto space-y-16 mb-24">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.number}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="md:col-span-2">
                <span className="font-serif text-5xl text-outline-variant/40">
                  {step.number}
                </span>
              </div>
              <div className="md:col-span-10">
                <Icon size={28} strokeWidth={1.2} className="text-secondary mb-4" />
                <h3 className="font-serif text-2xl text-primary mb-3">{t(step.titleKey)}</h3>
                <p className="text-on-surface/70 font-sans leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl text-on-primary mb-4">
          {t('ctaTitle')}
        </h2>
        <p className="text-on-primary-container font-sans mb-8 max-w-lg mx-auto">
          {t('ctaDesc')}
        </p>
        <Link
          href="/for-producers"
          className="inline-flex bg-secondary hover:bg-secondary-container transition-colors duration-300 px-10 py-4 rounded-full text-on-secondary font-sans font-semibold text-[11px] uppercase tracking-[0.2em]"
        >
          {t('ctaButton')}
        </Link>
      </div>
    </PageContainer>
  )
}
