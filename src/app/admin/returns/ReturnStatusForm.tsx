'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending',   label: 'Pending' },
  { value: 'approved',  label: 'Approved' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'completed', label: 'Completed' },
]

interface Props {
  requestId: string
  currentStatus: string
  currentNotes: string
}

export function ReturnStatusForm({ requestId, currentStatus, currentNotes }: Props) {
  const router = useRouter()
  const [status, setStatus]   = useState(currentStatus)
  const [notes, setNotes]     = useState(currentNotes)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)

    const res = await fetch('/api/admin/return-request', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: requestId, status, admin_notes: notes }),
    })

    setSaving(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Failed to save.')
    } else {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <div className="space-y-3">
      <p className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant">Admin action</p>

      <div className="flex flex-wrap gap-3 items-start">
        {/* Status selector */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="font-sans text-xs bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary/40"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Notes */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes (e.g. return label sent, refund issued…)"
          rows={2}
          className="flex-1 min-w-[200px] font-sans text-xs bg-surface-container-low border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 resize-none"
        />

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-1.5 shrink-0"
        >
          {saving && <Loader2 size={12} className="animate-spin" />}
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && (
        <p className="font-sans text-xs text-error">{error}</p>
      )}
    </div>
  )
}
