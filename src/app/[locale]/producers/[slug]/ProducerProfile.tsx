'use client'

import { useRef, useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import type { Producer, Product, Story } from '@/data/demo'
import { isExternalUnoptimizedSrc } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProducerTrustBadges } from '@/components/ui/ProducerTrustBadges'

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-progress bar (thin terracotta line at the very top)
// ─────────────────────────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-secondary origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated count-up number
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const steps = 40
    const duration = 1400
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// 3-D tilt wrapper — tracks mouse within the card
// ─────────────────────────────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 250, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 250, damping: 20 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div className="perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
interface ProducerProfileProps {
  producer: Producer
  products: Product[]
  featureStory?: Story | null
}

export function ProducerProfile({ producer, products, featureStory }: ProducerProfileProps) {
  const { scrollY } = useScroll()

  // Hero parallax
  const heroImgY   = useTransform(scrollY, [0, 700], [0, 220])
  const heroTextY  = useTransform(scrollY, [0, 500], [0, 70])
  const heroOpacity = useTransform(scrollY, [0, 380], [1, 0])

  // Story content
  const bodySource    = featureStory?.body ?? producer.story
  const allParas      = bodySource.split('\n\n').filter(Boolean)
  const openingParas  = allParas.slice(0, 2)
  const restParas     = allParas.slice(2)
  const storyHeadline = featureStory?.title ?? producer.storyHeadline
  const heroSrc       = producer.heroImageSrc || producer.imageSrc
  const leadSrc       = featureStory?.imageSrc ?? producer.imageSrc
  const leadAlt       = featureStory?.imageAlt ?? producer.imageAlt
  const curatedProducts = products.slice(0, 3)

  return (
    <div className="bg-surface">
      <ScrollProgress />

      {/* ════════════════════════════════════════════════════════════════════
          HERO — full-viewport parallax
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden">

        {/* Parallax image */}
        <motion.div className="absolute inset-0 scale-[1.18]" style={{ y: heroImgY }}>
          <Image
            src={heroSrc}
            alt={producer.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            unoptimized={isExternalUnoptimizedSrc(heroSrc)}
          />
        </motion.div>

        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#182a1b]/95 via-[#182a1b]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#182a1b]/40 to-transparent" />

        {/* Hero text — also parallaxes slightly slower */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-16 max-w-7xl mx-auto left-0 right-0"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.span
            className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.3em] text-secondary mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MapPin size={11} strokeWidth={1.5} />
            {producer.region}, {producer.country}
          </motion.span>

          <motion.h1
            className="font-serif text-[clamp(3.5rem,10vw,9rem)] text-white leading-[0.88] mb-6 max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {producer.name}
          </motion.h1>

          <motion.p
            className="font-sans text-base md:text-lg text-white/65 font-light italic max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            {producer.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            {producer.badges.map((badge) => (
              <span
                key={badge}
                className="font-sans text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-white/20 text-white/75 backdrop-blur-sm bg-white/5"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-1.5"
          style={{ opacity: heroOpacity }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/35 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
            Scroll
          </span>
          <ChevronDown size={14} className="text-white/35" strokeWidth={1.5} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          STATS STRIP — dark bar with animated counters
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary relative overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-white/10">
            {[
              { label: 'Based in',    value: producer.region,      isNum: false },
              { label: 'Established', value: producer.established,  isNum: /^\d+$/.test(producer.established ?? '') },
              { label: 'Products',    value: products.length,       isNum: true, suffix: '+' },
              { label: 'Specialty',   value: producer.specialty,    isNum: false },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="md:px-10 first:pl-0 last:pr-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
              >
                <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-white/35 mb-2">{stat.label}</p>
                <p className="font-serif text-3xl md:text-4xl text-white">
                  {stat.isNum && typeof stat.value === 'number' ? (
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  ) : stat.isNum && typeof stat.value === 'string' ? (
                    <CountUp target={parseInt(stat.value)} />
                  ) : (
                    stat.value
                  )}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          EDITORIAL STORY
      ════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pt-24 md:pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-20 items-start">

          {/* ── Text column ── */}
          <div className="lg:col-span-7">
            <motion.span
              className="font-sans text-[11px] uppercase tracking-[0.28em] text-secondary mb-6 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {featureStory ? 'Portrait' : 'The Story'}
            </motion.span>

            <motion.h2
              className="font-serif text-primary leading-[1.04] mb-10"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {storyHeadline}
            </motion.h2>

            {featureStory?.subtitle && (
              <motion.p
                className="font-serif italic text-xl md:text-2xl text-on-surface-variant mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {featureStory.subtitle}
              </motion.p>
            )}

            <div className="space-y-6 font-sans text-base md:text-[1.05rem] text-on-surface-variant leading-[1.85]">
              {openingParas.map((para, i) => (
                <motion.p
                  key={i}
                  className={i === 0
                    ? 'first-letter:text-[5rem] first-letter:font-serif first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]'
                    : ''}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          {/* ── Sticky image column ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 relative">
            <motion.div
              className="aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_40px_90px_rgba(24,42,27,0.22)] relative"
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 1.5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85 }}
              whileHover={{ rotate: 0, scale: 1.015, transition: { duration: 0.5 } }}
            >
              <Image
                src={leadSrc}
                alt={leadAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                unoptimized={isExternalUnoptimizedSrc(leadSrc)}
              />
            </motion.div>

            {/* Secondary image: peeks out below the main */}
            {producer.secondaryImageSrc && (
              <motion.div
                className="absolute -bottom-10 -left-8 w-36 h-48 rounded-xl overflow-hidden shadow-xl hidden lg:block border-4 border-surface"
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                whileInView={{ opacity: 1, y: 0, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <Image
                  src={producer.secondaryImageSrc}
                  alt={producer.secondaryImageAlt}
                  fill
                  className="object-cover"
                  sizes="144px"
                  unoptimized={isExternalUnoptimizedSrc(producer.secondaryImageSrc)}
                />
              </motion.div>
            )}

            {/* Trust badges below image */}
            <motion.div
              className="mt-8 lg:mt-14"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProducerTrustBadges
                badges={producer.badges}
                established={producer.established}
                size="md"
              />
            </motion.div>
          </div>
        </div>

        {/* ── PULL QUOTE ── */}
        {producer.quote && (
          <motion.blockquote
            className="my-24 md:my-32 max-w-4xl mx-auto text-center px-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9 }}
          >
            <div
              className="font-serif leading-none text-secondary/15 mb-0 select-none"
              style={{ fontSize: 'clamp(5rem, 12vw, 9rem)' }}
            >
              &ldquo;
            </div>
            <p
              className="font-serif text-primary leading-tight italic -mt-6 mb-8"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }}
            >
              {producer.quote}
            </p>
            <span className="inline-block w-16 h-[1px] bg-secondary/30 mb-5" />
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary">{producer.name}</p>
          </motion.blockquote>
        )}

        {/* Rest of story paragraphs */}
        {restParas.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6 font-sans text-base md:text-[1.05rem] text-on-surface-variant leading-[1.85]">
            {restParas.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          CRAFT NOTES — horizontal scroll track
      ════════════════════════════════════════════════════════════════════ */}
      {producer.savoirFaire.length > 0 && (
        <section className="py-24 md:py-28 overflow-hidden bg-surface-container-lowest/60">
          <div className="max-w-7xl mx-auto px-6 md:px-16 mb-10 flex items-end justify-between">
            <div>
              <motion.span
                className="font-sans text-[11px] uppercase tracking-[0.28em] text-secondary mb-3 block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Craft notes
              </motion.span>
              <motion.h2
                className="font-serif text-primary"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                How {producer.name} works
              </motion.h2>
            </div>
            <motion.span
              className="font-sans text-xs text-on-surface-variant/40 hidden md:flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Scroll <ArrowRight size={12} />
            </motion.span>
          </div>

          {/* Horizontal scroll track */}
          <div className="flex gap-5 overflow-x-auto scrollbar-none pl-6 md:pl-16 pr-6 pb-4 snap-x snap-mandatory">
            {producer.savoirFaire.map((step, i) => (
              <motion.article
                key={step.title}
                className="flex-none w-72 md:w-80 snap-start rounded-2xl border border-outline-variant/15 bg-surface px-7 py-8 hover:border-secondary/30 hover:shadow-[0_12px_40px_rgba(148,73,37,0.08)] transition-all duration-300 group cursor-default"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <span className="font-serif text-[4.5rem] text-secondary/15 leading-none block mb-5 group-hover:text-secondary/25 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-xl text-primary mb-3">{step.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
              </motion.article>
            ))}
            {/* Trailing spacer so last card clears the viewport */}
            <div className="flex-none w-6 md:w-16" />
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          PRODUCTS — 3-D tilt cards
      ════════════════════════════════════════════════════════════════════ */}
      {curatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-16 py-24 md:py-28">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-secondary mb-3 block">
                Curated selection
              </span>
              <h2
                className="font-serif text-primary"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
              >
                Taste {producer.name}
              </h2>
            </div>
            <Link
              href="/collection"
              className="hidden md:inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary hover:text-primary group transition-colors"
            >
              View all
              <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedProducts.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.12 }}
              >
                <TiltCard>
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
                      compact
                    />
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.18em] text-secondary"
            >
              View all products <ArrowRight size={12} />
            </Link>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          CLOSING CTA — full-bleed dark section with trust signals
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background: faded version of hero */}
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt=""
            fill
            className="object-cover opacity-25"
            sizes="100vw"
            unoptimized={isExternalUnoptimizedSrc(heroSrc)}
          />
          <div className="absolute inset-0 bg-primary/85" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-24 md:py-32">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <h2 className="font-serif text-[clamp(2.2rem,5vw,4rem)] text-white leading-tight mb-6">
              From the Source<br />to Your Table
            </h2>
            <p className="font-sans text-base md:text-lg text-white/60 leading-relaxed mb-12">
              By ordering directly from {producer.name}, you ensure the full value
              stays with the artisan. We ship directly from {producer.region},
              with eco-conscious packaging that honours the quality of every product.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              {[
                { icon: Truck, title: 'Direct Shipping', sub: `From ${producer.region}` },
                { icon: ShieldCheck, title: 'Certified Origin', sub: 'Verified by Terravoa' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-white/8 border border-white/12 flex items-center justify-center shrink-0">
                    <Icon size={17} strokeWidth={1.4} className="text-secondary-container" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.18em] text-white/90">{title}</p>
                    <p className="font-sans text-xs text-white/40 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {producer.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {producer.badges.map((badge) => (
                  <Badge key={badge} label={badge} className="bg-white/8 text-white/60 border-white/12" />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Back link ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-24">
        <Link
          href="/producers"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          All Producers
        </Link>
      </div>
    </div>
  )
}
