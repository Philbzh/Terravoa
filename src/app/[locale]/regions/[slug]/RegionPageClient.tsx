'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowLeft, ArrowRight, MapPin, ExternalLink, Send, CheckCircle } from 'lucide-react'
import { useRegionLabels } from '@/lib/i18n/use-region-labels'
import { ProductCard } from '@/components/ui/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import type { Region, Producer, Product, Story, SelectedAddress, CommunityDiscovery } from '@/data/demo'

/* ─── Section kicker (thin line + uppercase label) ─── */
function SectionKicker({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-5 mb-6 ${className}`}>
      <div className="h-px w-12 bg-secondary shrink-0" />
      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-secondary font-semibold">
        {label}
      </span>
    </div>
  )
}

/* ─── Hero ─── */
function RegionHero({ region }: { region: Region }) {
  const tRegions = useTranslations('regions')
  const labels = useRegionLabels(region.slug, {
    name: region.name,
    specialty: region.specialty,
  })
  const paragraphs = region.longDescription.split('\n\n')
  const introParagraph = paragraphs[0]

  return (
    <>
      {/* Full-bleed hero image */}
      <div className="relative h-[50vh] md:h-[65vh] min-h-[420px] max-h-[700px] bg-primary">
        <Image
          src={region.imageSrc}
          alt={region.imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={isExternalUnoptimizedSrc(region.imageSrc)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-28 left-6 md:left-16 z-10">
          <Link
            href="/regions"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-sans text-xs uppercase tracking-[0.12em] transition-colors"
          >
            <ArrowLeft size={13} />
            {tRegions('title')}
          </Link>
        </div>

        {/* Title overlay */}
        <motion.div
          className="absolute bottom-12 md:bottom-16 left-6 md:left-16 right-6 md:right-16 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-secondary shrink-0" />
            <p className="text-white/55 font-sans text-[10px] uppercase tracking-[0.28em]">
              {labels.specialty}
            </p>
          </div>
          <h1
            className="font-serif text-white leading-[0.9] max-w-3xl"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            {labels.name}
          </h1>
        </motion.div>
      </div>

      {/* Editorial intro */}
      <motion.div
        className="px-6 md:px-16 max-w-3xl mx-auto py-16 md:py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
      >
        <p className="font-serif italic text-xl md:text-2xl text-primary/80 leading-relaxed mb-8">
          {region.description}
        </p>
        <p className="font-sans text-base text-on-surface-variant leading-[1.85] first-letter:text-[4.5rem] first-letter:font-serif first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]">
          {introParagraph}
        </p>
      </motion.div>
    </>
  )
}

/* ─── Producers section ─── */
function ProducersSection({ producers, regionName }: { producers: Producer[]; regionName: string }) {
  if (producers.length === 0) return null

  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionKicker label="Behind every speciality, a producer" />
        <h2
          className="font-serif text-primary leading-[0.95] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Producers from {regionName}
        </h2>
        <p className="font-sans text-sm text-on-surface-variant mb-12 max-w-xl">
          Each producer on Terravoa is personally vetted. Click to discover their story, philosophy, and products.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {producers.map((producer, i) => (
          <motion.div
            key={producer.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={`/producers/${producer.slug}`}
              className="group block rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
            >
              <div className="flex items-start gap-5 mb-5">
                <div className="w-16 h-16 rounded-full bg-surface-container-high overflow-hidden relative shrink-0">
                  <Image
                    src={producer.imageSrc}
                    alt={producer.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                    unoptimized={isExternalUnoptimizedSrc(producer.imageSrc)}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg text-primary group-hover:text-secondary transition-colors leading-tight mb-1">
                    {producer.name}
                  </h3>
                  <p className="font-sans text-[11px] text-on-surface-variant/60 uppercase tracking-wider">
                    {producer.region} &middot; {producer.country}
                  </p>
                </div>
              </div>
              <p className="font-serif italic text-sm text-on-surface-variant leading-relaxed mb-4">
                {producer.tagline}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {producer.badges.slice(0, 3).map((badge) => (
                    <Badge key={badge} label={badge} variant="producer" />
                  ))}
                </div>
                <ArrowRight size={14} className="text-on-surface-variant/40 group-hover:text-secondary transition-colors shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Traditions & Flavours section ─── */
function TraditionsSection({ traditions, regionName }: { traditions: Region['traditions']; regionName: string }) {
  if (!traditions || traditions.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-surface-container">
      <div className="px-6 md:px-16 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 md:mb-18"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionKicker label="Traditions & Flavours" className="justify-center" />
          <h2
            className="font-serif text-primary leading-[0.95]"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
          >
            The art of living in {regionName}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {traditions.map((tradition, i) => (
            <motion.div
              key={tradition.title}
              className="relative rounded-2xl bg-surface-container-lowest border border-outline-variant/15 p-8 hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {tradition.icon && (
                <span className="text-3xl mb-4 block">{tradition.icon}</span>
              )}
              <h3 className="font-serif text-lg text-primary mb-3 leading-tight">
                {tradition.title}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {tradition.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Products section ─── */
function ProductsSection({ products, regionName }: { products: Product[]; regionName: string }) {
  if (products.length === 0) return null

  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionKicker label={`From ${regionName}`} />
        <h2
          className="font-serif text-primary leading-[0.95] mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Products from {regionName}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product, i) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
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
    </section>
  )
}

/* ─── Stories / Editorial section ─── */
function StoriesSection({ stories, regionName }: { stories: Story[]; regionName: string }) {
  if (stories.length === 0) return null

  return (
    <section className="px-6 md:px-16 max-w-7xl mx-auto pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionKicker label="Editorial" />
        <h2
          className="font-serif text-primary leading-[0.95] mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Stories from {regionName}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, i) => (
          <motion.div
            key={story.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link
              href={`/stories/${story.slug}`}
              className="group block rounded-2xl overflow-hidden border border-outline-variant/10 hover:shadow-lg transition-shadow duration-400"
            >
              <div className="aspect-[16/9] relative bg-surface-container-high">
                <Image
                  src={story.imageSrc}
                  alt={story.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={isExternalUnoptimizedSrc(story.imageSrc)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-7 bg-surface-container-lowest">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-secondary font-sans text-[10px] uppercase tracking-[0.15em] font-medium">
                    {story.readTime} read
                  </span>
                  <span className="text-on-surface-variant/30">&bull;</span>
                  <span className="text-on-surface-variant/50 font-sans text-[10px] uppercase tracking-[0.1em]">
                    {new Date(story.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-primary group-hover:text-secondary transition-colors leading-tight mb-2">
                  {story.title}
                </h3>
                <p className="text-on-surface-variant/70 font-sans text-sm line-clamp-2 leading-relaxed">
                  {story.excerpt}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Selected Addresses section ─── */
const kindLabel: Record<string, string> = {
  agriturismo: 'Agriturismo',
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  experience: 'Experience',
  bakery: 'Bakery',
  vineyard: 'Vineyard',
}
const kindEmoji: Record<string, string> = {
  agriturismo: '🏡',
  restaurant: '🍽️',
  hotel: '🏨',
  experience: '🌿',
  bakery: '🥖',
  vineyard: '🍇',
}

function SelectedAddressesSection({
  addresses,
  regionName,
}: {
  addresses: SelectedAddress[]
  regionName: string
}) {
  if (addresses.length === 0) return null

  return (
    <section className="py-20 md:py-28 bg-surface-container">
      <div className="px-6 md:px-16 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionKicker label="Our selected addresses" className="justify-center" />
          <h2
            className="font-serif text-primary leading-[0.95] mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
          >
            Where to eat, sleep & experience in {regionName}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-2xl mx-auto">
            Personally visited and vetted by the Terravoa team. These are the places we return to ourselves.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((addr, i) => (
            <motion.div
              key={`${addr.name}-${i}`}
              className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/15 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-400"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Image */}
              {addr.imageSrc && (
                <div className="aspect-[16/10] relative bg-surface-container-high">
                  <Image
                    src={addr.imageSrc}
                    alt={addr.imageAlt || addr.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={isExternalUnoptimizedSrc(addr.imageSrc)}
                  />
                </div>
              )}
              <div className="p-7">
                {/* Category chip */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{kindEmoji[addr.kind] ?? '📍'}</span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-secondary font-semibold">
                    {kindLabel[addr.kind] ?? addr.kind}
                  </span>
                </div>

                <h3 className="font-serif text-lg text-primary leading-tight mb-2">
                  {addr.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={12} className="text-on-surface-variant/50 shrink-0" />
                  <span className="font-sans text-xs text-on-surface-variant/60">
                    {addr.location}
                  </span>
                </div>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
                  {addr.description}
                </p>
                {addr.website && (
                  <a
                    href={addr.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-secondary hover:text-primary transition-colors"
                  >
                    Visit website
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Community Discoveries section ─── */
function CommunityDiscoveriesSection({
  regionSlug,
  regionName,
  initialDiscoveries,
}: {
  regionSlug: string
  regionName: string
  initialDiscoveries: CommunityDiscovery[]
}) {
  const [discoveries, setDiscoveries] = useState(initialDiscoveries)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [text, setText] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      try {
        const res = await fetch('/api/community-discovery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            regionSlug,
            authorName: name.trim(),
            authorLocation: location.trim() || undefined,
            text: text.trim(),
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Something went wrong.')
          return
        }
        setSubmitted(true)
        setName('')
        setLocation('')
        setText('')
      } catch {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <section className="px-6 md:px-16 max-w-5xl mx-auto py-20 md:py-28">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionKicker label="Community discoveries" className="justify-center" />
        <h2
          className="font-serif text-primary leading-[0.95] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}
        >
          Your hidden gems in {regionName}
        </h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-2xl mx-auto">
          Been to {regionName}? Share a place, a producer, or an experience that others shouldn&apos;t miss.
          Every submission is reviewed before publishing.
        </p>
      </motion.div>

      {/* Approved discoveries */}
      {discoveries.length > 0 && (
        <div className="space-y-6 mb-16">
          {discoveries.map((d, i) => (
            <motion.blockquote
              key={d.id}
              className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-7"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <p className="font-serif text-base text-on-surface leading-relaxed mb-4 italic">
                &ldquo;{d.body}&rdquo;
              </p>
              <footer className="flex items-center gap-2 text-on-surface-variant/60 font-sans text-xs">
                <span className="font-semibold text-primary/80">{d.authorName}</span>
                {d.authorLocation && (
                  <>
                    <span>&middot;</span>
                    <span>{d.authorLocation}</span>
                  </>
                )}
                <span>&middot;</span>
                <time>
                  {new Date(d.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </time>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      )}

      {/* Submission form */}
      <motion.div
        className="rounded-2xl border border-outline-variant/15 bg-surface-container p-8 md:p-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle size={36} className="text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl text-primary mb-2">Thank you!</h3>
            <p className="font-sans text-sm text-on-surface-variant">
              Your discovery has been submitted for review. It will appear once approved by our team.
            </p>
            <button
              type="button"
              className="mt-6 font-sans text-sm text-secondary hover:text-primary transition-colors underline underline-offset-2"
              onClick={() => setSubmitted(false)}
            >
              Share another discovery
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-serif text-lg text-primary mb-2">
              Share your discovery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cd-name" className="block font-sans text-xs text-on-surface-variant mb-1.5">
                  Your name *
                </label>
                <input
                  id="cd-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sophie"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                />
              </div>
              <div>
                <label htmlFor="cd-location" className="block font-sans text-xs text-on-surface-variant mb-1.5">
                  Where you&apos;re from
                </label>
                <input
                  id="cd-location"
                  type="text"
                  maxLength={60}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Berlin"
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-2.5 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cd-text" className="block font-sans text-xs text-on-surface-variant mb-1.5">
                Your discovery * <span className="text-on-surface-variant/40">(20–800 characters)</span>
              </label>
              <textarea
                id="cd-text"
                required
                minLength={20}
                maxLength={800}
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tell us about a place, producer, or experience you loved…"
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition resize-none"
              />
              <div className="text-right font-sans text-[10px] text-on-surface-variant/40 mt-1">
                {text.length}/800
              </div>
            </div>
            {error && (
              <p className="font-sans text-sm text-error">{error}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-secondary text-on-secondary px-7 py-2.5 font-sans text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 transition"
            >
              <Send size={14} />
              {isPending ? 'Submitting…' : 'Submit discovery'}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  )
}

/* ─── Full page composition ─── */
export function RegionPageClient({
  region,
  producers,
  products,
  stories,
  communityDiscoveries,
}: {
  region: Region
  producers: Producer[]
  products: Product[]
  stories: Story[]
  communityDiscoveries: CommunityDiscovery[]
}) {
  return (
    <div className="pb-10">
      {/* ── Hero + editorial intro ── */}
      <RegionHero region={region} />

      {/* ── Producers: the heart of the page ── */}
      <ProducersSection producers={producers} regionName={region.name} />

      {/* ── Traditions & Flavours ── */}
      <TraditionsSection traditions={region.traditions} regionName={region.name} />

      {/* ── Products from this region ── */}
      <ProductsSection products={products} regionName={region.name} />

      {/* ── Selected Addresses ── */}
      <SelectedAddressesSection
        addresses={region.selectedAddresses ?? []}
        regionName={region.name}
      />

      {/* ── Editorial stories ── */}
      <StoriesSection stories={stories} regionName={region.name} />

      {/* ── Community Discoveries ── */}
      <CommunityDiscoveriesSection
        regionSlug={region.slug}
        regionName={region.name}
        initialDiscoveries={communityDiscoveries}
      />
    </div>
  )
}
