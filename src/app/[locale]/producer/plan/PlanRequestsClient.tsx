'use client'

import { useState, useTransition } from 'react'
import { submitPlanRequest } from './actions'

type PendingRequest = {
  id: string
  request_type: string
  requested_plan: string | null
  status: string
  created_at: string
}

type Props = {
  hasPendingUpgrade: boolean
  hasPendingFeatured: boolean
  hasPendingHomepage: boolean
  history: PendingRequest[]
}

export function PlanRequestsClient({
  hasPendingUpgrade,
  hasPendingFeatured,
  hasPendingHomepage,
  history,
}: Props) {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function submitRequest(formData: FormData, successText: string) {
    setMessage(null)
    startTransition(async () => {
      const result = await submitPlanRequest(formData)
      if (result.ok) {
        setMessage(successText)
      } else {
        setMessage(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className="font-sans text-sm text-secondary" role="status">
          {message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <p className="font-serif text-lg text-primary mb-2">Request plan upgrade</p>
          <p className="font-sans text-sm text-on-surface-variant mb-4">
            Choose a higher tier and we will review your request.
          </p>
          <div className="flex flex-wrap gap-2">
            <form
              action={(fd) => submitRequest(fd, 'Upgrade request sent. We will confirm by email.')}
            >
              <input type="hidden" name="request_type" value="plan_upgrade" />
              <input type="hidden" name="requested_plan" value="growth" />
              <button
                type="submit"
                disabled={isPending || hasPendingUpgrade}
                className="rounded-full border border-outline-variant/30 px-4 py-2 font-sans text-xs uppercase tracking-wider text-on-surface hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                Request Growth
              </button>
            </form>
            <form
              action={(fd) => submitRequest(fd, 'Upgrade request sent. We will confirm by email.')}
            >
              <input type="hidden" name="request_type" value="plan_upgrade" />
              <input type="hidden" name="requested_plan" value="premium" />
              <button
                type="submit"
                disabled={isPending || hasPendingUpgrade}
                className="rounded-full border border-outline-variant/30 px-4 py-2 font-sans text-xs uppercase tracking-wider text-on-surface hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                Request Premium
              </button>
            </form>
          </div>
          {hasPendingUpgrade && (
            <p className="font-sans text-xs text-on-surface-variant mt-3">
              You already have a pending upgrade request.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
          <p className="font-serif text-lg text-primary mb-2">Optional add-ons</p>
          <p className="font-sans text-sm text-on-surface-variant mb-4">
            Request placement upgrades for more visibility.
          </p>
          <div className="flex flex-wrap gap-2">
            <form
              action={(fd) =>
                submitRequest(fd, 'Featured Placement request sent. We will get back to you shortly.')
              }
            >
              <input type="hidden" name="request_type" value="addon_featured_placement" />
              <button
                type="submit"
                disabled={isPending || hasPendingFeatured}
                className="rounded-full border border-outline-variant/30 px-4 py-2 font-sans text-xs uppercase tracking-wider text-on-surface hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                Featured Placement
              </button>
            </form>
            <form
              action={(fd) =>
                submitRequest(fd, 'Homepage feature request sent. We will get back to you shortly.')
              }
            >
              <input type="hidden" name="request_type" value="addon_homepage_feature" />
              <button
                type="submit"
                disabled={isPending || hasPendingHomepage}
                className="rounded-full border border-outline-variant/30 px-4 py-2 font-sans text-xs uppercase tracking-wider text-on-surface hover:border-primary/40 hover:text-primary disabled:opacity-50"
              >
                Homepage Feature
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5">
        <p className="font-serif text-lg text-primary mb-3">Recent requests</p>
        {history.length === 0 ? (
          <p className="font-sans text-sm text-on-surface-variant">No requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((row) => (
              <li key={row.id} className="font-sans text-sm text-on-surface-variant">
                {new Date(row.created_at).toLocaleDateString('en-GB')} ·{' '}
                {labelForRequest(row.request_type, row.requested_plan)} ·{' '}
                <span className="uppercase tracking-wider text-[10px]">{row.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function labelForRequest(type: string, requestedPlan: string | null): string {
  if (type === 'plan_upgrade') return `Plan upgrade to ${requestedPlan ?? '—'}`
  if (type === 'addon_featured_placement') return 'Featured Placement add-on'
  if (type === 'addon_homepage_feature') return 'Homepage Feature add-on'
  return type
}
