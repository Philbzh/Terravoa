interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <header className="mb-7 pb-4 border-b border-outline-variant/20">
      <h1 className="font-sans text-2xl md:text-3xl font-semibold text-on-surface mb-2">{title}</h1>
      {description && (
        <p className="text-on-surface-variant font-sans text-sm md:text-base max-w-3xl leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
