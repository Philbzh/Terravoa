'use client'

import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/Button'
import { submitContactMessage } from './actions'

const inputClass =
  'w-full bg-surface-container-low border-none border-b-2 border-b-outline-variant/20 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:bg-surface-container-highest focus:border-b-primary transition-colors'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, undefined)

  if (state?.ok) {
    return (
      <motion.div
        className="lg:col-span-3 w-full rounded-xl border border-secondary/25 bg-secondary/5 px-8 py-9 shadow-sm"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <span
            className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-secondary ring-1 ring-secondary/20"
            aria-hidden
          >
            <CheckCircle2 size={32} strokeWidth={1.5} />
          </span>
          <h2 className="font-serif text-2xl sm:text-[1.65rem] text-primary mb-3 tracking-tight">
            Message received
          </h2>
          <p className="text-on-surface-variant font-sans text-sm sm:text-[15px] leading-relaxed mb-8">
            Thank you — we&apos;ll read your note carefully and reply as soon as we can, usually within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] bg-secondary text-on-secondary hover:bg-secondary-container transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 font-sans text-sm bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors"
            >
              Browse shop
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      action={formAction}
      className="lg:col-span-3 space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {state?.error && (
        <p className="text-error font-sans text-sm" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="first_name"
            className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
          >
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
          >
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            autoComplete="family-name"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="audience"
          className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
        >
          I am a...
        </label>
        <select
          id="audience"
          name="audience"
          required
          className={inputClass}
          defaultValue="Customer"
        >
          <option value="Customer">Customer</option>
          <option value="Producer interested in joining">
            Producer interested in joining
          </option>
          <option value="Press / Media">Press / Media</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="message"
          className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-2 block"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClass} resize-none`}
        />
      </div>
      <Button variant="primary" type="submit" disabled={pending}>
        {pending ? 'Sending…' : 'Send Message'}
      </Button>
    </motion.form>
  )
}
