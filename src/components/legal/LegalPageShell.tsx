import { PageContainer } from '@/components/ui/PageContainer'

type Props = {
  title: string
  lastUpdated: string
  fallbackNotice?: string | null
  children: React.ReactNode
}

export function LegalPageShell({ title, lastUpdated, fallbackNotice, children }: Props) {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl text-primary mb-6 text-center">{title}</h1>
        <p className="text-on-surface-variant font-sans text-sm mb-8 text-center">{lastUpdated}</p>
        {fallbackNotice && (
          <p
            className="mb-10 rounded-lg border border-secondary/25 bg-secondary/5 px-4 py-3 font-sans text-xs text-on-surface-variant text-center leading-relaxed"
            role="note"
          >
            {fallbackNotice}
          </p>
        )}
        <div className="space-y-10 text-on-surface/80 font-sans leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </PageContainer>
  )
}
