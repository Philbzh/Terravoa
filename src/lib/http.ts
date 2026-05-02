import 'server-only'

import { NextResponse } from 'next/server'

/**
 * Reject non-JSON POST/PUT/PATCH bodies with 415 Unsupported Media Type.
 *
 * LOW-9 fix: several API routes parse `request.json()` without checking the
 * Content-Type header. A form-encoded or text/plain body would either fail
 * inside JSON.parse (leaking a stack trace via console.error) or — in the
 * case of simple ASCII JSON sent as text/plain — succeed, bypassing the
 * implicit "JSON only" contract the routes assume. Explicit validation also
 * blocks `<form>`-based CSRF attempts that would otherwise go unnoticed
 * because they don't round-trip cookies (but can still waste compute).
 *
 * Usage:
 *   const bad = requireJsonContentType(request)
 *   if (bad) return bad
 *   const body = await request.json()
 */
export function requireJsonContentType(request: Request): NextResponse | null {
  const ct = request.headers.get('content-type')?.toLowerCase() ?? ''
  // Accept `application/json` with optional charset/boundary suffix.
  if (ct.startsWith('application/json')) return null
  return NextResponse.json(
    { error: 'Content-Type must be application/json' },
    { status: 415 },
  )
}
