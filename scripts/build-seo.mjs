/**
 * Writes guide pages, injects canonical / Open Graph / JSON-LD into existing pages,
 * and emits robots.txt, sitemap.xml and llms.txt.
 *
 * Run: node scripts/build-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { guides, extraLinks } from '../seo/guides.mjs';
import {
  ORIGIN,
  UPDATED,
  UPDATED_LABEL,
  ENTITY,
  DISCLAIMER,
  ROBOTS_INDEX,
  existingPages,
} from '../seo/site.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const guideFiles = new Set(guides.map((g) => g.file));

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decode(value) {
  return String(value)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function absUrl(urlPath) {
  if (!urlPath || urlPath === '/') return ORIGIN + '/';
  if (urlPath.startsWith('http')) return urlPath;
  return ORIGIN + (urlPath.startsWith('/') ? urlPath : '/' + urlPath);
}

function pageUrl(rel) {
  if (rel === 'index.html') return ORIGIN + '/';
  return ORIGIN + '/' + rel.split(path.sep).join('/');
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'public', 'seo', 'scripts', 'api', 'src', 'supabase'].includes(entry.name)) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) out.push(path.relative(root, full).split(path.sep).join('/'));
  }
  return out;
}

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORIGIN + '/#organization',
    name: 'Baltic Care Travel',
    alternateName: 'Baltic Health Travel',
    url: ORIGIN + '/',
    logo: { '@type': 'ImageObject', url: ORIGIN + '/images/logo.png' },
    description: ENTITY,
    areaServed: [
      { '@type': 'Country', name: 'Deutschland' },
      { '@type': 'Country', name: 'Lettland' },
    ],
    knowsLanguage: ['de', 'en'],
    knowsAbout: [
      'Zahnbehandlung in Lettland',
      'Zahnimplantate',
      'Zahnersatz',
      'All-on-4',
      'Veneers',
      'Patientenkoordination',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Patientenkoordination',
      availableLanguage: ['German', 'English'],
      url: ORIGIN + '/contact.html',
      areaServed: 'DE',
    },
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ORIGIN + '/#website',
    url: ORIGIN + '/',
    name: 'Baltic Care Travel',
    inLanguage: 'de',
    publisher: { '@id': ORIGIN + '/#organization' },
  };
}

function serviceNode() {
  return {
    '@type': 'Service',
    '@id': ORIGIN + '/#dental-coordination',
    name: 'Koordination von Zahnbehandlungen in Lettland',
    serviceType: 'Patientenkoordination Zahnmedizin',
    provider: { '@id': ORIGIN + '/#organization' },
    areaServed: { '@type': 'Country', name: 'Deutschland' },
    audience: {
      '@type': 'PeopleAudience',
      audienceType: 'Patientinnen und Patienten aus Deutschland',
    },
    offers: {
      '@type': 'Offer',
      name: 'Patientenkoordination',
      price: '250',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: ORIGIN + '/prices.html',
      description:
        'Einmalige Koordinationsgebühr, nicht erstattungsfähig. Medizinische Leistungen werden direkt von der Klinik abgerechnet.',
    },
  };
}

function breadcrumbNode(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqNode(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

function parseFaqs(html) {
  const faqs = [];
  const re = /<details class="faq-acc-item">\s*<summary[^>]*>([\s\S]*?)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = re.exec(html))) {
    const q = decode(match[1]);
    const a = decode(match[2]);
    if (q && a) faqs.push({ q, a });
  }
  return faqs;
}

function parseHowTo(html) {
  const steps = [];
  const re = /<h4 class="journey-card-title"[^>]*>([\s\S]*?)<\/h4>\s*<p class="journey-card-desc"[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = re.exec(html))) {
    const name = decode(match[1]);
    const text = decode(match[2]);
    if (name && text) steps.push({ '@type': 'HowToStep', name, text });
  }
  if (steps.length < 2) return null;
  return {
    '@type': 'HowTo',
    name: 'Ablauf einer Behandlungskoordination mit Baltic Care Travel',
    description: 'Von der Anfrage über Unterlagen und Klinik-Matching bis zur Behandlung in Lettland.',
    step: steps,
  };
}

function readTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decode(match[1]) : 'Baltic Care Travel';
}

function readDescription(html) {
  const match = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i);
  if (!match) return '';
  const content = match[0].match(/content="([^"]*)"/);
  return content ? decode(content[1]) : '';
}

function replaceTitle(html, title) {
  if (!title) return html;
  return html.replace(/<title(\s[^>]*)?>[\s\S]*?<\/title>/i, (_, attrs = '') => {
    let next = attrs || '';
    if (next.includes('data-i18n-title') && !next.includes('data-i18n-title-mode')) {
      next += ' data-i18n-title-mode="full"';
    }
    return `<title${next}>${esc(title)}</title>`;
  });
}

function replaceDescription(html, description) {
  if (!description) return html;
  const re = /<meta\b[^>]*name=["']description["'][^>]*>/i;
  const match = html.match(re);
  if (!match) {
    return html.replace(/<\/title>/i, `</title>\n  <meta name="description" content="${esc(description)}" />`);
  }
  const tag = match[0];
  const next = /content="/.test(tag)
    ? tag.replace(/content="[^"]*"/, `content="${esc(description)}"`)
    : tag.replace('<meta', `<meta content="${esc(description)}"`);
  return html.replace(tag, next);
}

function headBlock({ canonical, title, description, robots, image, graph }) {
  const imageUrl = absUrl(image || '/images/home-hero.jpg');
  return `<!-- seo:start -->
  <link rel="canonical" href="${esc(canonical)}" />
  <link rel="alternate" hreflang="de" href="${esc(canonical)}" />
  <link rel="alternate" hreflang="x-default" href="${esc(canonical)}" />
  <link rel="alternate" type="text/plain" href="${ORIGIN}/llms.txt" title="LLM-readable site summary" />
  <link rel="icon" href="${ORIGIN}/images/logo.png" type="image/png" />
  <meta name="robots" content="${esc(robots)}" />
  <meta name="author" content="Baltic Care Travel" />
  <meta name="theme-color" content="#002146" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Baltic Care Travel" />
  <meta property="og:locale" content="de_DE" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(imageUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(imageUrl)}" />
  <script type="application/ld+json">${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}</script>
  <!-- seo:end -->`;
}

function upsertHead(html, block) {
  if (html.includes('<!-- seo:start -->')) {
    return html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, block);
  }
  return html.replace(/<\/title>/i, `</title>\n  ${block}`);
}

function ensureGuideLinks(html, rel) {
  const prefix = rel.includes('/') ? '../'.repeat(rel.split('/').length - 1) : '';
  html = html.replace(/\s*<li><a href="[^"]*ratgeber\.html" data-i18n="nav\.guides">[\s\S]*?<\/a><\/li>/g, '');
  const footerHref = `${prefix}ratgeber.html`;
  const footerNav = html.match(/<nav class="footer-nav"[^>]*>[\s\S]*?<\/nav>/);
  if (footerNav && !footerNav[0].includes('ratgeber.html')) {
    html = html.replace(
      /(<nav class="footer-nav"[^>]*>)/,
      `$1\n        <a href="${footerHref}" data-i18n="nav.guides">Ratgeber</a>`
    );
  }
  return html;
}

function buildGraph({ canonical, title, description, image, crumbs, faqs, howto, service, home, article }) {
  const graph = [organization(), websiteNode()];
  const page = {
    '@type': 'WebPage',
    '@id': canonical + '#webpage',
    url: canonical,
    name: title,
    description,
    inLanguage: 'de',
    isPartOf: { '@id': ORIGIN + '/#website' },
    about: { '@id': ORIGIN + '/#organization' },
    primaryImageOfPage: absUrl(image || '/images/home-hero.jpg'),
    dateModified: UPDATED,
  };
  if (article) {
    page.speakable = {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.seo-answer__text', 'h1'],
    };
  }
  graph.push(page);
  if (crumbs && crumbs.length) graph.push(breadcrumbNode(crumbs));
  if (faqs && faqs.length) graph.push(faqNode(faqs));
  if (howto) graph.push(howto);
  if (service) graph.push(serviceNode());
  if (home) {
    graph.push({
      '@type': 'ItemList',
      name: 'Ratgeber zur Zahnbehandlung in Lettland',
      itemListElement: guides
        .filter((guide) => guide.kind !== 'hub')
        .map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: guide.h1,
          url: pageUrl(guide.file),
        })),
    });
  }
  if (article) {
    graph.push({
      '@type': 'Article',
      headline: article.headline,
      description,
      datePublished: UPDATED,
      dateModified: UPDATED,
      inLanguage: 'de',
      image: absUrl(image || '/images/home-hero.jpg'),
      author: { '@id': ORIGIN + '/#organization' },
      publisher: { '@id': ORIGIN + '/#organization' },
      mainEntityOfPage: canonical,
    });
  }
  return graph;
}

function crumbsFor(rel, meta, title) {
  if (rel === 'index.html') return [];
  const name = meta.crumb || title.split('|')[0].trim();
  return [
    { name: 'Start', url: ORIGIN + '/' },
    { name, url: pageUrl(rel) },
  ];
}

function injectExisting() {
  for (const rel of walkHtml(root)) {
    if (guideFiles.has(rel)) continue;
    const meta = existingPages[rel] || {};
    const full = path.join(root, rel);
    let html = fs.readFileSync(full, 'utf8');
    html = ensureGuideLinks(html, rel);
    if (meta.title) html = replaceTitle(html, meta.title);
    if (meta.description) html = replaceDescription(html, meta.description);
    const title = meta.title || readTitle(html);
    const description = meta.description || readDescription(html) || title;
    const robots = meta.robots || ROBOTS_INDEX;
    const canonical = pageUrl(rel);
    const faqs = parseFaqs(html);
    const howto = meta.howto ? parseHowTo(html) : null;
    const graph = buildGraph({
      canonical,
      title,
      description,
      image: meta.image,
      crumbs: crumbsFor(rel, meta, title),
      faqs,
      howto,
      service: Boolean(meta.service) && !String(robots).includes('noindex'),
      home: Boolean(meta.home),
    });
    html = upsertHead(html, headBlock({ canonical, title, description, robots, image: meta.image, graph }));
    fs.writeFileSync(full, html);
  }
}

function resolveRelated(guide) {
  return (guide.related || []).map((id) => {
    const found = guides.find((item) => item.id === id);
    if (found) return { href: found.file, title: found.h1, text: found.answer };
    if (extraLinks[id]) return extraLinks[id];
    throw new Error('Unknown related id: ' + id);
  });
}

function renderParts(items, tag) {
  return items.map((item) => `<${tag}>${item}</${tag}>`).join('\n');
}

function renderTable(table) {
  if (!table) return '';
  const head = ['Behandlung', 'Lettland', 'Deutschland', 'Mögliche Ersparnis']
    .map((cell) => `<th scope="col">${esc(cell)}</th>`)
    .join('');
  const body = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`)
    .join('\n');
  return `<p class="seo-table-caption">${esc(table.caption)}</p>
<div class="seo-table-wrap"><table class="seo-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderMatrix(matrix) {
  if (!matrix) return '';
  const head = matrix.headers.map((cell) => `<th scope="col">${esc(cell)}</th>`).join('');
  const body = matrix.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`)
    .join('\n');
  return `<p class="seo-table-caption">${esc(matrix.caption)}</p>
<div class="seo-table-wrap"><table class="seo-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderFacts(facts) {
  if (!facts) return '';
  const rows = facts
    .map(([term, detail]) => `<div><dt>${esc(term)}</dt><dd>${esc(detail)}</dd></div>`)
    .join('');
  return `<dl class="seo-facts">${rows}</dl>`;
}

function renderSections(sections) {
  return (sections || [])
    .map((section) => {
      const paras = (section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join('\n');
      const list = section.list ? `<ul>${section.list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '';
      return `<section id="${esc(section.id)}"><h2>${esc(section.h2)}</h2>${list}${paras}</section>`;
    })
    .join('\n');
}

function renderFaqs(faqs) {
  const items = faqs
    .map(
      (faq) =>
        `<details class="faq-acc-item"><summary class="faq-acc-summary">${esc(faq.q)}</summary><div class="faq-acc-body"><p>${esc(faq.a)}</p></div></details>`
    )
    .join('\n');
  return `<section class="seo-faq" id="faq"><h2>Häufige Fragen</h2><div class="faq-page-accordion">${items}</div></section>`;
}

function renderRelated(links) {
  if (!links.length) return '';
  const cards = links
    .map(
      (link) =>
        `<a href="${esc(link.href)}"><strong>${esc(link.title)}</strong><span>${esc(link.text)}</span></a>`
    )
    .join('');
  return `<section id="weiter"><h2>Weiterlesen</h2><div class="seo-related">${cards}</div></section>`;
}

function renderHubCards() {
  return guides
    .filter((guide) => guide.kind !== 'hub')
    .map(
      (guide) =>
        `<a href="${esc(guide.file)}"><h2>${esc(guide.h1)}</h2><p>${esc(guide.answer)}</p></a>`
    )
    .join('\n');
}

function renderGuide(guide, chrome) {
  const canonical = pageUrl(guide.file);
  const crumbs = [
    { name: 'Start', url: ORIGIN + '/' },
    { name: 'Ratgeber', url: pageUrl('ratgeber.html') },
  ];
  if (guide.kind !== 'hub') crumbs.push({ name: guide.h1, url: canonical });
  const graph = buildGraph({
    canonical,
    title: guide.title,
    description: guide.description,
    image: guide.image,
    crumbs,
    faqs: guide.faqs,
    service: Boolean(guide.service),
    article: guide.kind === 'hub' ? null : { headline: guide.h1 },
  });
  if (guide.kind === 'hub') {
    graph.push({
      '@type': 'ItemList',
      name: 'Ratgeber Zahnbehandlung Lettland',
      itemListElement: guides
        .filter((item) => item.kind !== 'hub')
        .map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.h1,
          url: pageUrl(item.file),
        })),
    });
  }
  const crumbHtml = `<nav class="seo-crumbs" aria-label="Brotkrumen"><ol>${crumbs
    .map((item, index) => {
      if (index === crumbs.length - 1) return `<li aria-current="page">${esc(item.name)}</li>`;
      const href = item.url === ORIGIN + '/' ? 'index.html' : item.url.replace(ORIGIN + '/', '');
      return `<li><a href="${esc(href)}">${esc(item.name)}</a></li>`;
    })
    .join('')}</ol></nav>`;
  const hub = guide.kind === 'hub' ? `<div class="seo-hub-list">${renderHubCards()}</div>` : '';
  const main = `<main id="content">
  <header class="seo-mast" style="background-image: linear-gradient(180deg, rgba(0,16,40,0.55), rgba(0,16,40,0.88)), url('${esc(guide.mast)}')">
    <p class="section-eyebrow">${esc(guide.eyebrow)}</p>
    <h1>${esc(guide.h1)}</h1>
    <p class="seo-mast__sub">${esc(guide.subtitle)}</p>
    <div class="seo-actions">
      <a href="contact.html" class="btn-hero-primary">Kostenfreies Erstgespräch</a>
      <a href="#kurzantwort" class="btn-hero-ghost">Zur Kurzantwort</a>
    </div>
  </header>
  <div class="seo-wrap seo-prose">
    ${crumbHtml}
    <section class="seo-answer" id="kurzantwort">
      <p class="seo-answer__label">Kurzantwort</p>
      <p class="seo-answer__text">${esc(guide.answer)}</p>
    </section>
    <p class="seo-entity">${esc(ENTITY)}</p>
    ${renderFacts(guide.facts)}
    ${hub}
    ${renderSections(guide.sections)}
    ${renderTable(guide.table)}
    ${renderMatrix(guide.matrix)}
    ${renderFaqs(guide.faqs)}
    ${renderRelated(resolveRelated(guide))}
    <p class="seo-updated">Aktualisiert am ${esc(UPDATED_LABEL)}.</p>
    <p class="seo-disclaimer">${esc(DISCLAIMER)}</p>
  </div>
  <section class="section section-cta-final">
    <div class="cta-final-inner">
      <p class="cta-final-eyebrow">Nächster Schritt</p>
      <h2 class="cta-final-title">Sie möchten Ihre Situation einordnen lassen?</h2>
      <p class="cta-final-subtitle">Das Erstgespräch ist kostenfrei. Die Klinik entscheidet über die Behandlung.</p>
      <div class="cta-final-actions">
        <a href="contact.html" class="btn-cta-primary">Kostenfreies Erstgespräch</a>
        <a href="prices.html" class="btn-cta-ghost">Zu den Orientierungswerten</a>
      </div>
    </div>
  </section>
</main>`;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${esc(guide.description)}" />
  <title>${esc(guide.title)}</title>
  ${headBlock({
    canonical,
    title: guide.title,
    description: guide.description,
    robots: ROBOTS_INDEX,
    image: guide.image,
    graph,
  })}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <link rel="stylesheet" href="home.css" />
  <link rel="stylesheet" href="seo.css" />
  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="seo-page" data-seo-generated="true">
  <a class="seo-skip" href="#content">Zum Inhalt</a>
  ${chrome.header}
  ${main}
  ${chrome.footer}
  <script src="i18n.js"></script>
  <script src="script.js"></script>
</body>
</html>
`;
}

function chromeFromSite() {
  const sample = fs.readFileSync(path.join(root, 'treatment-dental.html'), 'utf8');
  const header = sample.match(/<header class="site-header">[\s\S]*?<\/header>/);
  const footer = sample.match(/<footer class="site-footer site-footer-home">[\s\S]*?<\/footer>/);
  if (!header || !footer) throw new Error('Could not copy header or footer from treatment-dental.html');
  return { header: header[0], footer: footer[0] };
}

function writeGuides() {
  const chrome = chromeFromSite();
  for (const guide of guides) {
    fs.writeFileSync(path.join(root, guide.file), renderGuide(guide, chrome));
  }
  for (const rel of walkHtml(root)) {
    if (!rel.includes('/') && rel.endsWith('.html')) {
      const full = path.join(root, rel);
      const html = fs.readFileSync(full, 'utf8');
      if (html.includes('data-seo-generated="true"') && !guideFiles.has(rel)) fs.unlinkSync(full);
    }
  }
}

function sitemapXml() {
  const urls = [];
  for (const rel of Object.keys(existingPages)) {
    const meta = existingPages[rel];
    if (meta.robots && meta.robots.includes('noindex')) continue;
    urls.push({ loc: pageUrl(rel), priority: meta.priority || '0.5', changefreq: meta.changefreq || 'monthly' });
  }
  for (const guide of guides) {
    urls.push({ loc: pageUrl(guide.file), priority: guide.priority || '0.8', changefreq: 'monthly' });
  }
  const body = urls
    .map(
      (url) => `  <url>
    <loc>${esc(url.loc)}</loc>
    <lastmod>${UPDATED}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function robotsTxt() {
  return `# Baltic Care Travel — public pages may be crawled, including by answer and generative engines.
User-agent: *
Allow: /
Disallow: /login.html
Disallow: /api/
Disallow: /src/

Sitemap: ${ORIGIN}/sitemap.xml
`;
}

function llmsTxt() {
  const lines = [];
  lines.push('# Baltic Care Travel');
  lines.push('');
  lines.push('> ' + ENTITY);
  lines.push('>');
  lines.push('> ' + DISCLAIMER);
  lines.push('');
  lines.push('## Canonical');
  lines.push('');
  lines.push(`- Site: ${ORIGIN}/`);
  lines.push('- Language of these pages: German (de). An English toggle exists in the browser; it does not create separate URLs.');
  lines.push('- Baltic Care Travel is a coordinator. It is not a dental clinic and does not diagnose or treat.');
  lines.push('- Live service: dental coordination in Latvia (Riga) for patients from Germany.');
  lines.push('- Not live: fertility / IVF and orthopaedics (in preparation). Plastic surgery is not offered.');
  lines.push('- Coordination fee: 250 EUR once, not reimbursable by insurance.');
  lines.push('- Treatment contract and treatment payment: always directly with the clinic.');
  lines.push('');
  lines.push('## Services');
  lines.push('');
  lines.push(`- [Zahnbehandlung in Lettland](${ORIGIN}/treatment-dental.html): Koordination von Implantaten, Zahnersatz, All-on-4 und Veneers.`);
  lines.push(`- [Kosten](${ORIGIN}/prices.html): Orientierungswerte und die Koordinationsgebühr von 250 EUR.`);
  lines.push(`- [Ablauf](${ORIGIN}/how-it-works.html): Anfrage, Unterlagen, Klinik-Matching, Begleitung.`);
  lines.push(`- [Kliniken in Riga](${ORIGIN}/clinics.html): Partnerprofile. Baltic Care Travel ist nicht die Praxis.`);
  lines.push(`- [Kontakt](${ORIGIN}/contact.html): Kostenfreies Erstgespräch.`);
  lines.push('');
  lines.push('## Guides');
  lines.push('');
  for (const guide of guides) {
    lines.push(`- [${guide.h1}](${pageUrl(guide.file)}): ${guide.answer}`);
  }
  lines.push('');
  lines.push('## Orientation prices (not quotes)');
  lines.push('');
  lines.push('Source: ' + ORIGIN + '/prices.html, updated ' + UPDATED + '.');
  lines.push('- Single implant including abutment and crown: Latvia 1420–1710 EUR; typical Germany 2500–4000 EUR.');
  lines.push('- Four implants including crowns: Latvia 5680–6840 EUR; typical Germany 10000–16000 EUR.');
  lines.push('- All-on-4 zirconia, one jaw: Latvia 8500–11000 EUR; typical Germany 15000–25000 EUR.');
  lines.push('- All-on-6 zirconia, one jaw: Latvia 9000–12000 EUR; typical Germany 18000–30000 EUR.');
  lines.push('- Eight ceramic veneers: Latvia from 4800 EUR; typical Germany 8000–12000 EUR.');
  lines.push('- "Up to" savings are the gap between the low Latvia figure and the high Germany figure. They are not a promise.');
  lines.push('- Flight, lodging, and extras such as bone grafting are not included.');
  lines.push('- Prices for Hungary, Poland, Turkey, fertility, orthopaedics, or plastic surgery are intentionally not published.');
  lines.push('');
  lines.push('## Policies');
  lines.push('');
  lines.push(`- [Impressum](${ORIGIN}/legal/impressum.html)`);
  lines.push(`- [Datenschutz](${ORIGIN}/legal/privacy.html)`);
  lines.push(`- [AGB](${ORIGIN}/legal/terms.html)`);
  lines.push('');
  return lines.join('\n');
}

function validate() {
  const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (new Set(locs).size !== locs.length) throw new Error('Duplicate sitemap URLs');
  for (const loc of locs) {
    const rel = loc === ORIGIN + '/' ? 'index.html' : loc.replace(ORIGIN + '/', '');
    if (!fs.existsSync(path.join(root, rel))) throw new Error('Sitemap URL has no file: ' + loc);
    const html = fs.readFileSync(path.join(root, rel), 'utf8');
    if (!html.includes('rel="canonical"')) throw new Error('Missing canonical: ' + rel);
    if (html.includes('noindex') && sitemap.includes(loc)) throw new Error('Noindex URL in sitemap: ' + loc);
    const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ld) throw new Error('Missing JSON-LD: ' + rel);
    JSON.parse(ld[1]);
  }
  for (const guide of guides) {
    const html = fs.readFileSync(path.join(root, guide.file), 'utf8');
    const h1s = html.match(/<h1[\s>]/g) || [];
    if (h1s.length !== 1) throw new Error(guide.file + ' should have one mast h1, found ' + h1s.length);
    if (!html.includes('id="kurzantwort"')) throw new Error(guide.file + ' missing answer');
  }
  if (!fs.readFileSync(path.join(root, 'public', 'robots.txt'), 'utf8').includes('Sitemap:')) {
    throw new Error('robots.txt missing sitemap');
  }
}

export function guideEntries() {
  return Object.fromEntries(guides.map((guide) => [guide.id, path.join(root, guide.file)]));
}

let generated = false;

export function generateSeo() {
  if (generated) return;
  generated = true;
  injectExisting();
  writeGuides();
  fs.mkdirSync(path.join(root, 'public'), { recursive: true });
  fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robotsTxt());
  fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemapXml());
  fs.writeFileSync(path.join(root, 'public', 'llms.txt'), llmsTxt());
  validate();
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  generateSeo();
  console.log('SEO package written: ' + guides.length + ' guide pages, sitemap, robots.txt, llms.txt');
}
