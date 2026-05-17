'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { MagneticWrapper } from '@/components/ui/MagneticWrapper'
import { FilmGrain } from '@/components/ui/FilmGrain'
import { motionDurations, motionEase } from '@/lib/motion/tokens'

export function Hero() {
  const t = useTranslations('home.hero')
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [hasScrolled, setHasScrolled] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '28%'],
  )
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? ['0%', '0%'] : ['0%', '12%'],
  )
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 48) setHasScrolled(true)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const titleText = t('title')
  const words = titleText.split(' ')
  const wordStagger = reducedMotion ? 0 : 0.12

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[700px] overflow-hidden flex flex-col justify-end"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <motion.div className="absolute inset-0 scale-[1.15] hero-ken-burns">
          <Image
            src="/images/hero/hero-landscape.png"
            alt={t('imageAlt')}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      <FilmGrain />

      <motion.div
        className="relative z-20 px-8 md:px-16 pb-20 md:pb-28 max-w-6xl"
        style={{ y: textY, opacity }}
      >
        <motion.div
          className="flex items-center gap-5 mb-8"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: reducedMotion ? 0 : motionDurations.cinematic,
            delay: reducedMotion ? 0 : 0.2,
            ease: motionEase.smooth,
          }}
        >
          <div className="h-px w-16 bg-secondary shrink-0" />
          <span className="font-sans text-[10px] uppercase tracking-[0.38em] text-white/55">
            {t('kicker')}
          </span>
        </motion.div>

        <h1
          className="font-serif text-white leading-[0.95] mb-10"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)' }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.14em]">
              <motion.span
                className="inline-block mr-[0.2em]"
                initial={{ y: reducedMotion ? 0 : '105%', opacity: reducedMotion ? 1 : 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: reducedMotion ? 0 : motionDurations.cinematic,
                  delay: reducedMotion ? 0 : 0.35 + i * wordStagger,
                  ease: motionEase.dramatic,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="font-sans text-sm text-white/60 font-light max-w-xl leading-relaxed mb-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : motionDurations.slow,
            delay: reducedMotion ? 0 : 0.78,
            ease: motionEase.smooth,
          }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0 : motionDurations.slow,
            delay: reducedMotion ? 0 : 0.95,
            ease: motionEase.smooth,
          }}
        >
          <MagneticWrapper strength={reducedMotion ? 0 : 0.32}>
            <Link
              href="/collection"
              className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold bg-secondary hover:bg-secondary-container transition-colors duration-300 px-8 py-4 rounded-full text-on-secondary"
            >
              {t('shopCta')}
            </Link>
          </MagneticWrapper>
          <MagneticWrapper strength={reducedMotion ? 0 : 0.28}>
            <Link
              href="/collection"
              className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium border border-white/35 hover:border-white/65 hover:bg-white/8 transition-all duration-300 px-8 py-4 rounded-full text-white"
            >
              {t('producersCta')}
            </Link>
          </MagneticWrapper>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!hasScrolled && !reducedMotion && (
          <motion.div
            className="absolute bottom-10 right-10 z-20 flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 1.4, duration: motionDurations.slow }}
          >
            <span
              className="font-sans text-[9px] uppercase tracking-[0.32em] text-white/35"
              style={{ writingMode: 'vertical-rl' }}
            >
              {t('scrollHint')}
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={13} strokeWidth={1.5} className="text-white/35" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 font-serif italic text-white/25 text-sm tracking-wide whitespace-nowrap hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: reducedMotion ? 0 : 1.8,
          duration: reducedMotion ? 0 : motionDurations.cinematic,
        }}
      >
        {t('tagline')}
      </motion.p>
    </section>
  )
}
