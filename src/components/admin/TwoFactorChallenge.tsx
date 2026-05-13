'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, Loader2, AlertTriangle } from 'lucide-react'

type Props = {
  onVerified: () => void
  onCancel: () => void
}

export function TwoFactorChallenge({ onVerified, onCancel }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus the code input
    inputRef.current?.focus()
  }, [])

  async function handleVerify() {
    if (code.length !== 6) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: factorsData } = await supabase.auth.mfa.listFactors()
    const verifiedFactors = (factorsData?.totp ?? []).filter((f) => f.status === 'verified')

    if (verifiedFactors.length === 0) {
      setError('No 2FA factor found. Please contact an administrator.')
      setLoading(false)
      return
    }

    const factor = verifiedFactors[0]
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: factor.id,
      code,
    })

    setLoading(false)

    if (verifyError) {
      setError('Invalid code. Please try again.')
      setCode('')
      inputRef.current?.focus()
      return
    }

    onVerified()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center h-14 w-14 rounded-xl mx-auto mb-4 bg-secondary/15">
          <Shield className="h-7 w-7 text-secondary" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-xl font-bold text-white mb-1">
          Two-factor verification
        </h2>
        <p className="font-sans text-sm text-white/50">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {error && (
        <p className="font-sans text-xs text-red-300 bg-red-500/10 border border-red-400/20 px-3 py-2 rounded-lg flex items-center gap-2" role="alert">
          <AlertTriangle size={12} /> {error}
        </p>
      )}

      <div className="rounded-2xl border border-white/12 bg-white/6 backdrop-blur-sm p-7 space-y-5">
        <div>
          <label htmlFor="totp-challenge" className="font-sans text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2 block">
            Authentication code
          </label>
          <input
            ref={inputRef}
            id="totp-challenge"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyDown={handleKeyDown}
            placeholder="000000"
            className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 font-mono text-xl text-center text-white tracking-[0.4em] placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/12 transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-secondary text-white px-5 py-3 font-sans text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Verifying…</>
          ) : (
            'Verify'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onCancel}
          className="font-sans text-xs text-white/40 hover:text-white transition-colors"
        >
          Cancel and sign out
        </button>
      </div>
    </div>
  )
}
