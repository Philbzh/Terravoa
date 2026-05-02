'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Users,
  CreditCard,
  Eye,
  Leaf,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'
import { PricingSection } from '@/components/producers/PricingSection'

const benefits = [
  {
    icon: Users,
    title: 'Access New Customers',
    description:
      'Reach discerning buyers across Europe who actively seek authentic, artisanal products.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment Handling',
    description:
      'We manage all payments. You receive automatic payouts — no invoicing, no hassle.',
  },
  {
    icon: Eye,
    title: 'Premium Visibility',
    description:
      'Your story, your craft, your region — presented with editorial quality photography and storytelling.',
  },
  {
    icon: Leaf,
    title: 'Focus on Your Craft',
    description:
      'No need to build an online store. We handle the platform, marketing, and customer service.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Submit Your Application',
    description:
      'Tell us about your products, your story, and your production methods. We take the time to understand what makes you unique.',
  },
  {
    number: '02',
    title: 'Curation & Selection',
    description:
      'Every application is carefully reviewed by our team. We select producers based on quality, authenticity, and craftsmanship.',
  },
  {
    number: '03',
    title: 'Welcome to Terravoa',
    description:
      'If selected, you receive access to the producer portal, onboarding guidance, and tools to list your products — commercial terms are shared only inside that space.',
  },
  {
    number: '04',
    title: 'Sell & Ship Directly',
    description:
      'Customers order on Terravoa, you ship directly. We handle payments and transfer your earnings automatically.',
  },
]

export function ForProducersClient() {
  const tp = useTranslations('producerRatings')

  return (
    <PageContainer>
      {/* Hero */}
      <motion.div
        className="text-center mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary mb-6 inline-block">
          For Producers
        </span>
        <h1
          className="font-serif text-primary mb-6 leading-[0.94]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          Sell your products <br className="hidden md:block" />
          across Europe
        </h1>
        <p className="text-on-surface/80 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
          We collaborate with carefully selected producers across Europe who stand for
          authenticity, craftsmanship, and true origin. Join a curated community
          that values quality over quantity.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto mb-16 rounded-xl border border-secondary/25 bg-surface-container-low/90 px-6 py-8 md:px-10 md:py-9">
        <h2 className="font-serif text-xl text-primary mb-3 text-center md:text-left">{tp('title')}</h2>
        <p className="font-sans text-sm text-on-surface/80 leading-relaxed text-center md:text-left">{tp('body')}</p>
        <div className="mt-5 text-center md:text-left">
          <Link
            href="/terms"
            className="text-secondary font-sans text-sm uppercase tracking-wider underline underline-offset-4 hover:opacity-80"
          >
            {tp('termsLink')}
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-24">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.title}
              className="bg-surface-container-low rounded-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Icon
                size={28}
                strokeWidth={1.2}
                className="text-secondary mb-4"
              />
              <h3 className="font-serif text-xl text-primary mb-3">
                {benefit.title}
              </h3>
              <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* How it works */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="font-serif text-primary text-center mb-16"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          How It Works
        </h2>
        <div className="max-w-5xl mx-auto space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="flex gap-8 items-start"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="font-serif text-5xl text-secondary/30 shrink-0 leading-none">
                {step.number}
              </span>
              <div>
                <h3 className="font-serif text-xl text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-on-surface/70 font-sans text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing */}
      <PricingSection />

      {/* Selectivity note */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ShieldCheck size={32} strokeWidth={1.2} className="text-secondary mx-auto mb-4" />
        <p className="font-serif text-xl text-primary mb-3">
          Only selected producers are accepted
        </p>
        <p className="text-on-surface-variant font-sans text-base leading-relaxed max-w-3xl mx-auto">
          Terravoa is built on a curated selection. Selected producers receive full
          access to our partnership details and onboarding process.
        </p>
      </motion.div>

      {/* Final CTA */}
      <div className="bg-primary rounded-2xl p-10 md:p-16 text-center">
        <h2 className="font-serif text-3xl text-on-primary mb-4">
          Ready to reach new customers?
        </h2>
        <p className="text-on-primary/80 font-sans max-w-lg mx-auto mb-8 leading-relaxed">
          We&apos;re looking for passionate producers who craft authentic,
          traditional products. Tell us your story.
        </p>
        <Link
          href="/for-producers/apply"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
        >
          Apply Now
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
        <p className="mt-8 font-sans text-xs text-on-primary/40">
          Already a Terravoa producer?{' '}
          <Link href="/login/producer" className="text-on-primary/60 hover:text-on-primary underline underline-offset-4">
            Sign in to your portal →
          </Link>
        </p>
      </div>
    </PageContainer>
  )
}
