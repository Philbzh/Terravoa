'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const REASON_VALUES = ['withdrawal', 'damaged', 'wrong_item', 'quality'] as const
type Reason = (typeof REASON_VALUES)[number]

const REASON_LABEL_KEYS: Record<Reason, { label: string; description: string }> = {
  withdrawal: { label: 'reasonWithdrawal', description: 'reasonWithdrawalDesc' },
  damaged: { label: 'reasonDamaged', description: 'reasonDamagedDesc' },
  wrong_item: { label: 'reasonWrongItem', description: 'reasonWrongItemDesc' },
  quality: { label: 'reasonQuality', description: 'reasonQualityDesc' },
}

export function ReturnRequestForm() {
  const t = useTranslations('returnRequest')
  const searchParams = useSearchParams()

  const [orderId, setOrderId] = useState(searchParams.get('order') ?? '')
  const [reason, setReason] = useState<Reason | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  useEffect(() => {
    const param = searchParams.get('order')
    if (param && !orderId) setOrderId(param)
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!orderId.trim()) {
      setError(t('errorOrderIdRequired'))
      return
    }
    if (!reason) {
      setError(t('errorReasonRequired'))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), reason, description }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError((data.error as string) ?? t('errorGeneric'))
      } else {
        setReferenceId((data.id as string).slice(0, 8).toUpperCase())
        setSuccess(true)
      }
    } catch {
      setError(t('errorConnection'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-primary" size={32} strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl text-primary mb-3">{t('successTitle')}</h1>
          <p className="font-sans text-sm text-on-surface-variant mb-2 leading-relaxed">
            {t('successDesc')}
          </p>
          <p className="font-sans text-xs text-on-surface-variant/60 mb-10">
            {t('referenceLabel')}:{' '}
            <span className="font-mono text-on-surface">{referenceId}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account/orders"
                className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                {t('backToOrders')}
              </Link>
              <Link
                href="/returns"
                className="font-sans text-xs uppercase tracking-wider border border-outline-variant/40 text-on-surface-variant px-6 py-2.5 rounded-full hover:bg-surface-container-low transition-colors"
              >
                {t('returnPolicy')}
              </Link>
            </div>
      </div>
    )
  }

  return (
    <>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        {t('back')}
      </Link>

      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8 leading-relaxed">{t('intro')}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="orderId"
            className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2"
          >
            {t('orderId')}
          </label>
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder={t('orderIdPlaceholder')}
            className="w-full font-mono text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
            required
          />
          <p className="mt-1.5 font-sans text-xs text-on-surface-variant/60">
            {t('orderIdHelpPrefix')}{' '}
            <Link href="/account/orders" className="text-secondary hover:underline">
              {t('orderIdHelpLink')}
            </Link>
            .
          </p>
        </div>

        <div>
          <p className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            {t('reason')}
          </p>
          <div className="space-y-2">
            {REASON_VALUES.map((value) => (
              <label
                key={value}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  reason === value
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-outline-variant/25 bg-surface-container-lowest hover:border-outline-variant/50'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => setReason(value)}
                  className="mt-0.5 accent-primary shrink-0"
                />
                <div>
                  <p className="font-sans text-sm text-on-surface font-medium">
                    {t(REASON_LABEL_KEYS[value].label)}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                    {t(REASON_LABEL_KEYS[value].description)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2"
          >
            {t('description')}{' '}
            <span className="normal-case text-on-surface-variant/50">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('descriptionPlaceholder')}
            rows={4}
            maxLength={1000}
            className="w-full font-sans text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors resize-none"
          />
          <p className="mt-1 font-sans text-xs text-on-surface-variant/50 text-right">
            {description.length} / 1000
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-error/8 border border-error/20 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-error shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="font-sans text-sm text-error">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? t('submitting') : t('submit')}
        </button>
      </form>
    </>
  )
}
