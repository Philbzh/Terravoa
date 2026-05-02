import { cn } from '@/lib/utils'

// ── Primitive ─────────────────────────────────────────────────────────────────

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded bg-outline-variant/15', className)}
      aria-hidden="true"
    />
  )
}

// ── KPI card row (matches AnimatedKpiCard layout) ─────────────────────────────

export function SkeletonKpiCard() {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 space-y-3">
      <Pulse className="h-3 w-24" />
      <Pulse className="h-7 w-32" />
      <Pulse className="h-2.5 w-20" />
    </div>
  )
}

export function SkeletonKpiRow({ cols = 4 }: { cols?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonKpiCard key={i} />
      ))}
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  const widths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-16', 'w-20', 'w-24']
  return (
    <tr className="border-b border-outline-variant/10">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5 first:pl-5">
          <Pulse className={cn('h-3', widths[i % widths.length])} />
        </td>
      ))}
    </tr>
  )
}

interface SkeletonTableProps {
  rows?: number
  cols?: number
  headers?: string[]
}

export function SkeletonTable({ rows = 6, cols = 5, headers }: SkeletonTableProps) {
  return (
    <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
      <table className="w-full text-left">
        {headers && (
          <thead>
            <tr className="bg-surface-container-low/50">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant px-4 py-3 first:pl-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

interface SkeletonCardProps {
  hasImage?: boolean
  lines?: number
  className?: string
}

export function SkeletonCard({ hasImage = false, lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 space-y-3',
        className,
      )}
    >
      {hasImage && <Pulse className="h-36 w-full rounded-xl mb-1" />}
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse
          key={i}
          className={cn('h-3', i === 0 ? 'w-3/4' : i === lines - 1 ? 'w-1/2' : 'w-full')}
        />
      ))}
    </div>
  )
}

// ── Section with header + table (common admin page layout) ────────────────────

interface SkeletonSectionProps {
  tableRows?: number
  tableCols?: number
  tableHeaders?: string[]
}

export function SkeletonSection({
  tableRows = 5,
  tableCols = 5,
  tableHeaders,
}: SkeletonSectionProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Pulse className="h-5 w-40" />
        <Pulse className="h-3 w-64" />
      </div>
      {/* Table */}
      <SkeletonTable rows={tableRows} cols={tableCols} headers={tableHeaders} />
    </div>
  )
}

// ── Full admin page skeleton ─────────────────────────────────────────────────

export function AdminPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2.5">
        <div className="h-6 w-48 rounded bg-outline-variant/15" />
        <div className="h-3 w-72 rounded bg-outline-variant/10" />
      </div>
      {/* KPI row */}
      <SkeletonKpiRow cols={4} />
      {/* Table */}
      <SkeletonTable rows={6} cols={5} />
    </div>
  )
}
