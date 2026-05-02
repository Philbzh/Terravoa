import 'server-only'

/**
 * Startup-time environment validation.
 *
 * LOW-2 fix: critical server env vars used to be checked only at the point
 * of first use. A missing `STRIPE_SECRET_KEY` didn't surface until the first
 * customer hit /api/checkout — well after deploy. This module runs at import
 * time (imported from `src/app/layout.tsx`) so missing config crashes the
 * server on boot, where it's visible in deploy logs.
 *
 * "Hard" vars abort the process in production. "Soft" vars only log a
 * warning — they disable features (payments, email, Sanity CMS) but the
 * rest of the site can still render.
 *
 * Dev-mode: missing values become warnings only, so `npm run dev` on a
 * fresh checkout keeps working.
 */

const IS_PROD = process.env.NODE_ENV === 'production'

// --- Vars without which the app should not even start ---
const HARD_REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

// --- Vars whose absence silently disables a feature ---
// Each entry: [envName, featureDescription]
const SOFT_REQUIRED: ReadonlyArray<readonly [string, string]> = [
  ['STRIPE_SECRET_KEY', 'Stripe checkout'],
  ['STRIPE_WEBHOOK_SECRET', 'Stripe webhook verification'],
  ['RESEND_API_KEY', 'transactional email'],
  ['ADMIN_CONTACT_EMAIL', 'admin notifications'],
  ['CRON_SECRET', 'scheduled cron routes'],
  ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'Sanity CMS content'],
  ['ADMIN_EMAILS', 'admin allowlist'],
]

type Problem = { key: string; level: 'hard' | 'soft'; feature?: string }

function collectProblems(): Problem[] {
  const out: Problem[] = []
  for (const key of HARD_REQUIRED) {
    if (!process.env[key]?.trim()) out.push({ key, level: 'hard' })
  }
  for (const [key, feature] of SOFT_REQUIRED) {
    if (!process.env[key]?.trim()) out.push({ key, level: 'soft', feature })
  }
  return out
}

function assertEnvOnce() {
  const problems = collectProblems()
  if (problems.length === 0) return

  const hard = problems.filter((p) => p.level === 'hard')
  const soft = problems.filter((p) => p.level === 'soft')

  if (hard.length > 0) {
    const message =
      `[env] Missing required environment variables: ${hard.map((p) => p.key).join(', ')}.\n` +
      'The application cannot start without these.'
    if (IS_PROD) {
      // Thrown here, during server boot — shows up in deploy logs instead of
      // silently failing on the first real request.
      throw new Error(message)
    } else {
      console.warn(message)
    }
  }

  if (soft.length > 0) {
    for (const p of soft) {
      console.warn(
        `[env] ${p.key} is not set — ${p.feature ?? 'dependent feature'} will be unavailable until it is configured.`,
      )
    }
  }
}

// Run exactly once per process.
let ran = false
if (!ran) {
  ran = true
  assertEnvOnce()
}
