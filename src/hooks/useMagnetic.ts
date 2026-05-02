'use client'

import { useEffect, useRef } from 'react'
import { useSpring } from 'framer-motion'

/**
 * Attaches a magnetic pull effect to an element.
 * The element nudges toward the cursor while hovered, then springs back.
 *
 * @param strength  How strongly the element moves toward the cursor (0–1). Default 0.38.
 */
export function useMagnetic(strength = 0.38) {
  const ref = useRef<HTMLElement>(null)

  const x = useSpring(0, { stiffness: 220, damping: 14, mass: 0.6 })
  const y = useSpring(0, { stiffness: 220, damping: 14, mass: 0.6 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onMouseMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      x.set(dx * strength)
      y.set(dy * strength)
    }

    function onMouseLeave() {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [x, y, strength])

  return { ref, x, y }
}
