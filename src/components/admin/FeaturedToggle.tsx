'use client'

import { useTransition } from 'react'
import { Star } from 'lucide-react'
import { toggleProductFeatured, setProductFeaturedRank } from '@/app/admin/products/actions'

interface Props {
  productId: string
  isFeatured: boolean
  rank: number | null
}

export function FeaturedToggle({ productId, isFeatured, rank }: Props) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(() => {
      toggleProductFeatured(productId, !isFeatured)
    })
  }

  function handleRankChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const value = raw === '' ? null : Math.max(1, Number(raw))
    startTransition(() => {
      setProductFeaturedRank(productId, value)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-colors ${
          isFeatured
            ? 'bg-secondary text-on-secondary hover:bg-secondary/80'
            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        } ${pending ? 'opacity-50 cursor-wait' : ''}`}
        title={isFeatured ? 'Remove from featured' : 'Feature on homepage'}
        aria-pressed={isFeatured}
      >
        <Star className="h-3.5 w-3.5" fill={isFeatured ? 'currentColor' : 'none'} />
      </button>
      {isFeatured && (
        <input
          type="number"
          min={1}
          step={1}
          value={rank ?? ''}
          onChange={handleRankChange}
          disabled={pending}
          className="w-14 text-xs px-1.5 py-1 border border-outline-variant/30 rounded-lg bg-surface text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
          title="Display order (lower = first)"
          aria-label="Featured rank"
        />
      )}
    </div>
  )
}
