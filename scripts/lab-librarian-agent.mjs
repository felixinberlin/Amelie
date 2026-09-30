// Der Bibliothekar als eigenständiger Agent für die Prüfung von Lab-PRs.
//
// Ein echter Agent wie die im Schwesterprojekt (Amélie-lab): eigenes Programm, eigene Gesprächsschleife gegen ein
// Modell über die Anbieter-Adapter aus scripts/model-compare/providers.mjs (Claude direkt, Claude über Vertex, Gemini),
// eigene Werkzeuge. Kein Claude-Code-Subagent. Er ist NUR LESEND: die Werkzeuge schreiben nichts, der Agent bucht
// nichts und liefert einen Bericht mit der Zeile „EMPFEHLUNG: merge|nicht mergen“.
//
// Werkzeuge:  bib_find · quellen_match · list_proposals · read_proposal  (Kern, nur lesend)
//             dazu das Kit aus scripts/agent-kit.mjs: run_cli · read_file · search_repo · web_fetch ·
//             list_skills/load_skill (Skills des Projekts) · list_agents/call_agent (andere Amélie-Agenten als Unter-Agent, nur lesend)
// Modell:     scripts/model-compare/models.local.json (Eintrag "librarian": "<id>", sonst "judge", sonst das erste Modell)

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { findAll } from './bibliothek-lib.mjs';
import { matchUrl } from './quellen-lib.mjs';
import { createProvider, runConversation } from './model-compare/providers.mjs';
import { loadConfig } from './model-compare/runner.mjs';
import { PROPOSALS } from './lab-review-lib.mjs';
import { KIT_TOOLS, createKit } from './agent-kit.mjs';

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
        stamm: { type: 'boolean', description: 'auch Wortstämme und Kompositum-Endstücke' },
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
      const hits = findFn(terms, { any: !!args.any, stamm: !!args.stamm, wort: !!args.wort, quellen: quellen().quellen });
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

Hilfsmittel des Projekts, die du nutzt, wenn die Prüfung sie braucht (nicht als Routine):
- run_cli: weitere Lesebefehle der Bibliotheks-CLI (grab list/show, protokoll show, vorflug, quellen next). read_file und search_repo: Playbook, Atlas, Friedhof, Protokolle lesen.
- load_skill: Skills sind Anleitungen des Projekts (z. B. idea-reviewer mit Rubrik, amelie-ideenrunde mit Suchmethode). Lade einen, wenn ein Vorschlag nach dessen Methode beurteilt werden muss.
- call_agent: ideen-scout (Existenzprüfung), idea-reviewer (Vektoren), inversions-agent, bisoziations-kollider. Sie laufen nur lesend und sind teuer. Protokoll §8: Eine Existenzprüfung setzen Félix oder der Orchestrator an, nicht du. Rufe einen Agenten nur, wenn eine konkrete Frage der Prüfung ohne ihn offen bliebe (etwa: Hält ein als „frei“ behaupteter Survivor einer Nachprüfung stand?), und nenne im Bericht, warum.
- web_fetch: eine Quellen-URL ansehen, wenn ein Vorschlag sie behauptet und du es prüfen willst.
Alles ist nur lesend. Nichts davon ändert Dateien, bucht oder mergt.

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

/** Kurzzeitige Anbieter- und Netzfehler (Kontingent 429, Überlast 503, fetch failed), bei denen Warten und Wiederholen sinnvoll ist. */
export const isTransient = (e) => /\b(429|503)\b|RESOURCE_EXHAUSTED|UNAVAILABLE|overloaded|fetch failed|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up/i.test(`${e?.message ?? e} ${e?.cause?.code ?? ''}`);

/** Umhüllt einen Adapter: step() wird bei vorübergehenden Fehlern bis zu `tries` Mal mit wachsender Pause wiederholt. */
export function withRetry(adapter, { tries = 4, baseMs = 15000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), onRetry } = {}) {
  return {
    ...adapter,
    start: (a) => adapter.start(a),
    addToolResults: (st, res) => adapter.addToolResults(st, res),
    async step(st) {
      for (let i = 1; ; i++) {
        try { return await adapter.step(st); } catch (e) {
          if (i >= tries || !isTransient(e)) throw e;
          const ms = baseMs * 2 ** (i - 1);
          onRetry?.(i, ms, e);
          await sleep(ms);
        }
      }
    },
  };
}

/** Werkzeugliste des Agenten. delegate=false blendet die Unter-Agenten aus. */
export function librarianTools({ delegate = true } = {}) {
  const kit = ['run_cli', 'read_file', 'search_repo', 'web_fetch', 'list_skills', 'load_skill', ...(delegate ? ['list_agents', 'call_agent'] : [])];
  return [...LIBRARIAN_TOOLS, ...kit.map((n) => KIT_TOOLS[n])];
}

/**
 * Läuft den Agenten. opts: { root, worktree, pr, files, results, manifest, model?, maxTurns?, delegate?, maxAgentCalls? }
 * deps: { adapter? (Tests), config? } → { text, usage, toolLog, stop, cost, model, agentCalls }
 */
export async function runLabLibrarian(opts, deps = {}) {
  const root = opts.root;
  let spec = { id: 'test', provider: 'mock' };
  let adapter = deps.adapter;
  if (!adapter) {
    const cfg = deps.config ?? loadConfig(root);
    spec = pickModel(cfg, opts.model);
    adapter = withRetry(await createProvider(spec), deps.retry);
  }
  const delegate = opts.delegate !== false;
  const quellen = JSON.parse(readFileSync(join(root, 'src/data/quellen.json'), 'utf8')).quellen;
  const kit = createKit({
    root, quellen, maxAgentCalls: opts.maxAgentCalls ?? 3,
    makeAdapter: delegate ? async (role) => (deps.makeAdapter ? deps.makeAdapter(role) : adapter) : undefined, // der Standardadapter ist schon umhüllt
    fetchFn: deps.fetchFn,
  });
  const core = createLibrarianHandlers({ root, proposalsDir: join(opts.worktree, PROPOSALS) });
  const handlers = { ...kit.handlers, ...core }; // die Kernwerkzeuge (bib_find, quellen_match, read_proposal) haben Vorrang
  const r = await runConversation(adapter, {
    system: SYSTEM_PROMPT,
    user: userPrompt(opts),
    tools: librarianTools({ delegate }),
    handlers,
    maxTurns: opts.maxTurns ?? 16,
    meta: { engine: 'bibliothekar' },
  });
  const sub = kit.ledger.agentCalls.reduce((a, c) => ({ in: a.in + (c.usage?.in ?? 0), out: a.out + (c.usage?.out ?? 0) }), { in: 0, out: 0 });
  const usage = { ...r.usage, in: r.usage.in + sub.in, out: r.usage.out + sub.out, subagent: sub };
  const price = spec.price;
  const cost = price ? (usage.in * price.in + usage.out * price.out) / 1e6 : null;
  return { ...r, usage, cost, model: spec.id, agentCalls: kit.ledger.agentCalls };
}
