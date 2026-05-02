'use client'

import { useTranslations } from 'next-intl'

const row1 = [
  { region: 'Brittany', flag: '🇫🇷', products: 'Fleur de sel · Salted caramel · Butter biscuits' },
  { region: 'Tuscany', flag: '🇮🇹', products: 'Olive oil · Truffles · Pecorino' },
  { region: 'Andalusia', flag: '🇪🇸', products: 'Paprika · Saffron · Sun-dried preserves' },
  { region: 'Black Forest', flag: '🇩🇪', products: 'Wildflower honey · Smoked ham · Spiced cakes' },
  { region: 'Alentejo', flag: '🇵🇹', products: 'Sheep cheese · Cork · Single-estate wine' },
  { region: 'Basque Country', flag: '🇪🇸', products: "Txakoli · Piment d'Espelette · Anchovies" },
]

const row2 = [
  { region: 'Alsace', flag: '🇫🇷', products: 'Charcuterie · Mustard · Christmas spices' },
  { region: 'Provence', flag: '🇫🇷', products: 'Lavender honey · Herbes de Provence · Savon' },
  { region: 'Sicily', flag: '🇮🇹', products: 'Capers · Blood orange · Marsala wine' },
  { region: 'Asturias', flag: '🇪🇸', products: 'Sidra · Cabrales cheese · Fabada' },
  { region: 'Douro Valley', flag: '🇵🇹', products: 'Port wine · Olive oil · Almonds' },
  { region: 'Bavaria', flag: '🇩🇪', products: 'Dark rye · Soft pretzels · Heritage mustard' },
]

function MarqueeItem({ region, flag, products }: { region: string; flag: string; products: string }) {
  return (
    <div className="flex items-center gap-5 px-8 shrink-0">
      <span className="text-base leading-none">{flag}</span>
      <div className="border-l border-outline-variant/25 pl-5">
        <p className="font-serif text-sm text-primary leading-snug">{region}</p>
        <p className="font-sans text-[10px] text-on-surface-variant mt-0.5 whitespace-nowrap">
          {products}
        </p>
      </div>
      <span className="ml-3 text-outline-variant/30 text-lg font-light">·</span>
    </div>
  )
}

export function EuropeStrip() {
  const t = useTranslations('home.europeStrip')

  return (
    <section className="py-14 bg-surface-container-low border-y border-outline-variant/10 overflow-hidden">
      {/* Eyebrow */}
      <p className="font-sans text-[9px] uppercase tracking-[0.36em] text-secondary text-center mb-10">
        {t('eyebrow')}
      </p>

      {/* Row 1 — scrolls left */}
      <div className="flex mb-5 overflow-hidden">
        <div className="flex animate-marquee">
          {[...row1, ...row1].map((item, i) => (
            <MarqueeItem key={i} {...item} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee-reverse">
          {[...row2, ...row2].map((item, i) => (
            <MarqueeItem key={i} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
