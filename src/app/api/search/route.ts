import { NextRequest, NextResponse } from 'next/server'
import { sanityClient, isSanityConfigured } from '@/sanity/lib/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const imgBuilder = createImageUrlBuilder(sanityClient)

function thumb(source: unknown): string | null {
  if (!source || typeof source !== 'object') return null
  try {
    return imgBuilder
      .image(source as Parameters<typeof imgBuilder.image>[0])
      .width(120)
      .height(120)
      .fit('crop')
      .auto('format')
      .url()
  } catch {
    return null
  }
}

// MED-4: cap the search term length so a runaway GROQ query can't tie up
// the Sanity API (or our compute). 64 chars is more than enough for product,
// producer, or region searches in any language.
const Q_MAX = 64

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  // Strip GROQ meta-characters that aren't useful in a user query but can
  // break the match operator. Values are parameterised so injection isn't
  // possible, but this keeps the `*` wildcard suffix unambiguous.
  const q = raw.replace(/[*[\]"\\{}()]/g, '').slice(0, Q_MAX)

  if (q.length < 2) {
    return NextResponse.json({ products: [], producers: [], regions: [] })
  }

  if (!isSanityConfigured()) {
    return NextResponse.json({ products: [], producers: [], regions: [] })
  }

  const groqQ = q + '*'

  const [rawProducts, rawProducers, rawRegions] = await Promise.all([
    sanityClient.fetch<any[]>(
      `*[_type == "product" && defined(slug.current) &&
        (name match $q || origin match $q || producer->name match $q)]
        | order(name asc) [0...6] {
          "slug": slug.current,
          name,
          price,
          origin,
          image,
          "producerName": producer->name
        }`,
      { q: groqQ },
    ),
    sanityClient.fetch<any[]>(
      `*[_type == "producer" && defined(slug.current) &&
        (name match $q || region match $q || country match $q || specialty match $q)]
        | order(name asc) [0...4] {
          "slug": slug.current,
          name,
          region,
          country,
          specialty,
          image
        }`,
      { q: groqQ },
    ),
    sanityClient.fetch<any[]>(
      `*[_type == "region" && defined(slug.current) &&
        (name match $q || country match $q || specialty match $q)]
        | order(name asc) [0...3] {
          "slug": slug.current,
          name,
          country,
          specialty,
          image
        }`,
      { q: groqQ },
    ),
  ])

  return NextResponse.json({
    products: rawProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      origin: p.origin ?? '',
      price: p.price ?? 0,
      producerName: p.producerName ?? '',
      imageSrc: thumb(p.image),
    })),
    producers: rawProducers.map((p) => ({
      slug: p.slug,
      name: p.name,
      region: p.region ?? '',
      country: p.country ?? '',
      specialty: p.specialty ?? '',
      imageSrc: thumb(p.image),
    })),
    regions: rawRegions.map((r) => ({
      slug: r.slug,
      name: r.name,
      country: r.country ?? '',
      specialty: r.specialty ?? '',
      imageSrc: thumb(r.image),
    })),
  })
}
