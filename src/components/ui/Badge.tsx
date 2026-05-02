import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'producer'    // earthy green — artisan / origin label
  | 'bestseller'  // gold/primary — top seller
  | 'new'         // terracotta — recently added
  | 'limited'     // deep plum — limited availability
  | 'seasonal'    // sage — harvest / seasonal edition
  | 'sale'        // warm red — price reduction
  | 'preorder'    // secondary — pre-order available
  | 'subscription' // muted primary — subscribe & save

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  className?: string
}

export function Badge({ label, variant = 'producer', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-[10px] font-sans uppercase tracking-wider px-3 py-1 rounded-full',
        variant === 'producer'     && 'bg-tertiary-fixed text-tertiary',
        variant === 'bestseller'   && 'bg-primary text-on-primary',
        variant === 'new'          && 'bg-badge-new/15 text-badge-new border border-badge-new/25',
        variant === 'limited'      && 'bg-badge-limited/15 text-badge-limited border border-badge-limited/25',
        variant === 'seasonal'     && 'bg-badge-seasonal/15 text-badge-seasonal border border-badge-seasonal/25',
        variant === 'sale'         && 'bg-badge-sale/15 text-badge-sale border border-badge-sale/25',
        variant === 'preorder'     && 'bg-secondary/15 text-secondary border border-secondary/30',
        variant === 'subscription' && 'bg-primary/10 text-primary border border-primary/20',
        className,
      )}
    >
      {label}
    </span>
  )
}
