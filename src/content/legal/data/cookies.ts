import type { LegalLocale, LegalSection } from '@/lib/legal/types'

export const cookiesSections: Record<LegalLocale, LegalSection[]> = {
  en: [
    {
      heading: 'What Are Cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Cookies are small text files that are placed on your device when you visit a website. They allow the website to recognise your device, remember your preferences, and provide certain features. Cookies cannot run programs or deliver viruses to your device.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'We use cookies in accordance with the GDPR and applicable French law (including guidance from the CNIL). Where cookies are not strictly necessary, we ask for your consent before setting them. You can update your preferences at any time via our cookie banner.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Essential Cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'These cookies are strictly necessary for the Platform to function and cannot be disabled. They are set automatically when you visit the site and do not require your consent under applicable law.',
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: 'Set by Supabase to manage your authentication session. These cookies allow you to remain logged in as you navigate between pages. They expire when your session ends or after a maximum of 7 days.',
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(browser local storage)',
              body: "Stores your cookie preferences so we do not ask for consent on every visit. This value is saved in your browser's local storage (not transmitted with every request) and only after you interact with the cookie banner. It remains until you clear your browser storage or explicitly reset your preferences.",
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Stores your selected language preference to ensure the correct version of the site is displayed on subsequent visits. Expires after 12 months.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Analytics Cookies (Optional)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'These cookies help us understand how visitors interact with the Platform, so we can improve the user experience. They are only set if you have given your consent. All analytics data is anonymised and cannot be used to identify you personally.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Analytics provider cookies',
          parts: [
            {
              text: 'We may use a privacy-friendly analytics service to collect aggregated statistics such as page views, session duration, and navigation paths. No personal data or cross-site tracking is involved. You can opt out at any time by updating your cookie preferences.',
            },
          ],
        },
      ],
    },
    {
      heading: 'How to Control Cookies',
      blocks: [
        {
          type: 'p',
          parts: [{ text: 'You have several options for managing cookies:' }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Cookie banner:',
              text: 'You can update your preferences at any time by clicking the “Cookie Settings” link in the footer of any page.',
            },
            {
              strong: 'Browser settings:',
              text: 'Most browsers allow you to refuse or delete cookies via their settings. Please note that disabling essential cookies will impair the functionality of the Platform — for example, you will not be able to stay logged in.',
            },
            {
              strong: 'Device settings:',
              text: 'For cookies set by third parties on mobile devices, you may be able to manage these through your device operating system settings.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: "For guidance on how to manage cookies in your browser, visit your browser's help pages or refer to resources such as " },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Further Information',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'For more information on how we use your personal data, please see our ' },
            { internal: '/privacy', label: 'Privacy Policy' },
            { text: '. For questions about our use of cookies, contact us at ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
  de: [
    {
      heading: 'Was sind Cookies?',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen es der Website, Ihr Gerät wiederzuerkennen, Ihre Einstellungen zu speichern und bestimmte Funktionen bereitzustellen. Cookies können keine Programme ausführen und keine Viren auf Ihr Gerät übertragen.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Wir verwenden Cookies gemäß der DSGVO und den anwendbaren französischen Rechtsvorschriften (einschließlich der Leitlinien der CNIL). Soweit Cookies nicht unbedingt erforderlich sind, holen wir vor dem Setzen Ihre Einwilligung ein. Sie können Ihre Einstellungen jederzeit über unser Cookie-Banner anpassen.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Unbedingt erforderliche Cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Diese Cookies sind für die Funktionsfähigkeit der Plattform zwingend erforderlich und können nicht deaktiviert werden. Sie werden beim Besuch der Website automatisch gesetzt und bedürfen nach geltendem Recht keiner Einwilligung.',
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: 'Von Supabase gesetzt, um Ihre Authentifizierungssitzung zu verwalten. Diese Cookies sorgen dafür, dass Sie beim Navigieren zwischen Seiten angemeldet bleiben. Sie verfallen mit dem Ende Ihrer Sitzung oder spätestens nach 7 Tagen.',
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(lokaler Speicher des Browsers)',
              body: 'Speichert Ihre Cookie-Präferenzen, damit wir nicht bei jedem Besuch erneut nach Ihrer Einwilligung fragen. Dieser Wert wird im lokalen Speicher Ihres Browsers gespeichert (nicht mit jeder Anfrage übertragen) und erst nach Ihrer Interaktion mit dem Cookie-Banner angelegt. Er bleibt bestehen, bis Sie den Browser-Speicher löschen oder Ihre Präferenzen ausdrücklich zurücksetzen.',
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Speichert Ihre gewählte Spracheinstellung, damit bei künftigen Besuchen die richtige Sprachversion angezeigt wird. Läuft nach 12 Monaten ab.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Analyse-Cookies (optional)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Plattform interagieren, damit wir die Benutzererfahrung verbessern können. Sie werden nur gesetzt, wenn Sie eingewilligt haben. Alle Analysedaten sind anonymisiert und können nicht dazu verwendet werden, Sie persönlich zu identifizieren.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Cookies von Analyseanbietern',
          parts: [
            {
              text: 'Wir können einen datenschutzfreundlichen Analysedienst nutzen, um aggregierte Statistiken wie Seitenaufrufe, Sitzungsdauer und Navigationspfade zu erfassen. Es erfolgt keine Verarbeitung personenbezogener Daten und kein seitenübergreifendes Tracking. Sie können jederzeit widersprechen, indem Sie Ihre Cookie-Einstellungen aktualisieren.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Wie Sie Cookies kontrollieren können',
      blocks: [
        { type: 'p', parts: [{ text: 'Sie haben mehrere Möglichkeiten, Cookies zu verwalten:' }] },
        {
          type: 'ul',
          items: [
            {
              strong: 'Cookie-Banner:',
              text: 'Sie können Ihre Präferenzen jederzeit anpassen, indem Sie auf den Link „Cookie-Einstellungen“ im Footer jeder Seite klicken.',
            },
            {
              strong: 'Browser-Einstellungen:',
              text: 'Die meisten Browser erlauben das Ablehnen oder Löschen von Cookies über die Einstellungen. Bitte beachten Sie, dass die Deaktivierung unbedingt erforderlicher Cookies die Funktionalität der Plattform beeinträchtigt — zum Beispiel können Sie dann nicht angemeldet bleiben.',
            },
            {
              strong: 'Geräte-Einstellungen:',
              text: 'Bei Cookies, die auf mobilen Geräten von Drittanbietern gesetzt werden, können Sie diese gegebenenfalls über die Betriebssystemeinstellungen Ihres Geräts verwalten.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: 'Hinweise zur Verwaltung von Cookies in Ihrem Browser finden Sie in den Hilfeseiten Ihres Browsers oder in Ressourcen wie ' },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Weitere Informationen',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'Weitere Informationen zur Verarbeitung Ihrer personenbezogenen Daten finden Sie in unserer ' },
            { internal: '/privacy', label: 'Datenschutzerklärung' },
            { text: '. Bei Fragen zur Verwendung von Cookies kontaktieren Sie uns unter ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
  fr: [
    {
      heading: 'Que sont les cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Les cookies sont de petits fichiers texte déposés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de reconnaître votre appareil, de mémoriser vos préférences et de fournir certaines fonctionnalités. Les cookies ne peuvent pas exécuter de programmes ni transmettre de virus à votre appareil.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Nous utilisons des cookies conformément au RGPD et au droit français applicable (y compris les recommandations de la CNIL). Lorsque les cookies ne sont pas strictement nécessaires, nous sollicitons votre consentement avant leur dépôt. Vous pouvez modifier vos préférences à tout moment via notre bandeau cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies essentiels',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Ces cookies sont strictement nécessaires au fonctionnement de la Plateforme et ne peuvent pas être désactivés. Ils sont déposés automatiquement lorsque vous visitez le site et ne nécessitent pas votre consentement au regard de la loi applicable.",
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: "Déposés par Supabase pour gérer votre session d'authentification. Ces cookies vous permettent de rester connecté lorsque vous naviguez entre les pages. Ils expirent à la fin de votre session ou au plus tard après 7 jours.",
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(stockage local du navigateur)',
              body: "Enregistre vos préférences en matière de cookies afin d'éviter de vous demander votre consentement à chaque visite. Cette valeur est conservée dans le stockage local de votre navigateur (elle n'est pas transmise à chaque requête) et uniquement après interaction avec le bandeau cookies. Elle reste stockée jusqu'à ce que vous effaciez le stockage de votre navigateur ou réinitialisiez explicitement vos préférences.",
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Mémorise votre préférence linguistique afin d’afficher la bonne version du site lors de vos prochaines visites. Expire après 12 mois.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies analytiques (optionnels)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Ces cookies nous aident à comprendre comment les visiteurs interagissent avec la Plateforme afin d'améliorer l'expérience utilisateur. Ils ne sont déposés que si vous y avez consenti. Toutes les données analytiques sont anonymisées et ne permettent pas de vous identifier personnellement.",
            },
          ],
        },
        {
          type: 'box',
          title: "Cookies des fournisseurs d'analyse",
          parts: [
            {
              text: 'Nous pouvons utiliser un service de mesure daudience respectueux de la vie privée pour collecter des statistiques agrégées telles que les vues de pages, la durée des sessions et les parcours de navigation. Aucune donnée personnelle ni aucun suivi inter-sites ne sont utilisés. Vous pouvez vous y opposer à tout moment en mettant à jour vos préférences cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Comment contrôler les cookies',
      blocks: [
        { type: 'p', parts: [{ text: 'Vous disposez de plusieurs options pour gérer les cookies :' }] },
        {
          type: 'ul',
          items: [
            {
              strong: 'Bandeau cookies :',
              text: 'Vous pouvez modifier vos préférences à tout moment en cliquant sur le lien « Paramètres des cookies » dans le pied de page de chaque page.',
            },
            {
              strong: 'Paramètres du navigateur :',
              text: 'La plupart des navigateurs permettent de refuser ou de supprimer les cookies via leurs paramètres. Veuillez noter que la désactivation des cookies essentiels altérera le fonctionnement de la Plateforme — par exemple, vous ne pourrez pas rester connecté.',
            },
            {
              strong: "Paramètres de l'appareil :",
              text: "Pour les cookies déposés par des tiers sur les appareils mobiles, vous pouvez parfois les gérer via les paramètres du système d'exploitation de votre appareil.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: "Pour savoir comment gérer les cookies dans votre navigateur, consultez les pages d'aide de votre navigateur ou des ressources telles que " },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Informations complémentaires',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: "Pour plus d'informations sur l'utilisation de vos données personnelles, veuillez consulter notre " },
            { internal: '/privacy', label: 'Politique de confidentialité' },
            { text: ". Pour toute question concernant notre utilisation des cookies, contactez-nous à l'adresse " },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
  it: [
    {
      heading: 'Cosa sono i cookie',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo quando visiti un sito web. Consentono al sito di riconoscere il tuo dispositivo, ricordare le tue preferenze e offrire determinate funzionalità. I cookie non possono eseguire programmi né trasmettere virus al tuo dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Utilizziamo i cookie in conformità al GDPR e alla normativa francese applicabile (incluse le linee guida della CNIL). Quando i cookie non sono strettamente necessari, richiediamo il tuo consenso prima di installarli. Puoi aggiornare le tue preferenze in qualsiasi momento tramite il nostro banner dei cookie.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookie essenziali',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Questi cookie sono strettamente necessari al funzionamento della Piattaforma e non possono essere disattivati. Vengono impostati automaticamente quando visiti il sito e non richiedono il tuo consenso ai sensi della normativa applicabile.',
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: "Impostati da Supabase per gestire la tua sessione di autenticazione. Questi cookie ti consentono di restare connesso mentre navighi tra le pagine. Scadono al termine della sessione o dopo un massimo di 7 giorni.",
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(memoria locale del browser)',
              body: 'Memorizza le tue preferenze sui cookie in modo da non richiedere il consenso a ogni visita. Questo valore viene salvato nella memoria locale del browser (non viene trasmesso a ogni richiesta) e solo dopo la tua interazione con il banner dei cookie. Rimane finché non cancelli la memoria del browser o non reimposti esplicitamente le preferenze.',
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Memorizza la lingua selezionata per garantire la visualizzazione della versione corretta del sito nelle visite successive. Scade dopo 12 mesi.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookie analitici (facoltativi)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Questi cookie ci aiutano a capire come i visitatori interagiscono con la Piattaforma, così da migliorare l'esperienza utente. Vengono impostati solo se hai prestato il tuo consenso. Tutti i dati analitici sono anonimizzati e non possono essere utilizzati per identificarti personalmente.",
            },
          ],
        },
        {
          type: 'box',
          title: 'Cookie del fornitore di analisi',
          parts: [
            {
              text: 'Potremmo utilizzare un servizio di analisi rispettoso della privacy per raccogliere statistiche aggregate come visualizzazioni di pagina, durata delle sessioni e percorsi di navigazione. Non è previsto alcun trattamento di dati personali né tracciamento cross-site. Puoi opporti in qualsiasi momento aggiornando le preferenze sui cookie.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Come controllare i cookie',
      blocks: [
        { type: 'p', parts: [{ text: 'Hai diverse opzioni per gestire i cookie:' }] },
        {
          type: 'ul',
          items: [
            {
              strong: 'Banner dei cookie:',
              text: 'Puoi aggiornare le tue preferenze in qualsiasi momento facendo clic sul link “Impostazioni cookie” nel footer di qualsiasi pagina.',
            },
            {
              strong: 'Impostazioni del browser:',
              text: 'La maggior parte dei browser consente di rifiutare o eliminare i cookie tramite le impostazioni. Tieni presente che la disattivazione dei cookie essenziali comprometterà il funzionamento della Piattaforma — ad esempio, non potrai restare connesso.',
            },
            {
              strong: 'Impostazioni del dispositivo:',
              text: 'Per i cookie impostati da terze parti sui dispositivi mobili, potresti poterli gestire tramite le impostazioni del sistema operativo del tuo dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: "Per indicazioni su come gestire i cookie nel browser, consulta le pagine di aiuto del tuo browser o risorse come " },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Ulteriori informazioni',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'Per maggiori informazioni su come utilizziamo i tuoi dati personali, consulta la nostra ' },
            { internal: '/privacy', label: 'Informativa sulla privacy' },
            { text: ". Per domande sull'uso dei cookie, contattaci all'indirizzo " },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
  es: [
    {
      heading: 'Qué son las cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio reconozca su dispositivo, recuerde sus preferencias y ofrezca determinadas funciones. Las cookies no pueden ejecutar programas ni transmitir virus a su dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Utilizamos cookies de conformidad con el RGPD y la legislación francesa aplicable (incluidas las directrices de la CNIL). Cuando las cookies no son estrictamente necesarias, solicitamos su consentimiento antes de instalarlas. Puede actualizar sus preferencias en cualquier momento mediante nuestro banner de cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies esenciales',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Estas cookies son estrictamente necesarias para el funcionamiento de la Plataforma y no pueden desactivarse. Se establecen automáticamente cuando visita el sitio y no requieren su consentimiento conforme a la normativa aplicable.',
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: 'Establecidas por Supabase para gestionar su sesión de autenticación. Estas cookies le permiten permanecer conectado mientras navega entre páginas. Caducan cuando finaliza su sesión o, como máximo, a los 7 días.',
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(almacenamiento local del navegador)',
              body: 'Guarda sus preferencias de cookies para que no solicitemos su consentimiento en cada visita. Este valor se guarda en el almacenamiento local de su navegador (no se transmite con cada solicitud) y solo después de que interactúe con el banner de cookies. Permanece hasta que borre el almacenamiento del navegador o restablezca expresamente sus preferencias.',
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Guarda su preferencia de idioma para asegurar que se muestre la versión correcta del sitio en visitas posteriores. Caduca a los 12 meses.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies analíticas (opcionales)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Estas cookies nos ayudan a comprender cómo interactúan los visitantes con la Plataforma para mejorar la experiencia de usuario. Solo se instalan si usted ha dado su consentimiento. Todos los datos analíticos están anonimizados y no pueden utilizarse para identificarle personalmente.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Cookies del proveedor analítico',
          parts: [
            {
              text: 'Podemos utilizar un servicio analítico respetuoso con la privacidad para recopilar estadísticas agregadas, como páginas vistas, duración de las sesiones y rutas de navegación. No intervienen datos personales ni seguimiento entre sitios. Puede darse de baja en cualquier momento actualizando sus preferencias de cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cómo controlar las cookies',
      blocks: [
        { type: 'p', parts: [{ text: 'Tiene varias opciones para gestionar las cookies:' }] },
        {
          type: 'ul',
          items: [
            {
              strong: 'Banner de cookies:',
              text: 'Puede actualizar sus preferencias en cualquier momento haciendo clic en el enlace “Configuración de cookies” en el pie de página de cualquier página.',
            },
            {
              strong: 'Configuración del navegador:',
              text: 'La mayoría de los navegadores permiten rechazar o eliminar cookies desde su configuración. Tenga en cuenta que desactivar las cookies esenciales afectará al funcionamiento de la Plataforma — por ejemplo, no podrá permanecer conectado.',
            },
            {
              strong: 'Configuración del dispositivo:',
              text: 'En el caso de cookies instaladas por terceros en dispositivos móviles, puede que pueda gestionarlas mediante la configuración del sistema operativo de su dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: 'Para saber cómo gestionar las cookies en su navegador, visite las páginas de ayuda de su navegador o consulte recursos como ' },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Información adicional',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'Para más información sobre cómo utilizamos sus datos personales, consulte nuestra ' },
            { internal: '/privacy', label: 'Política de Privacidad' },
            { text: '. Si tiene preguntas sobre nuestro uso de cookies, contáctenos en ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
  pt: [
    {
      heading: 'O que são cookies',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Cookies são pequenos ficheiros de texto que são colocados no seu dispositivo quando visita um website. Permitem que o website reconheça o seu dispositivo, memorize as suas preferências e disponibilize determinadas funcionalidades. Os cookies não podem executar programas nem transmitir vírus para o seu dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Utilizamos cookies em conformidade com o RGPD e com a legislação francesa aplicável (incluindo as orientações da CNIL). Sempre que os cookies não sejam estritamente necessários, solicitamos o seu consentimento antes de os definir. Pode atualizar as suas preferências a qualquer momento através do nosso banner de cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies essenciais',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Estes cookies são estritamente necessários para o funcionamento da Plataforma e não podem ser desativados. São definidos automaticamente quando visita o site e não requerem o seu consentimento ao abrigo da legislação aplicável.',
            },
          ],
        },
        {
          type: 'cookieEntries',
          entries: [
            {
              codes: ['sb-access-token', 'sb-refresh-token'],
              body: 'Definidos pela Supabase para gerir a sua sessão de autenticação. Estes cookies permitem-lhe permanecer com sessão iniciada enquanto navega entre páginas. Expiram quando a sua sessão termina ou, no máximo, após 7 dias.',
            },
            {
              codes: ['terravoa_cookie_consent'],
              title: '(armazenamento local do navegador)',
              body: 'Guarda as suas preferências de cookies para que não peçamos consentimento em todas as visitas. Este valor é guardado no armazenamento local do seu navegador (não é transmitido em cada pedido) e apenas após interação com o banner de cookies. Permanece até limpar o armazenamento do navegador ou repor explicitamente as suas preferências.',
            },
            {
              codes: ['NEXT_LOCALE'],
              body: 'Guarda a preferência de idioma selecionada para garantir que a versão correta do site é apresentada em visitas futuras. Expira após 12 meses.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Cookies analíticos (opcionais)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Estes cookies ajudam-nos a compreender como os visitantes interagem com a Plataforma, para podermos melhorar a experiência do utilizador. Só são definidos se tiver dado o seu consentimento. Todos os dados analíticos são anonimizados e não podem ser utilizados para o identificar pessoalmente.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Cookies do fornecedor de analítica',
          parts: [
            {
              text: 'Podemos utilizar um serviço de analítica respeitador da privacidade para recolher estatísticas agregadas, como visualizações de páginas, duração de sessões e percursos de navegação. Não envolve dados pessoais nem rastreamento entre sites. Pode recusar a qualquer momento atualizando as suas preferências de cookies.',
            },
          ],
        },
      ],
    },
    {
      heading: 'Como controlar os cookies',
      blocks: [
        { type: 'p', parts: [{ text: 'Tem várias opções para gerir os cookies:' }] },
        {
          type: 'ul',
          items: [
            {
              strong: 'Banner de cookies:',
              text: 'Pode atualizar as suas preferências a qualquer momento clicando na ligação “Definições de Cookies” no rodapé de qualquer página.',
            },
            {
              strong: 'Definições do navegador:',
              text: 'A maioria dos navegadores permite recusar ou eliminar cookies nas respetivas definições. Tenha em atenção que desativar cookies essenciais prejudicará a funcionalidade da Plataforma — por exemplo, não conseguirá manter sessão iniciada.',
            },
            {
              strong: 'Definições do dispositivo:',
              text: 'Para cookies definidos por terceiros em dispositivos móveis, poderá conseguir geri-los através das definições do sistema operativo do seu dispositivo.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            { text: 'Para obter orientações sobre como gerir cookies no seu navegador, consulte as páginas de ajuda do navegador ou recursos como ' },
            { href: 'https://www.aboutcookies.org', label: 'aboutcookies.org', external: true },
            { text: '.' },
          ],
        },
      ],
    },
    {
      heading: 'Informações adicionais',
      blocks: [
        {
          type: 'p',
          parts: [
            { text: 'Para mais informações sobre como utilizamos os seus dados pessoais, consulte a nossa ' },
            { internal: '/privacy', label: 'Política de Privacidade' },
            { text: '. Para questões sobre a nossa utilização de cookies, contacte-nos através de ' },
            { mailto: 'privacy@terravoa.com' },
            { text: '.' },
          ],
        },
      ],
    },
  ],
}
