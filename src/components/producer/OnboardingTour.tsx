'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'tv_producer_tour_v1'

type Step = {
  target: string | null   // data-tour attribute value, or null for modal-only steps
  title: string
  body: string
  placement?: 'right' | 'bottom' | 'left' | 'top'
}

const STEPS: Step[] = [
  {
    target: null,
    title: 'Welcome to your Producer Portal',
    body: 'This is your command centre for managing products, tracking orders, and growing your presence on TerraVera. Let\'s take a quick tour.',
    placement: 'right',
  },
  {
    target: 'dashboard',
    title: 'Dashboard overview',
    body: 'Your live metrics and order feed live here. Check revenue, pending shipments, and recent activity at a glance.',
    placement: 'right',
  },
  {
    target: 'orders',
    title: 'Fulfil orders',
    body: 'Every order your products receive appears here. Add tracking numbers and mark items as shipped from this page.',
    placement: 'right',
  },
  {
    target: 'products',
    title: 'Manage your catalogue',
    body: 'List new products, edit descriptions and pricing, and track 14-day sales sparklines next to each item.',
    placement: 'right',
  },
  {
    target: 'profile',
    title: 'Your producer profile',
    body: 'Customers see this page before buying. Add your story, photos, and certifications to build trust and convert more visitors.',
    placement: 'right',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

type Rect = { top: number; left: number; width: number; height: number }

function getTargetRect(tourId: string): Rect | null {
  const el = document.querySelector(`[data-tour="${tourId}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

function Spotlight({ rect }: { rect: Rect }) {
  const PAD = 6
  return (
    <motion.div
      key={`${rect.top}-${rect.left}`}
      className="pointer-events-none fixed z-[9998] rounded-xl"
      style={{
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        boxShadow: '0 0 0 9999px rgba(12,20,12,0.68)',
        border: '1.5px solid rgba(107,142,107,0.55)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    />
  )
}

// ── Tooltip card ──────────────────────────────────────────────────────────────

const CARD_W = 280

function TooltipCard({
  step,
  stepIndex,
  total,
  rect,
  onNext,
  onPrev,
  onSkip,
}: {
  step: Step
  stepIndex: number
  total: number
  rect: Rect | null
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}) {
  const isFirst = stepIndex === 0
  const isLast = stepIndex === total - 1

  // Compute card position
  let cardStyle: React.CSSProperties = {}
  if (rect) {
    const OFFSET = 18
    // Default: place to the right of the spotlight
    cardStyle = {
      top: rect.top + rect.height / 2 - 90,
      left: rect.left + rect.width + OFFSET,
    }
    // If off-screen right, place below
    if (rect.left + rect.width + OFFSET + CARD_W > window.innerWidth - 16) {
      cardStyle = {
        top: rect.top + rect.height + OFFSET,
        left: Math.max(16, rect.left),
      }
    }
  } else {
    // Centered modal for steps without a target
    cardStyle = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <motion.div
      key={stepIndex}
      className="fixed z-[9999] bg-surface rounded-2xl border border-outline-variant/25 shadow-2xl overflow-hidden"
      style={{ width: CARD_W, ...cardStyle }}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      {/* Accent bar */}
      <div className="h-0.5 bg-secondary" />

      <div className="p-5">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === stepIndex ? 'w-4 bg-secondary' : 'w-1.5 bg-outline-variant/40'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <h3 className="font-serif text-base text-primary mb-2 leading-snug">
          {step.title}
        </h3>
        <p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-5">
          {step.body}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant/40 hover:text-on-surface-variant transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <motion.button
                type="button"
                onClick={onPrev}
                whileTap={{ scale: 0.88 }}
                className="w-7 h-7 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
              >
                <ArrowLeft size={12} strokeWidth={2} />
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={onNext}
              whileTap={{ scale: 0.88 }}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
                isLast
                  ? 'bg-secondary text-on-secondary hover:bg-secondary/90'
                  : 'bg-primary text-on-primary hover:bg-primary/90'
              }`}
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={12} strokeWidth={2} />
                  Done
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={12} strokeWidth={2} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Step counter */}
      <p className="font-sans text-[9px] uppercase tracking-wider text-on-surface-variant/25 text-right px-5 pb-3">
        {stepIndex + 1} / {total}
      </p>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function OnboardingTour() {
  const [step, setStep] = useState(-1)     // -1 = not started, -2 = done
  const [rect, setRect] = useState<Rect | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const done = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)
    if (!done) {
      // Small delay so sidebar is rendered
      const id = setTimeout(() => setStep(0), 1200)
      return () => clearTimeout(id)
    }
  }, [])

  // Recompute rect when step changes
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) {
      setRect(null)
      return
    }
    const target = STEPS[step].target
    if (!target) {
      setRect(null)
      return
    }
    const r = getTargetRect(target)
    setRect(r)

    // Scroll target into view
    const el = document.querySelector(`[data-tour="${target}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [step])

  const complete = useCallback(() => {
    setStep(-2)
    localStorage.setItem(STORAGE_KEY, '1')
  }, [])

  const next = useCallback(() => {
    if (step >= STEPS.length - 1) {
      complete()
    } else {
      setStep((s) => s + 1)
    }
  }, [step, complete])

  const prev = useCallback(() => {
    setStep((s) => Math.max(0, s - 1))
  }, [])

  const skip = useCallback(() => {
    complete()
  }, [complete])

  if (!mounted) return null

  const active = step >= 0 && step < STEPS.length
  const currentStep = active ? STEPS[step] : null

  return createPortal(
    <AnimatePresence>
      {active && currentStep && (
        <>
          {/* Backdrop click-to-skip (but don't steal clicks from the spotlight element) */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[9997]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={skip}
          />

          {/* Spotlight ring over the target element */}
          {rect && (
            <Spotlight key={`spot-${step}`} rect={rect} />
          )}

          {/* Tooltip card */}
          <TooltipCard
            key={`card-${step}`}
            step={currentStep}
            stepIndex={step}
            total={STEPS.length}
            rect={rect}
            onNext={next}
            onPrev={prev}
            onSkip={skip}
          />

          {/* Dismiss X */}
          <motion.button
            key="dismiss"
            type="button"
            onClick={skip}
            aria-label="Close tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            className="fixed top-4 right-4 z-[9999] w-8 h-8 rounded-full bg-surface/90 border border-outline-variant/25 shadow-md flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
          >
            <X size={13} strokeWidth={2} />
          </motion.button>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
