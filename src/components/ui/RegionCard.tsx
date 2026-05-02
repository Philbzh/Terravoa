import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { isExternalUnoptimizedSrc } from '@/lib/utils'

interface RegionCardProps {
  name: string
  specialty: string
  imageSrc: string
  imageAlt: string
  className?: string
  href?: string
}

export function RegionCard({
  name,
  specialty,
  imageSrc,
  imageAlt,
  className,
  href,
}: RegionCardProps) {
  const inner = (
    <div className={`group relative overflow-hidden rounded-2xl cursor-pointer ${className ?? ''}`}>
      {/* Image with parallax-style scale on hover */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        sizes="(max-width: 768px) 100vw, 33vw"
        unoptimized={isExternalUnoptimizedSrc(imageSrc)}
      />

      {/* Gradient overlays — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8">
        {/* Specialty — slides up slightly on hover */}
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/55 mb-2 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          {specialty}
        </p>

        {/* Region name */}
        <div className="flex items-end justify-between gap-4">
          <h3
            className="font-serif text-white leading-tight"
            style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}
          >
            {name}
          </h3>

          {/* Arrow — fades in on hover */}
          <span className="shrink-0 w-9 h-9 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <ArrowRight size={13} strokeWidth={2} className="text-white" />
          </span>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    )
  }

  return inner
}
