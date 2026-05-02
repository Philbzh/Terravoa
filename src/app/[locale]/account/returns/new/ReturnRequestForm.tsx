'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const REASONS = [
  {
    value: 'withdrawal',
    label: '14-day right of withdrawal',
    description: 'I changed my mind within 14 days of receiving my order.',
  },
  {
    value: 'damaged',
    label: 'Item arrived damaged',
    description: 'The product was damaged or broken on arrival.',
  },
  {
    value: 'wrong_item',
    label: 'Wrong item received',
    description: 'I received a different product from what I ordered.',
  },
  {
    value: 'quality',
    label: 'Quality issue',
    description: 'The product did not meet the expected quality standards.',
  },
] as const

type Reason = (typeof REASONS)[number]['value']

export function ReturnRequestForm() {
  const searchParams = useSearchParams()

  const [orderId, setOrderId]         = useState(searchParams.get('order') ?? '')
  const [reason, setReason]           = useState<Reason | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState(false)
  const [referenceId, setReferenceId] = useState('')

  useEffect(() => {
    const param = searchParams.get('order')
    if (param && !orderId) setOrderId(param)
  }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!orderId.trim()) { setError('Please enter your order ID.'); return }
    if (!reason)         { setError('Please select a reason.');     return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), reason, description }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
      } else {
        setReferenceId((data.id as string).slice(0, 8).toUpperCase())
        setSuccess(true)
      }
    } catch {
      setError('Could not connect. Please check your connection and try again.')
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
        <h1 className="font-serif text-3xl text-primary mb-3">Request submitted</h1>
        <p className="font-sans text-sm text-on-surface-variant mb-2 leading-relaxed">
          We've received your return request. Our team will review it within 2 business days.
        </p>
        <p className="font-sans text-xs text-on-surface-variant/60 mb-10">
          Reference: <span className="font-mono text-on-surface">{referenceId}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Back to my orders
          </Link>
          <Link
            href="/returns"
            className="font-sans text-xs uppercase tracking-wider border border-outline-variant/40 text-on-surface-variant px-6 py-2.5 rounded-full hover:bg-surface-container-low transition-colors"
          >
            Return policy
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
        My Orders
      </Link>

      <h1 className="font-serif text-3xl text-primary mb-2">Request a return</h1>
      <p className="font-sans text-sm text-on-surface-variant mb-8 leading-relaxed">
        EU consumers have a 14-day right of withdrawal. Damaged or incorrect items can be
        returned at any time. We'll respond within 2 business days.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="orderId"
            className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2"
          >
            Order ID
          </label>
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 3fa85f64-5717-4562-…"
            className="w-full font-mono text-sm bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
            required
          />
          <p className="mt-1.5 font-sans text-xs text-on-surface-variant/60">
            Find your order ID in{' '}
            <Link href="/account/orders" className="text-secondary hover:underline">My Orders</Link>.
          </p>
        </div>

        <div>
          <p className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-3">
            Reason for return
          </p>
          <div className="space-y-2">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                  reason === r.value
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-outline-variant/25 bg-surface-container-lowest hover:border-outline-variant/50'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={() => setReason(r.value)}
                  className="mt-0.5 accent-primary shrink-0"
                />
                <div>
                  <p className="font-sans text-sm text-on-surface font-medium">{r.label}</p>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5">{r.description}</p>
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
            Additional details{' '}
            <span className="normal-case text-on-surface-variant/50">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue…"
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
          {submitting ? 'Submitting…' : 'Submit return request'}
        </button>
      </form>
    </>
  )
}
