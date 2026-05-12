'use client'

import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter } from 'lucide-react'
import { ColumnFilter } from './ColumnFilter'
import type { ColumnFilterValue, ColumnSpec, SortState } from './types'

interface Props<T> {
  column: ColumnSpec<T>
  sortState: SortState | null
  onToggleSort: (key: string) => void
  filterValue: ColumnFilterValue | undefined
  onFilterChange: (value: ColumnFilterValue | undefined) => void
  availableValues?: Set<string>
}

const TH_BASE =
  'px-4 py-3 font-sans text-[10px] font-medium text-on-surface-variant uppercase tracking-wider'

export function SortableHeader<T>({
  column,
  sortState,
  onToggleSort,
  filterValue,
  onFilterChange,
  availableValues,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const filterBtnRef = useRef<HTMLButtonElement>(null)

  const isSorted = sortState?.key === column.key
  const direction = isSorted ? sortState.direction : null
  const align = column.align ?? 'left'
  const filterActive =
    filterValue !== undefined &&
    ((filterValue.type === 'text' && filterValue.value.trim().length > 0) ||
      (filterValue.type === 'enum' && filterValue.value.length > 0) ||
      (filterValue.type === 'date' &&
        (Boolean(filterValue.value.from) || Boolean(filterValue.value.to))) ||
      (filterValue.type === 'number' &&
        (filterValue.value.min !== undefined || filterValue.value.max !== undefined)))

  if (column.disabled) {
    return (
      <th
        className={[TH_BASE, align === 'right' ? 'text-right' : 'text-left', column.className ?? '']
          .filter(Boolean)
          .join(' ')}
      >
        {column.label}
      </th>
    )
  }

  const sortLabel =
    direction === 'asc'
      ? 'Sorted ascending'
      : direction === 'desc'
        ? 'Sorted descending'
        : 'Not sorted'

  return (
    <th
      className={[TH_BASE, align === 'right' ? 'text-right' : 'text-left', column.className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={`relative inline-flex items-center gap-1 ${
          align === 'right' ? 'justify-end' : ''
        }`}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1 hover:text-on-surface transition-colors"
          onClick={() => onToggleSort(column.key)}
          aria-label={`${column.label}: ${sortLabel}`}
          title={sortLabel}
        >
          <span>{column.label}</span>
          {direction === 'asc' && <ChevronUp size={12} aria-hidden />}
          {direction === 'desc' && <ChevronDown size={12} aria-hidden />}
          {direction === null && (
            <ChevronsUpDown size={12} aria-hidden className="opacity-40" />
          )}
        </button>
        <button
          ref={filterBtnRef}
          type="button"
          className={`relative p-0.5 rounded hover:bg-surface-container-high transition-colors ${
            filterActive ? 'text-secondary' : 'text-on-surface-variant/70'
          }`}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
          aria-label={`Filter ${column.label}`}
          title="Filter"
          aria-expanded={open}
        >
          <Filter size={11} aria-hidden />
          {filterActive && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-secondary" />
          )}
        </button>
        {open && (
          <ColumnFilter
            column={column}
            anchorEl={filterBtnRef.current}
            availableValues={availableValues}
            value={filterValue}
            onChange={onFilterChange}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </th>
  )
}
