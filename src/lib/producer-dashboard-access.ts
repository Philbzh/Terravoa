import 'server-only'

import { getProducerForSession } from '@/lib/producer/server'

/**
 * True only when the current session belongs to an APPROVED producer.
 *
 * CRIT-4 fix: previously returned `Boolean(user)`, which let any registered
 * customer view internal commercial terms (commission rates, pricing tiers).
 * We now defer to `getProducerForSession`, which is filtered to approved
 * producers only (MED-8).
 *
 * The PRODUCER_DASHBOARD_PREVIEW bypass remains for local/staging previews —
 * it is deliberately only honoured outside production.
 */
export async function canViewProducerCommercialTerms(): Promise<boolean> {
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PRODUCER_DASHBOARD_PREVIEW === 'true'
  ) {
    return true
  }

  const session = await getProducerForSession()
  return Boolean(session?.producer)
}
