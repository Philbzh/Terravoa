'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error' | 'invalid'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [ready, setReady] = useState(false)

  // Support both Supabase recovery link formats:
  // 1) Hash tokens: #access_token=...&type=recovery
  // 2) PKCE code flow: ?code=...&type=recovery (requires exchangeCodeForSession)
  useEffect(() => {
    let cancelled = false

    async function prepareRecovery() {
      const hash = typeof window !== 'undefined' ? window.location.hash : ''
      const search = typeof window !== 'undefined' ? window.location.search : ''

      const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
      const queryParams = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)

      const hasRecoveryToken = Boolean(hashParams.get('access_token') || hashParams.get('refresh_token'))
      const hasCode = Boolean(queryParams.get('code'))
      const type = hashParams.get('type') ?? queryParams.get('type')
      const isRecoveryType = type === 'recovery'

      if (hasRecoveryToken || isRecoveryType) {
        if (!cancelled) setReady(true)
        return
      }

      if (hasCode) {
        try {
          const code = queryParams.get('code')!
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            if (!cancelled) {
              setErrorMsg('This reset link is invalid or expired. Please request a new one.')
              setState('invalid')
            }
            return
          }
          if (!cancelled) setReady(true)
          return
        } catch {
          if (!cancelled) {
            setErrorMsg('Could not verify reset link. Please request a new one.')
            setState('invalid')
          }
          return
        }
      }

      if (!cancelled) {
        setErrorMsg('This reset link is invalid or expired. Please request a new one.')
        setState('invalid')
      }
    }

    prepareRecovery()

    // Safety valve: never leave users on a blank/loader-only screen.
    const fallback = setTimeout(() => {
      if (!cancelled && state === 'idle' && !ready) {
        setReady(true)
      }
    }, 4000)

    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [supabase, ready, state])

  async function updatePasswordWithRetry(nextPassword: string) {
    const attempts = 2
    let lastError: unknown = null
    for (let i = 0; i < attempts; i++) {
      try {
        const { error } = await supabase.auth.updateUser({ password: nextPassword })
        if (!error) return null
        if (error.message?.includes('lock:sb-') && i < attempts - 1) {
          await new Promise((r) => setTimeout(r, 250))
          continue
        }
        return error
      } catch (err) {
        lastError = err
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('lock:sb-') && i < attempts - 1) {
          await new Promise((r) => setTimeout(r, 250))
          continue
        }
        throw err
      }
    }
    if (lastError) throw lastError
    return new Error('Could not update password.')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      setState('error')
      return
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.')
      setState('error')
      return
    }

    setState('loading')
    setErrorMsg('')

    let error: { message: string } | null = null
    try {
      error = await updatePasswordWithRetry(password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update password.'
      setErrorMsg(message.includes('lock:sb-')
        ? 'Session confirmation is still in progress. Please wait 2 seconds and submit again.'
        : message)
      setState('error')
      return
    }

    if (error) {
      setErrorMsg(error.message)
      setState('error')
    } else {
      setState('done')
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  if (state === 'done') {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto text-secondary" size={40} strokeWidth={1.5} />
        <h1 className="font-serif text-2xl text-primary">Password updated</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Your password has been changed. Redirecting you to sign in…
        </p>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto animate-spin text-on-surface-variant/40" size={28} strokeWidth={1.5} />
        <p className="font-sans text-sm text-on-surface-variant">Preparing secure reset…</p>
      </div>
    )
  }

  if (state === 'invalid') {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-serif text-2xl text-primary">Reset link invalid</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          {errorMsg || 'This reset link is invalid or expired.'}
        </p>
        <button
          type="button"
          onClick={() => router.push('/login/reset')}
          className="inline-flex items-center justify-center font-sans text-xs uppercase tracking-[0.15em] font-semibold bg-primary text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Request new reset link
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-primary mb-2">Set a new password</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8">
        Choose a strong password of at least 8 characters.
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
          <label htmlFor="password" className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block">
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full inline-flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.15em] font-semibold bg-primary text-on-primary px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {state === 'loading' ? (
            <><Loader2 size={15} className="animate-spin" /> Updating…</>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  )
}
