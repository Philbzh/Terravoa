'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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
  const t = useTranslations('checkout')
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
          <h1 className="font-serif text-4xl text-primary mb-4">{t('title')}</h1>
          <p className="text-on-surface-variant font-sans">{t('loading')}</p>
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
        setError(data.error ?? t('genericError'))
        setLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setError(t('genericError'))
    } catch {
      setError(t('genericError'))
    }
    setLoading(false)
  }

  if (lines.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-serif text-4xl text-primary mb-4">{t('title')}</h1>
          <p className="text-on-surface-variant font-sans mb-8">{t('emptyCart')}</p>
          <Link
            href="/collection"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4"
          >
            {t('backToCollection')}
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
        {t('title')}
      </h1>
      <p className="text-on-surface-variant font-sans text-sm mb-10 max-w-xl">
        {t('subtitle')}
      </p>

      <div className="max-w-md rounded-xl border border-outline-variant/20 bg-surface-container-low p-8 mb-8">
        <h2 className="font-serif text-lg text-primary mb-4">{t('orderSummary')}</h2>
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
              <span>{t('giftWrapping')}</span>
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
          <span>{t('total')}</span>
          <span>€{(total / 100).toFixed(2)}</span>
        </div>
        {producerCount > 1 && (
          <div className="flex items-start gap-3 mt-5 pt-4 border-t border-outline-variant/10">
            <Package size={16} strokeWidth={1.2} className="text-secondary shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              {t('multiProducer', { count: producerCount })}
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
          {t('paymentsUnavailable')}
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
            {t('redirecting')}
          </>
        ) : (
          t('payButton')
        )}
      </Button>

      <p className="font-sans text-xs text-on-surface-variant mt-8 max-w-lg">
        {t.rich('termsNotice', {
          terms: (chunks) => (
            <Link href="/terms" className="text-secondary underline underline-offset-2">
              {chunks}
            </Link>
          ),
          contact: (chunks) => (
            <Link href="/contact" className="text-secondary underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </PageContainer>
  )
}
