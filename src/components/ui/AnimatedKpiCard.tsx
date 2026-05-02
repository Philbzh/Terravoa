'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ClipboardList, Users, Package, ShoppingCart, UserCheck,
  Mail, Euro, TrendingUp, ShoppingBag, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Icon registry — all icons used across admin + producer dashboards ─────────
// String names are safe to pass across the Server→Client boundary.

const ICON_MAP = {
  ClipboardList, Users, Package, ShoppingCart, UserCheck,
  Mail, Euro, TrendingUp, ShoppingBag, Clock,
} as const

export type KpiIconName = keyof typeof ICON_MAP

// ── Props ─────────────────────────────────────────────────────────────────────

interface AnimatedKpiCardProps {
  label: string
  value: string
  iconName: KpiIconName
  sub?: string
  href?: string
  index?: number
  className?: string
}

// ── Value parsing + count-up ──────────────────────────────────────────────────

function parseValue(value: string): { prefix: string; raw: number; decimals: number } | null {
  const prefix = value.startsWith('€') ? '€' : ''
  const stripped = prefix ? value.slice(1) : value
  // de-DE: dots = thousands sep, comma = decimal
  const normalised = stripped.replace(/\./g, '').replace(',', '.')
  const num = parseFloat(normalised)
  if (isNaN(num)) return null
  const decimals = stripped.includes(',') ? stripped.split(',')[1]?.length ?? 0 : 0
  return { prefix, raw: num, decimals }
}

function formatDisplayValue(parsed: ReturnType<typeof parseValue>, animatedRaw: number): string {
  if (!parsed) return ''
  const { prefix, decimals } = parsed
  if (decimals > 0) {
    return `${prefix}${animatedRaw.toLocaleString('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`
  }
  return `${prefix}${Math.round(animatedRaw).toLocaleString('de-DE')}`
}

function useCountUp(target: number, duration = 1.1, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let rafId: number
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(eased * target)
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, active])
  return value
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AnimatedKpiCard({
  label,
  value,
  iconName,
  sub,
  href,
  index = 0,
  className,
}: AnimatedKpiCardProps) {
  const Icon = ICON_MAP[iconName]
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const parsed = parseValue(value)
  const animated = useCountUp(parsed?.raw ?? 0, 1.1, inView && !!parsed)
  const displayValue = parsed && inView ? formatDisplayValue(parsed, animated) : value

  const inner = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3',
        href && 'hover:border-primary/30 transition-colors cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <Icon
          size={14}
          strokeWidth={1.2}
          className={cn(
            'text-on-surface-variant/50',
            href && 'group-hover:text-primary transition-colors',
          )}
        />
      </div>
      <p className="font-serif text-2xl text-primary leading-none tabular-nums">
        {displayValue}
      </p>
      {sub && (
        <p className="font-sans text-[10px] text-on-surface-variant/60 mt-1.5">{sub}</p>
      )}
    </motion.div>
  )

  if (href) {
    return <a href={href} className="block">{inner}</a>
  }
  return inner
}
