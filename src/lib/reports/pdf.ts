import type { Report } from './generate';

/**
 * Tarot report → PDF.
 * HTML is rendered by headless Chromium so Hindi (Devanagari) shapes
 * correctly. On Vercel we use @sparticuz/chromium; locally set CHROME_PATH
 * (or have Google Chrome installed in the default location).
 */

const ASSET_BASE = (process.env.REPORT_ASSET_BASE || 'https://thedivinetarotonline.com').replace(/\/$/, '');

const esc = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// Card / logo images are fetched once per process, resized and JPEG/PNG
// compressed with sharp, then inlined as data URIs. Keeps the PDF ~1 MB
// instead of ~8 MB and removes any dependency on image loading at print time.
const imgCache = new Map<string, Promise<string>>();
async function dataUri(path: string, width: number, format: 'jpeg' | 'png' = 'jpeg'): Promise<string> {
  const key = `${path}|${width}|${format}`;
  if (!imgCache.has(key)) {
    imgCache.set(key, (async () => {
      const res = await fetch(`${ASSET_BASE}${encodeURI(path)}`, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`asset ${path} → ${res.status}`);
      const sharp = (await import('sharp')).default;
      const input = Buffer.from(await res.arrayBuffer());
      const pipe = sharp(input).resize({ width, withoutEnlargement: true });
      const out = format === 'png'
        ? await pipe.png({ compressionLevel: 9, palette: true }).toBuffer()
        : await pipe.flatten({ background: '#ffffff' }).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
      return `data:image/${format};base64,${out.toString('base64')}`;
    })().catch((e) => { imgCache.delete(key); throw e; }));
  }
  return imgCache.get(key)!;
}

export interface ReportImages { cards: Record<number, string>; thumbs: Record<number, string>; logo: string }

export async function loadReportImages(r: Report): Promise<ReportImages> {
  const cards: Record<number, string> = {};
  const thumbs: Record<number, string> = {};
  await Promise.all(r.months.flatMap((m) => [
    dataUri(m.image, 360).then((u) => { cards[m.cardId] = u; }),
    dataUri(m.image, 110).then((u) => { thumbs[m.cardId] = u; }),
  ]));
  const logo = await dataUri('/logo.png', 240, 'png');
  return { cards, thumbs, logo };
}

// Devanagari fallback in every stack so Hindi never renders as boxes.
const SANS = "'Inter','Noto Sans Devanagari',system-ui,sans-serif";
const SERIF = "'Cormorant Garamond','Noto Serif Devanagari','Noto Sans Devanagari',Georgia,serif";

export function buildReportHtml(r: Report, images: ReportImages): string {
  const L = r.labels;
  // Watermark is always the English brand name, as the client asked.
  const watermark = Array.from({ length: 8 }, () => '<div>THE DIVINE TAROT</div>').join('');
  const img = (id: number) => images.cards[id];

  const months = r.months.map((m) => `
    <section class="page month">
      <div class="month-head">
        <h2>${esc(m.month)} ${r.year}</h2>
        <p class="theme">${esc(m.theme)}</p>
      </div>
      <div class="month-body">
        <figure class="card">
          <img src="${img(m.cardId)}" alt="${esc(m.cardName)}" />
          <figcaption>${esc(m.cardName)}</figcaption>
        </figure>
        <div class="sections">
          ${m.sections.map((s) => `
            <h3>${esc(s.heading)}</h3>
            <p class="${s.emphasis ? 'em' : ''}">${esc(s.text)}</p>`).join('')}
          <table class="lucky"><tr>
            <td><span>${esc(L.luckyColor)}</span>${esc(m.luckyColor)}</td>
            <td><span>${esc(L.luckyNumber)}</span>${m.luckyNumber}</td>
          </tr></table>
        </div>
      </div>
    </section>`).join('');

  const rows = r.months.map((m) => `
    <tr><td>${esc(m.month)}</td><td>${esc(m.cardName)}</td><td>${esc(m.theme)}</td><td>${esc(m.luckyColor)}</td><td>${m.luckyNumber}</td></tr>`).join('');

  return `<!doctype html>
<html lang="${r.lang === 'hi' ? 'hi' : 'en'}"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Serif+Devanagari:wght@600&display=block" rel="stylesheet" />
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  :root { --ink:#2a2140; --muted:#6b6280; --purple:#3a2058; --gold:#b8892d; --soft:#f6f1fb; --line:#e3d8ef; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background:#fff; color:var(--ink); }
  body { font-family: ${SANS}; font-size: 11.5pt; line-height: 1.6; }
  h1, h2, .serif { font-family: ${SERIF}; color: var(--purple); font-weight: 600; }
  .watermark { position: fixed; inset: -20mm; z-index: 0; pointer-events: none; display:flex; flex-direction:column; justify-content:space-around; align-items:center; transform: rotate(-30deg); }
  .watermark div { font-family:'Cormorant Garamond', serif; font-size: 44pt; letter-spacing: .25em; color: rgba(58,32,88,.055); white-space: nowrap; font-weight:700; }
  .wm-logo { position: fixed; top: 50%; left: 50%; width: 90mm; transform: translate(-50%,-50%); opacity: .05; z-index:0; }
  .page { position: relative; z-index: 1; page-break-after: always; }
  .page:last-child { page-break-after: auto; }
  /* Cover */
  .cover { text-align:center; padding-top: 28mm; }
  .cover .logo { width: 26mm; margin-bottom: 6mm; }
  .cover .brand { font-size: 13pt; letter-spacing: .35em; color: var(--gold); text-transform: uppercase; font-family: ${SANS}; }
  .cover h1 { font-size: 30pt; margin: 6mm 0 2mm; line-height:1.2; }
  .cover .topic { font-size: 14pt; color: var(--muted); margin-bottom: 10mm; }
  .cover .meta { display:inline-block; text-align:left; border:1px solid var(--line); background: var(--soft); border-radius: 8px; padding: 5mm 8mm; margin-bottom: 10mm; }
  .cover .meta div { margin: 1mm 0; } .cover .meta span { color: var(--muted); display:inline-block; min-width: 32mm; }
  .cover .intro { max-width: 150mm; margin: 0 auto; color: #4a4160; font-size: 11pt; }
  .cover .star { color: var(--gold); font-size: 20pt; margin: 8mm 0 2mm; }
  .cover .tagline { font-family:${SERIF}; font-style: italic; font-size: 15pt; color: var(--purple); }
  .cover .fan { display:flex; justify-content:center; gap: 2mm; margin-top: 10mm; }
  .cover .fan img { width: 12.5mm; border-radius: 2mm; border: 1px solid var(--gold); }
  /* Month */
  .month-head h2 { font-size: 24pt; margin: 0; text-transform: uppercase; letter-spacing: .04em; }
  .month-head .theme { color: var(--gold); font-weight: 600; margin: 1mm 0 6mm; font-size: 12.5pt; }
  .month-body { display:flex; gap: 8mm; align-items:flex-start; }
  .card { margin:0; width: 60mm; flex-shrink:0; text-align:center; }
  .card img { width: 60mm; border-radius: 3mm; border: 1.5px solid var(--gold); box-shadow: 0 2mm 6mm rgba(58,32,88,.18); display:block; }
  .card figcaption { margin-top: 3mm; font-family:${SERIF}; font-weight:600; color: var(--purple); font-size: 13pt; }
  .sections { flex:1; min-width:0; }
  .sections h3 { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin: 0 0 1.5mm; font-weight:600; }
  .sections p { margin: 0 0 5mm; }
  .sections p.em { border-left: 2.5px solid var(--gold); padding-left: 4mm; color: var(--purple); font-style: ${r.lang === 'hi' ? 'normal' : 'italic'}; }
  table.lucky { border-collapse: collapse; width: 100%; margin-top: 2mm; }
  table.lucky td { border:1px solid var(--line); background: var(--soft); padding: 2.5mm 4mm; width:50%; }
  table.lucky td span { display:block; font-size: 8.5pt; color: var(--muted); text-transform: uppercase; letter-spacing:.08em; }
  .lang-hi .cover .brand, .lang-hi .sections h3, .lang-hi table.lucky td span { letter-spacing: 0; text-transform: none; }
  .lang-hi .sections h3 { font-size: 10.5pt; }
  /* Glance */
  .glance h2, .end h2 { font-size: 22pt; text-align:center; margin: 0 0 6mm; }
  table.g { width:100%; border-collapse: collapse; font-size: 9.5pt; }
  table.g th { background: var(--purple); color:#fff; text-align:left; padding: 2.2mm 3mm; font-weight:500; }
  table.g td { border-bottom: 1px solid var(--line); padding: 2.2mm 3mm; vertical-align: top; }
  table.g tr:nth-child(even) td { background: var(--soft); }
  .overall { margin-top: 9mm; }
  .overall h3, .end h3 { font-family:${SERIF}; font-size: 16pt; color: var(--purple); margin: 0 0 2mm; }
  .end ul { margin: 0 0 7mm; padding-left: 5mm; font-size: 10pt; }
  .end li { margin: 0 0 1.6mm; }
  .end .disc { font-size: 9pt; color: var(--muted); border-top: 1px solid var(--line); padding-top: 3mm; font-style: italic; }
</style></head>
<body class="lang-${r.lang}">
  <div class="watermark">${watermark}</div>
  <img class="wm-logo" src="${images.logo}" alt="" />

  <section class="page cover">
    <img class="logo" src="${images.logo}" alt="" />
    <div class="brand">${esc(L.brand)}</div>
    <h1>${r.year} ${esc(L.report)}</h1>
    <div class="topic">${esc(r.topicLabel)}</div>
    <div class="meta">
      <div><span>${esc(L.preparedFor)}</span>${esc(r.name)}</div>
      ${r.partner ? `<div><span>${esc(L.partner)}</span>${esc(r.partner)}</div>` : ''}
      <div><span>${esc(L.year)}</span>${r.year}</div>
    </div>
    <p class="intro">${esc(r.intro)}</p>
    <div class="star">✦</div>
    <div class="tagline">${esc(r.tagline)}</div>
    <div class="fan">${r.months.map((m) => `<img src="${images.thumbs[m.cardId]}" alt="" />`).join('')}</div>
  </section>

  ${months}

  <section class="page glance">
    <h2>${r.year} — ${esc(L.glance)}</h2>
    <table class="g">
      <thead><tr><th>${esc(L.month)}</th><th>${esc(L.card)}</th><th>${esc(L.theme)}</th><th>${esc(L.luckyColor)}</th><th>${esc(L.no)}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="overall">
      <h3>${esc(L.overall)}</h3>
      <p>${esc(r.overall)}</p>
    </div>
  </section>

  <section class="page end">
    <h2>✦</h2>
    <h3>${esc(L.howToRead)}</h3>
    <ul>${r.howToRead.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <h3>${esc(L.guidelines)}</h3>
    <ul>${r.guidelines.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <p class="disc">${esc(L.disclaimer)}</p>
  </section>
</body></html>`;
}

async function launchBrowser() {
  const puppeteer = (await import('puppeteer-core')).default;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import('@sparticuz/chromium')).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const executablePath =
    process.env.CHROME_PATH ||
    (process.platform === 'win32'
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : process.platform === 'darwin'
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        : '/usr/bin/google-chrome');
  return puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
}

export async function renderReportPdf(report: Report): Promise<Buffer> {
  const html = buildReportHtml(report, await loadReportImages(report));
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.evaluate(() => (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready);
    const footer = `<div style="width:100%;font-size:7.5pt;color:#8a809c;text-align:center;font-family:Arial,sans-serif;">
      The Divine Tarot • ${esc(report.name)} • ${report.year} • <span class="pageNumber"></span> / <span class="totalPages"></span></div>`;
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: footer,
      margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => undefined);
  }
}
