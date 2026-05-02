/**
 * /agb — German alias for "Allgemeine Geschäftsbedingungen" (General T&Cs).
 * Redirects permanently to the canonical /terms page.
 * This alias is important for German SEO and user expectations.
 */
import { redirect } from 'next/navigation'

export default function AgbPage() {
  redirect('/terms')
}
