---
name: terravoa-design
description: Use this skill to generate well-branded interfaces and assets for Terravoa, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Use `colors_and_type.css` (loaded via Google Fonts for Noto Serif + Manrope) as the foundational stylesheet, and copy any logos/photography you need from `assets/`.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. The Terravoa marketplace lives at `MyTerraVera/` and uses Tailwind tokens that mirror `colors_and_type.css` (`bg-primary`, `text-secondary`, `bg-surface-container-low`, `text-on-primary`, etc).

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Brand essentials (cheat sheet):
- "Taste the Origin." Editorial boutique marketplace for European artisan producers.
- Voice: slow, tactile, specific. Sentence case for UI; ALL CAPS tracked-out for eyebrows; italic Noto Serif for taglines. No emoji. The em-dash and middle dot (·) are signature.
- Type: Noto Serif (display, headlines, italic captions) + Manrope (everything else). High-contrast scale.
- Colors: forest green `#182a1b` for authority, terracotta `#944925` for warmth/CTA, warm-white surface stack (`#faf9f6` → `#ffffff`).
- Layout: generous whitespace (96px section padding), asymmetrical, never sectioned with 1px lines (shift surface tint).
- Imagery: warm, golden-hour, the maker mid-task. Never blue-cool, never grayscale.
- Iconography: Lucide at stroke 1.5. No icon font. No emoji.
- Animation: easeOut fades + 16-30px upward translate; slow image scale on hover (1.05–1.10 over 500ms+).

Then explore the UI kit at `ui_kits/marketplace/` for ready-to-use components (Navbar, Footer, ProductCard, Hero, Collection, ProductDetail, ProducerProfile).
