'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import type { Region, Producer, Product, Story } from '@/data/demo'

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
            Origins
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
              {region.specialty}
            </p>
          </div>
          <h1
            className="font-serif text-white leading-[0.9] max-w-3xl"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
          >
            {region.name}
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

/* ─── Full page composition ─── */
export function RegionPageClient({
  region,
  producers,
  products,
  stories,
}: {
  region: Region
  producers: Producer[]
  products: Product[]
  stories: Story[]
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

      {/* ── Editorial stories ── */}
      <StoriesSection stories={stories} regionName={region.name} />

      {/* ── Future: Selected Addresses (curated agriturismo, restaurants) ── */}
      {/* ── Future: Community Discoveries (user-submitted, curated stories) ── */}
    </div>
  )
}
