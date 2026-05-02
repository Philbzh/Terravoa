'use client'

import { useState } from 'react'

export function OrderIdCopyButton({ orderId }: { orderId: string }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="font-sans text-[11px] uppercase tracking-wider px-2.5 py-1.5 rounded-full border border-secondary/30 text-secondary hover:bg-secondary/8 transition-colors"
      aria-label="Copy full order id"
    >
      {copied ? 'Copied' : 'Copy order ID'}
    </button>
  )
}
