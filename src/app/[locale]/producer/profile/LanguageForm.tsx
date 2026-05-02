'use client'

import { useActionState } from 'react'
import { Loader2, Check, Globe } from 'lucide-react'
import { updatePreferredLanguage, type ProfileResult } from './actions'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
]

type Props = {
  initialLanguage: string | null
}

export function LanguageForm({ initialLanguage }: Props) {
  const [state, formAction, pending] = useActionState(
    updatePreferredLanguage,
    null as ProfileResult,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
          Portal &amp; email language
        </label>
        <select
          name="preferred_language"
          defaultValue={initialLanguage ?? 'en'}
          disabled={pending}
          className="w-full max-w-xs rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-sans text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <p className="font-sans text-xs text-on-surface-variant mt-1.5">
          Order notifications and platform emails will be sent in this language.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-5 py-2 font-sans text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
        {pending ? 'Saving…' : 'Save language'}
      </button>

      {state?.ok === false && (
        <p className="font-sans text-xs text-error" role="alert">{state.error}</p>
      )}
      {state?.ok === true && (
        <p className="font-sans text-xs text-secondary flex items-center gap-1">
          <Check size={13} strokeWidth={2} /> Language preference saved.
        </p>
      )}
    </form>
  )
}
