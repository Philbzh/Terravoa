'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Truck, Heart } from 'lucide-react'
import { cn, isExternalUnoptimizedSrc } from '@/lib/utils'
import { Badge, type BadgeVariant } from './Badge'
import { useProductBadgeLabel } from '@/lib/i18n/collection-labels'
import { useWishlist } from '@/lib/wishlist'
import { useLocale, useTranslations } from 'next-intl'

/** Country name → ISO 3166-1 alpha-2 code (lowercase) for flagcdn.com */
const countryISO: Record<string, string> = {
  Italy: 'it',
  France: 'fr',
  Spain: 'es',
  Portugal: 'pt',
  Germany: 'de',
  Austria: 'at',
  Greece: 'gr',
  Switzerland: 'ch',
  Netherlands: 'nl',
  Belgium: 'be',
  Croatia: 'hr',
}

function getFlagCountryCode(origin: string): string | null {
  for (const [country, code] of Object.entries(countryISO)) {
    if (origin.includes(country)) return code
  }
  return null
}

function FlagImage({ origin }: { origin: string }) {
  const t = useTranslations('ui')
  const locale = useLocale()
  const code = getFlagCountryCode(origin)
  if (!code) {
    return (
      <span className="text-sm" aria-hidden title={origin}>
        🌍
      </span>
    )
  }
  const src = `https://flagcdn.com/w20/${code}.png`
  let regionLabel: string
  try {
    regionLabel =
      new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) ??
      code.toUpperCase()
  } catch {
    regionLabel = code.toUpperCase()
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={t('countryFlagAlt', { country: regionLabel })}
      width={16}
      height={12}
      className="inline rounded-[2px] object-cover"
      style={{ width: 18, height: 13 }}
    />
  )
}

interface ProductCardProps {
  slug?: string
  name: string
  price: string
  origin: string
  producer: string
  imageSrc: string
  imageAlt: string
  badge?: { label: string; variant: BadgeVariant }
  priceRaw?: number
  averageRating?: number
  reviewCount?: number
  /** Smaller image and type — e.g. producer profile grid */
  compact?: boolean
  /** Light text for dark backgrounds */
  invertText?: boolean
}

export function ProductCard({
  slug,
  name,
  price,
  origin,
  producer,
  imageSrc,
  imageAlt,
  badge,
  priceRaw,
  compact = false,
  invertText = false,
}: ProductCardProps) {
  const t = useTranslations('ui')
  const { isInWishlist, toggle } = useWishlist()
  const inWishlist = slug ? isInWishlist(slug) : false
  const translatedBadgeLabel = useProductBadgeLabel(badge?.label ?? '')
  const badgeLabel = badge ? translatedBadgeLabel : undefined

  return (
    <div
      className={cn(
        'group cursor-pointer w-full transition-[transform,box-shadow] duration-500 ease-[var(--ease-editorial)]',
        !compact && 'hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]',
        compact && 'max-w-[200px] sm:max-w-[220px]',
      )}
    >
      <div
        className={cn(
          'bg-surface-container-lowest rounded-lg overflow-hidden relative mx-auto shadow-[var(--shadow-sm)]',
          compact ? 'aspect-square mb-3 max-h-[160px] w-[160px] sm:max-h-[180px] sm:w-[180px]' : 'aspect-square mb-6 w-full',
        )}
      >
        {slug && !compact ? (
          <motion.div layoutId={`product-cover-${slug}`} className="absolute inset-0">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlNWUwIi8+PC9zdmc+"
              unoptimized={isExternalUnoptimizedSrc(imageSrc)}
            />
          </motion.div>
        ) : (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
            sizes={
              compact
                ? '(max-width: 640px) 160px, 180px'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            }
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlNWUwIi8+PC9zdmc+"
            unoptimized={isExternalUnoptimizedSrc(imageSrc)}
          />
        )}

        {/* Hover reveal overlay */}
        {!compact && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 flex items-end justify-center pb-5 pointer-events-none">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
              View product →
            </span>
          </div>
        )}

        {badge && !slug && (
          <div className="absolute top-4 right-4">
            <Badge label={badgeLabel ?? badge.label} variant={badge.variant} />
          </div>
        )}
        {slug ? (
          <div className={cn('absolute flex flex-col items-end gap-2', compact ? 'top-2 right-2' : 'top-3 right-3')}>
            {badge && <Badge label={badgeLabel ?? badge.label} variant={badge.variant} />}
            <button
              type="button"
              aria-label={inWishlist ? t('removeFromWishlist') : t('addToWishlist')}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggle({ slug, name, price: priceRaw, imageSrc })
              }}
              className={cn(
                'flex items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm shadow-sm hover:bg-surface transition-colors',
                compact ? 'w-7 h-7' : 'w-8 h-8',
              )}
            >
              <Heart
                size={compact ? 14 : 16}
                strokeWidth={1.5}
                className={inWishlist ? 'fill-red-500 text-red-500' : 'text-on-surface-variant'}
              />
            </button>
          </div>
        ) : null}
      </div>
      <div className={cn('space-y-1', compact && 'text-left')}>
        <span
          className={cn(
            'font-sans uppercase tracking-[0.15em] flex items-center gap-1.5',
            invertText ? 'text-secondary-fixed-dim' : 'text-secondary',
            compact ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          <FlagImage origin={origin} />
          {origin} &bull; {producer}
        </span>
        <h4 className={cn('font-serif', invertText ? 'text-on-primary' : 'text-primary', compact ? 'text-sm leading-snug' : 'text-lg')}>
          {name}
        </h4>
        <p className={cn('font-sans', invertText ? 'text-on-primary/70' : 'text-on-surface-variant', compact && 'text-sm')}>{price}</p>
        <p
          className={cn(
            'flex items-center gap-1.5 font-sans uppercase tracking-wider pt-1',
            invertText ? 'text-on-primary/40' : 'text-on-surface-variant/60',
            compact ? 'text-[9px]' : 'text-[10px]',
          )}
        >
          <Truck size={compact ? 10 : 11} strokeWidth={1.5} />
          {t('shipsFromProducer')}
        </p>
      </div>
    </div>
  )
}
