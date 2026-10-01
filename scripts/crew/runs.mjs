// Laufdatensätze der Crew: jeder Agentenlauf hinterlässt eine JSON-Datei (für Skripte) und einen Bericht (für Menschen).
//
//   06-suche/agent-runs/<agent>/<run_id>.json   Auftrag, Modell, Vertrag, Daten, Fehler, Verbrauch, Werkzeuge, Schreibvorgänge
//   06-suche/agent-runs/<agent>/<run_id>.md     Bericht des Agenten
//
// Das Verzeichnis steht in .gitignore (wie die Rohläufe des Modellvergleichs). Was ins Gedächtnis gehört, schreibt
// nur der Bibliothekar über `bib apply`; Laufdateien sind Arbeitsmaterial.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

export const RUNS_DIR = '06-suche/agent-runs';

/** run_id: <agent>-<JJJJMMTTThhmmss>-<6 Zeichen>, sortierbar. */
export function newRunId(agent, now = new Date(), rand = Math.random) {
  const ts = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '');
  const tail = Math.floor(rand() * 0xffffff).toString(16).padStart(6, '0');
  return `${agent}-${ts}-${tail}`;
}

export function runsDir(root, dir) {
  return resolve(root, dir ?? process.env.AMELIE_RUNS ?? RUNS_DIR);
}

/** Schreibt Datensatz und Bericht. Liefert die Pfade. */
export function saveRun(root, record, { dir } = {}) {
  const d = join(runsDir(root, dir), record.agent);
  mkdirSync(d, { recursive: true });
  const json = join(d, `${record.run_id}.json`);
  const md = join(d, `${record.run_id}.md`);
  writeFileSync(json, `${JSON.stringify(record, null, 2)}\n`);
  writeFileSync(md, `${record.report ?? ''}\n`);
  return { json, md };
}

/** Alle Läufe (neueste zuerst), optional nur eines Agenten. */
export function listRuns(root, { agent, dir } = {}) {
  const base = runsDir(root, dir);
  if (!existsSync(base)) return [];
  const agents = agent ? [agent] : readdirSync(base).filter((n) => !n.startsWith('.'));
  const out = [];
  for (const a of agents) {
    const d = join(base, a);
    if (!existsSync(d)) continue;
    for (const f of readdirSync(d).filter((n) => n.endsWith('.json'))) {
      try {
        const r = JSON.parse(readFileSync(join(d, f), 'utf8'));
        out.push({ run_id: r.run_id, agent: r.agent, started: r.started, status: r.status, model: r.model?.id, summary: r.summary ?? '', file: join(d, f) });
      } catch { /* kaputte Datei überspringen */ }
    }
  }
  return out.sort((a, b) => String(b.started ?? '').localeCompare(String(a.started ?? '')) || String(b.run_id).localeCompare(String(a.run_id)));
}

/**
 * Lädt einen Lauf: Pfad zu einer .json-Datei, eine run_id, oder „latest:<agent>“.
 * Wirft mit klarer Meldung, wenn nichts passt.
 */
export function loadRun(root, ref, { dir } = {}) {
  const s = String(ref ?? '');
  if (!s) throw new Error('Laufangabe fehlt.');
  if (s.endsWith('.json') && existsSync(resolve(s))) return JSON.parse(readFileSync(resolve(s), 'utf8'));
  if (s.startsWith('latest:')) {
    const agent = s.slice(7);
    const r = listRuns(root, { agent, dir }).find((x) => x.status === 'ok');
    if (!r) throw new Error(`Kein erfolgreicher Lauf von ${agent} gefunden.`);
    return JSON.parse(readFileSync(r.file, 'utf8'));
  }
  const hit = listRuns(root, { dir }).find((r) => r.run_id === s || basename(r.file, '.json') === s);
  if (!hit) throw new Error(`Lauf „${s}“ nicht gefunden (npm run agent -- runs zeigt die vorhandenen).`);
  return JSON.parse(readFileSync(hit.file, 'utf8'));
}
