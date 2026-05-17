import { cn } from '@/lib/utils'

/** Subtle film grain overlay — disabled via CSS when prefers-reduced-motion */
export function FilmGrain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 z-[15] opacity-[0.042] mix-blend-overlay film-grain',
        className,
      )}
    />
  )
}
