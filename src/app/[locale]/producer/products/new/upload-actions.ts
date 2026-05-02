'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getProducerForSession } from '@/lib/producer/server'
import {
  detectImageMime,
  MIME_TO_EXT,
  MAX_IMAGE_BYTES,
} from '@/lib/image-mime'
import { logAuditEvent } from '@/lib/audit-log'

/**
 * Server actions that back the drag-and-drop `ProductImageUpload` component
 * on `/producer/products/new`.
 *
 * Security posture:
 *   - Every call requires an authenticated, *approved* producer session
 *     (see `getProducerForSession` — HIGH-1 / MED-8 from the audit).
 *   - The file is validated server-side by MAGIC BYTES (`detectImageMime`),
 *     never by the client-supplied `file.type`. Browsers can lie; disk can't.
 *   - Objects are namespaced under `products/{producer_id}/` in the `images`
 *     bucket, so deletion calls can enforce ownership by path prefix.
 *   - Uploads go through the admin (service role) client, so no new Storage
 *     RLS policy is required — the `server-only` import in admin.ts keeps
 *     this code off the browser bundle.
 */

const BUCKET = 'images'
const STORAGE_PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`

type Result =
  | { ok: true; url: string }
  | { ok: false; error: string }

export async function uploadProducerProductImage(
  formData: FormData,
): Promise<Result> {
  const session = await getProducerForSession()
  if (!session?.producer) {
    return { ok: false, error: 'Not authenticated.' }
  }
  const producerId = session.producer.id

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return { ok: false, error: 'No file provided.' }
  }
  if (file.size === 0) {
    return { ok: false, error: 'Empty file.' }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'File is larger than 10 MB.' }
  }

  const buf = Buffer.from(await file.arrayBuffer())
  const mime = detectImageMime(buf)
  if (!mime) {
    console.warn(
      `[product-upload] rejected non-image file from producer ${producerId} (claimed type: ${file.type})`,
    )
    return {
      ok: false,
      error: 'Unsupported file type. JPEG, PNG, WebP or GIF only.',
    }
  }

  const ext = MIME_TO_EXT[mime]
  const stamp = Date.now()
  const rand = Math.random().toString(36).slice(2, 8)
  const path = `products/${producerId}/${stamp}-${rand}.${ext}`

  const admin = createAdminClient()
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, buf, {
      contentType: mime,
      cacheControl: '3600',
      upsert: false,
    })
  if (uploadError) {
    console.error('[product-upload] Supabase upload failed', uploadError)
    return { ok: false, error: 'Upload failed. Please try again.' }
  }

  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path)
  if (!pub?.publicUrl) {
    return { ok: false, error: 'Upload succeeded but URL unavailable.' }
  }

  if (session.email) {
    await logAuditEvent({
      action: 'producer.product.image.uploaded',
      actorEmail: session.email,
      entityType: 'product_image',
      entityId: path,
      metadata: {
        producer_id: producerId,
        mime,
        size_bytes: file.size,
      },
    })
  }

  return { ok: true, url: pub.publicUrl }
}

/**
 * Best-effort delete of an image that the caller previously uploaded.
 * Returns `{ ok: true }` whether or not the object existed, so the UI can
 * treat cancel/remove interactions idempotently.
 *
 * Ownership is enforced by path prefix: a producer can only delete objects
 * under `products/{their-producer-id}/…`. An attempt to pass a URL from a
 * different producer's folder (or any other bucket path) returns early.
 */
export async function deleteProducerProductImage(
  url: string,
): Promise<{ ok: boolean }> {
  const session = await getProducerForSession()
  if (!session?.producer) return { ok: false }
  const producerId = session.producer.id

  const idx = url.indexOf(STORAGE_PUBLIC_MARKER)
  if (idx < 0) return { ok: false }

  const path = decodeURIComponent(url.slice(idx + STORAGE_PUBLIC_MARKER.length))
  if (!path.startsWith(`products/${producerId}/`)) {
    console.warn(
      `[product-upload] refused delete outside own folder: ${path} (producer ${producerId})`,
    )
    return { ok: false }
  }

  const admin = createAdminClient()
  const { error } = await admin.storage.from(BUCKET).remove([path])
  if (error) {
    // Treat "object not found" as success so UI cancel flows are idempotent.
    console.warn('[product-upload] delete warning', error.message)
  }
  return { ok: true }
}
