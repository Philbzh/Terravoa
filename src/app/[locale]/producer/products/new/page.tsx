import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getProducerForSession } from '@/lib/producer/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getProductLimit, isPlanId, type PlanId } from '@/lib/partnership-plans'
import { Link } from '@/i18n/navigation'
import { NewProductForm } from './NewProductForm'

function planDisplayName(plan: PlanId): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}

/**
 * "Add a product" route — split into a server shell (this file) that resolves
 * the producer's plan / current product count / cap, and a client form below.
 * The shell renders a plan-aware quota banner and, when the producer has hit
 * their cap, disables the form entirely (server action still enforces the cap
 * independently as defence in depth — see `./actions.ts`).
 */
export default async function NewProductPage() {
  const session = await getProducerForSession()
  if (!session?.producer) redirect('/producer/apply')

  const t = await getTranslations('producerPortal.newProduct')
  const planRaw = (session.producer as { plan: string | null }).plan
  const plan = isPlanId(planRaw) ? planRaw : 'founding'
  const productLimit = getProductLimit(plan)

  const admin = createAdminClient() as any
  const { count } = await admin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('producer_id', session.producer.id)
  const used = count ?? 0

  const atCap = productLimit !== null && used >= productLimit
  const planLabel = planDisplayName(plan)
  const quotaText =
    productLimit === null
      ? t('quotaUnlimited', { plan: planLabel })
      : t('quotaUsed', { used, limit: productLimit, plan: planLabel })

  const disabledReason = atCap
    ? t('quotaReachedMessage', { plan: planLabel, limit: productLimit ?? 0 })
    : null

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-primary mb-2">{t('title')}</h1>
      <p className="text-on-surface-variant font-sans text-sm leading-relaxed mb-6">
        {t('subtitle')}
      </p>

      <div
        className={`mb-8 rounded-xl border px-5 py-4 font-sans text-sm ${
          atCap
            ? 'border-error/40 bg-error-container/20 text-on-surface'
            : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant'
        }`}
      >
        <p className="font-medium text-on-surface">{quotaText}</p>
        {atCap && (
          <>
            <p className="mt-2 text-on-surface-variant">
              {t('quotaReachedMessage', { plan: planLabel, limit: productLimit ?? 0 })}
            </p>
            <Link
              href="/producer/plan"
              className="mt-3 inline-flex items-center gap-1 text-secondary text-xs uppercase tracking-wider hover:opacity-75 transition-opacity"
            >
              {t('quotaUpgradeCta')} →
            </Link>
          </>
        )}
      </div>

      <NewProductForm disabledReason={disabledReason} />
    </div>
  )
}
