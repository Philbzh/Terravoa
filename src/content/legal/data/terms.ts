import type { LegalLocale, LegalSection } from '@/lib/legal/types'

export const termsSections: Record<LegalLocale, LegalSection[]> = {
  en: [
    {
      heading: '1. Introduction',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'These Terms and Conditions (“Terms”) govern your access to and use of the {siteName} website and marketplace platform (the “Platform”), operated by {companyName}, a company registered in France. By accessing the Platform or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms in their entirety.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'If you do not agree to these Terms, you must not use the Platform. We reserve the right to update these Terms at any time; continued use of the Platform after any change constitutes your acceptance of the revised Terms.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Use of the Platform',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:' },
          ],
        },
        {
          type: 'ul',
          items: [
            'Use the Platform in any way that violates applicable French or EU law or regulation.',
            'Transmit any unsolicited or unauthorised advertising or promotional material.',
            'Attempt to gain unauthorised access to any part of the Platform or its related systems.',
            'Use automated tools to scrape, crawl, or extract data from the Platform without our prior written consent.',
            'Impersonate any person or entity, or falsely represent your affiliation with any person or entity.',
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'We reserve the right to suspend or terminate your account at any time if we have reason to believe you have breached these Terms.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. Orders & Payments',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'All prices displayed on the Platform are in Euros (EUR) and include applicable VAT unless otherwise stated. By submitting an order, you make a binding offer to purchase the selected products. A contract of sale is formed when you receive an order confirmation by email.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Payment is processed securely at the time of purchase via Stripe. We accept major credit and debit cards, Apple Pay, and Google Pay. Your payment details are never stored on our servers. Orders are dispatched only after successful payment authorisation.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: '{siteName} acts as the merchant of record for all transactions on the Platform. Producers receive payment for their goods through our internal settlement process after order fulfilment.',
            },
          ],
        },
      ],
    },
    {
      heading: '4. Producer Responsibilities',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Producers listed on the Platform are independent sellers who have entered into a separate Producer Agreement with {siteName}. Each producer is responsible for:',
            },
          ],
        },
        {
          type: 'ul',
          items: [
            'The accuracy of all product information, descriptions, ingredients, and allergen declarations.',
            'Compliance with all applicable food safety, labelling, and hygiene regulations in their jurisdiction and destination markets.',
            'Packing, preparing, and dispatching orders in a timely and professional manner.',
            'Maintaining appropriate product liability insurance.',
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "{siteName} conducts due-diligence checks on producers before listing, but does not act as the manufacturer or direct seller of any product. As a consumer, your statutory rights under EU consumer protection law apply regardless of the producer's country of origin.",
            },
          ],
        },
        { type: 'h3', text: 'Consumer reviews' },
        {
          type: 'p',
          parts: [
            {
              text: "{siteName} displays product star ratings and written reviews submitted by customers who purchased through the Platform. They reflect buyers' product and, where relevant, fulfilment experience. {siteName} does not write, set, or edit individual ratings as its own opinion. We may moderate or remove unlawful, abusive, fraudulent, or spam content, but we do not alter star ratings for commercial reasons or to favour any producer or customer.",
            },
          ],
        },
        { type: 'h3', text: 'Producer listings and performance' },
        {
          type: 'p',
          parts: [
            {
              text: '{siteName} may suspend or remove listings where a producer shows sustained poor customer feedback, repeated shipping or packaging failures, unresponsiveness to legitimate buyer enquiries, or serious breaches of the Producer Agreement, after reasonable notice where contractually required. This discretion is exercised to protect customers and marketplace integrity. Nothing in these Terms limits mandatory consumer rights or relieves producers of their legal obligations.',
            },
          ],
        },
      ],
    },
    {
      heading: '5. Intellectual Property',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'All content on the Platform — including text, images, logos, graphics, video, and software — is the property of {companyName} or its licensors and is protected by French and EU intellectual property law. You may not reproduce, distribute, or create derivative works from any content on the Platform without our express written permission.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Product images and descriptions provided by producers remain the intellectual property of the respective producer. By uploading content to the Platform, producers grant {siteName} a non-exclusive, royalty-free licence to use that content for the purposes of operating and promoting the Platform.',
            },
          ],
        },
      ],
    },
    {
      heading: '6. Limitation of Liability',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'To the fullest extent permitted by applicable law, {siteName} shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform or purchase of products through it, including but not limited to loss of profit, loss of data, or business interruption.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded under applicable French or EU law.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Your statutory consumer rights under EU Directive 2011/83/EU on consumer rights and the applicable French transposing legislation are not affected by these Terms.',
            },
          ],
        },
      ],
    },
    {
      heading: '7. Governing Law',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of France, without prejudice to any mandatory consumer protection provisions of the law of your country of habitual residence within the EU.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Any dispute that cannot be resolved amicably may be submitted to the competent courts of Paris, France, unless you are entitled under EU law to bring proceedings before the courts of your country of residence. As a consumer within the EU, you also have access to the European Commission’s Online Dispute Resolution platform at ',
            },
            { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: '8. Returns & Refunds',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'Please refer to our ' },
            { internal: '/returns', label: 'Returns & Refunds Policy' },
            { text: ' for detailed information about your right of withdrawal and how to request a return or refund.' },
          ],
        },
      ],
    },
    {
      heading: '9. Contact',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'For questions regarding these Terms, please contact us at ' },
            { mailto: 'legal@terravoa.com' },
            { text: ' or by post at: {companyName}, {companyAddress}.' },
          ],
        },
      ],
    },
  ],
  de: [
    { heading: '1. Einleitung', blocks: [{ type: 'p', parts: [{ text: 'Diese Allgemeinen Geschäftsbedingungen („Bedingungen“) regeln Ihren Zugriff auf die Website und Marktplattform von {siteName} (die „Plattform“), betrieben von {companyName}, einem in Frankreich eingetragenen Unternehmen. Durch den Zugriff auf die Plattform oder die Aufgabe einer Bestellung bestätigen Sie, dass Sie diese Bedingungen gelesen und verstanden haben und ihnen vollständig zustimmen.' }] }, { type: 'p', parts: [{ text: 'Wenn Sie diesen Bedingungen nicht zustimmen, dürfen Sie die Plattform nicht nutzen. Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu aktualisieren; die fortgesetzte Nutzung der Plattform nach einer Änderung gilt als Annahme der überarbeiteten Bedingungen.' }] }] },
    { heading: '2. Nutzung der Plattform', blocks: [{ type: 'p', parts: [{ text: 'Sie dürfen die Plattform nur zu rechtmäßigen Zwecken und gemäß diesen Bedingungen nutzen. Sie verpflichten sich, Folgendes zu unterlassen:' }] }, { type: 'ul', items: ['Nutzung der Plattform in einer Weise, die gegen anwendbares französisches oder EU-Recht verstößt.', 'Übermittlung unerbetener oder unbefugter Werbe- oder Promotionsinhalte.', 'Versuch, unbefugten Zugriff auf Teile der Plattform oder verbundene Systeme zu erlangen.', 'Einsatz automatisierter Tools zum Scrapen, Crawlen oder Extrahieren von Daten der Plattform ohne unsere vorherige schriftliche Zustimmung.', 'Vortäuschung einer anderen Person oder Organisation oder falsche Darstellung einer Zugehörigkeit.'] }, { type: 'p', parts: [{ text: 'Wir behalten uns das Recht vor, Ihr Konto jederzeit auszusetzen oder zu beenden, wenn wir Grund zu der Annahme haben, dass Sie gegen diese Bedingungen verstoßen haben.' }] }] },
    { heading: '3. Bestellungen & Zahlungen', blocks: [{ type: 'p', parts: [{ text: 'Alle auf der Plattform angegebenen Preise sind in Euro (EUR) und enthalten, sofern nicht anders angegeben, die anwendbare Mehrwertsteuer. Mit Abgabe einer Bestellung unterbreiten Sie ein verbindliches Angebot zum Kauf der ausgewählten Produkte. Ein Kaufvertrag kommt zustande, wenn Sie eine Bestellbestätigung per E-Mail erhalten.' }] }, { type: 'p', parts: [{ text: 'Die Zahlung wird beim Kauf über Stripe sicher verarbeitet. Wir akzeptieren gängige Kredit- und Debitkarten, Apple Pay und Google Pay. Ihre Zahlungsdaten werden niemals auf unseren Servern gespeichert. Bestellungen werden erst nach erfolgreicher Zahlungsautorisierung versendet.' }] }, { type: 'p', parts: [{ text: '{siteName} ist für alle Transaktionen auf der Plattform der vertragliche Verkäufer (Merchant of Record). Produzenten erhalten die Vergütung für ihre Waren nach Auftragsabwicklung über unseren internen Abrechnungsprozess.' }] }] },
    { heading: '4. Verantwortlichkeiten der Produzenten', blocks: [{ type: 'p', parts: [{ text: 'Auf der Plattform gelistete Produzenten sind unabhängige Verkäufer, die mit {siteName} einen gesonderten Produzentenvertrag geschlossen haben. Jeder Produzent ist verantwortlich für:' }] }, { type: 'ul', items: ['Die Richtigkeit sämtlicher Produktinformationen, Beschreibungen, Zutatenangaben und Allergenhinweise.', 'Die Einhaltung aller anwendbaren Vorschriften zu Lebensmittelsicherheit, Kennzeichnung und Hygiene in seinem Zuständigkeitsbereich und den Bestimmungsmärkten.', 'Die fristgerechte und professionelle Verpackung, Vorbereitung und Versendung von Bestellungen.', 'Den Abschluss und die Aufrechterhaltung einer angemessenen Produkthaftpflichtversicherung.'] }, { type: 'p', parts: [{ text: '{siteName} führt vor einer Listung Sorgfaltsprüfungen bei Produzenten durch, handelt jedoch nicht als Hersteller oder unmittelbarer Verkäufer eines Produkts. Ihre gesetzlichen Rechte als Verbraucher nach EU-Recht gelten unabhängig vom Herkunftsland des Produzenten.' }] }, { type: 'h3', text: 'Kundenbewertungen' }, { type: 'p', parts: [{ text: 'Sternebewertungen und schriftliche Rezensionen auf der Plattform werden von Kundinnen und Kunden abgegeben, die über {siteName} gekauft haben. Sie spiegeln deren Produkt- und gegebenenfalls Erfüllungserfahrung wider. {siteName} verfasst, setzt oder bearbeitet keine individuellen Bewertungen als eigene Meinung. Wir können rechtswidrige, missbräuchliche, betrügerische oder Spam-Inhalte moderieren oder entfernen, verändern jedoch keine Sternebewertungen aus kommerziellen Gründen oder zur Bevorzugung einzelner Produzenten oder Kunden.' }] }, { type: 'h3', text: 'Produzentenlistings und Leistung' }, { type: 'p', parts: [{ text: 'Bei dauerhaft schlechten Kundenbewertungen, wiederholten Versand- oder Verpackungsfehlern, mangelnder Reaktion auf berechtigte Käuferanfragen oder schwerwiegenden Verstößen gegen den Produzentenvertrag kann {siteName} Listings nach angemessener Vorankündigung (soweit vertraglich erforderlich) aussetzen oder entfernen. Dieses Ermessen dient dem Schutz von Kundschaft und Marktplatzintegrität. Zwingende Verbraucherrechte und gesetzliche Pflichten der Produzenten bleiben unberührt.' }] }] },
    { heading: '5. Geistiges Eigentum', blocks: [{ type: 'p', parts: [{ text: 'Alle Inhalte auf der Plattform — einschließlich Texte, Bilder, Logos, Grafiken, Videos und Software — sind Eigentum von {companyName} oder dessen Lizenzgebern und durch französisches und EU-Recht zum geistigen Eigentum geschützt. Ohne unsere ausdrückliche schriftliche Zustimmung dürfen Sie keine Inhalte reproduzieren, verbreiten oder davon abgeleitete Werke erstellen.' }] }, { type: 'p', parts: [{ text: 'Von Produzenten bereitgestellte Produktbilder und -beschreibungen bleiben geistiges Eigentum des jeweiligen Produzenten. Durch das Hochladen von Inhalten auf die Plattform gewähren Produzenten {siteName} eine nicht-exklusive, gebührenfreie Lizenz zur Nutzung dieser Inhalte für den Betrieb und die Bewerbung der Plattform.' }] }] },
    { heading: '6. Haftungsbeschränkung', blocks: [{ type: 'p', parts: [{ text: 'Soweit gesetzlich zulässig, haftet {siteName} nicht für indirekte, zufällige, besondere oder Folgeschäden, die aus oder im Zusammenhang mit der Nutzung der Plattform oder dem Kauf von Produkten über die Plattform entstehen, einschließlich entgangenem Gewinn, Datenverlust oder Betriebsunterbrechung.' }] }, { type: 'p', parts: [{ text: 'Nichts in diesen Bedingungen beschränkt oder schließt unsere Haftung für Tod oder Personenschäden durch Fahrlässigkeit, Betrug oder arglistige Täuschung oder für sonstige Haftung aus, die nach anwendbarem französischem oder EU-Recht nicht ausgeschlossen werden kann.' }] }, { type: 'p', parts: [{ text: 'Ihre gesetzlichen Verbraucherrechte nach der Richtlinie 2011/83/EU und den anwendbaren französischen Umsetzungsvorschriften bleiben unberührt.' }] }] },
    { heading: '7. Anwendbares Recht', blocks: [{ type: 'p', parts: [{ text: 'Diese Bedingungen sowie alle Streitigkeiten oder Ansprüche aus oder im Zusammenhang mit ihnen unterliegen dem Recht Frankreichs und sind danach auszulegen, unbeschadet zwingender Verbraucherschutzvorschriften des Rechts Ihres gewöhnlichen Aufenthaltsstaats innerhalb der EU.' }] }, { type: 'p', parts: [{ text: 'Streitigkeiten, die nicht einvernehmlich beigelegt werden können, können den zuständigen Gerichten in Paris, Frankreich, vorgelegt werden, sofern Ihnen nach EU-Recht nicht die Klage vor den Gerichten Ihres Wohnsitzlandes zusteht. Verbraucherinnen und Verbraucher in der EU haben zudem Zugang zur Online-Streitbeilegungsplattform der Europäischen Kommission unter ' }, { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true }, { text: '.' }] }] },
    { heading: '8. Rückgaben & Erstattungen', blocks: [{ type: 'p', parts: [{ text: 'Bitte lesen Sie unsere ' }, { internal: '/returns', label: 'Rückgabe- und Erstattungsrichtlinie' }, { text: ' für detaillierte Informationen zu Ihrem Widerrufsrecht und zum Ablauf einer Rückgabe oder Erstattung.' }] }] },
    { heading: '9. Kontakt', blocks: [{ type: 'p', parts: [{ text: 'Bei Fragen zu diesen Bedingungen kontaktieren Sie uns bitte unter ' }, { mailto: 'legal@terravoa.com' }, { text: ' oder per Post an: {companyName}, {companyAddress}.' }] }] },
  ],
  fr: [
    { heading: '1. Introduction', blocks: [{ type: 'p', parts: [{ text: 'Les présentes Conditions générales (« Conditions ») régissent votre accès et votre utilisation du site web et de la plateforme de marché {siteName} (« la Plateforme »), exploités par {companyName}, société immatriculée en France. En accédant à la Plateforme ou en passant commande, vous confirmez avoir lu, compris et accepté l’intégralité des présentes Conditions.' }] }, { type: 'p', parts: [{ text: "Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser la Plateforme. Nous nous réservons le droit de les modifier à tout moment ; l'utilisation continue de la Plateforme après une modification vaut acceptation des Conditions révisées." }] }] },
    { heading: '2. Utilisation de la Plateforme', blocks: [{ type: 'p', parts: [{ text: 'Vous ne pouvez utiliser la Plateforme qu’à des fins licites et conformément aux présentes Conditions. Vous vous engagez à ne pas :' }] }, { type: 'ul', items: ['Utiliser la Plateforme d’une manière contraire au droit ou à la réglementation française ou de l’UE.', 'Transmettre des contenus publicitaires ou promotionnels non sollicités ou non autorisés.', 'Tenter d’accéder sans autorisation à toute partie de la Plateforme ou à ses systèmes associés.', 'Utiliser des outils automatisés pour aspirer, explorer ou extraire des données de la Plateforme sans notre accord écrit préalable.', 'Usurper l’identité d’une personne ou entité, ou présenter faussement votre affiliation.'] }, { type: 'p', parts: [{ text: 'Nous nous réservons le droit de suspendre ou de résilier votre compte à tout moment si nous avons des raisons de penser que vous avez enfreint les présentes Conditions.' }] }] },
    { heading: '3. Commandes et paiements', blocks: [{ type: 'p', parts: [{ text: 'Tous les prix affichés sur la Plateforme sont en euros (EUR) et incluent la TVA applicable, sauf indication contraire. En soumettant une commande, vous formulez une offre ferme d’achat des produits sélectionnés. Le contrat de vente est formé lorsque vous recevez une confirmation de commande par e-mail.' }] }, { type: 'p', parts: [{ text: 'Le paiement est traité de manière sécurisée au moment de l’achat via Stripe. Nous acceptons les principales cartes de crédit et de débit, Apple Pay et Google Pay. Vos informations de paiement ne sont jamais stockées sur nos serveurs. Les commandes sont expédiées uniquement après autorisation de paiement réussie.' }] }, { type: 'p', parts: [{ text: '{siteName} agit en qualité de marchand contractuel (merchant of record) pour toutes les transactions de la Plateforme. Les producteurs sont rémunérés via notre processus interne de règlement après exécution de la commande.' }] }] },
    { heading: '4. Responsabilités des producteurs', blocks: [{ type: 'p', parts: [{ text: 'Les producteurs référencés sur la Plateforme sont des vendeurs indépendants ayant conclu un accord Producteur distinct avec {siteName}. Chaque producteur est responsable de :' }] }, { type: 'ul', items: ['La précision de toutes les informations produits, descriptions, ingrédients et déclarations d’allergènes.', 'La conformité à l’ensemble des réglementations applicables en matière de sécurité alimentaire, d’étiquetage et d’hygiène dans sa juridiction et les marchés de destination.', 'L’emballage, la préparation et l’expédition des commandes en temps utile et de manière professionnelle.', 'Le maintien d’une assurance responsabilité produit appropriée.'] }, { type: 'p', parts: [{ text: "{siteName} réalise des vérifications préalables des producteurs avant référencement, mais n'agit pas en qualité de fabricant ni de vendeur direct des produits. Vos droits légaux de consommateur en vertu du droit de l'UE s'appliquent indépendamment du pays d'origine du producteur." }] }, { type: 'h3', text: 'Avis consommateurs' }, { type: 'p', parts: [{ text: "Les notes par étoiles et avis affichés sur la Plateforme sont soumis par des clients ayant acheté via {siteName}. Ils reflètent l'expérience des acheteurs avec le produit et, le cas échéant, avec l'exécution de la commande. {siteName} ne rédige pas, ne fixe pas et ne modifie pas les notes individuelles en tant qu'opinion propre. Nous pouvons modérer ou supprimer les contenus illicites, abusifs, frauduleux ou de spam, mais nous ne modifions pas les notes pour des motifs commerciaux ni pour favoriser un producteur ou un client." }] }, { type: 'h3', text: 'Référencement et performance des producteurs' }, { type: 'p', parts: [{ text: "En cas d'évaluations clients durablement défavorables, d'échecs répétés d'expédition ou d'emballage, d'absence de réponse à des demandes légitimes d'acheteurs, ou de violations graves de l'accord Producteur, {siteName} peut, après préavis raisonnable lorsque contractuellement requis, suspendre ou retirer des références. Ce pouvoir d'appréciation vise à protéger les clients et l'intégrité de la place de marché. Les droits impératifs des consommateurs et les obligations légales des producteurs demeurent inchangés." }] }] },
    { heading: '5. Propriété intellectuelle', blocks: [{ type: 'p', parts: [{ text: "L'ensemble des contenus de la Plateforme — notamment textes, images, logos, graphismes, vidéos et logiciels — est la propriété de {companyName} ou de ses concédants et est protégé par le droit français et le droit de l'UE en matière de propriété intellectuelle. Vous ne pouvez reproduire, distribuer ni créer d'œuvres dérivées à partir des contenus de la Plateforme sans notre autorisation écrite expresse." }] }, { type: 'p', parts: [{ text: 'Les images et descriptions de produits fournies par les producteurs restent la propriété intellectuelle du producteur concerné. En téléversant du contenu sur la Plateforme, les producteurs accordent à {siteName} une licence non exclusive et gratuite pour utiliser ce contenu aux fins d’exploitation et de promotion de la Plateforme.' }] }] },
    { heading: '6. Limitation de responsabilité', blocks: [{ type: 'p', parts: [{ text: "Dans toute la mesure permise par la loi applicable, {siteName} ne saurait être tenu responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de, ou liés à, votre utilisation de la Plateforme ou à l'achat de produits via celle-ci, y compris notamment la perte de profit, la perte de données ou l'interruption d'activité." }] }, { type: 'p', parts: [{ text: "Aucune disposition des présentes Conditions ne limite ni n'exclut notre responsabilité en cas de décès ou de dommages corporels causés par notre négligence, de fraude ou de déclaration frauduleuse, ni toute autre responsabilité qui ne peut être exclue en vertu du droit français ou du droit de l'UE applicable." }] }, { type: 'p', parts: [{ text: 'Vos droits légaux de consommateur au titre de la directive 2011/83/UE et de la législation française de transposition ne sont pas affectés par les présentes Conditions.' }] }] },
    { heading: '7. Droit applicable', blocks: [{ type: 'p', parts: [{ text: 'Les présentes Conditions ainsi que tout litige ou toute réclamation en découlant ou en lien avec celles-ci sont régis et interprétés conformément au droit français, sans préjudice des dispositions impératives de protection des consommateurs du droit de votre pays de résidence habituelle au sein de l’UE.' }] }, { type: 'p', parts: [{ text: 'Tout litige ne pouvant être résolu à l’amiable peut être porté devant les juridictions compétentes de Paris, France, sauf si le droit de l’UE vous autorise à agir devant les juridictions de votre pays de résidence. En tant que consommateur dans l’UE, vous avez également accès à la plateforme de règlement en ligne des litiges de la Commission européenne à l’adresse ' }, { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true }, { text: '.' }] }] },
    { heading: '8. Retours et remboursements', blocks: [{ type: 'p', parts: [{ text: 'Veuillez consulter notre ' }, { internal: '/returns', label: 'Politique de retours et remboursements' }, { text: ' pour des informations détaillées sur votre droit de rétractation et la procédure de retour ou de remboursement.' }] }] },
    { heading: '9. Contact', blocks: [{ type: 'p', parts: [{ text: 'Pour toute question relative aux présentes Conditions, veuillez nous contacter à ' }, { mailto: 'legal@terravoa.com' }, { text: ' ou par courrier à : {companyName}, {companyAddress}.' }] }] },
  ],
  it: [
    { heading: '1. Introduzione', blocks: [{ type: 'p', parts: [{ text: 'I presenti Termini e Condizioni (“Termini”) disciplinano l’accesso e l’utilizzo del sito web e della piattaforma marketplace {siteName} (“Piattaforma”), gestiti da {companyName}, società registrata in Francia. Accedendo alla Piattaforma o effettuando un ordine, confermi di aver letto, compreso e accettato integralmente i presenti Termini.' }] }, { type: 'p', parts: [{ text: 'Se non accetti questi Termini, non devi utilizzare la Piattaforma. Ci riserviamo il diritto di aggiornarli in qualsiasi momento; l’uso continuato della Piattaforma dopo una modifica costituisce accettazione dei Termini aggiornati.' }] }] },
    { heading: '2. Uso della Piattaforma', blocks: [{ type: 'p', parts: [{ text: 'Puoi utilizzare la Piattaforma solo per finalità lecite e in conformità ai presenti Termini. Ti impegni a non:' }] }, { type: 'ul', items: ['Utilizzare la Piattaforma in modo contrario alle leggi o regolamenti francesi o dell’UE applicabili.', 'Trasmettere materiale pubblicitario o promozionale non richiesto o non autorizzato.', 'Tentare di ottenere accesso non autorizzato a qualsiasi parte della Piattaforma o ai sistemi correlati.', 'Usare strumenti automatizzati per fare scraping, crawling o estrazione di dati dalla Piattaforma senza il nostro previo consenso scritto.', 'Impersonare persone o entità oppure dichiarare falsamente un’affiliazione.'] }, { type: 'p', parts: [{ text: 'Ci riserviamo il diritto di sospendere o chiudere il tuo account in qualsiasi momento qualora vi siano motivi per ritenere che tu abbia violato i presenti Termini.' }] }] },
    { heading: '3. Ordini e pagamenti', blocks: [{ type: 'p', parts: [{ text: 'Tutti i prezzi visualizzati sulla Piattaforma sono in euro (EUR) e includono l’IVA applicabile, salvo diversa indicazione. Inviando un ordine, presenti un’offerta vincolante di acquisto dei prodotti selezionati. Il contratto di vendita si perfeziona quando ricevi la conferma d’ordine via e-mail.' }] }, { type: 'p', parts: [{ text: 'Il pagamento viene elaborato in modo sicuro al momento dell’acquisto tramite Stripe. Accettiamo le principali carte di credito e debito, Apple Pay e Google Pay. I dati di pagamento non vengono mai memorizzati sui nostri server. Gli ordini sono spediti solo dopo autorizzazione positiva del pagamento.' }] }, { type: 'p', parts: [{ text: '{siteName} agisce come merchant of record per tutte le transazioni sulla Piattaforma. I produttori ricevono il pagamento dei propri beni tramite il nostro processo interno di regolamento dopo l’evasione dell’ordine.' }] }] },
    { heading: '4. Responsabilità dei produttori', blocks: [{ type: 'p', parts: [{ text: 'I produttori presenti sulla Piattaforma sono venditori indipendenti che hanno sottoscritto un accordo Produttore separato con {siteName}. Ogni produttore è responsabile di:' }] }, { type: 'ul', items: ['Accuratezza di tutte le informazioni sui prodotti, descrizioni, ingredienti e dichiarazioni sugli allergeni.', 'Conformità a tutte le normative applicabili in materia di sicurezza alimentare, etichettatura e igiene nella propria giurisdizione e nei mercati di destinazione.', 'Imballaggio, preparazione e spedizione degli ordini in modo tempestivo e professionale.', 'Mantenimento di un’adeguata assicurazione di responsabilità civile prodotto.'] }, { type: 'p', parts: [{ text: "{siteName} effettua controlli di due diligence sui produttori prima della pubblicazione, ma non agisce come produttore né come venditore diretto dei prodotti. In qualità di consumatore, i tuoi diritti legali ai sensi della normativa UE si applicano indipendentemente dal paese d'origine del produttore." }] }, { type: 'h3', text: 'Recensioni dei consumatori' }, { type: 'p', parts: [{ text: "Le valutazioni a stelle e le recensioni testuali mostrate sulla Piattaforma sono inviate da clienti che hanno acquistato tramite {siteName}. Riflettono l'esperienza con il prodotto e, ove pertinente, con l'evasione. {siteName} non redige, imposta o modifica le singole valutazioni come propria opinione. Possiamo moderare o rimuovere contenuti illeciti, abusivi, fraudolenti o spam, ma non alteriamo le stelle per ragioni commerciali né per favorire produttori o clienti." }] }, { type: 'h3', text: 'Inserzioni e performance dei produttori' }, { type: 'p', parts: [{ text: "In presenza di feedback clienti costantemente negativi, ripetuti problemi di spedizione o imballaggio, mancata risposta a richieste legittime degli acquirenti o gravi violazioni dell'accordo Produttore, {siteName} può, previo ragionevole preavviso ove richiesto contrattualmente, sospendere o rimuovere inserzioni. Tale facoltà è esercitata per tutelare clienti e integrità del marketplace. Nulla nei presenti Termini limita diritti inderogabili dei consumatori o solleva i produttori dai loro obblighi legali." }] }] },
    { heading: '5. Proprietà intellettuale', blocks: [{ type: 'p', parts: [{ text: 'Tutti i contenuti presenti sulla Piattaforma — inclusi testi, immagini, loghi, grafiche, video e software — sono proprietà di {companyName} o dei suoi licenzianti e sono protetti dal diritto francese e dell’UE in materia di proprietà intellettuale. Non puoi riprodurre, distribuire o creare opere derivate da contenuti della Piattaforma senza nostra espressa autorizzazione scritta.' }] }, { type: 'p', parts: [{ text: 'Le immagini e descrizioni dei prodotti fornite dai produttori restano proprietà intellettuale del rispettivo produttore. Caricando contenuti sulla Piattaforma, i produttori concedono a {siteName} una licenza non esclusiva e gratuita per l’uso di tali contenuti ai fini della gestione e promozione della Piattaforma.' }] }] },
    { heading: '6. Limitazione di responsabilità', blocks: [{ type: 'p', parts: [{ text: "Nella misura massima consentita dalla legge applicabile, {siteName} non sarà responsabile per danni indiretti, incidentali, speciali o consequenziali derivanti da o connessi all'uso della Piattaforma o all'acquisto di prodotti tramite essa, inclusi, a titolo esemplificativo, perdita di profitto, perdita di dati o interruzione dell'attività." }] }, { type: 'p', parts: [{ text: 'Nessuna disposizione dei presenti Termini limita o esclude la nostra responsabilità per morte o lesioni personali causate da nostra negligenza, frode o falsa dichiarazione fraudolenta, o per qualsiasi altra responsabilità che non possa essere esclusa ai sensi del diritto francese o dell’UE applicabile.' }] }, { type: 'p', parts: [{ text: 'I tuoi diritti legali di consumatore ai sensi della Direttiva UE 2011/83/UE e della normativa francese di recepimento non sono pregiudicati dai presenti Termini.' }] }] },
    { heading: '7. Legge applicabile', blocks: [{ type: 'p', parts: [{ text: 'I presenti Termini e qualsiasi controversia o pretesa derivante da o connessa agli stessi sono disciplinati e interpretati secondo la legge francese, fatto salvo qualsiasi regime inderogabile di tutela dei consumatori previsto dalla legge del tuo paese di residenza abituale nell’UE.' }] }, { type: 'p', parts: [{ text: 'Qualsiasi controversia che non possa essere risolta amichevolmente può essere sottoposta ai tribunali competenti di Parigi, Francia, salvo il tuo diritto, ai sensi del diritto UE, di adire i tribunali del tuo paese di residenza. Come consumatore nell’UE, hai inoltre accesso alla piattaforma ODR della Commissione europea all’indirizzo ' }, { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true }, { text: '.' }] }] },
    { heading: '8. Resi e rimborsi', blocks: [{ type: 'p', parts: [{ text: 'Consulta la nostra ' }, { internal: '/returns', label: 'Politica su Resi e Rimborsi' }, { text: ' per informazioni dettagliate sul diritto di recesso e su come richiedere un reso o un rimborso.' }] }] },
    { heading: '9. Contatti', blocks: [{ type: 'p', parts: [{ text: 'Per domande relative ai presenti Termini, contattaci a ' }, { mailto: 'legal@terravoa.com' }, { text: ' o per posta a: {companyName}, {companyAddress}.' }] }] },
  ],
  es: [
    { heading: '1. Introducción', blocks: [{ type: 'p', parts: [{ text: 'Estos Términos y Condiciones (“Términos”) regulan su acceso y uso del sitio web y la plataforma marketplace de {siteName} (la “Plataforma”), operada por {companyName}, una empresa registrada en Francia. Al acceder a la Plataforma o realizar un pedido, usted confirma que ha leído, comprendido y acepta quedar vinculado por estos Términos en su totalidad.' }] }, { type: 'p', parts: [{ text: 'Si no está de acuerdo con estos Términos, no debe utilizar la Plataforma. Nos reservamos el derecho de actualizarlos en cualquier momento; el uso continuado de la Plataforma tras cualquier cambio constituye su aceptación de los Términos revisados.' }] }] },
    { heading: '2. Uso de la Plataforma', blocks: [{ type: 'p', parts: [{ text: 'Puede utilizar la Plataforma únicamente para fines lícitos y conforme a estos Términos. Usted acepta no:' }] }, { type: 'ul', items: ['Usar la Plataforma de forma que infrinja la legislación o normativa francesa o de la UE aplicable.', 'Transmitir material publicitario o promocional no solicitado o no autorizado.', 'Intentar obtener acceso no autorizado a cualquier parte de la Plataforma o a sus sistemas relacionados.', 'Utilizar herramientas automatizadas para hacer scraping, rastreo o extracción de datos de la Plataforma sin nuestro consentimiento previo por escrito.', 'Suplantar a cualquier persona o entidad, o representar falsamente su afiliación.'] }, { type: 'p', parts: [{ text: 'Nos reservamos el derecho de suspender o cancelar su cuenta en cualquier momento si tenemos motivos para creer que ha incumplido estos Términos.' }] }] },
    { heading: '3. Pedidos y pagos', blocks: [{ type: 'p', parts: [{ text: 'Todos los precios mostrados en la Plataforma están en euros (EUR) e incluyen el IVA aplicable salvo indicación en contrario. Al enviar un pedido, usted realiza una oferta vinculante de compra de los productos seleccionados. El contrato de compraventa se perfecciona cuando recibe una confirmación de pedido por correo electrónico.' }] }, { type: 'p', parts: [{ text: 'El pago se procesa de forma segura en el momento de la compra a través de Stripe. Aceptamos las principales tarjetas de crédito y débito, Apple Pay y Google Pay. Sus datos de pago nunca se almacenan en nuestros servidores. Los pedidos se envían únicamente tras la autorización satisfactoria del pago.' }] }, { type: 'p', parts: [{ text: '{siteName} actúa como merchant of record en todas las transacciones de la Plataforma. Los productores reciben el pago de sus productos a través de nuestro proceso interno de liquidación tras la ejecución del pedido.' }] }] },
    { heading: '4. Responsabilidades de los productores', blocks: [{ type: 'p', parts: [{ text: 'Los productores listados en la Plataforma son vendedores independientes que han suscrito un Acuerdo de Productor independiente con {siteName}. Cada productor es responsable de:' }] }, { type: 'ul', items: ['La exactitud de toda la información del producto, descripciones, ingredientes y declaraciones de alérgenos.', 'El cumplimiento de toda la normativa aplicable de seguridad alimentaria, etiquetado e higiene en su jurisdicción y en los mercados de destino.', 'Empaquetar, preparar y enviar pedidos de forma puntual y profesional.', 'Mantener una cobertura adecuada de seguro de responsabilidad por producto.'] }, { type: 'p', parts: [{ text: '{siteName} realiza comprobaciones de diligencia debida sobre los productores antes de su publicación, pero no actúa como fabricante ni como vendedor directo de ningún producto. Como consumidor, sus derechos legales bajo la normativa de protección de consumidores de la UE se aplican con independencia del país de origen del productor.' }] }, { type: 'h3', text: 'Reseñas de consumidores' }, { type: 'p', parts: [{ text: 'Las valoraciones por estrellas y reseñas escritas mostradas en la Plataforma son enviadas por clientes que han comprado a través de {siteName}. Reflejan la experiencia de los compradores con el producto y, en su caso, con la ejecución del pedido. {siteName} no redacta, establece ni edita valoraciones individuales como opinión propia. Podemos moderar o retirar contenidos ilícitos, abusivos, fraudulentos o spam, pero no alteramos valoraciones por razones comerciales ni para favorecer a ningún productor o cliente.' }] }, { type: 'h3', text: 'Listados y desempeño de productores' }, { type: 'p', parts: [{ text: 'Cuando existan comentarios de clientes persistentemente negativos, fallos repetidos de envío o embalaje, falta de respuesta a consultas legítimas de compradores, o incumplimientos graves del Acuerdo de Productor, {siteName} podrá, tras aviso razonable cuando contractualmente se requiera, suspender o retirar listados. Esta facultad se ejerce para proteger a los clientes y la integridad del marketplace. Nada de estos Términos limita derechos imperativos de los consumidores ni exime a los productores de sus obligaciones legales.' }] }] },
    { heading: '5. Propiedad intelectual', blocks: [{ type: 'p', parts: [{ text: 'Todo el contenido de la Plataforma —incluidos textos, imágenes, logotipos, gráficos, vídeo y software— es propiedad de {companyName} o de sus licenciantes y está protegido por la normativa francesa y de la UE sobre propiedad intelectual. No podrá reproducir, distribuir ni crear obras derivadas del contenido de la Plataforma sin nuestro permiso expreso por escrito.' }] }, { type: 'p', parts: [{ text: 'Las imágenes y descripciones de productos proporcionadas por los productores siguen siendo propiedad intelectual del productor correspondiente. Al subir contenido a la Plataforma, los productores conceden a {siteName} una licencia no exclusiva y libre de regalías para utilizar dicho contenido con fines de operación y promoción de la Plataforma.' }] }] },
    { heading: '6. Limitación de responsabilidad', blocks: [{ type: 'p', parts: [{ text: 'En la máxima medida permitida por la legislación aplicable, {siteName} no será responsable de daños indirectos, incidentales, especiales o consecuenciales que surjan de, o en relación con, su uso de la Plataforma o la compra de productos a través de ella, incluyendo, entre otros, pérdida de beneficios, pérdida de datos o interrupción del negocio.' }] }, { type: 'p', parts: [{ text: 'Nada de estos Términos limita o excluye nuestra responsabilidad por muerte o lesiones personales causadas por nuestra negligencia, fraude o tergiversación fraudulenta, ni cualquier otra responsabilidad que no pueda excluirse conforme al derecho francés o de la UE aplicable.' }] }, { type: 'p', parts: [{ text: 'Sus derechos legales como consumidor conforme a la Directiva 2011/83/UE y la normativa francesa de transposición aplicable no se ven afectados por estos Términos.' }] }] },
    { heading: '7. Ley aplicable', blocks: [{ type: 'p', parts: [{ text: 'Estos Términos y cualquier disputa o reclamación derivada de, o relacionada con, ellos se regirán e interpretarán de conformidad con las leyes de Francia, sin perjuicio de las disposiciones imperativas de protección de los consumidores de la ley de su país de residencia habitual dentro de la UE.' }] }, { type: 'p', parts: [{ text: 'Toda disputa que no pueda resolverse amistosamente podrá someterse a los tribunales competentes de París, Francia, salvo que el derecho de la UE le otorgue el derecho a demandar ante los tribunales de su país de residencia. Como consumidor dentro de la UE, también tiene acceso a la plataforma de Resolución de Litigios en Línea de la Comisión Europea en ' }, { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true }, { text: '.' }] }] },
    { heading: '8. Devoluciones y reembolsos', blocks: [{ type: 'p', parts: [{ text: 'Consulte nuestra ' }, { internal: '/returns', label: 'Política de Devoluciones y Reembolsos' }, { text: ' para obtener información detallada sobre su derecho de desistimiento y sobre cómo solicitar una devolución o reembolso.' }] }] },
    { heading: '9. Contacto', blocks: [{ type: 'p', parts: [{ text: 'Para preguntas relativas a estos Términos, contáctenos en ' }, { mailto: 'legal@terravoa.com' }, { text: ' o por correo postal a: {companyName}, {companyAddress}.' }] }] },
  ],
  pt: [
    { heading: '1. Introdução', blocks: [{ type: 'p', parts: [{ text: 'Os presentes Termos e Condições (“Termos”) regulam o seu acesso e utilização do website e da plataforma marketplace {siteName} (a “Plataforma”), operada por {companyName}, sociedade registada em França. Ao aceder à Plataforma ou ao efetuar uma encomenda, confirma que leu, compreendeu e concorda em ficar vinculado a estes Termos na íntegra.' }] }, { type: 'p', parts: [{ text: 'Se não concordar com estes Termos, não deverá utilizar a Plataforma. Reservamo-nos o direito de atualizar estes Termos a qualquer momento; a utilização continuada da Plataforma após qualquer alteração constitui a sua aceitação dos Termos revistos.' }] }] },
    { heading: '2. Utilização da Plataforma', blocks: [{ type: 'p', parts: [{ text: 'Pode utilizar a Plataforma apenas para fins lícitos e de acordo com estes Termos. Concorda em não:' }] }, { type: 'ul', items: ['Utilizar a Plataforma de forma que viole a legislação ou regulamentação francesa ou da UE aplicável.', 'Transmitir qualquer material publicitário ou promocional não solicitado ou não autorizado.', 'Tentar obter acesso não autorizado a qualquer parte da Plataforma ou aos sistemas relacionados.', 'Utilizar ferramentas automatizadas para scraping, crawling ou extração de dados da Plataforma sem o nosso consentimento prévio por escrito.', 'Fazer-se passar por qualquer pessoa ou entidade, ou representar falsamente a sua afiliação.'] }, { type: 'p', parts: [{ text: 'Reservamo-nos o direito de suspender ou terminar a sua conta a qualquer momento se tivermos motivos para acreditar que violou estes Termos.' }] }] },
    { heading: '3. Encomendas e pagamentos', blocks: [{ type: 'p', parts: [{ text: 'Todos os preços apresentados na Plataforma estão em euros (EUR) e incluem IVA aplicável, salvo indicação em contrário. Ao submeter uma encomenda, faz uma oferta vinculativa para comprar os produtos selecionados. O contrato de compra e venda é celebrado quando recebe a confirmação da encomenda por e-mail.' }] }, { type: 'p', parts: [{ text: 'O pagamento é processado de forma segura no momento da compra através da Stripe. Aceitamos os principais cartões de crédito e débito, Apple Pay e Google Pay. Os seus dados de pagamento nunca são armazenados nos nossos servidores. As encomendas só são expedidas após autorização de pagamento bem-sucedida.' }] }, { type: 'p', parts: [{ text: '{siteName} atua como merchant of record para todas as transações na Plataforma. Os produtores recebem pagamento pelos seus bens através do nosso processo interno de liquidação após o cumprimento da encomenda.' }] }] },
    { heading: '4. Responsabilidades dos produtores', blocks: [{ type: 'p', parts: [{ text: 'Os produtores listados na Plataforma são vendedores independentes que celebraram um Acordo de Produtor separado com {siteName}. Cada produtor é responsável por:' }] }, { type: 'ul', items: ['A exatidão de todas as informações do produto, descrições, ingredientes e declarações de alergénios.', 'O cumprimento de todos os regulamentos aplicáveis de segurança alimentar, rotulagem e higiene na sua jurisdição e mercados de destino.', 'Embalar, preparar e expedir encomendas de forma atempada e profissional.', 'Manter seguro adequado de responsabilidade do produto.'] }, { type: 'p', parts: [{ text: '{siteName} realiza verificações de due diligence dos produtores antes da listagem, mas não atua como fabricante nem como vendedor direto de qualquer produto. Enquanto consumidor, os seus direitos legais ao abrigo da legislação de proteção do consumidor da UE aplicam-se independentemente do país de origem do produtor.' }] }, { type: 'h3', text: 'Avaliações de consumidores' }, { type: 'p', parts: [{ text: 'As classificações por estrelas e avaliações escritas apresentadas na Plataforma são submetidas por clientes que compraram através da {siteName}. Refletem as experiências dos compradores com o produto e, quando relevante, com o cumprimento da encomenda. A {siteName} não redige, define ou edita classificações individuais como opinião própria. Podemos moderar ou remover conteúdo ilícito, abusivo, fraudulento ou spam, mas não alteramos classificações por motivos comerciais nem para favorecer qualquer produtor ou cliente.' }] }, { type: 'h3', text: 'Listagens e desempenho de produtores' }, { type: 'p', parts: [{ text: 'A {siteName} pode suspender ou remover listagens em caso de feedback de clientes consistentemente negativo, falhas repetidas de envio ou embalagem, falta de resposta a pedidos legítimos de compradores, ou violações graves do Acordo de Produtor, após aviso razoável quando exigido contratualmente. Esta discricionariedade é exercida para proteger clientes e a integridade do marketplace. Nada nestes Termos limita direitos imperativos dos consumidores nem dispensa os produtores das suas obrigações legais.' }] }] },
    { heading: '5. Propriedade intelectual', blocks: [{ type: 'p', parts: [{ text: 'Todo o conteúdo da Plataforma — incluindo texto, imagens, logótipos, gráficos, vídeo e software — é propriedade de {companyName} ou dos seus licenciadores e está protegido pela legislação francesa e da UE em matéria de propriedade intelectual. Não pode reproduzir, distribuir ou criar obras derivadas de qualquer conteúdo da Plataforma sem a nossa autorização expressa por escrito.' }] }, { type: 'p', parts: [{ text: 'As imagens e descrições de produtos fornecidas pelos produtores permanecem propriedade intelectual do respetivo produtor. Ao carregar conteúdo na Plataforma, os produtores concedem à {siteName} uma licença não exclusiva e isenta de royalties para utilizar esse conteúdo para efeitos de operação e promoção da Plataforma.' }] }] },
    { heading: '6. Limitação de responsabilidade', blocks: [{ type: 'p', parts: [{ text: 'Na máxima extensão permitida pela legislação aplicável, a {siteName} não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais decorrentes de, ou relacionados com, a sua utilização da Plataforma ou compra de produtos através da mesma, incluindo, sem limitação, perda de lucros, perda de dados ou interrupção de atividade.' }] }, { type: 'p', parts: [{ text: 'Nada nestes Termos limita ou exclui a nossa responsabilidade por morte ou danos pessoais causados por negligência nossa, fraude ou falsa declaração fraudulenta, ou qualquer outra responsabilidade que não possa ser excluída ao abrigo da legislação francesa ou da UE aplicável.' }] }, { type: 'p', parts: [{ text: 'Os seus direitos legais de consumidor ao abrigo da Diretiva 2011/83/UE e da legislação francesa de transposição aplicável não são afetados por estes Termos.' }] }] },
    { heading: '7. Lei aplicável', blocks: [{ type: 'p', parts: [{ text: 'Estes Termos e qualquer litígio ou reclamação decorrente de, ou relacionada com, os mesmos serão regidos e interpretados de acordo com as leis de França, sem prejuízo de quaisquer disposições imperativas de proteção dos consumidores da lei do seu país de residência habitual na UE.' }] }, { type: 'p', parts: [{ text: 'Qualquer litígio que não possa ser resolvido amigavelmente pode ser submetido aos tribunais competentes de Paris, França, salvo se tiver direito, ao abrigo do direito da UE, de intentar ação nos tribunais do seu país de residência. Enquanto consumidor na UE, também tem acesso à plataforma de Resolução de Litígios em Linha da Comissão Europeia em ' }, { href: 'https://ec.europa.eu/consumers/odr', label: 'ec.europa.eu/consumers/odr', external: true }, { text: '.' }] }] },
    { heading: '8. Devoluções e reembolsos', blocks: [{ type: 'p', parts: [{ text: 'Consulte a nossa ' }, { internal: '/returns', label: 'Política de Devoluções e Reembolsos' }, { text: ' para informações detalhadas sobre o seu direito de livre resolução e como solicitar uma devolução ou reembolso.' }] }] },
    { heading: '9. Contacto', blocks: [{ type: 'p', parts: [{ text: 'Para questões relativas a estes Termos, contacte-nos através de ' }, { mailto: 'legal@terravoa.com' }, { text: ' ou por correio para: {companyName}, {companyAddress}.' }] }] },
  ],
}
