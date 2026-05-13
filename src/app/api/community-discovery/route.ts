import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  return xff?.split(',')[0]?.trim() || 'unknown'
}

/**
 * POST /api/community-discovery
 * Submit a community discovery for a region. Moderated before display.
 */
export async function POST(req: Request) {
  // Rate limit: 5 submissions per hour per IP
  const ip = getClientIp(req)
  const { success } = await rateLimit(`community-discovery:${ip}`, 5, 3600_000)
  if (!success) {
    return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { regionSlug, authorName, authorLocation, text } = body

    if (!regionSlug || typeof regionSlug !== 'string') {
      return NextResponse.json({ error: 'Region is required.' }, { status: 400 })
    }
    if (!authorName || typeof authorName !== 'string' || authorName.trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 characters).' }, { status: 400 })
    }
    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return NextResponse.json({ error: 'Your discovery must be at least 20 characters.' }, { status: 400 })
    }
    if (text.trim().length > 800) {
      return NextResponse.json({ error: 'Your discovery must be under 800 characters.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await (admin as any)
      .from('community_discoveries')
      .insert({
        region_slug: regionSlug.trim(),
        author_name: authorName.trim(),
        author_location: authorLocation?.trim() || null,
        body: text.trim(),
        status: 'pending',
      })

    if (error) {
      console.error('[community-discovery]', error)
      return NextResponse.json({ error: 'Could not submit. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}

/**
 * GET /api/community-discovery?region=<slug>
 * Fetch approved discoveries for a region.
 */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const regionSlug = url.searchParams.get('region')

  if (!regionSlug) {
    return NextResponse.json({ error: 'Region parameter required.' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await (admin as any)
      .from('community_discoveries')
      .select('id, created_at, author_name, author_location, body')
      .eq('region_slug', regionSlug)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ discoveries: [] })
    }

    const discoveries = (data ?? []).map((d: any) => ({
      id: d.id,
      authorName: d.author_name,
      authorLocation: d.author_location,
      body: d.body,
      createdAt: d.created_at,
    }))

    return NextResponse.json({ discoveries })
  } catch {
    return NextResponse.json({ discoveries: [] })
  }
}
