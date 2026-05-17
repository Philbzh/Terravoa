'use client'

import { useActionState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { updatePublicProfile, type ProfileResult } from './actions'

type Props = {
  specialty: string
  tagline: string
  storyHeadline: string
  story: string
  quote: string | null
}

const inputClass =
  'w-full rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60'

export function ProducerProfileEditForm({
  specialty,
  tagline,
  storyHeadline,
  story,
  quote,
}: Props) {
  const t = useTranslations('producerPortal.profile')
  const [state, formAction, pending] = useActionState(updatePublicProfile, null as ProfileResult)

  return (
    <form action={formAction} className="space-y-4">
      <Field label={t('fieldSpecialty')} name="specialty" defaultValue={specialty} required />
      <Field label={t('fieldTagline')} name="tagline" defaultValue={tagline} required />
      <Field
        label={t('fieldStoryHeadline')}
        name="story_headline"
        defaultValue={storyHeadline}
        required
      />
      <Textarea label={t('fieldStory')} name="story" defaultValue={story} rows={6} required />
      <Field label={t('fieldQuote')} name="quote" defaultValue={quote ?? ''} />

      {state?.ok === false && (
        <p className="font-sans text-sm text-error" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok === true && (
        <p className="font-sans text-sm text-secondary flex items-center gap-1.5">
          <Check size={14} />
          {t('editSaved')}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending && <Loader2 size={14} className="animate-spin" />}
        {pending ? t('editSaving') : t('editSave')}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string
  name: string
  defaultValue: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        required={required}
        className={inputClass}
      />
    </div>
  )
}

function Textarea({
  label,
  name,
  defaultValue,
  rows,
  required,
}: {
  label: string
  name: string
  defaultValue: string
  rows: number
  required?: boolean
}) {
  return (
    <div>
      <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={`${inputClass} resize-y min-h-[120px]`}
      />
    </div>
  )
}
