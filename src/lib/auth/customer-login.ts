/**
 * Safe redirect target after customer sign-in / sign-up.
 * Blocks open redirects, external URLs and protocol-relative paths.
 *
 * Anything that isn't a same-origin path beginning with a single "/"
 * falls back to `/account`.
 */
export function sanitizeCustomerNextPath(raw: string | null): string {
  const fallback = '/account'
  if (!raw) return fallback
  const s = raw.trim()
  if (!s) return fallback
  // Reject absolute URLs, protocol-relative URLs, and Windows-style paths
  if (!s.startsWith('/') || s.startsWith('//') || s.includes('\\')) return fallback
  // Reject authentication/admin areas — those have their own login flows
  const pathname = s.split(/[?#]/)[0] ?? ''
  if (pathname.startsWith('/admin')) return fallback
  if (pathname.startsWith('/login')) return fallback
  return s
}
