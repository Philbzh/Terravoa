'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Package, Truck, Home, ShoppingBag } from 'lucide-react'

type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered'

interface TimelineStep {
  key: OrderStatus
  label: string
  description: string
  icon: typeof ShoppingBag
}

const steps: TimelineStep[] = [
  {
    key: 'new',
    label: 'Order received',
    description: 'We\'ve received your order and notified the producer.',
    icon: ShoppingBag,
  },
  {
    key: 'processing',
    label: 'Preparing',
    description: 'Your producer has confirmed the order and is preparing your items.',
    icon: Package,
  },
  {
    key: 'shipped',
    label: 'Shipped',
    description: 'Your order is on its way — shipped directly from the producer.',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    description: 'Your order has been delivered. Enjoy!',
    icon: Home,
  },
]

const statusOrder: Record<OrderStatus, number> = {
  new: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
}

interface OrderTimelineProps {
  status: OrderStatus
  trackingNumber?: string | null
  className?: string
}

export function OrderTimeline({ status, trackingNumber, className = '' }: OrderTimelineProps) {
  const currentIndex = statusOrder[status] ?? 0

  return (
    <div className={`py-4 ${className}`}>
      <ol className="relative">
        {steps.map((step, i) => {
          const done    = i < currentIndex
          const active  = i === currentIndex
          const pending = i > currentIndex
          const isLast  = i === steps.length - 1
          const Icon    = step.icon

          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              {/* Connecting line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 bottom-0 w-px ${
                    done ? 'bg-secondary' : 'bg-outline-variant/25'
                  }`}
                />
              )}

              {/* Circle indicator */}
              <div className="relative z-10 shrink-0 mt-0.5">
                {done ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                  >
                    <CheckCircle2
                      size={30}
                      strokeWidth={1.5}
                      className="text-secondary fill-secondary/15"
                    />
                  </motion.div>
                ) : active ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.35 }}
                    className="w-[30px] h-[30px] rounded-full bg-primary/12 border-2 border-primary flex items-center justify-center"
                  >
                    <Icon size={14} strokeWidth={1.8} className="text-primary" />
                  </motion.div>
                ) : (
                  <Circle
                    size={30}
                    strokeWidth={1}
                    className="text-outline-variant/40"
                  />
                )}
              </div>

              {/* Content */}
              <div className="pt-0.5 pb-1">
                <p
                  className={`font-sans text-sm font-semibold leading-tight ${
                    done || active ? 'text-on-surface' : 'text-on-surface-variant/50'
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`font-sans text-xs mt-0.5 leading-relaxed ${
                    active ? 'text-on-surface-variant' : 'text-on-surface-variant/50'
                  }`}
                >
                  {step.description}
                </p>
                {step.key === 'shipped' && active && trackingNumber && (
                  <p className="font-sans text-xs text-secondary mt-1">
                    Tracking:{' '}
                    <span className="font-mono text-on-surface">{trackingNumber}</span>
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
