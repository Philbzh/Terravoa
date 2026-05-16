'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslations } from 'next-intl'
import { updateProducerProduct } from './actions'
import { ProductImageUpload } from '@/components/producer/ProductImageUpload'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  origin: string
  description: string
  details: string[]
  image_src: string
  image_alt: string
  stock_quantity: number | null
}

export function EditProductForm({ product }: { product: Product }) {
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

  const [name, setName] = useState(product.name)
  const [priceEur, setPriceEur] = useState((product.price / 100).toFixed(2))
  const [category, setCategory] = useState(product.category)
  const [origin, setOrigin] = useState(product.origin)
  const [description, setDescription] = useState(product.description)
  const [details, setDetails] = useState<string[]>(
    product.details.length > 0 ? product.details : [''],
  )
  const [imageUrl, setImageUrl] = useState(
    product.image_src === '/images/placeholder-product.svg' ? '' : product.image_src,
  )
  const [imageAlt, setImageAlt] = useState(product.image_alt)
  const [stockQuantity, setStockQuantity] = useState(
    product.stock_quantity !== null ? String(product.stock_quantity) : '',
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
    setError(null)
    setSuccess(false)
    setLoading(true)

    const result = await updateProducerProduct({
      productId: product.id,
      name,
      priceEur,
      category,
      origin,
      description,
      details,
      imageUrl,
      imageAlt,
      stockQuantity,
    })

    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }

    setSuccess(true)
    router.refresh()
  }

  const inputClass =
    'w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-colors'
  const labelClass =
    'font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2 block'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-error font-sans text-sm bg-error-container/40 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}
      {success && (
        <p className="text-primary font-sans text-sm bg-primary-fixed/30 px-4 py-3 rounded-lg">
          Product updated successfully.
        </p>
      )}

      <div>
        <label className={labelClass}>{t('productName')}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <p className="font-sans text-xs text-on-surface-variant/60 -mt-3">
        URL slug: <strong>{product.slug}</strong> (cannot be changed)
      </p>

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

      <div>
        <label className={labelClass}>Stock Quantity</label>
        <input
          type="number"
          min="0"
          step="1"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          placeholder="Leave empty for unlimited"
          className={inputClass}
        />
        <p className="mt-2 font-sans text-xs text-on-surface-variant/70">
          Leave empty for unlimited stock. Set to 0 to mark as out of stock.
        </p>
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
            previewImageAlt={t('imagePreviewAlt')}
          />
        </div>
        <div>
          <label className={labelClass}>{t('imageAlt')}</label>
          <input
            type="text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="min-w-[160px] justify-center"
        >
          {loading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Changes'}
        </Button>
        <Link href="/producer/products"
          className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors">
          {t('cancel')}
        </Link>
      </div>
    </form>
  )
}
