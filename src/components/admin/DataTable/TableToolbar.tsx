'use client'

import { X } from 'lucide-react'

interface Props {
  activeFilterCount: number
  sorted: boolean
  onReset: () => void
}

export function TableToolbar({ activeFilterCount, sorted, onReset }: Props) {
  const hasState = activeFilterCount > 0 || sorted
  if (!hasState) return null
  return (
    <div className="flex items-center justify-end gap-3 px-4 py-2 border-b border-outline-variant/10 bg-surface-container-low/50">
      {activeFilterCount > 0 && (
        <span className="font-sans text-xs text-on-surface-variant">
          {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
        </span>
      )}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1 font-sans text-xs text-on-surface-variant hover:text-on-surface"
      >
        <X size={12} />
        Reset
      </button>
    </div>
  )
}
