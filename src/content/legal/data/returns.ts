import type { LegalLocale, LegalSection } from '@/lib/legal/types'

export const returnsSections: Record<LegalLocale, LegalSection[]> = {
  en: [
    {
      heading: '1. Right of Withdrawal (EU 14-Day Cooling-Off Period)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'As a consumer within the European Union, you have the right to withdraw from your purchase without giving any reason within 14 calendar days of the day on which you, or a third party you have nominated, take physical possession of the goods. This right is provided under EU Directive 2011/83/EU on consumer rights, transposed into French law.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'To exercise your right of withdrawal, you must inform us of your decision to withdraw by an unequivocal statement (for example, a letter sent by post or an email). You may use the model withdrawal form below, but it is not obligatory.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Model Withdrawal Form',
          italic: true,
          parts: [
            {
              text: 'To: {companyName}, {companyAddress} — hello@terravoa.com. I hereby give notice that I withdraw from my contract of sale of the following goods: [description of goods] / ordered on [date] / received on [date]. Name of consumer: ___________. Address of consumer: ___________. Signature (if paper form): ___________ Date: ___________.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Exceptions — Perishable & Personalised Products',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'The right of withdrawal does not apply to the following categories, in accordance with Art. L221-28 of the French Consumer Code:',
            },
          ],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Perishable food products:',
              text: 'Goods that are liable to deteriorate or expire rapidly — including fresh produce, chilled items, fresh cheese, and any product with a short use-by date — cannot be returned.',
            },
            {
              strong: 'Sealed goods opened after delivery:',
              text: 'Products that are not suitable for return for health or hygiene reasons where the seal has been broken after delivery (for example, vacuum-packed charcuterie or specialty oils once opened).',
            },
            {
              strong: 'Personalised or custom orders:',
              text: 'Products that have been made to your specification or clearly personalised.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Dry goods and non-perishable products (such as preserves, wines, and spirits) that remain sealed and in their original condition are eligible for return under the standard 14-day withdrawal right.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. Return Process',
      blocks: [
        { type: 'p', parts: [{ text: 'To initiate a return, please follow these steps:' }] },
        {
          type: 'ol',
          items: [
            [
              { text: 'Contact us at ' },
              { mailto: 'hello@terravoa.com' },
              {
                text: ' within 14 days of receiving your order. Include your order number and the item(s) you wish to return.',
              },
            ],
            [
              {
                text: 'We will acknowledge your request within 2 business days and provide return instructions, including a return address and, where applicable, a pre-paid shipping label.',
              },
            ],
            [
              {
                text: 'Pack the item securely in its original packaging, ensuring it is protected during transit. You are responsible for the goods until they are received by the producer.',
              },
            ],
            [
              {
                text: 'Ship the return within 14 days of notifying us of your withdrawal. Unless we have offered to collect the goods, the cost of return shipping is borne by you unless the item is faulty or incorrectly sent.',
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Refunds',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Once we have received the returned goods and verified their condition, we will process your refund without undue delay, and no later than 14 days from the date we receive the goods back or from the date you provide evidence of having sent the goods, whichever is earlier.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Refunds are issued to the original payment method used at checkout. Depending on your bank or payment provider, it may take an additional 3-10 business days for the credit to appear on your statement.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'The refund will include the full price of the returned product and the standard delivery costs you originally paid. We are not required to refund supplementary costs if you chose an express or premium delivery option.',
            },
          ],
        },
      ],
    },
    {
      heading: '5. Damaged or Incorrectly Sent Goods',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'If your order arrives damaged, defective, or does not match what you ordered, please contact us within 48 hours of delivery. Provide your order number and photographs clearly showing the damage or discrepancy.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'In such cases, we will offer you the choice of a full refund (including any shipping costs) or a replacement, at no additional cost to you. We will also arrange and cover the cost of return shipping where the goods need to be sent back.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Your statutory rights under French and EU consumer law are not affected by anything in this policy.',
            },
          ],
        },
        {
          type: 'cta',
          title: 'Ready to start a return?',
          description: "Use our return request form — we'll respond within 2 business days with next steps.",
          primaryLabel: 'Request a return',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Email us instead',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
  de: [
    {
      heading: '1. Widerrufsrecht (EU-14-Tage-Widerrufsfrist)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Als Verbraucherin oder Verbraucher in der Europäischen Union haben Sie das Recht, binnen 14 Kalendertagen ohne Angabe von Gründen vom Kauf zurückzutreten. Die Frist beginnt an dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Ware in Besitz nehmen. Dieses Recht ergibt sich aus der Richtlinie 2011/83/EU über Verbraucherrechte, umgesetzt in französisches Recht.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Zur Ausübung Ihres Widerrufsrechts müssen Sie uns mittels einer eindeutigen Erklärung (z. B. per Post oder E-Mail) über Ihren Entschluss informieren. Sie können das untenstehende Muster-Widerrufsformular verwenden, dies ist jedoch nicht verpflichtend.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Muster-Widerrufsformular',
          italic: true,
          parts: [
            {
              text: 'An: {companyName}, {companyAddress} — hello@terravoa.com. Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden Waren: [Beschreibung der Waren] / bestellt am [Datum] / erhalten am [Datum]. Name des Verbrauchers: ___________. Anschrift des Verbrauchers: ___________. Unterschrift (nur bei Mitteilung auf Papier): ___________ Datum: ___________.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Ausnahmen — verderbliche und personalisierte Produkte',
      blocks: [
        {
          type: 'p',
          parts: [{ text: 'Das Widerrufsrecht gilt gemäß Art. L221-28 des französischen Verbrauchergesetzbuchs nicht für folgende Kategorien:' }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Verderbliche Lebensmittel:',
              text: 'Waren, die schnell verderben oder deren Verfallsdatum schnell erreicht wird — darunter Frischwaren, gekühlte Produkte, Frischkäse und Produkte mit kurzer Haltbarkeit — können nicht zurückgegeben werden.',
            },
            {
              strong: 'Versiegelte Waren nach Öffnung:',
              text: 'Produkte, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, sofern ihre Versiegelung nach der Lieferung entfernt wurde (z. B. vakuumverpackte Wurstwaren oder Spezialöle nach dem Öffnen).',
            },
            {
              strong: 'Personalisierte oder maßgefertigte Bestellungen:',
              text: 'Produkte, die nach Ihren Spezifikationen angefertigt oder eindeutig personalisiert wurden.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Trockene und nicht verderbliche Produkte (z. B. Konserven, Weine und Spirituosen), die versiegelt und im Originalzustand bleiben, sind im Rahmen des regulären 14-tägigen Widerrufsrechts rückgabefähig.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. Rückgabeprozess',
      blocks: [
        { type: 'p', parts: [{ text: 'Um eine Rückgabe zu veranlassen, gehen Sie bitte wie folgt vor:' }] },
        {
          type: 'ol',
          items: [
            [
              { text: 'Kontaktieren Sie uns innerhalb von 14 Tagen nach Erhalt Ihrer Bestellung unter ' },
              { mailto: 'hello@terravoa.com' },
              { text: '. Geben Sie Ihre Bestellnummer und die Artikel an, die Sie zurückgeben möchten.' },
            ],
            [
              {
                text: 'Wir bestätigen Ihre Anfrage innerhalb von 2 Werktagen und senden Ihnen Rückgabeanweisungen, einschließlich Rücksendeadresse und gegebenenfalls eines vorfrankierten Versandlabels.',
              },
            ],
            [
              {
                text: 'Verpacken Sie den Artikel sicher in der Originalverpackung, sodass er während des Transports geschützt ist. Bis zum Eingang beim Produzenten tragen Sie die Verantwortung für die Ware.',
              },
            ],
            [
              {
                text: 'Senden Sie die Rückgabe innerhalb von 14 Tagen nach Ihrer Widerrufserklärung ab. Sofern wir keine Abholung angeboten haben, tragen Sie die Rücksendekosten, es sei denn, der Artikel ist mangelhaft oder falsch geliefert worden.',
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Erstattungen',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Sobald wir die zurückgesandte Ware erhalten und ihren Zustand geprüft haben, bearbeiten wir Ihre Erstattung unverzüglich, spätestens jedoch innerhalb von 14 Tagen ab Wareneingang oder ab dem Tag, an dem Sie den Nachweis der Absendung erbringen — je nachdem, welcher Zeitpunkt früher liegt.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Erstattungen erfolgen über das ursprüngliche beim Checkout verwendete Zahlungsmittel. Je nach Bank oder Zahlungsdienstleister kann es weitere 3-10 Werktage dauern, bis die Gutschrift erscheint.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Die Erstattung umfasst den vollen Preis des zurückgegebenen Produkts sowie die von Ihnen ursprünglich gezahlten Standard-Lieferkosten. Bei Wahl einer Express- oder Premiumlieferung sind wir nicht verpflichtet, die zusätzlichen Kosten zu erstatten.',
            },
          ],
        },
      ],
    },
    {
      heading: '5. Beschädigte oder falsch gelieferte Ware',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Wenn Ihre Bestellung beschädigt, fehlerhaft oder nicht vertragsgemäß geliefert wird, kontaktieren Sie uns bitte innerhalb von 48 Stunden nach Zustellung. Bitte fügen Sie Ihre Bestellnummer und aussagekräftige Fotos des Schadens oder der Abweichung bei.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'In diesen Fällen bieten wir Ihnen wahlweise eine vollständige Erstattung (einschließlich Versandkosten) oder Ersatzlieferung ohne zusätzliche Kosten an. Sofern eine Rücksendung erforderlich ist, organisieren und tragen wir die Kosten.',
            },
          ],
        },
        {
          type: 'p',
          parts: [{ text: 'Ihre gesetzlichen Rechte nach französischem und EU-Verbraucherrecht bleiben von dieser Richtlinie unberührt.' }],
        },
        {
          type: 'cta',
          title: 'Möchten Sie eine Rückgabe starten?',
          description: 'Nutzen Sie unser Rückgabeformular — wir antworten innerhalb von 2 Werktagen mit den nächsten Schritten.',
          primaryLabel: 'Rückgabe anfragen',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Alternativ E-Mail senden',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
  fr: [
    {
      heading: '1. Droit de rétractation (délai de 14 jours dans l’UE)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "En tant que consommateur au sein de l'Union européenne, vous disposez d'un droit de rétractation sans motif de 14 jours calendaires à compter du jour où vous, ou un tiers que vous avez désigné, prenez physiquement possession des biens. Ce droit est prévu par la directive 2011/83/UE relative aux droits des consommateurs, transposée en droit français.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "Pour exercer votre droit de rétractation, vous devez nous notifier votre décision par une déclaration dénuée d'ambiguïté (par exemple par courrier postal ou e-mail). Vous pouvez utiliser le modèle de formulaire ci-dessous, sans que cela soit obligatoire.",
            },
          ],
        },
        {
          type: 'box',
          title: 'Modèle de formulaire de rétractation',
          italic: true,
          parts: [
            {
              text: 'À : {companyName}, {companyAddress} — hello@terravoa.com. Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien suivant : [description du bien] / commandé le [date] / reçu le [date]. Nom du consommateur : ___________. Adresse du consommateur : ___________. Signature (uniquement en cas de formulaire papier) : ___________ Date : ___________.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Exceptions — produits périssables et personnalisés',
      blocks: [
        {
          type: 'p',
          parts: [{ text: "Le droit de rétractation ne s'applique pas aux catégories suivantes, conformément à l'article L221-28 du Code de la consommation :" }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Produits alimentaires périssables :',
              text: "Les biens susceptibles de se détériorer ou de se périmer rapidement — notamment les produits frais, les produits réfrigérés, les fromages frais et tout produit à date limite d'utilisation courte — ne peuvent pas être retournés.",
            },
            {
              strong: 'Biens scellés ouverts après livraison :',
              text: "Les produits qui ne peuvent pas être renvoyés pour des raisons d'hygiène ou de protection de la santé lorsque le scellé a été rompu après la livraison (par exemple charcuterie sous vide ou huiles de spécialité après ouverture).",
            },
            {
              strong: 'Commandes personnalisées ou sur mesure :',
              text: 'Les produits confectionnés selon vos spécifications ou nettement personnalisés.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "Les produits secs et non périssables (tels que conserves, vins et spiritueux) qui demeurent scellés et dans leur état d'origine sont éligibles au retour au titre du droit de rétractation standard de 14 jours.",
            },
          ],
        },
      ],
    },
    {
      heading: '3. Procédure de retour',
      blocks: [
        { type: 'p', parts: [{ text: 'Pour initier un retour, veuillez suivre les étapes suivantes :' }] },
        {
          type: 'ol',
          items: [
            [
              { text: 'Contactez-nous dans un délai de 14 jours après réception de votre commande à ' },
              { mailto: 'hello@terravoa.com' },
              { text: '. Indiquez votre numéro de commande ainsi que les articles que vous souhaitez retourner.' },
            ],
            [
              {
                text: "Nous accuserons réception de votre demande sous 2 jours ouvrés et vous communiquerons les instructions de retour, y compris une adresse de retour et, le cas échéant, une étiquette d'expédition prépayée.",
              },
            ],
            [
              {
                text: "Emballez l'article de manière sécurisée dans son emballage d'origine afin de le protéger pendant le transport. Vous êtes responsable des biens jusqu'à leur réception par le producteur.",
              },
            ],
            [
              {
                text: "Expédiez le retour dans les 14 jours suivant la notification de votre rétractation. Sauf si nous avons proposé de récupérer les biens, les frais de retour sont à votre charge, sauf en cas de produit défectueux ou envoyé par erreur.",
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Remboursements',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Dès réception des biens retournés et vérification de leur état, nous procéderons à votre remboursement sans retard injustifié, et au plus tard dans les 14 jours suivant la date de réception des biens ou la date à laquelle vous fournissez une preuve d'expédition, la date la plus proche étant retenue.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Les remboursements sont effectués sur le moyen de paiement initialement utilisé lors du paiement. Selon votre banque ou prestataire de paiement, un délai supplémentaire de 3 à 10 jours ouvrés peut être nécessaire pour que le crédit apparaisse sur votre relevé.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "Le remboursement inclut le prix intégral du produit retourné ainsi que les frais de livraison standard initialement payés. Nous ne sommes pas tenus de rembourser les coûts supplémentaires si vous avez choisi une livraison express ou premium.",
            },
          ],
        },
      ],
    },
    {
      heading: '5. Produits endommagés ou envoyés par erreur',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Si votre commande arrive endommagée, défectueuse ou non conforme à votre commande, veuillez nous contacter dans les 48 heures suivant la livraison. Fournissez votre numéro de commande et des photographies montrant clairement le dommage ou l'écart constaté.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "Dans ce cas, nous vous proposerons, à votre choix, un remboursement intégral (y compris les frais d'expédition) ou un remplacement, sans coût supplémentaire. Nous organiserons également le retour et en prendrons le coût à notre charge lorsque les biens doivent être renvoyés.",
            },
          ],
        },
        {
          type: 'p',
          parts: [{ text: 'Vos droits légaux au titre du droit français et du droit européen de la consommation ne sont en rien affectés par cette politique.' }],
        },
        {
          type: 'cta',
          title: 'Prêt à démarrer un retour ?',
          description: 'Utilisez notre formulaire de demande de retour — nous vous répondrons sous 2 jours ouvrés avec les étapes suivantes.',
          primaryLabel: 'Demander un retour',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Nous écrire par e-mail',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
  it: [
    {
      heading: '1. Diritto di recesso (periodo di ripensamento UE di 14 giorni)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "In qualità di consumatore nell'Unione europea, hai il diritto di recedere dall'acquisto senza fornire alcuna motivazione entro 14 giorni di calendario dal giorno in cui tu, o un terzo da te designato, acquisisci il possesso fisico dei beni. Tale diritto è previsto dalla Direttiva UE 2011/83/UE sui diritti dei consumatori, recepita nel diritto francese.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Per esercitare il diritto di recesso, devi comunicarci la tua decisione con una dichiarazione inequivocabile (ad esempio una lettera inviata per posta o un’e-mail). Puoi utilizzare il modulo tipo di recesso riportato di seguito, ma non è obbligatorio.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Modulo tipo di recesso',
          italic: true,
          parts: [
            {
              text: "A: {companyName}, {companyAddress} — hello@terravoa.com. Con la presente notifico il recesso dal mio contratto di vendita relativo ai seguenti beni: [descrizione dei beni] / ordinato il [data] / ricevuto il [data]. Nome del consumatore: ___________. Indirizzo del consumatore: ___________. Firma (solo se il modulo è su carta): ___________ Data: ___________.",
            },
          ],
        },
      ],
    },
    {
      heading: '2. Eccezioni — prodotti deperibili e personalizzati',
      blocks: [
        {
          type: 'p',
          parts: [{ text: 'Il diritto di recesso non si applica alle seguenti categorie, ai sensi dell’art. L221-28 del Codice del consumo francese:' }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Prodotti alimentari deperibili:',
              text: "I beni soggetti a deterioramento o scadenza rapida — compresi prodotti freschi, articoli refrigerati, formaggi freschi e qualsiasi prodotto con breve termine di conservazione — non possono essere restituiti.",
            },
            {
              strong: 'Beni sigillati aperti dopo la consegna:',
              text: "Prodotti non idonei alla restituzione per motivi igienico-sanitari quando il sigillo è stato rimosso dopo la consegna (ad esempio salumi sottovuoto o oli speciali una volta aperti).",
            },
            {
              strong: 'Ordini personalizzati o su misura:',
              text: 'Prodotti realizzati secondo le tue specifiche o chiaramente personalizzati.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "I prodotti secchi e non deperibili (come conserve, vini e distillati) che restano sigillati e nelle condizioni originali sono idonei alla restituzione nell'ambito del diritto di recesso standard di 14 giorni.",
            },
          ],
        },
      ],
    },
    {
      heading: '3. Procedura di reso',
      blocks: [
        { type: 'p', parts: [{ text: 'Per avviare un reso, segui questi passaggi:' }] },
        {
          type: 'ol',
          items: [
            [
              { text: "Contattaci all'indirizzo " },
              { mailto: 'hello@terravoa.com' },
              { text: " entro 14 giorni dalla ricezione dell'ordine. Includi il numero d'ordine e gli articoli che desideri restituire." },
            ],
            [
              {
                text: "Confermeremo la ricezione della tua richiesta entro 2 giorni lavorativi e ti forniremo le istruzioni per il reso, compreso un indirizzo di restituzione e, ove applicabile, un'etichetta di spedizione prepagata.",
              },
            ],
            [
              {
                text: "Imballa l'articolo in modo sicuro nella confezione originale, assicurandoti che sia protetto durante il trasporto. Sei responsabile dei beni fino alla loro ricezione da parte del produttore.",
              },
            ],
            [
              {
                text: "Spedisci il reso entro 14 giorni dalla comunicazione del recesso. Salvo nostra offerta di ritiro dei beni, i costi di spedizione del reso sono a tuo carico, salvo che l'articolo sia difettoso o inviato erroneamente.",
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Rimborsi',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Una volta ricevuti i beni restituiti e verificatone lo stato, elaboreremo il rimborso senza indebito ritardo e comunque non oltre 14 giorni dalla data di ricezione dei beni o dalla data in cui fornisci prova di averli spediti, se anteriore.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'I rimborsi vengono effettuati sul metodo di pagamento originale utilizzato al checkout. A seconda della banca o del fornitore di pagamento, possono essere necessari ulteriori 3-10 giorni lavorativi perché il credito compaia sull’estratto conto.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: "Il rimborso include il prezzo pieno del prodotto restituito e i costi standard di consegna inizialmente pagati. Non siamo tenuti a rimborsare costi supplementari se hai scelto un'opzione di consegna espressa o premium.",
            },
          ],
        },
      ],
    },
    {
      heading: '5. Merci danneggiate o inviate in modo errato',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: "Se il tuo ordine arriva danneggiato, difettoso o non corrispondente a quanto ordinato, contattaci entro 48 ore dalla consegna. Fornisci il numero d'ordine e fotografie che mostrino chiaramente il danno o la discrepanza.",
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'In tali casi ti offriremo la scelta tra rimborso completo (inclusi eventuali costi di spedizione) o sostituzione, senza costi aggiuntivi. Organizzeremo inoltre il ritiro o il reso e ne copriremo i costi quando i beni dovranno essere restituiti.',
            },
          ],
        },
        {
          type: 'p',
          parts: [{ text: 'I tuoi diritti legali previsti dal diritto dei consumatori francese e dell’UE non sono pregiudicati da alcuna disposizione della presente politica.' }],
        },
        {
          type: 'cta',
          title: 'Pronto ad avviare un reso?',
          description: 'Usa il nostro modulo di richiesta reso — ti risponderemo entro 2 giorni lavorativi con i prossimi passaggi.',
          primaryLabel: 'Richiedi un reso',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Scrivici via e-mail',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
  es: [
    {
      heading: '1. Derecho de desistimiento (periodo de reflexión de 14 días en la UE)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Como consumidor dentro de la Unión Europea, tiene derecho a desistir de su compra sin indicar ningún motivo dentro de los 14 días naturales siguientes al día en que usted, o un tercero designado por usted, adquiera la posesión material de los bienes. Este derecho está previsto por la Directiva 2011/83/UE sobre derechos de los consumidores, transpuesta al derecho francés.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Para ejercer su derecho de desistimiento, debe informarnos de su decisión mediante una declaración inequívoca (por ejemplo, una carta enviada por correo postal o un correo electrónico). Puede utilizar el modelo de formulario de desistimiento que figura a continuación, pero no es obligatorio.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Modelo de formulario de desistimiento',
          italic: true,
          parts: [
            {
              text: 'A: {companyName}, {companyAddress} — hello@terravoa.com. Por la presente le comunico que desisto de mi contrato de compraventa de los siguientes bienes: [descripción de los bienes] / pedido el [fecha] / recibido el [fecha]. Nombre del consumidor: ___________. Dirección del consumidor: ___________. Firma (si se presenta en papel): ___________ Fecha: ___________.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Excepciones — productos perecederos y personalizados',
      blocks: [
        {
          type: 'p',
          parts: [{ text: 'El derecho de desistimiento no se aplica a las siguientes categorías, de conformidad con el art. L221-28 del Código de Consumo francés:' }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Productos alimentarios perecederos:',
              text: 'Los bienes susceptibles de deteriorarse o caducar rápidamente —incluidos productos frescos, refrigerados, quesos frescos y cualquier producto con fecha de consumo corta— no pueden devolverse.',
            },
            {
              strong: 'Bienes sellados abiertos tras la entrega:',
              text: 'Productos no aptos para devolución por razones de protección de la salud o higiene cuando el precinto se ha roto después de la entrega (por ejemplo, embutidos al vacío o aceites especiales una vez abiertos).',
            },
            {
              strong: 'Pedidos personalizados o a medida:',
              text: 'Productos fabricados conforme a sus especificaciones o claramente personalizados.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Los productos secos y no perecederos (como conservas, vinos y licores) que permanezcan sellados y en su estado original pueden devolverse conforme al derecho estándar de desistimiento de 14 días.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. Proceso de devolución',
      blocks: [
        { type: 'p', parts: [{ text: 'Para iniciar una devolución, siga estos pasos:' }] },
        {
          type: 'ol',
          items: [
            [
              { text: 'Contáctenos en ' },
              { mailto: 'hello@terravoa.com' },
              { text: ' dentro de los 14 días siguientes a la recepción de su pedido. Incluya su número de pedido y los artículos que desea devolver.' },
            ],
            [
              {
                text: 'Confirmaremos su solicitud en un plazo de 2 días laborables y le facilitaremos instrucciones de devolución, incluida una dirección de devolución y, cuando corresponda, una etiqueta de envío prepagada.',
              },
            ],
            [
              {
                text: 'Embale el artículo de forma segura en su embalaje original, asegurando su protección durante el transporte. Usted es responsable de los bienes hasta que sean recibidos por el productor.',
              },
            ],
            [
              {
                text: 'Envíe la devolución en un plazo de 14 días desde que nos notificó su desistimiento. Salvo que hayamos ofrecido recoger los bienes, el coste del envío de devolución corre por su cuenta, excepto si el artículo es defectuoso o se envió incorrectamente.',
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Reembolsos',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Una vez recibidos los bienes devueltos y verificado su estado, tramitaremos su reembolso sin demora indebida y, en todo caso, a más tardar en 14 días desde la fecha en que recibamos los bienes o desde la fecha en que nos aporte prueba del envío, lo que ocurra primero.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Los reembolsos se efectuarán al método de pago original utilizado en el checkout. Dependiendo de su banco o proveedor de pago, el abono puede tardar entre 3 y 10 días laborables adicionales en reflejarse en su extracto.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'El reembolso incluirá el precio íntegro del producto devuelto y los gastos de entrega estándar que pagó originalmente. No estamos obligados a reembolsar costes suplementarios si eligió una opción de entrega exprés o premium.',
            },
          ],
        },
      ],
    },
    {
      heading: '5. Bienes dañados o enviados incorrectamente',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Si su pedido llega dañado, defectuoso o no coincide con lo solicitado, contáctenos en las 48 horas siguientes a la entrega. Facilite su número de pedido y fotografías que muestren claramente el daño o la discrepancia.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'En tales casos, le ofreceremos elegir entre un reembolso completo (incluidos los gastos de envío) o una sustitución, sin coste adicional para usted. También organizaremos y asumiremos el coste del envío de devolución cuando los bienes deban devolverse.',
            },
          ],
        },
        {
          type: 'p',
          parts: [{ text: 'Sus derechos legales en virtud de la normativa francesa y de la UE de protección de consumidores no se ven afectados por ninguna disposición de esta política.' }],
        },
        {
          type: 'cta',
          title: '¿Listo para iniciar una devolución?',
          description: 'Use nuestro formulario de solicitud de devolución — le responderemos en 2 días laborables con los siguientes pasos.',
          primaryLabel: 'Solicitar una devolución',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Escribirnos por correo',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
  pt: [
    {
      heading: '1. Direito de livre resolução (período de reflexão de 14 dias na UE)',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Enquanto consumidor na União Europeia, tem o direito de resolver a sua compra sem indicar qualquer motivo no prazo de 14 dias de calendário a contar do dia em que você, ou um terceiro por si indicado, adquire a posse física dos bens. Este direito está previsto na Diretiva 2011/83/UE relativa aos direitos dos consumidores, transposta para o direito francês.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Para exercer o seu direito de livre resolução, deve informar-nos da sua decisão através de uma declaração inequívoca (por exemplo, carta enviada por correio ou e-mail). Pode utilizar o formulário-modelo de resolução abaixo, mas tal não é obrigatório.',
            },
          ],
        },
        {
          type: 'box',
          title: 'Formulário-modelo de livre resolução',
          italic: true,
          parts: [
            {
              text: 'Para: {companyName}, {companyAddress} — hello@terravoa.com. Venho por este meio comunicar que resolvo o meu contrato de compra e venda relativo aos seguintes bens: [descrição dos bens] / encomendado em [data] / recebido em [data]. Nome do consumidor: ___________. Endereço do consumidor: ___________. Assinatura (se em papel): ___________ Data: ___________.',
            },
          ],
        },
      ],
    },
    {
      heading: '2. Exceções — produtos perecíveis e personalizados',
      blocks: [
        {
          type: 'p',
          parts: [{ text: 'O direito de livre resolução não se aplica às seguintes categorias, de acordo com o art. L221-28 do Código do Consumo francês:' }],
        },
        {
          type: 'ul',
          items: [
            {
              strong: 'Produtos alimentares perecíveis:',
              text: 'Bens suscetíveis de deterioração ou caducidade rápida — incluindo produtos frescos, refrigerados, queijo fresco e qualquer produto com prazo de consumo curto — não podem ser devolvidos.',
            },
            {
              strong: 'Bens selados abertos após a entrega:',
              text: 'Produtos que não sejam adequados para devolução por motivos de proteção da saúde ou higiene quando o selo tenha sido quebrado após a entrega (por exemplo, charcutaria embalada a vácuo ou óleos especiais após abertura).',
            },
            {
              strong: 'Encomendas personalizadas ou por medida:',
              text: 'Produtos fabricados segundo as suas especificações ou claramente personalizados.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Produtos secos e não perecíveis (como conservas, vinhos e bebidas espirituosas) que permaneçam selados e em estado original são elegíveis para devolução ao abrigo do direito padrão de livre resolução de 14 dias.',
            },
          ],
        },
      ],
    },
    {
      heading: '3. Processo de devolução',
      blocks: [
        { type: 'p', parts: [{ text: 'Para iniciar uma devolução, siga estes passos:' }] },
        {
          type: 'ol',
          items: [
            [
              { text: 'Contacte-nos em ' },
              { mailto: 'hello@terravoa.com' },
              { text: ' no prazo de 14 dias após receber a sua encomenda. Inclua o seu número de encomenda e os artigos que pretende devolver.' },
            ],
            [
              {
                text: 'Acusaremos a receção do seu pedido no prazo de 2 dias úteis e forneceremos instruções de devolução, incluindo endereço de devolução e, quando aplicável, etiqueta de envio pré-paga.',
              },
            ],
            [
              {
                text: 'Embale o artigo com segurança na embalagem original, garantindo proteção durante o transporte. É responsável pelos bens até serem recebidos pelo produtor.',
              },
            ],
            [
              {
                text: 'Envie a devolução no prazo de 14 dias após nos notificar da resolução. Salvo se tivermos oferecido recolha dos bens, os custos de devolução são suportados por si, exceto se o artigo estiver defeituoso ou tiver sido enviado incorretamente.',
              },
            ],
          ],
        },
      ],
    },
    {
      heading: '4. Reembolsos',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Após recebermos os bens devolvidos e verificarmos o seu estado, processaremos o seu reembolso sem demora injustificada e, no máximo, até 14 dias a contar da data em que recebemos os bens de volta ou da data em que apresentar prova de envio, consoante a que ocorrer primeiro.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Os reembolsos são efetuados para o método de pagamento original utilizado no checkout. Dependendo do seu banco ou prestador de pagamentos, o crédito poderá demorar mais 3 a 10 dias úteis a surgir no extrato.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'O reembolso incluirá o preço integral do produto devolvido e os custos de entrega padrão originalmente pagos. Não somos obrigados a reembolsar custos suplementares se tiver escolhido uma opção de entrega expresso ou premium.',
            },
          ],
        },
      ],
    },
    {
      heading: '5. Bens danificados ou enviados incorretamente',
      blocks: [
        {
          type: 'p',
          parts: [
            {
              text: 'Se a sua encomenda chegar danificada, defeituosa ou não corresponder ao que encomendou, contacte-nos no prazo de 48 horas após a entrega. Forneça o número da encomenda e fotografias que mostrem claramente o dano ou a discrepância.',
            },
          ],
        },
        {
          type: 'p',
          parts: [
            {
              text: 'Nestes casos, ofereceremos a escolha entre reembolso integral (incluindo quaisquer custos de envio) ou substituição, sem custos adicionais para si. Também organizaremos e suportaremos os custos de devolução quando os bens tiverem de ser devolvidos.',
            },
          ],
        },
        {
          type: 'p',
          parts: [{ text: 'Os seus direitos legais ao abrigo do direito francês e europeu de defesa do consumidor não são afetados por qualquer disposição desta política.' }],
        },
        {
          type: 'cta',
          title: 'Pronto para iniciar uma devolução?',
          description: 'Utilize o nosso formulário de pedido de devolução — responderemos em 2 dias úteis com os próximos passos.',
          primaryLabel: 'Pedir devolução',
          primaryHref: '/account/returns/new',
          secondaryLabel: 'Enviar e-mail',
          secondaryHref: 'mailto:hello@terravoa.com',
        },
      ],
    },
  ],
}
