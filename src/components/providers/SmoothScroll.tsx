'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'

/** Routes where native scroll is preferred (forms, checkout, dashboards). */
const SMOOTH_SCROLL_DISABLED = [
  '/cart',
  '/checkout',
  '/account',
  '/login',
  '/producer',
  '/admin',
] as const

function isSmoothScrollDisabled(pathname: string) {
  return SMOOTH_SCROLL_DISABLED.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

/**
 * Lenis smooth scroll on marketing pages only.
 * Disabled for checkout, account, and producer portal.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (isSmoothScrollDisabled(pathname)) return

    let lenis: import('lenis').default | null = null
    let cancelled = false

    void import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return
      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        touchMultiplier: 1.2,
        autoRaf: true,
      })
    })

    return () => {
      cancelled = true
      lenis?.destroy()
      lenis = null
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped')
    }
  }, [pathname])

  return <>{children}</>
}
