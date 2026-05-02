'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { sanitizeCustomerNextPath } from '@/lib/auth/customer-login'

type Mode = 'signin' | 'register'

export default function CustomerLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // HIGH-6 fix: never trust `next` unfiltered — sanitize against open redirect
  const next = useMemo(
    () => sanitizeCustomerNextPath(searchParams.get('next')),
    [searchParams],
  )
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'signin'

  const [mode, setMode] = useState<Mode>(initialTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const supabase = createClient()

    if (mode === 'signin') {
      const { error: signError } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (signError) { setError(signError.message); return }
      router.push(next)
      router.refresh()
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, role: 'customer' },
        },
      })
      setLoading(false)
      if (signUpError) { setError(signUpError.message); return }
      setSuccess('Account created! Please check your email to confirm your address, then sign in.')
    }
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary mb-2 text-center">
        {mode === 'signin' ? 'Welcome back' : 'Create an account'}
      </h1>
      <p className="text-on-surface/70 font-sans text-sm text-center mb-8">
        {mode === 'signin'
          ? 'Sign in to track your orders and manage your Terravoa account.'
          : 'Join Terravoa to discover Europe\'s finest producers.'}
      </p>

      {/* Mode switcher — minimal underline tabs */}
      <div
        role="tablist"
        aria-label="Sign in or create an account"
        className="relative grid grid-cols-2 mb-8 border-b border-outline-variant/30"
      >
        <button
          role="tab"
          aria-selected={mode === 'signin'}
          type="button"
          onClick={() => { setMode('signin'); setError(null) }}
          className={`relative py-3 font-sans text-xs uppercase tracking-[0.18em] font-medium transition-colors ${
            mode === 'signin' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Sign In
          {mode === 'signin' && (
            <span
              aria-hidden="true"
              className="absolute -bottom-px left-0 right-0 h-0.5 bg-secondary"
            />
          )}
        </button>
        <button
          role="tab"
          aria-selected={mode === 'register'}
          type="button"
          onClick={() => { setMode('register'); setError(null) }}
          className={`relative py-3 font-sans text-xs uppercase tracking-[0.18em] font-medium transition-colors ${
            mode === 'register' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Register
          {mode === 'register' && (
            <span
              aria-hidden="true"
              className="absolute -bottom-px left-0 right-0 h-0.5 bg-secondary"
            />
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 space-y-5"
      >
        {error && (
          <p className="text-error font-sans text-sm bg-error-container/40 px-4 py-3 rounded-lg" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-primary font-sans text-sm bg-primary-fixed/20 px-4 py-3 rounded-lg">
            {success}
          </p>
        )}

        {mode === 'register' && (
          <div>
            <label htmlFor="name" className="font-sans text-xs uppercase tracking-wider text-on-surface/85 mb-2 block">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-on-surface/85 mb-2 block">
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

        <div>
          <label htmlFor="password" className="font-sans text-xs uppercase tracking-wider text-on-surface/85 mb-2 block">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <Button variant="primary" type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="animate-spin" />{mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>

        {mode === 'signin' && (
          <div className="text-center">
            <Link
              href="/login/reset"
              className="font-sans text-xs text-on-surface-variant hover:text-secondary transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        )}
      </form>

      {/* Separator for producer portal */}
      <div className="mt-10 pt-8 border-t border-outline-variant/20 text-center space-y-2">
        <p className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant">
          Are you a producer?
        </p>
        <Link
          href="/login/producer"
          className="font-sans text-sm text-secondary hover:underline underline-offset-4"
        >
          Producer portal →
        </Link>
      </div>
    </div>
  )
}
