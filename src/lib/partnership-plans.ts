/**
 * Producer partnership plan definitions.
 * Rates are defined in code; individual overrides are stored in producers.commission_rate_pct.
 * Stripe billing is wired up separately (post-launch).
 */

export type PlanId = 'founding' | 'growth' | 'premium'

export type PlanConfig = {
  monthlyFeeEur: number
  commissionPct: number
  /** Max products allowed. null = unlimited. */
  productLimit: number | null
  featuredPlacementEligible: boolean
  homepageFeatureEligible: boolean
}

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  founding: {
    monthlyFeeEur: 0,
    commissionPct: 15,
    productLimit: 10,
    featuredPlacementEligible: false,
    homepageFeatureEligible: false,
  },
  growth: {
    monthlyFeeEur: 39,
    commissionPct: 12,
    productLimit: null,
    featuredPlacementEligible: true,
    homepageFeatureEligible: false,
  },
  premium: {
    monthlyFeeEur: 89,
    commissionPct: 8,
    productLimit: null,
    featuredPlacementEligible: true,
    homepageFeatureEligible: true,
  },
}

export function isPlanId(value: unknown): value is PlanId {
  return value === 'founding' || value === 'growth' || value === 'premium'
}

/**
 * Returns the effective commission % for a producer.
 * Priority: per-producer override > plan default > founding default.
 */
export function getEffectiveCommissionPct(
  plan: string | null,
  overridePct: number | null,
): number {
  if (overridePct !== null && overridePct > 0) return overridePct
  if (isPlanId(plan)) return PLAN_CONFIG[plan].commissionPct
  return PLAN_CONFIG.founding.commissionPct
}

/**
 * Returns the product limit for a plan. null = unlimited.
 */
export function getProductLimit(plan: string | null): number | null {
  if (isPlanId(plan)) return PLAN_CONFIG[plan].productLimit
  return PLAN_CONFIG.founding.productLimit
}

// ── Legacy compat for producer/partnership page ───────────────────────────────
export type PlanRates = {
  monthlyFeeEur: number | null
  commissionPct: number | null
}

/** @deprecated Use PLAN_CONFIG directly */
export function getPartnershipPlanRates(): { starter: PlanRates; growth: PlanRates } {
  return {
    starter: {
      monthlyFeeEur: PLAN_CONFIG.founding.monthlyFeeEur,
      commissionPct: PLAN_CONFIG.founding.commissionPct,
    },
    growth: {
      monthlyFeeEur: PLAN_CONFIG.growth.monthlyFeeEur,
      commissionPct: PLAN_CONFIG.growth.commissionPct,
    },
  }
}
