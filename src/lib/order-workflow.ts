export const ORDER_FULFILLMENT_STATUSES = [
  'awaiting_producer_ack',
  'partially_acked',
  'acked',
  'packed',
  'shipped',
  'delivered',
  'partially_unavailable',
  'unavailable',
  'refunded',
  'closed',
] as const

export const ORDER_PAYMENT_STATUSES = [
  'paid',
  'refund_pending',
  'partially_refunded',
  'refunded',
] as const

export const ORDER_PAYOUT_STATUSES = [
  'not_due',
  'scheduled',
  'paid',
  'held',
] as const

export type OrderFulfillmentStatus = (typeof ORDER_FULFILLMENT_STATUSES)[number]
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number]
export type OrderPayoutStatus = (typeof ORDER_PAYOUT_STATUSES)[number]

export function toLegacyOrderStatus(
  fulfillment: OrderFulfillmentStatus,
): 'new' | 'processing' | 'shipped' | 'delivered' {
  switch (fulfillment) {
    case 'awaiting_producer_ack':
      return 'new'
    case 'partially_acked':
    case 'acked':
    case 'packed':
    case 'partially_unavailable':
    case 'unavailable':
      return 'processing'
    case 'shipped':
    case 'refunded':
      return 'shipped'
    case 'delivered':
    case 'closed':
      return 'delivered'
    default:
      return 'processing'
  }
}
