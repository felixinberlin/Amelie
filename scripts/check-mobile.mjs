#!/usr/bin/env node
// Handy-Check für eigenständige Demo-Seiten (public/**/*.html).
//
// Warum: Der Gründungsnavigator war am Desktop fertig und am Handy halb
// unbenutzbar (Kopf 250 px hoch, 1100-px-SVG mit 5-px-Schrift). Niemand hatte
// es bei Telefonbreite angesehen. Dieser Check macht das zur Pflicht vor dem
// Merge einer Demo.
//
// Je Seite und Breite (360 und 390 px, Touch, Mobilmodus):
//   - kein waagrechtes Scrollen der Seite (scrollWidth ≤ Breite + 1)
//   - keine JavaScript-Fehler beim Laden (pageerror, console.error)
//   - Viewport-Meta vorhanden
// Elemente in eigenen Scroll-Containern (overflow-x:auto) sind erlaubt.
//
// Aufruf:  npm run check:mobile                 (alle public/**/*.html)
//          npm run check:mobile -- <datei> …    (einzelne Seiten)
// Browser: PLAYWRIGHT_CHROMIUM oder /opt/pw-browsers/chromium, sonst Playwright-Standard.
// Exit 0 = alles in Ordnung, 1 = Befund, 3 = nicht geprüft (kein Browser).
// Ein übersprungener Check ist nie grün.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BREITEN = [360, 390];

function htmlDateien(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlDateien(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const args = process.argv.slice(2);
const seiten = args.length ? args.map((a) => resolve(a)) : htmlDateien(resolve(root, 'public'));

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Handy-Check NICHT geprüft: Paket playwright fehlt (npm install).');
  process.exit(3);
}
const kandidaten = [process.env.PLAYWRIGHT_CHROMIUM, '/opt/pw-browsers/chromium'].filter((p) => p && existsSync(p));
let browser;
try {
  browser = await chromium.launch(kandidaten.length ? { executablePath: kandidaten[0] } : {});
} catch (e) {
  console.error('Handy-Check NICHT geprüft: kein Chromium startbar (PLAYWRIGHT_CHROMIUM setzen).\n  ' + String(e.message).split('\n')[0]);
  process.exit(3);
}

// Über HTTP ausliefern statt file://, sonst scheitern fetch()-Aufrufe der Seiten an CORS.
const pub = resolve(root, 'public');
const TYPEN = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const server = createServer((req, res) => {
  const pfad = resolve(pub, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const ziel = pfad.endsWith('/') || (existsSync(pfad) && statSync(pfad).isDirectory()) ? join(pfad, 'index.html') : pfad;
  if (!ziel.startsWith(pub) || !existsSync(ziel)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPEN[ziel.slice(ziel.lastIndexOf('.'))] ?? 'application/octet-stream' });
  res.end(readFileSync(ziel));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const basis = `http://127.0.0.1:${server.address().port}/`;
const urlVon = (datei) => {
  const r = relative(pub, datei);
  if (r.startsWith('..')) throw new Error(`${datei} liegt nicht unter public/`);
  return basis + r.split('\\').join('/');
};

const befunde = [];
for (const datei of seiten) {
  const rel = relative(root, datei);
  if (!/<meta[^>]+name=["']viewport["']/i.test(readFileSync(datei, 'utf8'))) befunde.push(`${rel}: keine <meta name="viewport">`);
  for (const breite of BREITEN) {
    const page = await browser.newPage({ viewport: { width: breite, height: 800 }, isMobile: true, hasTouch: true });
    const fehler = [];
    page.on('pageerror', (e) => fehler.push(e.message));
    // „Failed to load resource“ sagt nicht, welche Datei; die Antwort schon. favicon.ico ist kein Befund.
    page.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) fehler.push(m.text()); });
    page.on('response', (res) => { if (res.status() >= 400 && !res.url().endsWith('/favicon.ico')) fehler.push(`HTTP ${res.status()} ${res.url().replace(basis, '/')}`); });
    await page.goto(urlVon(datei));
    await page.waitForTimeout(300);
    // Gegen die feste Gerätebreite messen: Chrome zoomt im Mobilmodus heraus,
    // dann wächst innerWidth mit dem Inhalt und ein Überlauf fiele nie auf.
    const r = await page.evaluate((vw) => {
      const sw = document.documentElement.scrollWidth;
      // Schuldige: Blätter, die rechts überstehen und nicht in einem Scroll-Container liegen
      const imScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden') return true; } return false; };
      const schuldige = [...document.body.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > vw + 1 && !imScroller(el))
        .filter((el) => ![...el.children].some((c) => c.getBoundingClientRect().right > vw + 1))
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''}`);
      return { sw, vw, schuldige };
    }, breite);
    if (r.sw > r.vw + 1) befunde.push(`${rel} @${breite}px: Seite ${r.sw}px breit (waagrechtes Scrollen); überstehend: ${r.schuldige.join(', ') || '?'}`);
    for (const f of fehler) befunde.push(`${rel} @${breite}px: JS-Fehler: ${f}`);
    await page.close();
  }
}
await browser.close();
server.close();

if (befunde.length) {
  console.error(`Handy-Check: ${befunde.length} Befund(e)\n  ` + befunde.join('\n  '));
  process.exit(1);
}
console.log(`Handy-Check in Ordnung: ${seiten.length} Seite(n) bei ${BREITEN.join(' und ')} px, kein waagrechtes Scrollen, keine JS-Fehler.`);
