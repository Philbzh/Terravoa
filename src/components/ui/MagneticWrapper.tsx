'use client'

import { motion } from 'framer-motion'
import { useMagnetic } from '@/hooks/useMagnetic'

interface MagneticWrapperProps {
  children: React.ReactNode
  strength?: number
  className?: string
}

/**
 * Wraps any element with a magnetic pull effect.
 * The child nudges toward the cursor on hover and springs back on leave.
 * Drop-in: just wrap any CTA or button.
 */
export function MagneticWrapper({
  children,
  strength = 0.38,
  className,
}: MagneticWrapperProps) {
  const { ref, x, y } = useMagnetic(strength)

  return (
    <motion.div
      // cast needed: motion.div ref is HTMLDivElement, but useMagnetic uses HTMLElement
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y, display: 'inline-flex' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
