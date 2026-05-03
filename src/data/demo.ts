// ── Demo data (fallback) ──
// When NEXT_PUBLIC_SANITY_PROJECT_ID is set, the app loads producers/products/regions/stories
// from Sanity if that dataset has documents; otherwise these entries are used.

export interface SavoirFaireStep {
  title: string
  description: string
}

export interface Producer {
  slug: string
  name: string
  region: string
  administrativeRegion: string
  country: string
  specialty: string
  tagline: string
  story: string
  storyHeadline: string
  quote: string
  imageSrc: string
  imageAlt: string
  heroImageSrc: string
  heroImageAlt: string
  secondaryImageSrc: string
  secondaryImageAlt: string
  established: string
  badges: string[]
  savoirFaire: SavoirFaireStep[]
}

export type SubscriptionInterval = 'monthly' | 'bimonthly' | 'quarterly' | 'biannual'

export interface Product {
  slug: string
  name: string
  price: number
  origin: string
  producerSlug: string
  producerName: string
  description: string
  details: string[]
  imageSrc: string
  imageAlt: string
  badge?: { label: string; variant: 'producer' | 'bestseller' | 'new' | 'limited' | 'seasonal' | 'sale' | 'preorder' | 'subscription' }
  category: string
  // Pre-order / Seasonal
  isPreOrder?: boolean
  preOrderAvailableFrom?: string
  season?: string
  // Subscription / Recurring delivery
  subscriptionAvailable?: boolean
  subscriptionIntervals?: SubscriptionInterval[]
  subscriptionDiscount?: number
  // Homepage feature
  isFeatured?: boolean
  featuredOrder?: number
}

export interface Region {
  slug: string
  name: string
  country: string
  specialty: string
  description: string
  longDescription: string
  imageSrc: string
  imageAlt: string
  productCount: number
  producerCount: number
}

/** Journal (SEO): regional guides. Producer portraits live on producer profiles, not in the Journal index. */
export type StoryKind = 'regionGuide' | 'producerFeature'

export interface Story {
  slug: string
  kind: StoryKind
  title: string
  subtitle: string
  excerpt: string
  body: string
  author: string
  date: string
  readTime: string
  imageSrc: string
  imageAlt: string
  region: string
  producerSlug?: string
}

// ── Producers ──

export const producers: Producer[] = [
  {
    slug: 'rossi-estate',
    name: 'Rossi Estate',
    region: 'Tuscany',
    administrativeRegion: 'Toscana',
    country: 'Italy',
    specialty: 'Olive Oil',
    tagline: 'Four centuries of liquid gold',
    storyHeadline: 'Traditional Know-How from the Rossi Estate',
    story: 'For four generations, the Rossi family has tended to the silver-leaved groves that line the ridge of the Maremma. Matteo Rossi, the current custodian, views himself less as a producer and more as a temporary guardian of a landscape that has remained unchanged since the Renaissance.\n\nThe journey of a Rossi olive begins in the silence of the dawn. Unlike industrial operations, Matteo insists on hand-harvesting — a slow, rhythmic labor that respects the integrity of each drupe and the health of the ancient trees, some of which have witnessed over four centuries of Tuscan history.',
    quote: "The secret isn't in the press, it's in the patience.",
    imageSrc: '/images/producers/rossi-estate.jpg',
    imageAlt: 'Matteo Rossi in his olive grove at golden hour',
    heroImageSrc: '/images/regions/italy.jpg',
    heroImageAlt: 'The golden hills of Tuscany at sunrise',
    secondaryImageSrc: '/images/products/olive-oil.jpg',
    secondaryImageAlt: 'Cold-pressed olive oil being poured',
    established: '1640',
    badges: ['Organic', 'Family-Owned'],
    savoirFaire: [
      { title: 'Manual Harvest', description: 'Individual hand-picking ensures only the perfectly ripe olives are selected, avoiding the bruising common in mechanical harvesting.' },
      { title: 'Cold Extraction', description: 'Within six hours of harvest, olives are pressed at temperatures never exceeding 27°C to preserve their delicate polyphenols and intense aroma.' },
      { title: 'Restful Decantation', description: 'The oil is allowed to settle naturally in steel fusti rather than being forced through filters, maintaining its full-bodied character.' },
    ],
  },
  {
    slug: 'schwarzwald-imkerei',
    name: 'Schwarzwald Imkerei',
    region: 'Black Forest',
    administrativeRegion: 'Baden-Württemberg',
    country: 'Germany',
    specialty: 'Honey',
    tagline: 'Wild honey from ancient forests',
    storyHeadline: 'Listening to the Hives of the Black Forest',
    story: 'Deep in the Black Forest, beekeeper Hans Weber tends to over 200 hives scattered across wildflower meadows and pine-covered hillsides. His honey is never heated or filtered — it arrives at your table exactly as the bees made it. Each jar captures the essence of a specific meadow, a specific season.\n\nHans doesn\'t wear gloves. "The bees know if you\'re afraid," he explains, lifting a frame thick with golden honeycomb. "And they know if you\'re gentle." In 35 years of beekeeping, he has never been stung more than twice in one day.',
    quote: 'Every jar is a snapshot of a meadow in bloom.',
    imageSrc: '/images/producers/schwarzwald-imkerei.jpg',
    imageAlt: 'Hans Weber inspecting beehives in the Black Forest',
    heroImageSrc: '/images/regions/germany.jpg',
    heroImageAlt: 'The ancient Black Forest at dawn',
    secondaryImageSrc: '/images/products/honey.jpg',
    secondaryImageAlt: 'Raw honey in artisanal glass jar',
    established: '1987',
    badges: ['Raw', 'Handmade'],
    savoirFaire: [
      { title: 'Wild Foraging Sites', description: 'Hives are placed in carefully chosen wildflower meadows and forest clearings, each producing a distinct honey with a unique terroir.' },
      { title: 'Zero Processing', description: 'The honey is never heated, never filtered. It arrives at your table exactly as the bees made it — raw, alive, and full of enzymes.' },
      { title: 'Seasonal Harvesting', description: 'Each harvest is kept separate by meadow and season, like a winemaker with different vineyard plots, preserving unique flavour profiles.' },
    ],
  },
  {
    slug: 'casa-del-sol',
    name: 'Casa del Sol',
    region: 'Andalusia',
    administrativeRegion: 'Región de Murcia',
    country: 'Spain',
    specialty: 'Preserves',
    tagline: 'Sun-dried traditions of the Mediterranean',
    storyHeadline: 'Sun, Salt, and Time in the Murcian Huerta',
    story: 'María García learned the art of preserving from her grandmother in a sun-baked kitchen overlooking the huerta of Murcia. Her sun-dried tomato tapenade and pepper preserves use only produce from her family\'s garden, dried slowly under the Levantine sun. No shortcuts, no additives — just sun, salt, and time.\n\nEvery jar begins in the garden. María grows her own tomatoes, peppers, and herbs in soil that her family has tended for three generations. The Murcian sun does the rest — drying fruit slowly over days until their flavours concentrate into something extraordinary.',
    quote: 'My grandmother said: the sun is the best chef.',
    imageSrc: '/images/producers/casa-del-sol.jpg',
    imageAlt: 'María García in her garden in Murcia',
    heroImageSrc: '/images/regions/spain-seville.jpg',
    heroImageAlt: 'Sun-drenched Mediterranean landscape',
    secondaryImageSrc: '/images/products/tapenade.jpg',
    secondaryImageAlt: 'Sun-dried tomato tapenade in glass jar',
    established: '2005',
    badges: ['Handmade', 'Local'],
    savoirFaire: [
      { title: 'Garden-to-Jar', description: 'Every ingredient is grown in María\'s own family garden, harvested at peak ripeness and processed the same day.' },
      { title: 'Sun-Drying', description: 'Tomatoes and peppers are dried slowly under the Levantine sun for up to three days, concentrating their natural sweetness.' },
      { title: 'No Additives', description: 'Nothing artificial ever enters the kitchen. Just sun, salt, olive oil, and time — exactly as her grandmother taught her.' },
    ],
  },
  {
    slug: 'atelier-alentejo',
    name: 'Atelier Alentejo',
    region: 'Alentejo',
    administrativeRegion: 'Alentejo',
    country: 'Portugal',
    specialty: 'Ceramics',
    tagline: 'Earth shaped by hand',
    storyHeadline: 'Clay and Fire in the Alentejo Plains',
    story: 'In the quiet plains of the Alentejo, ceramicist João Santos shapes terracotta using techniques unchanged for centuries. Each piece is hand-thrown on a kick wheel, dried in the open air, and fired in a wood-burning kiln. The result is pottery that carries the warmth of the Portuguese earth in every curve.\n\nJoão\'s workshop smells of wet earth and wood smoke. The kick wheel spins with a rhythm that is almost musical. His hands, stained red with clay, coax a vase from a formless lump in under three minutes. Then he stops, studies it, and often starts again.',
    quote: 'The clay knows what it wants to become. I just listen.',
    imageSrc: '/images/producers/atelier-alentejo.jpg',
    imageAlt: 'João Santos at his pottery wheel in Alentejo',
    heroImageSrc: '/images/regions/portugal.jpg',
    heroImageAlt: 'The sun-baked plains of the Alentejo',
    secondaryImageSrc: '/images/products/vase.jpg',
    secondaryImageAlt: 'Hand-thrown terracotta vase',
    established: '1998',
    badges: ['Handmade', 'Traditional'],
    savoirFaire: [
      { title: 'Hand-Thrown', description: 'Every piece is individually shaped on a traditional kick wheel — a massive stone disc powered by foot, producing pottery with the unmistakable touch of the maker\'s hand.' },
      { title: 'Natural Clay', description: 'Terracotta comes from a pit on João\'s own land, dug and weathered for months before it\'s ready to work — ensuring each piece carries the earth of the Alentejo.' },
      { title: 'Wood-Fired Kiln', description: 'Firing takes 14 hours in a wood-burning kiln. João sleeps beside it through the night, watching the colour of the flames to judge the temperature by instinct.' },
    ],
  },
  {
    slug: 'maison-lavande',
    name: 'Maison Lavande',
    region: 'Provence',
    administrativeRegion: 'Provence-Alpes-Côte d\'Azur',
    country: 'France',
    specialty: 'Savon & Lavender',
    tagline: 'The scent of Provence, bottled',
    storyHeadline: 'Patience and Petals in the Fields of Valensole',
    story: 'Surrounded by endless lavender fields in Valensole, Claire Dupont distills essential oils and crafts artisanal soaps using cold-process methods. Her ingredients are harvested by hand during the brief July bloom, when the oil content is at its peak. Each bar of savon is cured for six weeks before it reaches your hands.\n\nThe lavender blooms for exactly three weeks in July. Miss the window, and you wait another year. Claire has been timing this harvest for over a decade, and she still gets nervous as June turns to July. This precision is what separates artisanal lavender products from industrial ones.',
    quote: 'Lavender teaches you to wait. Rushed oil has no soul.',
    imageSrc: '/images/producers/maison-lavande.jpg',
    imageAlt: 'Claire Dupont harvesting lavender in Provence',
    heroImageSrc: '/images/regions/france-lavender.jpg',
    heroImageAlt: 'Endless lavender fields of Provence at sunset',
    secondaryImageSrc: '/images/products/savon.jpg',
    secondaryImageAlt: 'Artisanal lavender soap bar',
    established: '2012',
    badges: ['Organic', 'Artisanal'],
    savoirFaire: [
      { title: 'Peak Harvest', description: 'The oil content peaks just before the flowers fully open. Claire harvests by hand during the brief three-week July window when the lavender is at its most potent.' },
      { title: 'Cold-Process Soap', description: 'Lavender oil is mixed with organic olive oil at room temperature, preserving the delicate scent that hot-process methods would destroy.' },
      { title: 'Six-Week Cure', description: 'Each bar is poured into wooden moulds and left to cure for six weeks in a cool barn — slow, unhurried, and exactly as her grandmother taught her.' },
    ],
  },
]

// ── Products ──

export const products: Product[] = [
  {
    slug: 'extra-virgin-cold-pressed-oil',
    name: 'Extra Virgin Cold-Pressed Oil',
    price: 3200,
    origin: 'Tuscany',
    producerSlug: 'rossi-estate',
    producerName: 'Rossi Estate',
    description: 'A single-estate olive oil from century-old Frantoio trees. Cold-pressed within hours of harvest, this oil has a robust, peppery character with notes of fresh-cut grass and artichoke.',
    details: ['500ml glass bottle', 'Cold-pressed', 'Single estate', 'Harvest 2025'],
    imageSrc: '/images/products/olive-oil.jpg',
    imageAlt: 'Premium olive oil in a minimalist glass bottle',
    badge: { label: 'Organic', variant: 'producer' },
    category: 'Oils',
  },
  {
    slug: 'wildflower-forest-honey',
    name: 'Wildflower Forest Honey',
    price: 1800,
    origin: 'Black Forest',
    producerSlug: 'schwarzwald-imkerei',
    producerName: 'Schwarzwald Imkerei',
    description: 'Unfiltered, raw honey from wildflower meadows at the edge of the Black Forest. Complex and floral with hints of pine resin and heather. Crystallizes naturally over time.',
    details: ['350g glass jar', 'Raw & unfiltered', 'Single-origin meadow', 'Summer 2025'],
    imageSrc: '/images/products/honey.jpg',
    imageAlt: 'Artisanal dark honey jar with honeycomb',
    badge: { label: 'Bestseller', variant: 'bestseller' },
    category: 'Honey',
  },
  {
    slug: 'sun-dried-tomato-tapenade',
    name: 'Sun-Dried Tomato Tapenade',
    price: 1450,
    origin: 'Andalusia',
    producerSlug: 'casa-del-sol',
    producerName: 'Casa del Sol',
    description: 'Ripe tomatoes from the Murcian huerta, sun-dried for three days and blended with local olive oil, capers, and a whisper of smoked paprika. Perfect on crusty bread or stirred into pasta.',
    details: ['200g jar', 'Sun-dried', 'No preservatives', 'Vegan'],
    imageSrc: '/images/products/tapenade.jpg',
    imageAlt: 'Glass jar of sun-dried tomato preserve',
    badge: { label: 'Bestseller', variant: 'bestseller' },
    category: 'Preserves',
  },
  {
    slug: 'hand-thrown-terracotta-vase',
    name: 'Hand-Thrown Terracotta Vase',
    price: 8500,
    origin: 'Alentejo',
    producerSlug: 'atelier-alentejo',
    producerName: 'Atelier Alentejo',
    description: 'Each vase is individually hand-thrown on a traditional kick wheel and fired in a wood-burning kiln. The natural terracotta develops a unique patina over time, making every piece one of a kind.',
    details: ['Height: 25cm', 'Hand-thrown', 'Wood-fired', 'Each piece unique'],
    imageSrc: '/images/products/vase.jpg',
    imageAlt: 'Rustic handmade terracotta vase',
    category: 'Ceramics',
  },
  {
    slug: 'lavender-savon-de-marseille',
    name: 'Lavender Savon de Marseille',
    price: 1200,
    origin: 'Provence',
    producerSlug: 'maison-lavande',
    producerName: 'Maison Lavande',
    description: 'Cold-process soap made with pure lavender essential oil from Valensole and organic olive oil. Cured for six weeks for a gentle, long-lasting bar that soothes and nourishes.',
    details: ['150g bar', 'Cold-process', '6-week cure', 'Organic ingredients'],
    imageSrc: '/images/products/savon.jpg',
    imageAlt: 'Artisanal lavender soap bar wrapped in linen',
    badge: { label: 'Organic', variant: 'producer' },
    category: 'Body Care',
  },
  {
    slug: 'smoked-paprika-flakes',
    name: 'Smoked Paprika Flakes',
    price: 950,
    origin: 'Andalusia',
    producerSlug: 'casa-del-sol',
    producerName: 'Casa del Sol',
    description: 'Pimientos de la Vera, slowly smoked over holm oak for two weeks, then hand-crushed into delicate flakes. Adds depth and warmth to any dish.',
    details: ['75g tin', 'Oak-smoked', 'Hand-crushed', 'Single origin'],
    imageSrc: '/images/products/paprika.jpg',
    imageAlt: 'Tin of smoked paprika flakes',
    badge: { label: 'Bestseller', variant: 'bestseller' },
    category: 'Spices',
  },
  {
    slug: 'truffle-infused-olive-oil',
    name: 'Truffle-Infused Olive Oil',
    price: 4500,
    origin: 'Tuscany',
    producerSlug: 'rossi-estate',
    producerName: 'Rossi Estate',
    description: 'Extra virgin olive oil infused with fresh black truffle shavings from the Umbrian hills. A luxurious finishing oil for risotto, eggs, or fresh pasta.',
    details: ['250ml bottle', 'Real truffle shavings', 'Cold-infused', 'Limited batch'],
    imageSrc: '/images/products/truffle-oil.jpg',
    imageAlt: 'Dark bottle of truffle-infused olive oil',
    category: 'Oils',
  },
  {
    slug: 'acacia-honey',
    name: 'Acacia Honey',
    price: 2200,
    origin: 'Black Forest',
    producerSlug: 'schwarzwald-imkerei',
    producerName: 'Schwarzwald Imkerei',
    description: 'Light, delicate, and slow to crystallize. This single-varietal acacia honey has a mild, floral sweetness that makes it perfect for tea, yogurt, or simply on warm bread.',
    details: ['500g glass jar', 'Single-varietal', 'Raw', 'Spring harvest'],
    imageSrc: '/images/products/acacia-honey.jpg',
    imageAlt: 'Clear glass jar of light acacia honey',
    badge: { label: 'Bestseller', variant: 'bestseller' },
    category: 'Honey',
  },
]

// ── Regions ──

export const regions: Region[] = [
  {
    slug: 'brittany',
    name: 'Brittany',
    country: 'France',
    specialty: 'Fleur de Sel · Salted Caramel · Butter Biscuits',
    description: 'A peninsula shaped by the Atlantic — where salt is harvested by hand, butter is a religion, and the sea gives everything its edge.',
    longDescription: 'Brittany is where the Atlantic teaches restraint. The salt marshes of Guérande, stretching across the Loire-Atlantique, have been worked by paludiers for over a thousand years. Unlike industrial salt, fleur de sel forms only when wind and sun align perfectly — a thin crust skimmed by hand with a flat wooden rake called a lousse. Taste it and you understand why chefs pay ten times the price of ordinary salt: it dissolves on the tongue with a mineral brightness no factory can replicate.\n\nBeyond salt, Brittany\'s maritime climate — cool, humid, swept by westerlies — produces dairy of extraordinary character. Breton butter, made from lightly cultured cream, has a complexity closer to cheese than anything most people call butter. Beurre salé, studded with fleur de sel crystals, became the backbone of a confectionery tradition that turns caramel into something close to a sacrament. The kouign-amann, a butter cake with no real equivalent anywhere else, is the clearest expression of what happens when excellent ingredients meet a culture that doesn\'t believe in holding back fat.\n\nThe region rewards slow exploration. The Guérande peninsula offers marshes stretching to the horizon, stone villages, and cooperative shops where you buy salt directly from the producer. The coast around the Presqu\'île de Crozon is wilder — windswept cliffs, turquoise water on clear days, and a landscape that feels genuinely untouched. Inland, the Monts d\'Arrée — among the oldest geological formations in Europe, worn to low hills by four hundred million years of weather — carry a melancholy beauty that surprises visitors expecting postcard scenery.\n\nOn Terravoa, our Breton selection focuses on what the region does that nowhere else can: hand-harvested fleur de sel from independent paludiers and salted butter caramels made in small batches with real cultured cream. Browse the collection filtered by Brittany and open each producer to see how the land and the sea show up in the jar.',
    imageSrc: '/images/regions/brittany/coast.jpg',
    imageAlt: 'Rocky Atlantic coastline of Brittany with salt marshes at low tide',
    productCount: 2,
    producerCount: 0,
  },
  {
    slug: 'tuscany',
    name: 'Tuscany',
    country: 'Italy',
    specialty: 'Olive Oil · Truffles · Pasta',
    description: 'Rolling hills, silver-leaved groves, and oils with a peppery bite — Tuscany is where Italian craft reaches its most concentrated expression.',
    longDescription: 'Tuscany is not one landscape but several. The Tyrrhenian coast around the Maremma brings salt air into the groves; inland, higher elevations and sharper nights concentrate flavour in the oil. Cold-pressed extra virgin is a label, but the real story is in harvest timing, varietal mix, and patience. An oil pressed from Frantoio olives picked before full ripeness — green-gold, peppery, with a cough-inducing finish — is a completely different product from the mild, golden oils of the south.\n\nThe truffle trade adds another dimension. In autumn, the hills around San Miniato and the Crete Senesi fill with trifolai — truffle hunters — and their dogs, following a knowledge passed down through families who guard their patches with unusual secrecy. The white truffle season lasts barely two months. Those who find them treat each specimen with the reverence due to something genuinely irreplaceable.\n\nVisiting Tuscany well means resisting the famous circuit. A morning market in a small hill town, one long lunch, one producer visit — this beats a dozen photo stops at crowded viewpoints. Look for oils with the harvest year printed on the label. Ask which plots the fruit came from. Trust your nose: grass, artichoke, and a clean pepper bite are signs of life, not defects. Avoid anything that smells of butter or cooked fruit — those oils were pressed from damaged or overripe fruit.\n\nOn Terravoa, we work with growers who still think in generations rather than campaigns. Our Tuscan selection is built around those relationships: single-estate oils from century-old trees, truffle products made with actual truffle shavings rather than synthetic flavouring. Filter the collection by Tuscany, then open each producer profile to see the specific grove, the harvest date, and the hands behind the bottle.',
    imageSrc: '/images/regions/italy.jpg',
    imageAlt: 'Rolling Tuscan hills with cypress trees and terracotta farmhouses at dusk',
    productCount: 2,
    producerCount: 1,
  },
  {
    slug: 'black-forest',
    name: 'Black Forest',
    country: 'Germany',
    specialty: 'Wildflower Honey · Smoked Ham · Spiced Cakes',
    description: 'Dense pine forests, wildflower clearings, and beekeepers who tend their hives without gloves — the Black Forest is a world apart.',
    longDescription: 'The Schwarzwald is bigger than most visitors expect and quieter than almost anywhere in central Europe. Dense spruce and fir cover the high ridges; lower down, clearings of wildflowers open between the trees — and it is here, on the forest edge, that the region\'s most distinctive product is made. Black Forest honey is not one honey but many: spring brings light acacia with a mild floral sweetness; summer produces a darker, more complex blend of thistle, clover, and forest blossom; late-season honeys carry the resinous edge of pine and fir.\n\nThe beekeepers who work these clearings are a particular type of producer. Many tend fewer than fifty hives. They do not heat or filter; they harvest by meadow and by season, keeping batches separate the way a winemaker separates vineyard plots. The result is honey with a genuine sense of place — something that changes meaningfully from jar to jar and year to year.\n\nBeyond honey, the forest has a strong tradition of smoked and cured meats. Schwarzwälder Schinken — cold-smoked ham — is defined by its double smoke over fir branches and sawdust, producing a flavour that no factory process has ever convincingly replicated. The Christmas spice tradition, centred on Lebkuchen and Kirschwasser-soaked cherries, runs deep through the region\'s culture and calendar.\n\nFor visitors, the Kaiserstuhl wine area on the Rhine plain to the west offers a striking contrast to the forest — warm, volcanic soils producing Pinot Noir and Gutedel of genuine quality. The spa towns of Baden-Baden and Bad Krozingen are worth a night if you want the nineteenth-century resort atmosphere. But the forest itself rewards those who simply walk into it.\n\nOn Terravoa, our Black Forest selection centres on honey from independent beekeepers who still work by hand, without industrial equipment. Each jar carries the name of the meadow and the harvest season.',
    imageSrc: '/images/regions/germany.jpg',
    imageAlt: 'Dense Black Forest pine canopy with morning mist and wildflower clearing',
    productCount: 2,
    producerCount: 1,
  },
  {
    slug: 'andalusia',
    name: 'Andalusia',
    country: 'Spain',
    specialty: 'Paprika · Saffron · Preserves',
    description: 'Eight centuries of Moorish influence left Andalusia with a pantry unlike anywhere else in Europe — saffron, paprika, almonds, and an obsession with sun-dried intensity.',
    longDescription: 'Andalusia is the southernmost point of mainland Europe, and it shows in everything: the architecture, the rhythm of daily life, and especially the food. The region sits at the intersection of Atlantic and Mediterranean climates, of Islamic and Christian culinary traditions, of African heat and European temperament. The result is a pantry of unusual richness.\n\nPaprika tells part of the story. In Extremadura — just north of Andalusia proper — the town of Jaraíz de la Vera has been smoking peppers over holm oak fires since the sixteenth century. The process takes two weeks: peppers are loaded into stone smokehouses and tended around the clock, turned by hand as the moisture slowly leaves them and the smoke penetrates. The result — pimentón de la Vera — has a depth that ordinary paprika cannot approach. A pinch transforms a dish; a spoonful defines it.\n\nSaffron adds another dimension. La Mancha produces most of Spain\'s saffron harvest, but the threads that reach Andalusian kitchens are treated with particular care — toasted briefly before use to intensify their honeyed, medicinal aroma. The harvest, in October, lasts barely three weeks. Picking is done before dawn; the stigmas are separated by hand the same day. A gram of good saffron represents the work of 150 flowers.\n\nFor visitors, the obvious circuit — Seville, Córdoba, Granada — is obvious because it works. The Alhambra remains one of the most extraordinary buildings in Europe. But the villages of the Alpujarra, on the southern slope of the Sierra Nevada, offer a quieter version of Andalusian life: whitewashed streets, mule tracks, and a landscape that has changed less than most.\n\nOn Terravoa, our Andalusian producers focus on sun-dried and preserved goods that carry the intensity of the southern sun in every jar.',
    imageSrc: '/images/regions/spain-seville.jpg',
    imageAlt: 'Sun-drenched Andalusian village with whitewashed walls and terracotta rooftops',
    productCount: 2,
    producerCount: 1,
  },
  {
    slug: 'alentejo',
    name: 'Alentejo',
    country: 'Portugal',
    specialty: 'Cork · Sheep Cheese · Olive Oil',
    description: 'Vast plains, cork oaks older than the country itself, and a quiet confidence in materials — the Alentejo is Portugal\'s most undervalued region.',
    longDescription: 'The Alentejo covers roughly a third of Portugal but holds less than a tenth of its population. This emptiness — vast plains of wheat and cork oak stretching to a horizon interrupted only by the occasional white village — is the region\'s defining quality. Things take longer here. The cork oak is not harvested until it is at least twenty-five years old; after that, its bark is stripped on a nine-year cycle, leaving the trunk a vivid terracotta-red for a season before the grey returns. The trees live for two hundred years and more, and in that time each one will produce cork for around twenty harvests.\n\nThe Alentejo is also Portugal\'s most important wine region, though its wines have been slower to reach international attention than those of the Douro. The best — dense, warm, with a dark fruit character shaped by long, dry summers — are drinking well at a fraction of the price of comparable wines from better-known appellations.\n\nFor food, the region\'s most distinctive product is the queijo de ovelha — sheep\'s milk cheese made from the milk of Merino ewes that graze the open plains. The best versions are creamy almost to the point of liquidity inside, with a sharp, saline edge from the natural thistle rennet used to curdle the milk. They are best eaten with bread and a glass of the local white wine.\n\nCeramics have deep roots here too. The terracotta of the Alentejo is unglazed, hand-thrown, and fired to a warmth that no industrial process achieves — because no industrial process uses the same clay, the same kiln, or the same hands.\n\nOn Terravoa, our Alentejo producers represent this quieter, more patient tradition: potters who fire wood kilns through the night, and artisans who work with materials the region has provided for centuries.',
    imageSrc: '/images/regions/portugal.jpg',
    imageAlt: 'Golden wheat plains of the Alentejo with cork oaks at harvest time',
    productCount: 1,
    producerCount: 1,
  },
  {
    slug: 'alsace',
    name: 'Alsace',
    country: 'France',
    specialty: 'Charcuterie · Mustard · Christmas Spices',
    description: 'Caught between France and Germany for centuries, Alsace resolved the tension by becoming exceptional at both — and developing a food culture unlike either.',
    longDescription: 'Alsace has been French, then German, then French again — and the result of this pendulum is a culture that absorbed the best of both traditions without being fully reducible to either. The half-timbered villages along the wine route from Colmar to Strasbourg look more Rhineland than Parisian. The cuisine — tarte flambée, choucroute garnie, baeckeoffe — carries the weight and generosity of German cooking, but the precision and presentation of French technique.\n\nThe wine region, running along the eastern edge of the Vosges mountains, produces Riesling, Gewurztraminer, and Pinot Gris of a character found nowhere else in France: aromatic, often dry despite their perfume, and built to age in ways that Alsatian wines rarely get credit for outside their home region. The grands crus — a relatively recent classification — include some genuinely extraordinary sites, particularly on the limestone and granite hillsides above Kaysersberg and Riquewihr.\n\nMustard made in Alsace draws on the same sharp, vinegary tradition as Dijon, but with local character: some producers use Riesling rather than verjuice as the acidulant, giving a wine-forward profile that pairs particularly well with the region\'s own charcuterie. The Christmas spice tradition — bredele cookies, pain d\'épices, Lebkuchen — runs through the region\'s calendar in a way that feels entirely natural rather than nostalgic.\n\nColmar is the obvious base: small enough to navigate on foot, large enough to have a serious restaurant scene, and right in the middle of the wine route. The Unterlinden Museum houses the Isenheim Altarpiece, one of the most extraordinary objects in European art. The Christmas market, when it runs, is genuinely one of the best in Europe.\n\nOn Terravoa, our Alsatian producers focus on the spiced and preserved goods that define the region\'s identity: mustards, charcuterie, and the kind of spiced biscuits that make a Strasbourg December make sense.',
    imageSrc: 'https://picsum.photos/seed/alsace-colmar/1200/800',
    imageAlt: 'Colourful half-timbered houses along a canal in Colmar, Alsace',
    productCount: 0,
    producerCount: 0,
  },
  {
    slug: 'provence',
    name: 'Provence',
    country: 'France',
    specialty: 'Lavender · Olive Oil · Herbs',
    description: 'Dry heat, limestone garrigue, and the brief purple bloom of July — Provence distils better than anywhere the idea of a place that smells of what grows in it.',
    longDescription: 'Provence is a region that reveals itself slowly. The obvious icons — lavender fields, rosé wine, markets full of herbs and tomatoes — are real, but they require a particular kind of attention. The lavender fields of the Valensole plateau bloom for barely three weeks in July. Miss them, and you wait another year. This brevity is part of what makes the product meaningful: there are no shortcuts, no stored supply, no way to manufacture more when demand spikes.\n\nThe paludiers who harvest lavender work the same dawn-to-morning schedule as salt harvesters in Brittany. The oil content peaks just before full flower; picking too late means a sweeter, less medicinal fragrance. The difference between good lavender oil and great lavender oil is the difference between a distillery that runs on schedule and one run by someone who watches the plants rather than the calendar.\n\nHerbs of Provence — thyme, rosemary, savory, oregano, marjoram — grow wild across the limestone garrigue above the valley floors. The combination of thin, rocky soil, intense summer heat, and cool nights concentrates their volatile oils to a degree that cultivated herbs rarely approach. A bunch of wild thyme from the hillsides above Les Baux smells categorically different from anything in a supermarket.\n\nThe olive oils of the Baux-de-Provence appellation — one of the smallest and most demanding AOC designations in France — are worth seeking out: mild, buttery, with a complexity shaped by the Salonenque and Aglandau varieties that dominate the region. They are not the peppery, grassy oils of Tuscany; they are quieter, richer, and excellent with delicate dishes where a Tuscan oil would dominate.\n\nOn Terravoa, our Provençal producers focus on lavender essential oil, cold-process soaps, and dried herb blends from the garrigue — products that carry the landscape in their scent.',
    imageSrc: '/images/regions/france-lavender.jpg',
    imageAlt: 'Endless lavender fields of the Valensole plateau at peak bloom',
    productCount: 2,
    producerCount: 1,
  },
]

// ── Stories ──

export const stories: Story[] = [
  {
    kind: 'regionGuide',
    slug: 'tuscany-beyond-the-guidebooks',
    title: 'Tuscany beyond the guidebooks',
    subtitle: 'Olive oil, hill towns, and what to taste before you browse our Tuscan cellar',
    excerpt:
      'Search “Tuscany food” and you get a flood of pasta shots. Here is the slower read: how terroir shows up on the plate, what distinguishes coastal Maremma from Chianti hills, and which makers we ship from the region.',
    body:
      'Tuscany is not one landscape but several. The Tyrrhenian coast around the Maremma brings salt air into the groves; inland, higher elevation and sharper nights concentrate flavour in the oil. Cold-pressed extra virgin is a label, but the real story is in harvest timing, varietal mix, and patience.\n\nIf you visit, skip the checklist rush. Market mornings in small towns, a single slow lunch, and one producer visit beat a dozen photo stops. Look for oils with harvest year on the bottle, ask which plots the fruit came from, and trust your nose: grass, artichoke, pepper are signs of life—not defects.\n\nOn Terravoa we work with growers who still think in generations, not campaigns. Our Tuscan selection is built around those relationships: browse the collection filtered by Italy, then open each producer to see how their land shows up in the jar.',
    author: 'Terravoa Editorial',
    date: '2026-01-18',
    readTime: '9 min',
    imageSrc: '/images/regions/italy.jpg',
    imageAlt: 'Rolling Tuscan hills and olive groves at sunset',
    region: 'Tuscany',
  },
  {
    kind: 'regionGuide',
    slug: 'brittany-salt-marshes-and-table-traditions',
    title: 'Brittany: salt marshes, butter, and Atlantic edge',
    subtitle: 'What people look for when they type “Brittany food”—and how to shop it with intent',
    excerpt:
      'From galettes to salted butter, Brittany’s identity is tied to the coast and the dairy belt. This is not a travel itinerary; it is a lens for understanding why certain flavours feel “Breton” and how we curate makers who respect that lineage.',
    body:
      'Brittany’s culinary fame rests on contrast: the minerality of hand-harvested sea salt against the richness of cultured butter, the sharpness of cider against sweet buckwheat crêpes. Visitors often start with crêperies; the deeper story is in raw materials—milk from coastal pastures, wheat from local mills, salt from the Guérande marshes.\n\nYou do not need to tour every marsh to eat well. When shopping online, look for PDO or small-batch labels, short ingredient lists, and producers who name their geography. We are steadily expanding our Breton roster; meanwhile, explore our French cellar and filter by region to see who we partner with today.\n\nTerravoa exists to connect curious eaters with verifiable origin. If Brittany is your entry point, let it lead you into the shop—every product page names the hands behind it.',
    author: 'Terravoa Editorial',
    date: '2026-01-08',
    readTime: '8 min',
    imageSrc: '/images/stories/brittany-hero.jpg',
    imageAlt: 'Atlantic coastline of Brittany at low tide — salt marshes and sea',
    region: 'Brittany',
  },
  {
    kind: 'regionGuide',
    slug: 'black-forest-meadows-and-honey',
    title: 'The Black Forest: meadows, honey, and slow craft',
    subtitle: 'Why “Schwarzwald” shows up in search—and what to notice in the jar',
    excerpt:
      'Germany’s south-west is forest, meadow, and meticulous craft. Honey here is not generic “sweet”; it is a map of bloom cycles. Use this note to orient yourself before you explore our German producers.',
    body:
      'The Black Forest is a patchwork of altitude and microclimate. Wildflower honey from valley meadows tastes nothing like fir honey from higher stands. Small-batch beekeepers move hives with the bloom; industrial brands homogenise. The difference is obvious side by side.\n\nWhen you read labels, “cold extracted” and “unfiltered” matter: heat strips aroma. Pair honey with cheese from the same hills when you can—it is the simplest way to taste place.\n\nWe work with apiarists who treat each location as a vintage. From this page you can jump to our German collection and meet the makers behind each jar.',
    author: 'Terravoa Editorial',
    date: '2025-12-12',
    readTime: '7 min',
    imageSrc: '/images/regions/germany.jpg',
    imageAlt: 'Meadow and forest edge in the Black Forest',
    region: 'Black Forest',
  },
  {
    kind: 'producerFeature',
    slug: 'liquid-gold-of-the-maremma',
    title: 'The Liquid Gold of the Maremma',
    subtitle: 'A week with Matteo Rossi in his Tuscan olive groves',
    excerpt: 'In the heart of Tuscany, Matteo Rossi continues a tradition that spans four centuries. His artisanal cold-pressing techniques preserve the volatile aromas of the earth.',
    body: 'The morning mist clings to the Maremma hills like a silk veil. Matteo Rossi is already in the grove, his weathered hands checking the Frantoio olives for the telltale blush of purple that signals readiness. "You can\'t rush the trees," he says, pulling a branch down to eye level. "They give when they\'re ready."\n\nThe Rossi estate sits at 300 meters, high enough for the cold autumn nights that concentrate the oil\'s polyphenols. The grove holds 2,000 trees, some over 400 years old, their trunks twisted into shapes that seem to tell their own stories.\n\nHarvest happens in a single, intense week. The family and a small team of trusted neighbors work from dawn until dark, hand-picking olives into woven baskets. Within four hours of picking, the olives are in the press — a modern granite mill that Matteo insists produces a cleaner oil than the old wooden ones.\n\nThe result is an oil of extraordinary complexity: grassy and peppery, with a finish that lingers like a good memory. Each bottle is numbered, each vintage unique. This year\'s harvest yielded just 800 bottles — and when they\'re gone, they\'re gone until next November.',
    author: 'Terravoa Editorial',
    date: '2025-11-15',
    readTime: '8 min',
    imageSrc: '/images/stories/maremma.jpg',
    imageAlt: 'Olive groves in the Maremma at golden hour',
    region: 'Tuscany',
    producerSlug: 'rossi-estate',
  },
  {
    kind: 'producerFeature',
    slug: 'bees-of-the-black-forest',
    title: 'The Bees of the Black Forest',
    subtitle: 'How Hans Weber listens to his hives',
    excerpt: 'Deep in the Black Forest, beekeeper Hans Weber tends to over 200 hives scattered across wildflower meadows and pine-covered hillsides.',
    body: 'Hans Weber doesn\'t wear gloves. "The bees know if you\'re afraid," he explains, lifting a frame thick with golden honeycomb from the hive. "And they know if you\'re gentle." In 35 years of beekeeping, he\'s never been stung more than twice in one day.\n\nHis apiaries are scattered across the Black Forest in locations he guards jealously — meadows of wildflowers, clearings where linden trees bloom in June, hillsides carpeted in heather come September. Each location produces a distinct honey, and Hans keeps them separate, like a winemaker with different vineyard plots.\n\nThe wildflower honey is his signature: dark amber, thick, with a complexity that changes from spoonful to spoonful. One moment it\'s caramel and toffee, the next it\'s all dried fruit and spice. It crystallizes within weeks — a sign, Hans insists, of quality. "Industrial honey stays liquid because they heat it. We don\'t heat. We don\'t filter. We just wait and let the bees do their work."',
    author: 'Terravoa Editorial',
    date: '2025-10-02',
    readTime: '6 min',
    imageSrc: '/images/stories/black-forest.jpg',
    imageAlt: 'Beehives in a Black Forest meadow',
    region: 'Black Forest',
    producerSlug: 'schwarzwald-imkerei',
  },
  {
    kind: 'producerFeature',
    slug: 'lavender-lessons-from-provence',
    title: 'Lavender Lessons from Provence',
    subtitle: 'Claire Dupont on patience, soap, and the July bloom',
    excerpt: 'In the lavender fields of Valensole, Claire Dupont distills essential oils and crafts artisanal soaps using cold-process methods passed down through generations.',
    body: 'The lavender blooms for exactly three weeks in July. Miss the window, and you wait another year. Claire Dupont has been timing this harvest for over a decade, and she still gets nervous as June turns to July.\n\n"The oil content peaks just before the flowers fully open," she says, cutting a handful of stems and holding them to her nose. "Today? Not yet. Maybe Thursday." This precision is what separates artisanal lavender products from industrial ones.\n\nHer soap-making process is equally unhurried. She uses the cold-process method, mixing her lavender oil with organic olive oil and lye at room temperature. The mixture is poured into wooden molds lined with parchment, then left to cure for six weeks in a cool barn. "Hot-process is faster," Claire admits, "but it kills the scent. My grandmother would have been horrified."',
    author: 'Terravoa Editorial',
    date: '2025-08-20',
    readTime: '7 min',
    imageSrc: '/images/stories/provence.jpg',
    imageAlt: 'Lavender fields in Provence at sunset',
    region: 'Provence',
    producerSlug: 'maison-lavande',
  },
  {
    kind: 'producerFeature',
    slug: 'clay-and-fire-in-alentejo',
    title: 'Clay and Fire in the Alentejo',
    subtitle: 'João Santos shapes tradition on a kick wheel',
    excerpt: 'In the quiet plains of the Alentejo, ceramicist João Santos shapes terracotta using techniques unchanged for centuries.',
    body: 'João Santos\' workshop smells of wet earth and wood smoke. The kick wheel — a massive stone disc powered by his foot — spins with a rhythm that is almost musical. His hands, stained red with clay, coax a vase from a formless lump in under three minutes. Then he stops, studies it, and often starts again.\n\n"A good pot is honest," he says. "You can see the maker\'s hand in it. That\'s what machines can never replicate." His terracotta comes from a pit on his own land, dug and weathered for months before it\'s ready to work. The wood for his kiln comes from the same cork oaks that shade his workshop.\n\nFiring is the most anxious part. The wood-burning kiln must reach exactly the right temperature — too hot and the clay cracks, too cool and it remains porous. João fires by instinct, watching the color of the flames. Each firing takes 14 hours, and he sleeps beside the kiln to tend it through the night.',
    author: 'Terravoa Editorial',
    date: '2025-07-10',
    readTime: '5 min',
    imageSrc: '/images/stories/alentejo.jpg',
    imageAlt: 'Pottery workshop in the Alentejo plains',
    region: 'Alentejo',
    producerSlug: 'atelier-alentejo',
  },
]

// ── Helper functions ──

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProducerBySlug(slug: string): Producer | undefined {
  return producers.find((p) => p.slug === slug)
}

export function getRegionBySlug(slug: string): Region | undefined {
  return regions.find((r) => r.slug === slug)
}

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug)
}

export function getProductsByProducer(producerSlug: string): Product[] {
  return products.filter((p) => p.producerSlug === producerSlug)
}

export function getProductsByRegion(regionName: string): Product[] {
  return products.filter((p) => p.origin === regionName)
}

export function getProducersByRegion(regionName: string): Producer[] {
  return producers.filter((p) => p.country === regionName)
}

export function getStoriesByRegion(regionName: string): Story[] {
  return stories.filter((s) => s.kind === 'regionGuide' && s.region === regionName)
}
