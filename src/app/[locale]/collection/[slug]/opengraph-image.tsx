import { ImageResponse } from 'next/og'
import { getProductBySlug } from '@/lib/content'
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/constants'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function ProductOGImage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  // Fall back to site-level OG if product not found
  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2D3B2E 0%, #1a2e1b 100%)',
          }}
        >
          <div style={{ fontSize: 72, color: '#F5EDD6', fontFamily: 'serif' }}>{SITE_NAME}</div>
        </div>
      ),
      { ...size },
    )
  }

  const imageUrl = product.imageSrc.startsWith('http')
    ? product.imageSrc
    : `${SITE_URL}${product.imageSrc}`

  const priceFormatted = `€${(product.price / 100).toFixed(2)}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#1a2e1b',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Product image — left half */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          style={{
            width: '50%',
            height: '100%',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />

        {/* Dark overlay on image edge for text readability */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '50%',
            height: '100%',
            background:
              'linear-gradient(to right, transparent 50%, rgba(26,46,27,0.6) 100%)',
          }}
        />

        {/* Text content — right half */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 64px',
            gap: '0px',
          }}
        >
          {/* Site branding */}
          <div
            style={{
              fontSize: '14px',
              color: '#8BAD7A',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            {SITE_NAME} — {SITE_TAGLINE}
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: '52px',
              fontWeight: '400',
              color: '#F5EDD6',
              fontFamily: 'serif',
              lineHeight: '1.1',
              marginBottom: '16px',
            }}
          >
            {product.name}
          </div>

          {/* Producer + origin */}
          <div
            style={{
              fontSize: '18px',
              color: 'rgba(245,237,214,0.65)',
              marginBottom: '32px',
              lineHeight: '1.4',
            }}
          >
            {product.producerName} · {product.origin}
          </div>

          {/* Divider */}
          <div
            style={{
              width: '36px',
              height: '1px',
              background: '#8BAD7A',
              marginBottom: '28px',
            }}
          />

          {/* Price */}
          <div
            style={{
              fontSize: '36px',
              color: '#8BAD7A',
              fontFamily: 'serif',
            }}
          >
            {priceFormatted}
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
