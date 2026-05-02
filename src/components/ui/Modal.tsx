'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { cn } from '@/lib/utils'

/**
 * Accessible modal dialog — ported from Marubeni `components/Modal.tsx` and
 * re-skinned with Terravoa tokens (forest-green surface, Noto Serif title).
 *
 * WCAG/ARIA features:
 *   - `role="dialog"` + `aria-modal="true"` for screen-reader announcement.
 *   - `aria-labelledby` → visible `<h2>` title (no duplicate aria-label).
 *   - Optional `aria-describedby` for a description paragraph.
 *   - Focus trapped inside the dialog while open, returned to trigger on close.
 *   - Body scroll locked while open.
 *   - Escape closes (opt-out via `closeOnEscape={false}`).
 *   - Backdrop click is OFF by default (prevents accidental data loss in
 *     forms); opt in with `closeOnBackdrop`.
 *
 * Deliberately locale-agnostic: pass `closeLabel` if you want a translated
 * aria-label on the close button. The English default ("Close") is fine for
 * quick internal uses.
 */

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  /** Optional accessible description rendered after the title. */
  description?: string
  /** When true (default), the description renders as visually hidden. */
  srOnlyDescription?: boolean
  /** aria-label for the × close button. Defaults to "Close". */
  closeLabel?: string
}

const maxWidthClasses: Record<NonNullable<ModalProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  closeOnBackdrop = false,
  closeOnEscape = true,
  description,
  srOnlyDescription = true,
  closeLabel = 'Close',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const backdropMouseDown = useRef(false)

  // Portal target must be resolved client-side only. During SSR / before the
  // first commit, `document` is undefined (or in the case of hydration, the
  // ref isn't stable yet). We gate rendering on `mounted` so the markup is
  // identical between server and first client render (both render `null`),
  // then the portal attaches after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  useFocusTrap(dialogRef, open)
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeOnEscape, onClose])

  if (!open || !mounted) return null

  const content = (
    // The backdrop is purely decorative for keyboard users — Escape is the
    // documented way to close. The mouse handlers exist so a click+drag
    // that begins AND ends on the backdrop dismisses the modal (only when
    // `closeOnBackdrop` is true). Suppressing a11y rule intentionally.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-[fade-in_200ms_ease-out]"
      onMouseDown={(event) => {
        backdropMouseDown.current = event.target === event.currentTarget
      }}
      onMouseUp={(event) => {
        const endedOnBackdrop = event.target === event.currentTarget
        if (closeOnBackdrop && backdropMouseDown.current && endedOnBackdrop) {
          onClose()
        }
        backdropMouseDown.current = false
      }}
    >
      {/* The dialog itself is interactive (role=dialog, focus trapped). The
          onClick exists to stop bubbling so backdrop mouse handlers don't
          see inside-clicks as backdrop clicks. Keyboard support is handled
          by Escape (window listener) and the focus trap. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'w-full rounded-2xl bg-surface-container-lowest shadow-lg p-6',
          'max-h-[90vh] overflow-y-auto focus:outline-none',
          maxWidthClasses[maxWidth],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 gap-4">
          <h2
            id={titleId}
            className="font-serif text-xl text-primary leading-tight"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -m-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label={closeLabel}
          >
            <X aria-hidden size={18} />
          </button>
        </div>

        {description && (
          <p
            id={descriptionId}
            className={
              srOnlyDescription ? 'sr-only' : 'text-sm text-on-surface-variant mb-4 leading-relaxed'
            }
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
