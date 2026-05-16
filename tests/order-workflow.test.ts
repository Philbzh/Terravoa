import { describe, it, expect } from 'vitest'
import {
  ORDER_FULFILLMENT_STATUSES,
  ORDER_PAYMENT_STATUSES,
  ORDER_PAYOUT_STATUSES,
} from '@/lib/order-workflow'

describe('order-workflow constants', () => {
  it('defines fulfillment statuses', () => {
    expect(ORDER_FULFILLMENT_STATUSES.length).toBeGreaterThan(0)
    expect(ORDER_FULFILLMENT_STATUSES).toContain('awaiting_producer_ack')
    expect(ORDER_FULFILLMENT_STATUSES).toContain('shipped')
    expect(ORDER_FULFILLMENT_STATUSES).toContain('delivered')
  })

  it('defines payment statuses', () => {
    expect(ORDER_PAYMENT_STATUSES.length).toBeGreaterThan(0)
    expect(ORDER_PAYMENT_STATUSES).toContain('paid')
  })

  it('defines payout statuses', () => {
    expect(ORDER_PAYOUT_STATUSES.length).toBeGreaterThan(0)
    expect(ORDER_PAYOUT_STATUSES).toContain('not_due')
  })
})
