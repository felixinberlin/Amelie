// Infrastruktur der transaktionalen Schreibwege (`bib apply` und die direkten Schreibbefehle):
// Pfade, Hashes, Schreibsperre, Journal (Crash-Recovery), Ledger (Idempotenz), Audit-Log, Akteurs-Rechte.
//
// Alles ist bewusst synchron und ohne Abhängigkeiten. `root` ist überall der Repo-Wurzelpfad, damit Tests
// gegen ein temporäres Mini-Repo laufen können.

import { createHash, randomBytes } from 'node:crypto';
import {
  appendFileSync, closeSync, existsSync, mkdirSync, openSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { repoRoot } from './dosen-lib.mjs';
import { BibError } from './bib-errors.mjs';

export { repoRoot };

/** Speicher und erzeugte Dateien, relativ zur Wurzel. */
export const REL = Object.freeze({
  quellen: 'src/data/quellen.json',
  quellenMd: '06-suche/amelie-quellen.md',
  graeber: 'src/data/graeber.json',
  friedhofReadme: '08-friedhof/README.md',
  protokoll: '06-suche/amelie-pruefprotokoll.md',
  terminologie: '06-suche/terminology-map.md',
  fragen: '06-suche/open-questions.md',
  doseVectors: 'src/data/doseVectors.json',
  candidateVectors: 'src/data/candidateVectors.json',
  vectorLog: 'src/data/vectorChanges.json',
  ledger: '06-suche/bib-ledger.json',
  audit: '06-suche/bib-audit.jsonl',
  actors: '06-suche/bib-actors.json',
  lock: '06-suche/.bib.lock',
  journal: '06-suche/.bib-journal.json',
  status: 'AMELIE_STATUS.md',
});
/** Verzeichnisse mit erzeugten Dateien, die in die Transaktion gehören (`export:data`). */
export const GENERATED_DIRS = ['public/data'];

const abs = (root, rel) => join(root, rel);
export const readText = (root, rel) => (existsSync(abs(root, rel)) ? readFileSync(abs(root, rel), 'utf8') : null);
export const readJson = (root, rel, fallback) => {
  const t = readText(root, rel);
  return t === null ? fallback : JSON.parse(t);
};
export const toJsonText = (v) => JSON.stringify(v, null, 2) + '\n';

// ---------------------------------------------------------------- Hashes

export const sha256 = (buf) => 'sha256:' + createHash('sha256').update(buf).digest('hex');
export const hashFile = (root, rel) => (existsSync(abs(root, rel)) ? sha256(readFileSync(abs(root, rel))) : 'absent');
/** Hashes aller Speicher; Grundlage für `expect.hashes` in Plänen. */
export const storeHashes = (root) => Object.fromEntries(
  ['quellen', 'graeber', 'protokoll', 'terminologie', 'fragen', 'doseVectors', 'candidateVectors', 'vectorLog'].map((k) => [REL[k], hashFile(root, REL[k])]),
);

// ---------------------------------------------------------------- Sperre

const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const pidAlive = (pid) => {
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }
};
const STALE_MS = 15 * 60 * 1000;
const held = new Map(); // Sperrdatei → Freigabe; ein einziger Exit-Handler räumt alle
let exitHooked = false;
const releaseAll = () => { for (const release of [...held.values()]) release(); };

/**
 * Nimmt die Schreibsperre (nur ein Schreiber zugleich, erzwungen durch die Datei `06-suche/.bib.lock`).
 * Ein Kindprozess des Halters (Umgebungsvariable BIB_LOCK_TOKEN) gilt als Halter und bekommt eine leere Freigabe.
 * `wait` = Sekunden, die auf die Sperre gewartet wird. Verwaiste Sperren (Prozess tot oder älter als 15 min) werden geräumt.
 */
export function acquireLock(root, { wait = 0, actor = 'unbekannt' } = {}) {
  const file = abs(root, REL.lock);
  mkdirSync(dirname(file), { recursive: true });
  const token = randomBytes(8).toString('hex');
  const deadline = Date.now() + wait * 1000;
  for (;;) {
    try {
      const fd = openSync(file, 'wx');
      writeFileSync(fd, JSON.stringify({ pid: process.pid, token, actor, at: new Date().toISOString() }));
      closeSync(fd);
      process.env.BIB_LOCK_TOKEN = token;
      const release = () => {
        if (!held.has(file)) return;
        held.delete(file);
        delete process.env.BIB_LOCK_TOKEN;
        try { rmSync(file, { force: true }); } catch { /* schon weg */ }
      };
      held.set(file, release);
      if (!exitHooked) { exitHooked = true; process.on('exit', releaseAll); }
      return release;
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
    }
    let info = {};
    try { info = JSON.parse(readFileSync(file, 'utf8')); } catch { /* halb geschrieben */ }
    if (info.token && info.token === process.env.BIB_LOCK_TOKEN) return () => {};
    const alt = Date.now() - (statSync(file, { throwIfNoEntry: false })?.mtimeMs ?? Date.now());
    if ((info.pid && !pidAlive(info.pid)) || alt > STALE_MS) {
      rmSync(file, { force: true });
      continue;
    }
    if (Date.now() >= deadline) {
      throw new BibError({ code: 'LOCK_TIMEOUT', field: 'lock', message: `Schreibsperre gehalten von ${info.actor ?? '?'} (pid ${info.pid ?? '?'}, seit ${info.at ?? '?'}). Später erneut versuchen oder --wait <Sekunden> nutzen.` });
    }
    sleepSync(200);
  }
}

// ---------------------------------------------------------------- Snapshot und Journal (Crash-Recovery)

function listFiles(root, dir) {
  const out = [];
  const base = abs(root, dir);
  if (!existsSync(base)) return out;
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(root, p));
    }
  };
  walk(base);
  return out;
}

/** Alle Dateien, die eine Transaktion anfassen kann (Speicher, erzeugte Dateien, Ledger, Logs) samt Verzeichnislisten. */
export function snapshot(root, extraRels = []) {
  const rels = new Set([...Object.values(REL).filter((r) => r !== REL.lock && r !== REL.journal && r !== REL.actors), ...extraRels]);
  const dirs = {};
  for (const d of GENERATED_DIRS) {
    dirs[d] = listFiles(root, d);
    for (const f of dirs[d]) rels.add(f);
  }
  const files = {};
  for (const rel of rels) files[rel] = existsSync(abs(root, rel)) ? readFileSync(abs(root, rel)).toString('base64') : null;
  return { files, dirs };
}

/** Stellt einen Snapshot her: alte Inhalte zurück, neu entstandene Dateien weg. */
export function restore(root, snap) {
  for (const [rel, b64] of Object.entries(snap.files)) {
    const p = abs(root, rel);
    if (b64 === null) rmSync(p, { force: true });
    else {
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, Buffer.from(b64, 'base64'));
    }
  }
  for (const [dir, before] of Object.entries(snap.dirs)) {
    const keep = new Set(before);
    for (const rel of listFiles(root, dir)) if (!keep.has(rel)) rmSync(abs(root, rel), { force: true });
  }
}

export const writeJournal = (root, snap, meta) => writeFileSync(abs(root, REL.journal), JSON.stringify({ meta, snap }));
export const clearJournal = (root) => rmSync(abs(root, REL.journal), { force: true });

/** Liegt ein Journal vor, ist eine frühere Transaktion mittendrin gestorben: zurückrollen. Gibt die Meta-Daten zurück oder null. */
export function recoverJournal(root) {
  const t = readText(root, REL.journal);
  if (t === null) return null;
  const { meta, snap } = JSON.parse(t);
  restore(root, snap);
  clearJournal(root);
  return meta ?? {};
}

// ---------------------------------------------------------------- Ledger und Audit

export const readLedger = (root) => readJson(root, REL.ledger, { version: 1, applied: {} });
export const ledgerHas = (root, key) => readLedger(root).applied[key] ?? null;
export function ledgerAdd(root, key, entry) {
  const l = readLedger(root);
  l.applied[key] = entry;
  writeFileSync(abs(root, REL.ledger), toJsonText(l));
}
export function auditAppend(root, entry) {
  mkdirSync(dirname(abs(root, REL.audit)), { recursive: true });
  appendFileSync(abs(root, REL.audit), JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');
}

// ---------------------------------------------------------------- Akteurs-Rechte

export const loadActors = (root) => readJson(root, REL.actors, { default: 'deny', actors: {} });

/**
 * Darf `actor` die Operation `op` (z. B. "grave.add")? Regeln in 06-suche/bib-actors.json:
 *   allow: ["source.log", …] oder ["*"]; conditional: { "protokoll.add": { "requires": "human_accepted" } }
 * `requires` verlangt, dass die Operation (oder der Plan) das Feld mit true trägt.
 */
export function permit(config, actor, op, { flags = {} } = {}) {
  const a = config.actors?.[actor];
  if (!a) return { ok: false, reason: `Akteur „${actor}“ ist in 06-suche/bib-actors.json nicht eingetragen` };
  if (a.allow?.includes('*') || a.allow?.includes(op)) return { ok: true };
  const cond = a.conditional?.[op];
  if (cond) {
    if (flags[cond.requires] === true) return { ok: true };
    return { ok: false, reason: `Akteur „${actor}“ darf ${op} nur mit ${cond.requires}: true` };
  }
  return { ok: false, reason: `Akteur „${actor}“ darf ${op} nicht` };
}
