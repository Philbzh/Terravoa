import { Link } from '@/i18n/navigation'
import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import Stripe from 'stripe'
import { PageContainer } from '@/components/ui/PageContainer'
import { createServerSupabase } from '@/lib/supabase/server'
import { ClearCartOnSuccess } from './ClearCartOnSuccess'

// MED-3: unowned access to a checkout session shouldn't see order detail.
// A session URL contains a random `session_id` and is implicitly a bearer
// credential, but there are legitimate ways it can leak — referrer headers,
// shared screens, shoulder surfing. We apply two guards:
//   1. If the viewer is signed in, their email must match the session's.
//   2. Otherwise, the session must still be fresh (created in the last 30m).
// When either guard fails we render a generic confirmation without amounts.
const FRESH_WINDOW_MS = 30 * 60 * 1000

/** Looks like a Stripe checkout session id we've issued. Defence against
 *  arbitrary strings being passed to `sessions.retrieve`. */
function isStripeSessionId(v: string): boolean {
  return /^cs_(?:test|live)_[A-Za-z0-9]{20,}$/.test(v)
}

export default async function CheckoutSuccessPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ session_id?: string }>
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { session_id } = await searchParams
  if (!session_id || !isStripeSessionId(session_id)) {
    redirect(`/${locale}/checkout`)
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    redirect(`/${locale}`)
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  let amountTotal: string | null = null
  let paymentStatus: string | null = null
  let sessionEmail: string | null = null
  let sessionCreatedMs = 0

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    amountTotal =
      session.amount_total != null
        ? (session.amount_total / 100).toFixed(2)
        : null
    paymentStatus = session.payment_status ?? null
    sessionEmail =
      session.customer_details?.email?.toLowerCase() ??
      session.customer_email?.toLowerCase() ??
      null
    sessionCreatedMs = typeof session.created === 'number' ? session.created * 1000 : 0
  } catch {
    redirect(`/${locale}/checkout`)
  }

  // Ownership check — see top-of-file comment.
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const viewerEmail = user?.email?.toLowerCase() ?? null

  const emailMatch =
    viewerEmail !== null && sessionEmail !== null && viewerEmail === sessionEmail
  const fresh =
    sessionCreatedMs > 0 && Date.now() - sessionCreatedMs < FRESH_WINDOW_MS

  const canShowDetails = emailMatch || (!viewerEmail && fresh)
  if (!canShowDetails) {
    // Hide amounts / payment status for anyone who can't prove ownership.
    amountTotal = null
    paymentStatus = null
  }

  return (
    <PageContainer>
      <ClearCartOnSuccess />
      <div className="max-w-xl mx-auto text-center py-8">
        <h1 className="font-serif text-4xl text-primary mb-4">Thank you</h1>
        <p className="text-on-surface-variant font-sans leading-relaxed mb-2">
          Your order is confirmed. Your products will be shipped directly by the
          producers — fresh from the origin, straight to your door.
        </p>
        <p className="text-on-surface-variant/70 font-sans text-sm leading-relaxed mb-2">
          You&apos;ll receive shipping updates by email as each producer dispatches your items.
        </p>
        {amountTotal && (
          <p className="font-sans text-sm text-on-surface-variant mb-8">
            Total paid: €{amountTotal}
            {paymentStatus && (
              <span className="block text-xs mt-1 capitalize">
                Payment status: {paymentStatus}
              </span>
            )}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/collection"
            className="inline-flex items-center justify-center rounded-full bg-secondary text-on-secondary px-8 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
          >
            Continue shopping
          </Link>
          {viewerEmail && (
            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary px-8 py-3 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:opacity-90 transition-opacity"
            >
              View your orders
            </Link>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-outline-variant/30 px-8 py-3 font-sans text-sm text-primary hover:bg-surface-container-low transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
