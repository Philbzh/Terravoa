'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Send, Check, ArrowRight } from 'lucide-react'

export function NewsletterCTA() {
  const t = useTranslations('newsletterCTA')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isLoading || submitted) return
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20 md:py-28 px-6 md:px-16 bg-surface">
      <motion.div
        className="max-w-5xl mx-auto rounded-3xl bg-surface-container-high/50 border border-outline-variant/20 px-8 md:px-16 py-14 md:py-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — editorial */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-secondary shrink-0" />
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-secondary font-semibold">
                {t('kicker')}
              </span>
            </div>
            <h2
              className="font-serif text-primary leading-[0.95] mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
            >
              {t('titlePre')}
              <span className="italic text-secondary">{t('titleHighlight')}</span>
            </h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Right — form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                required
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-5 py-3.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitted || isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3.5 font-sans text-sm font-medium text-on-secondary shadow-md shadow-secondary/15 transition-all duration-300 hover:bg-secondary/90 disabled:opacity-80"
              >
                {submitted ? (
                  <><Check className="h-4 w-4" /> {t('thankYou')}</>
                ) : isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-secondary/70 border-t-on-secondary" />
                    {t('sending')}
                  </span>
                ) : (
                  <><Send className="h-4 w-4" /> {t('subscribe')}</>
                )}
              </motion.button>
            </form>

            {error && <p className="mt-2 font-sans text-xs text-error">{error}</p>}
            <p className="mt-2 font-sans text-[11px] text-on-surface-variant/50 text-center">
              {t('privacy')}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
