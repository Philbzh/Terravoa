'use client'

import { useActionState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { submitContactMessage } from './actions'

const inputClass =
  'w-full bg-surface-container-low border-none border-b-2 border-b-outline-variant/20 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:bg-surface-container-highest focus:border-b-primary transition-colors'

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, undefined)

  if (state?.ok) {
    return (
      <motion.div
        className="lg:col-span-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-10 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="font-serif text-xl text-primary mb-2">Message received</p>
        <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
          Thank you — we&apos;ll get back to you as soon as we can.
        </p>
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
