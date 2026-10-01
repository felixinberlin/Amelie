// Schreibwege der Crew. Das Modell schreibt nie selbst: nach einem geprüften Lauf schreibt dieses Programm, und nur
// auf dem einen Weg, den die Agentendefinition erlaubt (Profil.writes). Ohne Freigabe (--write / --apply) nichts.
//
//   append      neuer Abschnitt am Ende des eigenen Logs (Reviewer, Inversion, Kollider)
//   bib-apply   Schreibplan über `bib apply` (Bibliothekar; alles oder nichts, Ledger, Audit, Akteursrechte)

import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { applyPlan } from '../bib-apply.mjs';
import { stripJson } from './contracts.mjs';
import { applyBundle } from './bundle.mjs';

/** Kopf + Bericht + (optional) Tabelle als Log-Abschnitt. */
export function renderLogSection({ record, title, table }) {
  const day = String(record.started ?? '').slice(0, 10).split('-').reverse().join('.');
  const head = `## ${title ?? `CLI-Lauf ${record.agent}`} (${day})`;
  const meta = `_Lauf \`${record.run_id}\` · Modell ${record.model?.id ?? '?'} · Kommandozeile (npm run agent)${record.inputs?.length ? ` · Eingaben: ${record.inputs.map((x) => `\`${x}\``).join(', ')}` : ''}${record.repaired ? ' · JSON-Block repariert' : ''}_`;
  const body = stripJson(record.report).replace(/^#\s.*\n+/, '').replace(/^(#{1,2})\s/gm, '### ');
  return [head, '', meta, '', ...(table ? [table, ''] : []), body].join('\n').trim();
}

/** Hängt einen Abschnitt an eine erlaubte Datei an. */
export function appendLog({ root, file, text, allowed }) {
  if (!allowed.includes(file)) throw new Error(`Schreiben in ${file} ist für diesen Agenten nicht erlaubt (nur ${allowed.join(', ')}).`);
  const abs = resolve(root, file);
  if (!abs.startsWith(resolve(root) + sep)) throw new Error('Pfad außerhalb des Repos.');
  if (!existsSync(abs)) throw new Error(`${file} gibt es nicht.`);
  const before = readFileSync(abs, 'utf8');
  const sep2 = before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
  appendFileSync(abs, `${sep2}${text.trim()}\n`);
  return { kind: 'append', file, bytes: Buffer.byteLength(text) };
}

/**
 * `bib apply` im selben Prozess (dieselbe Funktion wie `npm run bib -- apply`): Rechte, Sperre, Ledger, Audit,
 * alles oder nichts, abgeleitete Dateien. Liefert { status (Exit-Code von bib), out (Ergebnisobjekt) }.
 */
export function bibApply({ root, planFile, actor, dryRun }) {
  const plan = JSON.parse(readFileSync(planFile, 'utf8'));
  const out = applyPlan(plan, { root, actor, dryRun: !!dryRun, wait: 30 });
  return { status: out.ok ? 0 : out.exit, out };
}

/**
 * Führt die Schreibvorgänge eines Laufs aus. Verweigert, wenn der Lauf nicht „ok“ ist oder schon geschrieben hat.
 * Liefert die Liste der ausgeführten Schreibvorgänge (auch in record.writes).
 */
export async function applyWrites({ root, record, profile, dryRun = false, allowMock = false, now = () => new Date() }) {
  if (!profile.writes) throw new Error(`${record.agent} schreibt laut Definition nichts.`);
  if (record.status !== 'ok') throw new Error(`Lauf ${record.run_id} ist „${record.status}“, nicht „ok“: es wird nichts geschrieben.`);
  if (!dryRun && record.model?.provider === 'mock' && !allowMock) throw new Error('Mock-Läufe schreiben nicht ins Gedächtnis (nur --dry-write).');
  if (!dryRun && record.writes?.some((w) => !w.dryRun)) throw new Error(`Lauf ${record.run_id} hat schon geschrieben (${record.writes.map((w) => w.file ?? w.plan_id).join(', ')}).`);
  const done = [];
  for (const w of profile.writes.build(record, { root })) {
    if (w.kind === 'append') {
      if (dryRun) done.push({ kind: 'append', file: w.file, bytes: Buffer.byteLength(w.text), dryRun: true, preview: w.text.slice(0, 600) });
      else done.push({ ...appendLog({ root, file: w.file, text: w.text, allowed: profile.writes.files }), at: now().toISOString() });
    } else if (w.kind === 'bib-apply') {
      const r = bibApply({ root, planFile: w.planFile, actor: w.actor, dryRun });
      const entry = { kind: 'bib-apply', plan_id: w.plan_id, planFile: w.planFile, actor: w.actor, dryRun, exit: r.status, result: r.out, at: now().toISOString() };
      done.push(entry);
      if (r.status !== 0) {
        record.writes = [...(record.writes ?? []), ...done];
        const errs = (r.out?.errors ?? []).map((e) => `${e.code} ${e.field ?? ''}: ${e.message}`).join('; ') || r.out?.raw || '';
        throw Object.assign(new Error(`bib apply ${dryRun ? '--dry-run ' : ''}abgelehnt (Exit ${r.status}): ${errs}`), { exit: r.status, done });
      }
    } else if (w.kind === 'bundle') {
      let r;
      try { r = applyBundle({ root, agent: record.agent, data: w.data, dryRun, gates: w.gates, touch: w.touch, pre: w.pre, log: (m) => process.stderr.write(`[${record.agent}] ${m}\n`) }); } catch (e) {
        record.writes = [...(record.writes ?? []), ...done];
        throw e;
      }
      for (const p of r.planned) done.push({ kind: 'bundle', file: p.file, bytes: p.bytes, how: p.kind, dryRun, gates: r.gates, at: now().toISOString() });
    } else {
      throw new Error(`Unbekannter Schreibweg „${w.kind}“.`);
    }
  }
  record.writes = [...(record.writes ?? []), ...done];
  return done;
}

export const LOGS = {
  classification: '06-suche/amelie-classification-log.md',
  inversion: '06-suche/amelie-inversions-log.md',
  bisoziation: '06-suche/amelie-bisoziation-log.md',
};

export const fileOf = (root, rel) => join(root, rel);
