'use client'

import { Loader2 } from 'lucide-react'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

/**
 * ConfirmDialog — ported from Marubeni `components/ConfirmDialog.tsx`.
 * Two-button modal for destructive / irreversible actions.
 *
 * When `danger` is true, the confirm button uses the Terravoa `error` palette
 * (warm red from the token set), signalling a destructive action. When
 * `loading` is true, the confirm button shows a spinner and both buttons are
 * disabled so the user can't double-submit.
 *
 * Labels are passed in by the caller — keeps this component locale-agnostic
 * so admin and producer portals can hand over their own translated strings.
 */

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  danger?: boolean
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="sm">
      <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{message}</p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className={cn(
            'font-sans text-[11px] uppercase tracking-[0.2em] font-semibold',
            'px-6 py-3 rounded-full transition-colors',
            'bg-surface-container-high text-on-surface',
            'hover:bg-surface-container-highest',
            loading && 'opacity-50 cursor-not-allowed',
          )}
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'inline-flex items-center gap-2',
            'font-sans text-[11px] uppercase tracking-[0.2em] font-semibold',
            'px-6 py-3 rounded-full transition-colors',
            danger
              ? 'bg-error text-on-error hover:bg-error/90'
              : 'bg-secondary text-on-secondary hover:bg-secondary-container',
            loading && 'opacity-60 cursor-wait',
          )}
        >
          {loading && <Loader2 size={14} className="animate-spin" aria-hidden />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
