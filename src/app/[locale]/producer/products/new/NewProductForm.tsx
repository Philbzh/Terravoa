'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'
import { createProducerProduct } from './actions'
import { ProductImageUpload } from '@/components/producer/ProductImageUpload'

/**
 * Client form for the "New product" page. Submission is blocked (disabled
 * button + inline message) when `disabledReason` is supplied — typically used
 * when the producer is at their plan's product cap. The server action enforces
 * the same cap independently, so this is UX only.
 */
export function NewProductForm({
  disabledReason,
}: {
  disabledReason?: string | null
}) {
  const t = useTranslations('producerPortal.newProduct')
  const router = useRouter()

  const CATEGORY_KEYS = [
    'oilsCondiments',
    'cheeseDairy',
    'honeyPreserves',
    'winesSpirits',
    'breadPastry',
    'charcuterie',
    'spicesHerbs',
    'vinegarFerments',
    'ceramicsCraft',
    'bodyCare',
    'other',
  ] as const

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [priceEur, setPriceEur] = useState('')
  const [category, setCategory] = useState('')
  const [origin, setOrigin] = useState('')
  const [description, setDescription] = useState('')
  const [details, setDetails] = useState<string[]>([''])
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isBlocked = Boolean(disabledReason)

  function handleNameChange(value: string) {
    setName(value)
    setSlug(slugify(value))
    if (!imageAlt) setImageAlt(value)
  }

  function addDetail() {
    setDetails((d) => [...d, ''])
  }

  function setDetail(i: number, value: string) {
    setDetails((d) => d.map((x, j) => (j === i ? value : x)))
  }

  function removeDetail(i: number) {
    setDetails((d) => d.filter((_, j) => j !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isBlocked) return
    setError(null)
    setLoading(true)

    const result = await createProducerProduct({
      name,
      slug,
      priceEur,
      category,
      origin,
      description,
      details,
      imageUrl,
      imageAlt,
    })

    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    router.push('/producer/products?submitted=1')
  }

  const inputClass =
    'w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
  const labelClass =
    'font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-error font-sans text-sm bg-error-container/40 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <fieldset disabled={isBlocked} className="space-y-6">
        <div>
          <label className={labelClass}>{t('productName')}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder={t('productNamePlaceholder')}
            className={inputClass}
          />
        </div>

        {slug && (
          <p className="font-sans text-xs text-on-surface-variant/60 -mt-3">
            {t('urlPreview')}<strong>{slug}</strong>
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('priceLabel')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-sans text-sm">€</span>
              <input
                type="number"
                required
                min="0.50"
                step="0.01"
                value={priceEur}
                onChange={(e) => setPriceEur(e.target.value)}
                placeholder="24.90"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t('categoryLabel')}</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">{t('categoryDefault')}</option>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>{t(`categories.${key}`)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('originLabel')}</label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder={t('originPlaceholder')}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>{t('descriptionLabel')}</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('descriptionPlaceholder')}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className={labelClass}>{t('detailsLabel')}</label>
          <div className="space-y-2">
            {details.map((d, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={d}
                  onChange={(e) => setDetail(i, e.target.value)}
                  placeholder={t('detailPlaceholder', { n: i + 1 })}
                  className={inputClass}
                />
                {details.length > 1 && (
                  <button type="button" onClick={() => removeDetail(i)}
                    className="text-on-surface-variant/50 hover:text-error transition-colors shrink-0">
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {details.length < 6 && (
              <button type="button" onClick={addDetail}
                className="inline-flex items-center gap-1 text-secondary font-sans text-xs uppercase tracking-wider hover:opacity-75 transition-opacity mt-1">
                <Plus size={14} /> {t('addDetail')}
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low p-5 space-y-4">
          <p className="font-sans text-xs uppercase tracking-wider text-on-surface-variant">
            {t('imageSection')}
          </p>

          <div>
            <label className={labelClass}>{t('imageUpload')}</label>
            <ProductImageUpload
              mode="single"
              value={imageUrl}
              onChange={setImageUrl}
              dropLabel={t('imageDropLabel')}
              hintLabel={t('imageHint')}
              uploadingLabel={t('imageUploading')}
              removeLabel={t('imageRemove')}
            />
          </div>

          <div>
            <label className={labelClass}>{t('imageAlt')}</label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder={t('imageAltPlaceholder')}
              className={inputClass}
            />
            <p className="mt-2 font-sans text-xs text-on-surface-variant/70">
              {t('imageAltHint')}
            </p>
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading || isBlocked}
          className="min-w-[160px] justify-center"
        >
          {loading ? <><Loader2 size={15} className="animate-spin" /> {t('submitting')}</> : t('submit')}
        </Button>
        <Link href="/producer/products"
          className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
          {t('cancel')}
        </Link>
      </div>
    </form>
  )
}
