/**
 * /impressum — German-standard URL alias for the legal notice page.
 * Redirects permanently to the canonical /imprint page.
 * Required by German users and §5 TMG conventions.
 */
import { redirect } from 'next/navigation'

export default function ImpressumPage() {
  redirect('/imprint')
}
