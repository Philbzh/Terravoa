'use client'

import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpenCheck, Leaf, Handshake, Globe, Award, Landmark } from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useTranslations } from 'next-intl'

const VALUE_KEYS = [
  'authenticity',
  'craftsmanship',
  'sustainability',
  'transparency',
  'excellence',
  'culturalPreservation',
] as const

const VALUE_ICONS = [BookOpenCheck, Award, Leaf, Handshake, Globe, Landmark]

const POSITIONING_KEYS = ['selection', 'story', 'connection'] as const

export function AboutClient() {
  const t = useTranslations('aboutPage')

  return (
    <PageContainer>
      <SectionHeader kicker={t('kicker')} title={t('title')} subtitle={t('subtitle')} />
      <motion.p
        className="max-w-2xl mx-auto text-center text-on-surface/70 font-sans text-lg leading-relaxed mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {t('intro')}
      </motion.p>

      <motion.div
        className="bg-primary text-on-primary rounded-2xl p-10 md:p-16 mb-24 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-on-primary/60 mb-4">
              {t('nameSection.kicker')}
            </p>
            <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-6">
              &ldquo;{t('nameSection.quote')}&rdquo;
            </p>
            <p className="font-sans text-on-primary/80 leading-relaxed">{t('nameSection.body')}</p>
          </motion.div>
          <motion.div className="space-y-6">
            <motion.div className="border-l-2 border-on-primary/30 pl-6">
              <p className="font-serif italic text-xl text-on-primary mb-1">{t('nameSection.terraTitle')}</p>
              <p className="font-sans text-sm text-on-primary/70">{t('nameSection.terraDesc')}</p>
            </motion.div>
            <motion.div className="border-l-2 border-on-primary/30 pl-6">
              <p className="font-serif italic text-xl text-on-primary mb-1">{t('nameSection.voaTitle')}</p>
              <p className="font-sans text-sm text-on-primary/70">{t('nameSection.voaDesc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="max-w-3xl mx-auto mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-serif text-primary mb-8 text-center"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {t('marketplace.title')}
        </h2>
        <motion.div className="space-y-6 text-on-surface/80 font-sans text-lg leading-relaxed">
          <p>{t('marketplace.p1')}</p>
          <p>{t('marketplace.p2')}</p>
          <p>{t('marketplace.p3')}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="mb-24 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
          <Image
            src="/images/hero/terrova-table.png"
            alt={t('heroImageAlt')}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1100px"
          />
          <motion.div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
          <motion.div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="font-serif text-2xl md:text-3xl text-white mb-2">{t('table.title')}</p>
            <p className="font-sans text-sm text-white/80 max-w-lg">{t('table.caption')}</p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="bg-surface-container-low rounded-2xl p-10 md:p-16 mb-24 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-secondary mb-4">
          {t('positioning.kicker')}
        </p>
        <p className="font-serif text-2xl md:text-3xl text-primary mb-8 leading-relaxed">
          {t('positioning.title')}
        </p>
        <motion.div className="grid md:grid-cols-3 gap-6 text-left">
          {POSITIONING_KEYS.map((key) => (
            <motion.div key={key} className="space-y-2">
              <p className="font-serif text-lg text-primary">{t(`positioning.${key}Label`)}</p>
              <p className="font-sans text-sm text-on-surface/70 leading-relaxed">
                {t(`positioning.${key}Desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div className="mb-24">
        <h2
          className="font-serif text-primary text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {t('valuesTitle')}
        </h2>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {VALUE_KEYS.map((key, i) => {
            const Icon = VALUE_ICONS[i]
            return (
              <motion.div
                key={key}
                className="bg-surface-container-low rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Icon size={26} strokeWidth={1.2} className="text-secondary mb-4" />
                <h3 className="font-serif text-xl text-primary mb-3">{t(`values.${key}.title`)}</h3>
                <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                  {t(`values.${key}.description`)}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      <motion.div className="text-center">
        <motion.div className="h-px w-12 bg-secondary mx-auto mb-8" />
        <h2
          className="font-serif text-primary mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          {t('cta.title')}
        </h2>
        <p className="text-on-surface-variant font-sans mb-8 max-w-lg mx-auto leading-relaxed">
          {t('cta.body')}
        </p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/for-producers"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
          >
            {t('cta.becomeProducer')}
          </Link>
          <Link
            href="/contact"
            className="font-sans text-sm text-on-surface-variant underline underline-offset-4 hover:text-secondary transition-colors"
          >
            {t('cta.contact')}
          </Link>
        </motion.div>
      </motion.div>
    </PageContainer>
  )
}
