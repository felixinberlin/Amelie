// Baut die Prompts der Engines für den Modellvergleich aus den echten Agenten- und Skill-Dateien.
// Jedes Modell bekommt dieselben Prompts; nur die Betriebsart-Hinweise (Werkzeuge statt Shell) kommen dazu.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { findAll } from '../bibliothek-lib.mjs';

export const ENGINES = {
  scout: { agent: 'ideen-scout', skill: 'amelie-ideenrunde', label: 'Ideen-Scout (Primärquellen)' },
  kollider: { agent: 'bisoziations-kollider', skill: 'lacunar-bisociation', label: 'Bisoziations-Kollider' },
  inversion: { agent: 'inversions-agent', skill: 'asymmetric-inversion', label: 'Inversions-Agent' },
};

const read = (root, rel) => (existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8') : null);
const stripFrontmatter = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, '').trim();

/** Textbaustein mit den gültigen Werten der Quellenmeldung (aus dem Register, damit er nicht veraltet). */
export function quellenFormatText(quellen) {
  const k = quellen.katalog;
  return [
    'Quellenmeldung, eine Zeile je Quelle (Trenner " | ", im Freitext kein " | "):',
    '  bestehende Quelle: QUELLE <id> | status=… | evidenz=… | zugang=<ja|teilweise|gesperrt|unbekannt> [wie: …] | ertrag=Grab <id>, Idee <id> | urls=… | note=Ein Satz.',
    '  neue Quelle:       QUELLE NEU: Name | typ=<Buchstabe> | kategorie=<…> | enthaelt=… | status=… | evidenz=… | zugang=… | ertrag=– | urls=… | note=…',
    `  typ: ${quellen.typen.map((t) => `${t.id}=${t.titel}`).join('; ')}`,
    `  kategorie: ${Object.keys(k.kategorien).join(' · ')}`,
    `  status: ${k.status.map((s) => s.id).join(' · ')}  (durchsucht/erschöpft nur mit evidenz=seite)`,
    `  evidenz: ${Object.keys(k.evidenz).join(' · ')}`,
  ].join('\n');
}

/** Warnliste aus dem Gedächtnis: bekannte Einträge zum Thema (jedes Modell bekommt dieselbe). */
export function warnliste(thema, quellen, root) {
  const terms = String(thema).toLowerCase().split(/[^a-zäöüß0-9]+/i).filter((w) => w.length >= 4);
  if (!terms.length) return '(keine)';
  const hits = findAll(terms, { any: true, root, quellen: quellen.quellen }).filter((h) => h.bindend).slice(0, 14);
  return hits.map((h) => `- ${h.kind}: ${h.id ? h.id + ' — ' : ''}${String(h.title).slice(0, 70)} (${h.where})`).join('\n') || '(keine Treffer im Gedächtnis)';
}

/** System- und Nutzer-Prompt für eine Engine. */
export function buildPrompts({ root, thema, datum, engine, quellen, search }) {
  const e = ENGINES[engine];
  if (!e) throw new Error(`Unbekannte Engine „${engine}“ (${Object.keys(ENGINES).join(' | ')})`);
  const agent = read(root, `.claude/agents/${e.agent}.md`);
  const skill = read(root, `.claude/skills/${e.skill}/SKILL.md`);
  if (!agent || !skill) throw new Error(`Agent oder Skill fehlt: .claude/agents/${e.agent}.md / .claude/skills/${e.skill}/SKILL.md`);
  const werkzeuge = search === 'native'
    ? 'Du hast die eingebaute Websuche des Anbieters. Wenn du eine Seite über die Suche wirklich gelesen hast, nutze [Seite], sonst [Schnipsel].'
    : 'Du hast zwei Werkzeuge: `bib_find` (Gedächtnis durchsuchen) und `web_fetch` (eine Webseite holen). Nur was du mit `web_fetch` geholt hast, darfst du mit [Seite] belegen; sonst [Schnipsel]. Erfinde keine URLs.';
  const system = [
    stripFrontmatter(agent),
    '---',
    stripFrontmatter(skill),
    '---',
    '## Betriebsart: Modellvergleich',
    '- Du hast keine Shell und schreibst keine Dateien. Wo die Anleitung oben `npm run bib -- find …`, `grab list` oder Dateien nennt, nutze stattdessen das Werkzeug `bib_find`; schreibe nichts in Logs.',
    `- ${werkzeuge}`,
    '- Deine Antwort ist der vollständige Bericht im Rückgabeformat deiner Rolle (Kandidatentabelle mit Spalten Idee | Beschreibung | Quelle | Empfänger | Urteil | Beleg | Restlücke, dann „Gelernt / Nächstes Mal“, dann der Block **Quellenmeldung**).',
    '- Urteile: frei · verengt · unklar · besetzt. Jede Evidenz mit [Seite] oder [Schnipsel] markieren.',
    quellenFormatText(quellen),
  ].join('\n\n');
  const user = [
    `Teamrunde „Modellvergleich“, ${datum}, Thema: **${thema}**.`,
    `Du bist Engine „${e.label}“. Finde 3–5 geprüfte Ideen zu diesem Thema nach deiner Methode; max. 4 Suchen je Idee, Empfänger zuerst.`,
    '',
    'Warnliste (das Gedächtnis kennt schon, prüfe vor jedem Urteil mit `bib_find`):',
    warnliste(thema, quellen, root),
    '',
    'Keine Ideen sind vorgegeben. Keine Mail. Gib den Bericht als Text zurück.',
  ].join('\n');
  return { system, user, label: e.label };
}
