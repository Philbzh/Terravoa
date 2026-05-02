'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SITE_URL } from '@/lib/constants'

export default function ResetPasswordPage() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${SITE_URL}/${locale}/login/update-password`,
    })

    if (error) {
      setErrorMsg(error.message)
      setState('error')
    } else {
      setState('sent')
    }
  }

  if (state === 'sent') {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-primary">Check your inbox</h1>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent a reset link to <strong>{email}</strong>. Follow the link
          to set a new password — it expires in 1 hour.
        </p>
        <Link
          href="/login"
          className="inline-block font-sans text-xs text-secondary hover:underline underline-offset-4 mt-4"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to sign in
      </Link>

      <h1 className="font-serif text-2xl text-primary mb-2">Reset your password</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8">
        Enter your email and we&apos;ll send a secure reset link.
      </p>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 space-y-5"
      >
        {state === 'error' && (
          <p className="text-error font-sans text-sm bg-error-container/40 px-4 py-3 rounded-lg" role="alert">
            {errorMsg}
          </p>
        )}

        <div>
          <label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.15em] font-semibold bg-primary text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {state === 'loading' ? (
            <><Loader2 size={15} className="animate-spin" /> Sending…</>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>
    </div>
  )
}
