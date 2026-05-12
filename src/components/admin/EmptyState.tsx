import { Inbox } from 'lucide-react'

interface Props {
  title?: string
  message?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Items will appear here once they are created.',
  icon,
}: Props) {
  return (
    <div className="rounded-xl border border-dashed border-outline-variant/30 bg-surface-container-low/50 p-12 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-surface-container mb-4">
        {icon ?? <Inbox className="h-5 w-5 text-on-surface-variant/60" />}
      </div>
      <p className="font-sans text-sm font-medium text-on-surface mb-1">{title}</p>
      <p className="font-sans text-xs text-on-surface-variant">{message}</p>
    </div>
  )
}
