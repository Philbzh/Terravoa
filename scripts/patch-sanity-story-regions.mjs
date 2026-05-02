/**
 * Terravoa — Ensure Journal stories in Sanity
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * What this script fixes
 * ──────────────────────
 * Two overlapping issues were found on 2026-05-02 while wiring the Journal
 * ↔ Regions ↔ Producers triangle:
 *
 *   1. Existing producer-feature stories in Sanity had their `region` field
 *      tagged with a **country name** ("Italy", "France") instead of the
 *      **specific region name** ("Tuscany", "Brittany") that the Journal's
 *      region filter joins on. → Retag.
 *
 *   2. The three purely editorial `regionGuide` stories (Tuscany, Brittany,
 *      and Black Forest guides) that live in `src/data/demo.ts` were never
 *      seeded into Sanity. Once Sanity is the active content source, those
 *      guides disappear from the Journal entirely. → Create.
 *
 * Both problems are addressed by this single script, which converges the
 * Sanity dataset to a known-good state. It is idempotent: running twice is
 * a no-op once the dataset is correct.
 *
 * Usage
 * ─────
 *    node scripts/patch-sanity-story-regions.mjs            # dry-run (default)
 *    node scripts/patch-sanity-story-regions.mjs --apply    # writes to Sanity
 *
 * The dry-run prints exactly what would be created and what would be patched.
 * Re-run with `--apply` to actually mutate the dataset.
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Env loading ──────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  const envPath = resolve(__dir, '..', '.env.local')
  try {
    const text = readFileSync(envPath, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      if (!(key in process.env)) process.env[key] = val
    }
  } catch {}
}

loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_TOKEN

if (!projectId || !token) {
  console.error('[patch] ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_TOKEN must be set in .env.local.')
  process.exit(1)
}

const apply = process.argv.includes('--apply')

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

console.log(`[patch] Project="${projectId}" dataset="${dataset}" mode="${apply ? 'APPLY' : 'DRY-RUN'}"`)

// ── Helpers ──────────────────────────────────────────────────────────────────

function slug(s) {
  return { _type: 'slug', current: s }
}

// ── Source of truth ──────────────────────────────────────────────────────────

/**
 * The canonical state of every Journal story. If a story with `slug` doesn't
 * exist in Sanity it will be created with these fields. If it exists but
 * `region` disagrees, `region` will be patched (nothing else is touched —
 * editors can hand-edit title/body/etc. in Studio without losing their work).
 *
 * Sources:
 *   - regionGuide bodies copied verbatim from `src/data/demo.ts`
 *   - producerFeatures already exist; we only verify their region tag
 */
const expected = [
  // ── Region guides (editorial, may be missing from Sanity) ────────────────
  {
    _id: 'story-tuscany-beyond-the-guidebooks',
    slug: 'tuscany-beyond-the-guidebooks',
    kind: 'regionGuide',
    region: 'Tuscany',
    title: 'Tuscany beyond the guidebooks',
    subtitle: 'Olive oil, hill towns, and what to taste before you browse our Tuscan cellar',
    excerpt:
      'Search "Tuscany food" and you get a flood of pasta shots. Here is the slower read: how terroir shows up on the plate, what distinguishes coastal Maremma from Chianti hills, and which makers we ship from the region.',
    body:
      "Tuscany is not one landscape but several. The Tyrrhenian coast around the Maremma brings salt air into the groves; inland, higher elevation and sharper nights concentrate flavour in the oil. Cold-pressed extra virgin is a label, but the real story is in harvest timing, varietal mix, and patience.\n\nIf you visit, skip the checklist rush. Market mornings in small towns, a single slow lunch, and one producer visit beat a dozen photo stops. Look for oils with harvest year on the bottle, ask which plots the fruit came from, and trust your nose: grass, artichoke, pepper are signs of life—not defects.\n\nOn Terravoa we work with growers who still think in generations, not campaigns. Our Tuscan selection is built around those relationships: browse the collection filtered by Italy, then open each producer to see how their land shows up in the jar.",
    author: 'Terravoa Editorial',
    date: '2026-01-18',
    readTime: '9 min',
  },
  {
    _id: 'story-brittany-salt-marshes-and-table-traditions',
    slug: 'brittany-salt-marshes-and-table-traditions',
    kind: 'regionGuide',
    region: 'Brittany',
    title: 'Brittany: salt marshes, butter, and Atlantic edge',
    subtitle: 'What people look for when they type "Brittany food"—and how to shop it with intent',
    excerpt:
      "From galettes to salted butter, Brittany's identity is tied to the coast and the dairy belt. This is not a travel itinerary; it is a lens for understanding why certain flavours feel \"Breton\" and how we curate makers who respect that lineage.",
    body:
      "Brittany's culinary fame rests on contrast: the minerality of hand-harvested sea salt against the richness of cultured butter, the sharpness of cider against sweet buckwheat crêpes. Visitors often start with crêperies; the deeper story is in raw materials—milk from coastal pastures, wheat from local mills, salt from the Guérande marshes.\n\nYou do not need to tour every marsh to eat well. When shopping online, look for PDO or small-batch labels, short ingredient lists, and producers who name their geography. We are steadily expanding our Breton roster; meanwhile, explore our French cellar and filter by region to see who we partner with today.\n\nTerravoa exists to connect curious eaters with verifiable origin. If Brittany is your entry point, let it lead you into the shop—every product page names the hands behind it.",
    author: 'Terravoa Editorial',
    date: '2026-01-08',
    readTime: '8 min',
  },
  {
    _id: 'story-black-forest-meadows-and-honey',
    slug: 'black-forest-meadows-and-honey',
    kind: 'regionGuide',
    region: 'Black Forest',
    title: 'The Black Forest: meadows, honey, and slow craft',
    subtitle: 'Why "Schwarzwald" shows up in search—and what to notice in the jar',
    excerpt:
      "Germany's south-west is forest, meadow, and meticulous craft. Honey here is not generic \"sweet\"; it is a map of bloom cycles. Use this note to orient yourself before you explore our German producers.",
    body:
      "The Black Forest is a patchwork of altitude and microclimate. Wildflower honey from valley meadows tastes nothing like fir honey from higher stands. Small-batch beekeepers move hives with the bloom; industrial brands homogenise. The difference is obvious side by side.\n\nWhen you read labels, \"cold extracted\" and \"unfiltered\" matter: heat strips aroma. Pair honey with cheese from the same hills when you can—it is the simplest way to taste place.\n\nWe work with apiarists who treat each location as a vintage. From this page you can jump to our German collection and meet the makers behind each jar.",
    author: 'Terravoa Editorial',
    date: '2025-12-12',
    readTime: '7 min',
  },

  // ── Producer features (already in Sanity, may need region retag only) ────
  // We do NOT re-create these — they already exist with editor-authored data.
  // `create: false` means: if missing, skip with a warning (don't overwrite
  // the seed script's version of the body/etc.). If present with wrong region,
  // patch only the `region` field.
  { _id: null, slug: 'liquid-gold-of-the-maremma',      region: 'Tuscany',      create: false },
  { _id: null, slug: 'bees-of-the-black-forest',        region: 'Black Forest', create: false },
  { _id: null, slug: 'lavender-lessons-from-provence',  region: 'Provence',     create: false },
  { _id: null, slug: 'clay-and-fire-in-alentejo',       region: 'Alentejo',     create: false },
]

// ── Fetch current state ──────────────────────────────────────────────────────

const allSlugs = expected.map((e) => e.slug)

const current = await client.fetch(
  `*[_type == "story" && slug.current in $slugs]{ _id, "slug": slug.current, region, kind }`,
  { slugs: allSlugs },
)

const currentBySlug = new Map(current.map((doc) => [doc.slug, doc]))

// ── Plan actions ─────────────────────────────────────────────────────────────

let plannedCreates  = 0
let plannedPatches  = 0
let alreadyCorrect  = 0
let skippedMissing  = 0

for (const target of expected) {
  const existing = currentBySlug.get(target.slug)

  if (!existing) {
    if (target.create === false) {
      skippedMissing++
      console.log(`[patch] · "${target.slug}" not in Sanity (producer-feature, would need seed script) — skipped`)
      continue
    }
    plannedCreates++
    console.log(`[patch] + CREATE "${target.slug}" as regionGuide tagged "${target.region}"`)
    if (apply) {
      await client.createIfNotExists({
        _id: target._id,
        _type: 'story',
        kind: target.kind,
        slug: slug(target.slug),
        title: target.title,
        subtitle: target.subtitle,
        excerpt: target.excerpt,
        body: target.body,
        author: target.author,
        date: target.date,
        readTime: target.readTime,
        region: target.region,
      })
      console.log(`        ✓ created`)
    }
    continue
  }

  if (existing.region === target.region) {
    alreadyCorrect++
    console.log(`[patch] ✓ "${target.slug}" already tagged "${target.region}"`)
    continue
  }

  plannedPatches++
  console.log(`[patch] → PATCH "${target.slug}": region "${existing.region ?? '(empty)'}" → "${target.region}"`)
  if (apply) {
    await client.patch(existing._id).set({ region: target.region }).commit()
    console.log(`        ✓ patched`)
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('')
console.log(`[patch] Summary:`)
console.log(`        · ${alreadyCorrect} already correct`)
console.log(`        · ${plannedCreates} to create (region guides)`)
console.log(`        · ${plannedPatches} to patch (region rename)`)
if (skippedMissing > 0) {
  console.log(`        · ${skippedMissing} producer-feature(s) missing from Sanity — run scripts/seed-sanity.mjs to add them`)
}

if (!apply && (plannedCreates + plannedPatches) > 0) {
  console.log('')
  console.log('[patch] This was a dry run. Re-run with  --apply  to write the changes.')
} else if (apply && (plannedCreates + plannedPatches) > 0) {
  console.log('')
  console.log('[patch] Done. Hard-reload /stories in your browser (Sanity\'s CDN cache is bypassed by useCdn:false in the app).')
}
