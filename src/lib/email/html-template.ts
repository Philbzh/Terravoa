import { escapeHtml } from './escape-html'

/**
 * Tagged-template helper for building HTML email bodies safely.
 *
 * MED-2 fix: the previous pattern hand-wrote every `${escapeHtml(…)}` call.
 * One forgotten escape on a user-supplied value is an XSS in the admin inbox
 * (or worse, in any mail client that renders HTML without sanitisation).
 *
 * `html` escapes every interpolated value by default. For intentional HTML
 * (another `html\`…\`` fragment, or an explicitly trusted string) wrap the
 * value in `raw(value)` — this is deliberately verbose so intent is obvious.
 *
 * Usage:
 *   const body = html`<p>Hello <strong>${name}</strong></p>${raw(signatureHtml)}`
 *
 * The return value is a plain `string` — callers can pass it to Resend's
 * `html` field unchanged.
 */
const RAW_BRAND: unique symbol = Symbol('html-template-raw')

type Raw = { readonly [RAW_BRAND]: true; readonly value: string }

export function raw(value: string): Raw {
  return { [RAW_BRAND]: true, value } as Raw
}

function isRaw(v: unknown): v is Raw {
  return typeof v === 'object' && v !== null && RAW_BRAND in (v as object)
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = strings[0] ?? ''
  for (let i = 0; i < values.length; i++) {
    const v = values[i]
    if (v == null) {
      // Treat null/undefined as empty string, never as "null".
    } else if (isRaw(v)) {
      out += v.value
    } else if (typeof v === 'number' || typeof v === 'bigint') {
      out += String(v)
    } else if (Array.isArray(v)) {
      for (const item of v) {
        out += isRaw(item) ? item.value : escapeHtml(String(item))
      }
    } else {
      out += escapeHtml(String(v))
    }
    out += strings[i + 1] ?? ''
  }
  return out
}
