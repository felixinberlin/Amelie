// Bibliothekar der Crew: aus seinem JSON-Block wird ein Schreibplan für `bib apply` (alles oder nichts, Ledger,
// Audit, Akteursrechte des Akteurs cli-bibliothekar in 06-suche/bib-actors.json). Der Agent entscheidet, was ins
// Gedächtnis gehört; dieses Programm baut daraus Operationen, prüft sie per Trockenlauf und wendet sie nur mit
// --write an. Das Playbook (Retro, Atlas) ist Freitext und wird als Abschnitt angehängt.

import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseQuellenmeldung } from '../bibliothek-lib.mjs';
import { loadQuellen, refIds } from '../quellen-lib.mjs';
import { bibApply } from './write.mjs';

export const ACTOR = 'cli-bibliothekar';
export const PLAYBOOK = '06-suche/amelie-suchplaybook.md';

/** Quellenmeldung-Zeilen → source.add / source.log. Neue Gräber desselben Plans zählen als vorhanden. */
export function quellenOps(lines, { root, extraGraves = [] } = {}) {
  if (!lines?.length) return { ops: [], fehler: [] };
  const data = loadQuellen(join(root, 'src/data/quellen.json'));
  const { doseIds, graveIds } = refIds();
  for (const g of extraGraves) graveIds.add(g);
  const { eintraege, fehler } = parseQuellenmeldung(lines.join('\n'), { quellen: data.quellen, katalog: data.katalog, typen: data.typen.map((t) => t.id), doseIds, graveIds });
  const ops = eintraege.map((e) => {
    const common = {
      note: e.note,
      ...(e.status ? { status: e.status } : {}), ...(e.evidenz ? { evidenz: e.evidenz } : {}),
      ...(e.erreichbar ? { erreichbar: e.erreichbar } : {}), ...(e.wie ? { wie: e.wie } : {}),
      ...(e.urls.length ? { urls: e.urls } : {}), ...(e.dose.length ? { dose: e.dose } : {}),
      ...(e.grab.length ? { grab: e.grab } : {}), ...(e.kandidat.length ? { kandidat: e.kandidat } : {}),
    };
    return e.neu
      ? { op: 'source.add', id: e.id, name: e.name, typ: e.typ, kategorie: e.kategorie, enthaelt: e.enthaelt, ...(e.fokus ? { fokus: e.fokus } : {}), ...(e.tags.length ? { tags: e.tags } : {}), ...(e.rollen.length ? { rollen: e.rollen } : {}), ...common }
      : { op: 'source.log', id: e.id, ...common };
  });
  return { ops, fehler: fehler.filter((f) => f !== 'keine „QUELLE …“-Zeile gefunden') };
}

/** Plan aus dem JSON-Block des Bibliothekars. Reihenfolge: Protokoll, Gräber, Quellen (Erträge zeigen auf neue Gräber). */
export function buildPlan(data, { root, planId, agent = 'bibliothekar' } = {}) {
  const ops = [];
  (data.protokoll ?? []).forEach((p, i) => {
    ops.push({ op: 'protokoll.add', runde: data.runde, ...p, ...(i === 0 && data.einleitung ? { neuerAbschnitt: data.einleitung } : {}) });
  });
  for (const g of data.graeber ?? []) ops.push({ op: 'grave.add', grave: g });
  const q = quellenOps(data.quellenmeldung, { root, extraGraves: (data.graeber ?? []).map((g) => g.id) });
  ops.push(...q.ops);
  return { plan: { plan_id: planId, actor: ACTOR, agent, runde: data.runde, ops }, fehler: q.fehler };
}

/** Trockenlauf des Plans über die echte CLI. Liefert Fehlertexte (leer = sauber). */
export function dryRun({ root, plan }) {
  const dir = mkdtempSync(join(tmpdir(), 'crew-plan-'));
  const file = join(dir, `${plan.plan_id ?? 'plan'}.json`);
  writeFileSync(file, JSON.stringify(plan, null, 2));
  const r = bibApply({ root, planFile: file, actor: ACTOR, dryRun: true });
  if (r.status === 0) return { errors: [], out: r.out, file };
  const errors = (r.out?.errors ?? []).map((e) => `bib apply: ${e.code}${e.field ? ` ${e.field}` : ''}: ${e.message}`);
  return { errors: errors.length ? errors : [`bib apply Exit ${r.status}: ${r.out?.raw ?? JSON.stringify(r.out).slice(0, 500)}`], out: r.out, file };
}

/** Retro als Playbook-Abschnitt (Freitext, nur Anhängen). */
export function renderRetro(data, record) {
  const r = data.retro ?? {};
  const day = String(record.started ?? '').slice(0, 10).split('-').reverse().join('.');
  const part = (t, l) => (l?.length ? [`**${t}**`, ...l.map((x) => `- ${x}`), ''] : []);
  const body = [
    ...part('Erledigt', r.erledigt), ...part('Gelernt', r.gelernt), ...part('Fehler', r.fehler),
    ...part('Nächstes Mal', r.naechstesMal), ...part('Atlas (neue Felder)', r.atlas), ...part('Offen (Entscheidung Félix)', data.offen),
  ];
  if (!body.length) return null;
  return [`## Retro ${data.runde} (${day}, Kommandozeile)`, '', `_Lauf \`${record.run_id}\` · Modell ${record.model?.id ?? '?'} · Plan \`crew-${record.run_id}\`_`, '', ...body].join('\n').trim();
}
