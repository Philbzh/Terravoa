'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  kicker?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  title,
  subtitle,
  kicker,
  align = 'center',
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <motion.div
      className={`mb-16 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Optional eyebrow kicker */}
      {kicker && (
        <p
          className={`font-sans text-[10px] uppercase tracking-[0.32em] text-secondary mb-5 ${
            centered ? '' : ''
          }`}
        >
          {kicker}
        </p>
      )}

      {/* Accent line for left-aligned headers */}
      {!centered && !kicker && (
        <div className="h-px w-12 bg-secondary mb-5" />
      )}

      <h1
        className="font-serif text-primary leading-[0.92] mb-5"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`font-sans text-sm text-on-surface-variant leading-relaxed ${
            centered ? 'max-w-2xl mx-auto' : 'max-w-xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
