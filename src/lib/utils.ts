import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

/** Next/Image: known safe remote hosts that are in remotePatterns. */
const KNOWN_REMOTE_HOSTS = [
  'cdn.sanity.io',
  'supabase.co',
  'cloudinary.com',
  'images.unsplash.com',
]

/**
 * Returns true for any external URL that is NOT in our remotePatterns list.
 * These should be rendered with `unoptimized` to avoid Next.js Image errors.
 */
export function isExternalUnoptimizedSrc(src: string): boolean {
  if (!src.startsWith('https://')) return false
  try {
    const { hostname } = new URL(src)
    return !KNOWN_REMOTE_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))
  } catch {
    return false
  }
}

/** @deprecated Use isExternalUnoptimizedSrc instead */
export function isSanityCdnSrc(src: string): boolean {
  return src.startsWith('https://cdn.sanity.io')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
