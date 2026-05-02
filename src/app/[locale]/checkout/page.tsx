'use client'

import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Loader2, Package } from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Button } from '@/components/ui/Button'
import {
  useCartStore,
  cartTotalCents,
} from '@/lib/store/cart-store'
import { features } from '@/lib/features'
import { GiftMessaging, type GiftData } from '@/components/checkout/GiftMessaging'
import { CouponField, type AppliedCoupon } from '@/components/checkout/CouponField'

const paymentsEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim())

export default function CheckoutPage() {
  const locale = useLocale()
  const hydrated = useCartStore((s) => s.hydrated)
  const lines = useCartStore((s) => s.lines)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [giftData, setGiftData] = useState<GiftData>({
    isGift: false,
    recipientName: '',
    message: '',
    giftWrap: false,
  })
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const subtotal = cartTotalCents(lines)
  const giftWrapCents = features.giftMessaging && giftData.isGift && giftData.giftWrap ? 350 : 0
  const discountCents = appliedCoupon?.discountCents ?? 0
  const total = Math.max(0, subtotal + giftWrapCents - discountCents)
  const producerCount = useMemo(
    () => new Set(lines.map((l) => l.producerSlug)).size,
    [lines],
  )

  if (!hydrated) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-serif text-4xl text-primary mb-4">Checkout</h1>
          <p className="text-on-surface-variant font-sans">Loading your cart…</p>
        </div>
      </PageContainer>
    )
  }

  async function pay() {
    setError(null)
    setLoading(true)
    try {
      const body: Record<string, unknown> = { items: lines, locale }
      if (features.giftMessaging && giftData.isGift) {
        body.gift = giftData
      }
      if (appliedCoupon) {
        body.couponCode = appliedCoupon.code
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Checkout failed')
        setLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError('No checkout URL returned')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (lines.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-serif text-4xl text-primary mb-4">Checkout</h1>
          <p className="text-on-surface-variant font-sans mb-8">Your cart is empty.</p>
          <Link
            href="/collection"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4"
          >
            Back to collection
          </Link>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1
        className="font-serif text-primary mb-4 leading-[0.96]"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}
      >
        Checkout
      </h1>
      <p className="text-on-surface-variant font-sans text-sm mb-10 max-w-xl">
        One secure payment — your products will be shipped directly by each producer.
        Shipping and billing details are collected on the next step.
      </p>

      <div className="max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 mb-8">
        <h2 className="font-serif text-lg text-primary mb-4">Order summary</h2>
        <ul className="space-y-3 font-sans text-sm text-on-surface-variant mb-6">
          {lines.map((l) => (
            <li key={l.slug} className="flex justify-between gap-4">
              <span>{l.name} × {l.quantity}</span>
              <span className="text-primary tabular-nums shrink-0">
                €{((l.priceCents * l.quantity) / 100).toFixed(2)}
              </span>
            </li>
          ))}
          {features.giftMessaging && giftData.isGift && giftData.giftWrap && (
            <li className="flex justify-between gap-4">
              <span>Gift wrapping</span>
              <span className="text-primary tabular-nums shrink-0">€3.50</span>
            </li>
          )}
          {appliedCoupon && (
            <li className="flex justify-between gap-4 text-secondary">
              <span>Coupon {appliedCoupon.code} (−{appliedCoupon.discountPct}%)</span>
              <span className="tabular-nums shrink-0">
                −€{(appliedCoupon.discountCents / 100).toFixed(2)}
              </span>
            </li>
          )}
        </ul>

        {/* Coupon input */}
        <div className="mb-5 pb-5 border-b border-outline-variant/15">
          <CouponField
            subtotalCents={subtotal + giftWrapCents}
            onApply={setAppliedCoupon}
            applied={appliedCoupon}
          />
        </div>

        <div className="flex justify-between font-serif text-xl text-primary">
          <span>Total</span>
          <span>€{(total / 100).toFixed(2)}</span>
        </div>
        {producerCount > 1 && (
          <div className="flex items-start gap-3 mt-5 pt-4 border-t border-outline-variant/10">
            <Package size={16} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Your order includes products from {producerCount} producers.
              Items will be shipped in separate packages, fresh from each origin.
            </p>
          </div>
        )}
      </div>

      {features.giftMessaging && (
        <div className="max-w-md">
          <GiftMessaging onChange={setGiftData} />
        </div>
      )}

      {error && (
        <p className="text-error font-sans text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      {!paymentsEnabled && (
        <p className="text-on-surface-variant font-sans text-sm mb-4" role="status">
          Payments are currently unavailable in this environment. You can still review your cart.
        </p>
      )}

      <Button
        variant="primary"
        type="button"
        disabled={loading || !paymentsEnabled}
        onClick={pay}
        className="justify-center"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Redirecting…
          </>
        ) : (
          'Pay with Stripe'
        )}
      </Button>

      <p className="font-sans text-xs text-on-surface-variant mt-8 max-w-lg">
        By continuing you agree to our{' '}
        <Link href="/terms" className="text-secondary underline underline-offset-2">
          terms
        </Link>
        . For questions,{' '}
        <Link href="/contact" className="text-secondary underline underline-offset-2">
          contact us
        </Link>
        .
      </p>
    </PageContainer>
  )
}
