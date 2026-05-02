/**
 * Magic-byte image MIME detection — shared between the producer application
 * flow (`apply/actions.ts`) and the producer product upload flow.
 *
 * Why magic bytes? `file.name` and `file.type` (MIME) are sent by the
 * browser and trivially spoofed. Looking at the first 12 bytes of the
 * buffer is fast, cheap, and reliable.
 */

/** Allow-list of MIME types we actually want to accept. */
export const ACCEPTED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export type AcceptedImageMime = (typeof ACCEPTED_IMAGE_MIMES)[number]

/** Canonical extension for each validated MIME. */
export const MIME_TO_EXT: Record<AcceptedImageMime, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/** Comma-separated list suitable for an `<input accept="…">` attribute. */
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_MIMES.join(',')

/** 10 MB — matches the limit used everywhere in the codebase. */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

/**
 * Detect image MIME type from the first 12 bytes of a Buffer.
 * Returns null if the buffer does not match a supported image format.
 */
export function detectImageMime(buf: Buffer): AcceptedImageMime | null {
  if (buf.length < 12) return null

  // JPEG — FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'

  // PNG — 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return 'image/png'
  }

  // GIF — 47 49 46 38 ("GIF8")
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38
  ) {
    return 'image/gif'
  }

  // WebP — RIFF????WEBP (offset 0 "RIFF" + offset 8 "WEBP")
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'image/webp'
  }

  return null
}
