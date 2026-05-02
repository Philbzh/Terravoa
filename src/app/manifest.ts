import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Terravoa — Taste the Origin',
    short_name: 'Terravoa',
    description: "Europe's finest small-batch producers, direct to your door.",
    start_url: '/en',
    display: 'standalone',
    background_color: '#FDFAF5',
    theme_color: '#2D3B2E',
    icons: [
      {
        src: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
