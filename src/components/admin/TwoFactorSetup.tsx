'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, ShieldCheck, ShieldOff, Loader2, Check, Copy, AlertTriangle } from 'lucide-react'

type Factor = {
  id: string
  status: 'verified' | 'unverified'
  friendly_name?: string
}

export function TwoFactorSetup() {
  const [factors, setFactors] = useState<Factor[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [disabling, setDisabling] = useState(false)

  async function loadFactors() {
    const supabase = createClient()
    const { data } = await supabase.auth.mfa.listFactors()
    const allTotp = (data?.totp ?? []) as Factor[]

    // Clean up any unverified (stale) factors automatically
    const unverified = allTotp.filter((f) => f.status === 'unverified')
    for (const f of unverified) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    const verified = allTotp.filter((f) => f.status === 'verified')
    setFactors(verified)
    setLoading(false)
  }

  useEffect(() => {
    loadFactors()
  }, [])

  async function startEnrollment() {
    setEnrolling(true)
    setError('')
    const supabase = createClient()

    // Clean up any lingering unverified factors before enrolling
    const { data: existing } = await supabase.auth.mfa.listFactors()
    const stale = (existing?.totp ?? []).filter((f: Factor) => f.status === 'unverified')
    for (const f of stale) {
      await supabase.auth.mfa.unenroll({ factorId: f.id })
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Terravoa Admin',
      issuer: 'Terravoa_Admin',
    })
    if (enrollError || !data) {
      setError(enrollError?.message ?? 'Failed to start enrollment.')
      setEnrolling(false)
      return
    }
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setFactorId(data.id)
  }

  async function verifyEnrollment() {
    if (!factorId || verifyCode.length !== 6) return
    setVerifying(true)
    setError('')
    const supabase = createClient()
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId,
    })
    if (challengeError || !challengeData) {
      setError(challengeError?.message ?? 'Failed to create challenge.')
      setVerifying(false)
      return
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    })
    setVerifying(false)
    if (verifyError) {
      setError(verifyError.message)
      return
    }
    setSuccess('Two-factor authentication enabled successfully!')
    setQrCode(null)
    setSecret(null)
    setFactorId(null)
    setVerifyCode('')
    setEnrolling(false)
    loadFactors()
    setTimeout(() => setSuccess(''), 4000)
  }

  async function disableFactor(fId: string) {
    setDisabling(true)
    setError('')
    const supabase = createClient()
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: fId })
    setDisabling(false)
    if (unenrollError) {
      setError(unenrollError.message)
      return
    }
    setSuccess('Two-factor authentication disabled.')
    loadFactors()
    setTimeout(() => setSuccess(''), 4000)
  }

  function cancelEnrollment() {
    // Unenroll the unverified factor
    if (factorId) {
      const supabase = createClient()
      supabase.auth.mfa.unenroll({ factorId })
    }
    setQrCode(null)
    setSecret(null)
    setFactorId(null)
    setVerifyCode('')
    setEnrolling(false)
    setError('')
  }

  async function copySecret() {
    if (!secret) return
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4">
        <Loader2 size={14} className="animate-spin text-on-surface-variant" />
        <span className="font-sans text-sm text-on-surface-variant">Loading 2FA status…</span>
      </div>
    )
  }

  const isEnabled = factors.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-on-surface-variant" />
        <h3 className="font-sans text-sm font-semibold text-on-surface">Two-factor authentication</h3>
      </div>

      {error && (
        <p className="font-sans text-xs text-error bg-error-container/40 px-3 py-2 rounded-lg flex items-center gap-2" role="alert">
          <AlertTriangle size={12} /> {error}
        </p>
      )}

      {success && (
        <p className="font-sans text-xs text-primary bg-primary-fixed/30 px-3 py-2 rounded-lg flex items-center gap-2">
          <Check size={12} /> {success}
        </p>
      )}

      {/* Status indicator */}
      {!enrolling && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEnabled ? (
              <>
                <ShieldCheck size={16} className="text-primary" />
                <span className="font-sans text-sm text-on-surface">2FA is enabled</span>
                <span className="font-sans text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary">
                  Active
                </span>
              </>
            ) : (
              <>
                <ShieldOff size={16} className="text-on-surface-variant" />
                <span className="font-sans text-sm text-on-surface-variant">2FA is not enabled</span>
              </>
            )}
          </div>
          {isEnabled ? (
            <button
              type="button"
              onClick={() => disableFactor(factors[0].id)}
              disabled={disabling}
              className="font-sans text-[11px] uppercase tracking-wider border border-error/30 text-error px-3 py-1.5 rounded-full hover:bg-error/5 transition-colors disabled:opacity-50"
            >
              {disabling ? 'Disabling…' : 'Disable 2FA'}
            </button>
          ) : (
            <button
              type="button"
              onClick={startEnrollment}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-wider bg-primary text-on-primary px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <Shield size={12} />
              Enable 2FA
            </button>
          )}
        </div>
      )}

      {/* Enrollment flow */}
      {enrolling && qrCode && (
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5 space-y-4">
          <p className="font-sans text-sm text-on-surface">
            Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.):
          </p>

          {/* QR code */}
          <div className="flex justify-center py-2">
            <div className="rounded-xl border border-outline-variant/20 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" width={200} height={200} className="block" />
            </div>
          </div>

          {/* Secret key (manual entry) */}
          {secret && (
            <div>
              <p className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5">
                Or enter this key manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-surface-container px-3 py-2 rounded-lg text-on-surface break-all select-all">
                  {secret}
                </code>
                <button
                  type="button"
                  onClick={copySecret}
                  className="shrink-0 p-2 rounded-lg hover:bg-surface-container transition-colors"
                  title="Copy secret"
                >
                  {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} className="text-on-surface-variant" />}
                </button>
              </div>
            </div>
          )}

          {/* Verify code */}
          <div>
            <label htmlFor="totp-code" className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant mb-1.5 block">
              Enter 6-digit code from your app
            </label>
            <div className="flex items-center gap-3">
              <input
                id="totp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                required
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-40 rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 font-mono text-lg text-center text-on-surface tracking-[0.3em] focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={verifyEnrollment}
                disabled={verifyCode.length !== 6 || verifying}
                className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-5 py-2.5 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                {verifying ? (
                  <><Loader2 size={12} className="animate-spin" /> Verifying…</>
                ) : (
                  'Verify & enable'
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={cancelEnrollment}
            className="font-sans text-xs text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {!isEnabled && !enrolling && (
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
          Add an extra layer of security to your admin account. After enabling, you will need to enter a 6-digit code from your authenticator app each time you sign in.
        </p>
      )}
    </div>
  )
}
