import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/constants'

export const runtime = 'edge'
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2D3B2E 0%, #1a2e1b 50%, #2D3B2E 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Subtle texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 30% 70%, rgba(180,220,160,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(200,230,180,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Decorative line */}
        <div
          style={{
            width: '40px',
            height: '2px',
            background: '#8BAD7A',
            marginBottom: '28px',
          }}
        />

        {/* Site name */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: '400',
            color: '#F5EDD6',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            fontFamily: 'serif',
          }}
        >
          {SITE_NAME}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '22px',
            color: '#8BAD7A',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '36px',
          }}
        >
          {SITE_TAGLINE}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'rgba(139,173,122,0.5)',
            marginBottom: '32px',
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: '18px',
            color: 'rgba(245,237,214,0.65)',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: '1.6',
          }}
        >
          {SITE_DESCRIPTION.slice(0, 120)}…
        </div>
      </div>
    ),
    { ...size },
  )
}
