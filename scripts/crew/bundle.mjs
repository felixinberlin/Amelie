// Datei-Pakete der Crew: Packer, Demo-Bauer und Venture-Analyst liefern keine Datei-Schreibzugriffe, sondern ein
// PAKET (neue Dateien + wenige, benannte Einfügungen in bestehende Dateien). Das Programm prüft es streng und
// schreibt es nur mit --write. Stärker als ein Claude-Code-Subagent in drei Punkten:
//
//   1. Rollenvertrag: jede Rolle darf nur ganz bestimmte Pfade und Einfügestellen (siehe ROLES), nie überschreiben.
//   2. Vorabprüfung im Lauf: `bundle_check` (Form, Pfade, TypeScript-Syntax) und `bundle_test` (Engine-Tests in einem
//      Wegwerf-Worktree, ohne das Repo anzufassen), damit der Agent Fehler selbst behebt, bevor er abgibt.
//   3. Schreiben mit Schranke: nach dem Schreiben laufen die Prüfbefehle der Rolle (export:data, lint, test …). Schlägt
//      einer fehl, stellt das Programm den Zustand von vorher wieder her (Datei-Snapshot + git-Vergleich).

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const MAX_FILE = 400_000;
const MAX_FILES = 40;
const SLUG = /^[a-z0-9][a-z0-9-]{1,79}$/;
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

// ---------------------------------------------------------------- Rollen

/**
 * Pro Agent: erlaubte neue Dateien (Muster mit <id>), erlaubte Einfügungen, Pflichtbestandteile, Schranke.
 * insert.mode: ts-array (Objekt vor das schließende `];` der Konstante), ts-record (Schlüssel: [..] vor das
 * schließende `};`), json-key (Schlüssel im JSON-Objekt), json-array (Eintrag am Ende der JSON-Liste), append (Zeile).
 */
export const ROLES = {
  'dose-packer': {
    files: [(id) => `05-dosen/${id}.md`, (id) => `en/05-dosen/${id}.md`],
    inserts: [
      { target: 'src/data/dosen.ts', mode: 'ts-array', marker: 'DOSEN_DATA' },
      { target: 'src/data/doseVectors.json', mode: 'json-key' },
    ],
    required: { files: 2, inserts: ['src/data/dosen.ts', 'src/data/doseVectors.json'], protokoll: true },
    gates: [['npm', 'run', 'export:data'], ['npm', 'run', 'lint']],
    check: (b) => {
      const e = [];
      for (const f of b.files) {
        if (!f.content.includes(`#dose=${b.id}`)) e.push(`${f.path}: Deep-Link „https://felixinberlin.github.io/Amelie/#dose=${b.id}“ fehlt`);
        if (!/Diese Idee gehört niemandem|This idea belongs to no one/i.test(f.content)) e.push(`${f.path}: CC0-Zusage fehlt („Diese Idee gehört niemandem …“ / „This idea belongs to no one …“)`);
        if (!/^---\nstatus:\s*\S+/.test(f.content)) e.push(`${f.path}: Frontmatter mit status fehlt`);
      }
      return e;
    },
  },
  'demo-builder': {
    files: [(id) => new RegExp(`^07-demos/${id}/[A-Za-z0-9_./-]+$`), (id) => new RegExp(`^src/engine/${id}/[A-Za-z0-9_./-]+\\.(ts|json|md)$`)],
    inserts: [
      { target: 'src/data/doseBooks.ts', mode: 'ts-record', marker: 'DOSE_BOOKS' },
      { target: '07-demos/README.md', mode: 'append' },
    ],
    required: { prefixes: (id) => [`07-demos/${id}/README.md`], tests: true, inserts: ['src/data/doseBooks.ts'] },
    gates: [['npm', 'run', 'lint'], ['npm', 'test']],
    check: (b) => {
      const e = [];
      for (const f of b.files) if (!/CC0/.test(f.content)) e.push(`${f.path}: CC0-Zeile fehlt (jede Datei trägt sie)`);
      if (!b.files.some((f) => /^07-demos\/[^/]+\/ticket-01[^/]*\.md$/.test(f.path))) e.push('07-demos/<id>/ticket-01*.md fehlt');
      if (!b.files.some((f) => /^src\/engine\/[^/]+\/[^/]+\.ts$/.test(f.path) && !/\.test\.ts$/.test(f.path))) e.push('Engine-Datei src/engine/<id>/*.ts fehlt');
      for (const f of b.files) if (/(sicher|grün|green)\s*[:=]\s*true/.test(f.content)) e.push(`${f.path}: hartkodiertes „sicher/grün“ ist verboten`);
      return e;
    },
  },
  'venture-analyst': {
    files: [(id) => `ventures/opportunities/${id}.md`],
    inserts: [{ target: 'ventures/market-leads.json', mode: 'json-array' }],
    required: { files: 1, inserts: ['ventures/market-leads.json'] },
    gates: [['npm', 'run', 'export:market']],
    branch: /^feat\/venture-/,
    check: (b) => {
      const e = [];
      for (const f of b.files) {
        if (!/Defensib|Verteidig/i.test(f.content)) e.push(`${f.path}: Vektor Defensibility fehlt`);
        if (!/WTP|Zahlungsbereitschaft/i.test(f.content)) e.push(`${f.path}: Vektor Pain & WTP fehlt`);
        if (!/(€|\$|EUR)\s*\d|\d\s*(€|\$|EUR)/.test(f.content)) e.push(`${f.path}: Preisangabe fehlt`);
      }
      return e;
    },
  },
};

export const BUNDLE_SHAPES = {
  'dose-packer': `\`\`\`json
{
  "id": "kurzname-der-dose",
  "files": [
    { "path": "05-dosen/<id>.md", "content": "… vollständiges deutsches Dossier mit Frontmatter, Deep-Link und CC0-Zusage …" },
    { "path": "en/05-dosen/<id>.md", "content": "… englisches Dossier …" }
  ],
  "inserts": [
    { "target": "src/data/dosen.ts", "mode": "ts-array", "text": "{ id: '<id>', title: '…', … },   // genau ein DoseItem-Objekt, Form wie die letzten Einträge" },
    { "target": "src/data/doseVectors.json", "mode": "json-key", "key": "<id>", "value": { "v": [4,3,4,3,3,4,4], "fun": 2, "funSource": "…", "funDe": "…", "funEn": "…", "note": "…" } }
  ],
  "protokoll": { "runde": "Abschnitt im Prüfprotokoll", "titel": "…", "id": "<id>", "urteil": "frei | verengt", "beleg": "…", "evidenz": "seite | schnipsel", "method": "review", "pruefenAb": "MM/JJJJ" },
  "notes": ["Was du geprüft hast"], "offen": ["Was Félix entscheiden oder verifizieren muss (z. B. Ansprechperson)"]
}
\`\`\``,
  'demo-builder': `\`\`\`json
{
  "id": "kurzname-der-dose",
  "files": [
    { "path": "07-demos/<id>/README.md", "content": "…" },
    { "path": "07-demos/<id>/ticket-01-<thema>.md", "content": "…" },
    { "path": "src/engine/<id>/<kern>.ts", "content": "…" },
    { "path": "src/engine/<id>/<kern>.test.ts", "content": "…" }
  ],
  "inserts": [
    { "target": "src/data/doseBooks.ts", "mode": "ts-record", "key": "<id>", "text": "'<id>': [ { slug: …, path: …, titleDe: …, titleEn: …, noteDe: …, noteEn: …, date: …, kind: 'md' } ]," },
    { "target": "07-demos/README.md", "mode": "append", "text": "| \`<id>\` | Was gebaut ist … | JJJJ-MM-TT | Was gefälscht ist … |" }
  ],
  "notes": ["Testlauf und Ergebnis von bundle_test"], "offen": ["Was Félix wissen muss"]
}
\`\`\``,
  'venture-analyst': `\`\`\`json
{
  "id": "kurzname-des-produkts",
  "verdict": "lead | kill",
  "vectors": { "wtp": 3, "tts": 4, "channel": 2, "monetization": 3, "defensibility": 4 },
  "begruendung": "Zwei, drei Sätze, schonungslos. Bei kill: warum nicht (Formulare, Gratis-Konkurrenz, kein Zahler).",
  "files": [ { "path": "ventures/opportunities/<id>.md", "content": "Produktdossier: Problem, 5 Vektoren, Zielgruppe, MVP-Scoping, Preis, Kanal, Geldgeber/Pilot" } ],
  "inserts": [ { "target": "ventures/market-leads.json", "mode": "json-array", "value": { "id": "<id>", "name": "…", "category": "b2b-compliance | developer-tools | …", "stage": "idea | ready-to-scaffold | shipped", "pricingModel": "one-time | subscription | …", "targetPrice": "…", "targetAudience": "…", "amelieTwin": "<dose-id>", "mvpEngineReady": false, "lastUpdated": "JJJJ-MM-TT" } } ],
  "notes": [], "offen": []
}
\`\`\`
Bei verdict „kill“: files und inserts leer lassen, nur begruendung. Nichts Kommerzielles in Amélies Verzeichnisse.`,
};

// ---------------------------------------------------------------- Prüfung

const matchesAllowed = (rules, id, path) => rules.some((r) => {
  const x = r(id);
  return typeof x === 'string' ? x === path : x.test(path);
});

/** Schreibt kein Byte: prüft Form, Pfade, Überschreiben, Einfügungen. Liefert Fehlertexte (leer = sauber). */
export function validateBundle(data, { agent, root, requireBranch = false } = {}) {
  const role = ROLES[agent];
  if (!role) return [`Rolle „${agent}“ hat keinen Paketvertrag`];
  const e = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Wurzel: muss ein Objekt sein'];
  const kill = agent === 'venture-analyst' && data.verdict === 'kill';
  if (!isStr(data.id) || !SLUG.test(data.id)) e.push('id: Kurzname in Kleinbuchstaben mit Bindestrichen');
  if (agent === 'venture-analyst') {
    if (!['lead', 'kill'].includes(data.verdict)) e.push('verdict: „lead“ oder „kill“');
    for (const k of ['wtp', 'tts', 'channel', 'monetization', 'defensibility']) if (!Number.isInteger(data.vectors?.[k]) || data.vectors[k] < 1 || data.vectors[k] > 5) e.push(`vectors.${k}: ganze Zahl 1–5`);
    if (!isStr(data.begruendung)) e.push('begruendung: fehlt');
  }
  const files = data.files ?? [];
  const inserts = data.inserts ?? [];
  if (!Array.isArray(files) || !Array.isArray(inserts)) return [...e, 'files und inserts müssen Listen sein'];
  if (kill) {
    if (files.length || inserts.length) e.push('verdict „kill“: files und inserts müssen leer sein');
    return e;
  }
  if (files.length > MAX_FILES) e.push(`files: höchstens ${MAX_FILES} Dateien`);
  const seen = new Set();
  files.forEach((f, i) => {
    const at = `files[${i}]`;
    if (!isStr(f?.path) || !isStr(f?.content)) { e.push(`${at}: path und content (Text) sind Pflicht`); return; }
    if (f.path.includes('..') || f.path.startsWith('/') || f.path.includes('\0')) e.push(`${at}.path: ${f.path} ist kein sicherer Pfad`);
    else if (!matchesAllowed(role.files, data.id, f.path)) e.push(`${at}.path: ${f.path} ist für ${agent} nicht erlaubt (nur ${role.files.map((r) => { const x = r('<id>'); return typeof x === 'string' ? x : String(r(data.id)); }).join(', ')})`);
    if (seen.has(f.path)) e.push(`${at}.path: ${f.path} doppelt`);
    seen.add(f.path);
    if (f.content.length > MAX_FILE) e.push(`${at}: Datei größer als ${MAX_FILE} Zeichen`);
    if (root && existsSync(join(root, f.path))) e.push(`${at}.path: ${f.path} gibt es schon (Pakete überschreiben nie)`);
    if (/\.tsx?$/.test(f.path)) { const d = tsSyntaxErrors(f.content, f.path); if (d.length) e.push(...d.map((x) => `${f.path}: ${x}`)); }
    if (/\.json$/.test(f.path)) { try { JSON.parse(f.content); } catch (x) { e.push(`${f.path}: kein gültiges JSON (${x.message})`); } }
  });
  inserts.forEach((s, i) => {
    const at = `inserts[${i}]`;
    const rule = role.inserts.find((r) => r.target === s?.target);
    if (!rule) { e.push(`${at}.target: ${s?.target} ist für ${agent} nicht erlaubt (nur ${role.inserts.map((r) => r.target).join(', ')})`); return; }
    if (s.mode !== rule.mode) e.push(`${at}.mode: für ${rule.target} „${rule.mode}“ erwartet`);
    if (rule.mode === 'ts-array') {
      if (!isStr(s.text)) { e.push(`${at}.text: ein DoseItem-Objekt als TypeScript-Text`); return; }
      if (!new RegExp(`\\bid:\\s*'${data.id}'`).test(s.text)) e.push(`${at}.text: id: '${data.id}' fehlt`);
      e.push(...tsSyntaxErrors(`const x = [\n${s.text}\n];`, 'dosen.ts').map((x) => `${at}: ${x}`));
      if (root) { const src = readFileSync(join(root, rule.target), 'utf8'); if (new RegExp(`\\bid:\\s*'${data.id}'`).test(src)) e.push(`${at}: ${data.id} steht schon in ${rule.target}`); }
    } else if (rule.mode === 'ts-record') {
      if (!isStr(s.text) || !isStr(s.key)) { e.push(`${at}: key und text sind Pflicht`); return; }
      if (s.key !== data.id) e.push(`${at}.key: muss die id (${data.id}) sein`);
      e.push(...tsSyntaxErrors(`const x = {\n${s.text}\n};`, 'record.ts').map((x) => `${at}: ${x}`));
      if (root) { const src = readFileSync(join(root, rule.target), 'utf8'); if (src.includes(`'${s.key}': [`)) e.push(`${at}: ${s.key} steht schon in ${rule.target}`); }
    } else if (rule.mode === 'json-key') {
      if (!isStr(s.key) || typeof s.value !== 'object' || s.value === null) { e.push(`${at}: key und value (Objekt) sind Pflicht`); return; }
      if (s.key !== data.id) e.push(`${at}.key: muss die id (${data.id}) sein`);
      if (root) { const cur = JSON.parse(readFileSync(join(root, rule.target), 'utf8')); if (s.key in cur) e.push(`${at}: ${s.key} steht schon in ${rule.target}`); }
    } else if (rule.mode === 'json-array') {
      if (typeof s.value !== 'object' || s.value === null || !isStr(s.value.id)) { e.push(`${at}.value: Objekt mit id`); return; }
      if (s.value.id !== data.id) e.push(`${at}.value.id: muss die id (${data.id}) sein`);
      for (const k of ['name', 'category', 'stage', 'pricingModel', 'targetPrice', 'targetAudience', 'lastUpdated']) if (!isStr(s.value[k])) e.push(`${at}.value.${k}: fehlt`);
      if (root && existsSync(join(root, rule.target))) { const cur = JSON.parse(readFileSync(join(root, rule.target), 'utf8')); if (cur.some((x) => x.id === s.value.id)) e.push(`${at}: ${s.value.id} steht schon in ${rule.target}`); }
    } else if (rule.mode === 'append') {
      if (!isStr(s.text) || s.text.includes('\n')) e.push(`${at}.text: genau eine Zeile`);
    }
  });
  // Pflichtbestandteile
  const req = role.required;
  if (req.files && files.length < req.files) e.push(`files: mindestens ${req.files} Datei(en) erwartet`);
  for (const t of req.inserts ?? []) if (!inserts.some((s) => s?.target === t)) e.push(`inserts: Einfügung in ${t} fehlt`);
  for (const p of req.prefixes?.(data.id) ?? []) if (!files.some((f) => f?.path === p)) e.push(`files: ${p} fehlt`);
  if (req.tests && !files.some((f) => /\.test\.ts$/.test(f?.path ?? ''))) e.push('files: mindestens eine *.test.ts fehlt (jede Engine hat Tests)');
  if (req.protokoll) {
    const p = data.protokoll;
    if (!p || !isStr(p.runde) || !isStr(p.titel) || !isStr(p.beleg) || !['frei', 'verengt', 'unklar', 'besetzt'].includes(p.urteil) || !['seite', 'schnipsel'].includes(p.evidenz) || !isStr(p.method) || !/^(\d{2}\/\d{4}|–|-)$/.test(String(p.pruefenAb ?? ''))) e.push('protokoll: runde, titel, urteil, beleg, evidenz, method, pruefenAb (MM/JJJJ) sind Pflicht');
  }
  if (!e.length) e.push(...role.check({ ...data, files }));
  if (requireBranch && role.branch) {
    const b = currentBranch(root);
    if (!role.branch.test(b)) e.push(`Branch „${b}“: ${agent} schreibt nur auf ${role.branch} (Ventures bleiben lokal, nie auf main)`);
  }
  return e;
}

function tsSyntaxErrors(source, name) {
  const r = ts.transpileModule(source, { reportDiagnostics: true, fileName: name.endsWith('.ts') || name.endsWith('.tsx') ? name : `${name}.ts`, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve } });
  return (r.diagnostics ?? []).map((d) => `TypeScript-Syntax: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`);
}

export function currentBranch(root) {
  return spawnSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).stdout.trim();
}

// ---------------------------------------------------------------- Einfügen

const indent = (t) => t.split('\n').map((l) => `  ${l}`).join('\n');

/** Wendet eine Einfügung auf den Dateitext an. Liefert den neuen Text. */
export function insertInto(src, s, rule) {
  if (rule.mode === 'ts-array') {
    const start = src.indexOf(`export const ${rule.marker}`);
    const end = start < 0 ? -1 : src.indexOf('\n];', start);
    if (end < 0) throw new Error(`Einfügestelle „${rule.marker}“ in ${rule.target} nicht gefunden`);
    const before = src.slice(0, end).replace(/\s+$/, '');
    const comma = before.endsWith(',') || before.endsWith('[') ? '' : ',';
    const text = s.text.trim().replace(/,?$/, ',');
    return `${before}${comma}\n${indent(text)}\n${src.slice(end + 1)}`;
  }
  if (rule.mode === 'ts-record') {
    const start = src.indexOf(`export const ${rule.marker}`);
    const end = start < 0 ? -1 : src.indexOf('\n};', start);
    if (end < 0) throw new Error(`Einfügestelle „${rule.marker}“ in ${rule.target} nicht gefunden`);
    const text = s.text.trim().replace(/,?$/, ',');
    return `${src.slice(0, end).replace(/\s+$/, '')}\n${indent(text)}\n${src.slice(end + 1)}`;
  }
  if (rule.mode === 'json-key') {
    const cur = JSON.parse(src);
    cur[s.key] = s.value;
    return `${JSON.stringify(cur, null, 2)}\n`;
  }
  if (rule.mode === 'json-array') {
    const cur = JSON.parse(src);
    cur.push(s.value);
    return `${JSON.stringify(cur, null, 2)}\n`;
  }
  if (rule.mode === 'append') return `${src.replace(/\s+$/, '')}\n${s.text.trim()}\n`;
  throw new Error(`Unbekannter Modus ${rule.mode}`);
}

// ---------------------------------------------------------------- Schreiben mit Schranke

const git = (root, args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' });
const dirty = (root) => new Map(git(root, ['status', '--porcelain', '-uall', '-z']).stdout.split('\0').filter(Boolean).map((l) => [l.slice(3), l.slice(0, 2)]));

/**
 * Schreibt das Paket, führt die Schranke der Rolle aus, stellt bei Fehlern den Zustand von vorher wieder her.
 * opts.gates ersetzt die Schranke (Tests); opts.dryRun prüft und zeigt nur. opts.pre läuft nach dem Schreiben und vor der
 * Schranke (Packer: Prüfprotokoll-Zeile über bib apply); opts.touch nennt Dateien, die pre ändert (werden mitgesichert).
 */
export function applyBundle({ root, agent, data, dryRun = false, gates, log = () => {}, touch = [], pre }) {
  const role = ROLES[agent];
  const errors = validateBundle(data, { agent, root, requireBranch: !dryRun });
  if (errors.length) throw Object.assign(new Error(`Paket abgelehnt:\n- ${errors.join('\n- ')}`), { errors });
  const files = data.files ?? [];
  const inserts = data.inserts ?? [];
  const planned = [...files.map((f) => ({ file: f.path, bytes: Buffer.byteLength(f.content), kind: 'new' })), ...inserts.map((s) => ({ file: s.target, kind: `insert:${s.mode}` }))];
  if (dryRun || (data.verdict === 'kill')) return { planned, gates: [], dryRun: true };

  const before = dirty(root);
  const snapshot = new Map();
  const remember = (rel) => { if (!snapshot.has(rel)) snapshot.set(rel, existsSync(join(root, rel)) ? readFileSync(join(root, rel), 'utf8') : null); };
  const restore = () => {
    for (const [rel, text] of snapshot) { if (text === null) rmSync(join(root, rel), { force: true }); else writeFileSync(join(root, rel), text); }
    for (const [rel, st] of dirty(root)) {
      if (before.has(rel) || snapshot.has(rel)) continue;
      if (st.trim() === '??') rmSync(join(root, rel), { recursive: true, force: true }); else git(root, ['checkout', '--', rel]);
    }
  };
  try {
    for (const f of files) { remember(f.path); const abs = join(root, f.path); mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, f.content.endsWith('\n') ? f.content : `${f.content}\n`); }
    for (const s of inserts) { remember(s.target); const rule = role.inserts.find((r) => r.target === s.target); writeFileSync(join(root, s.target), insertInto(readFileSync(join(root, s.target), 'utf8'), s, rule)); }
    for (const rel of touch) remember(rel);
    if (pre) pre();
    const ran = [];
    for (const cmd of gates ?? role.gates) {
      log(`Schranke: ${cmd.join(' ')}`);
      const r = spawnSync(cmd[0], cmd.slice(1), { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 900_000 });
      ran.push({ cmd: cmd.join(' '), exit: r.status });
      if (r.status !== 0) throw Object.assign(new Error(`Schranke „${cmd.join(' ')}“ fehlgeschlagen (Exit ${r.status}); alles zurückgesetzt.\n${tail(`${r.stdout}\n${r.stderr}`)}`), { gates: ran });
    }
    return { planned, gates: ran, dryRun: false };
  } catch (err) {
    restore();
    throw err;
  }
}

const tail = (s, n = 3500) => (s.length > n ? `[…]\n${s.slice(-n)}` : s);

// ---------------------------------------------------------------- Test im Wegwerf-Worktree (für den Demo-Bauer)

/**
 * Legt das Paket in einen temporären git-Worktree (node_modules per Symlink), führt die Engine-Tests aus und räumt auf.
 * Das echte Repo bleibt unberührt. Liefert { ok, output }.
 */
export function testBundle({ root, data, timeoutMs = 300_000 }) {
  const errs = validateBundle(data, { agent: 'demo-builder', root });
  if (errs.length) return { ok: false, output: `Paket noch nicht gültig:\n- ${errs.join('\n- ')}` };
  const dir = mkdtempSync(join(tmpdir(), 'crew-bundle-'));
  const wt = join(dir, 'wt');
  const add = git(root, ['worktree', 'add', '--detach', wt, 'HEAD']);
  if (add.status !== 0) { rmSync(dir, { recursive: true, force: true }); return { ok: false, output: `git worktree add schlug fehl: ${add.stderr}` }; }
  try {
    symlinkSync(join(root, 'node_modules'), join(wt, 'node_modules'), 'dir');
    for (const f of data.files) { const abs = resolve(wt, f.path); if (!abs.startsWith(resolve(wt) + sep)) continue; mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, f.content); }
    const r = spawnSync('npx', ['vitest', 'run', `src/engine/${data.id}`, '--reporter=dot'], { cwd: wt, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 });
    const tsc = spawnSync('npx', ['tsc', '--noEmit'], { cwd: wt, encoding: 'utf8', timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 });
    const out = `vitest Exit ${r.status}\n${tail(`${r.stdout}\n${r.stderr}`, 2500)}\ntsc Exit ${tsc.status}\n${tail(tsc.stdout + tsc.stderr, 2500)}`;
    return { ok: r.status === 0 && tsc.status === 0, output: out };
  } finally {
    git(root, ['worktree', 'remove', '--force', wt]);
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Ein Aufruf des Werkzeugs bundle_check / bundle_test: Text für das Modell. */
export function bundleToolText({ agent, root, draft, test = false }) {
  if (!draft || typeof draft !== 'object') return 'Fehler: draft fehlt (dein Paket als Objekt, gleiche Form wie dein Abschluss-Block).';
  const errs = validateBundle(draft, { agent, root });
  if (errs.length) return `Paket nicht sauber:\n- ${errs.join('\n- ')}`;
  if (!test) return `Paket sauber: ${draft.files?.length ?? 0} Dateien, ${draft.inserts?.length ?? 0} Einfügungen. Geschrieben wird erst nach Freigabe (--write); danach laufen ${ROLES[agent].gates.map((g) => g.join(' ')).join(' → ')}.`;
  const r = testBundle({ root, data: draft });
  return `${r.ok ? 'Tests grün.' : 'Tests ROT.'}\n${r.output}`;
}
