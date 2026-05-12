'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type {
  ColumnFilterValue,
  ColumnSpec,
  DateFilterValue,
  EnumFilterValue,
  NumberFilterValue,
} from './types'

interface Props<T> {
  column: ColumnSpec<T>
  anchorEl: HTMLElement | null
  availableValues?: Set<string>
  value: ColumnFilterValue | undefined
  onChange: (value: ColumnFilterValue | undefined) => void
  onClose: () => void
}

const POPOVER_WIDTH = 240
const MARGIN = 8

export function ColumnFilter<T>({
  column,
  anchorEl,
  availableValues,
  value,
  onChange,
  onClose,
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!anchorEl) return
    function place() {
      if (!anchorEl) return
      const rect = anchorEl.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      let left = rect.left
      if (left + POPOVER_WIDTH > viewportWidth - MARGIN) {
        left = Math.max(MARGIN, rect.right - POPOVER_WIDTH)
      }
      setPos({ top: rect.bottom + 4, left })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchorEl])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>(
      'input, select, textarea, button, [tabindex]:not([tabindex="-1"])',
    )
    first?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node
      if (rootRef.current && rootRef.current.contains(target)) return
      if (anchorEl && anchorEl.contains(target)) return
      onClose()
    }
    const id = window.setTimeout(
      () => document.addEventListener('mousedown', onClick),
      0,
    )
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('mousedown', onClick)
    }
  }, [onClose, anchorEl])

  const inputCls =
    'w-full rounded-lg border border-outline-variant/30 bg-surface px-2 py-1 font-sans text-xs text-on-surface focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30'

  function renderBody() {
    switch (column.type) {
      case 'text': {
        const current = value?.type === 'text' ? value.value : ''
        return (
          <label className="block">
            <span className="sr-only">Search</span>
            <input
              type="text"
              placeholder="Search…"
              className={inputCls}
              value={current}
              onChange={(e) => onChange({ type: 'text', value: e.target.value })}
            />
          </label>
        )
      }
      case 'enum': {
        const current: EnumFilterValue = value?.type === 'enum' ? value.value : []
        const allOptions = column.options ?? []
        const options = availableValues
          ? allOptions.filter(
              (opt) => availableValues.has(opt.value) || current.includes(opt.value),
            )
          : allOptions
        const toggle = (v: string) => {
          const next = current.includes(v)
            ? current.filter((x) => x !== v)
            : [...current, v]
          onChange({ type: 'enum', value: next })
        }
        return (
          <div className="max-h-52 overflow-y-auto space-y-1">
            {options.length === 0 && (
              <p className="font-sans text-xs text-on-surface-variant">All values shown</p>
            )}
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 font-sans text-xs text-on-surface hover:bg-surface-container-low rounded px-1 py-0.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-outline-variant/30"
                  checked={current.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        )
      }
      case 'date': {
        const current: DateFilterValue = value?.type === 'date' ? value.value : {}
        return (
          <div className="space-y-2">
            <label className="block">
              <span className="font-sans text-[11px] text-on-surface-variant block mb-0.5">From</span>
              <input
                type="date"
                className={inputCls}
                value={current.from ?? ''}
                onChange={(e) =>
                  onChange({ type: 'date', value: { ...current, from: e.target.value || undefined } })
                }
              />
            </label>
            <label className="block">
              <span className="font-sans text-[11px] text-on-surface-variant block mb-0.5">To</span>
              <input
                type="date"
                className={inputCls}
                value={current.to ?? ''}
                onChange={(e) =>
                  onChange({ type: 'date', value: { ...current, to: e.target.value || undefined } })
                }
              />
            </label>
          </div>
        )
      }
      case 'number': {
        const current: NumberFilterValue = value?.type === 'number' ? value.value : {}
        return (
          <div className="space-y-2">
            <label className="block">
              <span className="font-sans text-[11px] text-on-surface-variant block mb-0.5">Min</span>
              <input
                type="number"
                className={inputCls}
                value={current.min ?? ''}
                onChange={(e) =>
                  onChange({
                    type: 'number',
                    value: { ...current, min: e.target.value === '' ? undefined : Number(e.target.value) },
                  })
                }
              />
            </label>
            <label className="block">
              <span className="font-sans text-[11px] text-on-surface-variant block mb-0.5">Max</span>
              <input
                type="number"
                className={inputCls}
                value={current.max ?? ''}
                onChange={(e) =>
                  onChange({
                    type: 'number',
                    value: { ...current, max: e.target.value === '' ? undefined : Number(e.target.value) },
                  })
                }
              />
            </label>
          </div>
        )
      }
    }
  }

  const node = (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={`Filter: ${column.label}`}
      style={{
        position: 'fixed',
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: POPOVER_WIDTH,
        visibility: pos ? 'visible' : 'hidden',
      }}
      className="z-50 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3 shadow-lg text-left normal-case tracking-normal"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant mb-2">
        {column.label}
      </p>
      {renderBody()}
      <div className="flex justify-between gap-2 mt-3 pt-2 border-t border-outline-variant/10">
        <button
          type="button"
          className="font-sans text-xs text-on-surface-variant hover:text-on-surface"
          onClick={() => onChange(undefined)}
        >
          Clear
        </button>
        <button
          type="button"
          className="font-sans text-xs px-2 py-1 rounded-lg bg-on-surface text-surface hover:bg-on-surface/90"
          onClick={onClose}
        >
          Apply
        </button>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
