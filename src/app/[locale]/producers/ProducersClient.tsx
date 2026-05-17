'use client'

import { useState, useRef } from 'react'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import type { Producer } from '@/data/demo'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useProducerDisplayLabels } from '@/lib/i18n/producer-labels'
import { SectionHeader } from '@/components/ui/SectionHeader'

type LabelFns = ReturnType<typeof useProducerDisplayLabels>

function ProducerCard({
  producer,
  index,
  t,
  labels,
}: {
  producer: Producer
  index: number
  t: ReturnType<typeof useTranslations<'producersPage'>>
  labels: LabelFns
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 280, damping: 28 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 280, damping: 28 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  const isUnoptimized =
    producer.imageSrc.startsWith('https://cdn.sanity.io') ||
    producer.imageSrc.startsWith('https://')

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        <Link
          href={`/producers/${producer.slug}`}
          className="group block bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-[0_28px_80px_rgba(24,42,27,0.13)] transition-shadow duration-500 h-full"
        >
          <motion.div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={producer.imageSrc}
              alt={producer.imageAlt || producer.name}
              fill
              className="object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={isUnoptimized}
            />
            <motion.div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <motion.div className="absolute top-4 left-4">
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/70 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {labels.labelRegion(producer.region)}
              </span>
            </motion.div>

            <motion.div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="font-serif text-2xl text-white">{producer.name}</h3>
            </motion.div>
          </motion.div>

          <motion.div className="px-6 py-5 flex items-center justify-between gap-4">
            <p className="font-sans text-sm text-on-surface-variant line-clamp-1 flex-1">
              {labels.labelSpecialty(producer.specialty)}
            </p>
            <span className="shrink-0 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.15em] text-secondary group-hover:gap-3 transition-all duration-300">
              {t('view')} <ArrowRight size={12} strokeWidth={2} />
            </span>
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function HeroCard({
  producer,
  t,
  labels,
}: {
  producer: Producer
  t: ReturnType<typeof useTranslations<'producersPage'>>
  labels: LabelFns
}) {
  const src = producer.heroImageSrc || producer.imageSrc
  const isUnoptimized = src.startsWith('https://')

  return (
    <motion.div
      className="col-span-1 md:col-span-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
    >
      <Link
        href={`/producers/${producer.slug}`}
        className="group block bg-surface-container-low rounded-2xl overflow-hidden hover:shadow-[0_30px_90px_rgba(24,42,27,0.15)] transition-shadow duration-500"
      >
        <motion.div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
          <Image
            src={src}
            alt={producer.imageAlt || producer.name}
            fill
            priority
            className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 70vw"
            unoptimized={isUnoptimized}
          />
          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <motion.div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          <motion.div className="absolute top-6 left-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-secondary px-3 py-1.5 rounded-full border border-secondary/40 bg-secondary/8 backdrop-blur-sm">
              {t('featuredProducer')}
            </span>
          </motion.div>

          <motion.div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/55 mb-3">
              {labels.labelRegion(producer.region)}, {labels.labelCountry(producer.country)}
            </p>
            <h3
              className="font-serif text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {producer.name}
            </h3>
            <p className="font-sans text-sm md:text-base text-white/65 font-light italic max-w-lg leading-relaxed">
              {labels.labelTagline(producer.slug, producer.tagline)}
            </p>
          </motion.div>
        </motion.div>

        <motion.div className="px-8 md:px-10 py-6 flex items-center justify-between gap-6">
          <motion.div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant/55 mb-1">
              {labels.labelRegion(producer.region)} · {labels.labelCountry(producer.country)}
            </p>
            <p className="font-sans text-sm text-on-surface-variant">
              {labels.labelSpecialty(producer.specialty)}
            </p>
          </motion.div>
          <span className="shrink-0 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary group-hover:gap-4 transition-all duration-300">
            {t('discover')} <ArrowRight size={13} strokeWidth={2} />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function ProducersClient({ producers }: { producers: Producer[] }) {
  const t = useTranslations('producersPage')
  const labels = useProducerDisplayLabels()
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const regions = Array.from(new Set(producers.map((p) => p.region))).sort()

  const filtered = activeRegion
    ? producers.filter((p) => p.region === activeRegion)
    : producers

  const [hero, ...rest] = filtered

  return (
    <div className="pt-32 pb-24 px-6 md:px-16 max-w-7xl mx-auto">
      <SectionHeader
        kicker={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {regions.length > 1 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
        >
          <button
            onClick={() => setActiveRegion(null)}
            className={`font-sans text-xs uppercase tracking-[0.16em] px-4 py-2 rounded-full border transition-all duration-200 ${
              !activeRegion
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/35 hover:text-primary'
            }`}
          >
            {t('allFilter')}
          </button>
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region === activeRegion ? null : region)}
              className={`font-sans text-xs uppercase tracking-[0.16em] px-4 py-2 rounded-full border transition-all duration-200 ${
                activeRegion === region
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/35 hover:text-primary'
              }`}
            >
              {labels.labelRegion(region)}
            </button>
          ))}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-serif text-2xl text-on-surface-variant/50">
              {t('emptyState')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeRegion ?? 'all'}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {hero && !activeRegion && <HeroCard producer={hero} t={t} labels={labels} />}

            {(activeRegion ? filtered : rest).map((producer, i) => (
              <ProducerCard key={producer.slug} producer={producer} index={i} t={t} labels={labels} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
