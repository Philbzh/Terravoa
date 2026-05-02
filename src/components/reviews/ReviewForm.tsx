'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { submitReview } from '@/app/[locale]/collection/[slug]/actions'
import { Link } from '@/i18n/navigation'

interface ReviewFormProps {
  productSlug: string
}

export function ReviewForm({ productSlug }: ReviewFormProps) {
  const tr = useTranslations('reviews')
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; name?: string } } | null | undefined>(undefined)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user as typeof user)
    })
  }, [])

  if (user === undefined) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <p className="font-sans text-sm text-on-surface-variant">Checking account status...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 text-center">
        <p className="font-sans text-sm text-on-surface-variant">
          <Link href="/login" className="text-secondary hover:text-primary underline underline-offset-2 transition-colors">
            {tr('signIn')}
          </Link>{' '}
          {tr('signInSuffix')}
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="font-serif text-lg text-primary mb-1">{tr('thankYouTitle')}</p>
        <p className="font-sans text-sm text-on-surface-variant">
          {tr('thankYouBody')}
        </p>
      </div>
    )
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    ''

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (selectedRating === 0) {
      setError(tr('errorRating'))
      return
    }

    const formData = new FormData(e.currentTarget)
    formData.set('rating', String(selectedRating))
    setPending(true)

    const result = await submitReview(productSlug, formData)
    setPending(false)

    if (result.success) {
      setSubmitted(true)
      formRef.current?.reset()
    } else {
      setError(result.error ?? tr('errorGeneric'))
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <p className="font-sans text-xs text-on-surface-variant leading-relaxed border-l-2 border-secondary/35 pl-3 mb-1">
        {tr('formHint')}
      </p>
      {/* Star selector */}
      <div>
        <label className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-2">
          {tr('ratingLabel')}
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const value = i + 1
            const active = value <= (hoveredStar || selectedRating)
            return (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                onMouseEnter={() => setHoveredStar(value)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedRating(value)}
                className="text-secondary transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded"
              >
                <svg width={24} height={24} viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={active ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={active ? 0 : 1.5}
                  />
                </svg>
              </button>
            )
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="reviewer_name" className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-1.5">
          {tr('nameLabel')}
        </label>
        <input
          id="reviewer_name"
          name="reviewer_name"
          type="text"
          required
          defaultValue={displayName}
          className="w-full rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition"
          placeholder={tr('namePlaceholder')}
        />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-1.5">
          {tr('reviewLabel')}
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={20}
          rows={4}
          className="w-full rounded-lg border border-outline-variant/30 bg-surface px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition resize-none"
          placeholder={tr('reviewPlaceholder')}
        />
      </div>

      {error && (
        <p className="font-sans text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full border border-primary px-7 py-2.5 font-sans text-sm uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? tr('submittingButton') : tr('submitButton')}
      </button>
    </form>
  )
}
