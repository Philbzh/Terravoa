import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  withArrow?: boolean
}

export function Button({
  variant = 'primary',
  withArrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        variant === 'primary' &&
          'bg-secondary text-on-secondary text-[11px] uppercase tracking-[0.2em] font-semibold px-8 py-4 rounded-full hover:bg-secondary-container transition-colors duration-300',
        variant === 'secondary' &&
          'bg-surface-container-high text-sm px-8 py-4 rounded-full text-on-surface hover:bg-surface-container-highest transition-colors duration-300',
        variant === 'tertiary' &&
          'text-secondary underline underline-offset-[6px] decoration-secondary/40 hover:decoration-secondary',
        props.disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className,
      )}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight size={16} strokeWidth={2} />}
    </button>
  )
}
