#!/usr/bin/env node
// Werkzeug für das Quellen-Register (src/data/quellen.json). Handbuch: 06-suche/amelie-quellen-register.md
//
//   npm run quellen -- list [--typ O] [--status offen] [--kategorie norm] [--rolle empfaenger] [--tag holz] [--sort empfehlung|q1..q6|zuletzt|name] [--limit 20]
//   npm run quellen -- show <id>
//   npm run quellen -- stats
//   npm run quellen -- next [--limit 5] [--tag holz]        (welche Quelle als Nächstes graben)
//   npm run quellen -- log <id> --note "…" [--status durchsucht] [--evidenz seite] [--agent ideen-scout] [--runde "…"]
//                      [--dose <id>]… [--grab <id>]… [--kandidat <id>]… [--wv 2027-03] [--wie "…"] [--erreichbar teilweise] [--url https://…]
//   npm run quellen -- rate <id> --q 4,3,5,4,3,4 [--basis bibliothekar] [--note "…"]
//   npm run quellen -- add --id <slug> --name "…" --typ O --kategorie norm --enthaelt "…" [--fokus "…"] [--status angekratzt]
//                      [--evidenz schnipsel] [--art web] [--erreichbar ja] [--wie "…"] [--url …]… [--tag …]… [--rolle …]… [--q 3,4,3,3,4,3] [--agent …] [--runde "…"]
//   npm run quellen -- md            (06-suche/amelie-quellen.md neu erzeugen)
//   npm run quellen -- check         (validieren + prüfen, dass die .md aktuell ist; Exit 1 bei Fehlern — Teil von npm run lint)
//
// Schreibende Befehle validieren vor dem Speichern und erzeugen die .md neu.

import { readFileSync, writeFileSync } from 'node:fs';
import { loadQuellen, saveQuellen, validate, refIds, renderMarkdown, stats, scoreOf, empfehlung, isoToday, QUELLEN_MD } from './quellen-lib.mjs';

const [cmd = 'help', ...rest] = process.argv.slice(2);
const flags = {};
const pos = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith('--')) {
    const key = rest[i].slice(2);
    const val = rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : 'true';
    (flags[key] ??= []).push(val);
  } else pos.push(rest[i]);
}
const one = (k) => flags[k]?.[0];
const many = (k) => flags[k] ?? [];
const die = (msg) => { console.error(msg); process.exit(1); };

const data = loadQuellen();
const find = (id) => data.quellen.find((q) => q.id === id) ?? die(`Unbekannte Quelle „${id}“. Ähnliche: ${data.quellen.filter((q) => q.id.includes(id.split('-')[0])).map((q) => q.id).slice(0, 5).join(', ') || '–'}`);

function commit() {
  const errs = validate(data, refIds());
  if (errs.length) die('Register ungültig, nichts gespeichert:\n' + errs.map((e) => '  - ' + e).join('\n'));
  data.stand = isoToday();
  saveQuellen(data);
  writeFileSync(QUELLEN_MD, renderMarkdown(data));
}

const qArr = (s) => {
  const a = s.split(',').map((n) => Number(n.trim()));
  if (a.length !== data.katalog.vektoren.length) die(`--q braucht ${data.katalog.vektoren.length} kommagetrennte Zahlen (Q1–Q6)`);
  return a;
};
const line = (q) => `${q.id.padEnd(44).slice(0, 44)} ${q.typ} ${q.status.padEnd(10)} ${String(q.zuletzt ?? '–').padEnd(10)} Q=${String(scoreOf(q)).padStart(2)}${q.vektoren.basis === 'auto' ? '*' : ' '} [${q.vektoren.q.join(' ')}] ${q.name.slice(0, 50)}`;

function filtered() {
  let qs = data.quellen.slice();
  if (one('typ')) qs = qs.filter((q) => q.typ === one('typ'));
  if (one('status')) qs = qs.filter((q) => q.status === one('status'));
  if (one('kategorie')) qs = qs.filter((q) => q.kategorie === one('kategorie'));
  if (one('rolle')) qs = qs.filter((q) => q.rollen.includes(one('rolle')));
  if (one('tag')) qs = qs.filter((q) => q.tags.includes(one('tag')));
  if (one('erreichbar')) qs = qs.filter((q) => q.zugang.erreichbar === one('erreichbar'));
  return qs;
}

switch (cmd) {
  case 'list': {
    const s = one('sort') ?? 'name';
    const qs = filtered();
    const keyFn = { empfehlung: (q) => -empfehlung(q), zuletzt: (q) => q.zuletzt ?? '', name: (q) => q.id, score: (q) => -scoreOf(q) }[s] ?? ((q) => -q.vektoren.q[Number(s.replace('q', '')) - 1]);
    qs.sort((a, b) => (keyFn(a) > keyFn(b) ? 1 : keyFn(a) < keyFn(b) ? -1 : 0));
    for (const q of qs.slice(0, Number(one('limit') ?? 500))) console.log(line(q));
    console.log(`\n${qs.length} Quellen (* = Vektoren nur automatisch abgeleitet)`);
    break;
  }
  case 'next': {
    const qs = filtered().filter((q) => q.status !== 'gesperrt' && q.status !== 'erschöpft' && q.rollen.includes('ideenquelle')).sort((a, b) => empfehlung(b) - empfehlung(a));
    console.log('Empfehlung (Restpotenzial×3 + Zugang×2 + Geländefreiheit×2 + Ergiebigkeit×2 + Belastbarkeit + Anschluss×0,5):\n');
    for (const q of qs.slice(0, Number(one('limit') ?? 5))) console.log(line(q) + `\n    Zugang: ${data.katalog.zugangArt[q.zugang.art]} (${q.zugang.erreichbar})${q.zugang.wie ? ' — ' + q.zugang.wie : ''}`);
    break;
  }
  case 'show': {
    console.log(JSON.stringify(find(pos[0]), null, 2));
    break;
  }
  case 'stats': {
    const s = stats(data);
    console.log(JSON.stringify(s, null, 2));
    console.log('Mittel je Vektor: ' + data.katalog.vektoren.map((v, i) => `${v.code} ${v.labelDe} ${s.mittelVektoren[i]}`).join(' · '));
    break;
  }
  case 'log': {
    const q = find(pos[0]);
    if (!one('note')) die('--note ist Pflicht (was wurde gefunden?)');
    const datum = one('datum') ?? isoToday();
    if (one('status')) q.status = one('status');
    if (one('evidenz')) q.evidenz = one('evidenz');
    if (one('erreichbar')) q.zugang.erreichbar = one('erreichbar');
    if (one('wie')) q.zugang.wie = one('wie');
    if (one('art')) q.zugang.art = one('art');
    for (const u of many('url')) if (!q.urls.includes(u)) q.urls.push(u);
    for (const [flag, key] of [['dose', 'dosen'], ['grab', 'graeber'], ['kandidat', 'kandidaten']]) {
      q.ertrag[key] ??= [];
      for (const id of many(flag)) if (!q.ertrag[key].includes(id)) q.ertrag[key].push(id);
    }
    if (one('wv')) q.wiedervorlage = one('wv');
    q.zuletzt = datum;
    if (one('status')) q.statusNotiz = '';
    q.verlauf.push({ datum, agent: one('agent') ?? 'bibliothekar', runde: one('runde') ?? '', notiz: one('note'), ...(one('status') ? { status: q.status } : {}) });
    commit();
    console.log(`Gebucht: ${q.id} → ${q.status}, ${q.verlauf.length} Verlaufseinträge.`);
    break;
  }
  case 'rate': {
    const q = find(pos[0]);
    if (!one('q')) die('--q Q1,Q2,Q3,Q4,Q5,Q6 ist Pflicht');
    q.vektoren = { q: qArr(one('q')), basis: one('basis') ?? 'bibliothekar', datum: isoToday() };
    q.verlauf.push({ datum: isoToday(), agent: one('agent') ?? 'bibliothekar', runde: one('runde') ?? '', notiz: `Vektoren bewertet [${q.vektoren.q.join(' ')}]${one('note') ? ': ' + one('note') : ''}` });
    commit();
    console.log(`Bewertet: ${q.id} = ${scoreOf(q)}/30`);
    break;
  }
  case 'add': {
    for (const r of ['id', 'name', 'typ', 'kategorie', 'enthaelt']) if (!one(r)) die(`--${r} ist Pflicht`);
    if (data.quellen.some((q) => q.id === one('id'))) die(`id „${one('id')}“ existiert schon — mit „log“ ergänzen`);
    const datum = one('datum') ?? isoToday();
    const status = one('status') ?? 'offen';
    data.quellen.push({
      id: one('id'), name: one('name'), typ: one('typ'), kategorie: one('kategorie'),
      rollen: many('rolle').length ? many('rolle') : ['ideenquelle'], tags: many('tag'), urls: many('url'),
      zugang: { art: one('art') ?? 'web', erreichbar: one('erreichbar') ?? 'unbekannt', wie: one('wie') ?? '' },
      enthaelt: one('enthaelt'), fokus: one('fokus') ?? '', status, statusNotiz: '', evidenz: one('evidenz') ?? 'unbekannt',
      zuletzt: status === 'offen' ? null : datum, ...(one('wv') ? { wiedervorlage: one('wv') } : {}),
      ertrag: { dosen: many('dose'), graeber: many('grab'), kandidaten: many('kandidat') },
      vektoren: { q: one('q') ? qArr(one('q')) : [3, 5, 3, 3, 4, 3], basis: one('q') ? one('basis') ?? 'bibliothekar' : 'auto', datum: isoToday() },
      verlauf: [{ datum, agent: one('agent') ?? 'bibliothekar', runde: one('runde') ?? '', notiz: one('note') ?? 'Neu ins Register aufgenommen.', status }],
    });
    commit();
    console.log(`Aufgenommen: ${one('id')}`);
    break;
  }
  case 'md': {
    writeFileSync(QUELLEN_MD, renderMarkdown(data));
    console.log(`06-suche/amelie-quellen.md erzeugt (${data.quellen.length} Quellen).`);
    break;
  }
  case 'check': {
    const errs = validate(data, refIds());
    let current = '';
    try { current = readFileSync(QUELLEN_MD, 'utf8'); } catch { /* fehlt */ }
    if (current !== renderMarkdown(data)) errs.push('06-suche/amelie-quellen.md ist nicht aktuell — `npm run quellen -- md` ausführen (nicht von Hand editieren)');
    if (errs.length) die(errs.map((e) => '✗ ' + e).join('\n'));
    console.log(`Quellen-Register ok: ${data.quellen.length} Quellen, Markdown aktuell.`);
    break;
  }
  default:
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'));
}
