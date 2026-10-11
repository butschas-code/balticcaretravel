/** German SEO, comparison, and answer pages. Edit here, then run node scripts/build-seo.mjs. */

const fee = 'Die Koordination kostet einmalig 250 € und ist nicht erstattungsfähig.';

export const guides = [
  {
    id: 'ratgeber',
    file: 'ratgeber.html',
    kind: 'hub',
    title: 'Ratgeber: Zahnbehandlung in Lettland | Baltic Care Travel',
    description:
      'Ratgeber für Patienten aus Deutschland: Zahnimplantate, Zahnersatz, All-on-4, Veneers und Kosten in Lettland. Koordination durch Baltic Care Travel.',
    h1: 'Ratgeber zur Zahnbehandlung in Lettland',
    eyebrow: 'Überblick',
    subtitle: 'Konkrete Antworten zu Implantaten, Zahnersatz und Kosten — ohne die Klinik zu ersetzen.',
    image: '/images/home-hero.jpg',
    mast: 'images/home-hero.jpg',
    priority: '0.8',
    answer:
      'Baltic Care Travel koordiniert Zahnbehandlungen in Lettland für Patientinnen und Patienten aus Deutschland: Implantate, Zahnersatz, All-on-4 und Veneers. Wir sind keine Klinik. Die Koordination kostet 250 € einmalig, die Behandlung rechnen Sie direkt mit der Klinik ab.',
    facts: [
      ['Aktuelles Angebot', 'Zahnmedizin'],
      ['Koordinationsgebühr', '250 € einmalig'],
      ['Behandlungsvertrag', 'Direkt mit der Klinik'],
      ['Für wen', 'Patienten aus Deutschland'],
    ],
    sections: [
      {
        id: 'so-lesen',
        h2: 'Wie diese Seiten zu lesen sind',
        paragraphs: [
          'Jede Seite beantwortet eine Frage, die Patientinnen und Patienten vor einer Behandlung in Lettland tatsächlich stellen: Was kostet ein Implantat, was bedeutet All-on-4, und worin unterscheidet sich Lettland von einer Behandlung in Deutschland?',
          'Die Euro-Beträge sind Orientierungswerte, keine Angebote. Sie stehen gesammelt auf der <a href="prices.html">Preisseite</a>. Ob ein Weg medizinisch sinnvoll ist, entscheidet ausschließlich die Klinik.',
        ],
      },
      {
        id: 'nicht',
        h2: 'Was Baltic Care Travel nicht ist',
        paragraphs: [
          'Wir sind kein Klinikverbund und stellen keine Diagnosen. Wir ordnen Ihre Anfrage ein, sammeln Unterlagen, sprechen mit passenden Kliniken in Lettland und halten die Kommunikation auf Deutsch zusammen.',
          'Kinderwunsch / IVF und Orthopädie sind angekündigt, aber noch nicht buchbar. Wer heute eine Zahnbehandlung prüfen lassen möchte, startet mit einem <a href="contact.html">kostenfreien Erstgespräch</a>.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Welche Behandlungen koordiniert Baltic Care Travel heute?',
        a: 'Zahnbehandlungen in Lettland, insbesondere Implantate, Zahnersatz, All-on-4 bzw. All-on-6 und Veneers. Kinderwunsch / IVF und Orthopädie sind in Vorbereitung.',
      },
      {
        q: 'Sind Sie eine Zahnklinik in Riga?',
        a: 'Nein. Baltic Care Travel ist die koordinierende Stelle. Den Behandlungsvertrag schließen Sie mit der Klinik, und dorthin zahlen Sie auch die Behandlung.',
      },
      {
        q: 'Was kostet die Begleitung?',
        a: fee + ' Medizinische Leistungen sind darin nicht enthalten.',
      },
    ],
  },
  {
    id: 'zahnimplantate-lettland',
    file: 'zahnimplantate-lettland.html',
    title: 'Zahnimplantate in Lettland | Baltic Care Travel',
    description:
      'Zahnimplantate in Lettland: Orientierung 1.420–1.710 € inklusive Aufbau und Krone, in Deutschland oft 2.500–4.000 €. Koordination 250 €, Angebot von der Klinik.',
    h1: 'Zahnimplantate in Lettland',
    eyebrow: 'Implantate',
    subtitle: 'Orientierung für Patientinnen und Patienten aus Deutschland mit hohem Eigenanteil.',
    image: '/images/dental.jpg',
    mast: 'images/dental.jpg',
    priority: '0.9',
    service: true,
    answer:
      'Ein Einzelimplantat inklusive Aufbau und Krone liegt bei den Partnerkliniken orientierend bei 1.420–1.710 €, typische Vergleichswerte in Deutschland bei 2.500–4.000 €. Baltic Care Travel koordiniert den Weg für einmalig 250 €. Das verbindliche Angebot stellt die Klinik.',
    facts: [
      ['Einzelimplantat inkl. Krone, Lettland', '1.420–1.710 €'],
      ['Typischer Vergleich Deutschland', '2.500–4.000 €'],
      ['4 Implantate inkl. Kronen, Lettland', '5.680–6.840 €'],
      ['Koordination', '250 € einmalig'],
    ],
    table: {
      caption: 'Orientierungswerte Zahnimplantate. Quelle: Preisseite von Baltic Care Travel.',
      rows: [
        ['Einzelimplantat inkl. Aufbau und Krone', '1.420–1.710 €', '2.500–4.000 €', 'bis zu 2.580 €'],
        ['4 Implantate inkl. Kronen', '5.680–6.840 €', '10.000–16.000 €', 'bis zu 10.320 €'],
      ],
    },
    sections: [
      {
        id: 'was-kostet',
        h2: 'Was kostet ein Zahnimplantat in Lettland?',
        paragraphs: [
          'Der genannte Rahmen von 1.420–1.710 € gilt für ein Einzelimplantat inklusive Aufbau und Krone, nicht für die Schraube allein. Vier Implantate inklusive Kronen liegen orientierend bei 5.680–6.840 €. Die Spanne „bis zu 2.580 €“ ist die Differenz zwischen 1.420 € und einem typischen oberen Vergleichswert von 4.000 € in Deutschland. Sie ist keine garantierte Ersparnis.',
          'Knochenaufbau, anderes Material, mehr Termine oder ein anderer Befund verändern den Preis. Deshalb ist jede Zahl auf dieser Seite eine Orientierung aus <a href="prices.html">unserer Preistabelle</a>, kein Kostenvoranschlag.',
        ],
      },
      {
        id: 'fuer-wen',
        h2: 'Für wen eine Koordination sinnvoll sein kann',
        paragraphs: [
          'Interessant ist der Weg vor allem, wenn der Eigenanteil in Deutschland hoch ist: ein einzelnes Implantat, mehrere Implantate oder eine größere Versorgung. Wer nur den niedrigsten Listenpreis sucht, ist bei uns falsch. Wir arbeiten mit wenigen Kliniken und legen die Kommunikation auf Deutsch aus.',
          'Ob ein Implantat in Ihrem Fall überhaupt infrage kommt, entscheidet die Klinik nach Befund. Wir können Unterlagen wie Röntgenbilder oder Arztbriefe bündeln, damit diese Einschätzung nicht im E-Mail-Chaos hängen bleibt.',
        ],
      },
      {
        id: 'nicht-enthalten',
        h2: 'Was im Orientierungspreis nicht enthalten ist',
        paragraphs: [
          'Nicht enthalten sind die Koordination von 250 €, Flug, Unterkunft, Verpflegung und Klinikleistungen, die der Plan extra ausweist. Dazu kann Knochenaufbau gehören, ein Provisorium oder eine weitere Sitzung nach der Einheilzeit.',
          'Die gesetzliche oder private Krankenversicherung ersetzt die Koordinationsgebühr nicht. Ob sie Anteile der zahnärztlichen Behandlung übernimmt, klären Sie mit Ihrer Versicherung und der Klinik. Wir stellen keine Kassenanträge.',
        ],
      },
      {
        id: 'ablauf',
        h2: 'Wie die Anfrage abläuft',
        paragraphs: [
          'Sie schildern Ihr Anliegen im <a href="contact.html">Erstgespräch</a> oder über das Formular. Wir prüfen, ob eine Koordination sinnvoll ist, erfassen Unterlagen und holen bei passenden Kliniken eine Rückmeldung ein. Wie viele Aufenthalte in Lettland nötig sind, steht erst im Behandlungsplan.',
          'Den Ablauf im Detail beschreibt <a href="how-it-works.html">So funktioniert es</a>. Die Behandlung selbst findet in der Klinik statt, in der Regel in Riga. Mehr zum Ort: <a href="zahnarzt-riga.html">Zahnarzt in Riga</a>.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Ist die Krone im Preis für ein Zahnimplantat in Lettland enthalten?',
        a: 'In unserer Orientierung von 1.420–1.710 € ja: Einzelimplantat inklusive Aufbau und Krone. Ein verbindliches Angebot kann je nach Material und Befund davon abweichen.',
      },
      {
        q: 'Wer stellt das Angebot für das Implantat?',
        a: 'Die Klinik in Lettland. Baltic Care Travel nimmt kein Geld für die medizinische Leistung entgegen und ist nicht Vertragspartner der Behandlung.',
      },
      {
        q: 'Was kostet Baltic Care Travel bei Zahnimplantaten?',
        a: fee + ' Darin liegen Einordnung, deutschsprachige Kommunikation, Unterlagen, Klinik-Matching und die Koordination von Rückfragen.',
      },
      {
        q: 'Wie viele Reisen nach Lettland sind für ein Implantat nötig?',
        a: 'Das legt der Behandlungsplan der Klinik fest. Einheilzeit und prothetische Schritte können mehrere Termine bedeuten. Wir nennen keine pauschale Anzahl an Reisen.',
      },
    ],
    related: ['zahnersatz-lettland', 'all-on-4-lettland', 'vergleich-zahnimplantate-deutschland-lettland', 'zahnarzt-riga'],
  },
  {
    id: 'zahnersatz-lettland',
    file: 'zahnersatz-lettland.html',
    title: 'Zahnersatz in Lettland: Kronen und Brücken | Baltic Care Travel',
    description:
      'Zahnersatz in Lettland: Kronen, Brücken und implantatgetragene Versorgung. Vier Implantate inkl. Kronen orientierend 5.680–6.840 €. Koordination durch Baltic Care Travel.',
    h1: 'Zahnersatz in Lettland',
    eyebrow: 'Kronen, Brücken, Implantate',
    subtitle: 'Wenn mehrere Zähne ersetzt werden sollen und der Eigenanteil in Deutschland schwer wiegt.',
    image: '/images/dental.jpg',
    mast: 'images/dental.jpg',
    priority: '0.8',
    service: true,
    answer:
      'Zahnersatz in Lettland umfasst bei uns vor allem Kronen, Brücken und implantatgetragenen Zahnersatz. Für vier Implantate inklusive Kronen liegen die Orientierungswerte bei 5.680–6.840 €, in Deutschland typischerweise bei 10.000–16.000 €. Den Behandlungsvertrag schließen Sie mit der Klinik.',
    facts: [
      ['4 Implantate inkl. Kronen, Lettland', '5.680–6.840 €'],
      ['Typischer Vergleich Deutschland', '10.000–16.000 €'],
      ['Einzelne Krone als Festpreis', 'Nicht veröffentlicht'],
      ['Koordination', '250 € einmalig'],
    ],
    table: {
      caption: 'Orientierung für implantatgetragenen Zahnersatz. Eine einzelne Krone ohne Implantat weisen wir nicht als Festpreis aus.',
      rows: [
        ['Einzelimplantat inkl. Aufbau und Krone', '1.420–1.710 €', '2.500–4.000 €', 'bis zu 2.580 €'],
        ['4 Implantate inkl. Kronen', '5.680–6.840 €', '10.000–16.000 €', 'bis zu 10.320 €'],
      ],
    },
    sections: [
      {
        id: 'was-gemeint',
        h2: 'Welchen Zahnersatz diese Seite meint',
        paragraphs: [
          'Gemeint sind festsitzende Versorgungen: Kronen, Brücken und Zähne, die auf Implantaten sitzen. Eine einzelne Krone ohne Implantat haben wir bewusst nicht mit einem eigenen Preis versehen. Diesen Betrag legt die Klinik im Angebot fest, abhängig von Material und Präparation.',
          'Für einen ganzen Kiefer auf vier oder sechs Implantaten gibt es eigene Orientierungswerte auf der Seite <a href="all-on-4-lettland.html">All-on-4 in Lettland</a>. Veneers, also Verblendschalen, stehen unter <a href="veneers-lettland.html">Veneers in Lettland</a>.',
        ],
      },
      {
        id: 'kosten',
        h2: 'Was vier Implantate mit Kronen kosten können',
        paragraphs: [
          '5.680–6.840 € ist der Orientierungsrahmen unserer Partner für vier Implantate inklusive Kronen. Typische Vergleichswerte in Deutschland liegen bei 10.000–16.000 €. „Bis zu 10.320 €“ ist die Differenz zwischen 5.680 € und 16.000 €, also zwischen dem unteren Wert in Lettland und dem oberen Vergleichswert in Deutschland.',
          'Liegt Ihr Heil- und Kostenplan in Deutschland darunter, oder braucht der Fall in Lettland Knochenaufbau, wird die Differenz kleiner. Die vollständige Tabelle steht bei den <a href="prices.html">Preisen</a>.',
        ],
      },
      {
        id: 'ablauf',
        h2: 'Warum größere Versorgungen Koordination brauchen',
        paragraphs: [
          'Bei mehreren Kronen oder Brücken entstehen schnell Rückfragen zu Unterlagen, Terminen und was das Labor wann liefern kann. Genau diese organisatorische Strecke übernehmen wir auf Deutsch, vom ersten Gespräch bis zur Abstimmung mit der Klinik.',
          'Die medizinische Planung — welches Material, welche Zähne, ob eine Brücke oder Implantate — bleibt bei der Klinik. Wir geben dazu keine Empfehlung ab.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Was kostet eine Zahnkrone in Lettland?',
        a: 'Einen Einzelpreis nur für eine Krone veröffentlichen wir nicht. Ausgewiesen ist ein Einzelimplantat inklusive Aufbau und Krone mit 1.420–1.710 €. Eine Krone ohne Implantat bietet die Klinik individuell an.',
      },
      {
        q: 'Ist eine Brücke günstiger als Implantate?',
        a: 'Das lässt sich nicht pauschal sagen. Die Klinik entscheidet nach Befund, welche Versorgung tragfähig ist. Wir stellen danach die Angebote gegenüber, statt eine Methode zu empfehlen.',
      },
      {
        q: 'Kann ich einen vorhandenen Heil- und Kostenplan schicken?',
        a: 'Ja. Ein Plan, Röntgenbilder oder ein Arztbrief helfen der Klinik, den Umfang einzuordnen. Das Erstgespräch bleibt kostenfrei, die Koordination danach kostet 250 € einmalig.',
      },
    ],
    related: ['zahnimplantate-lettland', 'all-on-4-lettland', 'veneers-lettland', 'vergleich-zahnimplantate-deutschland-lettland'],
  },
  {
    id: 'all-on-4-lettland',
    file: 'all-on-4-lettland.html',
    title: 'All-on-4 in Lettland | Baltic Care Travel',
    description:
      'All-on-4 in Lettland: Zirkon für einen Kiefer orientierend 8.500–11.000 €, All-on-6 9.000–12.000 €. Ob die Methode passt, entscheidet die Klinik.',
    h1: 'All-on-4 in Lettland',
    eyebrow: 'Festsitzender Zahnersatz',
    subtitle: 'Orientierung für einen Kiefer auf vier oder sechs Implantaten — die Indikation stellt die Klinik.',
    image: '/images/dental.jpg',
    mast: 'images/dental.jpg',
    priority: '0.9',
    service: true,
    answer:
      'All-on-4 Zirkon für einen Kiefer liegt orientierend bei 8.500–11.000 €, All-on-6 Zirkon bei 9.000–12.000 €. In Deutschland liegen typische Vergleichsspannen bei 15.000–25.000 € bzw. 18.000–30.000 €. Ob die Methode passt, entscheidet die Klinik.',
    facts: [
      ['All-on-4 Zirkon, 1 Kiefer', '8.500–11.000 €'],
      ['Vergleich Deutschland All-on-4', '15.000–25.000 €'],
      ['All-on-6 Zirkon, 1 Kiefer', '9.000–12.000 €'],
      ['Vergleich Deutschland All-on-6', '18.000–30.000 €'],
    ],
    table: {
      caption: 'Orientierung All-on-4 und All-on-6, jeweils ein Kiefer, Zirkon.',
      rows: [
        ['All-on-4 Zirkon, 1 Kiefer', '8.500–11.000 €', '15.000–25.000 €', 'bis zu 16.500 €'],
        ['All-on-6 Zirkon, 1 Kiefer', '9.000–12.000 €', '18.000–30.000 €', 'bis zu 21.000 €'],
      ],
    },
    sections: [
      {
        id: 'bedeutung',
        h2: 'Was All-on-4 und All-on-6 bedeuten',
        paragraphs: [
          'All-on-4 bezeichnet festsitzenden Zahnersatz, der auf vier Implantaten pro Kiefer verankert wird. All-on-6 nutzt sechs Implantate. Unsere Orientierungswerte gelten für eine Zirkon-Versorgung eines Kiefers, nicht automatisch für Ober- und Unterkiefer zusammen.',
          'Ob vier oder sechs Implantate medizinisch tragen, und ob die Versorgung sofort oder nach einer Einheilzeit eingesetzt wird, ist eine klinische Entscheidung. Wir beschreiben den organisatorischen Rahmen, nicht das Operationsprotokoll.',
        ],
      },
      {
        id: 'kosten',
        h2: 'Was die Spannen „bis zu“ bedeuten',
        paragraphs: [
          '„Bis zu 16.500 €“ bei All-on-4 ist 25.000 € minus 8.500 €: oberer typischer Vergleichswert in Deutschland minus unterer Orientierungswert in Lettland. „Bis zu 21.000 €“ bei All-on-6 entsteht analog aus 30.000 € und 9.000 €. Beide Zahlen sind keine Zusagen.',
          'Ein zweiter Kiefer, ein Provisorium oder Knochenaufbau stehen in dieser Zeile nicht drin. Sie erscheinen, wenn die Klinik sie im Plan braucht. Die Quelle der Tabelle ist unsere <a href="prices.html">Preisseite</a>.',
        ],
      },
      {
        id: 'eignung',
        h2: 'Für wen der Vergleich überhaupt relevant ist',
        paragraphs: [
          'All-on-4 wird meist geprüft, wenn viele Zähne eines Kiefers fehlen oder nicht haltbar sind und eine herausnehmbare Prothese nicht das Ziel ist. Der Eigenanteil solcher Versorgungen ist in Deutschland oft fünfstellig. Genau dann lohnt es sich, eine zweite klinische Einschätzung in der EU einzuholen — nicht, um eine Diagnose zu überspringen.',
          'Einzelne Implantate und klassischer Zahnersatz sind ein anderer Weg. Dafür gibt es <a href="zahnimplantate-lettland.html">Zahnimplantate in Lettland</a> und <a href="zahnersatz-lettland.html">Zahnersatz in Lettland</a>.',
        ],
      },
      {
        id: 'reise',
        h2: 'Reise und mehrere Termine',
        paragraphs: [
          'Eine Versorgung über einen ganzen Kiefer braucht oft mehr als einen Aufenthalt. Wie die Termine liegen, sagt der Plan der Klinik. Wir koordinieren die Abfolge und, wenn Sie das wünschen, später auch organisatorische Dinge wie Transfer oder Unterkunft. Diese Concierge-Leistungen sind nicht in den 250 € enthalten.',
          'Riga ist aus Deutschland in etwa zwei Stunden Flug erreichbar. Mehr zum Standort: <a href="zahnarzt-riga.html">Zahnarzt in Riga</a>.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Was kostet All-on-4 in Lettland?',
        a: 'Für All-on-4 Zirkon, ein Kiefer, liegen die Orientierungswerte bei 8.500–11.000 €. All-on-6 Zirkon, ein Kiefer, bei 9.000–12.000 €. Das verbindliche Angebot erstellt die Klinik.',
      },
      {
        q: 'Gilt der Preis für beide Kiefer?',
        a: 'Nein. Die ausgewiesenen Spannen gelten für einen Kiefer. Zwei Kiefer sind ein anderer Plan und ein anderes Angebot.',
      },
      {
        q: 'Entscheiden Sie, ob All-on-4 für mich geeignet ist?',
        a: 'Nein. Die Eignung beurteilt die behandelnde Klinik. Wir koordinieren Unterlagen und Rückfragen, damit Sie diese Einschätzung nachvollziehbar bekommen.',
      },
      {
        q: 'Ist die Koordination in den 8.500 € enthalten?',
        a: 'Nein. Die 250 € Koordinationsgebühr kommt dazu und wird nicht von der Krankenversicherung erstattet. Die Behandlung zahlen Sie an die Klinik.',
      },
    ],
    related: ['zahnimplantate-lettland', 'zahnersatz-lettland', 'vergleich-zahnimplantate-deutschland-lettland', 'zahnarzt-riga'],
  },
  {
    id: 'veneers-lettland',
    file: 'veneers-lettland.html',
    title: 'Veneers in Lettland | Baltic Care Travel',
    description:
      'Veneers in Lettland: acht Keramikveneers orientierend ab 4.800 €, in Deutschland typisch 8.000–12.000 €. Anzahl und Eignung entscheidet die Klinik.',
    h1: 'Veneers in Lettland',
    eyebrow: 'Ästhetische Zahnmedizin',
    subtitle: 'Ein Smile Makeover ist ein klinischer Plan, kein Katalogprodukt.',
    image: '/images/dental.jpg',
    mast: 'images/dental.jpg',
    priority: '0.8',
    service: true,
    answer:
      'Ein Smile Makeover mit acht Keramikveneers beginnt bei den Partnerkliniken orientierend ab 4.800 €. Typische Vergleichswerte in Deutschland liegen bei 8.000–12.000 €. Wie viele Veneers sinnvoll sind, entscheidet die Klinik.',
    facts: [
      ['8 Keramikveneers, Lettland', 'ab 4.800 €'],
      ['Typischer Vergleich Deutschland', '8.000–12.000 €'],
      ['Ausgewiesene Differenz', 'ab ca. 3.200 €'],
      ['Koordination', '250 € einmalig'],
    ],
    table: {
      caption: 'Orientierung Veneers. „Ab“ heißt: der untere Partnerrahmen, nicht ein Festpreis für jeden Fall.',
      rows: [
        ['Smile Makeover mit 8 Keramikveneers', 'ab 4.800 €', '8.000–12.000 €', 'ab ca. 3.200 €'],
      ],
    },
    sections: [
      {
        id: 'kosten',
        h2: 'Was acht Keramikveneers in Lettland kosten können',
        paragraphs: [
          'Ab 4.800 € ist der untere Orientierungswert unserer Partner für acht Keramikveneers. In Deutschland liegen typische Vergleichswerte für denselben Umfang bei 8.000–12.000 €. „Ab ca. 3.200 €“ ist 8.000 minus 4.800, also der Abstand zum unteren deutschen Vergleichswert. Nach oben wird die Lücke größer, wenn der deutsche Plan bei 12.000 € liegt und der Plan in Lettland bei 4.800 € bleibt.',
          'Weniger als acht Zähne, ein anderes Material oder Vorbehandlungen verändern die Summe. Die Zeile steht auch in der <a href="prices.html">Preistabelle</a>.',
        ],
      },
      {
        id: 'eignung',
        h2: 'Wann Veneers nicht der erste Schritt sind',
        paragraphs: [
          'Veneers verdecken keine unbehandelte Karies, keine lockeren Zähne und keinen unbehandelten Biss, den die Klinik zuerst versorgen will. Wenn der Befund eher Implantate oder Kronen braucht, ist ein reines Veneers-Angebot der falsche Vergleich. Die Klinik sagt, welche Reihenfolge sinnvoll ist.',
          'Wir koordinieren beide Richtungen: ästhetische Versorgung und funktionellen Zahnersatz. Für Kronen und Brücken siehe <a href="zahnersatz-lettland.html">Zahnersatz in Lettland</a>.',
        ],
      },
      {
        id: 'ablauf',
        h2: 'Was wir vor einem ästhetischen Plan klären',
        paragraphs: [
          'Im Erstgespräch geht es um Ihr Ziel, vorliegende Fotos oder Pläne und darum, ob eine Klinik in Lettland den Fall überhaupt annehmen kann. Danach laufen Unterlagen und Rückfragen über uns, auf Deutsch.',
          'Farbe, Form und wie viel Zahnsubstanz bearbeitet wird, besprechen Sie mit dem Behandlungsteam. Das ist keine Koordinationsleistung und steht nicht in den 250 € als medizinische Beratung.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Was kosten Veneers in Lettland?',
        a: 'Acht Keramikveneers liegen orientierend ab 4.800 €. Typische Vergleichswerte in Deutschland für diesen Umfang liegen bei 8.000–12.000 €. Das Angebot der Klinik kann abweichen.',
      },
      {
        q: 'Muss es immer ein Smile Makeover mit acht Veneers sein?',
        a: 'Nein. Acht ist der Umfang, für den wir einen Orientierungswert veröffentlichen. Wie viele Veneers sinnvoll sind, entscheidet die Klinik nach Befund.',
      },
      {
        q: 'Sind Veneers eine medizinische Behandlung?',
        a: 'Sie werden von einer Zahnklinik geplant und eingesetzt. Baltic Care Travel führt sie nicht durch und empfiehlt sie nicht. Wir koordinieren den organisatorischen Weg.',
      },
    ],
    related: ['zahnersatz-lettland', 'zahnimplantate-lettland', 'zahnarzt-riga', 'vergleich-zahnimplantate-deutschland-lettland'],
  },
  {
    id: 'zahnarzt-riga',
    file: 'zahnarzt-riga.html',
    title: 'Zahnarzt in Riga für Patienten aus Deutschland | Baltic Care Travel',
    description:
      'Zahnarzt in Riga: Baltic Care Travel koordiniert Zahnbehandlungen in Lettland für Patienten aus Deutschland. Etwa zwei Stunden Flug, EU, Euro. Wir sind nicht die Praxis.',
    h1: 'Zahnarzt in Riga für Patienten aus Deutschland',
    eyebrow: 'Standort',
    subtitle: 'Riga ist der Behandlungsort. Baltic Care Travel ist die deutschsprachige Koordination davor.',
    image: '/images/dental.jpg',
    mast: 'images/home-hero.jpg',
    priority: '0.8',
    service: true,
    answer:
      'Zahnbehandlungen für Patienten aus Deutschland koordinieren wir mit ausgewählten Kliniken in Riga. Die Flugzeit aus Deutschland beträgt etwa zwei Stunden, Lettland ist EU-Mitglied und nutzt den Euro. Baltic Care Travel ist die deutschsprachige Koordination, nicht die behandelnde Praxis.',
    facts: [
      ['Behandlungsort', 'Riga, Lettland'],
      ['Flugzeit aus Deutschland', 'etwa 2 Stunden'],
      ['Rahmen', 'EU seit 2004, Euro'],
      ['Sprache der Koordination', 'Deutsch'],
    ],
    sections: [
      {
        id: 'warum-riga',
        h2: 'Warum Patientinnen und Patienten Riga prüfen',
        paragraphs: [
          'Lettland ist seit 2004 in der EU und im Euro-Raum. Aus Deutschland liegt Riga etwa zwei Flugstunden entfernt. Für eine geplante Zahnbehandlung ist das ein kurzer Weg im Vergleich zu Zielen außerhalb Europas, ohne dass wir andere Länder medizinisch bewerten.',
          'Der Vergleich mit Ungarn, Polen und der Türkei steht auf der Seite <a href="vergleich-zahnbehandlung-ausland.html">Zahnbehandlung im Ausland</a>. Wir koordinieren ausschließlich Lettland.',
        ],
      },
      {
        id: 'kliniken',
        h2: 'Welche Kliniken Sie sehen',
        paragraphs: [
          'Wir arbeiten nicht mit einem offenen Verzeichnis aller Praxen in Riga. Auf der <a href="clinics.html">Klinikübersicht</a> stehen die Partner, mit denen wir koordinieren. Für Implantate, Zahnersatz und ästhetische Rekonstruktionen ist das unter anderem das <a href="clinic.html?id=riga">Baltic Medical Center Riga</a>.',
          'Profile werden erweitert. Ein Profileintrag ist keine medizinische Zertifikatsprüfung durch uns und kein Versprechen auf einen bestimmten Behandler. Die Klinik benennt das Team, wenn ein Fall angenommen wird.',
        ],
      },
      {
        id: 'sprache',
        h2: 'Wie die Sprache geregelt ist',
        paragraphs: [
          'Mit uns sprechen Sie Deutsch. In den Kliniken ist deutsch- oder englischsprachige Kommunikation Teil der Auswahl. Wenn ein Fall Dolmetschung braucht, gehört das zur organisatorischen Abstimmung und nicht zu einer medizinischen Leistung von uns.',
          'Unterlagen können Sie auf Deutsch schicken. Wir strukturieren sie für die Klinik, statt Sie mit einem fremdsprachigen Portal allein zu lassen.',
        ],
      },
      {
        id: 'kosten-ort',
        h2: 'Was der Ort am Preis ändert',
        paragraphs: [
          'Die Orientierungswerte für Implantate, All-on-4 und Veneers gelten für die Partnerkliniken in Lettland, praktisch in Riga. Flug und Übernachtung kommen dazu und hängen von Ihrem Abflughafen ab. Wir setzen dafür keine Pauschale in die Behandlungstabelle.',
          'Die Koordination bleibt 250 €, unabhängig davon, welche Praxis am Ende den Plan schreibt. Zahlen für die Behandlung gehen an die Klinik. Details: <a href="prices.html">Kosten</a> und <a href="zahnimplantate-lettland.html">Zahnimplantate</a>.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Gibt es einen deutschsprachigen Zahnarzt in Riga über Baltic Care Travel?',
        a: 'Wir koordinieren ausgewählte Kliniken in Riga und führen die Kommunikation mit Ihnen auf Deutsch. Ob im konkreten Fall deutschsprachiges Personal oder eine Dolmetschung eingesetzt wird, klärt die Klinik.',
      },
      {
        q: 'Wie lange fliegt man von Deutschland nach Riga?',
        a: 'Etwa zwei Stunden. Der genaue Flug hängt von Abflughafen und Verbindung ab.',
      },
      {
        q: 'Kann ich mir die Klinik vorher ansehen?',
        a: 'Ja, über die Klinikprofile. Eine Behandlung vor Ort beginnt erst, wenn Sie das Angebot der Klinik annehmen.',
      },
    ],
    related: ['zahnimplantate-lettland', 'vergleich-zahnbehandlung-ausland', 'clinics', 'how-it-works'],
  },
  {
    id: 'vergleich-zahnimplantate-deutschland-lettland',
    file: 'vergleich-zahnimplantate-deutschland-lettland.html',
    title: 'Zahnimplantate: Deutschland oder Lettland? | Baltic Care Travel',
    description:
      'Zahnimplantate in Deutschland oder Lettland: Orientierungswerte im Vergleich, plus 250 € Koordination. Keine garantierte Ersparnis. Angebot stellt die Klinik.',
    h1: 'Zahnimplantate: Deutschland oder Lettland?',
    eyebrow: 'Kostenvergleich',
    subtitle: 'Dieselbe Tabelle, die wir auch auf der Preisseite zeigen — mit der Lesart, die Suchmaschinen oft weglassen.',
    image: '/images/prices-hero.jpg',
    mast: 'images/prices-hero.jpg',
    priority: '0.9',
    service: true,
    answer:
      'Die Orientierungswerte unserer Partner liegen für ein Einzelimplantat inklusive Aufbau und Krone bei 1.420–1.710 €, typische Vergleichswerte in Deutschland bei 2.500–4.000 €. „Bis zu“-Angaben beschreiben die Spanne zwischen diesen Werten, keine garantierte Ersparnis. Reise, Aufenthalt und die Koordination von 250 € kommen hinzu.',
    facts: [
      ['Einzelimplantat Lettland', '1.420–1.710 €'],
      ['Einzelimplantat Deutschland', '2.500–4.000 €'],
      ['Lesart „bis zu 2.580 €“', '4.000 − 1.420'],
      ['Koordination extra', '250 €'],
    ],
    table: {
      caption: 'Dental-Orientierungswerte, Stand 11. Oktober 2026. Kinderwunsch und Orthopädie sind nicht bepreist.',
      rows: [
        ['Einzelimplantat inkl. Aufbau und Krone', '1.420–1.710 €', '2.500–4.000 €', 'bis zu 2.580 €'],
        ['4 Implantate inkl. Kronen', '5.680–6.840 €', '10.000–16.000 €', 'bis zu 10.320 €'],
        ['All-on-4 Zirkon, 1 Kiefer', '8.500–11.000 €', '15.000–25.000 €', 'bis zu 16.500 €'],
        ['All-on-6 Zirkon, 1 Kiefer', '9.000–12.000 €', '18.000–30.000 €', 'bis zu 21.000 €'],
        ['8 Keramikveneers', 'ab 4.800 €', '8.000–12.000 €', 'ab ca. 3.200 €'],
      ],
    },
    sections: [
      {
        id: 'lesart',
        h2: 'Wie der Vergleich gerechnet ist',
        paragraphs: [
          'Die Spalte „Mögliche Ersparnis“ zeigt den Abstand zwischen dem unteren Orientierungswert in Lettland und dem oberen typischen Vergleichswert in Deutschland. Beim Einzelimplantat sind das 4.000 € minus 1.420 € = 2.580 €. Beim All-on-4 sind es 25.000 € minus 8.500 € = 16.500 €. Wer in Deutschland ein Angebot am unteren Ende hat, spart weniger. Wer in Lettland Zusatzleistungen braucht, ebenfalls.',
          'Deshalb werben wir nicht mit einem Prozentsatz. Ein pauschales „40 bis 60 Prozent günstiger“ steht nicht auf diesen Seiten, weil es Ihren Befund nicht kennt.',
        ],
      },
      {
        id: 'nebenkosten',
        h2: 'Welche Kosten die Tabelle nicht enthält',
        list: [
          'Koordination durch Baltic Care Travel: 250 € einmalig, nicht erstattungsfähig',
          'Flug nach Riga, etwa zwei Stunden aus Deutschland, Preis je nach Abflughafen',
          'Unterkunft und Verpflegung',
          'Klinikleistungen außerhalb der Zeile, etwa Knochenaufbau oder ein Provisorium',
          'Weitere Anreisen, wenn der Plan mehrere Sitzungen braucht',
          'Optionale Concierge-Leistungen wie Transfer',
        ],
        paragraphs: [
          'Die Behandlung selbst zahlen Sie an die Klinik. Wir nehmen kein Honorar für die medizinische Leistung entgegen. Das steht auch in den <a href="faq.html">häufigen Fragen</a>.',
        ],
      },
      {
        id: 'entscheidung',
        h2: 'Wann Deutschland die passendere Antwort bleibt',
        paragraphs: [
          'Nicht jeder Fall gehört nach Lettland. Akute Beschwerden, eine enge Nachsorge vor Ort oder ein Plan, der sich in Deutschland gut und zu einem überschaubaren Eigenanteil lösen lässt, sind Gründe zu bleiben. Das Erstgespräch dient dazu, das auszusprechen, nicht dazu, eine Reise zu verkaufen.',
          'Wenn der Eigenanteil hoch ist und Sie die Organisation nicht allein tragen wollen, ist der Vergleich ein sinnvoller zweiter Blick. Den medizinischen Entscheid trifft danach die Klinik, nicht wir.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Sind Zahnimplantate in Lettland günstiger als in Deutschland?',
        a: 'Nach unseren Orientierungswerten oft ja: 1.420–1.710 € inklusive Aufbau und Krone gegenüber typisch 2.500–4.000 € in Deutschland. Garantiert ist das nicht. Reise, 250 € Koordination und der individuelle Plan kommen dazu.',
      },
      {
        q: 'Übernimmt die Krankenkasse die Differenz?',
        a: 'Die Koordinationsgebühr ist nicht erstattungsfähig. Ob eine Versicherung Anteile der Behandlung zahlt, klären Sie mit der Versicherung und der Klinik. Wir reichen keine Anträge ein.',
      },
      {
        q: 'Woher stammen die deutschen Vergleichswerte?',
        a: 'Es sind typische Vergleichspreise im deutschsprachigen Raum, die wir neben den Partnerangeboten auf der Preisseite ausweisen. Sie ersetzen keinen Heil- und Kostenplan Ihrer Praxis.',
      },
    ],
    related: ['zahnimplantate-lettland', 'all-on-4-lettland', 'prices', 'vergleich-zahnbehandlung-ausland'],
  },
  {
    id: 'vergleich-zahnbehandlung-ausland',
    file: 'vergleich-zahnbehandlung-ausland.html',
    title: 'Zahnbehandlung im Ausland: Lettland im Vergleich | Baltic Care Travel',
    description:
      'Zahnbehandlung im Ausland: Baltic Care Travel koordiniert Lettland, nicht Ungarn, Polen oder die Türkei. EU, Euro, etwa zwei Stunden Flug. Keine Fremdpreise.',
    h1: 'Zahnbehandlung im Ausland: Lettland, Ungarn, Türkei',
    eyebrow: 'Einordnung',
    subtitle: 'Wir vergleichen den Rahmen der Reise, nicht die Medizin anderer Länder.',
    image: '/images/home-hero.jpg',
    mast: 'images/home-hero.jpg',
    priority: '0.8',
    answer:
      'Baltic Care Travel koordiniert Zahnbehandlungen in Lettland, nicht in Ungarn, Polen oder der Türkei. Lettland ist EU-Mitglied, nutzt den Euro und ist aus Deutschland in etwa zwei Stunden erreichbar. Preise anderer Länder veröffentlichen wir nicht, weil wir dort nicht koordinieren.',
    facts: [
      ['Unser Behandlungsort', 'Lettland'],
      ['EU und Euro', 'Ja'],
      ['Andere Länder', 'Keine Koordination, keine Preise'],
      ['Koordination', '250 € einmalig'],
    ],
    matrix: {
      caption: 'Rahmenbedingungen, keine Qualitäts- oder Preisrangliste.',
      headers: ['Kriterium', 'Lettland', 'Ungarn', 'Polen', 'Türkei'],
      rows: [
        ['EU-Mitglied', 'Ja, seit 2004', 'Ja', 'Ja', 'Nein'],
        ['Währung', 'Euro', 'Forint', 'Złoty', 'Lira'],
        ['Flug aus Deutschland', 'etwa 2 Stunden nach Riga', 'häufig etwa 1,5–2 Stunden', 'häufig etwa 1–2 Stunden', 'häufig etwa 3 Stunden oder mehr'],
        ['Koordination durch Baltic Care Travel', 'Ja, auf Deutsch', 'Nein', 'Nein', 'Nein'],
        ['Preise auf dieser Website', 'Orientierungswerte der Partner', 'veröffentlichen wir nicht', 'veröffentlichen wir nicht', 'veröffentlichen wir nicht'],
      ],
    },
    sections: [
      {
        id: 'frage',
        h2: 'Wo sind Zahnimplantate im Ausland am günstigsten?',
        paragraphs: [
          'Das ist die falsche einzige Frage. Der niedrigste Listenpreis sagt nichts darüber, ob der Plan zu Ihrem Befund passt, welches Material eingesetzt wird, wie die Nachsorge erreichbar ist und in welcher Sprache der Vertrag steht. Wir beantworten die Frage nur für Lettland, weil nur dort unsere Partner und unsere Orientierungswerte liegen.',
          'Für diese Werte siehe <a href="vergleich-zahnimplantate-deutschland-lettland.html">Deutschland oder Lettland</a>. Einen Implantatpreis für Budapest, Istanbul oder Warschau setzen wir nicht ein.',
        ],
      },
      {
        id: 'rahmen',
        h2: 'Welcher Rahmen für Lettland spricht',
        paragraphs: [
          'Lettland ist EU-Mitglied und nutzt den Euro. Riga liegt etwa zwei Flugstunden von Deutschland entfernt. Die Koordination läuft auf Deutsch, der Behandlungsvertrag entsteht mit der Klinik vor Ort. Das ist der Rahmen, den wir verantworten können.',
          'Ungarn und Polen sind ebenfalls in der EU und für viele Menschen etablierte Ziele der Zahnbehandlung im Ausland. Die Türkei liegt außerhalb der EU. Keine dieser Aussagen ist ein Urteil über klinische Qualität. Sie beschreibt, wo wir arbeiten und wo nicht.',
        ],
      },
      {
        id: 'wahl',
        h2: 'Wie Sie ein Ziel trotzdem selbst prüfen',
        paragraphs: [
          'Wenn Sie mehrere Länder vergleichen, lohnt derselbe Maßstab überall: schriftliches Angebot nach Befund, benanntes Team, Umgang mit Komplikationen nach der Rückreise, und Kosten für Flug und weitere Sitzungen. Ein Portal, das nur Prozentzahlen zeigt, ersetzt das nicht.',
          'Wir sind dieses Portal nicht. Wenn Lettland infrage kommt, starten Sie mit dem <a href="contact.html">Erstgespräch</a>. Wenn ein anderes Land für Sie feststeht, koordinieren wir den Fall nicht.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Koordiniert Baltic Care Travel auch Ungarn oder die Türkei?',
        a: 'Nein. Der Behandlungsort ist Lettland. Für Ungarn, Polen und die Türkei veröffentlichen wir keine Preise und keine Kliniken.',
      },
      {
        q: 'Ist Lettland besser als Ungarn für Zahnimplantate?',
        a: 'Das lässt sich seriös nicht als medizinische Rangliste beantworten. Lettland ist der Ort, den wir organisatorisch begleiten: EU, Euro, etwa zwei Stunden Flug, deutschsprachige Koordination.',
      },
      {
        q: 'Warum fehlen Preise für andere Länder?',
        a: 'Weil wir dort keine Partnerangebote einholen. Ein Vergleich mit erfundenen Zahlen wäre irreführend.',
      },
    ],
    related: ['vergleich-zahnimplantate-deutschland-lettland', 'zahnarzt-riga', 'zahnimplantate-lettland', 'prices'],
  },
];

/** Links that are not guide ids. */
export const extraLinks = {
  prices: { href: 'prices.html', title: 'Preise und Orientierungswerte', text: 'Die Tabelle, aus der alle Beträge auf diesen Seiten stammen.' },
  clinics: { href: 'clinics.html', title: 'Kliniken in Riga', text: 'Partnerprofile, mit denen wir Zahnbehandlungen koordinieren.' },
  'how-it-works': { href: 'how-it-works.html', title: 'Ablauf der Koordination', text: 'Von der Anfrage bis zur Behandlung, in acht Schritten.' },
};
