import type { ReactNode } from 'react'

/**
 * Ported from the Marubeni platform (`features/admin/components/StatusChip.tsx`)
 * and adapted to Terravoa's Material-style design tokens.
 *
 * The original Marubeni version relied on pre-defined `chip-*` CSS utility
 * classes. Terravoa doesn't have those, so we inline the Tailwind classes
 * per tone — same ergonomics, no global CSS additions.
 *
 * Usage:
 *   <StatusChip status={producer.status} />               // auto tone
 *   <StatusChip tone="amber">Pending review</StatusChip>  // explicit tone
 */

export type StatusTone = 'neutral' | 'green' | 'red' | 'amber' | 'blue' | 'brand'

const BASE =
  'inline-flex items-center px-2.5 py-0.5 rounded-full font-sans text-[11px] ' +
  'uppercase tracking-wider font-medium whitespace-nowrap'

/**
 * Tone → class map. Uses Terravoa semantic tokens so chips re-tint correctly
 * in dark mode via the existing `:root.dark` overrides.
 */
export const TONE_CLASS: Record<StatusTone, string> = {
  neutral: `${BASE} bg-surface-container text-on-surface-variant`,
  green:   `${BASE} bg-primary-container/25 text-primary dark:text-primary-fixed-dim`,
  red:     `${BASE} bg-error-container/80 text-on-error-container`,
  amber:   `${BASE} bg-tertiary-container/40 text-on-tertiary-container`,
  blue:    `${BASE} bg-surface-variant/70 text-on-surface`,
  brand:   `${BASE} bg-secondary-container/50 text-on-secondary-container`,
}

/**
 * Maps a generic status string → tone. Extends the original Marubeni list
 * with Terravoa-specific values seen during the security audit:
 *   - producer lifecycle: approved / pending / suspended / unlinked / anonymous
 *   - order lifecycle:    new / processing / acked / shipped / delivered
 *   - fulfilment:         awaiting_producer_ack
 *   - payments:           paid / refunded / not_due
 *
 * Callers can always pass an explicit `tone` prop to override.
 */
export function toneFor(status: string | null | undefined): StatusTone {
  const s = (status ?? '').toLowerCase()

  if (
    [
      'approved',
      'active',
      'published',
      'complete',
      'completed',
      'done',
      'paid',
      'delivered',
      'shipped',
    ].includes(s)
  ) {
    return 'green'
  }

  if (
    [
      'rejected',
      'expired',
      'error',
      'failed',
      'cancelled',
      'canceled',
      'inactive',
      'suspended',
      'refunded',
    ].includes(s)
  ) {
    return 'red'
  }

  if (
    [
      'pending',
      'pending_review',
      'review',
      'in_review',
      'processing',
      'waiting',
      'awaiting_producer_ack',
    ].includes(s)
  ) {
    return 'amber'
  }

  if (
    [
      'draft',
      'archived',
      'closed',
      'not_started',
      'not_due',
      'unlinked',
      'anonymous',
      'new',
    ].includes(s)
  ) {
    return 'neutral'
  }

  if (['in_progress', 'open', 'sent', 'requested', 'assigned', 'acked'].includes(s)) {
    return 'blue'
  }

  return 'neutral'
}

export function StatusChip({
  status,
  tone,
  children,
  className = '',
}: {
  status?: string | null
  tone?: StatusTone
  children?: ReactNode
  /** Extra classes appended after the tone classes (e.g. `ml-2`). */
  className?: string
}) {
  const resolved = tone ?? toneFor(status)
  const cls = className ? `${TONE_CLASS[resolved]} ${className}` : TONE_CLASS[resolved]
  return <span className={cls}>{children ?? status ?? '—'}</span>
}
