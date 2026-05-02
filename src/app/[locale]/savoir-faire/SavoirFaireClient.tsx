'use client'

import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { Search, Users, ShieldCheck, Heart } from 'lucide-react'
import { PageContainer } from '@/components/ui/PageContainer'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery',
    description: 'We travel to regions across Europe, visiting local markets, talking to community leaders, and identifying producers who carry genuine traditional knowledge.',
  },
  {
    icon: Users,
    number: '02',
    title: 'Personal Visit',
    description: 'Every producer is visited in person. We walk their fields, observe their methods, taste their products, and understand their story firsthand.',
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Verification',
    description: 'We verify authenticity: no resellers, no mass production. Products must be made using traditional methods with locally sourced ingredients or materials.',
  },
  {
    icon: Heart,
    number: '04',
    title: 'Partnership',
    description: 'Accepted producers set their own prices and maintain full control of their production. We handle the platform, payments, and customer experience.',
  },
]

export function SavoirFaireClient() {
  return (
    <PageContainer>
      <motion.div
        className="max-w-3xl mx-auto text-center mb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-secondary mb-6 inline-block">
          Our Selection Process
        </span>
        <h1
          className="font-serif text-primary mb-8 leading-[0.94]"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
        >
          Savoir-Faire
        </h1>
        <p className="text-on-surface/80 font-sans text-lg leading-relaxed">
          The French concept of &ldquo;savoir-faire&rdquo; — knowing how to do — captures
          what we look for in every producer: deep, practical knowledge passed down
          through generations. Here&apos;s how we find and verify them.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto space-y-16 mb-24">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.number}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="md:col-span-2">
                <span className="font-serif text-5xl text-outline-variant/40">
                  {step.number}
                </span>
              </div>
              <div className="md:col-span-10">
                <Icon size={28} strokeWidth={1.2} className="text-secondary mb-4" />
                <h3 className="font-serif text-2xl text-primary mb-3">{step.title}</h3>
                <p className="text-on-surface/70 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl text-on-primary mb-4">
          Are you a producer?
        </h2>
        <p className="text-on-primary-container font-sans mb-8 max-w-lg mx-auto">
          If you craft authentic, traditional products and want to reach customers
          who value quality and provenance, we&apos;d love to hear your story.
        </p>
        <Link
          href="/for-producers"
          className="inline-flex bg-secondary hover:bg-secondary-container transition-colors duration-300 px-10 py-4 rounded-full text-on-secondary font-sans font-semibold text-[11px] uppercase tracking-[0.2em]"
        >
          Become a producer
        </Link>
      </div>
    </PageContainer>
  )
}
