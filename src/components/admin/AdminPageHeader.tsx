interface MetricItem {
  label: string
  value: string | number
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  metrics?: ReadonlyArray<MetricItem>
  actions?: React.ReactNode
}

export function AdminPageHeader({ title, description, children, metrics, actions }: AdminPageHeaderProps) {
  return (
    <header className="mb-7 pb-4 border-b border-outline-variant/20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-sans text-2xl md:text-3xl font-semibold text-on-surface mb-2">{title}</h1>
          {description && (
            <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      {metrics && metrics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {metrics.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/20 bg-surface-container-lowest px-2.5 py-1 font-sans text-xs text-on-surface-variant"
            >
              <strong className="text-on-surface tabular-nums">{m.value}</strong>
              {m.label}
            </span>
          ))}
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
