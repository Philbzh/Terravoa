'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import {
  REJECTION_REASON_CODES,
  rejectionReasonAdminLabels,
  type RejectionReasonCode,
} from '@/lib/email/i18n'
import { rejectApplication } from '@/app/admin/applications/actions'

const MAX_NOTE_LENGTH = 500

type Props = {
  applicationId: string
  applicantName: string
  applicantEmail: string
  locale: string
  /** Optional callback after the server action completes successfully.
   *  Parent typically calls `router.refresh()` from here. */
  onRejected?: () => void
  /** Visual variant — `primary` is a full-width red button (detail page sidebar),
   *  `ghost` is a compact pill (listing rows). */
  variant?: 'primary' | 'ghost'
}

export function RejectApplicationModal({
  applicationId,
  applicantName,
  applicantEmail,
  locale,
  onRejected,
  variant = 'primary',
}: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<RejectionReasonCode>>(new Set())
  const [note, setNote] = useState('')
  const [pending, startTransition] = useTransition()

  function toggle(code: RejectionReasonCode) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  function reset() {
    setSelected(new Set())
    setNote('')
  }

  function submit() {
    const fd = new FormData()
    fd.set('id', applicationId)
    for (const code of selected) fd.append('reasons', code)
    if (note.trim()) fd.set('note', note.trim())
    startTransition(async () => {
      await rejectApplication(fd)
      setOpen(false)
      reset()
      onRejected?.()
    })
  }

  const triggerClass =
    variant === 'primary'
      ? 'w-full font-sans text-xs uppercase tracking-wider border border-error/30 text-error px-4 py-2.5 rounded-full hover:bg-error/8 transition-colors'
      : 'font-sans text-xs uppercase tracking-wider border border-outline-variant/40 px-4 py-2 rounded-full hover:bg-surface-container-high transition-colors'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClass}
      >
        Reject application
      </button>

      <Modal
        open={open}
        onClose={() => (pending ? undefined : (setOpen(false), reset()))}
        title="Reject application"
        description={`${applicantName} — ${applicantEmail}`}
        srOnlyDescription={false}
        maxWidth="xl"
        closeLabel="Close"
      >
        <div className="space-y-6">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Select the reasons this application is not moving forward. The
            producer will receive a polite, localised email ({locale.toUpperCase()})
            with the selected points and any additional note you add below.
          </p>

          <div>
            <p className="font-sans text-xs uppercase tracking-wider text-on-surface-variant mb-3">
              Reasons
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REJECTION_REASON_CODES.map((code) => {
                const checked = selected.has(code)
                return (
                  <li key={code}>
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        checked
                          ? 'border-primary/40 bg-primary/6'
                          : 'border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(code)}
                        disabled={pending}
                        className="mt-0.5 accent-primary shrink-0"
                      />
                      <span className="text-sm text-on-surface leading-snug">
                        {rejectionReasonAdminLabels[code]}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <label
              htmlFor="rejection-note"
              className="font-sans text-xs uppercase tracking-wider text-on-surface-variant block mb-2"
            >
              Additional note (optional)
            </label>
            <textarea
              id="rejection-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LENGTH))}
              disabled={pending}
              rows={4}
              placeholder="A short personal note to the producer. Plain text — will appear verbatim in the email after the reasons above."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
            />
            <p className="font-sans text-[11px] text-on-surface-variant mt-1 text-right">
              {note.length} / {MAX_NOTE_LENGTH}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => {
                if (pending) return
                setOpen(false)
                reset()
              }}
              disabled={pending}
              className="font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary px-4 py-2.5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider bg-error text-on-error px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending && <Loader2 className="size-3.5 animate-spin" />}
              Send rejection email
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
