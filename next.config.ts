import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Canonical public URL for the app (metadata, sitemap, auth redirects, emails).
 * - Prefer NEXT_PUBLIC_SITE_URL when set (your future custom domain).
 * - On Vercel, fall back to https://VERCEL_URL so previews/production work before a domain exists.
 * - Local dev defaults to http://localhost:3000.
 */
function resolvePublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`
  return "http://localhost:3000"
}

/**
 * Content Security Policy
 * - script-src 'unsafe-inline' is required by Next.js App Router hydration (no nonce yet).
 * - style-src  'unsafe-inline' is required by Framer Motion (runtime inline styles).
 * - img-src https: allows Sanity CDN, Supabase Storage, Wikimedia, etc.
 * - connect-src lists all external fetch/WS targets the browser makes.
 * - object-src/base-uri/form-action are the most impactful XSS mitigations here.
 *
 * NOTE: The /studio route is intentionally EXCLUDED from the CSP (see headers() below).
 * Sanity Studio is an admin-only SPA that manages its own security, and it needs
 * unrestricted access to *.api.sanity.io, *.sanity.io, and related WebSocket endpoints.
 * Applying a public-site CSP to the Studio blocks its authentication and real-time API calls.
 */
const isDev = process.env.NODE_ENV !== 'production'

const cspDirectives = [
  "default-src 'self'",
  // Next.js needs 'unsafe-inline'; add 'unsafe-eval' only in dev (HMR).
  // Vercel Analytics + Speed Insights load from va.vercel-scripts.com.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  // Broad img-src: images come from many CDNs (Sanity, Supabase, Wikimedia…)
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.stripe.com',
    'https://cdn.sanity.io',
    'https://api.mymemory.translated.net',
    // Vercel Analytics + Speed Insights beacons
    'https://va.vercel-scripts.com',
    'https://*.vercel-insights.com',
  ].join(' '),
  // We redirect to Stripe, never embed it in a frame
  "frame-src 'none'",
  // No plugins ever
  "object-src 'none'",
  // Prevent base-tag injection (phishing)
  "base-uri 'self'",
  // Prevent cross-origin form submission hijacking
  "form-action 'self'",
  // Only force HTTPS in production — in dev the server is plain HTTP and
  // upgrade-insecure-requests would rewrite every image/font/script URL to
  // https://localhost:3000/… causing ERR_SSL_PROTOCOL_ERROR for all assets.
  ...(!isDev ? ['upgrade-insecure-requests'] : []),
].join('; ')

/** Security headers shared by ALL routes (no CSP — applied separately per route). */
const commonHeaders = [
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'X-Frame-Options',         value: 'DENY' },
  { key: 'X-XSS-Protection',        value: '1; mode=block' },
  { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
]

/** Full security headers for public pages — includes strict CSP. */
const securityHeaders = [
  ...commonHeaders,
  { key: 'Content-Security-Policy', value: cspDirectives },
]

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_URL: resolvePublicSiteUrl(),
  },
  turbopack: {
    root: __dirname,
  },
  images: {
    // sharp (the native image optimizer) cannot resolve paths containing
    // non-ASCII characters (ä, ö, ü …) on Windows in dev. Disable optimization
    // locally so images are served as plain static files. On Vercel the path
    // has no special characters, so optimization works correctly in production.
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        // Supabase Storage (project-specific subdomain)
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Producer-submitted images from common CDNs/hosts
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Browsers sometimes resolve manifest relative to /de/…; always serve the root manifest route.
        {
          source: '/:locale(en|de|fr|it|es|pt)/manifest.webmanifest',
          destination: '/manifest.webmanifest',
        },
      ],
    }
  },
  async headers() {
    return [
      // ── Public routes: strict CSP ──────────────────────────────────────────
      // Matches everything EXCEPT paths that start with /studio
      {
        source: '/((?!studio).*)',
        headers: securityHeaders,
      },
      // ── Sanity Studio: no CSP, other security headers preserved ───────────
      // Studio is admin-only and needs unrestricted access to *.api.sanity.io,
      // *.sanity.io for auth/OAuth, and wss://*.api.sanity.io for real-time.
      // It ships its own XSS protection — applying a public CSP would break it.
      {
        source: '/studio(.*)',
        headers: commonHeaders,
      },
    ]
  },
};

export default withNextIntl(nextConfig);
