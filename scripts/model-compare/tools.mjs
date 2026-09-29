// Werkzeuge, die jedes verglichene Modell gleich bekommt (Parität: nur so ist „[Seite] ohne geholte URL“ eine faire Messung).
//   bib_find   das Gedächtnis durchsuchen (nur lesend, wie `npm run bib -- find`)
//   web_fetch  eine Webseite holen (Text, gekürzt); Aufrufe werden protokolliert
// Die Definitionen sind anbieterneutral (JSON-Schema); providers.mjs übersetzt sie.

import { findAll } from '../bibliothek-lib.mjs';

export const TOOL_DEFS = [
  {
    name: 'bib_find',
    description: 'Durchsucht Amélies Gedächtnis (Prüfprotokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs). Mehrere Begriffe müssen alle im selben Eintrag stehen (any=true: einer genügt). Treffer mit * sind ein „schon da“-Signal (Protokoll, Friedhof, Dosen, Kandidaten). Nutze das vor jedem Urteil.',
    input_schema: {
      type: 'object',
      properties: {
        terms: { type: 'array', items: { type: 'string' }, description: 'Suchbegriffe, klein geschrieben, ohne Sonderzeichen' },
        any: { type: 'boolean', description: 'true = ein Begriff genügt' },
      },
      required: ['terms'],
    },
  },
  {
    name: 'web_fetch',
    description: 'Holt eine Webseite (http/https) und gibt den Text zurück (gekürzt auf ca. 8000 Zeichen). Nur wenn du eine Seite hiermit geholt hast, darfst du sie mit [Seite] belegen; sonst [Schnipsel].',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  },
];

const PRIVATE_HOST = /^(localhost|.*\.local|.*\.internal)$|^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1)/i;

/** HTML → lesbarer Text. */
export function htmlToText(html) {
  return String(html)
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function defaultFetch(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: 'follow', headers: { 'user-agent': 'amelie-modellvergleich/1.0', accept: 'text/html,text/plain,application/xhtml+xml' } });
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!/text|html|xml|json/i.test(type)) throw new Error(`Inhaltstyp ${type || '?'} wird nicht gelesen`);
  return { status: res.status, text: await res.text(), type };
}

/**
 * Handler für einen Lauf. Jeder Lauf bekommt eigene Handler (eigene Zählung).
 * opts: { quellen (Register für find), fetchFn (für Tests), maxFetch }
 */
export function createHandlers({ quellen = [], fetchFn = defaultFetch, maxFetch = 12, findFn = findAll } = {}) {
  let fetchCount = 0;
  return {
    async bib_find(args) {
      const terms = Array.isArray(args?.terms) ? args.terms.map(String).filter(Boolean) : [];
      if (!terms.length) return 'Fehler: terms fehlt (Liste von Begriffen).';
      const hits = findFn(terms, { any: !!args.any, quellen });
      const bindend = hits.filter((h) => h.bindend);
      const lines = hits.slice(0, 12).map((h) => `${h.kind}${h.bindend ? '*' : ''} | ${h.id || ''} | ${String(h.title).slice(0, 70)} | ${h.where}`);
      return `${hits.length} Treffer, ${bindend.length} davon „schon da“ (*)${hits.length > 12 ? ', erste 12:' : ':'}\n${lines.join('\n') || '(keine)'}`;
    },
    async web_fetch(args) {
      let u;
      try { u = new URL(String(args?.url ?? '')); } catch { return 'Fehler: keine gültige URL.'; }
      if (!/^https?:$/.test(u.protocol)) return 'Fehler: nur http/https.';
      if (PRIVATE_HOST.test(u.hostname)) return 'Fehler: interne Adressen werden nicht geholt.';
      if (fetchCount >= maxFetch) return `Fehler: Limit von ${maxFetch} Seiten je Lauf erreicht.`;
      fetchCount++;
      try {
        const r = await fetchFn(u.href);
        const text = /html|xml/i.test(r.type ?? '') ? htmlToText(r.text) : String(r.text).replace(/\s+/g, ' ').trim();
        return `[Seite geholt] ${u.href}\n${text.slice(0, 8000)}${text.length > 8000 ? '\n[… gekürzt]' : ''}`;
      } catch (e) {
        return `Fehler beim Holen von ${u.href}: ${e.message}`;
      }
    },
  };
}
