/** Shared SEO constants. Canonical host is www — the apex 307-redirects there. */
export const ORIGIN = 'https://www.balticcaretravel.com';
export const UPDATED = '2026-10-11';
export const UPDATED_LABEL = '11. Oktober 2026';
export const BRAND = 'Baltic Care Travel';

export const ENTITY =
  'Baltic Care Travel koordiniert Behandlungen zwischen Patientinnen und Patienten aus Deutschland und ausgewählten Kliniken in Lettland. Wir sind keine Klinik, kein medizinischer Anbieter und kein Preisvergleichsportal. Aktuell ist die Zahnmedizin freigeschaltet. Kinderwunsch / IVF und Orthopädie werden vorbereitet.';

export const DISCLAIMER =
  'Baltic Care Travel erbringt keine medizinische Beratung, Diagnose oder Behandlung. Die Orientierungswerte stammen aus Partnerangeboten und typischen Vergleichspreisen im deutschsprachigen Raum, Stand ' +
  UPDATED_LABEL +
  '. Der verbindliche Preis, der Behandlungsvertrag und die medizinische Entscheidung liegen bei der jeweiligen Klinik. Die Koordinationsgebühr von 250 € ist einmalig und nicht erstattungsfähig. Flug, Unterkunft und individuelle Zusatzleistungen wie Knochenaufbau sind darin nicht enthalten.';

export const ROBOTS_INDEX =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
export const ROBOTS_NOINDEX = 'noindex, follow';

/** Metadata for existing HTML files. Paths are relative to the site root. */
export const existingPages = {
  'index.html': {
    path: '/',
    title: 'Zahnbehandlung in Lettland koordinieren | Baltic Care Travel',
    description:
      'Koordination von Zahnbehandlungen in Lettland für Patienten aus Deutschland: Implantate, Zahnersatz, All-on-4 und Veneers. Deutschsprachig, Kliniken in der EU.',
    crumb: null,
    priority: '1.0',
    changefreq: 'weekly',
    image: '/images/home-hero.jpg',
    home: true,
    service: true,
  },
  'treatment-dental.html': {
    title: 'Zahnbehandlung in Lettland | Baltic Care Travel',
    description:
      'Zahnbehandlung in Lettland koordinieren: Implantate, Zahnersatz, All-on-4 und Veneers. Baltic Care Travel begleitet Patienten aus Deutschland. Die Klinik behandelt.',
    crumb: 'Zahnbehandlung',
    priority: '0.9',
    changefreq: 'weekly',
    image: '/images/dental.jpg',
    service: true,
  },
  'prices.html': {
    title: 'Zahnbehandlung Lettland: Kosten | Baltic Care Travel',
    description:
      'Was kostet eine Zahnbehandlung in Lettland? Orientierungswerte für Implantate, All-on-4 und Veneers, plus 250 € Koordination. Das Angebot stellt die Klinik.',
    crumb: 'Preise',
    priority: '0.9',
    changefreq: 'weekly',
    image: '/images/prices-hero.jpg',
    service: true,
  },
  'faq.html': {
    title: 'FAQ: Behandlung in Lettland | Baltic Care Travel',
    description:
      'FAQ: Was macht Baltic Care Travel, was kostet die Koordination und wer behandelt? Antworten zur Zahnbehandlung in Lettland für Patienten aus Deutschland.',
    crumb: 'FAQ',
    priority: '0.8',
    changefreq: 'monthly',
    image: '/images/home-hero.jpg',
  },
  'how-it-works.html': {
    title: 'Ablauf: Behandlung in Lettland | Baltic Care Travel',
    description:
      'So läuft die Koordination einer Behandlung in Lettland: Anfrage, Erstgespräch, Unterlagen, Klinik-Matching und Begleitung bis zur Behandlung.',
    crumb: 'So funktioniert es',
    priority: '0.8',
    changefreq: 'monthly',
    image: '/images/home-hero.jpg',
    howto: true,
  },
  'clinics.html': {
    title: 'Zahnkliniken in Riga | Baltic Care Travel',
    description:
      'Partnerkliniken in Riga für Zahnbehandlungen. Baltic Care Travel koordiniert den Weg für Patienten aus Deutschland. Kinderwunsch und Orthopädie folgen.',
    crumb: 'Kliniken',
    priority: '0.8',
    changefreq: 'weekly',
    image: '/images/dental.jpg',
  },
  'treatments.html': {
    title: 'Behandlungen in Lettland | Baltic Care Travel',
    description:
      'Behandlungen in Lettland: aktuell Zahnmedizin mit Implantaten, Zahnersatz und Veneers. Kinderwunsch / IVF und Orthopädie sind in Vorbereitung.',
    crumb: 'Behandlungen',
    priority: '0.7',
    changefreq: 'monthly',
    image: '/images/dental.jpg',
  },
  'about.html': {
    title: 'Über uns | Baltic Care Travel',
    description:
      'Baltic Care Travel koordiniert Zahnbehandlungen in Lettland für Patientinnen und Patienten aus Deutschland. Keine Klinik, sondern persönliche Begleitung.',
    crumb: 'Über uns',
    priority: '0.6',
    changefreq: 'monthly',
    image: '/images/about-hero.jpg',
  },
  'contact.html': {
    title: 'Kontakt | Baltic Care Travel',
    description:
      'Kostenfreies Erstgespräch mit Baltic Care Travel zur Koordination einer Zahnbehandlung in Lettland.',
    crumb: 'Kontakt',
    priority: '0.7',
    changefreq: 'monthly',
    image: '/images/home-hero.jpg',
  },
  'clinic.html': {
    title: 'Partnerklinik in Riga | Baltic Care Travel',
    description:
      'Profil einer Partnerklinik in Riga. Baltic Care Travel koordiniert Zahnbehandlungen für Patienten aus Deutschland und ist selbst keine Klinik.',
    crumb: 'Klinikprofil',
    priority: '0.5',
    changefreq: 'monthly',
    image: '/images/dental.jpg',
  },
  'booking.html': {
    title: 'Kennenlerngespräch | Baltic Care Travel',
    description: 'Buchen Sie ein 15-minütiges Kennenlerngespräch mit Baltic Care Travel.',
    crumb: 'Kennenlerngespräch',
    priority: '0.4',
    changefreq: 'monthly',
    image: '/images/home-hero.jpg',
  },
  'treatment-fertility.html': {
    title: 'Kinderwunsch in Lettland | Baltic Care Travel',
    description:
      'Kinderwunsch / IVF bei Baltic Care Travel wird vorbereitet und ist noch nicht buchbar. Aktuell koordinieren wir Zahnbehandlungen in Lettland.',
    crumb: 'Kinderwunsch',
    priority: '0.3',
    changefreq: 'monthly',
    image: '/images/ivf.jpg',
  },
  'treatment-orthopedic.html': {
    title: 'Orthopädie in Lettland | Baltic Care Travel',
    description:
      'Orthopädie bei Baltic Care Travel wird vorbereitet und ist noch nicht buchbar. Aktuell koordinieren wir Zahnbehandlungen in Lettland.',
    crumb: 'Orthopädie',
    priority: '0.3',
    changefreq: 'monthly',
    image: '/images/orthopedics.jpg',
  },
  'legal/impressum.html': {
    title: 'Impressum | Baltic Care Travel',
    description: 'Impressum von Baltic Care Travel.',
    crumb: 'Impressum',
    priority: '0.2',
    changefreq: 'yearly',
    image: '/images/logo.png',
  },
  'legal/privacy.html': {
    title: 'Datenschutz | Baltic Care Travel',
    description: 'Datenschutzerklärung von Baltic Care Travel.',
    crumb: 'Datenschutz',
    priority: '0.2',
    changefreq: 'yearly',
    image: '/images/logo.png',
  },
  'legal/terms.html': {
    title: 'AGB | Baltic Care Travel',
    description: 'Allgemeine Geschäftsbedingungen von Baltic Care Travel.',
    crumb: 'AGB',
    priority: '0.2',
    changefreq: 'yearly',
    image: '/images/logo.png',
  },
  'login.html': {
    robots: ROBOTS_NOINDEX,
    priority: '0',
    crumb: 'Anmeldung',
  },
  'patient-stories.html': {
    robots: ROBOTS_NOINDEX,
    priority: '0',
    crumb: 'Patientenerfahrungen',
    description:
      'Patientenerfahrungen werden derzeit nicht als belegte Fälle veröffentlicht.',
  },
  'treatment-plastic.html': {
    title: 'Plastische Chirurgie | Baltic Care Travel',
    description:
      'Plastische Chirurgie gehört nicht zum aktuellen Angebot von Baltic Care Travel. Wir koordinieren derzeit Zahnbehandlungen in Lettland.',
    robots: ROBOTS_NOINDEX,
    priority: '0',
    crumb: 'Plastische Chirurgie',
  },
};
