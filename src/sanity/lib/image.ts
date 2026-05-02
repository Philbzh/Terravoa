import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityClient } from './client'

const builder = createImageUrlBuilder(sanityClient)

export function urlForImage(source: unknown): string {
  if (!source || typeof source !== 'object') return ''
  return builder.image(source as Parameters<typeof builder.image>[0]).width(2000).auto('format').fit('max').quality(90).url()
}
