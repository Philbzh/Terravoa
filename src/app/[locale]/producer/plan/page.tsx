import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import { PLAN_CONFIG, getEffectiveCommissionPct } from '@/lib/partnership-plans'
import { PlanRequestsClient } from './PlanRequestsClient'

type PlanRequestRow = {
  id: string
  request_type: string
  requested_plan: string | null
  status: string
  created_at: string
}

export default async function ProducerPlanPage() {
  const session = await getProducerForSession()
  if (!session) redirect('/login/producer')

  if (!session.producer) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
        <h1 className="font-serif text-3xl text-primary mb-3">Plan & Billing</h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Your account is not linked to a producer profile yet.
        </p>
      </div>
    )
  }

  const producer = session.producer
  const currentPlan = (producer.plan ?? 'founding') as keyof typeof PLAN_CONFIG
  const planConfig = PLAN_CONFIG[currentPlan]
  const effectiveCommissionPct = getEffectiveCommissionPct(
    producer.plan,
    producer.commission_rate_pct,
  )

  const admin = createAdminClient()
  const [{ count: productCount }, { data: requestRowsRaw }] = await Promise.all([
    (admin as any).from('products').select('id', { count: 'exact', head: true }).eq('producer_id', producer.id),
    (admin as any)
      .from('producer_plan_requests')
      .select('id, request_type, requested_plan, status, created_at')
      .eq('producer_id', producer.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const requestRows = (requestRowsRaw ?? []) as PlanRequestRow[]
  const hasPendingUpgrade = requestRows.some((r) => r.status === 'pending' && r.request_type === 'plan_upgrade')
  const hasPendingFeatured = requestRows.some((r) => r.status === 'pending' && r.request_type === 'addon_featured_placement')
  const hasPendingHomepage = requestRows.some((r) => r.status === 'pending' && r.request_type === 'addon_homepage_feature')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-primary mb-2">Plan & Billing</h1>
        <p className="font-sans text-sm text-on-surface-variant max-w-2xl">
          View your current plan, commission, and product allowance. Request upgrades and add-ons directly here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current plan"
          value={capitalize(currentPlan)}
          sub={`€${planConfig.monthlyFeeEur}/month`}
        />
        <MetricCard
          label="Commission rate"
          value={`${effectiveCommissionPct}%`}
          sub={producer.commission_rate_pct ? 'Custom negotiated rate' : 'Plan default rate'}
        />
        <MetricCard
          label="Product limit"
          value={planConfig.productLimit === null ? 'Unlimited' : `${productCount ?? 0}/${planConfig.productLimit}`}
          sub={planConfig.productLimit === null ? 'No cap on approved products' : 'Cap applies to active products'}
        />
      </div>

      <PlanRequestsClient
        hasPendingUpgrade={hasPendingUpgrade}
        hasPendingFeatured={hasPendingFeatured}
        hasPendingHomepage={hasPendingHomepage}
        history={requestRows}
      />
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4">
      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">{label}</p>
      <p className="font-serif text-2xl text-primary">{value}</p>
      <p className="font-sans text-xs text-on-surface-variant mt-1">{sub}</p>
    </div>
  )
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
