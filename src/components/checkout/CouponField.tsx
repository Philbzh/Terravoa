'use client'

import { useState } from 'react'
import { Tag, X, Loader2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type AppliedCoupon = {
  couponId: string
  code: string
  discountPct: number
  discountCents: number
  description: string | null
}

type Props = {
  subtotalCents: number
  onApply: (coupon: AppliedCoupon | null) => void
  applied: AppliedCoupon | null
}

export function CouponField({ subtotalCents, onApply, applied }: Props) {
  const t = useTranslations('couponField')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function validate() {
    const code = input.trim().toUpperCase()
    if (!code) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalCents }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? t('invalidDefault'))
        onApply(null)
      } else {
        onApply(data as AppliedCoupon)
        setInput('')
      }
    } catch {
      setError(t('networkError'))
    } finally {
      setLoading(false)
    }
  }

  function remove() {
    onApply(null)
    setError('')
    setInput('')
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-secondary/30 bg-secondary/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-secondary shrink-0" />
          <div>
            <span className="font-mono text-sm text-on-surface font-medium">{applied.code}</span>
            <span className="font-sans text-xs text-secondary ml-2">
              −{applied.discountPct}% (−€{(applied.discountCents / 100).toFixed(2)})
            </span>
            {applied.description && (
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">{applied.description}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={remove}
          aria-label={t('remove')}
          className="text-on-surface-variant hover:text-error transition-colors shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), validate())}
            placeholder={t('placeholder')}
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
            className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-outline-variant/30 bg-surface font-mono text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
          />
        </div>
        <button
          type="button"
          onClick={validate}
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-secondary/40 px-4 py-2.5 font-sans text-xs uppercase tracking-wider text-secondary hover:bg-secondary/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          {t('apply')}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 font-sans text-xs text-error">{error}</p>
      )}
    </div>
  )
}
