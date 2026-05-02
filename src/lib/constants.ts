export const SITE_NAME = 'Terravoa'
export const SITE_TAGLINE = 'Taste the Origin'
export const COMPANY_LEGAL_NAME = 'Terravoa SAS'

/**
 * Registered office line for Terms, Privacy, Returns. Set `NEXT_PUBLIC_COMPANY_REGISTERED_ADDRESS`
 * to your full postal address when published (recommended for legal clarity).
 */
export const COMPANY_REGISTERED_OFFICE =
  process.env.NEXT_PUBLIC_COMPANY_REGISTERED_ADDRESS?.trim() ||
  'France — full postal address available on request at hello@terravoa.com'

/**
 * Impressum / Mentions légales fields — used only by `/imprint`.
 *
 * Each value falls back to a clearly-marked placeholder string so the page
 * still renders without env vars, but the launch checklist requires every
 * field to be replaced with the real legal data before `NEXT_PUBLIC_ROBOTS_INDEX`
 * is flipped to `true`. See `docs/LAUNCH-CHECKLIST.md` §2.x.
 */
const placeholder = (label: string): string => `[TO FILL: ${label}]`

export const COMPANY_MANAGING_DIRECTOR =
  process.env.NEXT_PUBLIC_COMPANY_MANAGING_DIRECTOR?.trim() ||
  placeholder('Managing director full name')

export const COMPANY_REGISTRATION =
  process.env.NEXT_PUBLIC_COMPANY_REGISTRATION?.trim() ||
  placeholder('RCS / register court + number, e.g. RCS Paris 123 456 789')

export const COMPANY_SIRET =
  process.env.NEXT_PUBLIC_COMPANY_SIRET?.trim() ||
  placeholder('SIRET')

export const COMPANY_SHARE_CAPITAL =
  process.env.NEXT_PUBLIC_COMPANY_SHARE_CAPITAL?.trim() ||
  placeholder('Share capital, e.g. 10 000 €')

export const COMPANY_VAT_ID =
  process.env.NEXT_PUBLIC_COMPANY_VAT_ID?.trim() ||
  placeholder('VAT ID / USt-IdNr / TVA intracom., e.g. FR12345678901')

export const COMPANY_PHONE =
  process.env.NEXT_PUBLIC_COMPANY_PHONE?.trim() ||
  placeholder('Public contact phone in international format')

export const COMPANY_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_COMPANY_CONTACT_EMAIL?.trim() ||
  'hello@terravoa.com'

/**
 * Host / hébergeur — required by LCEN Art. 6-III for French online services.
 * Defaults to Vercel since that's the documented target of our deployment
 * playbook (see `docs/LAUNCH-CHECKLIST.md` §11).
 */
export const COMPANY_HOSTING_PROVIDER =
  process.env.NEXT_PUBLIC_COMPANY_HOSTING_PROVIDER?.trim() ||
  'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — vercel.com'

export const SITE_DESCRIPTION =
  'Terravoa connects discerning customers with Europe\'s most authentic producers, offering products defined by origin, craftsmanship, and taste. Discover exceptional foods — carefully curated and delivered directly from the source.'

/** Public origin (no trailing slash). Set via env; `next.config` fills from VERCEL_URL when unset. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)
