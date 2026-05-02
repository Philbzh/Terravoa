'use client'

/**
 * PostHogProvider
 *
 * Initialises PostHog analytics ONLY after the user has given cookie consent.
 * Consent is stored by <CookieBanner> in localStorage under the key
 * `terravoa_cookie_consent` with value `'accepted'` or `'declined'`.
 *
 * This component:
 *  - Polls for consent on mount (covers the case where the user consents
 *    during the same session before a page reload).
 *  - Is a no-op if NEXT_PUBLIC_POSTHOG_KEY is not set (safe for local dev).
 *  - Never sends data to PostHog until consent = 'accepted'.
 */

import { useEffect } from 'react'
import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'
const CONSENT_KEY = 'terravoa_cookie_consent'

let initialised = false

function init() {
  if (initialised || !POSTHOG_KEY || typeof window === 'undefined') return
  initialised = true
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Don't auto-capture until we explicitly opt in
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    // Respect user privacy preferences
    respect_dnt: true,
    persistence: 'localStorage',
  })
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!POSTHOG_KEY) return

    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent !== 'accepted') return

    init()
    posthog.opt_in_capturing()

    // Capture page views on route change
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname, searchParams])

  // Also listen for consent being granted during the current session
  useEffect(() => {
    if (!POSTHOG_KEY) return

    function onStorageChange(e: StorageEvent) {
      if (e.key === CONSENT_KEY && e.newValue === 'accepted') {
        init()
        posthog.opt_in_capturing()
        posthog.capture('$pageview', { $current_url: window.location.href })
      }
      if (e.key === CONSENT_KEY && e.newValue === 'declined') {
        posthog.opt_out_capturing()
      }
    }

    window.addEventListener('storage', onStorageChange)
    return () => window.removeEventListener('storage', onStorageChange)
  }, [])

  return <>{children}</>
}
