import { Award, CalendarDays, Leaf, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Individual trust badge ────────────────────────────────────────────────────

type TrustBadgeVariant = 'traditional' | 'established' | 'organic' | 'verified'

interface TrustBadgeProps {
  variant: TrustBadgeVariant
  /** Only used with "established" variant */
  year?: string | number
  className?: string
  size?: 'sm' | 'md'
}

const badgeConfig: Record<
  TrustBadgeVariant,
  { icon: typeof Award; label: (year?: string | number) => string; classes: string }
> = {
  traditional: {
    icon: Award,
    label: () => 'Traditional Producer',
    classes: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/30',
  },
  established: {
    icon: CalendarDays,
    label: (year) => year ? `Est. ${year}` : 'Established',
    classes: 'bg-stone-50 text-stone-600 border-stone-200/60 dark:bg-stone-800/30 dark:text-stone-400 dark:border-stone-600/30',
  },
  organic: {
    icon: Leaf,
    label: () => 'Organic',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30',
  },
  verified: {
    icon: ShieldCheck,
    label: () => 'Terravoa Verified',
    classes: 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-700/30',
  },
}

export function TrustBadge({ variant, year, className, size = 'md' }: TrustBadgeProps) {
  const config = badgeConfig[variant]
  const Icon = config.icon
  const iconSize = size === 'sm' ? 11 : 13

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-sans font-medium',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-2.5 py-1',
        config.classes,
        className,
      )}
    >
      <Icon size={iconSize} strokeWidth={1.8} className="shrink-0" />
      {config.label(year)}
    </span>
  )
}

// ── Badge row (used on producer pages and product cards) ─────────────────────

interface ProducerTrustBadgesProps {
  /** e.g. ['Organic', 'Handmade', 'Family-Owned'] from the producer.badges field */
  badges?: string[]
  established?: string | number
  size?: 'sm' | 'md'
  className?: string
}

const KNOWN_BADGES: Record<string, TrustBadgeVariant> = {
  organic:        'organic',
  'bio':          'organic',
  traditional:    'traditional',
  handmade:       'traditional',
  artisanal:      'traditional',
  verified:       'verified',
  'family-owned': 'traditional',
}

export function ProducerTrustBadges({
  badges = [],
  established,
  size = 'md',
  className,
}: ProducerTrustBadgesProps) {
  const mappedBadges = badges
    .map((b) => {
      const key = b.toLowerCase().replace(/\s+/g, '-')
      const variant = KNOWN_BADGES[key]
      return variant ? { variant, label: b } : null
    })
    .filter(Boolean) as Array<{ variant: TrustBadgeVariant; label: string }>

  // De-duplicate by variant
  const seen = new Set<TrustBadgeVariant>()
  const dedupedBadges = mappedBadges.filter(({ variant }) => {
    if (seen.has(variant)) return false
    seen.add(variant)
    return true
  })

  if (dedupedBadges.length === 0 && !established) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {dedupedBadges.map(({ variant }) => (
        <TrustBadge key={variant} variant={variant} size={size} />
      ))}
      {established && (
        <TrustBadge variant="established" year={established} size={size} />
      )}
    </div>
  )
}
