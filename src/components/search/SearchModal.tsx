'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { useSearchStore } from '@/lib/store/search-store'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────────────

type ProductResult = {
  slug: string; name: string; origin: string
  price: number; producerName: string; imageSrc: string | null
}
type ProducerResult = {
  slug: string; name: string; region: string
  country: string; specialty: string; imageSrc: string | null
}
type RegionResult = {
  slug: string; name: string; country: string
  specialty: string; imageSrc: string | null
}
type SearchResults = {
  products: ProductResult[]
  producers: ProducerResult[]
  regions: RegionResult[]
}
type FlatResult = { href: string; key: string }

// ── Debounce hook ────────────────────────────────────────────────────────────

function useDebouncedValue<T>(value: T, delay = 280): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────

function Thumb({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
        <Image
          src={src}
          alt={name}
          width={44}
          height={44}
          className="object-cover w-full h-full"
          unoptimized={false}
        />
      </div>
    )
  }
  return (
    <div className="w-11 h-11 rounded-lg shrink-0 bg-surface-container-high flex items-center justify-center">
      <span className="font-serif text-lg text-on-surface-variant/40">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

// ── Result item ───────────────────────────────────────────────────────────────

function ResultItem({
  name,
  meta,
  imageSrc,
  href,
  active,
  onNavigate,
}: {
  name: string
  meta: string
  imageSrc: string | null
  href: string
  active: boolean
  onNavigate: (href: string) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onNavigate(href)}
      className={cn(
        'w-full flex items-center gap-3 px-5 py-3 text-left transition-colors duration-100 group',
        active ? 'bg-surface-container-low' : 'hover:bg-surface-container-lowest',
      )}
    >
      <Thumb src={imageSrc} name={name} />
      <div className="flex-1 min-w-0">
        <p className="font-serif text-sm text-on-surface truncate">{name}</p>
        <p className="font-sans text-[11px] text-on-surface-variant truncate mt-0.5">{meta}</p>
      </div>
      <ArrowRight
        size={13}
        strokeWidth={1.5}
        className={cn(
          'shrink-0 transition-all duration-150',
          active
            ? 'text-secondary opacity-100 translate-x-0'
            : 'text-on-surface-variant/30 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
        )}
      />
    </button>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="px-5 pt-4 pb-1.5 font-sans text-[9px] uppercase tracking-[0.28em] text-on-surface-variant/50">
      {label}
    </p>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function SearchModal() {
  const { isOpen, close, toggle } = useSearchStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ products: [], producers: [], regions: [] })
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebouncedValue(query)

  // Fetch on query change
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({ products: [], producers: [], regions: [] })
      setActiveIndex(-1)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data: SearchResults) => {
        if (!cancelled) {
          setResults(data)
          setActiveIndex(-1)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedQuery])

  // Reset + focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults({ products: [], producers: [], regions: [] })
      setActiveIndex(-1)
      const id = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  // Global Cmd+K shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  // Flatten all results for keyboard nav
  const flat: FlatResult[] = [
    ...results.products.map((p) => ({ href: `/collection/${p.slug}`, key: `product-${p.slug}` })),
    ...results.producers.map((p) => ({ href: `/producers/${p.slug}`, key: `producer-${p.slug}` })),
    ...results.regions.map((r) => ({ href: `/regions/${r.slug}`, key: `region-${r.slug}` })),
  ]

  const navigate = useCallback((href: string) => {
    close()
    router.push(href as Parameters<typeof router.push>[0])
  }, [close, router])

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        close()
        break
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flat.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        if (activeIndex >= 0 && flat[activeIndex]) {
          navigate(flat[activeIndex].href)
        }
        break
    }
  }

  const hasQuery = debouncedQuery.length >= 2
  const hasResults = flat.length > 0

  let flatIdx = 0
  function nextIdx() { return flatIdx++ }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            key="search-panel"
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32, mass: 0.65 }}
            className="fixed top-[8vh] left-1/2 -translate-x-1/2 z-[61] w-full max-w-2xl px-4"
          >
            <div className="bg-surface rounded-2xl shadow-2xl border border-outline-variant/20 overflow-hidden">

              {/* Search input row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/10">
                <Search size={17} strokeWidth={1.5} className="text-on-surface-variant/60 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search products, producers, regions…"
                  className="flex-1 bg-transparent font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none"
                  aria-label="Search"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-[1.5px] border-secondary/25 border-t-secondary rounded-full shrink-0"
                  />
                )}
                <button
                  type="button"
                  onClick={close}
                  className="text-on-surface-variant/40 hover:text-on-surface transition-colors shrink-0"
                  aria-label="Close search"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Results area */}
              <div className="max-h-[58vh] overflow-y-auto overscroll-contain">

                {/* Idle state */}
                {!hasQuery && (
                  <div className="px-5 py-12 text-center">
                    <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-on-surface-variant/35">
                      Start typing to search
                    </p>
                  </div>
                )}

                {/* No results */}
                {hasQuery && !hasResults && !loading && (
                  <div className="px-5 py-12 text-center">
                    <p className="font-serif text-on-surface-variant text-lg mb-1.5">
                      No results for &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <p className="font-sans text-xs text-on-surface-variant/45">
                      Try a producer name, region, or product type
                    </p>
                  </div>
                )}

                {/* Grouped results */}
                {hasResults && (
                  <div className="pb-2">
                    {results.products.length > 0 && (
                      <>
                        <SectionLabel label="Products" />
                        {results.products.map((p) => {
                          const idx = nextIdx()
                          return (
                            <ResultItem
                              key={`product-${p.slug}`}
                              name={p.name}
                              meta={[p.origin, p.producerName, `€${(p.price / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`].filter(Boolean).join(' · ')}
                              imageSrc={p.imageSrc}
                              href={`/collection/${p.slug}`}
                              active={idx === activeIndex}
                              onNavigate={navigate}
                            />
                          )
                        })}
                      </>
                    )}

                    {results.producers.length > 0 && (
                      <>
                        <SectionLabel label="Producers" />
                        {results.producers.map((p) => {
                          const idx = nextIdx()
                          return (
                            <ResultItem
                              key={`producer-${p.slug}`}
                              name={p.name}
                              meta={[p.region, p.country].filter(Boolean).join(', ')}
                              imageSrc={p.imageSrc}
                              href={`/producers/${p.slug}`}
                              active={idx === activeIndex}
                              onNavigate={navigate}
                            />
                          )
                        })}
                      </>
                    )}

                    {results.regions.length > 0 && (
                      <>
                        <SectionLabel label="Regions" />
                        {results.regions.map((r) => {
                          const idx = nextIdx()
                          return (
                            <ResultItem
                              key={`region-${r.slug}`}
                              name={r.name}
                              meta={r.specialty}
                              imageSrc={r.imageSrc}
                              href={`/regions/${r.slug}`}
                              active={idx === activeIndex}
                              onNavigate={navigate}
                            />
                          )
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer hints */}
              <div className="px-5 py-2.5 border-t border-outline-variant/10 flex items-center justify-between">
                <span className="font-sans text-[10px] text-on-surface-variant/35 tracking-wide">
                  ↑↓ navigate &nbsp;·&nbsp; ↵ open &nbsp;·&nbsp; esc close
                </span>
                <kbd className="font-sans text-[10px] text-on-surface-variant/30 tracking-wide">
                  ⌘K
                </kbd>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
