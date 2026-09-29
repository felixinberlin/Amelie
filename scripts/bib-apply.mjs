// Die Engine hinter `bib apply <plan.json>`: ein typisierter Stapel von Operationen, alles oder nichts.
//
// Ablauf: Plan prüfen → Rechte des Akteurs prüfen → Sperre → Journal-Recovery → Idempotenz (Ledger) →
// Vorbedingungen (expect) → alle Operationen im Speicher durchspielen → (dry-run endet hier) →
// Snapshot + Journal → Speicher und erzeugte Dateien schreiben → nachprüfen → Ledger + Audit → fertig.
// Jeder Fehler nach dem Snapshot rollt alle Dateien zurück, auch erzeugte (README, amelie-quellen.md, public/data).

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { BibError, exitFor, EXIT } from './bib-errors.mjs';
import {
  REL, GENERATED_DIRS, acquireLock, auditAppend, clearJournal, hashFile, ledgerAdd, ledgerHas, loadActors, permit,
  recoverJournal, repoRoot, restore, sha256, snapshot, storeHashes, toJsonText, writeJournal,
} from './bib-store.mjs';
import { OPERATIONS, doseIdsOf, loadState } from './bib-ops.mjs';
import { renderMarkdown, validate as validateQuellen } from './quellen-lib.mjs';

const isoToday = () => new Date().toISOString().slice(0, 10);
const STORE_FILE = { quellen: REL.quellen, graeber: REL.graeber, protokoll: REL.protokoll, doseVectors: REL.doseVectors, candidateVectors: REL.candidateVectors, vectorLog: REL.vectorLog };

const errOf = (e, op) => (e instanceof BibError ? { ...e.toJSON(), ...(op !== undefined ? { op } : {}) } : { code: 'APPLY_FAILED', field: '', message: String(e?.message ?? e), ...(op !== undefined ? { op } : {}) });

/** Lädt eine Plan-Datei ("-" = stdin). */
export function readPlanFile(file) {
  let text;
  try { text = readFileSync(file === '-' ? 0 : file, 'utf8'); } catch (e) {
    throw new BibError({ code: 'PLAN_INVALID', field: 'plan', message: `Plan nicht lesbar: ${e.message}` });
  }
  try { return JSON.parse(text); } catch (e) {
    throw new BibError({ code: 'PLAN_INVALID', field: 'plan', message: `Plan ist kein gültiges JSON: ${e.message}` });
  }
}

function checkStructure(plan, o) {
  const errors = [];
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return [{ code: 'PLAN_INVALID', field: 'plan', message: 'Der Plan muss ein JSON-Objekt sein' }];
  if (!Array.isArray(plan.ops) || plan.ops.length === 0) errors.push({ code: 'PLAN_INVALID', field: 'ops', message: 'ops muss eine nicht leere Liste sein' });
  if (!o.planId) errors.push({ code: 'FIELD_REQUIRED', field: 'plan_id', message: 'plan_id ist Pflicht (Herkunft und Idempotenz-Schlüssel)' });
  if (!o.actor) errors.push({ code: 'FIELD_REQUIRED', field: 'actor', message: 'actor ist Pflicht (Rechte-Prüfung; Plan-Feld oder --actor)' });
  for (const [i, op] of (plan.ops ?? []).entries()) {
    if (!op || typeof op !== 'object') errors.push({ code: 'PLAN_INVALID', field: `ops[${i}]`, message: 'Operation muss ein Objekt sein', op: i });
    else if (!OPERATIONS[op.op]) errors.push({ code: 'OP_UNKNOWN', field: `ops[${i}].op`, message: `Unbekannte Operation „${op.op}“ (bekannt: ${Object.keys(OPERATIONS).join(', ')})`, op: i });
  }
  return errors;
}

function runGenerator(script, args = []) {
  const r = spawnSync('node', [join(repoRoot, script), ...args], { cwd: repoRoot, encoding: 'utf8' });
  if (r.status !== 0) throw new BibError({ code: 'APPLY_FAILED', field: script, message: `${script} ${args.join(' ')} fehlgeschlagen: ${(r.stderr || r.stdout).trim().split('\n').slice(-3).join(' ')}` });
}

/** Dateien, deren Inhalt sich seit dem Snapshot geändert hat (inkl. neu entstandener). */
function changedSince(root, snap) {
  const out = [];
  const rels = new Set(Object.keys(snap.files));
  for (const d of GENERATED_DIRS) for (const f of listRel(root, d)) rels.add(f);
  for (const rel of rels) {
    const before = snap.files[rel];
    const now = hashFile(root, rel);
    const beforeHash = before === undefined || before === null ? 'absent' : sha256(Buffer.from(before, 'base64'));
    if (now !== beforeHash) out.push(rel);
  }
  return out.sort();
}
function listRel(root, dir) {
  const out = [];
  const walk = (d) => {
    if (!existsSync(d)) return;
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      if (statSync(p).isDirectory()) walk(p);
      else out.push(relative(root, p));
    }
  };
  walk(join(root, dir));
  return out;
}

/**
 * Wendet einen Plan an. Rückgabe ist immer ein Ergebnisobjekt (wirft nicht):
 * { ok, exit, plan_id, key, dry_run, already_applied, actor, ops:[{index, op, ok, target?, detail?, error?}], files, errors }
 * Optionen: { root, dryRun, wait, key, planId, actor, agent, runde, generate, exportData, hooks }.
 */
export function applyPlan(plan, opts = {}) {
  const root = opts.root ?? repoRoot;
  const generate = opts.generate ?? root === repoRoot;
  const o = {
    planId: opts.planId ?? plan?.plan_id,
    actor: opts.actor ?? plan?.actor,
  };
  o.agent = opts.agent ?? plan?.agent ?? o.actor;
  o.runde = opts.runde ?? plan?.runde ?? '';
  const key = opts.key ?? plan?.key ?? o.planId;
  const result = { ok: false, exit: EXIT.VALIDATION, plan_id: o.planId ?? null, key: key ?? null, dry_run: !!opts.dryRun, already_applied: false, actor: o.actor ?? null, ops: [], files: [], errors: [] };
  const fail = (errors, exit) => { result.errors.push(...errors); result.exit = exit ?? exitFor(result.errors); result.ok = false; return result; };

  // 1. Form
  const structure = checkStructure(plan, o);
  if (structure.length) return fail(structure);

  // 2. Rechte (vor Sperre und Zustand: eine verbotene Operation darf nichts berühren, auch nicht lesen)
  const actors = loadActors(root);
  const denied = [];
  for (const [i, op] of plan.ops.entries()) {
    const p = permit(actors, o.actor, op.op, { flags: { human_accepted: op.human_accepted === true || plan.human_accepted === true } });
    if (!p.ok) denied.push({ code: 'PERMISSION_DENIED', field: `ops[${i}].op`, message: p.reason, op: i });
  }
  if (denied.length) return fail(denied);

  // 3. Sperre (Dry-run liest nur und braucht sie nicht)
  let release = () => {};
  if (!opts.dryRun) {
    try { release = acquireLock(root, { wait: opts.wait ?? 0, actor: o.actor }); } catch (e) { return fail([errOf(e)]); }
  }
  try {
    // 4. Ein früher abgebrochener Lauf hinterlässt ein Journal: zuerst zurückrollen
    if (!opts.dryRun) {
      const rec = recoverJournal(root);
      if (rec) {
        result.recovered = rec;
        auditAppend(root, { event: 'recovered', ...rec });
      }
    }

    // 5. Idempotenz
    const done = key ? ledgerHas(root, key) : null;
    if (done) {
      result.ok = true;
      result.exit = EXIT.OK;
      result.already_applied = true;
      result.applied = done;
      result.files = done.files ?? [];
      return result;
    }

    // 6. Vorbedingungen auf Dateiebene
    const pre = [];
    const hashSets = [['expect.hashes', plan.expect?.hashes], ...plan.ops.map((op, i) => [`ops[${i}].expect.hashes`, op.expect?.hashes])];
    for (const [field, hashes] of hashSets) {
      for (const [rel, want] of Object.entries(hashes ?? {})) {
        const have = hashFile(root, rel);
        if (have !== want) pre.push({ code: 'PRECONDITION_FAILED', field: `${field}.${rel}`, message: `${rel} hat sich geändert (jetzt ${have.slice(0, 19)}…, erwartet ${String(want).slice(0, 19)}…)` });
      }
    }
    if (pre.length) return fail(pre);

    // 7. Alle Operationen im Speicher durchspielen
    const state = loadState(root);
    const ctx = { planId: o.planId, agent: o.agent, actor: o.actor, runde: o.runde, heute: isoToday(), jetzt: new Date().toISOString(), doseIds: doseIdsOf(root) };
    const errors = [];
    for (const [i, op] of plan.ops.entries()) {
      try {
        const r = OPERATIONS[op.op].run(state, op, ctx);
        result.ops.push({ index: i, op: op.op, ok: true, ...r });
      } catch (e) {
        const er = errOf(e, i);
        er.field = er.field ? `ops[${i}].${er.field}` : `ops[${i}]`;
        errors.push(er);
        result.ops.push({ index: i, op: op.op, ok: false, error: er });
      }
    }
    if (errors.length) return fail(errors);

    const dirtyRels = [...state.dirty].map((k) => STORE_FILE[k]);
    if (opts.dryRun) {
      result.ok = true;
      result.exit = EXIT.OK;
      result.files = [...dirtyRels, ...(state.dirty.has('quellen') ? [REL.quellenMd] : []), ...(generate && state.dirty.has('graeber') ? [REL.friedhofReadme] : [])].sort();
      return result;
    }

    // 8. Schreiben, nachprüfen, Ledger — mit Snapshot und Journal für den Rückweg
    const snap = snapshot(root);
    writeJournal(root, snap, { plan_id: o.planId, actor: o.actor, at: ctx.jetzt });
    try {
      const write = (rel, text) => {
        mkdirSync(dirname(join(root, rel)), { recursive: true });
        writeFileSync(join(root, rel), text);
      };
      for (const k of state.dirty) {
        if (k === 'protokoll') write(STORE_FILE[k], state.protokoll);
        else if (k === 'quellen') {
          state.quellen.stand = ctx.heute;
          write(REL.quellen, toJsonText(state.quellen));
          write(REL.quellenMd, renderMarkdown(state.quellen));
        } else write(STORE_FILE[k], toJsonText(state[k]));
      }
      if (generate) {
        if (state.dirty.has('graeber')) runGenerator('scripts/friedhof-muster.mjs');
        if (opts.exportData !== false && ['quellen', 'graeber', 'doseVectors', 'candidateVectors'].some((k) => state.dirty.has(k))) runGenerator('scripts/export-public-data.mjs');
        // Nachprüfung: dieselben Wächter wie `npm run lint`, soweit der Plan sie berührt
        if (state.dirty.has('quellen')) {
          const errs = validateQuellen(state.quellen, { doseIds: ctx.doseIds, graveIds: new Set(state.graeber.map((g) => g.id)) });
          if (errs.length) throw new BibError({ code: 'APPLY_FAILED', field: 'quellen', message: `Register nach dem Schreiben ungültig: ${errs.slice(0, 3).join('; ')}` });
        }
        if (state.dirty.has('graeber')) runGenerator('scripts/friedhof-muster.mjs', ['--check']);
        if (state.dirty.has('protokoll')) runGenerator('scripts/check-protokoll-coverage.mjs');
      }
      opts.hooks?.afterWrite?.();
      const files = changedSince(root, snap);
      ledgerAdd(root, key ?? o.planId, {
        plan_id: o.planId, actor: o.actor, agent: o.agent, runde: o.runde, at: ctx.jetzt,
        ops: result.ops.map(({ index, op, target }) => ({ index, op, target })), files, hashes: storeHashes(root),
      });
      for (const r of result.ops) auditAppend(root, { event: 'op', plan_id: o.planId, actor: o.actor, agent: o.agent, runde: o.runde, op: r.op, target: r.target, detail: r.detail });
      auditAppend(root, { event: 'apply', plan_id: o.planId, key: key ?? o.planId, actor: o.actor, ops: result.ops.length, files: files.length });
      clearJournal(root);
      result.files = changedSince(root, snap);
      result.ok = true;
      result.exit = EXIT.OK;
      return result;
    } catch (e) {
      restore(root, snap);
      clearJournal(root);
      result.ops = result.ops.map((r) => ({ ...r, rolledBack: true }));
      const er = errOf(e);
      if (er.code !== 'APPLY_FAILED') er.code = 'APPLY_FAILED';
      return fail([er], EXIT.APPLY_FAILED);
    }
  } finally {
    release();
  }
}
