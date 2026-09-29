#!/usr/bin/env node
// Bibliotheks-CLI: das Gedächtnis von Amélie per Kommandozeile.
//
// Lesen darf jeder Agent, schreiben nur der Bibliothekar (Handbuch: 06-suche/amelie-bibliothek-cli.md).
//
//   LESEN (alle Agenten)
//   npm run bib -- find <begriff…> [--any] [--wort] [--alle] [--json]   Doppelprüfung über Protokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs
//   npm run bib -- vorflug [--thema x] [--netz]                git fetch, fremde Branches/Commits, optional Netztest
//   npm run bib -- grab list [--cause x] [--killer x] [--found-by x] [--stage x] [--origin x] [--since 2026-09-01]
//   npm run bib -- grab show <id>
//   npm run bib -- grab werte                                  erlaubte Werte des Totenscheins
//   npm run bib -- grab stats
//   npm run bib -- protokoll show <id|begriff…>
//   npm run bib -- protokoll stats
//   npm run bib -- status                                      Bestandsübersicht
//
//   SCHREIBEN (nur Bibliothekar; jeder Befehl kennt --dry-run)
//   npm run bib -- grab add --from grab.json | (Einzelflags, siehe hilfe)
//   npm run bib -- protokoll add --runde "…" --titel "…" --urteil frei|verengt|unklar|besetzt --beleg "…" --evidenz seite|schnipsel --method ideenrunde --pruefen-ab 09/2027 [--id x] [--was "…"] [--nr H9] [--neuer-abschnitt "Einleitung"]
//   npm run bib -- quellen formate                             (lesen) gültige typ/kategorie/status-Werte + Beispielzeilen
//   npm run bib -- quellen import <datei|-> --agent <name> --runde "…"
//   npm run bib -- abschluss [--schnell]                       export:data → lint → test, dann Übersicht der offenen Änderungen
//
// Exit-Codes: 0 ok · 1 Fehler/Eingabe ungültig · 2 (nur find) Treffer in Protokoll/Friedhof/Dosen/Kandidaten = „schon da“.

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { repoRoot, GRAEBER_FILE, loadGraeber, readDataIds } from './dosen-lib.mjs';
import { loadQuellen, refIds } from './quellen-lib.mjs';
import {
  parseArgs, findAll, parseProtokoll, protokollStats, buildProtokollFelder, insertProtokollRow,
  validateGrab, orderGrab, readEnum, readCandidates, parseQuellenmeldung, meldungToArgs, matches, PROTOKOLL, verdictOf,
} from './bibliothek-lib.mjs';

const [cmd = 'hilfe', ...rest] = process.argv.slice(2);
const { pos, one, many, has } = parseArgs(rest);
const die = (msg, code = 1) => { console.error(msg); process.exit(code); };
const dry = has('dry-run');
const run = (bin, args, opts = {}) => spawnSync(bin, args, { cwd: repoRoot, encoding: 'utf8', ...opts });
const today = () => new Date().toISOString().slice(0, 10);
const pad = (s, n) => String(s).padEnd(n).slice(0, n);

const HILFE = `Bibliotheks-CLI — npm run bib -- <befehl>

LESEN (alle Agenten)
  find <begriff…> [--any] [--wort] [--alle] [--json]   „Gibt es das schon?“ über Protokoll, Friedhof, Dosen, Kandidaten, Quellen, Logs.
                                              Exit 2 = Treffer in Protokoll/Friedhof/Dosen/Kandidaten. Mehrere Begriffe = alle müssen passen (--any: einer genügt; --wort: nur ganze Wörter).
  vorflug [--thema x] [--netz]                git fetch, fremde Branches und Commits der letzten 14 Tage, offene Themen; --netz testet Hosts
  grab list|show|stats|werte                  Friedhof lesen; werte = erlaubte Totenschein-Werte (Filter: --cause --killer --found-by --stage --origin --since)
  protokoll show <id|begriff…>                Zeilen des Prüfprotokolls
  protokoll stats                             Urteile je Abschnitt und Methode
  status                                      Bestand auf einen Blick

SCHREIBEN (nur Bibliothekar, --dry-run zeigt nur)
  grab add --from <datei.json>                Totenschein aus JSON (Objekt) anlegen, Friedhof-README neu erzeugen
  grab add --id … --title … --original-de … --original-en … --why-de … --why-en … --lesson-de … --lesson-en …
           --domain … --cause … --killer … --found-by … --origin … --stage … --born-in … --died-on … --resurrect-de … --resurrect-en …
           [--evidence "…"]… [--nachruf pfad]
  protokoll add --runde "Abschnittstitel" --titel "…" --urteil frei|verengt|unklar|besetzt --beleg "…"
                --evidenz seite|schnipsel --method ideenrunde --pruefen-ab 09/2027 [--id x] [--was "…"] [--nr H9] [--neuer-abschnitt "Einleitung"]
                (erkennt die 4- und die 8-Spalten-Tabelle; ohne --nr wird die Nummer der letzten Zeile hochgezählt)
  quellen import <datei|-> --agent <name> --runde "…"   Quellenmeldung-Zeilen der Agenten ins Register buchen (erst alles prüfen, dann buchen)
  abschluss [--schnell]                       export:data → lint → test; listet offene Änderungen. --schnell lässt die Tests aus

Handbuch: 06-suche/amelie-bibliothek-cli.md`;

// ---------------------------------------------------------------- find

function cmdFind() {
  if (!pos.length) die('Aufruf: bib find <begriff…> [--any] [--wort] [--alle] [--json]   (Schalter stehen vor oder nach den Begriffen)');
  const hits = findAll(pos, { any: has('any'), wort: has('wort'), quellen: loadQuellen().quellen });
  const bindend = hits.filter((h) => h.bindend);
  if (has('json')) console.log(JSON.stringify({ begriffe: pos, schonDa: bindend.length > 0, treffer: hits }, null, 2));
  else {
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
  process.exit(bindend.length ? 2 : 0);
}

// ---------------------------------------------------------------- vorflug

async function cmdVorflug() {
  const fetch1 = run('git', ['fetch', '--all', '--prune', '--quiet'], { timeout: 60000 });
  console.log(fetch1.status === 0 ? '✓ git fetch' : `✗ git fetch fehlgeschlagen (${(fetch1.stderr || fetch1.error?.message || '').trim().split('\n')[0]}) — Stand kann veraltet sein`);
  const branch = run('git', ['branch', '--show-current']).stdout.trim();
  console.log(`Aktueller Branch: ${branch || '(detached)'}`);
  const refs = run('git', ['for-each-ref', '--sort=-committerdate', '--count=25', '--format=%(committerdate:short)\t%(refname:short)\t%(authorname)\t%(subject)', 'refs/remotes']).stdout.trim().split('\n').filter(Boolean);
  const fremd = refs.map((l) => l.split('\t')).filter(([, ref]) => ref !== 'origin/HEAD' && ref !== 'origin' && ref !== `origin/${branch}`);
  const frisch = fremd.filter(([d]) => (Date.now() - Date.parse(d)) / 864e5 <= 14);
  console.log(`\nRemote-Branches mit Commits in den letzten 14 Tagen (${frisch.length}):`);
  for (const [d, ref, autor, subj] of frisch.slice(0, 15)) console.log(`  ${d}  ${pad(ref, 44)} ${pad(autor, 14)} ${subj.slice(0, 70)}`);
  if (!frisch.length) console.log('  (keine)');
  const thema = one('thema');
  if (thema) {
    const t = thema.split(/[\s,]+/).filter(Boolean);
    const log = run('git', ['log', '--all', '--since=30.days', '-i', '--format=%h %ad %s [%D]', '--date=short', ...t.flatMap((x) => ['--grep', x])]).stdout.trim();
    const brs = refs.map((l) => l.split('\t')[1]).filter((r) => t.some((x) => r.toLowerCase().includes(x.toLowerCase())));
    console.log(`\nThema „${thema}“ in Commits der letzten 30 Tage / Branchnamen:`);
    console.log(log ? log.split('\n').slice(0, 10).map((l) => '  ' + l.slice(0, 140)).join('\n') : '  (keine Commits)');
    if (brs.length) console.log('  Branches: ' + brs.join(', '));
    const hits = findAll(t, { any: true }).filter((h) => h.bindend);
    console.log(`\nGedächtnis-Treffer (bib find, mindestens ein Begriff): ${hits.length}${hits.length ? ' — genauer mit: npm run bib -- find ' + t.join(' ') : ''}`);
  }
  console.log('\nOffene Pull Requests: nicht per CLI erreichbar — mit dem GitHub-Werkzeug list_pull_requests (state=open) prüfen und Duplikate zum Thema melden.');
  if (has('netz')) {
    console.log('\nNetztest (5 s je Host):');
    for (const url of ['https://github.com', 'https://publications.europa.eu', 'https://www.bundesanzeiger.de', 'https://www.gesetze-im-internet.de', 'https://de.wikipedia.org']) {
      const t0 = Date.now();
      try {
        const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000), redirect: 'follow' });
        console.log(`  ${r.status < 400 ? '✓' : '✗'} ${r.status} ${url} (${Date.now() - t0} ms)`);
      } catch (err) {
        console.log(`  ✗ ${url} — ${err.cause?.code ?? err.name}`);
      }
    }
  }
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
      if (!erlaubt.includes(one(flag))) die(`--${flag} „${one(flag)}“ ungültig. Erlaubt: ${erlaubt.join(' · ')}`);
      list = list.filter((g) => g[key] === one(flag));
    }
    if (one('since')) list = list.filter((g) => g.diedOn >= one('since'));
    list = [...list].sort((a, b) => b.diedOn.localeCompare(a.diedOn));
    for (const g of list) console.log(`${pad(g.diedOn, 10)} ${pad(g.cause, 15)} ${pad(g.killer, 15)} ${pad(g.foundBy, 15)} ${pad(g.stage, 12)} ${pad(g.id, 34)} ${g.title.slice(0, 50)}`);
    console.log(`\n${list.length} von ${graeber.length} Gräbern`);
  } else if (sub === 'show') {
    const g = graeber.find((x) => x.id === more[0]) ?? die(`Unbekanntes Grab „${more[0] ?? ''}“. Suche: npm run bib -- find <begriff>`);
    console.log(JSON.stringify(g, null, 2));
  } else if (sub === 'stats') {
    for (const key of ['cause', 'killer', 'foundBy', 'stage', 'origin']) {
      const n = {};
      for (const g of graeber) n[g[key]] = (n[g[key]] ?? 0) + 1;
      console.log(`${pad(key, 8)} ${Object.entries(n).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
    }
    console.log(`\n${graeber.length} Gräber`);
  } else if (sub === 'werte') {
    for (const [name, typ] of [['cause', 'Todesursache'], ['killer', 'Killerart'], ['foundBy', 'Fundweg'], ['origin', 'Herkunft'], ['stage', 'Stadium']]) console.log(`${pad(name, 8)} ${readEnum(typ).join(' · ')}`);
  } else if (sub === 'add') grabAdd(graeber);
  else die(`Unbekannter Unterbefehl „grab ${sub}“ (list | show | stats | werte | add)`);
}

function grabAdd(graeber) {
  let g;
  if (one('from')) {
    g = JSON.parse(readFileSync(one('from') === '-' ? 0 : one('from'), 'utf8'));
    if (Array.isArray(g)) die('--from erwartet ein Objekt (ein Grab je Aufruf)');
  } else {
    const map = { id: 'id', title: 'title', 'title-key': 'titleKey', 'original-de': 'originalIdeaDe', 'original-en': 'originalIdeaEn', 'why-de': 'whyDiscardedDe', 'why-en': 'whyDiscardedEn', 'lesson-de': 'lessonDe', 'lesson-en': 'lessonEn', domain: 'domain', cause: 'cause', killer: 'killer', 'found-by': 'foundBy', origin: 'origin', stage: 'stage', 'born-in': 'bornIn', 'died-on': 'diedOn', 'resurrect-de': 'resurrectIfDe', 'resurrect-en': 'resurrectIfEn', nachruf: 'nachruf' };
    g = { evidence: many('evidence') };
    for (const [flag, key] of Object.entries(map)) if (one(flag)) g[key] = one(flag);
    g.diedOn ??= today();
  }
  const errs = validateGrab(g, { graeber, doseIds: readDataIds().dosen });
  if (errs.length) die('Totenschein ungültig, nichts gespeichert:\n' + errs.map((e) => '  - ' + e).join('\n'));
  const grab = orderGrab(g);
  if (dry) return console.log('[dry-run] würde anlegen:\n' + JSON.stringify(grab, null, 2));
  writeFileSync(GRAEBER_FILE, JSON.stringify([...graeber, grab], null, 2) + '\n');
  const r = run('node', ['scripts/friedhof-muster.mjs']);
  console.log(`Begraben: ${grab.id} (${grab.cause}/${grab.killer}, ${grab.diedOn}) — jetzt ${graeber.length + 1} Gräber.`);
  console.log(r.status === 0 ? r.stdout.trim() : 'friedhof-muster fehlgeschlagen:\n' + r.stderr);
  console.log('Nächste Schritte: Quelle mit `quellen log <id> --grab ' + grab.id + '` verknüpfen, Protokollzeile (`bib protokoll add`), `npm run export:data`.');
}

// ---------------------------------------------------------------- protokoll

function cmdProtokoll() {
  const [sub = 'stats', ...more] = pos;
  const text = readFileSync(PROTOKOLL, 'utf8');
  if (sub === 'show') {
    if (!more.length) die('Aufruf: bib protokoll show <id|begriff…>');
    const rows = parseProtokoll(text).filter((r) => matches(r.text, more));
    for (const r of rows) console.log(`Z.${r.line} [${r.urteil ?? '?'}] ${r.section}\n  ${r.idee.slice(0, 120)}\n  ${r.beleg.slice(0, 260)}\n  prüfen ab: ${r.pruefenAb}\n`);
    console.log(`${rows.length} Zeilen`);
  } else if (sub === 'stats') {
    const s = protokollStats(parseProtokoll(text));
    const zeile = (k, v) => `${pad(k, 62)} ${String(v.summe).padStart(4)}   frei ${String(v.frei).padStart(3)}  verengt ${String(v.verengt).padStart(3)}  unklar ${String(v.unklar).padStart(3)}  besetzt ${String(v.besetzt).padStart(3)}  sonst ${v.sonst}`;
    console.log('Gesamt\n' + zeile('alle Zeilen', s.gesamt));
    console.log('\nNach Methode');
    for (const [k, v] of Object.entries(s.nachMethode).sort((a, b) => b[1].summe - a[1].summe)) console.log('  ' + zeile(k, v));
    if (has('abschnitte')) {
      console.log('\nNach Abschnitt');
      for (const [k, v] of Object.entries(s.nachAbschnitt)) console.log('  ' + zeile(k, v));
    } else console.log(`\n(${Object.keys(s.nachAbschnitt).length} Abschnitte — mit --abschnitte einzeln)`);
  } else if (sub === 'add') protokollAdd(text);
  else die(`Unbekannter Unterbefehl „protokoll ${sub}“ (show | stats | add)`);
}

function protokollAdd(text) {
  const runde = one('runde') ?? die('--runde "<Abschnittstitel>" fehlt (Text hinter „## “; Präfix genügt)');
  let felder;
  try {
    felder = buildProtokollFelder({ titel: one('titel'), id: one('id'), was: one('was'), urteil: one('urteil'), beleg: one('beleg'), method: one('method'), evidenz: one('evidenz'), pruefenAb: one('pruefen-ab'), nr: one('nr') });
  } catch (e) { die(e.message); }
  const bekannt = one('id') ? parseProtokoll(text).filter((r) => r.idee.includes(`(\`${one('id')}\`)`) || r.idee.includes(`(${one('id')})`)) : [];
  if (bekannt.length) console.log(`Hinweis: „${one('id')}“ steht schon ${bekannt.length}× im Protokoll (z. B. Z.${bekannt[0].line}, ${bekannt[0].urteil}) — bei Neubewertung das Vorurteil im Beleg nennen.`);
  let ergebnis;
  try { ergebnis = insertProtokollRow(text, { runde, felder, neuerAbschnitt: one('neuer-abschnitt') }); } catch (e) { die(e.message); }
  if (dry) return console.log('[dry-run] würde einfügen:\n' + ergebnis.row);
  writeFileSync(PROTOKOLL, ergebnis.text);
  console.log(`Eingetragen in „${runde}“ (${felder.urteil}):\n${ergebnis.row}\nDanach: npm run check:protokoll`);
}

// ---------------------------------------------------------------- quellen import

function quellenFormate() {
  const d = loadQuellen();
  const liste = (o) => Object.keys(o).join(' · ');
  console.log(`typ        ${d.typen.map((t) => `${t.id} ${t.titel}`).join('\n           ')}`);
  console.log(`kategorie  ${liste(d.katalog.kategorien)}`);
  console.log(`status     ${d.katalog.status.map((s) => s.id).join(' · ')}   (durchsucht/erschöpft nur mit evidenz=seite)`);
  console.log(`evidenz    ${liste(d.katalog.evidenz)}`);
  console.log(`zugang     ja · teilweise · gesperrt · unbekannt, optional [wie: …]   (Art: ${liste(d.katalog.zugangArt)})`);
  console.log(`rolle      ${liste(d.katalog.rollen)}`);
  console.log(`\nBestehende Quelle:\n  QUELLE <id> | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=Grab <id>, Idee <id> | urls=https://a https://b | note=Ein Satz.`);
  console.log(`Neue Quelle (typ, kategorie, enthaelt Pflicht; kein " | " im Freitext):\n  QUELLE NEU: Name | typ=D | kategorie=norm | enthaelt=Was dort steht | status=angekratzt | evidenz=schnipsel | zugang=ja | ertrag=– | urls=https://… | note=Ein Satz.`);
}

function cmdQuellen() {
  const [sub, file] = pos;
  if (sub === 'formate') return quellenFormate();
  if (sub !== 'import') die('Aufruf: bib quellen import <datei|-> --agent <name> --runde "…"');
  if (!file) die('Datei fehlt (oder - für stdin)');
  const agent = one('agent') ?? die('--agent fehlt (wer hat gemeldet?)');
  const runde = one('runde') ?? die('--runde fehlt');
  const text = readFileSync(file === '-' ? 0 : file, 'utf8');
  const data = loadQuellen();
  const { dosen, discarded } = refIds();
  const { eintraege, fehler } = parseQuellenmeldung(text, { quellen: data.quellen, katalog: data.katalog, typen: data.typen.map((t) => t.id), doseIds: new Set(dosen), graveIds: new Set(discarded) });
  if (fehler.length) die('Quellenmeldung fehlerhaft, nichts gebucht:\n' + fehler.map((f) => '  - ' + f).join('\n'));
  let ok = 0;
  for (const e of eintraege) {
    const args = meldungToArgs(e, { agent, runde });
    if (dry) { console.log('[dry-run] quellen ' + args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')); continue; }
    const r = run('node', ['scripts/quellen.mjs', ...args]);
    if (r.status !== 0) die(`Abbruch bei Zeile ${e.zeile} (${e.id}) nach ${ok} gebuchten:\n${(r.stderr || r.stdout).trim()}`);
    console.log(r.stdout.trim().split('\n').pop());
    ok++;
  }
  if (!dry) console.log(`\n${ok} Meldungen gebucht. Weiter: npm run quellen -- rate <id> --q … (wenn eine Runde die Quelle angefasst hat), dann npm run bib -- abschluss.`);
}

// ---------------------------------------------------------------- status, abschluss

function cmdStatus() {
  const rows = parseProtokoll(readFileSync(PROTOKOLL, 'utf8'));
  const graeber = loadGraeber();
  const kand = readCandidates();
  const q = loadQuellen().quellen;
  const zaehle = (list, fn) => Object.entries(list.reduce((n, x) => ((n[fn(x)] = (n[fn(x)] ?? 0) + 1), n), {})).map(([k, v]) => `${k} ${v}`).join(' · ');
  console.log(`Dosen        ${readDataIds().dosen.length}`);
  console.log(`Gräber       ${graeber.length}   (zuletzt: ${graeber.map((g) => g.diedOn).sort().pop()})`);
  console.log(`Protokoll    ${rows.length} Zeilen   ${zaehle(rows, (r) => r.urteil ?? 'sonst')}`);
  console.log(`Kandidaten   ${kand.length}   ${zaehle(kand, (c) => c.status || '?')}`);
  console.log(`Quellen      ${q.length}   ${zaehle(q, (x) => x.status)}`);
  console.log(`Branch       ${run('git', ['branch', '--show-current']).stdout.trim()}   ${run('git', ['status', '--short']).stdout.trim().split('\n').filter(Boolean).length} offene Änderungen`);
}

function cmdAbschluss() {
  const schritte = [['export:data', ['run', 'export:data']], ['lint', ['run', 'lint']], ...(has('schnell') ? [] : [['test', ['test']]])];
  const ergebnis = [];
  for (const [name, args] of schritte) {
    console.log(`\n▶ npm ${args.join(' ')}`);
    const r = spawnSync('npm', args, { cwd: repoRoot, stdio: 'inherit' });
    ergebnis.push([name, r.status === 0]);
    if (r.status !== 0 && name !== 'test') break;
  }
  console.log('\n— Abschluss —');
  for (const [n, ok] of ergebnis) console.log(`${ok ? '✓' : '✗'} ${n}`);
  if (has('schnell')) console.log('– test übersprungen (--schnell)');
  const dirty = run('git', ['status', '--short']).stdout.trim();
  console.log(dirty ? `\nOffene Änderungen (noch nicht committet):\n${dirty}` : '\nArbeitsbaum sauber.');
  process.exit(ergebnis.every(([, ok]) => ok) ? 0 : 1);
}

switch (cmd) {
  case 'find': cmdFind(); break;
  case 'vorflug': await cmdVorflug(); break;
  case 'grab': cmdGrab(); break;
  case 'protokoll': cmdProtokoll(); break;
  case 'quellen': cmdQuellen(); break;
  case 'status': cmdStatus(); break;
  case 'abschluss': cmdAbschluss(); break;
  case 'hilfe': case 'help': case '--help': console.log(HILFE); break;
  default: die(`Unbekannter Befehl „${cmd}“.\n\n${HILFE}`);
}
