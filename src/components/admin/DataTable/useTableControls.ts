import { useCallback, useMemo, useState } from 'react'
import type {
  ColumnFilterValue,
  ColumnSpec,
  FilterState,
  SortDirection,
  SortState,
} from './types'

interface Options<T> {
  data: T[] | undefined
  columns: ReadonlyArray<ColumnSpec<T>>
  defaultSort?: SortState | null
}

interface Controls<T> {
  rows: T[]
  sortState: SortState | null
  toggleSort: (key: string) => void
  filterState: FilterState
  setColumnFilter: (key: string, value: ColumnFilterValue | undefined) => void
  clearColumnFilter: (key: string) => void
  reset: () => void
  activeFilterCount: number
  getAvailableValues: (key: string) => Set<string>
}

function toComparable(value: unknown): number | string {
  if (value === null || value === undefined) return ''
  if (value instanceof Date) return value.getTime()
  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') {
    const asDate = Date.parse(value)
    if (!Number.isNaN(asDate) && /^\d{4}-\d{2}-\d{2}/.test(value)) return asDate
    return value.toLowerCase()
  }
  return String(value).toLowerCase()
}

function matchFilter(raw: unknown, filter: ColumnFilterValue): boolean {
  switch (filter.type) {
    case 'text': {
      const needle = filter.value.trim().toLowerCase()
      if (!needle) return true
      if (raw === null || raw === undefined) return false
      return String(raw).toLowerCase().includes(needle)
    }
    case 'enum': {
      if (filter.value.length === 0) return true
      if (raw === null || raw === undefined) return false
      return filter.value.includes(String(raw))
    }
    case 'date': {
      const { from, to } = filter.value
      if (!from && !to) return true
      if (raw === null || raw === undefined || raw === '') return false
      const ts =
        typeof raw === 'string' || raw instanceof Date
          ? new Date(raw as string | Date).getTime()
          : NaN
      if (Number.isNaN(ts)) return false
      if (from && ts < new Date(from).getTime()) return false
      if (to && ts > new Date(to).getTime() + 86_400_000 - 1) return false
      return true
    }
    case 'number': {
      const { min, max } = filter.value
      if (min === undefined && max === undefined) return true
      const n = typeof raw === 'number' ? raw : Number(raw)
      if (Number.isNaN(n)) return false
      if (min !== undefined && n < min) return false
      if (max !== undefined && n > max) return false
      return true
    }
  }
}

function isFilterActive(f: ColumnFilterValue | undefined): boolean {
  if (!f) return false
  switch (f.type) {
    case 'text':
      return f.value.trim().length > 0
    case 'enum':
      return f.value.length > 0
    case 'date':
      return Boolean(f.value.from) || Boolean(f.value.to)
    case 'number':
      return f.value.min !== undefined || f.value.max !== undefined
  }
}

export function useTableControls<T>({
  data,
  columns,
  defaultSort = null,
}: Options<T>): Controls<T> {
  const [sortState, setSortState] = useState<SortState | null>(defaultSort)
  const [filterState, setFilterState] = useState<FilterState>({})

  const colByKey = useMemo(() => {
    const map = new Map<string, ColumnSpec<T>>()
    columns.forEach((c) => map.set(c.key, c))
    return map
  }, [columns])

  const toggleSort = useCallback((key: string) => {
    setSortState((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }, [])

  const setColumnFilter = useCallback(
    (key: string, value: ColumnFilterValue | undefined) => {
      setFilterState((prev) => {
        const next = { ...prev }
        if (!value || !isFilterActive(value)) delete next[key]
        else next[key] = value
        return next
      })
    },
    [],
  )

  const clearColumnFilter = useCallback((key: string) => {
    setFilterState((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setSortState(defaultSort)
    setFilterState({})
  }, [defaultSort])

  const rows = useMemo(() => {
    const source = data ?? []
    const filtered = source.filter((row) => {
      for (const [key, filter] of Object.entries(filterState)) {
        if (!filter) continue
        const col = colByKey.get(key)
        if (!col) continue
        if (!matchFilter(col.accessor(row), filter)) return false
      }
      return true
    })

    if (sortState) {
      const col = colByKey.get(sortState.key)
      if (col) {
        const dir: SortDirection = sortState.direction
        const indexed = filtered.map((row, i) => ({ row, i }))
        indexed.sort((a, b) => {
          const av = toComparable(col.accessor(a.row))
          const bv = toComparable(col.accessor(b.row))
          let cmp: number
          if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
          else cmp = String(av).localeCompare(String(bv))
          if (cmp !== 0) return dir === 'asc' ? cmp : -cmp
          return a.i - b.i
        })
        return indexed.map((x) => x.row)
      }
    }

    return filtered
  }, [data, filterState, sortState, colByKey])

  const getAvailableValues = useCallback(
    (key: string): Set<string> => {
      const source = data ?? []
      const col = colByKey.get(key)
      if (!col) return new Set()
      const otherFilters = Object.entries(filterState).filter(
        ([k, v]) => k !== key && v && isFilterActive(v),
      )
      const values = new Set<string>()
      for (const row of source) {
        let keep = true
        for (const [k, f] of otherFilters) {
          const c = colByKey.get(k)
          if (!c || !f) continue
          if (!matchFilter(c.accessor(row), f)) {
            keep = false
            break
          }
        }
        if (!keep) continue
        const raw = col.accessor(row)
        if (raw === null || raw === undefined || raw === '') continue
        values.add(String(raw))
      }
      return values
    },
    [data, filterState, colByKey],
  )

  const activeFilterCount = useMemo(
    () => Object.values(filterState).filter(isFilterActive).length,
    [filterState],
  )

  return {
    rows,
    sortState,
    toggleSort,
    filterState,
    setColumnFilter,
    clearColumnFilter,
    reset,
    activeFilterCount,
    getAvailableValues,
  }
}
