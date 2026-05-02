'use client'

import {
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCEPT_ATTRIBUTE, MAX_IMAGE_BYTES } from '@/lib/image-mime'
import {
  uploadProducerProductImage,
  deleteProducerProductImage,
} from '@/app/[locale]/producer/products/new/upload-actions'

/**
 * Drag-and-drop product image uploader — ported from Marubeni
 * `features/admin/components/ProductImageUpload.tsx` and adapted to
 * Terravoa's Next.js 16 server-action architecture.
 *
 * Key adaptation notes vs the Marubeni original:
 *   - The original called a react-query hook that hit `supabase.storage`
 *     directly from the browser. Terravoa routes the upload through a
 *     `'use server'` action (`upload-actions.ts`) so (a) the service-role
 *     client can handle auth/ownership centrally, (b) magic-byte MIME
 *     validation happens server-side where the client can't fake it, and
 *     (c) there's a single audit-log entry point.
 *   - `react-i18next` → label props. Keeps the component locale-agnostic
 *     so the caller supplies already-translated strings (simpler than
 *     wiring `next-intl` through a client component that may be used in
 *     multiple contexts).
 *   - Terravoa tokens replace `neutral-*` / `brand-*` utilities.
 *   - `useTransition` gates the upload so the pending state plays nicely
 *     with React 19 server actions.
 */

const MAX_MULTI_ITEMS_DEFAULT = 12

interface BaseProps {
  className?: string
  disabled?: boolean
  /** Label shown inside the dropzone, e.g. "Drop an image here…" */
  dropLabel: string
  /** Sub-hint below the drop label, e.g. "JPG, PNG, WebP, GIF — up to 10 MB". */
  hintLabel?: string
  /** Label shown while a file is being uploaded. */
  uploadingLabel: string
  /** aria-label for each "remove image" × button. */
  removeLabel: string
}

interface SingleProps extends BaseProps {
  mode: 'single'
  value: string
  onChange: (nextUrl: string) => void
}

interface MultiProps extends BaseProps {
  mode: 'multi'
  value: string[]
  onChange: (nextUrls: string[]) => void
  maxItems?: number
}

type Props = SingleProps | MultiProps

function validateClientSide(file: File): string | null {
  if (file.size === 0) return 'Empty file.'
  if (file.size > MAX_IMAGE_BYTES) return 'File is larger than 10 MB.'
  // We only do a soft check here — the server re-validates by magic bytes.
  if (!file.type.startsWith('image/')) return 'Unsupported file type.'
  return null
}

export function ProductImageUpload(props: Props) {
  const { className, disabled, dropLabel, hintLabel, uploadingLabel, removeLabel } =
    props
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [, startTransition] = useTransition()

  const isUploading = uploadingCount > 0

  function clearError() {
    setError(null)
  }

  async function uploadOne(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    setUploadingCount((n) => n + 1)
    try {
      const result = await uploadProducerProductImage(fd)
      if (!result.ok) {
        setError(result.error)
        return null
      }
      return result.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.')
      return null
    } finally {
      setUploadingCount((n) => n - 1)
    }
  }

  async function handleFiles(files: FileList | File[]) {
    clearError()
    const arr = Array.from(files)
    if (arr.length === 0) return

    if (props.mode === 'single') {
      const file = arr[0]
      const invalid = validateClientSide(file)
      if (invalid) {
        setError(invalid)
        return
      }
      const url = await uploadOne(file)
      if (!url) return

      // Remove the previous image *after* the new one uploaded, so a failed
      // upload doesn't leave the user with nothing.
      const previous = props.value
      props.onChange(url)
      if (previous) {
        startTransition(() => {
          void deleteProducerProductImage(previous)
        })
      }
      return
    }

    const maxItems = props.maxItems ?? MAX_MULTI_ITEMS_DEFAULT
    const remaining = Math.max(0, maxItems - props.value.length)
    const toUpload = arr.slice(0, remaining)
    const uploaded: string[] = []
    for (const file of toUpload) {
      const invalid = validateClientSide(file)
      if (invalid) {
        setError(invalid)
        continue
      }
      const url = await uploadOne(file)
      if (url) uploaded.push(url)
    }
    if (uploaded.length > 0) {
      props.onChange([...props.value, ...uploaded])
    }
  }

  function openPicker() {
    if (disabled) return
    inputRef.current?.click()
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      void handleFiles(event.target.files)
    }
    event.target.value = ''
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragOver(false)
    if (disabled) return
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      void handleFiles(event.dataTransfer.files)
    }
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (!disabled) setDragOver(true)
  }

  function onDragLeave() {
    setDragOver(false)
  }

  function removeSingle() {
    if (props.mode !== 'single' || !props.value) return
    const previous = props.value
    props.onChange('')
    startTransition(() => {
      void deleteProducerProductImage(previous)
    })
  }

  function removeAt(index: number) {
    if (props.mode !== 'multi') return
    const url = props.value[index]
    if (!url) return
    const next = props.value.filter((_, i) => i !== index)
    props.onChange(next)
    startTransition(() => {
      void deleteProducerProductImage(url)
    })
  }

  const showDropzone = props.mode === 'multi' || !props.value
  const multiFull =
    props.mode === 'multi' &&
    props.value.length >= (props.maxItems ?? MAX_MULTI_ITEMS_DEFAULT)

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        multiple={props.mode === 'multi'}
        className="hidden"
        onChange={onInputChange}
        disabled={disabled || isUploading || multiFull}
      />

      {/* Single-mode preview */}
      {props.mode === 'single' && props.value && (
        <div className="relative mb-3 inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element -- Supabase public URLs are runtime-unknown; next/image needs a configured domain. Swap later if you whitelist the Upstash/Supabase host. */}
          <img
            src={props.value}
            alt=""
            className="h-40 w-40 object-cover rounded-xl border border-outline-variant/30 bg-surface-container-low"
          />
          <button
            type="button"
            onClick={removeSingle}
            disabled={disabled || isUploading}
            aria-label={removeLabel}
            className={cn(
              'absolute -top-2 -right-2 h-7 w-7 rounded-full',
              'bg-surface-container-lowest border border-outline-variant/40 shadow-sm',
              'flex items-center justify-center',
              'hover:bg-error-container hover:border-error hover:text-error',
              'transition-colors',
            )}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {/* Multi-mode preview grid */}
      {props.mode === 'multi' && props.value.length > 0 && (
        <div className="mb-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
          {props.value.map((url, index) => (
            <div key={url + index} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="aspect-square w-full object-cover rounded-lg border border-outline-variant/30 bg-surface-container-low"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled || isUploading}
                aria-label={removeLabel}
                className={cn(
                  'absolute -top-2 -right-2 h-6 w-6 rounded-full',
                  'bg-surface-container-lowest border border-outline-variant/40 shadow-sm',
                  'flex items-center justify-center',
                  'hover:bg-error-container hover:border-error hover:text-error',
                  'transition-colors',
                )}
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </div>
          ))}
        </div>
      )}

      {showDropzone && !multiFull && (
        <div
          onClick={openPicker}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openPicker()
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || isUploading}
          className={cn(
            'group flex flex-col items-center justify-center',
            'rounded-xl border-2 border-dashed px-4 py-8 text-center',
            'cursor-pointer transition-colors',
            dragOver
              ? 'border-secondary bg-secondary-container/25'
              : 'border-outline-variant/50 hover:border-secondary/60 hover:bg-surface-container-low',
            (disabled || isUploading) && 'opacity-60 cursor-wait',
          )}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-on-surface-variant" aria-hidden />
          ) : (
            <Upload
              className="h-5 w-5 text-on-surface-variant group-hover:text-secondary transition-colors"
              aria-hidden
            />
          )}
          <p className="mt-2 font-sans text-sm text-on-surface">
            {isUploading ? uploadingLabel : dropLabel}
          </p>
          {hintLabel && (
            <p className="mt-1 font-sans text-xs text-on-surface-variant">{hintLabel}</p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 font-sans text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
