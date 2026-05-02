# Terravoa Design System

> "Taste the Origin." — A curated marketplace for exceptional foods from Europe's finest small-batch producers.

## What Terravoa Is

Terravoa is a direct-to-consumer marketplace connecting discerning customers with verified European artisan producers — olive oil from a 400-year-old Tuscan grove, raw wildflower honey from a Black Forest beekeeper who works without gloves, hand-thrown terracotta from an Alentejo workshop where the kiln is fed all night by a single ceramicist. Orders go straight from the producer; there are no warehouses and no middlemen. Producers set their own prices.

The brand voice borrows from a high-end European lifestyle magazine: slow, tactile, and quietly confident. The interface is the digital equivalent — generous whitespace, dramatic serif/sans contrast, art-directed photography, and asymmetrical layouts that resist the "template" feel of mainstream e-commerce.

### Creative North Star
**"The Digital Curator."** Treat the interface as an editorial publication, not a checkout flow. Prioritize the producer's story over the product's spec sheet. Encourage lingering.

### Surfaces / Products

There is currently **one surface**: the Terravoa marketplace web app (Next.js 16, Tailwind 4, Sanity CMS, Supabase auth, Stripe). It contains:

- **Public marketplace** — homepage, collection, producer profiles, region guides, journal (long-form), about, contact, for-producers landing.
- **Customer account** — orders, wishlist, login.
- **Producer dashboard** — orders, products, profile, partnership, shipping, support (gated by `producer-dashboard-access`).
- **Sanity Studio** at `/studio` for content editors.

This design system supports all of the above as a single web product. There is no native mobile app yet.

---

## Sources

- **Codebase (read-only mount):** `MyTerraVera/` — Next.js app at the App-Router root. Key files referenced when building this system:
  - `src/app/globals.css` — canonical color + type tokens (mirrored into `colors_and_type.css`).
  - `src/lib/fonts.ts` — Noto Serif + Manrope via `next/font/google`.
  - `MyTerraVera/_Concept/DESIGN.md` — the original "editorial boutique" design brief; the philosophical source-of-truth.
  - `src/components/ui/` — `Button`, `Badge`, `ProductCard`, `RegionCard`, `SectionHeader`, `LogoEmblem`.
  - `src/components/layout/` — `Navbar`, `Footer`.
  - `src/components/home/` — `Hero`, `EuropeStrip`, `HowItWorks`, `StoryOfTheWeek`, `RegionalArchives`, `CuratedCollection`, `CuratorsPromise`, `ProducerCTA`.
  - `src/data/demo.ts` — fallback content (producers, products, regions, stories) — the primary copy reference.
  - `messages/en.json` — UI strings (canonical voice/tone reference).
  - `public/images/` — all art-directed photography copied into `assets/`.

No Figma file was provided.

---

## CONTENT FUNDAMENTALS

Terravoa's voice is **the curator at a small bookshop, not the salesperson at a department store**. It is calm, specific, and quietly authoritative.

### Tone & vibe
- **Slow, tactile, and earned.** Sentences trust the reader to hold attention. Cadence over efficiency.
- **Sensory and concrete, never adjectival.** "Cold-pressed within six hours of harvest" beats "premium artisanal." Specifics carry the credibility.
- **Generational, not seasonal.** "Four generations" / "Four centuries" / "1640" rather than "trendy" or "new."
- **Restrained romance.** Allow one italic-serif aphorism per long-form module ("*The secret isn't in the press, it's in the patience.*") — never two.

### Casing & typography of copy
- **Sentence case** for all UI buttons and inline copy ("Shop products", "Read the guide", "View all products").
- **Title case** for product names, producer names, headlines ("Extra Virgin Cold-Pressed Oil", "The Liquid Gold of the Maremma").
- **ALL CAPS + tracked letter-spacing** for eyebrows, kickers, badges, nav, breadcrumbs, footer link section titles. Always Manrope, never serif.
- **Italic Noto Serif** for taglines, pull-quotes, image captions, story subtitles. ("*— From Brittany's salt marshes to the Black Forest, from the Alps to the Atlantic coast. —*")

### Pronouns
- **"We"** for Terravoa as a brand ("We visit every farm, workshop, and studio in person.")
- **"You"** for the customer in conversational moments ("Receive monthly dispatches from our regional scouts.")
- **Producer names in third person** with their first name after introduction (Matteo Rossi → Matteo). Builds intimacy without familiarity.

### Punctuation & flourishes
- **The em-dash** — used liberally for editorial rhythm and asides.
- **The middle dot ·** — used as a decorative separator in specialty lists ("Olive Oil · Truffles · Pasta") and origin lines.
- **The bullet (&bull;)** — used for inline meta separators on product cards ("Tuscany &bull; Rossi Estate").
- **The em-dash bracket** ("— Established 2024 —") — used for hero kickers and tagline brackets.
- **No emoji.** Anywhere. The flag for product origin is the closest the system comes (and it's an actual country flag, not 🇮🇹).

### Specific examples (lifted from the codebase)

- Hero kicker: "Established 2024"
- Hero title: "Taste the Origin"
- Hero subtitle: "Discover exceptional foods from Europe's finest producers — carefully selected and delivered directly from their source."
- Hero tagline (italic serif): "*— From Brittany's salt marshes to the Black Forest, from the Alps to the Atlantic coast. —*"
- Section eyebrow: "FROM EVERY CORNER OF EUROPE"
- Promise heading: "The Terravoa Promise"
- Newsletter pitch: "Receive monthly dispatches from our regional scouts."
- Footer brand line: "Every product carries the handwriting of its heritage."
- Footer copyright suffix: "Artistry in every detail."
- Card meta line: "TUSCANY · ROSSI ESTATE" (uppercase, terracotta, tracked)
- "Ships directly from producer" — the recurring delivery promise on every product card.
- Producer pull-quote: "*The secret isn't in the press, it's in the patience.*"

### What to avoid
- "Premium," "luxury," "exclusive," "artisanal" used as adjectives without specifics.
- "Discover the magic of...", "Elevate your...", "Indulge in..." — generic e-commerce romance.
- Exclamation points. (One in the entire English locale file would be one too many.)
- Emoji, all-caps in body copy, or sales-speak ("Hurry — limited stock!").
- "Our customers love..." or other social-proof language. Reviews carry that weight; brand voice doesn't.

---

## VISUAL FOUNDATIONS

### Palette
A landscape palette: deep forests, sun-baked earth, mineral sands. **Forest green (`#182a1b`)** is the voice of authority — used for the primary brand mark, primary buttons, navigation text, and the inverted "Promise" section. **Terracotta (`#944925`)** is the warmth — used for CTAs, links, secondary highlights, eyebrows. **Warm dark (`#342306`)** sits beneath cream `#feddb3` for producer/origin badges. Surfaces are stacked warm whites — `#faf9f6` (canvas), `#f4f3f1` (sub-section), `#ffffff` (most-elevated). See `colors_and_type.css` for the full token list.

### Type
- **Noto Serif** — the editorial anchor. All headlines, display, and the occasional italic pull-quote. Light/regular weights only (no bold serifs).
- **Manrope** — every functional element: nav, body, labels, buttons, metadata, prices.
- **High-contrast scale** — `display-lg` (56 px) sits beside `label-md` (12 px) deliberately. Mid-sizes are rare.
- Never use a sans-serif for headlines or a serif for buttons.

### Spacing
- **Generous, magazine-style.** Section padding is `py-24` (96 px) on desktop. "If you think there is enough space, add one more increment."
- 4-px base scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Grid gutters on collection grids: `gap-x-8 gap-y-12` (32 / 48 px) — vertical breathing room beats horizontal density.

### Backgrounds
- **Full-bleed art-directed photography** for the hero (Tuscan vineyard at golden hour, salt marshes, lavender fields). No stock-photo gloss; warm, slightly desaturated, golden-hour or overcast light.
- **Stacked warm-white surfaces** for sectioning. **Never** divide sections with a 1 px line — shift the background tint instead. (`surface` → `surface-container-low` is the canonical "section break.")
- **No gradients on flat sections.** Gradients appear only in two places: (1) the primary CTA button — a subtle `primary` → `primary-container` vertical gradient that gives it weight; (2) image overlays for legibility.
- **No repeating patterns or textures.** No noise overlays, paper textures, or hand-drawn flourishes. The surface honesty is the texture.

### Imagery
- **Color vibe:** warm. Golden-hour, lamp-lit, candle-lit. Cream tones, terracotta, ochre, deep greens. Never blue-cool, never grayscale, never high-saturation.
- **Subject vibe:** the maker's hands, the workshop, the field at dawn. People appear as quiet portraits, mid-task — never posed, never smiling at camera.
- **Aspect ratios are varied on purpose** (3:4 portraits for stories, 1:1 squares for products, 16:9 wide for regions). The Story-of-the-Week portrait is rotated `-2°` for editorial asymmetry.
- Product photos sit on a `#ffffff` (`surface-container-lowest`) background inside a `rounded-lg` (16 px) frame.

### Animation
- **Easing** — `easeOut` / `cubic-bezier(0.4, 0, 0.2, 1)` on entry; soft, never bouncy.
- **Fades** — `opacity 0 → 1` paired with a 16–30 px upward translation. Duration `0.5s`–`0.9s`. (Driven by `framer-motion` `whileInView`.)
- **Image hover** — `scale(1.05)` on product images, `scale(1.10)` on region tiles, both over 500–700 ms. The slow scale is the signature.
- **Button hover (primary)** — `scale(0.98)` (a press-into rather than a lift).
- **Newsletter arrow** — `translateX(4px)` on hover.
- **No bounces, no rotations (except the static `-2°` story tilt), no parallax.**

### Hover states
- Text links: opacity drop (75–80%) or color shift to terracotta (`secondary`).
- Card images: slow scale (1.05–1.10) over 500 ms+.
- Primary buttons: subtle scale-down (0.98) — the "press into" feeling.
- Secondary buttons: surface tint deepens (`surface-container-high` → `surface-container-highest`).
- Tertiary (text) buttons: underline color deepens.

### Press states
- Inherits from hover (scale 0.98). No explicit `:active` color shift in the codebase.
- Disabled = opacity 0.5, cursor not-allowed, no transform.

### Borders — "The No-Line Rule"
Sectioning is **never** achieved with a 1 px solid border. The boundary between a section and its container is always a background-tint shift. When a border is genuinely required (form input bottom, footer column separator), use `outline-variant` (`#c3c8c0`) at **15–20% opacity** — the "ghost border."

### Shadows
- **Ambient, not architectural.** Large blur radius (30–50 px), low opacity (4–6%), tinted with `#1a1c1a` rather than pure black.
- Three tokens: `--tv-shadow-sm` for buttons/cards on hover, `--tv-shadow-md` for floating chips, `--tv-shadow-lg` for modals, `--tv-shadow-image` for the hero / story portrait (heavier, 12% — earned by the editorial moment).
- **Depth is layered surfaces, not shadow.** A card on `surface-container-lowest` against a `surface-container-low` background reads as "lifted" without any shadow.

### Glassmorphism
Reserved for **floating navigation overlays** and **wishlist heart buttons over product imagery**. Recipe: semi-transparent surface (`bg-surface/80`) + `backdrop-filter: blur(20px)`. Used sparingly — never as a default chrome treatment.

### Capsule vs protection-gradient
- **Capsule pills** (rounded-full backgrounds) for: badges, buttons, navigation pill (signed-in account), wishlist icon button.
- **Protection gradients** for image overlays (hero, region tiles): `linear-gradient(180deg, primary/40, primary/20, primary/60)` — green-tinted, never neutral black/30.

### Transparency & blur
- **Blur** appears in two places only: glass overlays (`backdrop-blur-sm` on the wishlist heart button, `backdrop-blur` on floating nav) and decorative blob (`bg-secondary/10 rounded-full blur-3xl` behind the Story-of-the-Week portrait).
- **Opacity ramps** on text: brand body text frequently uses `text-primary/60` or `text-on-primary/80` for visual hierarchy without changing color tokens. This is the system's preferred way to create secondary text.

### Layout rules
- **Sticky navbar** with subtle bottom border (`border-outline-variant/20` + `shadow-sm`). White surface, never blurred glass on the homepage.
- **Three-column desktop nav grid:** left links — center wordmark — right account/cart. Asymmetrical visual weight is intentional.
- **Footer:** 4-column on desktop (brand · discover · concierge · newsletter), single column on mobile. Background `surface-container-low`, padding-top `py-20`.
- **Hero is full-viewport-height** (`h-screen min-h-[700px]`) with centered content over a full-bleed image with a green protection gradient.

### Corner radii
- **Nothing is sharp.** Smallest corner is `--tv-radius-sm` (6 px) on form inputs.
- **Buttons + badges:** `rounded-full` (capsule).
- **Product images:** `rounded-lg` (16 px) — soft, "organic."
- **Cards / modals:** `rounded-xl` (24 px) for hero CTAs (e.g. the Producer CTA card on the homepage).
- **Region tiles:** `rounded-xl`.

### Card anatomy
- **Product card:** square `surface-container-lowest` image frame at `rounded-lg`, no shadow, no border. Below: terracotta uppercase meta (origin · producer with country flag), serif primary-color title, sans price, sans uppercase delivery promise with `Truck` icon. Optional badge (capsule pill) absolute-positioned top-right. Wishlist heart (glass capsule) appears on hover.
- **Region card:** full-bleed image, `rounded-xl`, dark overlay (`black/30`), white serif name + tracked-out white specialty caption bottom-left.
- **Story card / Story-of-the-Week:** asymmetric two-column. Image is portrait 3:4, rotated `-2°`, with a soft secondary blur blob behind it.

---

## ICONOGRAPHY

Terravoa uses **Lucide** (`lucide-react`) as its sole icon library. The codebase imports specific icons rather than dynamic loading.

### Style rules
- **Stroke weight:** `1.2` to `1.5` (thinner than Lucide's default 2). The lighter stroke matches the editorial tone.
- **Sizes:** 11–16 px inline (within text); 20–26 px for navigation and step icons; 36 px for the largest "Promise" icons.
- **Color:** inherits from parent. In the codebase, icons are tinted with `text-primary`, `text-secondary`, or `text-secondary-fixed` depending on context. **Never multi-color.** Never filled (the wishlist heart is the only icon that fills — and only on the active state, with `fill-red-500`).

### Icons in active use
| Where | Icon | Purpose |
|---|---|---|
| Navbar | `ShoppingBag`, `Menu`, `X`, `UserCircle` | Primary chrome |
| Buttons | `ArrowRight` | Forward CTAs |
| Product card | `Truck`, `Heart` | Delivery promise + wishlist |
| HowItWorks | `Search`, `ShoppingBag`, `Truck` | Three-step explainer |
| CuratorsPromise | `BookOpenCheck`, `Leaf`, `Handshake` | Three-pillar promise |
| StoryOfTheWeek | `BookOpen` | "Read the guide" CTA |

### Country flags
Origin lines use **flagcdn.com** rasterized PNG flags (`https://flagcdn.com/w20/{iso}.png`) at 18×13 px, inline with the uppercase origin label. Mapping in `src/components/ui/ProductCard.tsx`. Falls back to `🌍` only if a country has no mapping (a deliberate exception, since most products are tagged to a known European origin).

### Logo & emblem
- **Wordmark** (`assets/logos/terravoa-wordmark.png`) — Used in navbar (height 90 px desktop, 52 px mobile) and footer (100 px). Rendered with `mix-blend-mode: multiply` so it composites cleanly on any cream surface.
- **Gold mark** (`assets/logos/terravoa-gold.png`) — Decorative, used for hero/marketing surfaces.
- **Emblems** (`assets/logos/terravoa-emblem-final.png`, `-v2`, `-v3`) — Square circular marks; favicon and small contexts.
- **`LogoEmblem` SVG** (`src/components/ui/LogoEmblem.tsx`) — A vector mark of three leaves over terraced field lines. Single-color (`currentColor`), used inline where a tiny scalable mark is needed.

### What is NOT used
- **No emoji** anywhere in product copy, UI, or marketing. (The `🌍` fallback on the origin flag is the only exception.)
- **No icon font** (no Font Awesome, no Material Icons).
- **No illustration system** beyond the LogoEmblem SVG. Producer "stories" lean on photography, not vector illustration.
- **No unicode dingbats** beyond the editorial separators (`·`, `&bull;`, em-dash).

---

## Index — what lives in this design system

### Root files
- `README.md` — this document.
- `colors_and_type.css` — all color, type, spacing, radii, shadow, motion tokens as CSS variables (`--tv-*`).
- `SKILL.md` — Agent SKILL entry point; cross-compatible with Claude Code skills.

### `assets/`
- `logos/` — wordmark, three emblem variants, gold mark.
- `hero/` — full-bleed Tuscan vineyard, table photography.
- `products/` — eight product photographs (olive oil, honey ×2, tapenade, savon, paprika, truffle oil, vase).
- `producers/` — five producer portraits.
- `regions/` — five region landscapes (Italy, Germany, Spain, Portugal, France-lavender).
- `stories/` — four long-form story headers (Maremma, Black Forest, Provence, Alentejo).

### `preview/`
HTML cards that populate the Design System tab — palette, type specimens, spacing, components, brand.

### `ui_kits/marketplace/`
The Terravoa marketplace UI kit — JSX components and a clickable `index.html` demo recreating key screens (homepage, collection, producer profile, product detail).

### Fonts
Loaded from Google Fonts CDN at runtime (Noto Serif + Manrope). No local TTF files copied — the codebase itself uses `next/font/google`. **Flagged caveat:** if you need offline fonts, ask the user for licensed TTFs.
