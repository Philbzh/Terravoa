'use client'

import { useActionState } from 'react'
import { Loader2, Check, Building2 } from 'lucide-react'
import { updateBankDetails, type ProfileResult } from './actions'

type Props = {
  initialIban: string | null
  initialBic: string | null
  initialAccountName: string | null
}

export function BankDetailsForm({ initialIban, initialBic, initialAccountName }: Props) {
  const [state, formAction, pending] = useActionState(
    updateBankDetails,
    null as ProfileResult,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
          IBAN
        </label>
        <input
          name="bank_iban"
          type="text"
          defaultValue={initialIban ?? ''}
          placeholder="e.g. DE89370400440532013000"
          autoComplete="off"
          spellCheck={false}
          disabled={pending}
          className="w-full rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
        />
      </div>

      <div>
        <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
          BIC / SWIFT
        </label>
        <input
          name="bank_bic"
          type="text"
          defaultValue={initialBic ?? ''}
          placeholder="e.g. COBADEFFXXX"
          autoComplete="off"
          spellCheck={false}
          disabled={pending}
          className="w-full rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-mono text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
        />
      </div>

      <div>
        <label className="block font-sans text-[10px] uppercase tracking-wider text-on-surface-variant mb-1.5">
          Account holder name
        </label>
        <input
          name="bank_account_name"
          type="text"
          defaultValue={initialAccountName ?? ''}
          placeholder="Full legal name on the account"
          disabled={pending}
          className="w-full rounded-lg border border-outline-variant/25 bg-surface-container-low px-3 py-2 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-5 py-2 font-sans text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? <Loader2 size={13} className="animate-spin" /> : <Building2 size={13} />}
        {pending ? 'Saving…' : 'Save bank details'}
      </button>

      {state?.ok === false && (
        <p className="font-sans text-xs text-error" role="alert">{state.error}</p>
      )}
      {state?.ok === true && (
        <p className="font-sans text-xs text-secondary flex items-center gap-1">
          <Check size={13} strokeWidth={2} /> Bank details saved.
        </p>
      )}
    </form>
  )
}
