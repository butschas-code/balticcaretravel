/**
 * Clinic detail page (clinic.html) — populates from ?id= via DOM APIs only (no innerHTML for data).
 * Partner clinics are in Riga, Latvia only.
 */
(function () {
  'use strict';

  var IMG_DENTAL = 'images/dental.jpg';
  var IMG_IVF = 'images/ivf.jpg';
  var IMG_ORTHO = 'images/orthopedics.jpg';
  var IMG_TEAM_EVIJA = 'images/team/doctor-evija-kalnina.png';
  var IMG_TEAM_REICH = 'images/team/doctor-thomas-reich.png';
  var IMG_TEAM_OZOLS = 'images/team/doctor-martins-ozols.png';

  var CLINICS = {
    riga: {
      title: 'Baltic Medical Center Riga',
      lead: 'Zahnmedizin & Implantologie · Riga, Lettland',
      leadEn: 'Dentistry & implantology · Riga, Latvia',
      heroBg: IMG_DENTAL,
      overview:
        'Das Baltic Medical Center Riga ist eine zertifizierte Klinik mit Schwerpunkt Zahnmedizin und Implantologie. Moderne Ausstattung, erfahrene Fachärzte und deutschsprachige Betreuung.',
      overviewEn:
        'Baltic Medical Center Riga is a certified clinic focused on dentistry and implantology. Modern facilities, experienced specialists, and German-speaking support.',
      overviewSecondaryDe:
        'Ob eine gezielte Einzelbehandlung oder ein mehrstufiger Plan über mehrere Aufenthalte: Sie finden hier eine ruhige Atmosphäre, transparente Diagnostik und klare Entscheidungshilfen. Die Einrichtung ist auf internationale Patientinnen und Patienten eingestellt — von der Terminplanung bis zur Nachkontrolle.',
      overviewSecondaryEn:
        'Whether you need a focused single procedure or a multi-step plan across visits, you will find a calm setting, transparent diagnostics, and clear guidance. The clinic is set up for international patients — from scheduling through follow-up.',
      journeyDe:
        'In Riga stehen sichere Implantologie und ästhetisch anspruchsvolle Rekonstruktionen im Mittelpunkt. Wir helfen Ihnen, Befunde und Heilungsintervalle einzuordnen, bei Bedarf Dolmetschung zu organisieren und Ihren Aufenthalt pragmatisch zu planen — mit realistischen Pufferzeiten für Kontrollen.',
      journeyEn:
        'In Riga the emphasis is on safe implantology and aesthetically demanding reconstructions. We help you interpret findings and healing timelines, arrange interpretation if needed, and plan your stay practically — with realistic time for check-ups.',
      treatmentsContextDe:
        'Schwerpunkt dieser Klinik: Zahnmedizin und Implantologie. Die folgenden Bereiche entsprechen unserem Koordinationsangebot für alle Standorte.',
      treatmentsContextEn:
        'This clinic focuses on dentistry and implantology. The treatment areas below reflect our coordination offering across all locations.',
      equipment:
        'Moderne Behandlungsräume, digitales Röntgen, OP-Bereich für implantologische Eingriffe. Sterilisationsstandards nach EU-Richtlinien.',
      equipmentEn:
        'Modern treatment rooms, digital X-ray, surgical area for implant procedures. Sterilisation standards aligned with EU guidelines.',
      certs: ['ISO 9001 (Qualitätsmanagement)', 'EU-Medizinprodukte-Verordnung (MDR)', 'Lettische Zahnärztekammer', 'Deutschsprachige Patientenbetreuung'],
      testimonial:
        '„Von der Anreise bis zur Nachsorge: Wir koordinieren Termine, Übersetzung und Rückfragen. Die Klinik bietet Abholservice und deutschsprachige Ansprechpartner.“',
      testimonialEn:
        '"From arrival to aftercare: they coordinated appointments, translation, and follow-up questions. The clinic offered pickup and German-speaking contacts."',
      ctaLead: 'Wir vermitteln Sie unverbindlich an das Baltic Medical Center Riga.',
      ctaLeadEn: 'We will put you in touch with Baltic Medical Center Riga without obligation.',
      doctors: [
        {
          name: 'Dr. med. dent. Evija Kalniņa',
          spec: 'Implantologie & ästhetische Zahnmedizin',
          services: ['Implantologie', 'Knochenaufbau', 'Digitale Planung'],
          bio: 'Langjährige Erfahrung in komplexen implantologischen Fällen und ästhetischen Rekonstruktionen.',
          exp: '14 Jahre',
          treatments: 'über 3.200 Implantate',
          cert: 'DGZI, EAO',
          img: IMG_TEAM_EVIJA,
          videoDuration: '0:52'
        },
        {
          name: 'Dr. med. dent. Thomas Reich',
          spec: 'Oralchirurgie & Knochenaufbau',
          services: ['Oralchirurgie', 'Knochenaufbau', 'Komplexfälle'],
          bio: 'Schwerpunkt auf chirurgischer Versorgung und präimplantologischer Vorbereitung.',
          exp: '12 Jahre',
          treatments: '',
          cert: '',
          img: IMG_TEAM_REICH,
          videoDuration: '0:58'
        },
        {
          name: 'Dr. med. dent. Anna Liepa',
          spec: 'Prothetik & Vollrestauration',
          services: ['Veneers', 'Kronen & Brücken', 'Totalrekonstruktion'],
          bio: 'Schwerpunkt auf ästhetischer Zahnmedizin und funktioneller Rehabilitation.',
          exp: '11 Jahre',
          treatments: 'über 2.100 Kronen & Veneers',
          cert: 'DGPro, ESCD',
          img: IMG_TEAM_EVIJA,
          videoDuration: '1:05'
        },
        {
          name: 'Dr. med. dent. Mārtiņš Ozols',
          spec: 'All-on-X & komplexe Rekonstruktionen',
          services: ['All-on-4/6', 'Komplexfälle', 'Digitale Planung'],
          bio: 'Erfahrung mit ganzheitlichen Rekonstruktionen und internationalen Patienten.',
          exp: '13 Jahre',
          treatments: '',
          cert: '',
          img: IMG_TEAM_OZOLS,
          videoDuration: '0:49'
        }
      ]
    },
    premium: {
      title: 'Premium Dental Riga',
      lead: 'Zahnmedizin & ästhetische Rekonstruktion · Riga, Lettland',
      leadEn: 'Dentistry & aesthetic reconstruction · Riga, Latvia',
      heroBg: IMG_DENTAL,
      overview:
        'Premium Dental Riga ist auf konservierende und ästhetische Zahnmedizin, Vollrekonstruktionen und digitale Planung spezialisiert — mit kurzen Wegen in der Innenstadt und klaren Abläufen für internationale Patientinnen und Patienten.',
      overviewEn:
        'Premium Dental Riga specialises in conservative and aesthetic dentistry, full-mouth reconstructions, and digital planning — with a central Riga location and clear pathways for international patients.',
      overviewSecondaryDe:
        'Ideal, wenn Sie mehrere Sitzungen oder eine umfassende Sanierung planen: Das Team arbeitet eng mit dem Labor zusammen und legt Wert auf nachvollziehbare Phasenpläne und realistische Zeitfenster für Ihren Aufenthalt in Riga.',
      overviewSecondaryEn:
        'Ideal if you are planning multiple visits or a full-mouth rehabilitation: the team works closely with the lab and focuses on understandable phased plans and realistic time windows for your stay in Riga.',
      journeyDe:
        'Wir unterstützen Sie bei der Abstimmung von Terminen, Unterlagen und ggf. Dolmetschung — besonders wenn mehrere Behandlungsschritte nacheinander geplant sind.',
      journeyEn:
        'We help coordinate appointments, documents, and interpretation if needed — especially when several treatment steps are planned in sequence.',
      treatmentsContextDe:
        'Schwerpunkt: Zahnmedizin. Die drei Bereiche unten zeigen unser gesamtes Koordinationsangebot; hier liegt der Fokus auf zahnärztlicher Versorgung.',
      treatmentsContextEn:
        'Focus: dentistry. The three areas below reflect our full coordination scope; this site emphasises dental care.',
      equipment: 'Digitale Abformung, CAD/CAM, Mikroskopie, moderne Sterilisation. EU-konforme Labore in Riga.',
      equipmentEn: 'Digital impressions, CAD/CAM, microscopy, modern sterilisation. EU-compliant labs in Riga.',
      certs: ['ISO 9001', 'Lettische Zahnärztekammer', 'Deutschsprachige Patientenbetreuung'],
      testimonial: '„Klare Kommunikation und ruhige Atmosphäre — wir fühlten uns gut informiert.“',
      testimonialEn: '"Clear communication and a calm atmosphere — we felt well informed."',
      ctaLead: 'Wir vermitteln Sie unverbindlich an Premium Dental Riga.',
      ctaLeadEn: 'We will put you in touch with Premium Dental Riga without obligation.',
      doctors: [
        {
          name: 'Dr. med. dent. Anna Liepa',
          spec: 'Ästhetische & rekonstruktive Zahnmedizin',
          services: ['Veneers', 'Totalrekonstruktion', 'Digitale Planung'],
          bio: 'Erfahrung mit internationalen Patienten und komplexen ästhetischen Fällen.',
          exp: '13 Jahre',
          treatments: '',
          cert: 'ESCD',
          img: IMG_TEAM_EVIJA,
          videoDuration: '0:55'
        }
      ]
    },
    fertility: {
      title: 'Nordic Fertility Riga',
      lead: 'Kinderwunsch / Reproduktionsmedizin · Riga, Lettland',
      leadEn: 'Fertility / reproductive medicine · Riga, Latvia',
      heroBg: IMG_IVF,
      overview:
        'Kommt bald: Der Bereich Kinderwunsch / IVF wird derzeit vorbereitet. Klinikprofile, Abläufe und konkrete Informationen werden schrittweise ergänzt.',
      overviewEn:
        'Coming soon: the fertility / IVF area is currently being prepared. Clinic profiles, pathways and concrete information will be added step by step.',
      overviewSecondaryDe:
        'Aktuell starten wir mit Dental. Für Kinderwunsch / IVF bereiten wir Inhalte vor, damit spätere Anfragen diskret, klar und strukturiert begleitet werden können.',
      overviewSecondaryEn:
        'We are currently starting with dental. For fertility / IVF, we are preparing content so future enquiries can be supported discreetly, clearly and structurally.',
      journeyDe:
        'Dieser Bereich ist noch nicht live. Die Seite bleibt als Ausblick sichtbar, bis die vorbereiteten IVF-Informationen veröffentlicht werden.',
      journeyEn:
        'This area is not live yet. The page remains visible as a preview until the prepared IVF information is published.',
      treatmentsContextDe:
        'Kinderwunsch / IVF kommt bald. Aktuell startet Baltic Care Travel mit Dental.',
      treatmentsContextEn:
        'Fertility / IVF is coming soon. Baltic Care Travel is currently starting with dental.',
      equipment: 'Eigene Labore, Kryo-Lagerung, moderne OP- und Entnahmebereiche. Zertifizierte Qualitätskontrolle.',
      equipmentEn: 'In-house labs, cryostorage, modern retrieval and procedure areas. Certified quality control.',
      certs: ['ISO 9001', 'Lettische Gesundheitsbehörde', 'ESHRE-orientierte Standards', 'Deutschsprachige Patientenbetreuung'],
      testimonial: '„Koordination von Anreise, Unterkunft und Terminen. Diskret und vertraulich.“',
      testimonialEn: '"Coordination of travel, accommodation, and appointments. Discreet and confidential."',
      ctaLead: 'Kinderwunsch / IVF kommt bald. Aktuell starten wir mit Dental.',
      ctaLeadEn: 'Fertility / IVF is coming soon. We are currently starting with dental.',
      doctors: [
        {
          name: 'Dr. [Name]',
          spec: 'Reproduktionsmedizin',
          services: ['IVF', 'ICSI', 'Beratung Kinderwunsch'],
          bio: 'Erfahrung in international ausgerichteten Kinderwunschprogrammen.',
          exp: '15 Jahre',
          treatments: '',
          cert: 'ESHRE',
          img: IMG_IVF,
          videoDuration: '1:18'
        },
        {
          name: 'Dr. [Name]',
          spec: 'Endokrinologie Kinderwunsch',
          services: ['Hormonstimulation', 'Zyklusmonitoring', 'Nachsorge'],
          bio: 'Fokus auf individuelle Protokolle und klare Kommunikation.',
          exp: '11 Jahre',
          treatments: '',
          cert: '',
          img: IMG_IVF,
          videoDuration: '0:44'
        }
      ]
    },
    ivfcenter: {
      title: 'Riga IVF & Reproductive Center',
      lead: 'IVF, ICSI & Kryo · Riga, Lettland',
      leadEn: 'IVF, ICSI & cryo services · Riga, Latvia',
      heroBg: IMG_IVF,
      overview:
        'Kommt bald: Der Bereich Kinderwunsch / IVF wird derzeit vorbereitet. Weitere Klinikdetails und Abläufe folgen nach dem Dental-Start.',
      overviewEn:
        'Coming soon: the fertility / IVF area is currently being prepared. More clinic details and pathways will follow after the dental launch.',
      overviewSecondaryDe:
        'Aktuell sammeln wir Informationen, damit der IVF-Bereich später diskret, klar und verlässlich dargestellt werden kann.',
      overviewSecondaryEn:
        'We are currently collecting information so the IVF area can later be presented discreetly, clearly and reliably.',
      journeyDe:
        'Dieser Bereich ist noch nicht live. Die Seite bleibt als Ausblick sichtbar, bis die vorbereiteten IVF-Informationen veröffentlicht werden.',
      journeyEn:
        'This area is not live yet. The page remains visible as a preview until the prepared IVF information is published.',
      treatmentsContextDe:
        'Kinderwunsch / IVF kommt bald. Aktuell startet Baltic Care Travel mit Dental.',
      treatmentsContextEn:
        'Fertility / IVF is coming soon. Baltic Care Travel is currently starting with dental.',
      equipment: 'IVF-Labor, ICSI, Kryobank, Ultraschall und Beratungsräume nach EU-Standards.',
      equipmentEn: 'IVF lab, ICSI, cryobank, ultrasound and counselling rooms to EU standards.',
      certs: ['ISO 9001', 'Lettische Gesundheitsbehörde', 'Deutschsprachige Patientenbetreuung'],
      testimonial: '„Strukturierte Abläufe und schnelle Rückmeldungen — genau das, was wir gebraucht haben.“',
      testimonialEn: '"Structured processes and quick responses — exactly what we needed."',
      ctaLead: 'Kinderwunsch / IVF kommt bald. Aktuell starten wir mit Dental.',
      ctaLeadEn: 'Fertility / IVF is coming soon. We are currently starting with dental.',
      doctors: [
        {
          name: 'Dr. [Name]',
          spec: 'Reproduktionsmedizin',
          services: ['IVF', 'ICSI', 'Kryotransfer'],
          bio: 'Schwerpunkt auf evidenzbasierten Protokollen und transparenter Kommunikation.',
          exp: '16 Jahre',
          treatments: '',
          cert: 'ESHRE',
          img: IMG_IVF,
          videoDuration: '1:02'
        }
      ]
    },
    ortho: {
      title: 'Baltic Orthopaedic Center Riga',
      lead: 'Orthopädie & Gelenkchirurgie · Riga, Lettland',
      leadEn: 'Orthopaedics & joint surgery · Riga, Latvia',
      heroBg: IMG_ORTHO,
      overview:
        'Kommt bald: Der Bereich Orthopädie wird derzeit vorbereitet. Klinikprofile, Abläufe und konkrete Informationen werden schrittweise ergänzt.',
      overviewEn:
        'Coming soon: the orthopaedics area is currently being prepared. Clinic profiles, pathways and concrete information will be added step by step.',
      overviewSecondaryDe:
        'Aktuell starten wir mit Dental. Für Orthopädie bereiten wir Inhalte vor, damit der Bereich später klar und verlässlich dargestellt werden kann.',
      overviewSecondaryEn:
        'We are currently starting with dental. For orthopaedics, we are preparing content so this area can later be presented clearly and reliably.',
      journeyDe:
        'Dieser Bereich ist noch nicht live. Die Seite bleibt als Ausblick sichtbar, bis die vorbereiteten Orthopädie-Informationen veröffentlicht werden.',
      journeyEn:
        'This area is not live yet. The page remains visible as a preview until the prepared orthopaedics information is published.',
      treatmentsContextDe:
        'Orthopädie kommt bald. Aktuell startet Baltic Care Travel mit Dental.',
      treatmentsContextEn:
        'Orthopaedics is coming soon. Baltic Care Travel is currently starting with dental.',
      equipment:
        'Moderne OP-Säle für Endoprothetik und Arthroskopie, Intensiv- und Stationärbereich, Bildgebung. EU-Standards.',
      equipmentEn:
        'Modern theatres for arthroplasty and arthroscopy, ICU and inpatient wards, imaging. EU standards.',
      certs: ['ISO 9001', 'Lettische Gesundheitsbehörde', 'Deutschsprachige Patientenbetreuung'],
      testimonial: '„Abholservice, Koordination von Aufenthalt und Nachsorge. Transparente Kosten.“',
      testimonialEn: '"Pickup service, coordination of stay and aftercare. Transparent costs."',
      ctaLead: 'Orthopädie kommt bald. Aktuell starten wir mit Dental.',
      ctaLeadEn: 'Orthopaedics is coming soon. We are currently starting with dental.',
      doctors: [
        {
          name: 'Dr. [Name]',
          spec: 'Orthopädie, Gelenkchirurgie',
          services: ['Knie-TEP', 'Hüft-TEP', 'Arthroskopie'],
          bio: 'Schwerpunkt auf planbaren gelenkchirurgischen Eingriffen.',
          exp: '18 Jahre',
          treatments: 'über 2.000 TEP',
          cert: '',
          img: IMG_ORTHO,
          videoDuration: '0:47'
        },
        {
          name: 'Dr. [Name]',
          spec: 'Orthopädie, Sporttraumatologie',
          services: ['Meniskus', 'Kreuzband', 'Schulter'],
          bio: 'Erfahrung mit internationalen Patienten und klaren Nachsorgeplänen.',
          exp: '12 Jahre',
          treatments: '',
          cert: '',
          img: IMG_ORTHO,
          videoDuration: '0:51'
        }
      ]
    },
    orthox: {
      title: 'Riga Joint & Sports Orthopaedics',
      lead: 'Orthopädie, Sportmedizin & Rehabilitation · Riga, Lettland',
      leadEn: 'Orthopaedics, sports medicine & rehabilitation · Riga, Latvia',
      heroBg: IMG_ORTHO,
      overview:
        'Kommt bald: Der Bereich Orthopädie wird derzeit vorbereitet. Weitere Klinikdetails und Abläufe folgen nach dem Dental-Start.',
      overviewEn:
        'Coming soon: the orthopaedics area is currently being prepared. More clinic details and pathways will follow after the dental launch.',
      overviewSecondaryDe:
        'Aktuell sammeln wir Informationen, damit der Orthopädie-Bereich später klar und verlässlich dargestellt werden kann.',
      overviewSecondaryEn:
        'We are currently collecting information so the orthopaedics area can later be presented clearly and reliably.',
      journeyDe:
        'Dieser Bereich ist noch nicht live. Die Seite bleibt als Ausblick sichtbar, bis die vorbereiteten Orthopädie-Informationen veröffentlicht werden.',
      journeyEn:
        'This area is not live yet. The page remains visible as a preview until the prepared orthopaedics information is published.',
      treatmentsContextDe:
        'Orthopädie kommt bald. Aktuell startet Baltic Care Travel mit Dental.',
      treatmentsContextEn:
        'Orthopaedics is coming soon. Baltic Care Travel is currently starting with dental.',
      equipment: 'OP-Bereich, Physiotherapie, bildgebende Diagnostik, moderne Patientenzimmer.',
      equipmentEn: 'Surgical area, physiotherapy, imaging, modern patient rooms.',
      certs: ['ISO 9001', 'Lettische Gesundheitsbehörde', 'Deutschsprachige Patientenbetreuung'],
      testimonial: '„Professionelle Nachsorge und klare Zeitplanung für den Aufenthalt in Riga.“',
      testimonialEn: '"Professional aftercare and a clear schedule for the stay in Riga."',
      ctaLead: 'Orthopädie kommt bald. Aktuell starten wir mit Dental.',
      ctaLeadEn: 'Orthopaedics is coming soon. We are currently starting with dental.',
      doctors: [
        {
          name: 'Dr. [Name]',
          spec: 'Orthopädie',
          services: ['Sporttraumatologie', 'Arthroskopie', 'Rehab-Planung'],
          bio: 'Interdisziplinäre Abstimmung mit Physiotherapie vor Ort.',
          exp: '14 Jahre',
          treatments: '',
          cert: '',
          img: IMG_ORTHO,
          videoDuration: '0:58'
        }
      ]
    }
  };

  var LEGACY_IDS = { vilnius: 'fertility', tallinn: 'ortho' };

  var rawId = '';
  try {
    rawId = new URLSearchParams(window.location.search).get('id') || '';
  } catch (_) {
    rawId = '';
  }
  var id = /^[a-z]{1,32}$/.test(rawId) ? rawId.toLowerCase() : '';
  if (LEGACY_IDS[id]) id = LEGACY_IDS[id];
  var clinic = CLINICS[id] || CLINICS.riga;

  function setText(elementId, text) {
    var el = document.getElementById(elementId);
    if (el) el.textContent = text;
  }

  function tr(key) {
    if (!window.BHT || !BHT.i18n) return '';
    var lang = BHT.i18n.getLang();
    var v = BHT.i18n.get(key, lang);
    return v != null ? String(v) : '';
  }

  function pickLocalized(deVal, enVal) {
    var lang = window.BHT && BHT.i18n ? BHT.i18n.getLang() : 'de';
    if (lang === 'en') {
      return enVal != null && enVal !== '' ? enVal : deVal || '';
    }
    return deVal != null && deVal !== '' ? deVal : enVal || '';
  }

  function applyClinicLocalizedStrings() {
    setText('clinic-treatments-context', pickLocalized(clinic.treatmentsContextDe, clinic.treatmentsContextEn));
    setText('clinic-overview-text', pickLocalized(clinic.overview, clinic.overviewEn));
    setText('clinic-overview-secondary', pickLocalized(clinic.overviewSecondaryDe, clinic.overviewSecondaryEn));
    setText('clinic-journey-text', pickLocalized(clinic.journeyDe, clinic.journeyEn));
    setText('clinic-equipment', pickLocalized(clinic.equipment, clinic.equipmentEn));
    setText('clinic-testimonial', pickLocalized(clinic.testimonial, clinic.testimonialEn));
    setText('clinic-cta-lead', pickLocalized(clinic.ctaLead, clinic.ctaLeadEn));
    setText('clinic-lead', pickLocalized(clinic.lead, clinic.leadEn));
  }

  setText('clinic-title', clinic.title);
  applyClinicLocalizedStrings();
  document.addEventListener('bht-lang-change', applyClinicLocalizedStrings);

  var heroBg = document.getElementById('clinic-hero-bg');
  if (heroBg) heroBg.style.backgroundImage = 'url(' + clinic.heroBg + ')';

  document.title = clinic.title + ' | Baltic Care Travel';

  var certList = document.getElementById('clinic-certs');
  if (certList) {
    clinic.certs.forEach(function (c) {
      var li = document.createElement('li');
      li.className = 'clinic-cert-list__item';
      li.textContent = c;
      certList.appendChild(li);
    });
  }

  var docGrid = document.getElementById('clinic-doctors');
  if (docGrid) {
    clinic.doctors.forEach(function (d) {
      var art = document.createElement('article');
      art.className = 'clinic-showcase-card';

      var media = document.createElement('div');
      media.className = 'clinic-showcase-card__media';

      var imgCol = document.createElement('div');
      imgCol.className = 'clinic-showcase-card__photo';
      var img = document.createElement('img');
      img.src = d.img;
      img.alt = '';
      img.width = 640;
      img.height = 720;
      img.loading = 'lazy';
      imgCol.appendChild(img);

      var videoCol = document.createElement('div');
      videoCol.className = 'clinic-showcase-card__video';
      videoCol.setAttribute('role', 'group');
      videoCol.setAttribute('aria-label', tr('clinic.videoPreviewAria') || 'Video');
      var vLabel = document.createElement('span');
      vLabel.className = 'clinic-showcase-card__video-label';
      vLabel.textContent = tr('clinic.videoPreviewLabel') || 'Kurzportrait';
      var vBtn = document.createElement('button');
      vBtn.type = 'button';
      vBtn.className = 'clinic-showcase-card__video-btn';
      vBtn.setAttribute('tabindex', '-1');
      vBtn.setAttribute('aria-hidden', 'true');
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '48');
      svg.setAttribute('height', '48');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M8 5v14l11-7z');
      svg.appendChild(path);
      vBtn.appendChild(svg);
      var vTime = document.createElement('span');
      vTime.className = 'clinic-showcase-card__video-time';
      vTime.setAttribute('aria-hidden', 'true');
      vTime.textContent = d.videoDuration || '0:45';
      videoCol.appendChild(vLabel);
      videoCol.appendChild(vBtn);
      videoCol.appendChild(vTime);

      media.appendChild(imgCol);
      media.appendChild(videoCol);

      var body = document.createElement('div');
      body.className = 'clinic-showcase-card__body';

      var h3 = document.createElement('h3');
      h3.className = 'clinic-showcase-card__name';
      h3.textContent = d.name;

      var pSpec = document.createElement('p');
      pSpec.className = 'clinic-showcase-card__spec';
      pSpec.textContent = d.spec;

      var svcTitle = document.createElement('p');
      svcTitle.className = 'clinic-showcase-card__svc-label';
      svcTitle.textContent = tr('clinic.servicesLabel') || 'Leistungen';

      var svcUl = document.createElement('ul');
      svcUl.className = 'clinic-showcase-card__services';
      (d.services || []).forEach(function (s) {
        var li = document.createElement('li');
        li.textContent = s;
        svcUl.appendChild(li);
      });

      var pBio = document.createElement('p');
      pBio.className = 'clinic-showcase-card__bio';
      pBio.textContent = d.bio || '';

      var ul = document.createElement('ul');
      ul.className = 'clinic-showcase-card__meta';

      function addMetaItem(label, value) {
        if (!value) return;
        var li = document.createElement('li');
        var strong = document.createElement('strong');
        strong.textContent = label + ': ';
        li.appendChild(strong);
        li.appendChild(document.createTextNode(value));
        ul.appendChild(li);
      }
      addMetaItem(tr('clinic.metaExperience') || 'Erfahrung', d.exp);
      addMetaItem(tr('clinic.metaTreatments') || 'Behandlungen', d.treatments);
      addMetaItem(tr('clinic.metaCertifications') || 'Zertifizierungen', d.cert);

      body.appendChild(h3);
      body.appendChild(pSpec);
      body.appendChild(svcTitle);
      body.appendChild(svcUl);
      body.appendChild(pBio);
      body.appendChild(ul);

      art.appendChild(media);
      art.appendChild(body);
      docGrid.appendChild(art);
    });
  }
}());
