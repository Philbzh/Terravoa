# Design System Document: Editorial Boutique & Local Marketplace

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

This system moves away from the rigid, boxy constraints of traditional e-commerce. Instead, it treats the interface as a high-end lifestyle magazine—a blend of tactile craftsmanship and sophisticated modernism. We prioritize the "quiet" moments, using generous whitespace and intentional asymmetry to let the producer’s story breathe. The goal is to create an experience that feels human and slow, encouraging users to linger on the details of a hand-crafted olive oil or a small-batch terracotta vase rather than rushing to a checkout button.

To break the "template" look, designers should utilize:
*   **Intentional Asymmetry:** Off-center image alignments and overlapping typography.
*   **High-Contrast Scales:** Dramatic shifts between massive display serifs and tiny, precise labels.
*   **Organic Silhouettes:** Integrating product photography that breaks the rectangular frame.

---

## 2. Colors
Our palette is rooted in the European landscape—deep forests, sun-baked earth, and mineral sands.

### Tonal Strategy
*   **Primary (`#182a1b`) & Secondary (`#944925`):** Use these sparingly for moments of high authority (Primary) or call-to-action warmth (Secondary).
*   **The "No-Line" Rule:** Sectioning must never be achieved with 1px solid borders. Boundaries are defined solely by background shifts. For example, a `surface_container_low` section should transition directly into a `surface` background to denote a change in content without visual "noise."
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of fine paper. An element sitting on `surface` (`#faf9f6`) should use `surface_container_low` (`#f4f3f1`) for its container, and the most important interactive elements (like a search bar) should elevate to `surface_container_lowest` (`#ffffff`).
*   **Glass & Gradient Rule:** For floating navigation or product overlays, use Glassmorphism. Apply a semi-transparent `surface` color with a `20px` backdrop blur. Main CTAs should utilize a subtle linear gradient from `primary` (`#182a1b`) to `primary_container` (`#2d4030`) to give the button a "weight" and depth that flat color cannot replicate.

---

## 3. Typography
Typography is the voice of the curator. We pair the traditional weight of a serif with the functional clarity of a modern sans-serif.

*   **Display & Headlines (`notoSerif`):** These are the editorial anchors. Use `display-lg` (3.5rem) for hero statements and `headline-lg` (2rem) for section titles. Ensure generous line-height (1.2–1.4) to maintain the "boutique" feel.
*   **Body & Titles (`manrope`):** For all functional UI, descriptions, and metadata. `body-lg` (1rem) is the standard for storytelling. 
*   **Labels (`manrope`):** Use `label-md` (0.75rem) in all-caps with increased letter-spacing (+0.05em) for category tags and secondary navigation to mimic the "folio" look of luxury magazines.

---

## 4. Elevation & Depth
In a "quiet" UI, depth is felt, not seen. We avoid the heavy drop shadows of the early web in favor of ambient light.

*   **The Layering Principle:** Depth is achieved by stacking surface tokens. A card on `surface_container_lowest` creates a soft "lift" against a `surface_container_low` background without any shadow required.
*   **Ambient Shadows:** When a floating element (like a modal or floating cart) requires a shadow, use a large blur radius (30px-50px) at a very low opacity (4%-6%). The shadow color should be a dark tint of our `on_surface` (`#1a1c1a`), never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline_variant` (`#c3c8c0`) at 15% opacity. This creates a suggestion of a container rather than a hard boundary.
*   **Glassmorphism:** Use it to integrate elements. A frosted glass header allows the rich colors of producer photography to bleed through subtly as the user scrolls, maintaining a sense of place.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast `primary` background with `on_primary` text. Use `rounded-md` (0.75rem) or `rounded-full` for a more organic, boutique feel. 
*   **Secondary:** `surface_container_high` background with `on_surface` text. No border.
*   **Tertiary:** Text-only with an underline that sits 4px below the baseline, using the `secondary` (terracotta) color for a touch of warmth.

### Input Fields
*   **Style:** Minimalist. Use a `surface_container_low` background. Avoid four-sided boxes; use a bottom-only "ghost border" or a subtle color shift.
*   **Focus:** Transition the background to `surface_container_highest` and deepen the bottom border to `primary`.

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid the use of horizontal lines to separate list items. Use vertical white space (Spacing `8` or `10`) or alternating background tints (`surface` vs `surface_container_low`).
*   **Imagery:** Product cards must feature high-quality, art-directed photography. Use `rounded-lg` (1rem) for images to soften the layout and align with the "organic" aesthetic.

### Additional Signature Components
*   **The Story-Slide:** A wide-format component combining a `display-md` serif headline, a vertical "editorial" caption in `body-sm`, and an asymmetrical image placement.
*   **Producer Badges:** Small, circular `tertiary_fixed` (#feddb3) chips that denote "Handmade," "Organic," or "Local," using `label-sm` typography.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts where images overlap text containers slightly to create depth.
*   **Do** prioritize white space. If you think there is enough space, add one more increment from the Spacing Scale.
*   **Do** use the `tertiary` (charcoal/warm dark) colors for text on light backgrounds to avoid the harshness of pure black.
*   **Do** allow product images to have varied aspect ratios (3:4, 1:1, 16:9) to maintain an editorial, non-grid feel.

### Don't
*   **Don't** use 100% opaque, high-contrast borders for anything.
*   **Don't** use standard "Material Design" blue for links; use the `secondary` terracotta or `primary` forest green.
*   **Don't** clutter the screen. If a piece of information isn't vital to the "story" of the producer, hide it in a progressive disclosure or tooltip.
*   **Don't** use sharp, 0px corners. Every element should have at least a `sm` or `md` roundedness to feel approachable and "human."