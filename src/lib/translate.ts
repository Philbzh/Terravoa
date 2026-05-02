/**
 * MyMemory translation utility — free, no API key or credit card required.
 * Up to 1,000 words/day anonymous; set TRANSLATION_EMAIL in .env.local to
 * raise the limit to 10,000 words/day (just your email address, no account needed).
 */

/**
 * Translate multiple text fields to English using the MyMemory API.
 * Returns null if:
 *  - sourceLang is already 'en'
 *  - the API call fails
 */
export async function translateFieldsToEnglish(
  fields: Record<string, string>,
  sourceLang: string,
): Promise<Record<string, string> | null> {
  if (sourceLang === 'en') return null

  const keys = Object.keys(fields)
  const texts = keys.map((k) => fields[k]).filter(Boolean)
  if (texts.length === 0) return null

  const email = process.env.TRANSLATION_EMAIL ?? ''
  const langPair = `${sourceLang}|en`

  try {
    // MyMemory translates one string per request — run in parallel
    const results = await Promise.all(
      texts.map((text) => {
        const url = new URL('https://api.mymemory.translated.net/get')
        url.searchParams.set('q', text)
        url.searchParams.set('langpair', langPair)
        if (email) url.searchParams.set('de', email)
        return fetch(url.toString())
          .then((r) => r.json())
          .then((d) => (d.responseStatus === 200 ? d.responseData.translatedText as string : text))
          .catch(() => text)
      }),
    )

    const translated: Record<string, string> = {}
    keys.forEach((k, i) => {
      translated[k] = results[i]
    })
    return translated
  } catch {
    return null
  }
}
