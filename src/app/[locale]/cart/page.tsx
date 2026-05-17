'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Button } from '@/components/ui/Button'
import {
  useCartStore,
  cartTotalCents,
  type CartLine,
} from '@/lib/store/cart-store'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

export default function CartPage() {
  const t = useTranslations('cart')
  const hydrated = useCartStore((s) => s.hydrated)
  const lines = useCartStore((s) => s.lines)
  const setQty = useCartStore((s) => s.setQty)
  const removeLine = useCartStore((s) => s.removeLine)

  const total = cartTotalCents(lines)

  if (!hydrated) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-serif text-primary mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}>{t('title')}</h1>
          <p className="text-on-surface-variant font-sans">{t('loading')}</p>
        </div>
      </PageContainer>
    )
  }

  if (lines.length === 0) {
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-serif text-primary mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}>{t('title')}</h1>
          <p className="text-on-surface-variant font-sans mb-10">
            {t('emptyMessage')}
          </p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
          >
            {t('browseCollection')}
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
      <p className="text-on-surface-variant font-sans text-sm mb-12 max-w-xl">
        {t('subtitle')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
        <div className="lg:col-span-2 space-y-6">
          {lines.map((line) => (
            <CartRow
              key={line.slug}
              line={line}
              t={t}
              onQty={(q) => setQty(line.slug, q)}
              onRemove={() => removeLine(line.slug)}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 rounded-xl border border-outline-variant/20 bg-surface-container-low p-8">
            <h2 className="font-serif text-xl text-primary mb-6">{t('summary')}</h2>
            <div className="flex justify-between font-sans text-sm text-on-surface-variant mb-2">
              <span>{t('subtotal')}</span>
              <span className="text-primary tabular-nums">
                €{(total / 100).toFixed(2)}
              </span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant/80 mb-6 leading-relaxed">
              {t('shippingNote')}
            </p>
            <Link href="/checkout" className="block w-full">
              <Button variant="primary" className="w-full justify-center">
                {t('checkout')}
              </Button>
            </Link>
            <Link
              href="/collection"
              className="block text-center font-sans text-sm text-secondary mt-4 hover:underline underline-offset-4"
            >
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

function CartRow({
  line,
  t,
  onQty,
  onRemove,
}: {
  line: CartLine
  t: ReturnType<typeof useTranslations>
  onQty: (q: number) => void
  onRemove: () => void
}) {
  return (
    <div className="flex gap-6 items-start pb-6 border-b border-outline-variant/15">
      <Link
        href={`/collection/${line.slug}`}
        className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-container-high"
      >
        <Image
          src={line.imageSrc}
          alt={line.imageAlt}
          fill
          className="object-cover"
          sizes="96px"
          unoptimized={isExternalUnoptimizedSrc(line.imageSrc)}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/collection/${line.slug}`}
          className="font-serif text-lg text-primary hover:text-secondary transition-colors"
        >
          {line.name}
        </Link>
        <p className="font-sans text-xs text-on-surface-variant mt-1">
          {line.producerName} · {line.origin}
        </p>
        <p className="font-serif text-primary mt-2">
          €{((line.priceCents * line.quantity) / 100).toFixed(2)}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant/30 px-2 py-1">
            <button
              type="button"
              className="p-1 text-on-surface-variant hover:text-primary"
              aria-label={t('decreaseQty')}
              onClick={() => onQty(line.quantity - 1)}
            >
              <Minus size={16} />
            </button>
            <span className="font-sans text-sm tabular-nums w-6 text-center">
              {line.quantity}
            </span>
            <button
              type="button"
              className="p-1 text-on-surface-variant hover:text-primary"
              aria-label={t('increaseQty')}
              onClick={() => onQty(line.quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-on-surface-variant hover:text-error transition-colors"
            aria-label={t('removeItem')}
          >
            <Trash2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
