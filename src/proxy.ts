import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createMiddleware(routing)

const LOCALE_SEG = '(en|de|fr|it|es|pt)'

/**
 * Central request-level auth gate (LOW-1 fix).
 *
 * Layouts remain authoritative — `requireAdminSession` / `getProducerForSession`
 * enforce role/status checks — but this proxy guarantees that anonymous
 * traffic never reaches a `/admin` or `/producer` route even if a future page
 * forgets to wire up its layout. Defence in depth.
 *
 * Dev bypass: when `NODE_ENV !== 'production'` and either the
 * `PRODUCER_DASHBOARD_PREVIEW` or `ADMIN_PREVIEW` env flag is set, we skip
 * the redirect so local work can continue without a live session.
 */

function withPathnameHeader(request: NextRequest, path: string): Headers {
  const h = new Headers(request.headers)
  h.set('x-pathname', path)
  return h
}

// Static file extensions that must never get a locale prefix injected.
const STATIC_EXT = /\.(?:svg|png|jpe?g|gif|webp|avif|ico|txt|xml|json|webmanifest|woff2?|ttf|otf|eot|mp4|mp3|pdf)$/i

function skipI18n(pathname: string) {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login/admin') ||
    // Public static assets — images, fonts, manifest, etc.
    // Without this guard the intl middleware re-routes /images/logo.png
    // to /de/images/logo.png (404) because the matcher config is not
    // enforced at runtime in Next.js 16 proxy mode.
    pathname.startsWith('/images/') ||
    pathname.startsWith('/fonts/') ||
    STATIC_EXT.test(pathname)
  )
}

// Admin area lives at /admin (no locale prefix). Login fallback is /login/admin.
const adminArea = /^\/admin(\/|$)/
// Producer area lives under /{locale}/producer.
const producerArea = new RegExp(`^/${LOCALE_SEG}/producer(/|$)`)

function devBypassAllowed(area: 'admin' | 'producer'): boolean {
  if (process.env.NODE_ENV === 'production') return false
  if (area === 'producer' && process.env.PRODUCER_DASHBOARD_PREVIEW === 'true') return true
  if (area === 'admin' && process.env.ADMIN_PREVIEW === 'true') return true
  return false
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  let response: NextResponse
  if (skipI18n(pathname)) {
    response = NextResponse.next({
      request: { headers: withPathnameHeader(request, pathname) },
    })
  } else {
    response = intlMiddleware(request)
  }

  const isAdmin = adminArea.test(pathname)
  const isProducer = producerArea.test(pathname)

  if (isAdmin || isProducer) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            )
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !devBypassAllowed(isAdmin ? 'admin' : 'producer')) {
      const url = request.nextUrl.clone()
      if (isAdmin) {
        url.pathname = '/login/admin'
        url.searchParams.set('next', pathname)
      } else {
        const m = pathname.match(new RegExp(`^/${LOCALE_SEG}`))
        const locale = m?.[1] ?? routing.defaultLocale
        url.pathname = `/${locale}/login/producer`
        url.searchParams.set('next', pathname)
      }
      const redirectResponse = NextResponse.redirect(url)
      redirectResponse.headers.set('x-pathname', pathname)
      return redirectResponse
    }
  }

  response.headers.set('x-pathname', pathname)
  return response
}

/** Limit which paths run the proxy — must stay in this file (Next.js parses it statically). */
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
