'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Region } from '@/data/demo'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'

export function RegionsClient({ regions }: { regions: Region[] }) {
  const t = useTranslations('regions')

  return (
    <PageContainer>
      <SectionHeader
        kicker={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regions.map((region, i) => (
          <motion.div
            key={region.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i === 0 ? 0 : (i % 2) * 0.1 }}
            className={i === 0 ? 'md:col-span-2' : ''}
          >
            <Link href={`/regions/${region.slug}`} className="block">
              <div className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'h-[400px]' : 'h-[300px]'}`}>
                <Image
                  src={region.imageSrc}
                  alt={region.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={i === 0 ? '(max-width: 768px) 100vw, 100vw' : '(max-width: 768px) 100vw, 50vw'}
                  priority={i === 0}
                  unoptimized={isExternalUnoptimizedSrc(region.imageSrc)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 z-10 max-w-[90%]">
                  <h3 className="font-serif text-3xl text-white mb-1">{region.name}</h3>
                  <p className="text-white/80 text-sm font-sans uppercase tracking-[0.15em] mb-3">
                    {region.specialty}
                  </p>
                  <p className="text-white/60 text-sm font-sans max-w-md">
                    {region.description}
                  </p>
                </div>
                <div className="absolute top-6 right-6 z-10 flex gap-4">
                  <span className="text-white/60 text-xs font-sans uppercase tracking-wider">
                    {region.producerCount} {t('producers')}
                  </span>
                  <span className="text-white/60 text-xs font-sans uppercase tracking-wider">
                    {region.productCount} {t('products')}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  )
}
