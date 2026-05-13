import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

/**
 * Email confirmation landing for Supabase Auth (PKCE `?code=` flow).
 *
 * Configure Supabase Dashboard → Authentication → URL Configuration:
 * add redirect URLs matching `{SITE_URL}/{locale}/confirmation` for each locale,
 * or a wildcard your host supports (e.g. Vercel preview URLs).
 *
 * Customer sign-up sets `emailRedirectTo` to `${NEXT_PUBLIC_SITE_URL}/{locale}/confirmation`.
 */
export async function GET(
  request: Request,
  ctx: { params: Promise<{ locale: string }> },
) {
  const { locale } = await ctx.params
  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url))
  }

  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const nextRaw = url.searchParams.get('next')
  const safeNext =
    nextRaw &&
    nextRaw.startsWith(`/${locale}/`) &&
    !nextRaw.includes('://')
      ? nextRaw
      : null

  const loginBase = `/${locale}/login`

  if (!code || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.redirect(new URL(`${loginBase}?error=auth_confirm`, request.url))
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL(`${loginBase}?error=${encodeURIComponent(error.message)}`, request.url),
    )
  }

  const destination = safeNext ?? `${loginBase}?confirmed=1`
  return NextResponse.redirect(new URL(destination, request.url))
}
