'use client'

import { Link } from '@/i18n/navigation'
import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'
import { createPortal } from 'react-dom'

// ── Branded confetti ──────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#944925', '#182a1b', '#c4804a', '#d4b896', '#6b8e6b', '#e8d4b8']

type Particle = {
  id: number; x: number; y: number
  dx: number; dy: number; color: string; size: number; rotate: number
}

function makeParticles(originX: number, originY: number): Particle[] {
  return Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: originX,
    y: originY,
    dx: (Math.random() - 0.5) * 260,
    dy: -(Math.random() * 220 + 60),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 5 + Math.random() * 6,
    rotate: Math.random() * 540 - 270,
  }))
}

function Confetti({ particles }: { particles: Particle[] }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed pointer-events-none z-[9999] rounded-sm"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, scale: 0.4, rotate: p.rotate }}
          transition={{ duration: 0.75 + Math.random() * 0.45, ease: 'easeOut' }}
        />
      ))}
    </>,
    document.body,
  )
}

const discoverHrefs = ['/collection', '/regions', '/about', '/savoir-faire', '/for-producers'] as const
const discoverKeys = [
  'collection',
  'origins',
  'ourStory',
  'savoirFaire',
  'becomeProducer',
] as const

const supportHrefs = ['/shipping', '/returns', '/contact'] as const
const supportKeys = ['paymentDelivery', 'returns', 'contactUs'] as const

function NewsletterForm() {
  const t = useTranslations('footer')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [particles, setParticles] = useState<Particle[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        // Fire confetti from the submit button's position
        if (btnRef.current) {
          const rect = btnRef.current.getBoundingClientRect()
          setParticles(makeParticles(rect.left + rect.width / 2, rect.top + rect.height / 2))
          setTimeout(() => setParticles([]), 1400)
        }
        setState('done')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <AnimatePresence>
        {state === 'done' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans text-sm text-on-primary/60 leading-relaxed"
          >
            {t('newsletterSuccess')}
          </motion.p>
        )}
      </AnimatePresence>

      {state !== 'done' && (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center border-b border-on-primary/20 pb-3 group focus-within:border-secondary transition-colors duration-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              disabled={state === 'loading'}
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-full placeholder:text-on-primary/30 font-sans disabled:opacity-50 text-on-primary/80"
            />
            <motion.button
              ref={btnRef}
              type="submit"
              disabled={state === 'loading'}
              aria-label={t('subscribeAria')}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="shrink-0 w-8 h-8 rounded-full border border-on-primary/20 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors duration-300 text-on-primary/50 disabled:opacity-40"
            >
              <ArrowRight size={13} strokeWidth={2} />
            </motion.button>
          </div>
          {state === 'error' && (
            <p className="font-sans text-xs text-error mt-2 absolute top-full left-0">
              {t('newsletterError')}
            </p>
          )}
        </form>
      )}

      {particles.length > 0 && <Confetti particles={particles} />}
    </>
  )
}

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-primary text-on-primary overflow-hidden">
      {/* ── Large editorial statement ── */}
      <div className="relative border-b border-on-primary/8 px-6 md:px-16 py-16 md:py-20 overflow-hidden">
        {/* Giant ghosted text */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center overflow-hidden pointer-events-none"
        >
          <span
            className="font-serif text-on-primary/[0.04] leading-none select-none -ml-4"
            style={{ fontSize: 'clamp(8rem, 20vw, 18rem)' }}
          >
            Terravoa
          </span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-secondary mb-6">
              Taste the Origin
            </p>
            <h2
              className="font-serif text-on-primary leading-[0.9]"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}
            >
              Connecting artisans
              <br />
              <span className="text-on-primary/45">to curious tables.</span>
            </h2>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/terravoa-wordmark.png"
              alt={`${SITE_NAME} — Taste the Origin`}
              style={{
                height: 80,
                width: 'auto',
                maxWidth: 220,
                filter: 'brightness(0) invert(1)',
                opacity: 0.35,
              }}
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* ── Links + Newsletter grid ── */}
      <div className="px-6 md:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-on-primary/8">
        {/* Brand blurb */}
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-sans text-sm text-on-primary/50 leading-relaxed max-w-xs">
            {t('brand')}
          </p>
        </div>

        {/* Discover */}
        <div>
          <h4 className="font-sans text-[10px] uppercase tracking-[0.28em] text-on-primary/35 mb-7">
            {t('discoverTitle')}
          </h4>
          <ul className="space-y-4">
            {discoverHrefs.map((href, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-on-primary/60 hover:text-secondary transition-colors duration-300"
                >
                  {t(discoverKeys[i])}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Concierge */}
        <div>
          <h4 className="font-sans text-[10px] uppercase tracking-[0.28em] text-on-primary/35 mb-7">
            {t('conciergeTitle')}
          </h4>
          <ul className="space-y-4">
            {supportHrefs.map((href, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-sm text-on-primary/60 hover:text-secondary transition-colors duration-300"
                >
                  {t(supportKeys[i])}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-sans text-[10px] uppercase tracking-[0.28em] text-on-primary/35 mb-7">
            {t('newsletterTitle')}
          </h4>
          <p className="font-sans text-sm text-on-primary/50 leading-relaxed mb-6">
            {t('newsletterDesc')}
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-6 md:px-16 py-7 flex flex-col md:flex-row justify-between items-center gap-5">
        <p className="font-sans text-[11px] text-on-primary/30">
          &copy; {new Date().getFullYear()} {SITE_NAME}. {t('copyright')}
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {(
            [
              { href: '/terms', key: 'terms' },
              { href: '/privacy', key: 'privacy' },
              { href: '/cookies', key: 'cookies' },
              { href: '/imprint', key: 'imprint' },
            ] as { href: string; key: 'terms' | 'privacy' | 'cookies' | 'imprint' }[]
          ).map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="font-sans text-[10px] uppercase tracking-[0.18em] text-on-primary/30 hover:text-secondary transition-colors duration-300"
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
