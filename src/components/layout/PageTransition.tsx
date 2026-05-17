'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from '@/i18n/navigation'
import { motionDurations, motionEase } from '@/lib/motion/tokens'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  const motionProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: motionDurations.base, ease: motionEase.smooth },
      }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main key={pathname} className="min-h-screen" {...motionProps}>
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
