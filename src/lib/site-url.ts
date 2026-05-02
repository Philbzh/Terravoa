import { SITE_URL } from '@/lib/constants'

/** Absolute URL for Stripe and OG (must be https in production). */
export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
