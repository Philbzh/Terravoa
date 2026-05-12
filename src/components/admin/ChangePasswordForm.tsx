'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Lock, Check, Loader2 } from 'lucide-react'

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
      setState('error')
    } else {
      setState('done')
      setPassword('')
      setConfirm('')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-4 w-4 text-on-surface-variant" />
        <h3 className="font-sans text-sm font-semibold text-on-surface">Change password</h3>
      </div>

      {state === 'error' && (
        <p className="font-sans text-xs text-error bg-error-container/40 px-3 py-2 rounded-lg" role="alert">
          {errorMsg}
        </p>
      )}

      {state === 'done' && (
        <p className="font-sans text-xs text-primary bg-primary-fixed/30 px-3 py-2 rounded-lg flex items-center gap-2">
          <Check className="h-3.5 w-3.5" /> Password updated successfully.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="new-password" className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 block">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1 block">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 font-sans text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={state === 'loading'}
        className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-5 py-2 rounded-full hover:opacity-90 disabled:opacity-50"
      >
        {state === 'loading' ? (
          <><Loader2 size={14} className="animate-spin" /> Updating…</>
        ) : (
          'Update password'
        )}
      </button>
    </form>
  )
}
