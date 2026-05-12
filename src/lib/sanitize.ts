const HTML_TAG_RE = /<\/?[a-z][^>]*>/gi

export function sanitizeInput(raw: string): string {
  return raw.replace(HTML_TAG_RE, '').replace(/\s+/g, ' ').trim()
}

export function sanitizeFormField(formData: FormData, name: string): string {
  return sanitizeInput(String(formData.get(name) ?? ''))
}
