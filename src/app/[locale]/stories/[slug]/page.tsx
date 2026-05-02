import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import {
  getAllStories,
  getStoryBySlug,
  getProducerBySlug,
  getRegionSlugByName,
} from '@/lib/content'
import { getTranslations } from 'next-intl/server'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

export const revalidate = 60

type PageParams = { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const stories = await getAllStories()
  return stories.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) return {}
  return {
    title: story.title,
    description: story.subtitle || story.excerpt?.slice(0, 160),
    openGraph: {
      images: story.imageSrc.startsWith('http') ? [story.imageSrc] : undefined,
    },
  }
}

export default async function StoryPage({ params }: PageParams) {
  const { locale, slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) notFound()

  if (story.kind === 'producerFeature' && story.producerSlug) {
    redirect(`/${locale}/producers/${story.producerSlug}`)
  }

  const [producer, regionSlug, t] = await Promise.all([
    story.producerSlug ? getProducerBySlug(story.producerSlug) : Promise.resolve(null),
    getRegionSlugByName(story.region),
    getTranslations({ locale, namespace: 'stories' }),
  ])

  const paragraphs = story.body.split('\n\n')

  return (
    <div className="pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 max-w-3xl mx-auto mb-10">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-sans text-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Journal
        </Link>
      </div>

      <div className="px-6 md:px-16 max-w-5xl mx-auto mb-16">
        <div className="aspect-[21/9] rounded-xl overflow-hidden relative bg-surface-container-high shadow-[0_20px_50px_rgba(26,28,26,0.08)]">
          <Image
            src={story.imageSrc}
            alt={story.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1024px"
            priority
            unoptimized={isExternalUnoptimizedSrc(story.imageSrc)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 z-10">
            {regionSlug ? (
              <Link
                href={`/regions/${regionSlug}`}
                className="bg-surface/85 backdrop-blur-md text-primary font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full shadow-sm hover:bg-surface transition-colors inline-block"
              >
                {story.region}
              </Link>
            ) : (
              <span className="bg-surface/85 backdrop-blur-md text-primary font-sans text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full shadow-sm">
                {story.region}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="px-6 md:px-16 max-w-3xl mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] w-10 bg-secondary" />
          <span className="text-secondary font-sans text-xs uppercase tracking-[0.15em] font-bold">
            {story.readTime} read
          </span>
        </div>

        <h1
          className="font-serif text-primary mb-4 leading-[1.02]"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)' }}
        >
          {story.title}
        </h1>
        <p className="font-serif italic text-xl text-on-surface-variant mb-8">
          {story.subtitle}
        </p>

        <div className="flex items-center gap-3 pb-10 mb-10 border-b border-outline-variant/15 text-on-surface-variant font-sans text-sm">
          <span>{story.author}</span>
          <span>&bull;</span>
          <span>
            {new Date(story.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`font-sans text-base md:text-[1.05rem] leading-[1.85] text-on-surface-variant${
                i === 0
                  ? ' first-letter:text-[4.5rem] first-letter:font-serif first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85]'
                  : ''
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Continue exploring — the triangle's final leg. Readers who finish
            a Journal piece can pivot either to the featured producer OR to
            the region as a whole (which exposes the other stories, producers,
            and products for that terroir). Rendered as a small side-by-side
            grid so the two lenses read as equal next steps. */}
        {(producer || regionSlug) && (
          <div className="mt-16 pt-10 border-t border-outline-variant/15 grid grid-cols-1 md:grid-cols-2 gap-10">
            {producer && (
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-3">
                  {t('featuredProducer')}
                </p>
                <Link
                  href={`/producers/${producer.slug}`}
                  className="font-serif text-2xl text-primary hover:text-secondary transition-colors"
                >
                  {producer.name} &rarr;
                </Link>
                <p className="font-serif italic text-on-surface-variant mt-1">
                  {producer.tagline}
                </p>
              </div>
            )}
            {regionSlug && (
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.15em] text-on-surface-variant mb-3">
                  {t('continueExploring')}
                </p>
                <Link
                  href={`/regions/${regionSlug}`}
                  className="font-serif text-2xl text-primary hover:text-secondary transition-colors"
                >
                  {story.region} &rarr;
                </Link>
                <p className="font-serif italic text-on-surface-variant mt-1">
                  {t('moreFromRegion', { region: story.region })}
                </p>
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
