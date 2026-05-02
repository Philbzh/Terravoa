type StatusCounts = {
  new: number
  processing: number
  shipped: number
  delivered: number
}

const SEGMENTS = [
  { key: 'new',        label: 'New',        bg: 'bg-tertiary-fixed/60',        text: 'text-tertiary' },
  { key: 'processing', label: 'Processing', bg: 'bg-secondary-container/70',   text: 'text-secondary' },
  { key: 'shipped',    label: 'Shipped',    bg: 'bg-primary-fixed/60',          text: 'text-primary' },
  { key: 'delivered',  label: 'Delivered',  bg: 'bg-primary/80',               text: 'text-on-primary' },
] as const

export function OrderStatusFunnel({ counts }: { counts: StatusCounts }) {
  const total = counts.new + counts.processing + counts.shipped + counts.delivered

  return (
    <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-5">
      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-3">
        Order pipeline — all time
      </p>

      {total === 0 ? (
        <p className="font-sans text-sm text-on-surface-variant/50">No orders yet.</p>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-7 rounded-lg overflow-hidden gap-px mb-4">
            {SEGMENTS.map(({ key, bg }) => {
              const count = counts[key]
              if (count === 0) return null
              const pct = (count / total) * 100
              return (
                <div
                  key={key}
                  className={`${bg} h-full flex items-center justify-center`}
                  style={{ width: `${pct}%` }}
                  title={`${key}: ${count}`}
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEGMENTS.map(({ key, label, bg, text }) => {
              const count = counts[key]
              const pct = total > 0 ? ((count / total) * 100).toFixed(0) : '0'
              return (
                <div key={key} className="flex items-start gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm mt-0.5 shrink-0 ${bg}`} />
                  <div>
                    <p className={`font-sans text-xs font-semibold ${count > 0 ? text : 'text-on-surface-variant/40'}`}>
                      {count}
                    </p>
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {label} · {pct}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
