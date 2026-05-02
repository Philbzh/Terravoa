'use client'

import { useState } from 'react'

export type TrendDay = {
  date: string
  label: string
  revenue: number // in cents
}

export function RevenueTrendChart({ days }: { days: TrendDay[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1)

  const W         = 660
  const CHART_H   = 68
  const LABEL_H   = 18
  const H         = CHART_H + LABEL_H
  const BAR_AREA  = W / days.length
  const BAR_W     = Math.max(BAR_AREA - 3, 4)

  // Total for the period
  const totalCents = days.reduce((s, d) => s + d.revenue, 0)
  const daysWithSales = days.filter((d) => d.revenue > 0).length

  // Label indices: first, ~weekly, last
  const labelAt = new Set([0, 7, 14, 21, days.length - 1])

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 pt-5 pb-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-0.5">
            Revenue — last 30 days
          </p>
          <p className="font-serif text-2xl text-primary">
            €{(totalCents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <p className="font-sans text-xs text-on-surface-variant/60">
          {daysWithSales} day{daysWithSales !== 1 ? 's' : ''} with sales
        </p>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Tooltip */}
        {hovered !== null && (
          <div
            className="absolute -top-8 bg-primary text-on-primary font-sans text-[11px] px-2.5 py-1 rounded-lg pointer-events-none z-10 whitespace-nowrap"
            style={{ left: `${((hovered + 0.5) / days.length) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <span className="opacity-70 mr-1.5">{days[hovered].label}</span>
            <span className="font-semibold">
              €{(days[hovered].revenue / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 88 }}
          aria-label="Revenue trend chart — last 30 days"
        >
          {days.map((d, i) => {
            const barH = d.revenue > 0
              ? Math.max((d.revenue / maxRevenue) * CHART_H, 4)
              : 2
            const x = i * BAR_AREA
            const y = CHART_H - barH
            const active = hovered === i

            return (
              <g
                key={d.date}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Invisible hit area */}
                <rect x={x} y={0} width={BAR_AREA} height={CHART_H} fill="transparent" />
                {/* Bar */}
                <rect
                  x={x + 1}
                  y={y}
                  width={BAR_W}
                  height={barH}
                  rx={2.5}
                  fill={
                    d.revenue === 0
                      ? '#e3e2e0'
                      : active
                        ? '#944925'
                        : '#182a1b'
                  }
                />
                {/* Date labels */}
                {labelAt.has(i) && (
                  <text
                    x={x + BAR_AREA / 2}
                    y={H - 2}
                    textAnchor="middle"
                    fontSize={8.5}
                    fill="#737872"
                    fontFamily="Manrope, system-ui, sans-serif"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
