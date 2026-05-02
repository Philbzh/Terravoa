import { Link } from '@/i18n/navigation'
import { PageContainer } from '@/components/ui/PageContainer'

export default function LocaleNotFound() {
  return (
    <PageContainer className="flex flex-col items-center justify-center text-center min-h-[70vh]">
      <span className="font-serif text-8xl text-outline-variant/30 mb-6 select-none">404</span>
      <h1 className="font-serif text-3xl text-primary mb-4">Page Not Found</h1>
      <p className="font-sans text-sm text-on-surface-variant max-w-md mb-10 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let us guide you back to our collection.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-secondary-container transition-colors duration-300"
        >
          Back to Home
        </Link>
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 bg-surface-container-high px-8 py-4 rounded-full text-on-surface font-sans font-medium hover:bg-surface-container-highest transition-colors"
        >
          Browse Collection
        </Link>
      </div>
    </PageContainer>
  )
}
