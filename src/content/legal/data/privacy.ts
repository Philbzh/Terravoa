import type { LegalLocale, LegalSection } from '@/lib/legal/types'

export const privacySections: Record<LegalLocale, LegalSection[]> = {
  en: [
    {
      heading: '1. Data Controller',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: '{companyName} (“{siteName}”, “we”, “us”) is the data controller for personal data collected through this website and marketplace platform, in accordance with Regulation (EU) 2016/679 (the General Data Protection Regulation, “GDPR”) and applicable French data protection law (Loi Informatique et Libertés).',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: 'Our registered address is: {companyName}, {companyAddress}. For all data protection enquiries, please contact our Data Protection Officer at ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: '2. Data We Collect',
      blocks: [
        { type: 'p', parts: [{ text: 'We collect the following categories of personal data:' }] },
        {
          type: 'ul',
          items: [
            { strong: 'Identity data:', text: 'first name, last name, username or similar identifier.' },
            { strong: 'Contact data:', text: 'billing address, delivery address, email address, and telephone number.' },
            { strong: 'Transaction data:', text: 'details about payments and orders you have placed through the Platform.' },
            { strong: 'Technical data:', text: 'internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system, and other technology on the devices you use to access the Platform.' },
            { strong: 'Usage data:', text: 'information about how you use our website and services, including pages visited, time spent on pages, and navigation paths.' },
            { strong: 'Marketing preferences:', text: 'your preferences regarding receiving marketing communications from us.' },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'We do not collect any Special Category data (such as data revealing racial or ethnic origin, political opinions, health data, or biometric data) and we do not collect data relating to criminal convictions or offences.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. How We Use Your Data',
      blocks: [
        { type: 'p', parts: [{ text: 'We use your personal data for the following purposes:' }] },
        {
          type: 'ul',
          items: [
            'To create and manage your account on the Platform.',
            'To process and fulfil your orders, including payment processing and delivery coordination.',
            'To send you order confirmations, shipping updates, and other transactional communications.',
            'To respond to enquiries, complaints, and support requests.',
            'To send you marketing communications about products, offers, and events — only where you have given your consent or we have a legitimate interest to do so.',
            'To improve and personalise your experience on the Platform.',
            'To comply with our legal and regulatory obligations, including fraud prevention and financial record-keeping.',
          ],
        },
        { type: 'p', parts: [{ text: 'We never sell your personal data to third parties.' }] },
      ],
    },
    {
      heading: '4. Legal Basis for Processing (GDPR)',
      blocks: [
        { type: 'p', parts: [{ text: 'We process your personal data on the following legal bases:' }] },
        {
          type: 'ul',
          items: [
            { strong: 'Performance of a contract (Art. 6(1)(b) GDPR):', text: 'Processing necessary to fulfil your orders and manage your account.' },
            { strong: 'Legal obligation (Art. 6(1)(c) GDPR):', text: 'Processing required by applicable law, such as retaining financial records for accounting purposes.' },
            { strong: 'Legitimate interests (Art. 6(1)(f) GDPR):', text: 'Processing for fraud prevention, network security, and improving our services, where these interests are not overridden by your rights and interests.' },
            { strong: 'Consent (Art. 6(1)(a) GDPR):', text: 'Processing for marketing communications and optional analytics cookies, where you have given your explicit consent. You may withdraw your consent at any time.' },
          ],
        },
      ],
    },
    {
      heading: '5. Data Retention',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'We retain your personal data only for as long as is necessary for the purposes for which it was collected, or as required by applicable law. Specifically:' },
          ],
        },
        {
          type: 'ul',
          items: [
            'Account data is retained for the duration of your account plus 3 years following closure.',
            'Order and financial records are retained for 10 years in accordance with French accounting law.',
            'Marketing consent records are retained for 3 years from the date of consent or your last interaction with us.',
            'Technical and usage data derived from analytics is retained in anonymised form indefinitely.',
          ],
        },
      ],
    },
    {
      heading: '6. Your Rights (GDPR Art. 15–22)',
      blocks: [
        { type: 'p', parts: [{ text: 'Under the GDPR, you have the following rights regarding your personal data:' }] },
        {
          type: 'ul',
          items: [
            { strong: 'Right of access (Art. 15):', text: 'You may request a copy of the personal data we hold about you.' },
            { strong: 'Right to rectification (Art. 16):', text: 'You may ask us to correct any inaccurate or incomplete data.' },
            { strong: 'Right to erasure (Art. 17):', text: 'You may request deletion of your personal data where there is no compelling reason for its continued processing.' },
            { strong: 'Right to restriction of processing (Art. 18):', text: 'You may request that we restrict processing of your data in certain circumstances.' },
            { strong: 'Right to data portability (Art. 20):', text: 'You may request to receive your data in a structured, machine-readable format.' },
            { strong: 'Right to object (Art. 21):', text: 'You may object to processing based on legitimate interests or for direct marketing purposes.' },
            { strong: 'Right to withdraw consent (Art. 7(3)):', text: 'Where processing is based on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.' },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: 'To exercise any of these rights, please contact us at ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '. We will respond within 30 days. You also have the right to lodge a complaint with the French data protection authority (CNIL) at ' },
            { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: '7. Cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'We use cookies and similar tracking technologies on our Platform. For detailed information about the cookies we use and how to control them, please see our ' },
            { internal: '/cookies', label: 'Cookie Policy' },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: '8. Third-Party Services',
      blocks: [
        { type: 'p', parts: [{ text: 'We work with carefully selected third-party service providers who process data on our behalf:' }] },
        {
          type: 'ul',
          items: [
            { strong: 'Supabase:', text: 'Our database and authentication provider. Supabase processes authentication data and stores user account information. Data is hosted in the EU. See ' },
            { strong: 'Stripe:', text: 'Our payment processing provider. Stripe handles all payment card data and is certified to PCI DSS Level 1. We do not store payment card details on our servers. See ' },
            { strong: 'Sanity:', text: 'Our content management system. Sanity stores product and editorial content. It does not process end-user personal data. See ' },
          ],
        },
        {
          type: 'p',
          parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }],
        },
        {
          type: 'p',
          parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }],
        },
        {
          type: 'p',
          parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }],
        },
        {
          type: 'p',
          parts: [{ text: 'We require all third-party processors to respect the security of your data and to process it only in accordance with our instructions and applicable data protection law.' }],
        },
      ],
    },
    {
      heading: '9. International Transfers',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Where personal data is transferred outside the European Economic Area (EEA), we ensure that appropriate safeguards are in place, such as Standard Contractual Clauses approved by the European Commission, or that the recipient country benefits from an adequacy decision.',
            },
          ],
        },
      ],
    },
    {
      heading: '10. Contact the DPO',
      blocks: [
        { type: 'p', parts: [{ text: 'For any questions or concerns regarding this Privacy Policy or the processing of your personal data, please contact our Data Protection Officer:' }] },
        {
          type: 'p',
          parts: [
            { text: 'Email: ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '. Post: Data Protection Officer, {companyName}, {companyAddress}.' },
          ],
        },
      ],
    },
  ],
  de: [
    { heading: '1. Verantwortlicher', blocks: [{ type: 'p', parts: [{ text: '{companyName} („{siteName}“, „wir“, „uns“) ist Verantwortlicher für die über diese Website und Marktplattform erhobenen personenbezogenen Daten gemäß Verordnung (EU) 2016/679 (Datenschutz-Grundverordnung, „DSGVO“) sowie dem anwendbaren französischen Datenschutzrecht (Loi Informatique et Libertés).' }] }, { type: 'p', parts: [{ text: 'Unsere eingetragene Adresse lautet: {companyName}, {companyAddress}. Für alle Datenschutzanfragen kontaktieren Sie bitte unseren Datenschutzbeauftragten unter ' }, { mailto: 'privacy@terravoa.com' }, { text: '.' }] }] },
    { heading: '2. Welche Daten wir erheben', blocks: [{ type: 'p', parts: [{ text: 'Wir erheben folgende Kategorien personenbezogener Daten:' }] }, { type: 'ul', items: [{ strong: 'Identitätsdaten:', text: 'Vorname, Nachname, Benutzername oder vergleichbare Kennung.' }, { strong: 'Kontaktdaten:', text: 'Rechnungsadresse, Lieferadresse, E-Mail-Adresse und Telefonnummer.' }, { strong: 'Transaktionsdaten:', text: 'Angaben zu Zahlungen und Bestellungen über die Plattform.' }, { strong: 'Technische Daten:', text: 'IP-Adresse, Browsertyp und -version, Zeitzoneneinstellung, Browser-Plugin-Typen und -Versionen, Betriebssystem und sonstige Gerätetechnologien.' }, { strong: 'Nutzungsdaten:', text: 'Informationen über die Nutzung unserer Website und Dienste, einschließlich besuchter Seiten, Verweildauer und Navigationspfade.' }, { strong: 'Marketingpräferenzen:', text: 'Ihre Präferenzen hinsichtlich des Erhalts von Marketingkommunikation.' }] }, { type: 'p', parts: [{ text: 'Wir erheben keine besonderen Kategorien personenbezogener Daten (z. B. Daten zur rassischen oder ethnischen Herkunft, politischen Meinungen, Gesundheits- oder biometrischen Daten) und keine Daten über strafrechtliche Verurteilungen oder Straftaten.' }] }] },
    { heading: '3. Wie wir Ihre Daten verwenden', blocks: [{ type: 'p', parts: [{ text: 'Wir verwenden Ihre personenbezogenen Daten für folgende Zwecke:' }] }, { type: 'ul', items: ['Erstellung und Verwaltung Ihres Kontos auf der Plattform.', 'Bearbeitung und Erfüllung Ihrer Bestellungen einschließlich Zahlungsabwicklung und Lieferkoordination.', 'Versand von Bestellbestätigungen, Versandupdates und sonstiger transaktionsbezogener Kommunikation.', 'Beantwortung von Anfragen, Beschwerden und Supportanliegen.', 'Versand von Marketingkommunikation zu Produkten, Angeboten und Veranstaltungen — nur mit Ihrer Einwilligung oder bei berechtigtem Interesse.', 'Verbesserung und Personalisierung Ihrer Erfahrung auf der Plattform.', 'Erfüllung rechtlicher und regulatorischer Pflichten, einschließlich Betrugsprävention und Finanzdokumentation.'] }, { type: 'p', parts: [{ text: 'Wir verkaufen Ihre personenbezogenen Daten niemals an Dritte.' }] }] },
    { heading: '4. Rechtsgrundlagen der Verarbeitung (DSGVO)', blocks: [{ type: 'p', parts: [{ text: 'Wir verarbeiten Ihre personenbezogenen Daten auf folgenden Rechtsgrundlagen:' }] }, { type: 'ul', items: [{ strong: 'Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):', text: 'Verarbeitung zur Erfüllung Ihrer Bestellungen und Verwaltung Ihres Kontos.' }, { strong: 'Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO):', text: 'Verarbeitung, die gesetzlich vorgeschrieben ist, z. B. Aufbewahrung von Finanzunterlagen.' }, { strong: 'Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO):', text: 'Verarbeitung zur Betrugsprävention, Netzwerksicherheit und Verbesserung unserer Dienstleistungen, sofern Ihre Rechte nicht überwiegen.' }, { strong: 'Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):', text: 'Verarbeitung für Marketingkommunikation und optionale Analyse-Cookies mit Ihrer ausdrücklichen Einwilligung. Diese kann jederzeit widerrufen werden.' }] }] },
    { heading: '5. Speicherdauer', blocks: [{ type: 'p', parts: [{ text: 'Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Zwecke der Erhebung erforderlich ist oder gesetzlich vorgeschrieben wird. Insbesondere:' }] }, { type: 'ul', items: ['Kontodaten werden für die Dauer des Kontos plus 3 Jahre nach Schließung aufbewahrt.', 'Bestell- und Finanzunterlagen werden gemäß französischem Rechnungsrecht 10 Jahre aufbewahrt.', 'Nachweise zur Marketingeinwilligung werden 3 Jahre ab Einwilligung oder letzter Interaktion gespeichert.', 'Technische und Nutzungsdaten aus Analysen werden anonymisiert auf unbestimmte Zeit gespeichert.'] }] },
    { heading: '6. Ihre Rechte (DSGVO Art. 15-22)', blocks: [{ type: 'p', parts: [{ text: 'Nach der DSGVO haben Sie folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:' }] }, { type: 'ul', items: [{ strong: 'Auskunftsrecht (Art. 15):', text: 'Sie können eine Kopie der über Sie gespeicherten personenbezogenen Daten verlangen.' }, { strong: 'Recht auf Berichtigung (Art. 16):', text: 'Sie können die Berichtigung unrichtiger oder unvollständiger Daten verlangen.' }, { strong: 'Recht auf Löschung (Art. 17):', text: 'Sie können die Löschung verlangen, wenn keine zwingenden Gründe für die weitere Verarbeitung bestehen.' }, { strong: 'Recht auf Einschränkung (Art. 18):', text: 'Sie können unter bestimmten Umständen die Einschränkung der Verarbeitung verlangen.' }, { strong: 'Recht auf Datenübertragbarkeit (Art. 20):', text: 'Sie können die Bereitstellung Ihrer Daten in einem strukturierten, maschinenlesbaren Format verlangen.' }, { strong: 'Widerspruchsrecht (Art. 21):', text: 'Sie können der Verarbeitung auf Grundlage berechtigter Interessen oder zu Direktmarketingzwecken widersprechen.' }, { strong: 'Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3):', text: 'Bei einwilligungsbasierter Verarbeitung können Sie Ihre Einwilligung jederzeit widerrufen, ohne dass die Rechtmäßigkeit der bisherigen Verarbeitung berührt wird.' }] }, { type: 'p', parts: [{ text: 'Zur Ausübung dieser Rechte kontaktieren Sie uns unter ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Wir antworten innerhalb von 30 Tagen. Sie haben zudem das Recht, sich bei der französischen Datenschutzbehörde (CNIL) unter ' }, { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true }, { text: ' zu beschweren.' }] }] },
    { heading: '7. Cookies', blocks: [{ type: 'p', parts: [{ text: 'Wir verwenden Cookies und ähnliche Tracking-Technologien auf unserer Plattform. Ausführliche Informationen zu den eingesetzten Cookies und zu Kontrollmöglichkeiten finden Sie in unserer ' }, { internal: '/cookies', label: 'Cookie-Richtlinie' }, { text: '.' }] }] },
    { heading: '8. Dienste Dritter', blocks: [{ type: 'p', parts: [{ text: 'Wir arbeiten mit sorgfältig ausgewählten Drittanbietern zusammen, die Daten in unserem Auftrag verarbeiten:' }] }, { type: 'ul', items: [{ strong: 'Supabase:', text: 'Unser Datenbank- und Authentifizierungsanbieter. Supabase verarbeitet Authentifizierungsdaten und speichert Kontoinformationen. Die Daten werden in der EU gehostet. Siehe ' }, { strong: 'Stripe:', text: 'Unser Zahlungsdienstleister. Stripe verarbeitet alle Kartenzahlungsdaten und ist PCI DSS Level 1 zertifiziert. Wir speichern keine Kartendaten auf unseren Servern. Siehe ' }, { strong: 'Sanity:', text: 'Unser Content-Management-System. Sanity speichert Produkt- und redaktionelle Inhalte und verarbeitet keine personenbezogenen Endkundendaten. Siehe ' }] }, { type: 'p', parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }] }, { type: 'p', parts: [{ text: 'Wir verpflichten alle Auftragsverarbeiter, die Sicherheit Ihrer Daten zu respektieren und diese nur gemäß unseren Weisungen und dem anwendbaren Datenschutzrecht zu verarbeiten.' }] }] },
    { heading: '9. Internationale Übermittlungen', blocks: [{ type: 'p', parts: [{ text: 'Wenn personenbezogene Daten außerhalb des Europäischen Wirtschaftsraums (EWR) übermittelt werden, stellen wir angemessene Garantien sicher, etwa von der Europäischen Kommission genehmigte Standardvertragsklauseln oder einen Angemessenheitsbeschluss für das Empfängerland.' }] }] },
    { heading: '10. Kontakt zum Datenschutzbeauftragten', blocks: [{ type: 'p', parts: [{ text: 'Bei Fragen oder Bedenken zu dieser Datenschutzerklärung oder zur Verarbeitung Ihrer personenbezogenen Daten kontaktieren Sie bitte unseren Datenschutzbeauftragten:' }] }, { type: 'p', parts: [{ text: 'E-Mail: ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Post: Datenschutzbeauftragter, {companyName}, {companyAddress}.' }] }] },
  ],
  fr: [
    { heading: '1. Responsable du traitement', blocks: [{ type: 'p', parts: [{ text: '{companyName} (« {siteName} », « nous », « notre ») est le responsable du traitement des données personnelles collectées via ce site web et cette plateforme de marché, conformément au Règlement (UE) 2016/679 (Règlement général sur la protection des données, « RGPD ») et à la législation française applicable (Loi Informatique et Libertés).' }] }, { type: 'p', parts: [{ text: 'Notre adresse enregistrée est : {companyName}, {companyAddress}. Pour toute demande relative à la protection des données, veuillez contacter notre DPO à ' }, { mailto: 'privacy@terravoa.com' }, { text: '.' }] }] },
    { heading: '2. Données que nous collectons', blocks: [{ type: 'p', parts: [{ text: 'Nous collectons les catégories de données personnelles suivantes :' }] }, { type: 'ul', items: [{ strong: 'Données d’identité :', text: 'prénom, nom, nom d’utilisateur ou identifiant similaire.' }, { strong: 'Données de contact :', text: 'adresse de facturation, adresse de livraison, adresse e-mail et numéro de téléphone.' }, { strong: 'Données de transaction :', text: 'informations relatives aux paiements et commandes effectués via la Plateforme.' }, { strong: 'Données techniques :', text: 'adresse IP, type et version du navigateur, fuseau horaire, types et versions de modules complémentaires, système d’exploitation et autres technologies des appareils utilisés.' }, { strong: 'Données d’utilisation :', text: 'informations sur votre utilisation du site et des services, y compris pages consultées, temps passé et parcours de navigation.' }, { strong: 'Préférences marketing :', text: 'vos préférences concernant la réception de communications marketing.' }] }, { type: 'p', parts: [{ text: 'Nous ne collectons pas de données sensibles (origine raciale ou ethnique, opinions politiques, données de santé ou biométriques) ni de données relatives aux condamnations pénales ou infractions.' }] }] },
    { heading: '3. Comment nous utilisons vos données', blocks: [{ type: 'p', parts: [{ text: 'Nous utilisons vos données personnelles pour les finalités suivantes :' }] }, { type: 'ul', items: ['Créer et gérer votre compte sur la Plateforme.', 'Traiter et exécuter vos commandes, y compris le paiement et la coordination de livraison.', 'Vous envoyer confirmations de commande, mises à jour d’expédition et autres communications transactionnelles.', 'Répondre aux demandes, réclamations et sollicitations de support.', 'Vous adresser des communications marketing sur des produits, offres et événements — uniquement avec votre consentement ou en cas d’intérêt légitime.', 'Améliorer et personnaliser votre expérience sur la Plateforme.', 'Respecter nos obligations légales et réglementaires, notamment prévention de la fraude et tenue des registres financiers.'] }, { type: 'p', parts: [{ text: 'Nous ne vendons jamais vos données personnelles à des tiers.' }] }] },
    { heading: '4. Base légale du traitement (RGPD)', blocks: [{ type: 'p', parts: [{ text: 'Nous traitons vos données personnelles sur les bases légales suivantes :' }] }, { type: 'ul', items: [{ strong: 'Exécution d’un contrat (art. 6(1)(b) RGPD) :', text: 'traitement nécessaire pour exécuter vos commandes et gérer votre compte.' }, { strong: 'Obligation légale (art. 6(1)(c) RGPD) :', text: 'traitement requis par la loi applicable, notamment conservation des documents comptables.' }, { strong: 'Intérêts légitimes (art. 6(1)(f) RGPD) :', text: 'prévention de la fraude, sécurité réseau et amélioration de nos services, lorsque ces intérêts ne prévalent pas sur vos droits.' }, { strong: 'Consentement (art. 6(1)(a) RGPD) :', text: 'communications marketing et cookies analytiques optionnels lorsque vous avez donné un consentement explicite. Vous pouvez le retirer à tout moment.' }] }] },
    { heading: '5. Durée de conservation', blocks: [{ type: 'p', parts: [{ text: 'Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités poursuivies ou imposée par la loi. Plus précisément :' }] }, { type: 'ul', items: ['Les données de compte sont conservées pendant la durée du compte puis 3 ans après sa clôture.', 'Les documents de commande et financiers sont conservés 10 ans conformément au droit comptable français.', 'Les preuves de consentement marketing sont conservées 3 ans à compter du consentement ou de votre dernière interaction.', 'Les données techniques et d’usage issues de l’analytique sont conservées sous forme anonymisée sans limite de durée.'] }] },
    { heading: '6. Vos droits (RGPD art. 15 a 22)', blocks: [{ type: 'p', parts: [{ text: 'Au titre du RGPD, vous disposez des droits suivants concernant vos données personnelles :' }] }, { type: 'ul', items: [{ strong: 'Droit d’accès (art. 15) :', text: 'obtenir une copie des données personnelles que nous détenons sur vous.' }, { strong: 'Droit de rectification (art. 16) :', text: 'faire corriger des données inexactes ou incomplètes.' }, { strong: 'Droit à l’effacement (art. 17) :', text: 'demander la suppression de vos données en l’absence de motif impérieux de poursuite du traitement.' }, { strong: 'Droit à la limitation du traitement (art. 18) :', text: 'demander la limitation du traitement dans certaines circonstances.' }, { strong: 'Droit à la portabilité (art. 20) :', text: 'recevoir vos données dans un format structuré et lisible par machine.' }, { strong: 'Droit d’opposition (art. 21) :', text: 'vous opposer aux traitements fondés sur l’intérêt légitime ou à des fins de prospection.' }, { strong: 'Droit de retirer votre consentement (art. 7(3)) :', text: 'retirer votre consentement à tout moment sans affecter la licéité des traitements antérieurs.' }] }, { type: 'p', parts: [{ text: 'Pour exercer ces droits, contactez-nous à ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Nous répondrons sous 30 jours. Vous pouvez également introduire une réclamation auprès de la CNIL sur ' }, { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true }, { text: '.' }] }] },
    { heading: '7. Cookies', blocks: [{ type: 'p', parts: [{ text: 'Nous utilisons des cookies et technologies similaires sur la Plateforme. Pour des informations détaillées sur les cookies utilisés et leur gestion, veuillez consulter notre ' }, { internal: '/cookies', label: 'Politique de cookies' }, { text: '.' }] }] },
    { heading: '8. Services tiers', blocks: [{ type: 'p', parts: [{ text: 'Nous travaillons avec des prestataires tiers soigneusement sélectionnés qui traitent des données pour notre compte :' }] }, { type: 'ul', items: [{ strong: 'Supabase :', text: 'fournisseur de base de données et d’authentification. Supabase traite les données d’authentification et stocke les informations de compte. Données hébergées dans l’UE. Voir ' }, { strong: 'Stripe :', text: 'prestataire de paiement. Stripe traite toutes les données de carte et est certifié PCI DSS niveau 1. Nous ne stockons pas les données de carte sur nos serveurs. Voir ' }, { strong: 'Sanity :', text: 'système de gestion de contenu. Sanity stocke les contenus produit et éditoriaux et ne traite pas les données personnelles des utilisateurs finaux. Voir ' }] }, { type: 'p', parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }] }, { type: 'p', parts: [{ text: 'Nous exigeons de tous les sous-traitants qu’ils respectent la sécurité de vos données et ne les traitent qu’en conformité avec nos instructions et la réglementation applicable.' }] }] },
    { heading: '9. Transferts internationaux', blocks: [{ type: 'p', parts: [{ text: 'Lorsque des données personnelles sont transférées hors de l’Espace économique européen (EEE), nous veillons à la mise en place de garanties appropriées, telles que des clauses contractuelles types approuvées par la Commission européenne, ou à l’existence d’une décision d’adéquation pour le pays destinataire.' }] }] },
    { heading: '10. Contacter le DPO', blocks: [{ type: 'p', parts: [{ text: 'Pour toute question ou préoccupation relative à la présente Politique de confidentialité ou au traitement de vos données personnelles, veuillez contacter notre DPO :' }] }, { type: 'p', parts: [{ text: 'E-mail : ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Courrier : Data Protection Officer, {companyName}, {companyAddress}.' }] }] },
  ],
  it: [
    { heading: '1. Titolare del trattamento', blocks: [{ type: 'p', parts: [{ text: '{companyName} (“{siteName}”, “noi”) è il titolare del trattamento dei dati personali raccolti tramite questo sito web e piattaforma marketplace, in conformità al Regolamento (UE) 2016/679 (Regolamento generale sulla protezione dei dati, “GDPR”) e alla normativa francese applicabile in materia di protezione dei dati (Loi Informatique et Libertés).' }] }, { type: 'p', parts: [{ text: 'Il nostro indirizzo registrato è: {companyName}, {companyAddress}. Per qualsiasi richiesta in materia di protezione dei dati, contatta il nostro DPO a ' }, { mailto: 'privacy@terravoa.com' }, { text: '.' }] }] },
    { heading: '2. Dati che raccogliamo', blocks: [{ type: 'p', parts: [{ text: 'Raccogliamo le seguenti categorie di dati personali:' }] }, { type: 'ul', items: [{ strong: 'Dati identificativi:', text: 'nome, cognome, username o identificativo analogo.' }, { strong: 'Dati di contatto:', text: 'indirizzo di fatturazione, indirizzo di consegna, e-mail e numero di telefono.' }, { strong: 'Dati di transazione:', text: 'dettagli su pagamenti e ordini effettuati tramite la Piattaforma.' }, { strong: 'Dati tecnici:', text: 'indirizzo IP, tipo e versione del browser, fuso orario, tipi e versioni di plug-in, sistema operativo e altre tecnologie dei dispositivi utilizzati.' }, { strong: 'Dati di utilizzo:', text: 'informazioni su come utilizzi il sito e i servizi, incluse pagine visitate, tempo trascorso e percorsi di navigazione.' }, { strong: 'Preferenze marketing:', text: 'preferenze relative alla ricezione di comunicazioni marketing.' }] }, { type: 'p', parts: [{ text: 'Non raccogliamo categorie particolari di dati (ad esempio dati su origine razziale o etnica, opinioni politiche, dati sanitari o biometrici) né dati relativi a condanne penali o reati.' }] }] },
    { heading: '3. Come utilizziamo i tuoi dati', blocks: [{ type: 'p', parts: [{ text: 'Utilizziamo i tuoi dati personali per le seguenti finalità:' }] }, { type: 'ul', items: ['Creare e gestire il tuo account sulla Piattaforma.', 'Elaborare ed evadere i tuoi ordini, inclusi pagamento e coordinamento della consegna.', 'Inviarti conferme d’ordine, aggiornamenti di spedizione e altre comunicazioni transazionali.', 'Rispondere a richieste, reclami e assistenza.', 'Inviarti comunicazioni marketing su prodotti, offerte ed eventi — solo con consenso o legittimo interesse.', 'Migliorare e personalizzare la tua esperienza sulla Piattaforma.', 'Adempiere ai nostri obblighi legali e regolamentari, inclusi prevenzione frodi e conservazione dei registri finanziari.'] }, { type: 'p', parts: [{ text: 'Non vendiamo mai i tuoi dati personali a terzi.' }] }] },
    { heading: '4. Base giuridica del trattamento (GDPR)', blocks: [{ type: 'p', parts: [{ text: 'Trattiamo i tuoi dati personali sulle seguenti basi giuridiche:' }] }, { type: 'ul', items: [{ strong: 'Esecuzione di un contratto (art. 6(1)(b) GDPR):', text: 'trattamento necessario per evadere ordini e gestire il tuo account.' }, { strong: 'Obbligo legale (art. 6(1)(c) GDPR):', text: 'trattamento richiesto dalla legge applicabile, ad esempio conservazione di registri contabili.' }, { strong: 'Legittimo interesse (art. 6(1)(f) GDPR):', text: 'prevenzione frodi, sicurezza della rete e miglioramento dei servizi, ove tali interessi non prevalgano sui tuoi diritti.' }, { strong: 'Consenso (art. 6(1)(a) GDPR):', text: 'comunicazioni marketing e cookie analitici opzionali, laddove tu abbia fornito consenso esplicito, revocabile in qualsiasi momento.' }] }] },
    { heading: '5. Conservazione dei dati', blocks: [{ type: 'p', parts: [{ text: 'Conserviamo i tuoi dati personali solo per il tempo necessario alle finalità per cui sono stati raccolti o quanto richiesto dalla legge. In particolare:' }] }, { type: 'ul', items: ['I dati account sono conservati per la durata dell’account più 3 anni dopo la chiusura.', 'I registri d’ordine e finanziari sono conservati 10 anni in conformità alla normativa contabile francese.', 'Le registrazioni del consenso marketing sono conservate per 3 anni dalla data del consenso o dall’ultima interazione.', 'I dati tecnici e di utilizzo derivati da analytics sono conservati in forma anonimizzata a tempo indeterminato.'] }] },
    { heading: '6. I tuoi diritti (GDPR artt. 15-22)', blocks: [{ type: 'p', parts: [{ text: 'Ai sensi del GDPR, hai i seguenti diritti in relazione ai tuoi dati personali:' }] }, { type: 'ul', items: [{ strong: 'Diritto di accesso (art. 15):', text: 'puoi richiedere una copia dei dati personali che deteniamo su di te.' }, { strong: 'Diritto di rettifica (art. 16):', text: 'puoi chiedere la correzione di dati inesatti o incompleti.' }, { strong: 'Diritto alla cancellazione (art. 17):', text: 'puoi richiedere l’eliminazione dei dati quando non vi siano motivi prevalenti per continuare il trattamento.' }, { strong: 'Diritto di limitazione (art. 18):', text: 'puoi chiedere la limitazione del trattamento in determinate circostanze.' }, { strong: 'Diritto alla portabilità (art. 20):', text: 'puoi richiedere i tuoi dati in formato strutturato e leggibile da macchina.' }, { strong: 'Diritto di opposizione (art. 21):', text: 'puoi opporti al trattamento basato su legittimo interesse o per finalità di marketing diretto.' }, { strong: 'Diritto di revocare il consenso (art. 7(3)):', text: 'se il trattamento si basa sul consenso, puoi revocarlo in qualsiasi momento senza pregiudicare la liceità del trattamento precedente.' }] }, { type: 'p', parts: [{ text: 'Per esercitare questi diritti, contattaci a ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Risponderemo entro 30 giorni. Hai inoltre diritto di proporre reclamo all’autorità francese per la protezione dei dati (CNIL) su ' }, { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true }, { text: '.' }] }] },
    { heading: '7. Cookie', blocks: [{ type: 'p', parts: [{ text: 'Utilizziamo cookie e tecnologie di tracciamento simili sulla Piattaforma. Per informazioni dettagliate sui cookie utilizzati e su come gestirli, consulta la nostra ' }, { internal: '/cookies', label: 'Cookie Policy' }, { text: '.' }] }] },
    { heading: '8. Servizi di terze parti', blocks: [{ type: 'p', parts: [{ text: 'Collaboriamo con fornitori terzi accuratamente selezionati che trattano dati per nostro conto:' }] }, { type: 'ul', items: [{ strong: 'Supabase:', text: 'fornitore di database e autenticazione. Supabase tratta dati di autenticazione e conserva informazioni account. I dati sono ospitati nell’UE. Vedi ' }, { strong: 'Stripe:', text: 'fornitore di pagamento. Stripe gestisce i dati delle carte ed è certificata PCI DSS livello 1. Non conserviamo dati carta sui nostri server. Vedi ' }, { strong: 'Sanity:', text: 'sistema di gestione contenuti. Sanity conserva contenuti editoriali e prodotto e non tratta dati personali degli utenti finali. Vedi ' }] }, { type: 'p', parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }] }, { type: 'p', parts: [{ text: 'Richiediamo a tutti i responsabili esterni di rispettare la sicurezza dei tuoi dati e di trattarli solo secondo le nostre istruzioni e la normativa applicabile.' }] }] },
    { heading: '9. Trasferimenti internazionali', blocks: [{ type: 'p', parts: [{ text: 'Quando i dati personali sono trasferiti al di fuori dello Spazio Economico Europeo (SEE), garantiamo adeguate misure di salvaguardia, come Clausole Contrattuali Standard approvate dalla Commissione europea, oppure l’esistenza di una decisione di adeguatezza per il paese destinatario.' }] }] },
    { heading: '10. Contatta il DPO', blocks: [{ type: 'p', parts: [{ text: 'Per qualsiasi domanda o preoccupazione riguardo alla presente Informativa sulla privacy o al trattamento dei tuoi dati personali, contatta il nostro DPO:' }] }, { type: 'p', parts: [{ text: 'E-mail: ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Posta: Data Protection Officer, {companyName}, {companyAddress}.' }] }] },
  ],
  es: [
    { heading: '1. Responsable del tratamiento', blocks: [{ type: 'p', parts: [{ text: '{companyName} (“{siteName}”, “nosotros”) es el responsable del tratamiento de los datos personales recopilados a través de este sitio web y plataforma marketplace, de conformidad con el Reglamento (UE) 2016/679 (Reglamento General de Protección de Datos, “RGPD”) y la legislación francesa aplicable en materia de protección de datos (Loi Informatique et Libertés).' }] }, { type: 'p', parts: [{ text: 'Nuestra dirección registrada es: {companyName}, {companyAddress}. Para cualquier consulta de protección de datos, contacte con nuestro DPO en ' }, { mailto: 'privacy@terravoa.com' }, { text: '.' }] }] },
    { heading: '2. Datos que recopilamos', blocks: [{ type: 'p', parts: [{ text: 'Recopilamos las siguientes categorías de datos personales:' }] }, { type: 'ul', items: [{ strong: 'Datos de identidad:', text: 'nombre, apellidos, nombre de usuario o identificador similar.' }, { strong: 'Datos de contacto:', text: 'dirección de facturación, dirección de entrega, correo electrónico y teléfono.' }, { strong: 'Datos de transacción:', text: 'detalles sobre pagos y pedidos realizados en la Plataforma.' }, { strong: 'Datos técnicos:', text: 'dirección IP, tipo y versión de navegador, zona horaria, tipos y versiones de complementos, sistema operativo y otras tecnologías de los dispositivos utilizados.' }, { strong: 'Datos de uso:', text: 'información sobre cómo utiliza nuestro sitio y servicios, incluidas páginas visitadas, tiempo de permanencia y rutas de navegación.' }, { strong: 'Preferencias de marketing:', text: 'preferencias sobre recepción de comunicaciones comerciales.' }] }, { type: 'p', parts: [{ text: 'No recopilamos categorías especiales de datos (como datos sobre origen racial o étnico, opiniones políticas, datos de salud o biométricos) ni datos relativos a condenas o infracciones penales.' }] }] },
    { heading: '3. Cómo usamos sus datos', blocks: [{ type: 'p', parts: [{ text: 'Utilizamos sus datos personales para las siguientes finalidades:' }] }, { type: 'ul', items: ['Crear y gestionar su cuenta en la Plataforma.', 'Procesar y ejecutar sus pedidos, incluyendo pago y coordinación de entrega.', 'Enviar confirmaciones de pedido, actualizaciones de envío y otras comunicaciones transaccionales.', 'Responder a consultas, reclamaciones y solicitudes de soporte.', 'Enviar comunicaciones de marketing sobre productos, ofertas y eventos — solo con su consentimiento o cuando exista interés legítimo.', 'Mejorar y personalizar su experiencia en la Plataforma.', 'Cumplir obligaciones legales y regulatorias, incluida prevención del fraude y archivo financiero.'] }, { type: 'p', parts: [{ text: 'Nunca vendemos sus datos personales a terceros.' }] }] },
    { heading: '4. Base jurídica del tratamiento (RGPD)', blocks: [{ type: 'p', parts: [{ text: 'Tratamos sus datos personales sobre las siguientes bases jurídicas:' }] }, { type: 'ul', items: [{ strong: 'Ejecución de un contrato (art. 6(1)(b) RGPD):', text: 'tratamiento necesario para cumplir pedidos y gestionar su cuenta.' }, { strong: 'Obligación legal (art. 6(1)(c) RGPD):', text: 'tratamiento exigido por la ley aplicable, como conservación de registros contables.' }, { strong: 'Interés legítimo (art. 6(1)(f) RGPD):', text: 'tratamiento para prevención del fraude, seguridad de red y mejora de servicios, cuando dichos intereses no prevalezcan sobre sus derechos.' }, { strong: 'Consentimiento (art. 6(1)(a) RGPD):', text: 'tratamiento para comunicaciones de marketing y cookies analíticas opcionales cuando haya otorgado consentimiento expreso, revocable en cualquier momento.' }] }] },
    { heading: '5. Conservación de datos', blocks: [{ type: 'p', parts: [{ text: 'Conservamos sus datos personales solo durante el tiempo necesario para los fines para los que se recopilaron o el exigido por la ley. En particular:' }] }, { type: 'ul', items: ['Los datos de cuenta se conservan durante la vigencia de la cuenta y 3 años tras su cierre.', 'Los registros de pedidos y financieros se conservan 10 años conforme a la normativa contable francesa.', 'Los registros de consentimiento de marketing se conservan 3 años desde el consentimiento o su última interacción.', 'Los datos técnicos y de uso derivados de analítica se conservan de forma anonimizada de manera indefinida.'] }] },
    { heading: '6. Sus derechos (RGPD art. 15-22)', blocks: [{ type: 'p', parts: [{ text: 'Conforme al RGPD, usted tiene los siguientes derechos sobre sus datos personales:' }] }, { type: 'ul', items: [{ strong: 'Derecho de acceso (art. 15):', text: 'solicitar una copia de los datos personales que tratamos sobre usted.' }, { strong: 'Derecho de rectificación (art. 16):', text: 'solicitar la corrección de datos inexactos o incompletos.' }, { strong: 'Derecho de supresión (art. 17):', text: 'solicitar la eliminación cuando no exista razón imperiosa para continuar el tratamiento.' }, { strong: 'Derecho a la limitación (art. 18):', text: 'solicitar la limitación del tratamiento en determinadas circunstancias.' }, { strong: 'Derecho a la portabilidad (art. 20):', text: 'solicitar recibir sus datos en formato estructurado y legible por máquina.' }, { strong: 'Derecho de oposición (art. 21):', text: 'oponerse al tratamiento basado en interés legítimo o con fines de marketing directo.' }, { strong: 'Derecho a retirar el consentimiento (art. 7(3)):', text: 'cuando el tratamiento se base en consentimiento, puede retirarlo en cualquier momento sin afectar la licitud anterior.' }] }, { type: 'p', parts: [{ text: 'Para ejercer estos derechos, contacte con nosotros en ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Responderemos en 30 días. También tiene derecho a presentar una reclamación ante la autoridad francesa de protección de datos (CNIL) en ' }, { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true }, { text: '.' }] }] },
    { heading: '7. Cookies', blocks: [{ type: 'p', parts: [{ text: 'Utilizamos cookies y tecnologías de seguimiento similares en nuestra Plataforma. Para información detallada sobre las cookies utilizadas y cómo controlarlas, consulte nuestra ' }, { internal: '/cookies', label: 'Política de Cookies' }, { text: '.' }] }] },
    { heading: '8. Servicios de terceros', blocks: [{ type: 'p', parts: [{ text: 'Trabajamos con proveedores de servicios terceros cuidadosamente seleccionados que tratan datos por cuenta nuestra:' }] }, { type: 'ul', items: [{ strong: 'Supabase:', text: 'proveedor de base de datos y autenticación. Supabase trata datos de autenticación y almacena información de cuentas. Los datos se alojan en la UE. Ver ' }, { strong: 'Stripe:', text: 'proveedor de procesamiento de pagos. Stripe gestiona todos los datos de tarjetas y cuenta con certificación PCI DSS nivel 1. No almacenamos datos de tarjetas en nuestros servidores. Ver ' }, { strong: 'Sanity:', text: 'sistema de gestión de contenidos. Sanity almacena contenido editorial y de producto y no trata datos personales de usuarios finales. Ver ' }] }, { type: 'p', parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }] }, { type: 'p', parts: [{ text: 'Exigimos a todos los encargados de tratamiento que respeten la seguridad de sus datos y los traten únicamente de acuerdo con nuestras instrucciones y la normativa aplicable.' }] }] },
    { heading: '9. Transferencias internacionales', blocks: [{ type: 'p', parts: [{ text: 'Cuando los datos personales se transfieren fuera del Espacio Económico Europeo (EEE), garantizamos la existencia de salvaguardas adecuadas, como Cláusulas Contractuales Tipo aprobadas por la Comisión Europea, o que el país destinatario cuente con una decisión de adecuación.' }] }] },
    { heading: '10. Contactar con el DPO', blocks: [{ type: 'p', parts: [{ text: 'Para cualquier duda o inquietud sobre esta Política de Privacidad o el tratamiento de sus datos personales, contacte con nuestro DPO:' }] }, { type: 'p', parts: [{ text: 'Correo electrónico: ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Correo postal: Data Protection Officer, {companyName}, {companyAddress}.' }] }] },
  ],
  pt: [
    { heading: '1. Responsável pelo tratamento', blocks: [{ type: 'p', parts: [{ text: '{companyName} (“{siteName}”, “nós”) é o responsável pelo tratamento dos dados pessoais recolhidos através deste website e plataforma marketplace, em conformidade com o Regulamento (UE) 2016/679 (Regulamento Geral sobre a Proteção de Dados, “RGPD”) e com a legislação francesa aplicável (Loi Informatique et Libertés).' }] }, { type: 'p', parts: [{ text: 'A nossa morada registada é: {companyName}, {companyAddress}. Para quaisquer questões de proteção de dados, contacte o nosso DPO em ' }, { mailto: 'privacy@terravoa.com' }, { text: '.' }] }] },
    { heading: '2. Dados que recolhemos', blocks: [{ type: 'p', parts: [{ text: 'Recolhemos as seguintes categorias de dados pessoais:' }] }, { type: 'ul', items: [{ strong: 'Dados de identidade:', text: 'nome próprio, apelido, nome de utilizador ou identificador semelhante.' }, { strong: 'Dados de contacto:', text: 'morada de faturação, morada de entrega, e-mail e número de telefone.' }, { strong: 'Dados de transação:', text: 'detalhes sobre pagamentos e encomendas efetuadas através da Plataforma.' }, { strong: 'Dados técnicos:', text: 'endereço IP, tipo e versão do navegador, fuso horário, tipos e versões de plugins, sistema operativo e outras tecnologias dos dispositivos utilizados.' }, { strong: 'Dados de utilização:', text: 'informação sobre como utiliza o website e os serviços, incluindo páginas visitadas, tempo despendido e percursos de navegação.' }, { strong: 'Preferências de marketing:', text: 'as suas preferências relativas à receção de comunicações de marketing.' }] }, { type: 'p', parts: [{ text: 'Não recolhemos categorias especiais de dados (por exemplo, dados sobre origem racial ou étnica, opiniões políticas, dados de saúde ou biométricos) nem dados relativos a condenações ou infrações criminais.' }] }] },
    { heading: '3. Como utilizamos os seus dados', blocks: [{ type: 'p', parts: [{ text: 'Utilizamos os seus dados pessoais para as seguintes finalidades:' }] }, { type: 'ul', items: ['Criar e gerir a sua conta na Plataforma.', 'Processar e cumprir as suas encomendas, incluindo pagamento e coordenação de entrega.', 'Enviar confirmações de encomenda, atualizações de envio e outras comunicações transacionais.', 'Responder a pedidos de informação, reclamações e suporte.', 'Enviar comunicações de marketing sobre produtos, ofertas e eventos — apenas com consentimento ou quando exista interesse legítimo.', 'Melhorar e personalizar a sua experiência na Plataforma.', 'Cumprir obrigações legais e regulatórias, incluindo prevenção de fraude e conservação de registos financeiros.'] }, { type: 'p', parts: [{ text: 'Nunca vendemos os seus dados pessoais a terceiros.' }] }] },
    { heading: '4. Base legal do tratamento (RGPD)', blocks: [{ type: 'p', parts: [{ text: 'Tratamos os seus dados pessoais com base nas seguintes bases legais:' }] }, { type: 'ul', items: [{ strong: 'Execução de contrato (art. 6(1)(b) RGPD):', text: 'tratamento necessário para cumprir encomendas e gerir a sua conta.' }, { strong: 'Obrigação legal (art. 6(1)(c) RGPD):', text: 'tratamento exigido por lei aplicável, como retenção de registos financeiros.' }, { strong: 'Interesses legítimos (art. 6(1)(f) RGPD):', text: 'tratamento para prevenção de fraude, segurança de rede e melhoria de serviços, desde que não prevaleçam os seus direitos.' }, { strong: 'Consentimento (art. 6(1)(a) RGPD):', text: 'tratamento para comunicações de marketing e cookies analíticos opcionais quando tiver dado consentimento explícito, que pode retirar a qualquer momento.' }] }] },
    { heading: '5. Conservação dos dados', blocks: [{ type: 'p', parts: [{ text: 'Conservamos os seus dados pessoais apenas durante o período necessário às finalidades para que foram recolhidos ou conforme exigido por lei. Especificamente:' }] }, { type: 'ul', items: ['Os dados de conta são conservados durante a duração da conta e mais 3 anos após o encerramento.', 'Registos de encomendas e financeiros são conservados durante 10 anos em conformidade com a legislação contabilística francesa.', 'Registos de consentimento de marketing são conservados por 3 anos a partir da data de consentimento ou da última interação.', 'Dados técnicos e de utilização derivados de analítica são conservados de forma anonimizada por tempo indeterminado.'] }] },
    { heading: '6. Os seus direitos (RGPD art. 15-22)', blocks: [{ type: 'p', parts: [{ text: 'Nos termos do RGPD, tem os seguintes direitos relativamente aos seus dados pessoais:' }] }, { type: 'ul', items: [{ strong: 'Direito de acesso (art. 15):', text: 'pode solicitar uma cópia dos dados pessoais que detemos sobre si.' }, { strong: 'Direito de retificação (art. 16):', text: 'pode pedir correção de dados inexatos ou incompletos.' }, { strong: 'Direito ao apagamento (art. 17):', text: 'pode solicitar eliminação dos seus dados quando não exista motivo imperioso para continuar o tratamento.' }, { strong: 'Direito à limitação (art. 18):', text: 'pode pedir limitação do tratamento em determinadas circunstâncias.' }, { strong: 'Direito à portabilidade (art. 20):', text: 'pode pedir os seus dados em formato estruturado e de leitura automática.' }, { strong: 'Direito de oposição (art. 21):', text: 'pode opor-se ao tratamento com base em interesse legítimo ou para marketing direto.' }, { strong: 'Direito de retirar consentimento (art. 7(3)):', text: 'quando o tratamento se baseia no consentimento, pode retirá-lo a qualquer momento sem afetar a licitude anterior.' }] }, { type: 'p', parts: [{ text: 'Para exercer estes direitos, contacte-nos em ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Responderemos no prazo de 30 dias. Tem também o direito de apresentar reclamação à autoridade francesa de proteção de dados (CNIL) em ' }, { href: 'https://www.cnil.fr', label: 'cnil.fr', external: true }, { text: '.' }] }] },
    { heading: '7. Cookies', blocks: [{ type: 'p', parts: [{ text: 'Utilizamos cookies e tecnologias de rastreamento semelhantes na Plataforma. Para informações detalhadas sobre os cookies utilizados e como os controlar, consulte a nossa ' }, { internal: '/cookies', label: 'Política de Cookies' }, { text: '.' }] }] },
    { heading: '8. Serviços de terceiros', blocks: [{ type: 'p', parts: [{ text: 'Trabalhamos com prestadores terceiros cuidadosamente selecionados que tratam dados em nosso nome:' }] }, { type: 'ul', items: [{ strong: 'Supabase:', text: 'fornecedor de base de dados e autenticação. A Supabase trata dados de autenticação e armazena informação de conta. Dados alojados na UE. Ver ' }, { strong: 'Stripe:', text: 'fornecedor de processamento de pagamentos. A Stripe trata todos os dados de cartão e é certificada PCI DSS nível 1. Não armazenamos dados de cartão nos nossos servidores. Ver ' }, { strong: 'Sanity:', text: 'sistema de gestão de conteúdos. A Sanity armazena conteúdos de produto e editoriais e não trata dados pessoais de utilizadores finais. Ver ' }] }, { type: 'p', parts: [{ href: 'https://supabase.com/privacy', label: 'Supabase Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://stripe.com/privacy', label: 'Stripe Privacy Policy', external: true }] }, { type: 'p', parts: [{ href: 'https://www.sanity.io/legal/privacy', label: 'Sanity Privacy Policy', external: true }] }, { type: 'p', parts: [{ text: 'Exigimos a todos os subcontratantes que respeitem a segurança dos seus dados e os tratem apenas de acordo com as nossas instruções e com a legislação aplicável.' }] }] },
    { heading: '9. Transferências internacionais', blocks: [{ type: 'p', parts: [{ text: 'Quando dados pessoais são transferidos para fora do Espaço Económico Europeu (EEE), garantimos salvaguardas adequadas, como Cláusulas Contratuais-Tipo aprovadas pela Comissão Europeia, ou que o país destinatário beneficie de uma decisão de adequação.' }] }] },
    { heading: '10. Contactar o DPO', blocks: [{ type: 'p', parts: [{ text: 'Para quaisquer questões ou preocupações relativas a esta Política de Privacidade ou ao tratamento dos seus dados pessoais, contacte o nosso DPO:' }] }, { type: 'p', parts: [{ text: 'E-mail: ' }, { mailto: 'privacy@terravoa.com' }, { text: '. Correio: Data Protection Officer, {companyName}, {companyAddress}.' }] }] },
  ],
}
