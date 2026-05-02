'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPath(data: number[], w: number, h: number): { line: string; fill: string } {
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / max) * h
    return { x, y }
  })

  // Smooth curve via catmull-rom style control points
  const segments = pts.map((pt, i) => {
    if (i === 0) return `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
    const prev = pts[i - 1]
    const cpx = (prev.x + pt.x) / 2
    return `C ${cpx.toFixed(1)},${prev.y.toFixed(1)} ${cpx.toFixed(1)},${pt.y.toFixed(1)} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`
  })

  const line = segments.join(' ')
  const fill = `${line} L ${(w).toFixed(1)},${h} L 0,${h} Z`
  return { line, fill }
}

function computeTrend(data: number[]): 'up' | 'down' | 'flat' {
  const half = Math.floor(data.length / 2)
  const first = data.slice(0, half).reduce((a, b) => a + b, 0)
  const second = data.slice(half).reduce((a, b) => a + b, 0)
  if (second > first * 1.05) return 'up'
  if (second < first * 0.95) return 'down'
  return 'flat'
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProductSparklineProps {
  data: number[] // 14 daily sales counts
  width?: number
  height?: number
}

const W = 72
const H = 24

export function ProductSparkline({ data, width = W, height = H }: ProductSparklineProps) {
  const normalised = data.length === 14 ? data : [...Array(14 - data.length).fill(0), ...data].slice(0, 14)
  const trend = computeTrend(normalised)
  const total = normalised.reduce((a, b) => a + b, 0)

  const { line, fill } = buildPath(normalised, width, height)

  const color =
    trend === 'up'   ? '#6b8e6b'  /* secondary-ish green */
    : trend === 'down' ? '#c4804a'  /* warm amber */
    : '#8a9a8a'                      /* neutral */

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendCls =
    trend === 'up'   ? 'text-[#6b8e6b]'
    : trend === 'down' ? 'text-[#c4804a]'
    : 'text-on-surface-variant/40'

  if (total === 0) {
    return (
      <div className="flex items-center gap-1.5">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-20">
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#8a9a8a" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
        <span className="font-sans text-[10px] text-on-surface-variant/30">—</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`sg-${trend}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Fill */}
        <motion.path
          d={fill}
          fill={`url(#sg-${trend})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />

        {/* Line */}
        <motion.path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>

      {/* Trend icon */}
      <TrendIcon size={10} strokeWidth={2} className={trendCls} />
    </div>
  )
}
