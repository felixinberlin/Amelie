#!/usr/bin/env node
// Bibliotheks-CLI: das Gedächtnis von Amélie per Kommandozeile.
//
// Lesen darf jeder Agent, schreiben nur der Bibliothekar (Handbuch: 06-suche/amelie-bibliothek-cli.md).
// Jeder Befehl kennt --json (maschinenlesbar, Fehler als {code, field, message}); Exit-Codes sind stabil (scripts/bib-errors.mjs).
//
//   LESEN
//   npm run bib -- find <begriff…> [--any] [--wort] [--stamm] [--alle] [--json]
//   npm run bib -- exists <source|grave|dose|candidate|protokoll|plan> <id>
//   npm run bib -- quellen match --url <u>       welche Quelle gehört zu dieser Adresse?
//   npm run bib -- schema                        erlaubte Werte, Regeln, Operationen, Codes als JSON
//   npm run bib -- state                         Hashes der Speicher (für expect.hashes), Sperre, Journal
//   npm run bib -- ledger                        angewendete Pläne
//   npm run bib -- vorflug [--thema x] [--netz]
//   npm run bib -- grab list|show|stats|werte
//   npm run bib -- protokoll show|stats
//   npm run bib -- vector show <dose|candidate> <id>
//   npm run bib -- quellen formate
//   npm run bib -- status
//
//   SCHREIBEN (jeder Befehl kennt --dry-run; Schreibbefehle nehmen die Schreibsperre, --wait <s> wartet darauf)
//   npm run bib -- apply <plan.json|-> [--dry-run] [--json] [--key k] [--wait s] [--actor a] [--agent a] [--runde r] [--plan-id id] [--no-export]
//   npm run bib -- vector set --kind dose --id x --set V1=3,V3=4 [--expect V1=4] --evidence "…"
//   npm run bib -- grab add --from grab.json | Einzelflags
//   npm run bib -- protokoll add --runde … --titel … --urteil … --beleg … --evidenz … --method … --pruefen-ab MM/JJJJ
//   npm run bib -- quellen import <datei|-> --agent <name> --runde "…"
//   npm run bib -- abschluss [--schnell]
//
// Exit-Codes: 0 ok · 1 Aufruf · 2 (find) schon da · 4 (exists/match) kein Treffer · 10 Validierung · 11 Vorbedingung · 12 Rechte · 13 Sperre · 14 Schreibfehler (zurückgerollt).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { repoRoot, GRAEBER_FILE, loadGraeber, readDataIds } from './dosen-lib.mjs';
import { loadQuellen, refIds, matchUrl } from './quellen-lib.mjs';
import {
  parseArgs, findAll, parseProtokoll, protokollStats, buildProtokollFelder, insertProtokollRow,
  validateGrab, orderGrab, readEnum, readCandidates, parseQuellenmeldung, meldungToArgs, matches, PROTOKOLL,
} from './bibliothek-lib.mjs';
import { BibError, EXIT, exitFor } from './bib-errors.mjs';
import { REL, acquireLock, auditAppend, readJson, readLedger, storeHashes, ledgerHas } from './bib-store.mjs';
import { applyPlan, readPlanFile } from './bib-apply.mjs';
import { buildSchema } from './bib-ops.mjs';

const [cmd = 'hilfe', ...rest] = process.argv.slice(2);
const { pos, one, many, has } = parseArgs(rest);
const json = has('json');
const dry = has('dry-run');
const run = (bin, args, opts = {}) => spawnSync(bin, args, { cwd: repoRoot, encoding: 'utf8', ...opts });
const today = () => new Date().toISOString().slice(0, 10);
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
const out = (obj) => console.log(JSON.stringify(obj, null, 2));
const say = (...a) => { if (!json) console.log(...a); };

/** Ende mit Fehlerliste: im JSON-Modus {ok:false, errors:[{code, field, message}]} auf stdout, sonst Klartext auf stderr. */
function fail(err, code) {
  const list = (Array.isArray(err) ? err : [err]).map((e) => (typeof e === 'string' ? { code: 'USAGE', field: '', message: e } : e instanceof BibError ? e.toJSON() : e));
  if (json) out({ ok: false, errors: list });
  else console.error(list.map((e) => e.message).join('\n'));
  process.exit(code ?? exitFor(list));
}
const die = (msg, code = EXIT.USAGE) => fail({ code: 'USAGE', field: '', message: msg }, code);

/** Schreibsperre für direkte Schreibbefehle (dieselbe wie bei `apply`); Kindprozesse erben sie über BIB_LOCK_TOKEN. */
const withLock = (actor = 'bibliothekar') => {
  if (dry) return;
  try { acquireLock(repoRoot, { wait: Number(one('wait') ?? 0), actor }); } catch (e) { fail(e); }
};
const audit = (entry) => { if (!dry) auditAppend(repoRoot, { event: 'cli', actor: one('actor') ?? 'bibliothekar', agent: one('agent'), runde: one('runde'), ...entry }); };

const HILFE = `Bibliotheks-CLI — npm run bib -- <befehl>   (jeder Befehl: --json; Schreibbefehle: --dry-run, --wait <s>)

LESEN (alle Agenten)
  find <begriff…> [--any] [--wort] [--stamm] [--alle]   „Gibt es das schon?“ über Protokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs.
                                              Exit 2 = Treffer in Protokoll/Friedhof/Dosen/Kandidaten. Mehrere Begriffe = alle müssen passen (--any: einer genügt; --wort: nur ganze Wörter; --stamm: auch Wortstämme und Kompositum-Endstücke, „fallgeräusche“ findet „geräusch“).
                                              --json liefert je Treffer „score“ 0…1 (exakt 1,0 · Stamm 0,6 · Endstück 0,3, Mittel über die Begriffe).
  exists <source|grave|dose|candidate|protokoll|plan> <id>   Vorprüfung; Exit 0 = gibt es, 4 = gibt es nicht
  quellen match --url <u>                     welche Quelle gehört zu dieser Adresse (exakt > Pfad > Host)? Exit 4 = keine
  quellen formate                             gültige typ/kategorie/status-Werte der Quellenmeldung
  schema                                      erlaubte Werte, Regeln, Operationen, Fehler- und Exit-Codes (JSON)
  state                                       Hashes der Speicher (für expect.hashes), Sperre, Journal, Ledger
  ledger                                      angewendete Pläne (Schlüssel, Akteur, Zeit)
  vorflug [--thema x] [--netz]                git fetch, fremde Branches und Commits der letzten 14 Tage, Netztest
  grab list|show|stats|werte                  Friedhof lesen (Filter: --cause --killer --found-by --stage --origin --since)
  protokoll show <id|begriff…> | stats        Prüfprotokoll lesen; stats [--abschnitte]
  vector show <dose|candidate> <id>           Vektoren und letzte Änderungen
  status                                      Bestand auf einen Blick

SCHREIBEN (nur Bibliothekar bzw. Akteure nach 06-suche/bib-actors.json)
  apply <plan.json|-> [--key k] [--actor a] [--agent a] [--runde r] [--plan-id id] [--no-export]
                                              ein typisierter Stapel, alles oder nichts, idempotent (Ledger), mit Vorbedingungen (expect).
                                              Operationen: source.add, source.log, source.rate, grave.add, protokoll.add, vector.set, terminology.add, question.add (siehe schema)
  vector set --kind dose|candidate --id x --set V1=3,V3=4 [--expect V1=4] --evidence "…" [--reason "…"] [--actor a]
                                              |Δ| ≤ 2, V1–V7, V8 nie, Evidenz Pflicht, jede Änderung im Log
  grab add --from <datei.json>                Totenschein (Objekt oder Liste) anlegen, Friedhof-README neu erzeugen
  grab add --id … --title … --original-de … --original-en … --why-de … --why-en … --lesson-de … --lesson-en …
           --domain … --cause … --killer … --found-by … --origin … --stage … --born-in … --died-on … --resurrect-de … --resurrect-en …
           [--evidence "…"]… [--nachruf pfad]
  protokoll add --runde "Abschnittstitel" --titel "…" --urteil frei|verengt|unklar|besetzt --beleg "…"
                --evidenz seite|schnipsel --method ideenrunde --pruefen-ab 09/2027 [--id x] [--was "…"] [--nr H9] [--neuer-abschnitt "Einleitung"]
  quellen import <datei|-> --agent <name> --runde "…"   Quellenmeldung-Zeilen ins Register buchen (erst alles prüfen, dann buchen)
  abschluss [--schnell]                       export:data → lint → test; listet offene Änderungen

Exit-Codes: 0 ok · 1 Aufruf · 2 schon da · 4 kein Treffer · 10 Validierung · 11 Vorbedingung · 12 Rechte · 13 Sperre · 14 Schreibfehler (zurückgerollt)
Handbuch: 06-suche/amelie-bibliothek-cli.md`;

// ---------------------------------------------------------------- find, exists, match

function cmdFind() {
  if (!pos.length) die('Aufruf: bib find <begriff…> [--any] [--wort] [--stamm] [--alle] [--json]   (Schalter stehen vor oder nach den Begriffen)');
  const hits = findAll(pos, { any: has('any'), wort: has('wort'), stamm: has('stamm'), quellen: loadQuellen().quellen });
  const bindend = hits.filter((h) => h.bindend);
  if (json) {
    out({ ok: true, terms: pos, any: has('any'), wort: has('wort'), stamm: has('stamm'), alreadyThere: bindend.length > 0, hits: hits.map(({ bindend: b, ...h }) => ({ ...h, binding: b })) });
  } else {
    const titel = { protokoll: 'Prüfprotokoll', grab: 'Friedhof', dose: 'Dosen', kandidat: 'Kandidaten', quelle: 'Quellen-Register', log: 'Logs, Playbook, Förderlandschaft' };
    for (const kind of Object.keys(titel)) {
      const list = hits.filter((h) => h.kind === kind);
      if (!list.length) continue;
      console.log(`\n■ ${titel[kind]} (${list.length})`);
      for (const h of has('alle') ? list : list.slice(0, 8)) {
        console.log(`  ${h.id ? h.id + ' — ' : ''}${h.title.slice(0, 70)}\n    ${h.where}\n    ${h.snippet}`);
      }
      if (!has('alle') && list.length > 8) console.log(`  … ${list.length - 8} weitere (--alle)`);
    }
    console.log(hits.length ? `\n${bindend.length ? '⚠ SCHON DA: ' + bindend.length + ' Treffer in Protokoll/Friedhof/Dosen/Kandidaten — vor „frei“ lesen und abgrenzen.' : 'Nur Hintergrund-Treffer (Quellen/Logs), kein Eintrag im Bestand.'}` : `\nKein Treffer für „${pos.join(' ')}“${has('any') ? '' : ' (alle Begriffe müssen passen — mit --any lockern)'}. Vor „frei“ trotzdem die Existenzsuche laufen lassen.`);
  }
  process.exit(bindend.length ? EXIT.FOUND : EXIT.OK);
}

function cmdExists() {
  const [kind, id] = pos;
  const kinds = ['source', 'grave', 'dose', 'candidate', 'protokoll', 'plan'];
  if (!kinds.includes(kind) || !id) die(`Aufruf: bib exists <${kinds.join('|')}> <id>`);
  let detail = null;
  if (kind === 'source') { const q = loadQuellen().quellen.find((x) => x.id === id); detail = q && { status: q.status }; }
  else if (kind === 'grave') { const g = loadGraeber().find((x) => x.id === id); detail = g && { cause: g.cause, killer: g.killer, diedOn: g.diedOn }; }
  else if (kind === 'dose') detail = readDataIds().dosen.includes(id) || existsSync(`${repoRoot}/05-dosen/${id}.md`) ? {} : null;
  else if (kind === 'candidate') { const c = readCandidates().find((x) => x.id === id); detail = c && { status: c.status || null, packedDoseId: c.packedDoseId }; }
  else if (kind === 'protokoll') {
    const rows = parseProtokoll(readFileSync(PROTOKOLL, 'utf8')).filter((r) => r.idee.includes(`(\`${id}\`)`) || r.idee.includes(`(${id})`));
    detail = rows.length ? { rows: rows.length, verdicts: rows.map((r) => r.urteil) } : null;
  } else if (kind === 'plan') { const e = ledgerHas(repoRoot, id); detail = e && { at: e.at, actor: e.actor }; }
  const exists = detail !== null && detail !== undefined;
  if (json) out({ ok: true, kind, id, exists, ...(exists ? { detail } : {}) });
  else console.log(exists ? `ja: ${kind} „${id}“ ${JSON.stringify(detail)}` : `nein: ${kind} „${id}“`);
  process.exit(exists ? EXIT.OK : EXIT.NOT_FOUND);
}

function quellenMatch() {
  const url = one('url');
  if (!url) die('Aufruf: bib quellen match --url <u>');
  let treffer;
  try { treffer = matchUrl(loadQuellen(), url); } catch (e) { fail(e, EXIT.USAGE); }
  if (json) out({ ok: true, url, matches: treffer });
  else if (!treffer.length) console.log(`Keine Quelle im Register für ${url}`);
  else for (const m of treffer) console.log(`${pad(m.kind, 6)} ${pad(m.id, 44)} ${m.matchedUrl}`);
  process.exit(treffer.length ? EXIT.OK : EXIT.NOT_FOUND);
}

// ---------------------------------------------------------------- schema, state, ledger

const cmdSchema = () => out({ ok: true, ...buildSchema(repoRoot) });

function cmdState() {
  const lock = readJson(repoRoot, REL.lock, null);
  const ledger = readLedger(repoRoot);
  const s = { ok: true, hashes: storeHashes(repoRoot), lock, journalPending: existsSync(`${repoRoot}/${REL.journal}`), ledgerEntries: Object.keys(ledger.applied).length };
  if (json) return out(s);
  for (const [f, h] of Object.entries(s.hashes)) console.log(`${pad(f, 34)} ${h}`);
  console.log(`\nSperre: ${lock ? `gehalten von ${lock.actor} (pid ${lock.pid}, ${lock.at})` : 'frei'}   Journal offen: ${s.journalPending ? 'ja (wird beim nächsten Schreiben zurückgerollt)' : 'nein'}   Ledger: ${s.ledgerEntries} Pläne`);
}

function cmdLedger() {
  const l = readLedger(repoRoot);
  const list = Object.entries(l.applied).map(([key, e]) => ({ key, plan_id: e.plan_id, actor: e.actor, at: e.at, ops: e.ops?.length ?? 0, files: e.files?.length ?? 0 }));
  if (json) return out({ ok: true, applied: list });
  for (const e of list) console.log(`${pad(e.at ?? '', 24)} ${pad(e.actor, 16)} ${pad(e.key, 40)} ${e.ops} Ops, ${e.files} Dateien`);
  console.log(`\n${list.length} angewendete Pläne`);
}

// ---------------------------------------------------------------- apply, vector

function printApply(res) {
  if (json) return out(res);
  if (res.already_applied) return console.log(`Schon angewendet: ${res.key} (${res.applied?.at ?? '?'}, ${res.applied?.actor ?? '?'}) — nichts geschrieben.`);
  for (const r of res.ops) console.log(`${r.ok ? '✓' : '✗'} [${r.index}] ${pad(r.op, 14)} ${r.ok ? `${r.target ?? ''} — ${r.detail ?? ''}` : r.error?.message}`);
  for (const e of res.errors.filter((x) => x.op === undefined)) console.log(`✗ ${e.code}: ${e.message}`);
  console.log(res.ok ? `\n${res.dry_run ? '[dry-run] würde' : 'Angewendet:'} ${res.ops.length} Operationen, ${res.files.length} Dateien${res.files.length ? ':\n  ' + res.files.join('\n  ') : ''}` : `\nNichts geschrieben (Exit ${res.exit}).`);
  if (res.recovered) console.log(`Hinweis: ein früher abgebrochener Lauf (${res.recovered.plan_id ?? '?'}) wurde zurückgerollt.`);
}

function cmdApply() {
  const [file] = pos;
  if (!file) die('Aufruf: bib apply <plan.json|-> [--dry-run] [--json] [--key k] [--wait s] [--actor a] [--agent a] [--runde r] [--plan-id id] [--no-export]');
  let plan;
  try { plan = readPlanFile(file); } catch (e) { fail(e); }
  const res = applyPlan(plan, { dryRun: dry, wait: Number(one('wait') ?? 0), key: one('key'), actor: one('actor'), agent: one('agent'), runde: one('runde'), planId: one('plan-id'), exportData: has('no-export') ? false : undefined });
  printApply(res);
  process.exit(res.exit);
}

function parsePairs(text, flag) {
  const o = {};
  for (const part of String(text ?? '').split(',').map((x) => x.trim()).filter(Boolean)) {
    const m = /^([A-Za-z0-9]+)=(\d+)$/.exec(part);
    if (!m) die(`--${flag} erwartet V1=3,V3=4 (gefunden: „${part}“)`);
    o[m[1].toUpperCase()] = Number(m[2]);
  }
  return o;
}

function cmdVector() {
  const [sub] = pos;
  if (sub === 'show') {
    const [, kind, id] = pos;
    const store = readJson(repoRoot, kind === 'candidate' ? REL.candidateVectors : REL.doseVectors, {});
    const e = store[id];
    if (!e) fail({ code: 'NOT_FOUND', field: 'id', message: `${kind ?? 'dose'} „${id}“ hat keinen Vektor-Eintrag` }, EXIT.NOT_FOUND);
    const log = readJson(repoRoot, REL.vectorLog, []).filter((l) => l.id === id && l.kind === kind);
    if (json) return out({ ok: true, kind, id, v: Object.fromEntries(e.v.map((n, i) => [`V${i + 1}`, n])), fun: e.fun, changes: log });
    console.log(`${id}: ${e.v.map((n, i) => `V${i + 1}=${n}`).join(' ')} · V8(fun)=${e.fun}`);
    for (const l of log) console.log(`  ${l.at} ${l.vector} ${l.from}→${l.to} (${l.actor}, Plan ${l.planId}): ${l.evidence}`);
    return;
  }
  if (sub !== 'set') die('Aufruf: bib vector set --kind dose|candidate --id x --set V1=3 [--expect V1=4] --evidence "…"  |  bib vector show <kind> <id>');
  const plan = {
    plan_id: one('plan-id') ?? `cli-vector-${Date.now().toString(36)}`,
    actor: one('actor') ?? 'bibliothekar',
    agent: one('agent'),
    runde: one('runde'),
    ops: [{ op: 'vector.set', kind: one('kind'), id: one('id'), set: parsePairs(one('set'), 'set'), ...(one('expect') ? { expect: parsePairs(one('expect'), 'expect') } : {}), evidence: one('evidence'), ...(one('reason') ? { reason: one('reason') } : {}) }],
  };
  const res = applyPlan(plan, { dryRun: dry, wait: Number(one('wait') ?? 0), exportData: false });
  printApply(res);
  process.exit(res.exit);
}

// ---------------------------------------------------------------- vorflug

async function cmdVorflug() {
  const r = { ok: true, fetch: null, branch: '', recentBranches: [], topic: null, netz: [] };
  const fetch1 = run('git', ['fetch', '--all', '--prune', '--quiet'], { timeout: 60000 });
  r.fetch = fetch1.status === 0 ? 'ok' : `fehlgeschlagen: ${(fetch1.stderr || fetch1.error?.message || '').trim().split('\n')[0]}`;
  say(fetch1.status === 0 ? '✓ git fetch' : `✗ git fetch ${r.fetch} — Stand kann veraltet sein`);
  r.branch = run('git', ['branch', '--show-current']).stdout.trim();
  say(`Aktueller Branch: ${r.branch || '(detached)'}`);
  const refs = run('git', ['for-each-ref', '--sort=-committerdate', '--count=25', '--format=%(committerdate:short)\t%(refname:short)\t%(authorname)\t%(subject)', 'refs/remotes']).stdout.trim().split('\n').filter(Boolean);
  const fremd = refs.map((l) => l.split('\t')).filter(([, ref]) => ref !== 'origin/HEAD' && ref !== 'origin' && ref !== `origin/${r.branch}`);
  const frisch = fremd.filter(([d]) => (Date.now() - Date.parse(d)) / 864e5 <= 14);
  r.recentBranches = frisch.map(([date, ref, author, subject]) => ({ date, ref, author, subject }));
  say(`\nRemote-Branches mit Commits in den letzten 14 Tagen (${frisch.length}):`);
  for (const [d, ref, autor, subj] of frisch.slice(0, 15)) say(`  ${d}  ${pad(ref, 44)} ${pad(autor, 14)} ${subj.slice(0, 70)}`);
  if (!frisch.length) say('  (keine)');
  const thema = one('thema');
  if (thema) {
    const t = thema.split(/[\s,]+/).filter(Boolean);
    const log = run('git', ['log', '--all', '--since=30.days', '-i', '--format=%h %ad %s [%D]', '--date=short', ...t.flatMap((x) => ['--grep', x])]).stdout.trim();
    const brs = refs.map((l) => l.split('\t')[1]).filter((b) => t.some((x) => b.toLowerCase().includes(x.toLowerCase())));
    const hits = findAll(t, { any: true }).filter((h) => h.bindend);
    r.topic = { terms: t, commits: log ? log.split('\n').slice(0, 10) : [], branches: brs, memoryHits: hits.length };
    say(`\nThema „${thema}“ in Commits der letzten 30 Tage / Branchnamen:`);
    say(log ? log.split('\n').slice(0, 10).map((l) => '  ' + l.slice(0, 140)).join('\n') : '  (keine Commits)');
    if (brs.length) say('  Branches: ' + brs.join(', '));
    say(`\nGedächtnis-Treffer (bib find, mindestens ein Begriff): ${hits.length}${hits.length ? ' — genauer mit: npm run bib -- find ' + t.join(' ') : ''}`);
  }
  say('\nOffene Pull Requests: nicht per CLI erreichbar — mit dem GitHub-Werkzeug list_pull_requests (state=open) prüfen und Duplikate zum Thema melden.');
  if (has('netz')) {
    say('\nNetztest (5 s je Host):');
    for (const url of ['https://github.com', 'https://publications.europa.eu', 'https://www.bundesanzeiger.de', 'https://www.gesetze-im-internet.de', 'https://de.wikipedia.org']) {
      const t0 = Date.now();
      try {
        const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000), redirect: 'follow' });
        r.netz.push({ url, ok: res.status < 400, status: res.status, ms: Date.now() - t0 });
        say(`  ${res.status < 400 ? '✓' : '✗'} ${res.status} ${url} (${Date.now() - t0} ms)`);
      } catch (err) {
        r.netz.push({ url, ok: false, error: err.cause?.code ?? err.name });
        say(`  ✗ ${url} — ${err.cause?.code ?? err.name}`);
      }
    }
  }
  if (json) out(r);
}

// ---------------------------------------------------------------- grab

function cmdGrab() {
  const [sub = 'list', ...more] = pos;
  const graeber = loadGraeber();
  if (sub === 'list') {
    let list = graeber;
    for (const [flag, key, typ] of [['cause', 'cause', 'Todesursache'], ['killer', 'killer', 'Killerart'], ['found-by', 'foundBy', 'Fundweg'], ['stage', 'stage', 'Stadium'], ['origin', 'origin', 'Herkunft']]) {
      if (!one(flag)) continue;
      const erlaubt = readEnum(typ);
      if (!erlaubt.includes(one(flag))) fail({ code: 'VALUE_INVALID', field: flag, message: `--${flag} „${one(flag)}“ ungültig. Erlaubt: ${erlaubt.join(' · ')}` });
      list = list.filter((g) => g[key] === one(flag));
    }
    if (one('since')) list = list.filter((g) => g.diedOn >= one('since'));
    list = [...list].sort((a, b) => b.diedOn.localeCompare(a.diedOn));
    if (json) return out({ ok: true, total: graeber.length, count: list.length, graves: list.map((g) => ({ id: g.id, title: g.title, cause: g.cause, killer: g.killer, foundBy: g.foundBy, stage: g.stage, origin: g.origin, diedOn: g.diedOn })) });
    for (const g of list) console.log(`${pad(g.diedOn, 10)} ${pad(g.cause, 15)} ${pad(g.killer, 15)} ${pad(g.foundBy, 15)} ${pad(g.stage, 12)} ${pad(g.id, 34)} ${g.title.slice(0, 50)}`);
    console.log(`\n${list.length} von ${graeber.length} Gräbern`);
  } else if (sub === 'show') {
    const g = graeber.find((x) => x.id === more[0]);
    if (!g) fail({ code: 'NOT_FOUND', field: 'id', message: `Unbekanntes Grab „${more[0] ?? ''}“. Suche: npm run bib -- find <begriff>` }, EXIT.NOT_FOUND);
    json ? out({ ok: true, grave: g }) : console.log(JSON.stringify(g, null, 2));
  } else if (sub === 'stats') {
    const stats = {};
    for (const key of ['cause', 'killer', 'foundBy', 'stage', 'origin']) {
      stats[key] = {};
      for (const g of graeber) stats[key][g[key]] = (stats[key][g[key]] ?? 0) + 1;
    }
    if (json) return out({ ok: true, total: graeber.length, stats });
    for (const [key, n] of Object.entries(stats)) console.log(`${pad(key, 8)} ${Object.entries(n).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    console.log(`\n${graeber.length} Gräber`);
  } else if (sub === 'werte') {
    const werte = { cause: readEnum('Todesursache'), killer: readEnum('Killerart'), foundBy: readEnum('Fundweg'), origin: readEnum('Herkunft'), stage: readEnum('Stadium') };
    if (json) return out({ ok: true, values: werte });
    for (const [name, list] of Object.entries(werte)) console.log(`${pad(name, 8)} ${list.join(' · ')}`);
  } else if (sub === 'add') grabAdd();
  else die(`Unbekannter Unterbefehl „grab ${sub}“ (list | show | stats | werte | add)`);
}

function regenerateFriedhof() {
  const r = run('node', ['scripts/friedhof-muster.mjs']);
  return r.status === 0 ? r.stdout.trim() : 'friedhof-muster fehlgeschlagen:\n' + r.stderr;
}

function grabAdd() {
  let list;
  if (one('from')) {
    let g;
    try { g = JSON.parse(readFileSync(one('from') === '-' ? 0 : one('from'), 'utf8')); } catch (e) { fail({ code: 'PLAN_INVALID', field: 'from', message: `JSON nicht lesbar: ${e.message}` }); }
    list = Array.isArray(g) ? g : [g];
  } else {
    const map = { id: 'id', title: 'title', 'title-key': 'titleKey', 'original-de': 'originalIdeaDe', 'original-en': 'originalIdeaEn', 'why-de': 'whyDiscardedDe', 'why-en': 'whyDiscardedEn', 'lesson-de': 'lessonDe', 'lesson-en': 'lessonEn', domain: 'domain', cause: 'cause', killer: 'killer', 'found-by': 'foundBy', origin: 'origin', stage: 'stage', 'born-in': 'bornIn', 'died-on': 'diedOn', 'resurrect-de': 'resurrectIfDe', 'resurrect-en': 'resurrectIfEn', nachruf: 'nachruf' };
    const g = { evidence: many('evidence') };
    for (const [flag, key] of Object.entries(map)) if (one(flag)) g[key] = one(flag);
    g.diedOn ??= today();
    list = [g];
  }
  withLock();
  const current = loadGraeber();
  const doseIds = readDataIds().dosen;
  const fehler = [];
  const neu = [];
  for (const [i, g] of list.entries()) {
    const errs = validateGrab(g, { graeber: [...current, ...neu], doseIds });
    if (errs.length) fehler.push(...errs.map((m) => ({ code: 'VALUE_INVALID', field: list.length > 1 ? `[${i}]` : 'grave', message: list.length > 1 ? `Eintrag ${i + 1} (${g?.id ?? '?'}): ${m}` : m, ...(list.length > 1 ? { op: i } : {}) })));
    else neu.push(orderGrab(g));
  }
  if (fehler.length) {
    if (json) return fail(fehler);
    die('Totenschein' + (list.length > 1 ? 'e' : '') + ' ungültig, nichts gespeichert:\n' + fehler.map((e) => '  - ' + e.message).join('\n'), EXIT.VALIDATION);
  }
  if (dry) {
    if (json) return out({ ok: true, dry_run: true, graves: neu });
    return console.log(neu.length === 1 ? '[dry-run] würde anlegen:\n' + JSON.stringify(neu[0], null, 2) : `[dry-run] würde ${neu.length} Gräber anlegen: ${neu.map((g) => g.id).join(', ')}`);
  }
  writeFileSync(GRAEBER_FILE, JSON.stringify([...current, ...neu], null, 2) + '\n');
  const msg = regenerateFriedhof();
  audit({ cmd: 'grab add', ids: neu.map((g) => g.id) });
  if (json) return out({ ok: true, added: neu.map((g) => g.id), total: current.length + neu.length });
  console.log(`Begraben: ${neu.map((g) => g.id).join(', ')} — jetzt ${current.length + neu.length} Gräber.`);
  console.log(msg);
  console.log('Nächste Schritte: Quelle mit `quellen log <id> --grab <id>` verknüpfen, Protokollzeile (`bib protokoll add`), `npm run export:data`.');
}

// ---------------------------------------------------------------- protokoll

function cmdProtokoll() {
  const [sub = 'stats', ...more] = pos;
  const text = readFileSync(PROTOKOLL, 'utf8');
  if (sub === 'show') {
    if (!more.length) die('Aufruf: bib protokoll show <id|begriff…>');
    const rows = parseProtokoll(text).filter((r) => matches(r.text, more));
    if (json) return out({ ok: true, count: rows.length, rows: rows.map(({ text: _t, ...r }) => r) });
    for (const r of rows) console.log(`Z.${r.line} [${r.urteil ?? '?'}] ${r.section}\n  ${r.idee.slice(0, 120)}\n  ${r.beleg.slice(0, 260)}\n  prüfen ab: ${r.pruefenAb}\n`);
    console.log(`${rows.length} Zeilen`);
  } else if (sub === 'stats') {
    const s = protokollStats(parseProtokoll(text));
    if (json) return out({ ok: true, ...s });
    const zeile = (k, v) => `${pad(k, 62)} ${String(v.summe).padStart(4)}   frei ${String(v.frei).padStart(3)}  verengt ${String(v.verengt).padStart(3)}  unklar ${String(v.unklar).padStart(3)}  besetzt ${String(v.besetzt).padStart(3)}  sonst ${v.sonst}`;
    console.log('Gesamt\n' + zeile('alle Zeilen', s.gesamt));
    console.log('\nNach Methode');
    for (const [k, v] of Object.entries(s.nachMethode).sort((a, b) => b[1].summe - a[1].summe)) console.log('  ' + zeile(k, v));
    if (has('abschnitte')) {
      console.log('\nNach Abschnitt');
      for (const [k, v] of Object.entries(s.nachAbschnitt)) console.log('  ' + zeile(k, v));
    } else console.log(`\n(${Object.keys(s.nachAbschnitt).length} Abschnitte — mit --abschnitte einzeln)`);
  } else if (sub === 'add') protokollAdd();
  else die(`Unbekannter Unterbefehl „protokoll ${sub}“ (show | stats | add)`);
}

function protokollAdd() {
  const runde = one('runde');
  if (!runde) fail({ code: 'FIELD_REQUIRED', field: 'runde', message: '--runde "<Abschnittstitel>" fehlt (Text hinter „## “; Präfix genügt)' });
  withLock();
  const text = readFileSync(PROTOKOLL, 'utf8');
  let felder;
  try {
    felder = buildProtokollFelder({ titel: one('titel'), id: one('id'), was: one('was'), urteil: one('urteil'), beleg: one('beleg'), method: one('method'), evidenz: one('evidenz'), pruefenAb: one('pruefen-ab'), nr: one('nr') });
  } catch (e) { fail({ code: 'VALUE_INVALID', field: '', message: e.message }); }
  const bekannt = one('id') ? parseProtokoll(text).filter((r) => r.idee.includes(`(\`${one('id')}\`)`) || r.idee.includes(`(${one('id')})`)) : [];
  if (bekannt.length) say(`Hinweis: „${one('id')}“ steht schon ${bekannt.length}× im Protokoll (z. B. Z.${bekannt[0].line}, ${bekannt[0].urteil}) — bei Neubewertung das Vorurteil im Beleg nennen.`);
  let ergebnis;
  try { ergebnis = insertProtokollRow(text, { runde, felder, neuerAbschnitt: one('neuer-abschnitt') }); } catch (e) { fail({ code: 'VALUE_INVALID', field: 'runde', message: e.message }); }
  if (dry) return json ? out({ ok: true, dry_run: true, row: ergebnis.row }) : console.log('[dry-run] würde einfügen:\n' + ergebnis.row);
  writeFileSync(PROTOKOLL, ergebnis.text);
  audit({ cmd: 'protokoll add', runde, id: one('id') ?? one('titel') });
  if (json) return out({ ok: true, row: ergebnis.row, previous: bekannt.length });
  console.log(`Eingetragen in „${runde}“ (${felder.urteil}):\n${ergebnis.row}\nDanach: npm run check:protokoll`);
}

// ---------------------------------------------------------------- quellen

function quellenFormate() {
  const d = loadQuellen();
  const liste = (o) => Object.keys(o);
  const data = { typ: d.typen.map((t) => ({ id: t.id, titel: t.titel })), kategorie: liste(d.katalog.kategorien), status: d.katalog.status.map((s) => s.id), evidenz: liste(d.katalog.evidenz), zugang: ['ja', 'teilweise', 'gesperrt', 'unbekannt'], zugangArt: liste(d.katalog.zugangArt), rolle: liste(d.katalog.rollen) };
  if (json) return out({ ok: true, ...data });
  console.log(`typ        ${data.typ.map((t) => `${t.id} ${t.titel}`).join('\n           ')}`);
  console.log(`kategorie  ${data.kategorie.join(' · ')}`);
  console.log(`status     ${data.status.join(' · ')}   (durchsucht/erschöpft nur mit evidenz=seite)`);
  console.log(`evidenz    ${data.evidenz.join(' · ')}`);
  console.log(`zugang     ja · teilweise · gesperrt · unbekannt, optional [wie: …]   (Art: ${data.zugangArt.join(' · ')})`);
  console.log(`rolle      ${data.rolle.join(' · ')}`);
  console.log(`\nBestehende Quelle:\n  QUELLE <id> | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=Grab <id>, Idee <id> | urls=https://a https://b | note=Ein Satz.`);
  console.log(`Neue Quelle (typ, kategorie, enthaelt Pflicht; kein " | " im Freitext):\n  QUELLE NEU: Name | typ=D | kategorie=norm | enthaelt=Was dort steht | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://… | note=Ein Satz.`);
}

function cmdQuellen() {
  const [sub, file] = pos;
  if (sub === 'formate') return quellenFormate();
  if (sub === 'match') return quellenMatch();
  if (sub !== 'import') die('Aufruf: bib quellen import <datei|-> --agent <name> --runde "…"  |  quellen match --url <u>  |  quellen formate');
  if (!file) die('Datei fehlt (oder - für stdin)');
  if (!one('agent')) fail({ code: 'FIELD_REQUIRED', field: 'agent', message: '--agent fehlt (wer hat gemeldet?)' });
  if (!one('runde')) fail({ code: 'FIELD_REQUIRED', field: 'runde', message: '--runde fehlt' });
  const agent = one('agent');
  const runde = one('runde');
  const text = readFileSync(file === '-' ? 0 : file, 'utf8');
  withLock(agent);
  const data = loadQuellen();
  const { doseIds, graveIds } = refIds(); // schon Sets (Form aus quellen-lib.mjs)
  const { eintraege, fehler } = parseQuellenmeldung(text, { quellen: data.quellen, katalog: data.katalog, typen: data.typen.map((t) => t.id), doseIds, graveIds });
  if (fehler.length) {
    if (json) return fail(fehler.map((f) => ({ code: 'VALUE_INVALID', field: '', message: f })));
    die('Quellenmeldung fehlerhaft, nichts gebucht:\n' + fehler.map((f) => '  - ' + f).join('\n'), EXIT.VALIDATION);
  }
  let ok = 0;
  const commands = [];
  for (const e of eintraege) {
    const args = meldungToArgs(e, { agent, runde });
    commands.push(args);
    if (dry) { say('[dry-run] quellen ' + args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')); continue; }
    const r = run('node', ['scripts/quellen.mjs', ...args]);
    if (r.status !== 0) fail({ code: 'APPLY_FAILED', field: `zeile ${e.zeile}`, message: `Abbruch bei Zeile ${e.zeile} (${e.id}) nach ${ok} gebuchten:\n${(r.stderr || r.stdout).trim()}` }, EXIT.APPLY_FAILED);
    say(r.stdout.trim().split('\n').pop());
    ok++;
  }
  audit({ cmd: 'quellen import', count: ok });
  if (json) return out({ ok: true, dry_run: dry, imported: ok, entries: eintraege.map((e) => ({ line: e.zeile, id: e.id, neu: e.neu })), commands: dry ? commands : undefined });
  if (!dry) console.log(`\n${ok} Meldungen gebucht. Weiter: npm run quellen -- rate <id> --q … (wenn eine Runde die Quelle angefasst hat), dann npm run bib -- abschluss.`);
}

// ---------------------------------------------------------------- status, abschluss

function cmdStatus() {
  const rows = parseProtokoll(readFileSync(PROTOKOLL, 'utf8'));
  const graeber = loadGraeber();
  const kand = readCandidates();
  const q = loadQuellen().quellen;
  const count = (list, fn) => list.reduce((n, x) => ((n[fn(x)] = (n[fn(x)] ?? 0) + 1), n), {});
  const s = {
    doses: readDataIds().dosen.length,
    graves: { total: graeber.length, latest: graeber.map((g) => g.diedOn).sort().pop() },
    protokoll: { rows: rows.length, verdicts: count(rows, (r) => r.urteil ?? 'sonst') },
    candidates: { total: kand.length, status: count(kand, (c) => c.status || '?') },
    sources: { total: q.length, status: count(q, (x) => x.status) },
    git: { branch: run('git', ['branch', '--show-current']).stdout.trim(), changes: run('git', ['status', '--short']).stdout.trim().split('\n').filter(Boolean).length },
  };
  if (json) return out({ ok: true, ...s });
  const fmt = (o) => Object.entries(o).map(([k, v]) => `${k} ${v}`).join(' · ');
  console.log(`Dosen        ${s.doses}`);
  console.log(`Gräber       ${s.graves.total}   (zuletzt: ${s.graves.latest})`);
  console.log(`Protokoll    ${s.protokoll.rows} Zeilen   ${fmt(s.protokoll.verdicts)}`);
  console.log(`Kandidaten   ${s.candidates.total}   ${fmt(s.candidates.status)}`);
  console.log(`Quellen      ${s.sources.total}   ${fmt(s.sources.status)}`);
  console.log(`Branch       ${s.git.branch}   ${s.git.changes} offene Änderungen`);
}

function cmdAbschluss() {
  const schritte = [['export:data', ['run', 'export:data']], ['lint', ['run', 'lint']], ...(has('schnell') ? [] : [['test', ['test']]])];
  const ergebnis = [];
  for (const [name, args] of schritte) {
    say(`\n▶ npm ${args.join(' ')}`);
    const r = spawnSync('npm', args, { cwd: repoRoot, stdio: json ? 'pipe' : 'inherit', encoding: 'utf8' });
    ergebnis.push([name, r.status === 0]);
    if (r.status !== 0 && name !== 'test') break;
  }
  const dirty = run('git', ['status', '--short']).stdout.trim();
  const ok = ergebnis.every(([, o]) => o);
  if (json) out({ ok, steps: ergebnis.map(([name, o]) => ({ name, ok: o })), skipped: has('schnell') ? ['test'] : [], changes: dirty ? dirty.split('\n') : [] });
  else {
    console.log('\n— Abschluss —');
    for (const [n, o] of ergebnis) console.log(`${o ? '✓' : '✗'} ${n}`);
    if (has('schnell')) console.log('– test übersprungen (--schnell)');
    console.log(dirty ? `\nOffene Änderungen (noch nicht committet):\n${dirty}` : '\nArbeitsbaum sauber.');
  }
  process.exit(ok ? 0 : 1);
}

switch (cmd) {
  case 'find': cmdFind(); break;
  case 'exists': cmdExists(); break;
  case 'schema': cmdSchema(); break;
  case 'state': cmdState(); break;
  case 'ledger': cmdLedger(); break;
  case 'apply': cmdApply(); break;
  case 'vector': cmdVector(); break;
  case 'vorflug': await cmdVorflug(); break;
  case 'grab': cmdGrab(); break;
  case 'protokoll': cmdProtokoll(); break;
  case 'quellen': cmdQuellen(); break;
  case 'status': cmdStatus(); break;
  case 'abschluss': cmdAbschluss(); break;
  case 'hilfe': case 'help': case '--help': console.log(HILFE); break;
  default: die(`Unbekannter Befehl „${cmd}“.\n\n${HILFE}`);
}
