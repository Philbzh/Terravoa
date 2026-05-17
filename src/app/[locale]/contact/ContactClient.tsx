'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageContainer } from '@/components/ui/PageContainer'
import { ContactForm } from './ContactForm'

export function ContactClient() {
  const t = useTranslations('contact')

  return (
    <PageContainer>
      <motion.div
        className="max-w-3xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="font-serif text-primary mb-4 leading-[0.96]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4rem)' }}
        >
          {t('title')}
        </h1>
        <p className="text-on-surface-variant font-sans">
          {t('subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 max-w-5xl mx-auto items-start">
        <ContactForm />

        <motion.div
          className="lg:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-surface-container-low rounded-xl p-8">
            <Mail size={20} strokeWidth={1.5} className="text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-2">{t('emailTitle')}</h3>
            <p className="text-on-surface-variant font-sans text-sm">
              {t('emailValue')}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-8">
            <MapPin size={20} strokeWidth={1.5} className="text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-2">{t('locationTitle')}</h3>
            <p className="text-on-surface-variant font-sans text-sm whitespace-pre-line">
              {t('locationValue')}
            </p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-8">
            <Clock size={20} strokeWidth={1.5} className="text-secondary mb-3" />
            <h3 className="font-serif text-lg text-primary mb-2">{t('responseTitle')}</h3>
            <p className="text-on-surface-variant font-sans text-sm">
              {t('responseValue')}
            </p>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  )
}
