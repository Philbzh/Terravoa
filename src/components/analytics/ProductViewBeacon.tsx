'use client'

import { useEffect, useRef } from 'react'

type Props = { productSlug: string }

/** Records one product page view per mount (client navigation). */
export function ProductViewBeacon({ productSlug }: Props) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current || !productSlug) return
    sent.current = true

    fetch('/api/analytics/product-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: productSlug }),
      keepalive: true,
    }).catch(() => {})
  }, [productSlug])

  return null
}
