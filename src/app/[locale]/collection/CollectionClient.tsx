'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Product, Producer } from '@/data/demo'
import { ProductCard } from '@/components/ui/ProductCard'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { useTranslations } from 'next-intl'
import {
  CATEGORY_TO_KEY,
  REGION_NAME_TO_SLUG,
} from '@/lib/i18n/collection-labels'
import { cn } from '@/lib/utils'

function regionLabel(p: Product, producers: Producer[]): string {
  const pr = producers.find((x) => x.slug === p.producerSlug)
  return pr?.region ?? p.origin
}

function matchesSearch(p: Product, producers: Producer[], q: string): boolean {
  if (!q.trim()) return true
  const s = q.trim().toLowerCase()
  return (
    p.name.toLowerCase().includes(s) ||
    p.origin.toLowerCase().includes(s) ||
    p.producerName.toLowerCase().includes(s) ||
    p.category.toLowerCase().includes(s) ||
    regionLabel(p, producers).toLowerCase().includes(s)
  )
}

type Props = {
  products: Product[]
  producers: Producer[]
}

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const copy = [...products]
  if (sort === 'price-asc') return copy.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') return copy.sort((a, b) => b.price - a.price)
  if (sort === 'name-asc') return copy.sort((a, b) => a.name.localeCompare(b.name))
  return copy
}

interface Suggestion {
  type: 'product' | 'producer'
  label: string
  sub?: string
  value: string
}

function buildSuggestions(products: Product[], q: string): Suggestion[] {
  if (q.trim().length < 2) return []
  const s = q.trim().toLowerCase()

  const productSuggestions: Suggestion[] = products
    .filter((p) =>
      p.name.toLowerCase().includes(s) ||
      p.producerName.toLowerCase().includes(s) ||
      p.origin.toLowerCase().includes(s),
    )
    .slice(0, 4)
    .map((p) => ({ type: 'product', label: p.name, sub: p.producerName, value: p.name }))

  const seenProducers = new Set<string>()
  const producerSuggestions: Suggestion[] = []
  for (const p of products) {
    if (!seenProducers.has(p.producerName) && p.producerName.toLowerCase().includes(s)) {
      seenProducers.add(p.producerName)
      producerSuggestions.push({ type: 'producer', label: p.producerName, value: p.producerName })
    }
    if (producerSuggestions.length >= 2) break
  }

  return [...productSuggestions, ...producerSuggestions].slice(0, 6)
}

export function CollectionClient({ products, producers }: Props) {
  const t = useTranslations('collectionPage')
  const tCategories = useTranslations('collectionPage.categories')
  const tRegionCatalog = useTranslations('regions.catalog')
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const labelCategory = (cat: string) => {
    if (cat === 'All') return tCategories('all')
    const key = CATEGORY_TO_KEY[cat]
    if (key && tCategories.has(key)) return tCategories(key)
    return cat
  }

  const labelRegion = (reg: string) => {
    if (reg === 'All') return tCategories('all')
    const slug = REGION_NAME_TO_SLUG[reg]
    const nameKey = slug ? `${slug}.name` : ''
    if (slug && tRegionCatalog.has(nameKey)) return tRegionCatalog(nameKey)
    return reg
  }

  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('category') ?? 'All')
  const [activeRegion, setActiveRegion] = useState(() => searchParams.get('region') ?? 'All')
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '')
  const [sort, setSort] = useState<SortKey>(() => (searchParams.get('sort') as SortKey) ?? 'default')
  const [showAdvanced, setShowAdvanced] = useState(() => (searchParams.get('region') ?? 'All') !== 'All')

  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => buildSuggestions(products, search), [products, search])

  useEffect(() => {
    setActiveIndex(-1)
  }, [search])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Keep controls in sync with URL when navigating browser history.
  useEffect(() => {
    setActiveCategory(searchParams.get('category') ?? 'All')
    setActiveRegion(searchParams.get('region') ?? 'All')
    setSearch(searchParams.get('q') ?? '')
    setSort((searchParams.get('sort') as SortKey) ?? 'default')
  }, [searchParams])

  useEffect(() => {
    if (activeRegion !== 'All') setShowAdvanced(true)
  }, [activeRegion])

  function updateUrl(params: { category?: string; region?: string; q?: string; sort?: string }) {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([k, v]) => {
      if (!v || v === 'All' || v === 'default' || v === '') sp.delete(k)
      else sp.set(k, v)
    })
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const applySuggestion = useCallback((value: string) => {
    setSearch(value)
    setShowDropdown(false)
    setActiveIndex(-1)
    updateUrl({ category: activeCategory, region: activeRegion, q: value, sort })
  }, [activeCategory, activeRegion, sort]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      applySuggestion(suggestions[activeIndex].value)
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveIndex(-1)
    }
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products],
  )

  const regions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(products.map((p) => regionLabel(p, producers))),
      ).sort((a, b) => a.localeCompare(b)),
    ],
    [products, producers],
  )

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) return false
      if (activeRegion !== 'All' && regionLabel(p, producers) !== activeRegion) return false
      return matchesSearch(p, producers, search)
    })
    return sortProducts(base, sort)
  }, [activeCategory, activeRegion, search, sort, products, producers])

  return (
    <PageContainer>
      <SectionHeader
        kicker={t('kicker')}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 md:p-6 mb-8 md:mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 md:gap-5 items-start">
          <div ref={searchContainerRef} className="relative">
            <label htmlFor="collection-search" className="sr-only">
              {t('searchLabel')}
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
              size={18}
              strokeWidth={1.5}
            />
            <input
              id="collection-search"
              type="search"
              value={search}
              onChange={(e) => {
                const v = e.target.value
                setSearch(v)
                setShowDropdown(v.trim().length >= 2)
                updateUrl({ category: activeCategory, region: activeRegion, q: v, sort })
              }}
              onFocus={() => {
                if (search.trim().length >= 2 && suggestions.length > 0) setShowDropdown(true)
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              autoComplete="off"
              className="w-full rounded-full border border-outline-variant/25 bg-surface-container-low pl-11 pr-5 py-3 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/55 focus:outline-none focus:ring-2 focus:ring-secondary/25 focus:border-secondary/30 transition-shadow"
            />

            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-surface rounded-xl shadow-lg border border-outline-variant/15 overflow-hidden">
                {suggestions.some((s) => s.type === 'product') && (
                  <div className="px-4 pt-3 pb-1">
                    <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-on-surface-variant/60">
                      {t('suggestionsProducts')}
                    </p>
                  </div>
                )}
                {suggestions.map((s, i) => {
                  const isFirst = i === 0 || (s.type !== suggestions[i - 1].type)
                  const showProducerHeader = s.type === 'producer' && isFirst
                  return (
                    <div key={`${s.type}-${s.value}`}>
                      {showProducerHeader && suggestions.some((x) => x.type === 'product') && (
                        <div className="px-4 pt-3 pb-1">
                          <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-on-surface-variant/60">
                            {t('suggestionsProducers')}
                          </p>
                        </div>
                      )}
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applySuggestion(s.value)}
                        className={cn(
                          'w-full text-left px-4 py-2.5 flex flex-col gap-0.5 hover:bg-surface-container-low transition-colors',
                          activeIndex === i && 'bg-surface-container-low',
                        )}
                      >
                        <span className="font-sans text-sm text-on-surface">{s.label}</span>
                        {s.sub && (
                          <span className="font-sans text-xs text-on-surface-variant/70">{s.sub}</span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between lg:justify-end">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant/25 bg-surface px-4 py-2 font-sans text-xs uppercase tracking-[0.12em] text-on-surface-variant hover:text-primary hover:border-primary/35 transition-colors"
            >
              <SlidersHorizontal size={14} strokeWidth={1.6} />
              {t('moreFilters')}
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-sans text-xs text-on-surface-variant uppercase tracking-[0.1em]">
                {t('sortLabel')}
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => { const s = e.target.value as SortKey; setSort(s); updateUrl({ category: activeCategory, region: activeRegion, q: search, sort: s }) }}
                className="font-sans text-xs bg-surface border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary/30 transition-colors"
              >
                <option value="default">{t('sortNewest')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="name-asc">{t('sortNameAsc')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="font-sans text-[11px] text-on-surface-variant mb-2">{t('categoryLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setActiveCategory(cat); updateUrl({ category: cat, region: activeRegion, q: search, sort }) }}
                className={cn(
                  'font-sans text-xs uppercase tracking-[0.12em] px-4 py-2 rounded-full transition-all duration-300',
                  activeCategory === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/15',
                )}
              >
                {labelCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-outline-variant/15">
            <p className="font-sans text-[11px] text-on-surface-variant mb-2">{t('regionLabel')}</p>
            <div className="flex flex-wrap gap-2">
              {regions.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => { setActiveRegion(reg); updateUrl({ category: activeCategory, region: reg, q: search, sort }) }}
                  className={cn(
                    'font-sans text-xs uppercase tracking-[0.12em] px-4 py-2 rounded-full transition-all duration-300 border border-transparent',
                    activeRegion === reg
                      ? 'bg-secondary/15 text-secondary border-secondary/25'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container-high border-outline-variant/15',
                  )}
                >
                  {labelRegion(reg)}
                </button>
              ))}
            </div>
          </div>
        )}

        {(activeCategory !== 'All' || activeRegion !== 'All' || search.trim()) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-outline-variant/20 px-3 py-1.5 font-sans text-xs text-on-surface-variant">
                {t('activeSearch', { term: search })}
              </span>
            )}
            {activeCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-outline-variant/20 px-3 py-1.5 font-sans text-xs text-on-surface-variant">
                {t('activeCategory', { category: labelCategory(activeCategory) })}
              </span>
            )}
            {activeRegion !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-outline-variant/20 px-3 py-1.5 font-sans text-xs text-on-surface-variant">
                {t('activeRegion', { region: labelRegion(activeRegion) })}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All')
                setActiveRegion('All')
                setSearch('')
                setSort('default')
                setShowAdvanced(false)
                updateUrl({})
              }}
              className="inline-flex items-center gap-1 rounded-full border border-outline-variant/25 px-3 py-1.5 font-sans text-xs text-on-surface-variant hover:text-primary hover:border-primary/35 transition-colors"
            >
              <X size={12} strokeWidth={1.8} />
              {t('resetFilters')}
            </button>
          </div>
        )}
      </section>

      <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-4">
        <p className="font-sans text-xs text-on-surface-variant">
          {filtered.length === 1
            ? t('productCount', { count: filtered.length })
            : t('productsCount', { count: filtered.length })}
        </p>
        <p className="font-sans text-xs text-on-surface-variant">{t('refinedResults')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {filtered.map((product, i) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.32) }}
          >
            <Link href={`/collection/${product.slug}`}>
              <ProductCard
                slug={product.slug}
                name={product.name}
                price={`€${(product.price / 100).toFixed(2)}`}
                priceRaw={product.price}
                origin={product.origin}
                producer={product.producerName}
                imageSrc={product.imageSrc}
                imageAlt={product.imageAlt}
                badge={product.badge}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="font-serif text-2xl text-primary/60">{t('noProductsTitle')}</p>
          <p className="font-sans text-sm text-on-surface-variant max-w-xs mx-auto">
            {t('noProductsHint')}
          </p>
          <button
            type="button"
            onClick={() => { setActiveCategory('All'); setActiveRegion('All'); setSearch(''); updateUrl({}) }}
            className="font-sans text-xs uppercase tracking-[0.15em] text-secondary hover:text-primary transition-colors underline underline-offset-4"
          >
            {t('clearAllFilters')}
          </button>
        </div>
      )}
    </PageContainer>
  )
}
