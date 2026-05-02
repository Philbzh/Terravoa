'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

export type GalleryImage = { src: string; alt: string }

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: GalleryImage[]
  startIndex: number
  onClose: () => void
}) {
  const [active, setActive] = useState(startIndex)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose])

  if (!mounted) return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9998] bg-black/92 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors z-10"
        aria-label="Close"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + images.length) % images.length) }}
          className="absolute left-5 text-white/50 hover:text-white transition-colors z-10 p-2"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} strokeWidth={1.3} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={active}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-3xl mx-16 aspect-square"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[active].src}
          alt={images[active].alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 90vw, 700px"
          unoptimized={isExternalUnoptimizedSrc(images[active].src)}
          priority
        />
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % images.length) }}
          className="absolute right-5 text-white/50 hover:text-white transition-colors z-10 p-2"
          aria-label="Next image"
        >
          <ChevronRight size={28} strokeWidth={1.3} />
        </button>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setActive(i) }}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                i === active ? 'bg-white scale-125' : 'bg-white/35',
              )}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.2em] text-white/40">
          {active + 1} / {images.length}
        </p>
      )}
    </motion.div>,
    document.body,
  )
}

// ── Main gallery ──────────────────────────────────────────────────────────────

export function ProductImageGallery({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const single = images.length === 1

  return (
    <div className="relative">
      {/* Main carousel */}
      <div
        ref={emblaRef}
        className={cn(
          'overflow-hidden rounded-2xl bg-surface-container-lowest',
          !single && 'cursor-grab active:cursor-grabbing',
        )}
      >
        <div className="flex">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square flex-[0_0_100%] min-w-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
                unoptimized={isExternalUnoptimizedSrc(img.src)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zoom button */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.15em] transition-colors duration-200"
        aria-label="View full size"
      >
        <ZoomIn size={12} strokeWidth={1.8} />
        Zoom
      </button>

      {/* Prev / Next arrows — only when multiple images */}
      {!single && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-sm shadow flex items-center justify-center text-on-surface hover:bg-surface transition-colors disabled:opacity-25"
            aria-label="Previous image"
          >
            <ChevronLeft size={17} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={selectedIndex === images.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-sm shadow flex items-center justify-center text-on-surface hover:bg-surface transition-colors disabled:opacity-25"
            aria-label="Next image"
          >
            <ChevronRight size={17} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {!single && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                'relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200',
                i === selectedIndex
                  ? 'ring-2 ring-secondary ring-offset-1 opacity-100'
                  : 'opacity-50 hover:opacity-80',
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="64px"
                unoptimized={isExternalUnoptimizedSrc(img.src)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot indicators (single row, shown when multiple images, no thumbnail strip on mobile) */}
      {!single && (
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                i === selectedIndex ? 'bg-primary scale-125' : 'bg-outline-variant',
              )}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            startIndex={selectedIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
