'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, RefreshCw } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderItem = {
  id: string
  quantity: number
  price: number
  order_id: string
  products: { name: string } | null
  orders: { customer_name: string; status: string; created_at: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-tertiary-fixed/30 text-tertiary',
  processing: 'bg-secondary-container/50 text-secondary',
  shipped: 'bg-primary-fixed/40 text-primary',
  delivered: 'bg-primary-fixed/40 text-primary',
}

const POLL_INTERVAL = 30_000 // 30 s

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function fmtEur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LiveOrderFeed() {
  const [items, setItems] = useState<OrderItem[]>([])
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [pulsing, setPulsing] = useState(false)
  const knownIds = useRef<Set<string>>(new Set())
  const tickRef = useRef(0)

  async function fetchOrders(isRefresh = false) {
    if (isRefresh) setPulsing(true)
    try {
      const res = await fetch('/api/producer/recent-orders', { cache: 'no-store' })
      if (!res.ok) return
      const { items: fresh } = (await res.json()) as { items: OrderItem[] }
      // Deduplicate by order_id (keep one item per order — the first)
      const seen = new Set<string>()
      const deduped = fresh.filter((i) => {
        if (seen.has(i.order_id)) return false
        seen.add(i.order_id)
        return true
      })

      if (knownIds.current.size > 0) {
        // Find genuinely new items
        const freshNew = deduped.filter((i) => !knownIds.current.has(i.id))
        if (freshNew.length > 0) {
          setNewIds(new Set(freshNew.map((i) => i.id)))
          // Clear NEW badge after 8 s
          setTimeout(() => setNewIds(new Set()), 8_000)
        }
      }
      deduped.forEach((i) => knownIds.current.add(i.id))
      setItems(deduped)
    } finally {
      setLoading(false)
      if (isRefresh) {
        setTimeout(() => setPulsing(false), 600)
      }
    }
  }

  useEffect(() => {
    fetchOrders()
    const id = setInterval(() => {
      tickRef.current++
      fetchOrders(true)
    }, POLL_INTERVAL)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-2 w-2 rounded-full bg-secondary/30 animate-pulse" />
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-on-surface-variant/60">
            Live Order Feed
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-surface-container-low animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) return null

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 mb-8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          {/* Pulsing live dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
          </span>
          <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
            Live Order Feed
          </p>
        </div>
        <motion.button
          type="button"
          onClick={() => fetchOrders(true)}
          aria-label="Refresh orders"
          whileTap={{ scale: 0.88 }}
          animate={pulsing ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="text-on-surface-variant/40 hover:text-secondary transition-colors duration-200"
        >
          <RefreshCw size={13} strokeWidth={1.8} />
        </motion.button>
      </div>

      {/* Feed list */}
      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const isNew = newIds.has(item.id)
            const status = item.orders?.status ?? 'new'
            const statusCls = STATUS_COLORS[status] ?? 'bg-surface-container-high text-on-surface-variant'
            const orderTotal = item.price * item.quantity

            return (
              <motion.li
                key={item.id}
                layout
                initial={{ x: -28, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 28, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                className="flex items-center gap-3 rounded-lg bg-surface-container-low/60 border border-outline-variant/10 px-4 py-3 relative overflow-hidden"
              >
                {/* NEW flash overlay */}
                <AnimatePresence>
                  {isNew && (
                    <motion.span
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: 0 }}
                      transition={{ duration: 2.5 }}
                      className="absolute inset-0 bg-secondary pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <ShoppingBag size={13} strokeWidth={1.5} className="text-secondary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <p className="font-sans text-xs text-on-surface font-medium truncate">
                      {item.products?.name ?? 'Product'}
                    </p>
                    {isNew && (
                      <motion.span
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        className="font-sans text-[9px] uppercase tracking-wider bg-secondary text-on-secondary px-1.5 py-0.5 rounded-full"
                      >
                        New
                      </motion.span>
                    )}
                  </div>
                  <p className="font-sans text-[10px] text-on-surface-variant mt-0.5">
                    {item.orders?.customer_name ?? 'Customer'} &middot; qty {item.quantity}
                  </p>
                </div>

                {/* Right side: price + status + time */}
                <div className="shrink-0 text-right">
                  <p className="font-serif text-sm text-primary tabular-nums">
                    {fmtEur(orderTotal)}
                  </p>
                  <div className="flex items-center gap-1.5 justify-end mt-1">
                    <span className={`font-sans text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full ${statusCls}`}>
                      {status}
                    </span>
                    {item.orders?.created_at && (
                      <span className="font-sans text-[9px] text-on-surface-variant/50">
                        {timeAgo(item.orders.created_at)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>

      {/* Footer */}
      <p className="font-sans text-[9px] uppercase tracking-wider text-on-surface-variant/30 text-right mt-4">
        Updates every 30s
      </p>
    </div>
  )
}
