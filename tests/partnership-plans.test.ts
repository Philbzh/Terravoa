import { describe, it, expect } from 'vitest'
import {
  isPlanId,
  getEffectiveCommissionPct,
  getProductLimit,
  PLAN_CONFIG,
} from '@/lib/partnership-plans'

describe('isPlanId', () => {
  it('recognizes valid plan IDs', () => {
    expect(isPlanId('founding')).toBe(true)
    expect(isPlanId('growth')).toBe(true)
    expect(isPlanId('premium')).toBe(true)
  })

  it('rejects invalid values', () => {
    expect(isPlanId('enterprise')).toBe(false)
    expect(isPlanId(null)).toBe(false)
    expect(isPlanId(undefined)).toBe(false)
    expect(isPlanId('')).toBe(false)
  })
})

describe('getEffectiveCommissionPct', () => {
  it('returns plan default when no override', () => {
    expect(getEffectiveCommissionPct('founding', null)).toBe(15)
    expect(getEffectiveCommissionPct('growth', null)).toBe(12)
    expect(getEffectiveCommissionPct('premium', null)).toBe(8)
  })

  it('uses override when provided', () => {
    expect(getEffectiveCommissionPct('founding', 10)).toBe(10)
    expect(getEffectiveCommissionPct('premium', 5)).toBe(5)
  })

  it('falls back to founding for unknown plans', () => {
    expect(getEffectiveCommissionPct(null, null)).toBe(15)
    expect(getEffectiveCommissionPct('unknown', null)).toBe(15)
  })

  it('ignores zero override', () => {
    expect(getEffectiveCommissionPct('growth', 0)).toBe(12)
  })
})

describe('getProductLimit', () => {
  it('returns correct limits per plan', () => {
    expect(getProductLimit('founding')).toBe(PLAN_CONFIG.founding.productLimit)
    expect(getProductLimit('growth')).toBeNull()
    expect(getProductLimit('premium')).toBeNull()
  })

  it('defaults to founding for unknown plans', () => {
    expect(getProductLimit(null)).toBe(PLAN_CONFIG.founding.productLimit)
    expect(getProductLimit('unknown')).toBe(PLAN_CONFIG.founding.productLimit)
  })
})
