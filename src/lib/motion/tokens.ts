/** Shared motion language — keep in sync with CSS vars in globals.css */

export const motionDurations = {
  quick: 0.2,
  base: 0.3,
  slow: 0.6,
  cinematic: 0.9,
  image: 0.7,
} as const

/** Editorial ease — soft deceleration */
export const motionEase = {
  out: [0.22, 1, 0.36, 1] as const,
  /** Hero title reveal */
  dramatic: [0.16, 1, 0.3, 1] as const,
  /** UI / nav */
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
} as const

export const motionSpring = {
  soft: { type: 'spring' as const, stiffness: 260, damping: 28 },
  snappy: { type: 'spring' as const, stiffness: 400, damping: 32 },
} as const

export const motionViewport = {
  once: true,
  margin: '-80px',
} as const
