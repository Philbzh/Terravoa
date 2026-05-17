'use client'

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from '@/i18n/navigation'
import { motionDurations, motionEase } from '@/lib/motion/tokens'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          className="min-h-screen"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -10 }}
          transition={{
            duration: reduced ? 0 : motionDurations.slow,
            ease: motionEase.smooth,
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </LayoutGroup>
  )
}
