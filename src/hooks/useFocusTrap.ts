'use client'

import { useEffect, type RefObject } from 'react'

/**
 * Ported from Marubeni `apps/web/src/hooks/useFocusTrap.ts`.
 * Zero framework dependencies — runs against the real DOM.
 *
 * Traps keyboard focus inside `containerRef` while `active` is true and
 * restores focus to the previously focused element when deactivated.
 *
 * WCAG 2.4.3 ("Focus Order") compliance for modal dialogs:
 *   - On activation, moves focus to the first focusable element inside the
 *     container (or the container itself if none found — callers must set
 *     `tabIndex={-1}` on the container so that fallback works).
 *   - Tab on the last focusable element wraps to the first; Shift+Tab on
 *     the first wraps to the last.
 *   - On deactivation, focus returns to whichever element was focused
 *     before activation — typically the trigger button.
 *
 * The React 19 type for `useRef` returns `RefObject<T | null>` by default,
 * which is why the `containerRef` parameter accepts `T | null`.
 */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
): void {
  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    // Collect visible, reachable focusables each time we need them (fresh
    // on every Tab press), so dynamically-inserted fields still work.
    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('aria-hidden') && el.offsetParent !== null)

    const initial = focusables()[0] ?? container
    initial.focus({ preventScroll: true })

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // Restore focus to the trigger. Guarded because the trigger may have
      // been unmounted (e.g. the menu that opened the dialog has closed).
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [active, containerRef])
}
