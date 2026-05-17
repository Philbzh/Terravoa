import { Link } from '@/i18n/navigation'
import {
  COMPANY_LEGAL_NAME,
  COMPANY_REGISTERED_OFFICE,
  SITE_NAME,
} from '@/lib/constants'
import type { LegalBlock, LegalSection, LegalTextPart } from '@/lib/legal/types'

const linkClass = 'text-secondary hover:underline'

function interpolate(text: string) {
  return text
    .replaceAll('{siteName}', SITE_NAME)
    .replaceAll('{companyName}', COMPANY_LEGAL_NAME)
    .replaceAll('{companyAddress}', COMPANY_REGISTERED_OFFICE)
}

function renderParts(parts: LegalTextPart[]) {
  return parts.map((part, i) => {
    if ('text' in part) {
      return <span key={i}>{interpolate(part.text)}</span>
    }
    if ('mailto' in part) {
      return (
        <a key={i} href={`mailto:${part.mailto}`} className={linkClass}>
          {part.label ?? part.mailto}
        </a>
      )
    }
    if ('href' in part) {
      return (
        <a
          key={i}
          href={part.href}
          target={part.external ? '_blank' : undefined}
          rel={part.external ? 'noopener noreferrer' : undefined}
          className={linkClass}
        >
          {part.label}
        </a>
      )
    }
    if ('internal' in part) {
      return (
        <Link key={i} href={part.internal} className={linkClass}>
          {part.label}
        </Link>
      )
    }
    return null
  })
}

function renderBlock(block: LegalBlock, key: number) {
  switch (block.type) {
    case 'p':
      return (
        <p key={key} className={key > 0 ? 'mt-3' : undefined}>
          {renderParts(block.parts)}
        </p>
      )
    case 'ul':
      return (
        <ul key={key} className="mt-3 space-y-2 ml-4">
          {block.items.map((item, j) => (
            <li key={j}>
              {typeof item === 'string' ? (
                interpolate(item)
              ) : (
                <>
                  {item.strong && (
                    <strong className="text-on-surface/90">{interpolate(item.strong)}</strong>
                  )}
                  {item.strong ? ' ' : null}
                  {interpolate(item.text)}
                </>
              )}
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={key} className="mt-3 space-y-3 ml-4">
          {block.items.map((parts, j) => (
            <li key={j} className="flex gap-3">
              <span className="font-serif text-secondary shrink-0">{j + 1}.</span>
              <span>{renderParts(parts)}</span>
            </li>
          ))}
        </ol>
      )
    case 'h3':
      return (
        <h3 key={key} className="font-serif text-lg text-primary mt-8 mb-2">
          {interpolate(block.text)}
        </h3>
      )
    case 'box':
      return (
        <div
          key={key}
          className={`mt-4 bg-surface-container-low rounded-lg p-6 text-on-surface/70 ${
            block.italic ? 'italic text-xs leading-relaxed' : ''
          }`}
        >
          {block.title && (
            <p className="font-medium not-italic text-on-surface/90 mb-2">{block.title}</p>
          )}
          <p>{renderParts(block.parts)}</p>
        </div>
      )
    case 'cookieEntries':
      return (
        <div key={key} className="mt-4 bg-surface-container-low rounded-lg p-6 space-y-4">
          {block.entries.map((entry, j) => (
            <div key={j}>
              <p className="font-medium text-on-surface/90 mb-1">
                {entry.codes.map((code, k) => (
                  <span key={code}>
                    {k > 0 && ' & '}
                    <code className="text-xs bg-surface-container rounded px-1 py-0.5">{code}</code>
                  </span>
                ))}
                {entry.title ? ` ${entry.title}` : null}
              </p>
              <p>{interpolate(entry.body)}</p>
            </div>
          ))}
        </div>
      )
    case 'cta':
      return (
        <div
          key={key}
          className="mt-10 bg-surface-container-low rounded-xl p-8 text-center"
        >
          <p className="font-serif text-xl text-primary mb-3">{block.title}</p>
          <p className="text-on-surface/70 font-sans text-sm mb-6">{block.description}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={block.primaryHref}
              className="font-sans text-xs uppercase tracking-wider bg-primary text-on-primary px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              {block.primaryLabel}
            </Link>
            <a
              href={block.secondaryHref}
              className="font-sans text-xs uppercase tracking-wider border border-outline-variant/40 text-on-surface-variant px-6 py-2.5 rounded-full hover:bg-surface-container transition-colors"
            >
              {block.secondaryLabel}
            </a>
          </div>
        </div>
      )
    default:
      return null
  }
}

type Props = { sections: LegalSection[] }

export function LegalSections({ sections }: Props) {
  return (
    <>
      {sections.map((section, i) => (
        <section key={i}>
          <h2 className="font-serif text-xl text-primary mt-10 mb-3">
            {interpolate(section.heading)}
          </h2>
          {section.blocks.map((block, j) => renderBlock(block, j))}
        </section>
      ))}
    </>
  )
}
