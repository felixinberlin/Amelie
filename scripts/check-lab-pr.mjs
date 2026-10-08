#!/usr/bin/env node
// Prüft Lab-Manifeste (Protokoll: 06-suche/amelie-lab-protokoll.md §3, §7).
//
//   node scripts/check-lab-pr.mjs                       alle 06-suche/proposals/*.manifest.json (Teil von npm run lint)
//   node scripts/check-lab-pr.mjs --pr <base> [--pr-text datei] [--root <verzeichnis>]
//        --root: Manifeste und Diff aus einem anderen Checkout (Worktree eines PR); Schema und Quellenregister bleiben von hier
//        zusätzlich für einen PR: geänderte Dateien gegen <base>...HEAD (nur neu, nur proposals/, deckungsgleich mit
//        files), Pflichtzeile „Existenzprüfung: ja|nein" gegen existence_check und Quellen-Ops gegen das Register.
//
// Schema: 06-suche/lab-manifest.schema.json (Kopie aus Amelie-lab, Vertrag lab-manifest 1.0.0).
// Exit 1 bei Verstößen, Ausgabe je Manifest.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import Ajv2020 from 'ajv/dist/2020.js';
import { matchUrl } from './quellen-lib.mjs';

const SELF = new URL('..', import.meta.url).pathname;
const ROOT = (() => { const i = process.argv.indexOf('--root'); return i >= 0 ? process.argv[i + 1] : SELF; })();
const PROPOSALS = '06-suche/proposals/';
const SCHEMA = '06-suche/lab-manifest.schema.json';

const ajv = new Ajv2020({ allErrors: true, strict: false });
let validateSchema;
function schemaValidator(root) {
  if (!validateSchema) validateSchema = ajv.compile(JSON.parse(readFileSync(join(SELF, SCHEMA), 'utf8')));
  return validateSchema;
}

/**
 * Prüft ein Manifest. ctx: { root, fileName?, register?, diffFiles?, prText? }
 * Liefert eine Liste von Fehlertexten (leer = ok).
 */
export function checkManifest(m, ctx = {}) {
  const root = ctx.root ?? ROOT;
  const errs = [];
  const v = schemaValidator(root);
  if (!v(m)) {
    for (const e of v.errors ?? []) errs.push(`Schema: ${e.instancePath || '/'} ${e.message}`);
    return errs; // ohne gültiges Schema sind die weiteren Regeln nicht sinnvoll
  }
  if (ctx.fileName && ctx.fileName !== `${m.plan_id}.manifest.json`) errs.push(`Dateiname ${ctx.fileName} passt nicht zu plan_id (erwartet ${m.plan_id}.manifest.json)`);
  if (!/^lab-\d{4}-\d{2}-\d{2}-/.test(m.plan_id)) errs.push(`plan_id ${m.plan_id} folgt nicht lab-<YYYY-MM-DD>-<engine>-<run-id>`);
  for (const f of m.files) {
    if (!f.startsWith(PROPOSALS)) errs.push(`Datei außerhalb von ${PROPOSALS}: ${f}`);
    else if (!(ctx.exists ?? ((p) => existsSync(join(root, p))))(f)) errs.push(`Datei aus files fehlt im Repo: ${f}`);
  }
  if (!m.files.includes(`${PROPOSALS}${m.plan_id}.manifest.json`)) errs.push('files nennt das Manifest selbst nicht');
  if (m.touches_memory) errs.push('touches_memory ist true: ein Lab-PR darf das Gedächtnis nicht anfassen');
  if (m.survivors.count === 0 && m.survivors.status !== 'keine') errs.push('survivors.count 0 verlangt status "keine"');
  if (m.survivors.count > 0 && m.survivors.status === 'keine') errs.push('survivors.count > 0 verträgt status "keine" nicht');
  if (!m.existence_check && m.survivors.status === 'geprueft') errs.push('survivors.status "geprueft" ohne existence_check');
  for (const o of m.source_ops) if (o.human_accepted) errs.push(`source_ops ${o.id}: human_accepted darf das Lab nie setzen`);

  if (ctx.prText !== undefined) {
    const line = ctx.prText.match(/Existenzpr(?:ü|ue)fung:\s*(ja|nein)/i);
    if (!line) errs.push('PR-Text: Pflichtzeile „Existenzprüfung: ja|nein" fehlt');
    else if ((line[1].toLowerCase() === 'ja') !== m.existence_check) errs.push(`PR-Text sagt „Existenzprüfung: ${line[1]}", Manifest existence_check=${m.existence_check}`);
  }
  if (ctx.diffFiles) {
    const wrongPath = ctx.diffFiles.filter((d) => !d.path.startsWith(PROPOSALS));
    for (const d of wrongPath) errs.push(`PR ändert Datei außerhalb von ${PROPOSALS}: ${d.path}`);
    for (const d of ctx.diffFiles.filter((x) => x.status !== 'A')) errs.push(`PR ändert bestehende Datei (${d.status}): ${d.path} (create-only)`);
    const inPr = new Set(ctx.diffFiles.map((d) => d.path));
    for (const f of m.files) if (!inPr.has(f)) errs.push(`files nennt ${f}, im PR nicht enthalten`);
    const claimed = ctx.unionFiles ?? m.files; // PR mit mehreren Läufen: jede Datei gehört zu irgendeinem Manifest
    for (const p of inPr) if (!claimed.includes(p)) errs.push(`PR enthält ${p}, nicht in files ${ctx.unionFiles ? 'eines Manifests' : 'des Manifests'}`);
  }
  if (ctx.register) {
    const ids = new Set(ctx.register.quellen.map((q) => q.id));
    for (const o of m.source_ops) {
      if (o.op === 'source.log' && !ids.has(o.id)) errs.push(`source.log auf unbekannte Quelle ${o.id}`);
      if (o.op === 'source.add') {
        if (ids.has(o.id)) errs.push(`source.add: Quelle ${o.id} existiert schon`);
        for (const url of o.urls) {
          let hits = [];
          try { hits = matchUrl(ctx.register, url); } catch { errs.push(`source.add ${o.id}: ungültige URL ${url}`); continue; }
          if (hits.length) errs.push(`source.add ${o.id}: ${hits.map((h) => `${h.kind}-Treffer ${h.id}`).join(', ')} für ${url} — source.log statt source.add`);
        }
      }
    }
  }
  return errs;
}

function gitDiff(root, base) {
  const r = spawnSync('git', ['diff', '--name-status', `${base}...HEAD`], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git diff ${base}...HEAD fehlgeschlagen: ${r.stderr.trim()}`);
  return r.stdout.split('\n').filter(Boolean).map((l) => { const [status, ...p] = l.split('\t'); return { status: status[0], path: p[p.length - 1] }; });
}

function main() {
  const args = process.argv.slice(2);
  const arg = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
  const base = arg('--pr');
  const prTextFile = arg('--pr-text');
  const dir = join(ROOT, PROPOSALS);
  const manifests = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.manifest.json')) : [];
  if (!manifests.length) {
    console.log('Lab-Manifeste ok: keine Manifeste vorhanden.');
    if (!base) return;
  }
  const ctxBase = { root: ROOT };
  if (base) {
    ctxBase.diffFiles = gitDiff(ROOT, base);
    ctxBase.register = JSON.parse(readFileSync(join(SELF, 'src/data/quellen.json'), 'utf8'));
    if (prTextFile) ctxBase.prText = readFileSync(prTextFile, 'utf8');
  }
  let bad = 0;
  const targets = base ? manifests.filter((f) => ctxBase.diffFiles.some((d) => d.path === PROPOSALS + f)) : manifests;
  if (base && !targets.length && ctxBase.diffFiles.length) {
    console.error('✗ Der PR ändert Dateien, enthält aber kein Manifest unter 06-suche/proposals/*.manifest.json');
    process.exit(1);
  }
  if (base) {
    const union = new Set();
    for (const f of targets) { try { for (const x of JSON.parse(readFileSync(join(dir, f), 'utf8')).files ?? []) union.add(x); } catch { /* steht unten im Befund */ } }
    ctxBase.unionFiles = [...union];
  }
  for (const f of targets) {
    let m;
    try { m = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { console.error(`✗ ${f}: kein gültiges JSON (${e.message})`); bad++; continue; }
    const errs = checkManifest(m, { ...ctxBase, fileName: basename(f) });
    if (errs.length) { bad++; console.error(`✗ ${f}`); for (const e of errs) console.error(`    ${e}`); }
  }
  if (bad) process.exit(1);
  console.log(`Lab-Manifeste ok: ${targets.length} geprüft${base ? ' (PR-Modus)' : ''}.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
