export type ColumnType = 'text' | 'enum' | 'date' | 'number'

export interface ColumnOption {
  value: string
  label: string
}

export interface ColumnSpec<T> {
  key: string
  label: string
  accessor: (row: T) => unknown
  type: ColumnType
  options?: ColumnOption[]
  disabled?: boolean
  align?: 'left' | 'right'
  className?: string
}

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: string
  direction: SortDirection
}

export type TextFilterValue = string
export type EnumFilterValue = string[]
export interface DateFilterValue {
  from?: string
  to?: string
}
export interface NumberFilterValue {
  min?: number
  max?: number
}

export type ColumnFilterValue =
  | { type: 'text'; value: TextFilterValue }
  | { type: 'enum'; value: EnumFilterValue }
  | { type: 'date'; value: DateFilterValue }
  | { type: 'number'; value: NumberFilterValue }

export type FilterState = Record<string, ColumnFilterValue | undefined>
