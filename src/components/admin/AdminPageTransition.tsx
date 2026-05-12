'use client'

import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export function AdminPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  )
}
