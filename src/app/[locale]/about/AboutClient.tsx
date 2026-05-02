'use client'

import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpenCheck, Leaf, Handshake, Globe, Award, Landmark } from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { SectionHeader } from '@/components/ui/SectionHeader'

const values = [
  {
    icon: BookOpenCheck,
    title: 'Authenticity',
    description:
      'Real origin, real people. We visit every farm and workshop in person — no middlemen, no shortcuts, only direct relationships with the makers.',
  },
  {
    icon: Award,
    title: 'Craftsmanship',
    description:
      'Tradition and expertise passed down through generations. Every product reflects the accumulated knowledge of a place, a climate, and a people.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'Respect for the land and animals is not a trend — it is the foundation of genuine quality. We prioritise producers who farm with conscience.',
  },
  {
    icon: Handshake,
    title: 'Transparency',
    description:
      'You know exactly where your food comes from. Producers set their own prices and receive the majority of the value — preserving rural livelihoods.',
  },
  {
    icon: Globe,
    title: 'Excellence',
    description:
      'No compromise on quality. Only products that meet our rigorous standards for taste, provenance, and integrity earn a place in the collection.',
  },
  {
    icon: Landmark,
    title: 'Cultural Preservation',
    description:
      'By creating a market for traditional products, we help keep ancient crafts and recipes alive for future generations across Europe.',
  },
]

export function AboutClient() {
  return (
    <PageContainer>
      {/* Hero intro */}
      <SectionHeader
        kicker="Our Story"
        title="Taste the Origin"
        subtitle="Terravoa was born from a simple belief: true taste begins at the origin."
      />
      <motion.p
        className="max-w-2xl mx-auto text-center text-on-surface/70 font-sans text-lg leading-relaxed mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Across Europe, generations of farmers and artisans dedicate their lives to preserving
        tradition, respecting nature, and crafting products of exceptional quality.
        These are not industrial goods. They are expressions of land, culture, and time.
      </motion.p>

      {/* Brand name meaning */}
      <motion.div
        className="bg-primary text-on-primary rounded-2xl p-10 md:p-16 mb-24 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-on-primary/60 mb-4">
              The Name
            </p>
            <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-6">
              &ldquo;The path from the land to refined taste.&rdquo;
            </p>
            <p className="font-sans text-on-primary/80 leading-relaxed">
              At Terravoa, we carefully select producers who embody these values and connect them
              directly with those who seek authenticity. Every product tells a story — of soil,
              climate, heritage, and craftsmanship.
            </p>
          </div>
          <div className="space-y-6">
            <div className="border-l-2 border-on-primary/30 pl-6">
              <p className="font-serif italic text-xl text-on-primary mb-1">Terra</p>
              <p className="font-sans text-sm text-on-primary/70">Earth, land, origin</p>
            </div>
            <div className="border-l-2 border-on-primary/30 pl-6">
              <p className="font-serif italic text-xl text-on-primary mb-1">Voa</p>
              <p className="font-sans text-sm text-on-primary/70">Path, flow, transformation</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Brand story */}
      <motion.div
        className="max-w-3xl mx-auto mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-serif text-primary mb-8 text-center"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Not Just a Marketplace
        </h2>
        <div className="space-y-6 text-on-surface/80 font-sans text-lg leading-relaxed">
          <p>
            Terravoa is not a marketplace in the traditional sense.
            It is a curated journey back to the origin of taste.
          </p>
          <p>
            We personally visit every producer in our network. We walk their groves, taste from
            their presses, and sit at their tables. Only products that meet our standards for
            authenticity, quality, and sustainability earn a place in our collection.
          </p>
          <p>
            No resellers. No mass production. Just genuine artisans who pour their heritage into
            every product — and the conviction that the story behind a product is as important as
            the product itself.
          </p>
        </div>
      </motion.div>

      {/* Image */}
      <motion.div
        className="mb-24 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
          <Image
            src="/images/hero/terrova-table.png"
            alt="The Terravoa Table — olive oil, artisan cheese, honey, and fresh bread against a Tuscan landscape"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1100px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <p className="font-serif text-2xl md:text-3xl text-white mb-2">
              The Terravoa Table
            </p>
            <p className="font-sans text-sm text-white/80 max-w-lg">
              Every product tells a story of soil, climate, heritage, and craftsmanship —
              gathered from Europe&apos;s finest producers, delivered to your table.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Positioning */}
      <motion.div
        className="bg-surface-container-low rounded-2xl p-10 md:p-16 mb-24 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-secondary mb-4">
          Our Positioning
        </p>
        <p className="font-serif text-2xl md:text-3xl text-primary mb-8 leading-relaxed">
          Premium European Food Curator
        </p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { label: 'A curated selection', desc: 'Not everything — only the best, personally verified.' },
            { label: 'A story-driven experience', desc: 'Every product comes with its origin, producer, and craft.' },
            { label: 'A direct connection', desc: 'No intermediaries between producer and your table.' },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <p className="font-serif text-lg text-primary">{item.label}</p>
              <p className="font-sans text-sm text-on-surface/70 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Values */}
      <div className="mb-24">
        <h2
          className="font-serif text-primary text-center mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                className="bg-surface-container-low rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Icon size={26} strokeWidth={1.2} className="text-secondary mb-4" />
                <h3 className="font-serif text-xl text-primary mb-3">{value.title}</h3>
                <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <div className="h-px w-12 bg-secondary mx-auto mb-8" />
        <h2
          className="font-serif text-primary mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Want to join our network?
        </h2>
        <p className="text-on-surface-variant font-sans mb-8 max-w-lg mx-auto leading-relaxed">
          If you&apos;re a European producer crafting authentic, traditional products,
          we&apos;d love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/for-producers"
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
          >
            Become a producer
          </Link>
          <Link
            href="/contact"
            className="font-sans text-sm text-on-surface-variant underline underline-offset-4 hover:text-secondary transition-colors"
          >
            General enquiries
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
