/**
 * Email localisation strings for all 6 supported locales.
 * Every key that is a function receives a dynamic value (name, ref, etc.).
 * Falls back to 'en' for any unrecognised locale.
 */

export type SupportedLocale = 'en' | 'de' | 'fr' | 'it' | 'es' | 'pt'

const SUPPORTED: SupportedLocale[] = ['en', 'de', 'fr', 'it', 'es', 'pt']

export function resolveLocale(raw: string | null | undefined): SupportedLocale {
  if (raw && (SUPPORTED as string[]).includes(raw)) {
    return raw as SupportedLocale
  }
  return 'en'
}

// ─────────────────────────────────────────────────────────────────────────────
// Application accepted
// ─────────────────────────────────────────────────────────────────────────────

export type AcceptedStrings = {
  subject: string
  greeting: (name: string) => string
  intro: string
  body: string
  cta: string
  closing: string
  signoff: string
}

export const acceptedStrings: Record<SupportedLocale, AcceptedStrings> = {
  en: {
    subject: "You're in — welcome to Terravoa",
    greeting: (name) => `Dear ${name},`,
    intro: "We're delighted to welcome you to the Terravoa producer community.",
    body: "Your application has been reviewed and approved. You can now access your producer portal to list your products, manage orders, and build your presence on our marketplace.",
    cta: "Access your producer portal",
    closing: "We look forward to sharing your work with our community.",
    signoff: "The Terravoa team",
  },
  de: {
    subject: "Willkommen bei Terravoa — Ihre Bewerbung wurde angenommen",
    greeting: (name) => `Sehr geehrte/r ${name},`,
    intro: "Wir freuen uns sehr, Sie in der Terravoa-Produzenten-Gemeinschaft begrüßen zu dürfen.",
    body: "Ihre Bewerbung wurde geprüft und genehmigt. Sie können jetzt auf Ihr Produzenten-Portal zugreifen, um Ihre Produkte einzustellen, Bestellungen zu verwalten und Ihre Präsenz auf unserem Marktplatz aufzubauen.",
    cta: "Zum Produzenten-Portal",
    closing: "Wir freuen uns darauf, Ihre Arbeit mit unserer Gemeinschaft zu teilen.",
    signoff: "Das Terravoa-Team",
  },
  fr: {
    subject: "Bienvenue sur Terravoa — votre candidature est acceptée",
    greeting: (name) => `Chère/Cher ${name},`,
    intro: "Nous sommes ravis de vous accueillir au sein de la communauté des producteurs Terravoa.",
    body: "Votre candidature a été examinée et approuvée. Vous pouvez désormais accéder à votre espace producteur pour référencer vos produits, gérer vos commandes et développer votre présence sur notre marketplace.",
    cta: "Accéder à votre espace producteur",
    closing: "Nous nous réjouissons de faire découvrir votre travail à notre communauté.",
    signoff: "L'équipe Terravoa",
  },
  it: {
    subject: "Benvenuto/a su Terravoa — la sua candidatura è stata accettata",
    greeting: (name) => `Gentile ${name},`,
    intro: "Siamo lieti di darle il benvenuto nella comunità dei produttori Terravoa.",
    body: "La sua candidatura è stata esaminata e approvata. Ora può accedere al portale produttori per inserire i suoi prodotti, gestire gli ordini e costruire la sua presenza sul nostro marketplace.",
    cta: "Accedi al portale produttori",
    closing: "Non vediamo l'ora di condividere il suo lavoro con la nostra comunità.",
    signoff: "Il team Terravoa",
  },
  es: {
    subject: "Bienvenido/a a Terravoa — su solicitud ha sido aceptada",
    greeting: (name) => `Estimado/a ${name}:`,
    intro: "Nos complace darle la bienvenida a la comunidad de productores de Terravoa.",
    body: "Su solicitud ha sido revisada y aprobada. Ahora puede acceder a su portal de productor para publicar sus productos, gestionar pedidos y desarrollar su presencia en nuestro marketplace.",
    cta: "Acceder al portal de productor",
    closing: "Esperamos con entusiasmo compartir su trabajo con nuestra comunidad.",
    signoff: "El equipo de Terravoa",
  },
  pt: {
    subject: "Bem-vindo/a à Terravoa — a sua candidatura foi aceite",
    greeting: (name) => `Caro/a ${name},`,
    intro: "Temos o prazer de lhe dar as boas-vindas à comunidade de produtores da Terravoa.",
    body: "A sua candidatura foi analisada e aprovada. Pode agora aceder ao seu portal de produtor para listar os seus produtos, gerir encomendas e desenvolver a sua presença no nosso marketplace.",
    cta: "Aceder ao portal de produtor",
    closing: "Aguardamos com entusiasmo a partilha do seu trabalho com a nossa comunidade.",
    signoff: "A equipa Terravoa",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Application rejected
// ─────────────────────────────────────────────────────────────────────────────

export type RejectedStrings = {
  subject: string
  greeting: (name: string) => string
  /** Polite opening — thanks + trust acknowledgement. Always rendered. */
  thanksIntro: string
  /** Decision sentence. Always rendered. */
  decision: string
  /** Lead-in for the bullet list. Only rendered when at least one reason is ticked. */
  reasonsLead: string
  /** Lead-in for the admin free-text note. Only rendered when a note exists. */
  noteLead: string
  /** Encouraging close — current curation focus, not a judgement, re-apply warm. */
  gentleClose: string
  signoff: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Rejection reason codes (STABLE — persisted in `producer_applications`).
// The admin UI is English-only; these codes are translated per-locale for the
// producer email. `other` is a free-text-only marker and has no localised
// wording — when ticked, only the admin's note is rendered in the email.
// ─────────────────────────────────────────────────────────────────────────────

export type RejectionReasonCode =
  | 'product_too_perishable'
  | 'contains_alcohol'
  | 'too_industrial'
  | 'not_direct_producer'
  | 'outside_category'
  | 'insufficient_differentiation'
  | 'missing_origin_proof'
  | 'quality_concerns'
  | 'shipping_limitations'
  | 'price_mismatch'
  | 'insufficient_capacity'
  | 'incomplete_information'
  | 'unverifiable_details'
  | 'timing'
  | 'other'

export const REJECTION_REASON_CODES: readonly RejectionReasonCode[] = [
  'product_too_perishable',
  'contains_alcohol',
  'too_industrial',
  'not_direct_producer',
  'outside_category',
  'insufficient_differentiation',
  'missing_origin_proof',
  'quality_concerns',
  'shipping_limitations',
  'price_mismatch',
  'insufficient_capacity',
  'incomplete_information',
  'unverifiable_details',
  'timing',
  'other',
] as const

/** Short labels shown in the admin rejection modal (English only — the admin
 * UI is English). Kept concise for the checkbox list. */
export const rejectionReasonAdminLabels: Record<RejectionReasonCode, string> = {
  product_too_perishable:       'Product too perishable / cold-chain',
  contains_alcohol:             'Contains alcoholic beverages',
  too_industrial:               'Production too industrial',
  not_direct_producer:          'Not a direct producer (reseller / importer)',
  outside_category:             'Outside current category focus',
  insufficient_differentiation: 'Insufficient differentiation / story',
  missing_origin_proof:         'Origin / terroir link not documented',
  quality_concerns:             'Quality concerns',
  shipping_limitations:         'Shipping / packaging not ready',
  price_mismatch:               'Price positioning mismatch',
  insufficient_capacity:        'Production capacity too low',
  incomplete_information:       'Incomplete information',
  unverifiable_details:         'Unverifiable details',
  timing:                       'Good fit, wrong timing (invite re-apply)',
  other:                        'Other (free-text note)',
}

/** Producer-facing wordings for each reason, per locale. `other` is intentionally
 * absent: when ticked it contributes only the admin's free-text note, not a
 * canned bullet. Keep the tone non-judgemental across every translation. */
export const rejectionReasonWordings: Record<
  SupportedLocale,
  Record<Exclude<RejectionReasonCode, 'other'>, string>
> = {
  en: {
    product_too_perishable:
      'Your products require faster or cold-chain logistics than our current cross-border shipping network can reliably guarantee.',
    contains_alcohol:
      'Our current selection does not yet include alcoholic beverages. We hope to open this category in the future and would welcome a renewed application then.',
    too_industrial:
      'Your production methods sit closer to industrial scale than the artisanal and small-batch focus we curate at Terravoa.',
    not_direct_producer:
      'Terravoa lists only producers who make the goods themselves. Your role appears to be closer to reseller, importer or distributor.',
    outside_category:
      'Your product category is outside the range we curate today.',
    insufficient_differentiation:
      'Your products, while of good quality, do not yet show the distinctive story or point of difference we look for in our catalogue.',
    missing_origin_proof:
      "The link between your products and a specific terroir or regional tradition isn't yet documented strongly enough.",
    quality_concerns:
      "Elements of the submission raised concerns about product or handling quality that we weren't able to resolve from the application alone.",
    shipping_limitations:
      "Your current shipping capability or packaging isn't yet ready for the cross-border e-commerce flow Terravoa operates.",
    price_mismatch:
      "Your price positioning doesn't fit our current marketplace.",
    insufficient_capacity:
      'Your production volume is below the level we need to support a consistent listing on the platform.',
    incomplete_information:
      'Your application was missing information we need to make a decision, and we were unable to reach you in time to complete it.',
    unverifiable_details:
      'We were unable to verify some key details (certifications, production location, or ownership).',
    timing:
      'Your profile is genuinely interesting, but our roster in your region and category is currently full. We warmly invite you to re-apply in six months.',
  },
  de: {
    product_too_perishable:
      'Ihre Produkte benötigen eine schnellere oder durchgehend gekühlte Logistik, als unser grenzüberschreitendes Versandnetz derzeit zuverlässig gewährleisten kann.',
    contains_alcohol:
      'Unsere aktuelle Auswahl umfasst noch keine alkoholischen Getränke. Wir hoffen, diese Kategorie in Zukunft zu öffnen, und würden uns über eine erneute Bewerbung dann sehr freuen.',
    too_industrial:
      'Ihre Produktionsmethoden liegen näher an einem industriellen Maßstab als an dem handwerklichen Charakter und der Kleinserien-Herstellung, die wir bei Terravoa kuratieren.',
    not_direct_producer:
      'Terravoa listet ausschließlich Produzent/innen, die ihre Erzeugnisse selbst herstellen. Ihre Tätigkeit entspricht eher der eines Wiederverkäufers, Importeurs oder Vertriebspartners.',
    outside_category:
      'Ihre Produktkategorie liegt außerhalb des Sortiments, das wir derzeit kuratieren.',
    insufficient_differentiation:
      'Ihre Produkte sind von guter Qualität, zeigen jedoch noch nicht die eigenständige Geschichte oder das unterscheidende Merkmal, das wir in unserem Katalog suchen.',
    missing_origin_proof:
      'Die Verbindung zwischen Ihren Produkten und einem bestimmten Terroir oder einer regionalen Tradition ist noch nicht ausreichend dokumentiert.',
    quality_concerns:
      'Elemente der Bewerbung haben Bedenken hinsichtlich der Produkt- oder Handhabungsqualität aufgeworfen, die wir allein auf Grundlage der Unterlagen nicht ausräumen konnten.',
    shipping_limitations:
      'Ihre aktuellen Versandmöglichkeiten oder Verpackungslösungen sind noch nicht bereit für den grenzüberschreitenden E-Commerce, den Terravoa betreibt.',
    price_mismatch:
      'Ihre Preispositionierung passt nicht zu unserem derzeitigen Marktplatz.',
    insufficient_capacity:
      'Ihre Produktionsmenge liegt unterhalb des Niveaus, das wir benötigen, um eine dauerhafte Listung auf der Plattform zu unterstützen.',
    incomplete_information:
      'Ihrer Bewerbung fehlten Informationen, die wir für eine Entscheidung benötigen, und wir konnten Sie nicht rechtzeitig erreichen, um dies zu vervollständigen.',
    unverifiable_details:
      'Wir konnten einige zentrale Angaben (Zertifikate, Produktionsstandort oder Eigentumsverhältnisse) nicht verifizieren.',
    timing:
      'Ihr Profil ist wirklich interessant, doch unser aktuelles Portfolio ist in Ihrer Region und Kategorie bereits ausgebucht. Wir laden Sie herzlich ein, sich in sechs Monaten erneut zu bewerben.',
  },
  fr: {
    product_too_perishable:
      "Vos produits nécessitent une logistique plus rapide ou à chaîne du froid que notre réseau de livraison transfrontalier ne peut actuellement garantir de manière fiable.",
    contains_alcohol:
      "Notre sélection actuelle n'inclut pas encore les boissons alcoolisées. Nous espérons ouvrir cette catégorie à l'avenir et nous serions heureux de recevoir une nouvelle candidature à ce moment-là.",
    too_industrial:
      "Vos méthodes de production se rapprochent davantage d'une échelle industrielle que de la démarche artisanale et en petites séries que nous privilégions chez Terravoa.",
    not_direct_producer:
      "Terravoa ne référence que les producteurs qui fabriquent eux-mêmes leurs produits. Votre rôle semble se rapprocher davantage de celui d'un revendeur, importateur ou distributeur.",
    outside_category:
      "Votre catégorie de produits se situe en dehors de la gamme que nous sélectionnons aujourd'hui.",
    insufficient_differentiation:
      "Vos produits, bien que de bonne qualité, ne mettent pas encore en avant l'histoire ou le point de différence distinctif que nous recherchons dans notre catalogue.",
    missing_origin_proof:
      "Le lien entre vos produits et un terroir ou une tradition régionale spécifique n'est pas encore documenté de manière suffisamment solide.",
    quality_concerns:
      "Certains éléments du dossier ont soulevé des interrogations sur la qualité du produit ou de sa manipulation, que nous n'avons pas pu lever à partir de la seule candidature.",
    shipping_limitations:
      "Vos capacités actuelles d'expédition ou de conditionnement ne sont pas encore prêtes pour le flux d'e-commerce transfrontalier que Terravoa opère.",
    price_mismatch:
      "Votre positionnement tarifaire ne correspond pas à notre marketplace actuelle.",
    insufficient_capacity:
      "Votre volume de production se situe en deçà du niveau nécessaire pour assurer une présence régulière sur la plateforme.",
    incomplete_information:
      "Votre candidature manquait d'informations nécessaires à notre décision, et nous n'avons pas pu vous joindre à temps pour la compléter.",
    unverifiable_details:
      "Nous n'avons pas pu vérifier certaines informations clés (certifications, lieu de production ou propriété).",
    timing:
      "Votre profil est véritablement intéressant, mais notre sélection est actuellement complète dans votre région et votre catégorie. Nous vous invitons chaleureusement à renouveler votre candidature dans six mois.",
  },
  it: {
    product_too_perishable:
      'I suoi prodotti richiedono una logistica più rapida o una catena del freddo che la nostra rete di spedizione transfrontaliera non è in grado di garantire con affidabilità in questo momento.',
    contains_alcohol:
      'La nostra selezione attuale non include ancora le bevande alcoliche. Speriamo di aprire questa categoria in futuro e saremmo lieti di ricevere una nuova candidatura in quel momento.',
    too_industrial:
      'I suoi metodi produttivi si avvicinano più a una scala industriale che al carattere artigianale e a piccoli lotti che selezioniamo in Terravoa.',
    not_direct_producer:
      'Terravoa inserisce esclusivamente produttori che realizzano direttamente i propri prodotti. Il suo ruolo appare più vicino a quello di rivenditore, importatore o distributore.',
    outside_category:
      'La sua categoria di prodotti è al di fuori della gamma che selezioniamo oggi.',
    insufficient_differentiation:
      'I suoi prodotti, pur essendo di buona qualità, non mostrano ancora la storia distintiva o il tratto differenziante che cerchiamo nel nostro catalogo.',
    missing_origin_proof:
      'Il legame tra i suoi prodotti e uno specifico terroir o una tradizione regionale non è ancora documentato in modo sufficientemente solido.',
    quality_concerns:
      'Alcuni elementi della candidatura hanno sollevato dubbi sulla qualità del prodotto o della sua gestione, che non siamo riusciti a chiarire sulla base della sola candidatura.',
    shipping_limitations:
      "Le sue attuali capacità di spedizione o di confezionamento non sono ancora pronte per il flusso di e-commerce transfrontaliero che Terravoa gestisce.",
    price_mismatch:
      'Il suo posizionamento di prezzo non è in linea con il nostro marketplace attuale.',
    insufficient_capacity:
      'Il suo volume produttivo è al di sotto del livello necessario per sostenere una presenza costante sulla piattaforma.',
    incomplete_information:
      "Alla sua candidatura mancavano informazioni necessarie per la nostra decisione, e non siamo riusciti a contattarla in tempo per completarla.",
    unverifiable_details:
      'Non siamo riusciti a verificare alcuni dati chiave (certificazioni, sede di produzione o proprietà).',
    timing:
      'Il suo profilo è davvero interessante, ma il nostro portafoglio nella sua regione e categoria è al momento al completo. La invitiamo cordialmente a ricandidarsi tra sei mesi.',
  },
  es: {
    product_too_perishable:
      'Sus productos requieren una logística más rápida o una cadena de frío que nuestra red de envíos transfronterizos no puede garantizar de forma fiable en este momento.',
    contains_alcohol:
      'Nuestra selección actual aún no incluye bebidas alcohólicas. Esperamos abrir esta categoría en el futuro y nos encantaría recibir una nueva solicitud suya en ese momento.',
    too_industrial:
      'Sus métodos de producción se acercan más a una escala industrial que al carácter artesanal y de pequeña producción que seleccionamos en Terravoa.',
    not_direct_producer:
      'Terravoa solo incluye a productores que elaboran sus productos por sí mismos. Su actividad parece más próxima a la de un revendedor, importador o distribuidor.',
    outside_category:
      'Su categoría de producto está fuera del rango que seleccionamos hoy.',
    insufficient_differentiation:
      'Sus productos, aunque de buena calidad, aún no muestran la historia distintiva o el elemento diferenciador que buscamos en nuestro catálogo.',
    missing_origin_proof:
      'El vínculo entre sus productos y un terroir o una tradición regional específica aún no está documentado con la solidez suficiente.',
    quality_concerns:
      'Algunos elementos de la solicitud plantearon dudas sobre la calidad del producto o su manipulación, que no pudimos resolver únicamente a partir del expediente.',
    shipping_limitations:
      'Su capacidad actual de envío o embalaje aún no está preparada para el flujo de comercio electrónico transfronterizo que opera Terravoa.',
    price_mismatch:
      'Su posicionamiento de precio no encaja con nuestro marketplace actual.',
    insufficient_capacity:
      'Su volumen de producción está por debajo del nivel que necesitamos para mantener una presencia constante en la plataforma.',
    incomplete_information:
      'Su solicitud carecía de información necesaria para tomar una decisión, y no pudimos contactar con usted a tiempo para completarla.',
    unverifiable_details:
      'No pudimos verificar algunos datos clave (certificaciones, ubicación de producción o titularidad).',
    timing:
      'Su perfil es realmente interesante, pero nuestro portafolio en su región y categoría está actualmente completo. Le invitamos cordialmente a volver a presentar su candidatura dentro de seis meses.',
  },
  pt: {
    product_too_perishable:
      'Os seus produtos requerem uma logística mais rápida ou uma cadeia de frio que a nossa rede de envios transfronteiriços não consegue garantir de forma fiável neste momento.',
    contains_alcohol:
      'A nossa seleção atual ainda não inclui bebidas alcoólicas. Esperamos abrir esta categoria no futuro e teríamos todo o gosto em receber uma nova candidatura sua nessa altura.',
    too_industrial:
      'Os seus métodos de produção aproximam-se mais de uma escala industrial do que do carácter artesanal e de pequenas séries que selecionamos na Terravoa.',
    not_direct_producer:
      'A Terravoa apenas apresenta produtores que produzem diretamente os seus bens. A sua função parece mais próxima de revendedor, importador ou distribuidor.',
    outside_category:
      'A sua categoria de produto situa-se fora da gama que selecionamos atualmente.',
    insufficient_differentiation:
      'Os seus produtos, embora de boa qualidade, ainda não evidenciam a história distintiva ou o elemento diferenciador que procuramos no nosso catálogo.',
    missing_origin_proof:
      'A ligação entre os seus produtos e um terroir ou tradição regional específica ainda não está documentada com a solidez necessária.',
    quality_concerns:
      'Alguns elementos da candidatura levantaram dúvidas sobre a qualidade do produto ou do seu manuseamento, que não conseguimos esclarecer apenas com base no processo.',
    shipping_limitations:
      'As suas capacidades atuais de envio ou de embalagem ainda não estão preparadas para o fluxo de comércio eletrónico transfronteiriço que a Terravoa opera.',
    price_mismatch:
      'O seu posicionamento de preço não se enquadra no nosso marketplace atual.',
    insufficient_capacity:
      'O seu volume de produção está abaixo do nível necessário para sustentar uma presença constante na plataforma.',
    incomplete_information:
      'A sua candidatura não continha informações necessárias para a nossa decisão, e não conseguimos contactá-lo/a a tempo de a completar.',
    unverifiable_details:
      'Não conseguimos verificar alguns dados-chave (certificações, local de produção ou titularidade).',
    timing:
      'O seu perfil é genuinamente interessante, mas o nosso portefólio na sua região e categoria está atualmente completo. Convidamo-lo/a cordialmente a apresentar nova candidatura dentro de seis meses.',
  },
}

export const rejectedStrings: Record<SupportedLocale, RejectedStrings> = {
  en: {
    subject: "Your Terravoa application",
    greeting: (name) => `Dear ${name},`,
    thanksIntro: "Thank you for your application and for the trust you have placed in Terravoa by sharing your work with us.",
    decision: "After careful review, we have decided not to move forward with your application at this stage.",
    reasonsLead: "The main reasons for our decision are the following:",
    noteLead: "An additional note from our curation team:",
    gentleClose: "This decision reflects our current curation focus and is by no means a judgement on your craft. We wish you every success, and we would warmly welcome a renewed application in the future if circumstances change.",
    signoff: "The Terravoa team",
  },
  de: {
    subject: "Ihre Bewerbung bei Terravoa",
    greeting: (name) => `Sehr geehrte/r ${name},`,
    thanksIntro: "Vielen Dank für Ihre Bewerbung und für das Vertrauen, das Sie Terravoa entgegenbringen, indem Sie uns Ihre Arbeit vorgestellt haben.",
    decision: "Nach sorgfältiger Prüfung haben wir uns entschieden, Ihre Bewerbung zum jetzigen Zeitpunkt nicht weiter zu verfolgen.",
    reasonsLead: "Die wesentlichen Gründe für unsere Entscheidung sind folgende:",
    noteLead: "Eine zusätzliche Anmerkung unseres Kuratierungsteams:",
    gentleClose: "Diese Entscheidung spiegelt unseren aktuellen Kuratierungsschwerpunkt wider und stellt keine Bewertung Ihres Handwerks dar. Wir wünschen Ihnen viel Erfolg und würden uns freuen, wenn Sie sich in Zukunft erneut bei uns bewerben, sollten sich die Umstände ändern.",
    signoff: "Das Terravoa-Team",
  },
  fr: {
    subject: "Votre candidature Terravoa",
    greeting: (name) => `Chère/Cher ${name},`,
    thanksIntro: "Nous vous remercions pour votre candidature et pour la confiance que vous accordez à Terravoa en nous présentant votre travail.",
    decision: "Après un examen attentif, nous avons décidé de ne pas donner suite à votre candidature à ce stade.",
    reasonsLead: "Les principales raisons de notre décision sont les suivantes :",
    noteLead: "Un mot complémentaire de notre équipe de curation :",
    gentleClose: "Cette décision reflète notre ligne éditoriale actuelle et ne constitue en aucun cas un jugement sur votre savoir-faire. Nous vous souhaitons le meilleur et serions heureux d'accueillir une nouvelle candidature de votre part si les circonstances venaient à évoluer.",
    signoff: "L'équipe Terravoa",
  },
  it: {
    subject: "La sua candidatura a Terravoa",
    greeting: (name) => `Gentile ${name},`,
    thanksIntro: "La ringraziamo per la sua candidatura e per la fiducia che ha riposto in Terravoa condividendo con noi il suo lavoro.",
    decision: "Dopo un'attenta valutazione, abbiamo deciso di non procedere con la sua candidatura in questa fase.",
    reasonsLead: "Le principali ragioni della nostra decisione sono le seguenti:",
    noteLead: "Una nota aggiuntiva dal nostro team di curatela:",
    gentleClose: "Questa decisione riflette il nostro attuale orientamento editoriale e non rappresenta in alcun modo un giudizio sul suo lavoro artigianale. Le auguriamo ogni successo e saremmo lieti di ricevere una sua nuova candidatura in futuro, qualora le circostanze dovessero cambiare.",
    signoff: "Il team Terravoa",
  },
  es: {
    subject: "Su solicitud en Terravoa",
    greeting: (name) => `Estimado/a ${name}:`,
    thanksIntro: "Le agradecemos su solicitud y la confianza que ha depositado en Terravoa al compartir su trabajo con nosotros.",
    decision: "Tras una cuidadosa revisión, hemos decidido no seguir adelante con su candidatura en esta fase.",
    reasonsLead: "Las principales razones de nuestra decisión son las siguientes:",
    noteLead: "Una nota adicional de nuestro equipo de curaduría:",
    gentleClose: "Esta decisión refleja nuestro enfoque de selección actual y no representa en modo alguno un juicio sobre su oficio. Le deseamos mucho éxito y estaríamos encantados de recibir una nueva solicitud suya en el futuro, si las circunstancias cambian.",
    signoff: "El equipo de Terravoa",
  },
  pt: {
    subject: "A sua candidatura à Terravoa",
    greeting: (name) => `Caro/a ${name},`,
    thanksIntro: "Agradecemos a sua candidatura e a confiança que depositou na Terravoa ao partilhar o seu trabalho connosco.",
    decision: "Após uma análise cuidadosa, decidimos não avançar com a sua candidatura nesta fase.",
    reasonsLead: "As principais razões da nossa decisão são as seguintes:",
    noteLead: "Uma nota adicional da nossa equipa de curadoria:",
    gentleClose: "Esta decisão reflete o nosso foco de curadoria atual e não representa de forma alguma um julgamento sobre o seu ofício. Desejamos-lhe muito sucesso e teríamos todo o gosto em receber uma nova candidatura sua no futuro, caso as circunstâncias evoluam.",
    signoff: "A equipa Terravoa",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Buyer order confirmation
// ─────────────────────────────────────────────────────────────────────────────

export type BuyerStrings = {
  subject: (ref: string) => string
  greeting: (name: string) => string
  intro: string
  tableHeaders: { item: string; qty: string; total: string }
  orderRef: string
  totalPaid: string
  cta: string
  signoff: string
}

export const buyerStrings: Record<SupportedLocale, BuyerStrings> = {
  en: {
    subject: (ref) => `Your Terravoa order · ${ref}`,
    greeting: (name) => `Dear ${name},`,
    intro: "Thank you for your order. Each item is shipped directly from the producer to your door.",
    tableHeaders: { item: "Item", qty: "Qty", total: "Total" },
    orderRef: "Order reference",
    totalPaid: "Total paid",
    cta: "Continue exploring the collection",
    signoff: "The Terravoa team",
  },
  de: {
    subject: (ref) => `Ihre Terravoa-Bestellung · ${ref}`,
    greeting: (name) => `Sehr geehrte/r ${name},`,
    intro: "Vielen Dank für Ihre Bestellung. Jeder Artikel wird direkt vom Produzenten zu Ihnen nach Hause geliefert.",
    tableHeaders: { item: "Artikel", qty: "Menge", total: "Gesamt" },
    orderRef: "Bestellnummer",
    totalPaid: "Bezahlter Betrag",
    cta: "Kollektion weiter entdecken",
    signoff: "Das Terravoa-Team",
  },
  fr: {
    subject: (ref) => `Votre commande Terravoa · ${ref}`,
    greeting: (name) => `Chère/Cher ${name},`,
    intro: "Merci pour votre commande. Chaque article est expédié directement depuis le producteur jusqu'à votre porte.",
    tableHeaders: { item: "Article", qty: "Qté", total: "Total" },
    orderRef: "Référence de commande",
    totalPaid: "Total payé",
    cta: "Continuer à explorer la collection",
    signoff: "L'équipe Terravoa",
  },
  it: {
    subject: (ref) => `Il suo ordine Terravoa · ${ref}`,
    greeting: (name) => `Gentile ${name},`,
    intro: "La ringraziamo per il suo ordine. Ogni articolo viene spedito direttamente dal produttore fino a casa sua.",
    tableHeaders: { item: "Articolo", qty: "Qtà", total: "Totale" },
    orderRef: "Riferimento ordine",
    totalPaid: "Totale pagato",
    cta: "Continua a esplorare la collezione",
    signoff: "Il team Terravoa",
  },
  es: {
    subject: (ref) => `Su pedido en Terravoa · ${ref}`,
    greeting: (name) => `Estimado/a ${name}:`,
    intro: "Gracias por su pedido. Cada artículo es enviado directamente desde el productor hasta su puerta.",
    tableHeaders: { item: "Artículo", qty: "Cant.", total: "Total" },
    orderRef: "Referencia del pedido",
    totalPaid: "Total pagado",
    cta: "Seguir explorando la colección",
    signoff: "El equipo de Terravoa",
  },
  pt: {
    subject: (ref) => `A sua encomenda Terravoa · ${ref}`,
    greeting: (name) => `Caro/a ${name},`,
    intro: "Obrigado/a pela sua encomenda. Cada artigo é enviado diretamente do produtor para a sua porta.",
    tableHeaders: { item: "Artigo", qty: "Qtd.", total: "Total" },
    orderRef: "Referência da encomenda",
    totalPaid: "Total pago",
    cta: "Continuar a explorar a coleção",
    signoff: "A equipa Terravoa",
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Producer new order notification
// ─────────────────────────────────────────────────────────────────────────────

export type ProducerStrings = {
  subject: (producerName: string) => string
  greeting: (name: string) => string
  intro: string
  shipTo: string
  tableHeaders: { product: string; qty: string; total: string }
  orderRef: string
  cta: string
  signoff: string
}

export const producerStrings: Record<SupportedLocale, ProducerStrings> = {
  en: {
    subject: (name) => `New Terravoa order for ${name}`,
    greeting: (name) => `Dear ${name},`,
    intro: "You have received a new order. Please prepare and ship the following items as soon as possible.",
    shipTo: "Ship to",
    tableHeaders: { product: "Your items", qty: "Qty", total: "Line" },
    orderRef: "Order reference",
    cta: "View order in dashboard",
    signoff: "The Terravoa team",
  },
  de: {
    subject: (name) => `Neue Terravoa-Bestellung für ${name}`,
    greeting: (name) => `Sehr geehrte/r ${name},`,
    intro: "Sie haben eine neue Bestellung erhalten. Bitte bereiten Sie die folgenden Artikel so schnell wie möglich vor und versenden Sie sie.",
    shipTo: "Lieferadresse",
    tableHeaders: { product: "Ihre Artikel", qty: "Menge", total: "Betrag" },
    orderRef: "Bestellnummer",
    cta: "Bestellung im Dashboard ansehen",
    signoff: "Das Terravoa-Team",
  },
  fr: {
    subject: (name) => `Nouvelle commande Terravoa pour ${name}`,
    greeting: (name) => `Chère/Cher ${name},`,
    intro: "Vous avez reçu une nouvelle commande. Veuillez préparer et expédier les articles suivants dans les meilleurs délais.",
    shipTo: "Adresse de livraison",
    tableHeaders: { product: "Vos articles", qty: "Qté", total: "Montant" },
    orderRef: "Référence de commande",
    cta: "Voir la commande dans le tableau de bord",
    signoff: "L'équipe Terravoa",
  },
  it: {
    subject: (name) => `Nuovo ordine Terravoa per ${name}`,
    greeting: (name) => `Gentile ${name},`,
    intro: "Ha ricevuto un nuovo ordine. La preghiamo di preparare e spedire gli articoli seguenti il prima possibile.",
    shipTo: "Indirizzo di spedizione",
    tableHeaders: { product: "I suoi articoli", qty: "Qtà", total: "Importo" },
    orderRef: "Riferimento ordine",
    cta: "Visualizza l'ordine nella dashboard",
    signoff: "Il team Terravoa",
  },
  es: {
    subject: (name) => `Nuevo pedido en Terravoa para ${name}`,
    greeting: (name) => `Estimado/a ${name}:`,
    intro: "Ha recibido un nuevo pedido. Por favor, prepare y envíe los siguientes artículos a la mayor brevedad posible.",
    shipTo: "Dirección de envío",
    tableHeaders: { product: "Sus artículos", qty: "Cant.", total: "Importe" },
    orderRef: "Referencia del pedido",
    cta: "Ver pedido en el panel de control",
    signoff: "El equipo de Terravoa",
  },
  pt: {
    subject: (name) => `Nova encomenda Terravoa para ${name}`,
    greeting: (name) => `Caro/a ${name},`,
    intro: "Recebeu uma nova encomenda. Por favor, prepare e envie os seguintes artigos o mais brevemente possível.",
    shipTo: "Endereço de entrega",
    tableHeaders: { product: "Os seus artigos", qty: "Qtd.", total: "Valor" },
    orderRef: "Referência da encomenda",
    cta: "Ver encomenda no painel de controlo",
    signoff: "A equipa Terravoa",
  },
}
