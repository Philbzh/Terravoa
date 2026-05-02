'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import type { Story } from '@/data/demo'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

type Props = {
  story: Story
}

export function StoryOfTheWeek({ story }: Props) {
  const t = useTranslations('home.journalTeaser')
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const imageYSpring = useSpring(imageY, { stiffness: 80, damping: 20 })

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-36 px-6 md:px-16 bg-surface overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-20 items-center">
        {/* ── Left — stacked image treatment ── */}
        <motion.div
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Background accent rectangle */}
          <div className="absolute -bottom-6 -right-6 w-[85%] h-[85%] bg-secondary/8 rounded-lg z-0" />

          {/* Main image with parallax */}
          <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-[0_40px_80px_rgba(24,42,27,0.16)] relative z-10 -rotate-1 group">
            <motion.div className="absolute inset-0 scale-[1.15]" style={{ y: imageYSpring }}>
              <Image
                src={story.imageSrc}
                alt={story.imageAlt || story.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 42vw"
                unoptimized={isExternalUnoptimizedSrc(story.imageSrc)}
              />
            </motion.div>
          </div>

          {/* Read time badge */}
          <motion.div
            className="absolute bottom-10 -right-4 z-20 bg-surface rounded-lg shadow-lg px-4 py-3 border border-outline-variant/15"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-on-surface-variant mb-0.5">
              Reading time
            </p>
            <p className="font-serif text-lg text-primary leading-none">5 min</p>
          </motion.div>
        </motion.div>

        {/* ── Right — editorial text ── */}
        <motion.div
          className="lg:col-span-7 flex flex-col justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Kicker */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-14 bg-secondary shrink-0" />
            <span className="font-sans text-xs uppercase tracking-[0.22em] text-secondary font-semibold">
              {t('kicker')}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-serif text-primary leading-[0.95] mb-7"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
          >
            {story.title}
          </h2>

          {/* Pull quote / subtitle */}
          <blockquote className="relative pl-6 border-l-2 border-secondary/30 mb-8">
            <p className="font-serif italic text-lg md:text-xl text-on-surface-variant leading-relaxed">
              {story.subtitle}
            </p>
          </blockquote>

          {/* Excerpt */}
          <p className="font-sans text-sm text-on-surface/70 leading-relaxed mb-10 max-w-lg">
            {story.excerpt}
          </p>

          {/* CTA */}
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] font-semibold text-primary group w-fit"
          >
            <span className="border-b border-primary/20 pb-1 group-hover:border-secondary group-hover:text-secondary transition-colors duration-300">
              {t('readCta')}
            </span>
            <ArrowRight
              size={13}
              strokeWidth={2}
              className="text-secondary group-hover:translate-x-2 transition-transform duration-300"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
