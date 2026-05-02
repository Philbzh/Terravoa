/**
 * Safe redirect target after admin sign-in. Blocks open redirects and external URLs.
 */
export function sanitizeAdminNextPath(raw: string | null): string {
  if (!raw) return '/admin'
  const s = raw.trim()
  if (!s.startsWith('/') || s.startsWith('//') || s.includes('\\')) return '/admin'
  const pathname = s.split(/[?#]/)[0] ?? ''
  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) return '/admin'
  return s
}
