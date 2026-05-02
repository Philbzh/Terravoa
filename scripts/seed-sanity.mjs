/**
 * Terravoa — Sanity seed script
 * ─────────────────────────────────────────────────────────────────────────────
 * Creates realistic example documents in your Sanity dataset so the frontend
 * renders real content instead of the demo fallback.
 *
 * Prerequisites
 * ─────────────
 * 1. In sanity.io/manage → your project → API → Tokens, create a token with
 *    "Editor" (or "Administrator") permissions. Copy the value.
 * 2. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are
 *    set in your .env.local (or export them in your shell before running).
 * 3. Set the write token:
 *      export SANITY_TOKEN="sk..."
 *
 * Run
 * ───
 *    node scripts/seed-sanity.mjs
 *
 * The script uses createOrReplace with stable _id values, so it is safe to
 * re-run — it will simply overwrite the existing documents without duplicating.
 *
 * Documents created
 * ─────────────────
 *   7 × region    (cultural territories: Brittany, Tuscany, Black Forest, Andalusia, Alentejo, Alsace, Provence)
 *   5 × producer  (one per region covered)
 *   8 × product   (spread across producers)
 *   4 × story     (one per region covered)
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ── Config ────────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url))

/** Try to load .env.local so the script works without a shell export step. */
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
  } catch {
    // .env.local is optional — values may come from the shell
  }
}

loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_TOKEN

if (!projectId) {
  console.error(
    '[seed] ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.\n' +
    '       Add it to .env.local or export it in your shell.',
  )
  process.exit(1)
}

if (!token) {
  console.error(
    '[seed] ERROR: SANITY_TOKEN is not set.\n' +
    '       Create an Editor/Administrator token at https://sanity.io/manage\n' +
    '       and export it: export SANITY_TOKEN="sk..."',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

console.log(`[seed] Targeting project="${projectId}" dataset="${dataset}"`)

// ── Helper ────────────────────────────────────────────────────────────────────

/** Slug object as Sanity expects it */
function slug(s) {
  return { _type: 'slug', current: s }
}

/** Reference object */
function ref(id) {
  return { _type: 'reference', _ref: id }
}

/** Inline object inside an array needs a _key */
function keyed(obj) {
  return { ...obj, _key: Math.random().toString(36).slice(2, 10) }
}

// ── Document definitions ──────────────────────────────────────────────────────

// ── 1. REGIONS ────────────────────────────────────────────────────────────────

const regions = [
  {
    _id: 'region-brittany',
    _type: 'region',
    name: 'Brittany',
    slug: slug('brittany'),
    country: 'France',
    specialty: 'Fleur de Sel · Salted Caramel · Butter Biscuits',
    description:
      'Where the Atlantic meets ancient salt marshes — Brittany is the home of fleur de sel, beurre salé, and centuries of maritime craft.',
    longDescription:
      "Stand at the edge of the Guérande peninsula at low tide and the landscape looks like the surface of another planet — a vast chessboard of shallow basins, clay channels, and mirrored pools stretching to the horizon. The paludiers who work here have done so for over a thousand years, harvesting fleur de sel with flat wooden rakes called lousse, skimming the crystalline crust that forms on the surface on still, sunny evenings.\n\nThe salt is never washed, never processed. It carries the faint violet scent of algae and the mineral memory of the Atlantic — a flavour that no industrial substitute has ever replicated. Chefs across France insist on it. Once you understand why, you will too.\n\nBrittany's culinary identity is shaped entirely by salt. It transforms butter into beurre salé, one of the great regional products of France. Breton pastry chefs fold it into kouign-amann — a caramelised butter cake that requires no refinement — and into the salted caramels that have travelled the world from their origins in this windswept peninsula.\n\nThe coast provides everything else: langoustines pulled from cold waters at dawn, buckwheat grown in fields a few kilometres inland, and cider pressed from local apple orchards where the trees are gnarled and old. Breton cuisine is generous and unpretentious — food that feeds people who work hard in a harsh, beautiful landscape.\n\nThe Terravoa selection from Brittany focuses on the region's most irreplaceable products: certified fleur de sel from the Guérande cooperative, salted butter caramels made by small confiseries in the interior, and sablé biscuits baked with butter so good it barely needs anything else.",
    productCount: 2,
    producerCount: 1,
  },
  {
    _id: 'region-tuscany',
    _type: 'region',
    name: 'Tuscany',
    slug: slug('tuscany'),
    country: 'Italy',
    specialty: 'Olive Oil · Truffles · Pasta',
    description:
      'From the silver-leaved groves of the Maremma to the truffle forests of the Crete Senesi — Tuscany is the gold standard of Italian artisanship.',
    longDescription:
      "The Frantoio olive tree is stubborn and slow. It takes ten years to produce its first meaningful harvest, thirty to reach its prime, and some of the trees currently bearing fruit in the Maremma have been doing so for four centuries. That patience is baked into every bottle of Tuscan extra virgin olive oil — an unhurried relationship between farmer, tree, and land that modern agriculture has largely forgotten.\n\nAt harvest, timing is everything. The olives must be pressed within hours of picking, before oxidation begins to dull the flavour. The result — when done right — is an oil with a grassy, peppery bite that stands up to cooking and rewards a simple bruschetta more than any sauce ever could.\n\nThe Crete Senesi, the chalk-white clay hills south of Siena, offer the region's other great luxury: black truffles. In autumn, truffle hunters set out before dawn with their lagotto dogs, working in near-silence through oak and hazelnut forest. The truffle yield is unpredictable, seasonal, and entirely dependent on the weather — which is exactly why it commands the prices it does.\n\nTuscany has always attracted artisans drawn by the quality of its raw materials. The olive oil, the truffles, the pecorino aged in tufa caves in Pienza, the hand-rolled pici pasta made from a single ingredient — all of it reflects a culture of restraint that knows when a product is already perfect and leaves it alone.\n\nThe Terravoa selection centres on the Rossi Estate — a family operation in the Maremma producing single-estate cold-pressed oil from century-old trees — alongside seasonal truffle products and aged Tuscan cheeses when the harvest allows.",
    productCount: 2,
    producerCount: 1,
  },
  {
    _id: 'region-black-forest',
    _type: 'region',
    name: 'Black Forest',
    slug: slug('black-forest'),
    country: 'Germany',
    specialty: 'Wildflower Honey · Smoked Ham · Spiced Cakes',
    description:
      'Ancient pine forest, wildflower meadows, and a tradition of craft that runs as deep as the valleys — the Black Forest is Germany at its most elemental.',
    longDescription:
      "The Schwarzwald earns its name. Seen from above, the canopy closes over the landscape like a dark cloak, the light filtering down through layers of pine and fir in a way that feels ancient and deliberate. The forest has shaped the people who live here for centuries — their food, their craft, their unhurried relationship with the natural world.\n\nThe meadows that interrupt the forest are where the beekeepers work. Hives are placed in clearings chosen for their wildflower diversity — linden groves, heather banks, slopes thick with clover and borage. Each site produces a distinct honey, and the serious producers keep them separate, treating each meadow like a winemaker treats a single vineyard plot.\n\nHans Weber of Schwarzwald Imkerei has been managing hives here for over thirty-five years. His honey is never heated, never filtered — it arrives at your table exactly as the bees made it, enzyme-rich and crystallising naturally, which is the clearest sign of quality. Industrial honey stays liquid because it has been heated to prevent crystallisation. Raw honey does not.\n\nThe forest also sustains a tradition of charcuterie unlike anywhere else in Europe. Schwarzwälder Schinken — Black Forest ham — is cold-smoked over fir branches and cured for weeks in mountain air. The spiced cakes — Schwarzwälder Kirschwasser, Baumkuchen, and the dense Lebkuchen variants of the region — carry the flavours of the forest itself: pine resin, dark cherry, warm spice.\n\nFrom the Black Forest, Terravoa sources raw wildflower and acacia honey from the Schwarzwald Imkerei, alongside seasonal smoked goods from small family producers in the Kinzig Valley.",
    productCount: 2,
    producerCount: 1,
  },
  {
    _id: 'region-andalusia',
    _type: 'region',
    name: 'Andalusia',
    slug: slug('andalusia'),
    country: 'Spain',
    specialty: 'Paprika · Saffron · Preserves',
    description:
      'Eight centuries of Moorish influence, an abundance of sun, and a fierce pride in local produce — Andalusia turns simple ingredients into extraordinary ones.',
    longDescription:
      "The spice trade left its fingerprints all over Andalusian cooking. Saffron cultivated in the highlands, cumin ground with a heavy hand, paprika smoked over oak fires in the valleys of Extremadura just over the border — the flavours carry the memory of a culture that understood, a thousand years ago, what European cooking is only now catching up with.\n\nIn the huerta — the great irrigated garden that stretches across the Murcian lowlands at the eastern edge of Andalusia — the growing season is almost continuous. Tomatoes planted in January are harvested by March. Peppers ripen in summer to a sweetness that only extended sun exposure produces. The produce is processed immediately: dried under the Levantine sun, preserved in local olive oil, or smoked in wood-fired chambers that fill the valleys with a scent that carries for kilometres.\n\nThe pimentón de la Vera is one of Spain's most distinctive products — paprika smoked over holm oak in a designated zone of Extremadura, where the climate slows the drying and deepens the flavour. Authentic pimentón is sweet, complex, and irreplaceable. Nothing industrial tastes remotely similar.\n\nThe olive oil of Andalusia — particularly the varieties from Jaén province — accounts for a quarter of the world's olive oil production. Much of it is bulk commodity oil. But the small estates working with Picual and Hojiblanca olives, pressing early in the season for maximum polyphenol content, produce oils that rival Tuscany at its best.\n\nTerravoa's Andalusian selection comes primarily from Casa del Sol, a family operation in the Murcian huerta producing sun-dried tomato tapenades and smoked paprika products using purely artisanal methods and produce from their own garden.",
    productCount: 2,
    producerCount: 1,
  },
  {
    _id: 'region-alentejo',
    _type: 'region',
    name: 'Alentejo',
    slug: slug('alentejo'),
    country: 'Portugal',
    specialty: 'Cork · Wine · Sheep Cheese',
    description:
      'Rolling plains of cork oak, ancient terracotta, and a pace of life governed by the seasons — the Alentejo is Portugal in its most elemental form.',
    longDescription:
      "The Alentejo occupies a third of Portugal's land area and holds a fraction of its population. It is a landscape of long views — cork oaks scattered across golden grassland, white-walled villages rising from low hills, storks nesting on every chimney stack. The light here is different from the coast: heavier, more horizontal, pressing down on everything in the midday heat.\n\nThe cork oaks are the defining feature. Harvested every nine years — never more frequently, or the tree is damaged — the bark is stripped in panels during early summer and left to cure in stacks before processing. Portugal produces over half the world's cork, and most of it comes from this region. The harvest is unhurried work, done by hand with specialist axes, and the bark peels away in sheets that reveal the raw, orange-red wood beneath.\n\nThe terracotta tradition is equally deep-rooted. The clay of the Alentejo has been worked since the Romans, and the forms have barely changed — the same rounded amphora shapes, the same coil-built water jugs, the same shallow pots used for slow-roasted meats. João Santos of Atelier Alentejo works entirely within this tradition, hand-throwing on a kick wheel and firing in a wood-burning kiln on his own property.\n\nQueijo de Ovelha — sheep's cheese — is made across the region in forms ranging from fresh and lemony to aged and crystalline. The sheep graze on the same land as the cork oaks, feeding on wild grasses and herbs that give the milk its character.\n\nFrom the Alentejo, Terravoa sources hand-thrown terracotta ceramics from Atelier Alentejo, along with cork products and aged sheep cheeses when available from partner producers.",
    productCount: 1,
    producerCount: 1,
  },
  {
    _id: 'region-alsace',
    _type: 'region',
    name: 'Alsace',
    slug: slug('alsace'),
    country: 'France',
    specialty: 'Charcuterie · Mustard · Christmas Spices',
    description:
      'Wedged between the Rhine and the Vosges mountains, Alsace is a living crossroads of French and German tradition — in its architecture, its food, and its wines.',
    longDescription:
      "The houses in Colmar lean over the canal in shades of ochre, rose, and pistachio, their timber frames blackened with age. The street signs are in French and German simultaneously. The menu — if you are eating in the right place — will offer choucroute garnie alongside foie gras, Riesling alongside vin gris. Alsace has been passed between France and Germany four times in living memory, and it has responded by becoming something uniquely its own.\n\nThe mustard of Alsace is made with the Vosges spring water that runs down from the mountains and a grain ratio that produces a texture unlike Dijon — coarser, more rustic, with a warmth that builds slowly. The charcuterie reflects the German inheritance: smoked saucisses, cured lard, and the extraordinary presskopf — a pressed terrine of pork and herbs set in natural jelly.\n\nThe wine is the region's greatest product. The Rieslings of the Alsace grand cru vineyards are among the most complex white wines in the world — dry and mineral in the south, richer and more honeyed in the north, with a capacity to age that surprises even their producers. The Gewurztraminers, full of lychee and rose petal, are unlike anything grown elsewhere.\n\nAt Christmas, Alsace becomes the template that the rest of the world imitates. Bredele — the small, spiced biscuits baked in every household — fill the markets from late November. Pain d'épices, the dense spiced bread made with rye flour and a minimum aging of three weeks, carries the scent of anise, cinnamon, and clove in every slice.\n\nFrom Alsace, Terravoa sources artisan mustard, pain d'épices, and Christmas spice blends from small family producers in the Bas-Rhin.",
    productCount: 1,
    producerCount: 0,
  },
  {
    _id: 'region-provence',
    _type: 'region',
    name: 'Provence',
    slug: slug('provence'),
    country: 'France',
    specialty: 'Lavender · Savon · Herbs de Provence',
    description:
      'Sun, stone, lavender, and olive oil — Provence has been producing artisanal goods since the Romans planted the first vines and olive trees two thousand years ago.',
    longDescription:
      "The Romans understood Provence. They planted olive trees on south-facing slopes, drained the salt pans of the Camargue, built mills along every fast-moving river. Two thousand years later, the landscape they shaped is still producing food and goods using methods that have not changed in any fundamental way.\n\nThe lavender plateau of Valensole is the image most associated with the region — long purple rows receding to the horizon, bees working in the drowsy heat, the scent so thick it feels almost edible. The bloom lasts three weeks in July. The oil content peaks just before the flowers fully open. The window is narrow, and the producers who work it — the real ones, using lavandin or true lavender and not industrial substitutes — time everything to that single moment.\n\nClaire Dupont of Maison Lavande has worked this plateau for over a decade. She distills her own essential oil and uses it to make cold-process soap, mixing it with organic olive oil at room temperature to preserve the delicate aromatic compounds that heat would destroy. Each bar cures for six weeks before it is sold.\n\nThe olive oil of the Alpilles and the Baux de Provence appellation is designated by its own AOC — one of only five olive oil AOCs in France. The Salonenque and Aglandau varieties produce an oil that is softer and more fruity than Tuscan oil, better suited to raw applications and delicate fish.\n\nHerbes de Provence — the dried blend of thyme, rosemary, oregano, marjoram, and lavender — originated here not as a supermarket product but as the natural result of an abundance of wild herbs growing on the garrigue, the fragrant scrubland that covers the limestone hills between the coast and the mountains.\n\nFrom Provence, Terravoa sources cold-process lavender soap and lavender essential oil from Maison Lavande in Valensole, alongside small-batch herbal products from partner producers across the region.",
    productCount: 1,
    producerCount: 1,
  },
]

// ── 2. PRODUCERS ──────────────────────────────────────────────────────────────

const producers = [
  {
    _id: 'producer-rossi-estate',
    _type: 'producer',
    name: 'Rossi Estate',
    slug: slug('rossi-estate'),
    region: 'Tuscany',
    country: 'Italy',
    specialty: 'Olive Oil',
    tagline: 'Four centuries of liquid gold',
    storyHeadline: 'Traditional Know-How from the Rossi Estate',
    story:
      "For four generations, the Rossi family has tended to the silver-leaved groves that line the ridge of the Maremma. Matteo Rossi, the current custodian, views himself less as a producer and more as a temporary guardian of a landscape that has remained unchanged since the Renaissance.\n\nThe journey of a Rossi olive begins in the silence of the dawn. Unlike industrial operations, Matteo insists on hand-harvesting — a slow, rhythmic labour that respects the integrity of each drupe and the health of the ancient trees, some of which have witnessed over four centuries of Tuscan history.",
    quote: "The secret isn't in the press, it's in the patience.",
    established: '1640',
    badges: ['Organic', 'Family-Owned'],
    savoirFaire: [
      keyed({
        _type: 'object',
        title: 'Manual Harvest',
        description:
          'Individual hand-picking ensures only the perfectly ripe olives are selected, avoiding the bruising common in mechanical harvesting.',
      }),
      keyed({
        _type: 'object',
        title: 'Cold Extraction',
        description:
          "Within six hours of harvest, olives are pressed at temperatures never exceeding 27°C to preserve their delicate polyphenols and intense aroma.",
      }),
      keyed({
        _type: 'object',
        title: 'Restful Decantation',
        description:
          'The oil is allowed to settle naturally in steel fusti rather than being forced through filters, maintaining its full-bodied character.',
      }),
    ],
  },
  {
    _id: 'producer-maison-lavande',
    _type: 'producer',
    name: 'Maison Lavande',
    slug: slug('maison-lavande'),
    region: 'Provence',
    country: 'France',
    specialty: 'Savon & Lavender',
    tagline: 'The scent of Provence, bottled',
    storyHeadline: 'Patience and Petals in the Fields of Valensole',
    story:
      "Surrounded by endless lavender fields in Valensole, Claire Dupont distills essential oils and crafts artisanal soaps using cold-process methods. Her ingredients are harvested by hand during the brief July bloom, when the oil content is at its peak. Each bar of savon is cured for six weeks before it reaches your hands.\n\nThe lavender blooms for exactly three weeks in July. Miss the window, and you wait another year. Claire has been timing this harvest for over a decade, and she still gets nervous as June turns to July.",
    quote: 'Lavender teaches you to wait. Rushed oil has no soul.',
    established: '2012',
    badges: ['Organic', 'Artisanal'],
    savoirFaire: [
      keyed({
        _type: 'object',
        title: 'Peak Harvest',
        description:
          'The oil content peaks just before the flowers fully open. Claire harvests by hand during the brief three-week July window when the lavender is at its most potent.',
      }),
      keyed({
        _type: 'object',
        title: 'Cold-Process Soap',
        description:
          'Lavender oil is mixed with organic olive oil at room temperature, preserving the delicate scent that hot-process methods would destroy.',
      }),
      keyed({
        _type: 'object',
        title: 'Six-Week Cure',
        description:
          "Each bar is poured into wooden moulds and left to cure for six weeks in a cool barn — slow, unhurried, and exactly as her grandmother taught her.",
      }),
    ],
  },
  {
    _id: 'producer-casa-del-sol',
    _type: 'producer',
    name: 'Casa del Sol',
    slug: slug('casa-del-sol'),
    region: 'Andalusia',
    country: 'Spain',
    specialty: 'Preserves',
    tagline: 'Sun-dried traditions of the Mediterranean',
    storyHeadline: 'Sun, Salt, and Time in the Murcian Huerta',
    story:
      "María García learned the art of preserving from her grandmother in a sun-baked kitchen overlooking the huerta of Murcia. Her sun-dried tomato tapenade and pepper preserves use only produce from her family's garden, dried slowly under the Levantine sun. No shortcuts, no additives — just sun, salt, and time.\n\nEvery jar begins in the garden. María grows her own tomatoes, peppers, and herbs in soil that her family has tended for three generations.",
    quote: 'My grandmother said: the sun is the best chef.',
    established: '2005',
    badges: ['Handmade', 'Local'],
    savoirFaire: [
      keyed({
        _type: 'object',
        title: 'Garden-to-Jar',
        description:
          "Every ingredient is grown in María's own family garden, harvested at peak ripeness and processed the same day.",
      }),
      keyed({
        _type: 'object',
        title: 'Sun-Drying',
        description:
          'Tomatoes and peppers are dried slowly under the Levantine sun for up to three days, concentrating their natural sweetness.',
      }),
      keyed({
        _type: 'object',
        title: 'No Additives',
        description:
          'Nothing artificial ever enters the kitchen. Just sun, salt, olive oil, and time — exactly as her grandmother taught her.',
      }),
    ],
  },
  {
    _id: 'producer-atelier-alentejo',
    _type: 'producer',
    name: 'Atelier Alentejo',
    slug: slug('atelier-alentejo'),
    region: 'Alentejo',
    country: 'Portugal',
    specialty: 'Ceramics',
    tagline: 'Earth shaped by hand',
    storyHeadline: 'Clay and Fire in the Alentejo Plains',
    story:
      "In the quiet plains of the Alentejo, ceramicist João Santos shapes terracotta using techniques unchanged for centuries. Each piece is hand-thrown on a kick wheel, dried in the open air, and fired in a wood-burning kiln. The result is pottery that carries the warmth of the Portuguese earth in every curve.\n\nJoão's workshop smells of wet earth and wood smoke. The kick wheel spins with a rhythm that is almost musical.",
    quote: "The clay knows what it wants to become. I just listen.",
    established: '1998',
    badges: ['Handmade', 'Traditional'],
    savoirFaire: [
      keyed({
        _type: 'object',
        title: 'Hand-Thrown',
        description:
          "Every piece is individually shaped on a traditional kick wheel — a massive stone disc powered by foot, producing pottery with the unmistakable touch of the maker's hand.",
      }),
      keyed({
        _type: 'object',
        title: 'Natural Clay',
        description:
          "Terracotta comes from a pit on João's own land, dug and weathered for months before it's ready to work — ensuring each piece carries the earth of the Alentejo.",
      }),
      keyed({
        _type: 'object',
        title: 'Wood-Fired Kiln',
        description:
          "Firing takes 14 hours in a wood-burning kiln. João sleeps beside it through the night, watching the colour of the flames to judge the temperature by instinct.",
      }),
    ],
  },
  {
    _id: 'producer-schwarzwald-imkerei',
    _type: 'producer',
    name: 'Schwarzwald Imkerei',
    slug: slug('schwarzwald-imkerei'),
    region: 'Black Forest',
    country: 'Germany',
    specialty: 'Honey',
    tagline: 'Wild honey from ancient forests',
    storyHeadline: 'Listening to the Hives of the Black Forest',
    story:
      "Deep in the Black Forest, beekeeper Hans Weber tends to over 200 hives scattered across wildflower meadows and pine-covered hillsides. His honey is never heated or filtered — it arrives at your table exactly as the bees made it. Each jar captures the essence of a specific meadow, a specific season.\n\nHans doesn't wear gloves. \"The bees know if you're afraid,\" he explains, lifting a frame thick with golden honeycomb. \"And they know if you're gentle.\"",
    quote: 'Every jar is a snapshot of a meadow in bloom.',
    established: '1987',
    badges: ['Raw', 'Handmade'],
    savoirFaire: [
      keyed({
        _type: 'object',
        title: 'Wild Foraging Sites',
        description:
          'Hives are placed in carefully chosen wildflower meadows and forest clearings, each producing a distinct honey with a unique terroir.',
      }),
      keyed({
        _type: 'object',
        title: 'Zero Processing',
        description:
          "The honey is never heated, never filtered. It arrives at your table exactly as the bees made it — raw, alive, and full of enzymes.",
      }),
      keyed({
        _type: 'object',
        title: 'Seasonal Harvesting',
        description:
          'Each harvest is kept separate by meadow and season, like a winemaker with different vineyard plots, preserving unique flavour profiles.',
      }),
    ],
  },
]

// ── 3. PRODUCTS ───────────────────────────────────────────────────────────────
// price is stored in cents (integer)

const products = [
  {
    _id: 'product-extra-virgin-cold-pressed-oil',
    _type: 'product',
    name: 'Extra Virgin Cold-Pressed Oil',
    slug: slug('extra-virgin-cold-pressed-oil'),
    price: 3200,
    origin: 'Tuscany',
    producer: ref('producer-rossi-estate'),
    category: 'Oils',
    description:
      "A single-estate olive oil from century-old Frantoio trees. Cold-pressed within hours of harvest, this oil has a robust, peppery character with notes of fresh-cut grass and artichoke.",
    details: ['500ml glass bottle', 'Cold-pressed', 'Single estate', 'Harvest 2025'],
    badge: { label: 'Organic', variant: 'producer' },
  },
  {
    _id: 'product-truffle-infused-olive-oil',
    _type: 'product',
    name: 'Truffle-Infused Olive Oil',
    slug: slug('truffle-infused-olive-oil'),
    price: 4500,
    origin: 'Tuscany',
    producer: ref('producer-rossi-estate'),
    category: 'Oils',
    description:
      "Extra virgin olive oil infused with fresh black truffle shavings from the Umbrian hills. A luxurious finishing oil for risotto, eggs, or fresh pasta.",
    details: ['250ml bottle', 'Real truffle shavings', 'Cold-infused', 'Limited batch'],
  },
  {
    _id: 'product-lavender-savon-de-marseille',
    _type: 'product',
    name: 'Lavender Savon de Marseille',
    slug: slug('lavender-savon-de-marseille'),
    price: 1200,
    origin: 'Provence',
    producer: ref('producer-maison-lavande'),
    category: 'Body Care',
    description:
      "Cold-process soap made with pure lavender essential oil from Valensole and organic olive oil. Cured for six weeks for a gentle, long-lasting bar that soothes and nourishes.",
    details: ['150g bar', 'Cold-process', '6-week cure', 'Organic ingredients'],
    badge: { label: 'Organic', variant: 'producer' },
  },
  {
    _id: 'product-sun-dried-tomato-tapenade',
    _type: 'product',
    name: 'Sun-Dried Tomato Tapenade',
    slug: slug('sun-dried-tomato-tapenade'),
    price: 1450,
    origin: 'Andalusia',
    producer: ref('producer-casa-del-sol'),
    category: 'Preserves',
    description:
      "Ripe tomatoes from the Murcian huerta, sun-dried for three days and blended with local olive oil, capers, and a whisper of smoked paprika. Perfect on crusty bread or stirred into pasta.",
    details: ['200g jar', 'Sun-dried', 'No preservatives', 'Vegan'],
    badge: { label: 'Bestseller', variant: 'bestseller' },
  },
  {
    _id: 'product-smoked-paprika-flakes',
    _type: 'product',
    name: 'Smoked Paprika Flakes',
    slug: slug('smoked-paprika-flakes'),
    price: 950,
    origin: 'Andalusia',
    producer: ref('producer-casa-del-sol'),
    category: 'Spices',
    description:
      "Pimientos de la Vera, slowly smoked over holm oak for two weeks, then hand-crushed into delicate flakes. Adds depth and warmth to any dish.",
    details: ['75g tin', 'Oak-smoked', 'Hand-crushed', 'Single origin'],
  },
  {
    _id: 'product-hand-thrown-terracotta-vase',
    _type: 'product',
    name: 'Hand-Thrown Terracotta Vase',
    slug: slug('hand-thrown-terracotta-vase'),
    price: 8500,
    origin: 'Alentejo',
    producer: ref('producer-atelier-alentejo'),
    category: 'Ceramics',
    description:
      "Each vase is individually hand-thrown on a traditional kick wheel and fired in a wood-burning kiln. The natural terracotta develops a unique patina over time, making every piece one of a kind.",
    details: ['Height: 25cm', 'Hand-thrown', 'Wood-fired', 'Each piece unique'],
  },
  {
    _id: 'product-wildflower-forest-honey',
    _type: 'product',
    name: 'Wildflower Forest Honey',
    slug: slug('wildflower-forest-honey'),
    price: 1800,
    origin: 'Black Forest',
    producer: ref('producer-schwarzwald-imkerei'),
    category: 'Honey',
    description:
      "Unfiltered, raw honey from wildflower meadows at the edge of the Black Forest. Complex and floral with hints of pine resin and heather. Crystallises naturally over time.",
    details: ['350g glass jar', 'Raw & unfiltered', 'Single-origin meadow', 'Summer 2025'],
  },
  {
    _id: 'product-acacia-honey',
    _type: 'product',
    name: 'Acacia Honey',
    slug: slug('acacia-honey'),
    price: 2200,
    origin: 'Black Forest',
    producer: ref('producer-schwarzwald-imkerei'),
    category: 'Honey',
    description:
      "Light, delicate, and slow to crystallise. This single-varietal acacia honey has a mild, floral sweetness that makes it perfect for tea, yogurt, or simply on warm bread.",
    details: ['500g glass jar', 'Single-varietal', 'Raw', 'Spring harvest'],
  },
]

// ── 4. STORIES ────────────────────────────────────────────────────────────────

const stories = [
  {
    _id: 'story-liquid-gold-of-the-maremma',
    _type: 'story',
    kind: 'regionGuide',
    title: 'The Liquid Gold of the Maremma',
    slug: slug('liquid-gold-of-the-maremma'),
    subtitle: 'A week with Matteo Rossi in his Tuscan olive groves',
    excerpt:
      "In the heart of Tuscany, Matteo Rossi continues a tradition that spans four centuries. His artisanal cold-pressing techniques preserve the volatile aromas of the earth.",
    body:
      "The morning mist clings to the Maremma hills like a silk veil. Matteo Rossi is already in the grove, his weathered hands checking the Frantoio olives for the telltale blush of purple that signals readiness. \"You can't rush the trees,\" he says, pulling a branch down to eye level. \"They give when they're ready.\"\n\nThe Rossi estate sits at 300 metres, high enough for the cold autumn nights that concentrate the oil's polyphenols. The grove holds 2,000 trees, some over 400 years old, their trunks twisted into shapes that seem to tell their own stories.\n\nHarvest happens in a single, intense week. The family and a small team of trusted neighbours work from dawn until dark, hand-picking olives into woven baskets. Within four hours of picking, the olives are in the press — a modern granite mill that Matteo insists produces a cleaner oil than the old wooden ones.\n\nThe result is an oil of extraordinary complexity: grassy and peppery, with a finish that lingers like a good memory. Each bottle is numbered, each vintage unique. This year's harvest yielded just 800 bottles — and when they're gone, they're gone until next November.",
    author: 'Terravoa Editorial',
    date: '2025-11-15',
    readTime: '8 min',
    region: 'Tuscany',
    producer: ref('producer-rossi-estate'),
  },
  {
    _id: 'story-bees-of-the-black-forest',
    _type: 'story',
    title: 'The Bees of the Black Forest',
    slug: slug('bees-of-the-black-forest'),
    subtitle: 'How Hans Weber listens to his hives',
    excerpt:
      "Deep in the Black Forest, beekeeper Hans Weber tends to over 200 hives scattered across wildflower meadows and pine-covered hillsides.",
    body:
      "Hans Weber doesn't wear gloves. \"The bees know if you're afraid,\" he explains, lifting a frame thick with golden honeycomb from the hive. \"And they know if you're gentle.\" In 35 years of beekeeping, he's never been stung more than twice in one day.\n\nHis apiaries are scattered across the Black Forest in locations he guards jealously — meadows of wildflowers, clearings where linden trees bloom in June, hillsides carpeted in heather come September. Each location produces a distinct honey, and Hans keeps them separate, like a winemaker with different vineyard plots.\n\nThe wildflower honey is his signature: dark amber, thick, with a complexity that changes from spoonful to spoonful. One moment it's caramel and toffee, the next it's all dried fruit and spice. It crystallises within weeks — a sign, Hans insists, of quality. \"Industrial honey stays liquid because they heat it. We don't heat. We don't filter. We just wait and let the bees do their work.\"",
    author: 'Terravoa Editorial',
    date: '2025-10-02',
    readTime: '6 min',
    region: 'Black Forest',
    producer: ref('producer-schwarzwald-imkerei'),
  },
  {
    _id: 'story-lavender-lessons-from-provence',
    _type: 'story',
    kind: 'regionGuide',
    title: 'Lavender Lessons from Provence',
    slug: slug('lavender-lessons-from-provence'),
    subtitle: 'Claire Dupont on patience, soap, and the July bloom',
    excerpt:
      "In the lavender fields of Valensole, Claire Dupont distills essential oils and crafts artisanal soaps using cold-process methods passed down through generations.",
    body:
      "The lavender blooms for exactly three weeks in July. Miss the window, and you wait another year. Claire Dupont has been timing this harvest for over a decade, and she still gets nervous as June turns to July.\n\n\"The oil content peaks just before the flowers fully open,\" she says, cutting a handful of stems and holding them to her nose. \"Today? Not yet. Maybe Thursday.\" This precision is what separates artisanal lavender products from industrial ones.\n\nHer soap-making process is equally unhurried. She uses the cold-process method, mixing her lavender oil with organic olive oil and lye at room temperature. The mixture is poured into wooden moulds lined with parchment, then left to cure for six weeks in a cool barn. \"Hot-process is faster,\" Claire admits, \"but it kills the scent. My grandmother would have been horrified.\"",
    author: 'Terravoa Editorial',
    date: '2025-08-20',
    readTime: '7 min',
    region: 'Provence',
    producer: ref('producer-maison-lavande'),
  },
  {
    _id: 'story-clay-and-fire-in-alentejo',
    _type: 'story',
    kind: 'regionGuide',
    title: 'Clay and Fire in the Alentejo',
    slug: slug('clay-and-fire-in-alentejo'),
    subtitle: 'João Santos shapes tradition on a kick wheel',
    excerpt:
      "In the quiet plains of the Alentejo, ceramicist João Santos shapes terracotta using techniques unchanged for centuries.",
    body:
      "João Santos' workshop smells of wet earth and wood smoke. The kick wheel — a massive stone disc powered by his foot — spins with a rhythm that is almost musical. His hands, stained red with clay, coax a vase from a formless lump in under three minutes. Then he stops, studies it, and often starts again.\n\n\"A good pot is honest,\" he says. \"You can see the maker's hand in it. That's what machines can never replicate.\" His terracotta comes from a pit on his own land, dug and weathered for months before it's ready to work. The wood for his kiln comes from the same cork oaks that shade his workshop.\n\nFiring is the most anxious part. The wood-burning kiln must reach exactly the right temperature — too hot and the clay cracks, too cool and it remains porous. João fires by instinct, watching the colour of the flames. Each firing takes 14 hours, and he sleeps beside the kiln to tend it through the night.",
    author: 'Terravoa Editorial',
    date: '2025-07-10',
    readTime: '5 min',
    region: 'Alentejo',
    producer: ref('producer-atelier-alentejo'),
  },
]

// ── Seed ──────────────────────────────────────────────────────────────────────

async function upsert(docs, label) {
  let created = 0
  let failed  = 0
  for (const doc of docs) {
    try {
      await client.createOrReplace(doc)
      console.log(`  [${label}] ✓  ${doc._id}`)
      created++
    } catch (err) {
      console.error(`  [${label}] ✗  ${doc._id}  —  ${err.message}`)
      failed++
    }
  }
  return { created, failed }
}

async function main() {
  console.log('\n── Seeding Terravoa Sanity dataset ──────────────────────────────\n')

  const results = []

  console.log('Regions…')
  results.push(await upsert(regions, 'region'))

  console.log('\nProducers…')
  results.push(await upsert(producers, 'producer'))

  console.log('\nProducts…')
  results.push(await upsert(products, 'product'))

  console.log('\nStories…')
  results.push(await upsert(stories, 'story'))

  const totalCreated = results.reduce((s, r) => s + r.created, 0)
  const totalFailed  = results.reduce((s, r) => s + r.failed, 0)

  console.log('\n─────────────────────────────────────────────────────────────────')
  console.log(`Done. ${totalCreated} documents written, ${totalFailed} failed.`)

  if (totalFailed === 0) {
    console.log('\nNext steps:')
    console.log('  1. Open Sanity Studio at http://localhost:3000/studio to verify.')
    console.log('  2. Upload product/producer/region images in the Studio (Images are not seeded).')
    console.log('  3. Publish the draft documents if they appear as drafts.')
    console.log('  4. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local so the frontend picks them up.')
  }
  console.log('')
}

main().catch((err) => {
  console.error('[seed] Fatal error:', err)
  process.exit(1)
})
