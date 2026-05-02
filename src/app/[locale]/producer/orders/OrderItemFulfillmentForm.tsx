'use client'

import { useActionState } from 'react'
import { Loader2, Check, PackageCheck, Truck } from 'lucide-react'
import {
  confirmOrderItem,
  updateProducerOrderItemFulfillment,
  type FulfillmentResult,
  type ConfirmResult,
} from './actions'

type Props = {
  orderItemId: string
  initialTracking: string | null
  /** Current status of this order line from the DB */
  status: string
  /** Payout status — 'due' means tracking entered, payout owed */
  payoutStatus: string | null
}

// ── Step 1: Pending — producer confirms they will ship ───────────────────────
function ConfirmStep({ orderItemId }: { orderItemId: string }) {
  const [state, formAction, pending] = useActionState(
    confirmOrderItem,
    null as ConfirmResult,
  )

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/10">
      <p className="font-sans text-xs text-on-surface-variant mb-3">
        Please confirm that you will fulfill this order and prepare the shipment.
      </p>
      <form action={formAction}>
        <input type="hidden" name="order_item_id" value={orderItemId} />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-secondary text-on-secondary px-5 py-2 font-sans text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <PackageCheck size={13} />
          )}
          {pending ? 'Confirming…' : 'Confirm order'}
        </button>
        {state?.ok === false && (
          <p className="mt-2 font-sans text-xs text-error" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </div>
  )
}

// ── Step 2: Accepted — producer enters tracking number ───────────────────────
function TrackingStep({
  orderItemId,
  initialTracking,
}: {
  orderItemId: string
  initialTracking: string | null
}) {
  const [state, formAction, pending] = useActionState(
    updateProducerOrderItemFulfillment,
    null as FulfillmentResult,
  )

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/25 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-secondary">
          <PackageCheck size={11} />
          Order confirmed
        </span>
        <span className="font-sans text-xs text-on-surface-variant">
          — now enter the tracking number once shipped
        </span>
      </div>
      <form action={formAction} className="space-y-2">
        <input type="hidden" name="order_item_id" value={orderItemId} />
        <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
          Carrier tracking number
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            name="tracking"
            type="text"
            defaultValue={initialTracking ?? ''}
            placeholder="e.g. 1Z999AA10123456784"
            autoComplete="off"
            disabled={pending}
            className="flex-1 rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
          />
          <div className="flex gap-2 shrink-0">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-on-primary px-4 py-2 font-sans text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Truck size={13} />
                  Submit tracking
                </>
              )}
            </button>
          </div>
        </div>
        {state?.ok === false && state.error && (
          <p className="mt-2 font-sans text-xs text-error" role="alert">
            {state.error}
          </p>
        )}
        {state?.ok === true && (
          <p className="mt-2 font-sans text-xs text-secondary flex items-center gap-1">
            <Check size={14} strokeWidth={2} />
            Tracking saved — payout queued.
          </p>
        )}
      </form>
    </div>
  )
}

// ── Step 3: Shipped — read-only confirmation, payout due ────────────────────
function ShippedStep({
  trackingNumber,
  payoutStatus,
}: {
  trackingNumber: string | null
  payoutStatus: string | null
}) {
  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/10">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-primary">
          <Truck size={11} />
          Shipped
        </span>
        {payoutStatus === 'due' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 border border-secondary/25 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-secondary">
            Payout queued
          </span>
        )}
        {payoutStatus === 'paid' && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container border border-outline-variant/25 px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">
            <Check size={11} />
            Paid
          </span>
        )}
      </div>
      {trackingNumber && (
        <p className="font-sans text-xs text-on-surface-variant">
          Tracking:{' '}
          <span className="font-mono text-on-surface">{trackingNumber}</span>
        </p>
      )}
    </div>
  )
}

// ── Router: pick the right step based on current status ─────────────────────
export function OrderItemFulfillmentForm({
  orderItemId,
  initialTracking,
  status,
  payoutStatus,
}: Props) {
  if (status === 'shipped' || status === 'delivered') {
    return (
      <ShippedStep
        trackingNumber={initialTracking}
        payoutStatus={payoutStatus}
      />
    )
  }

  if (status === 'producer_accepted') {
    return (
      <TrackingStep
        orderItemId={orderItemId}
        initialTracking={initialTracking}
      />
    )
  }

  // Default: 'pending' or unknown → Step 1
  return <ConfirmStep orderItemId={orderItemId} />
}
