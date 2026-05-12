'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check, Heart, ShieldCheck, Leaf } from 'lucide-react'
import { fadeInUp } from '@/lib/motion/variants'

export function NewsletterCTA() {
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
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-surface-container py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
        >
          <span className="font-sans text-[10px] font-semibold tracking-[0.25em] text-secondary uppercase">
            Stay in touch
          </span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-primary lg:text-4xl">
            Stories from the <span className="italic text-secondary">terroir</span>
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant lg:text-lg max-w-xl mx-auto">
            Exclusive offers, seasonal discoveries, and the stories behind the artisans who craft your food.
            No spam — just what matters.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-6 py-3.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitted || isLoading}
              className="flex items-center gap-2 rounded-full bg-secondary px-6 py-3.5 font-sans text-sm font-medium text-on-secondary shadow-lg shadow-secondary/20 transition-all duration-300 hover:bg-secondary/90 disabled:opacity-80"
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Thank you!</span>
                </>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-secondary/70 border-t-on-secondary" />
                  <span className="hidden sm:inline">Sending…</span>
                </span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Subscribe</span>
                </>
              )}
            </motion.button>
          </form>

          {error && <p className="mt-3 font-sans text-xs text-error">{error}</p>}
          <p className="mt-3 font-sans text-xs text-on-surface-variant/60">
            Unsubscribe anytime. We respect your privacy.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Heart className="h-4 w-4 text-secondary" />
              <span className="font-sans text-xs font-medium">Hand-curated selection</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <ShieldCheck className="h-4 w-4 text-secondary" />
              <span className="font-sans text-xs font-medium">100% satisfaction promise</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Leaf className="h-4 w-4 text-secondary" />
              <span className="font-sans text-xs font-medium">Direct from artisan producers</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
