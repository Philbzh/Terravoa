import { getTranslations } from 'next-intl/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { StarRating } from '@/components/ui/StarRating'

interface ReviewRow {
  id: string
  reviewer_name: string
  rating: number
  body: string
  created_at: string
}

interface ReviewsListProps {
  productSlug: string
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function ReviewsList({ productSlug }: ReviewsListProps) {
  const t = await getTranslations('reviews')
  const supabase = await createServerSupabase()

  const { data } = await (supabase as any)
    .from('product_reviews')
    .select('id, reviewer_name, rating, body, created_at')
    .eq('product_slug', productSlug)
    .eq('approved', true)
    .order('created_at', { ascending: false })

  const reviews = (data ?? []) as ReviewRow[]

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-surface p-5">
        <p className="font-sans text-sm text-on-surface-variant mb-2">
          {t('emptyState')}
        </p>
        <p className="font-sans text-xs text-on-surface-variant/80">
          Share the first verified experience to help other buyers.
        </p>
      </div>
    )
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const rounded = Math.round(average * 10) / 10

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <StarRating rating={average} size="md" />
        <span className="font-serif text-xl text-primary">{rounded}</span>
        <span className="font-sans text-sm text-on-surface-variant">
          · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-6 divide-y divide-outline-variant/10">
        {reviews.map((review) => (
          <div key={review.id} className="pt-6 first:pt-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-serif text-base text-primary">{review.reviewer_name}</p>
                <p className="font-sans text-xs text-on-surface-variant">{fmt(review.created_at)}</p>
              </div>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="font-sans text-sm text-on-surface/80 leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
