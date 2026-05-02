'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme-store'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  /** Passed from Navbar — switches colours for transparent hero overlay */
  onHero?: boolean
}

export function ThemeToggle({ onHero = false }: ThemeToggleProps) {
  const { isDark, toggle } = useThemeStore()

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.85, rotate: isDark ? -25 : 25 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      className={cn(
        'relative w-7 h-7 flex items-center justify-center transition-opacity hover:opacity-70',
        onHero ? 'text-white' : 'text-primary',
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute"
          >
            <Sun size={17} strokeWidth={1.5} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute"
          >
            <Moon size={16} strokeWidth={1.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
