// Feature flags — set to 'true' in .env.local or Vercel env vars to enable
export const features = {
  giftMessaging:     process.env.NEXT_PUBLIC_FEATURE_GIFT_MESSAGING === 'true',
  producerMessaging: process.env.NEXT_PUBLIC_FEATURE_PRODUCER_MESSAGING === 'true',
  batchTraceability: process.env.NEXT_PUBLIC_FEATURE_BATCH_TRACEABILITY === 'true',
  adoptAProducer:    process.env.NEXT_PUBLIC_FEATURE_ADOPT_PRODUCER === 'true',
} as const

export type FeatureKey = keyof typeof features
