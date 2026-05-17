'use client'

import { useReducedMotion } from 'framer-motion'
import { motionDurations, motionEase, motionViewport } from './tokens'

/**
 * Central hook for respecting reduced motion while applying Terravoa motion tokens.
 */
export function useMotionConfig() {
  const reduced = useReducedMotion() ?? false

  return {
    reduced,
    duration: reduced ? 0 : motionDurations.slow,
    ease: motionEase.out,
    viewport: reduced ? { once: true as const } : motionViewport,
    transition: reduced
      ? { duration: 0 }
      : { duration: motionDurations.slow, ease: motionEase.out },
    /** Parallax / scroll-linked offsets — zero when reduced */
    parallaxRange: reduced ? (['0%', '0%'] as const) : undefined,
  }
}
