'use client'

import { useEffect } from 'react'

/**
 * Ported from Marubeni `apps/web/src/hooks/useBodyScrollLock.ts`.
 *
 * Locks body scroll while `active` is true. Restores the previous value of
 * `document.body.style.overflow` on cleanup. Used by `<Modal>` so the page
 * underneath doesn't wheel/touch-scroll while a dialog is open.
 *
 * Multiple concurrent locks are tracked via a module-level counter so
 * nested modals (e.g. a ConfirmDialog launched from a form Modal) still
 * work without one closing reopening the body scroll prematurely.
 */

let lockCount = 0
let savedOverflow: string | null = null

export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return
    if (lockCount === 0) {
      savedOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1
    return () => {
      lockCount -= 1
      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow ?? ''
        savedOverflow = null
      }
    }
  }, [active])
}
