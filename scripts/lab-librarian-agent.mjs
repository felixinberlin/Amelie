// Der Bibliothekar als eigenständiger Agent für die Prüfung von Lab-PRs.
//
// Ein echter Agent wie die im Schwesterprojekt (Amélie-lab): eigenes Programm, eigene Gesprächsschleife gegen ein
// Modell über die Anbieter-Adapter aus scripts/model-compare/providers.mjs (Claude direkt, Claude über Vertex, Gemini),
// eigene Werkzeuge. Kein Claude-Code-Subagent. Er ist NUR LESEND: die Werkzeuge schreiben nichts, der Agent bucht
// nichts und liefert einen Bericht mit der Zeile „EMPFEHLUNG: merge|nicht mergen“.
//
// Werkzeuge:  bib_find · quellen_match · list_proposals · read_proposal
// Modell:     scripts/model-compare/models.local.json (Eintrag "librarian": "<id>", sonst "judge", sonst das erste Modell)

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { findAll } from './bibliothek-lib.mjs';
import { matchUrl } from './quellen-lib.mjs';
import { createProvider, runConversation } from './model-compare/providers.mjs';
import { loadConfig } from './model-compare/runner.mjs';
import { PROPOSALS } from './lab-review-lib.mjs';

const MAX_READ = 24000;

export const LIBRARIAN_TOOLS = [
  {
    name: 'bib_find',
    description: 'Durchsucht Amélies Gedächtnis (Prüfprotokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs), nur lesend. Mehrere Begriffe müssen alle im selben Eintrag stehen (any=true: einer genügt; stamm=true: Wortstämme). Treffer mit * sind ein „schon da“-Signal.',
    input_schema: {
      type: 'object',
      properties: {
        terms: { type: 'array', items: { type: 'string' }, description: 'Suchbegriffe, klein geschrieben' },
        any: { type: 'boolean' },
      },
      required: ['terms'],
    },
  },
  {
    name: 'quellen_match',
    description: 'Gleicht eine URL mit dem Quellenregister ab: exakter Treffer oder Pfadtreffer → Quelle ist bekannt (source.log statt source.add); genau ein Host-Treffer → wahrscheinlich dieselbe Quelle; mehrere Host-Treffer werden aufgelistet, nicht geraten.',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  },
  {
    name: 'list_proposals',
    description: `Listet die Dateien des PR unter ${PROPOSALS} (nur Namen).`,
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'read_proposal',
    description: `Liest eine Datei des PR unter ${PROPOSALS} (Name wie in list_proposals). Gekürzt auf ${MAX_READ} Zeichen.`,
    input_schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
  },
];

/** Lesende Handler. proposalsDir = <worktree>/06-suche/proposals, root = Hauptverzeichnis (Stand von main). */
export function createLibrarianHandlers({ root, proposalsDir, findFn = findAll, matchFn = matchUrl }) {
  const quellen = () => JSON.parse(readFileSync(join(root, 'src/data/quellen.json'), 'utf8'));
  return {
    async bib_find(args) {
      const terms = Array.isArray(args?.terms) ? args.terms.map(String).filter(Boolean) : [];
      if (!terms.length) return 'Fehler: terms fehlt (Liste von Begriffen).';
      const hits = findFn(terms, { any: !!args.any, quellen: quellen() });
      const bindend = hits.filter((h) => h.bindend);
      const lines = hits.slice(0, 12).map((h) => `${h.kind}${h.bindend ? '*' : ''} | ${h.id || ''} | ${String(h.title).slice(0, 70)} | ${h.where}`);
      return `${hits.length} Treffer, ${bindend.length} davon „schon da“ (*)${hits.length > 12 ? ', erste 12:' : ':'}\n${lines.join('\n') || '(keine)'}`;
    },
    async quellen_match(args) {
      let hits;
      try { hits = matchFn(quellen(), String(args?.url ?? '')); } catch (e) { return `Fehler: ${e.message}`; }
      if (!hits.length) return 'Kein Treffer: neue Quelle (source.add).';
      return hits.map((h) => `${h.kind}-Treffer ${h.id}${h.name ? ` (${h.name})` : ''}`).join('\n');
    },
    async list_proposals() {
      return existsSync(proposalsDir) ? readdirSync(proposalsDir).sort().join('\n') || '(leer)' : '(Verzeichnis fehlt)';
    },
    async read_proposal(args) {
      const name = String(args?.name ?? '');
      const p = resolve(proposalsDir, name);
      if (!name || name.includes('\0') || !p.startsWith(resolve(proposalsDir) + sep)) return 'Fehler: nur Dateien direkt unter proposals/ sind lesbar.';
      if (!existsSync(p)) return `Fehler: ${name} nicht gefunden.`;
      const text = readFileSync(p, 'utf8');
      return text.length > MAX_READ ? `${text.slice(0, MAX_READ)}\n[… gekürzt]` : text;
    },
  };
}

export const SYSTEM_PROMPT = `Du bist der Bibliothekar von Amélie, geprüft wird ein Pull Request vom Schwesterprojekt Amélie-lab.
Du bist ein Prüfer: Du schreibst nichts, buchst nichts und entscheidest nichts allein. Du liest, gleichst mit dem Gedächtnis ab und gibst eine Empfehlung.

Regeln (06-suche/amelie-lab-protokoll.md §7):
- Lab-PRs sind Vorschläge. Nichts wird automatisch als Urteil, Grab oder Quelle gebucht. Survivors bleiben „ungeprüft“, bis eine Existenzprüfung läuft.
- Quellenvorschläge werden nie ohne ausdrückliche Freigabe von Félix gebucht. Du benennst nur Duplikate.
- Mehrdeutige Host-Treffer werden aufgelistet, nicht geraten. Füllwort-Fehltreffer bei bib_find (etwa „Wet Ink“) sind normal und zu benennen.
- Vorschläge müssen als Vorschläge formuliert sein, nicht wie Änderungen, die hier schon gelten.
- Du erfindest keine Belege. Was du nicht mit einem Werkzeug geprüft hast, sagst du so.

Vorgehen: list_proposals, dann die Vorschlagsdatei (.md) und das Manifest mit read_proposal lesen. Jeden genannten Begriff mit bib_find (klein geschrieben, mehrere Begriffe nur wenn sie zusammen vorkommen sollen) und jede Quelle mit quellen_match gegenprüfen.

Antwort: Deutsch, höchstens 40 Zeilen, kurze Sätze. Erst Befunde (Duplikate, Fehltreffer, Formulierung), dann offene Punkte für Félix. Die LETZTE Zeile ist genau eine von:
EMPFEHLUNG: merge
EMPFEHLUNG: nicht mergen
„nicht mergen“ nur bei einem echten Hindernis (Vorschlag gibt sich als Änderung aus, Quelle schon im Register als source.add vorgeschlagen, Survivor als geprüft bezeichnet). Doppelfunde und Füllwort-Treffer allein sind kein Hindernis.`;

export function userPrompt({ pr, files, results, manifest }) {
  return `Lab-PR #${pr.number}: ${pr.title}

Dateien des PR: ${files.map((f) => f.path.replace(PROPOSALS, '')).join(', ')}
Manifest: ${manifest ? `plan_id ${manifest.plan_id}, survivors ${manifest.survivors?.count} (${manifest.survivors?.status}), existence_check ${manifest.existence_check}` : 'nicht lesbar'}
Maschinelle Befunde bisher: ${results.map((x) => `${x.ok ? 'ok' : 'FEHLER'} ${x.name}${x.note ? ` (${x.note})` : ''}`).join('; ')}

Prüfe nach deinen Regeln und antworte mit dem Bericht.`;
}

/** Wählt das Modell aus der Konfiguration: --model, sonst "librarian", sonst "judge", sonst das erste. */
export function pickModel(cfg, id) {
  const want = id ?? cfg.librarian ?? cfg.judge ?? cfg.models[0]?.id;
  const spec = cfg.models.find((m) => m.id === want);
  if (!spec) throw new Error(`Modell „${want}“ steht nicht in ${cfg.file} (vorhanden: ${cfg.models.map((m) => m.id).join(', ')})`);
  return spec;
}

/**
 * Läuft den Agenten. opts: { root, worktree, pr, files, results, manifest, model?, maxTurns? }
 * deps: { adapter? (Tests), config? } → { text, usage, toolLog, stop, cost, model }
 */
export async function runLabLibrarian(opts, deps = {}) {
  const root = opts.root;
  let spec = { id: 'test', provider: 'mock' };
  let adapter = deps.adapter;
  if (!adapter) {
    const cfg = deps.config ?? loadConfig(root);
    spec = pickModel(cfg, opts.model);
    adapter = await createProvider(spec);
  }
  const handlers = createLibrarianHandlers({ root, proposalsDir: join(opts.worktree, PROPOSALS) });
  const r = await runConversation(adapter, {
    system: SYSTEM_PROMPT,
    user: userPrompt(opts),
    tools: LIBRARIAN_TOOLS,
    handlers,
    maxTurns: opts.maxTurns ?? 16,
    meta: { engine: 'bibliothekar' },
  });
  const price = spec.price;
  const cost = price ? (r.usage.in * price.in + r.usage.out * price.out) / 1e6 : null;
  return { ...r, cost, model: spec.id };
}
