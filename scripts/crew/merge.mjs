// Konvergenz-Merge ohne Modell: legt die Ergebnisse mehrerer Engine-Läufe zusammen, damit Menschen und Skripte
// sehen, was der Reviewer bekommt. Gleiche id aus mehreren Engines = Doppelfund (stärkeres Signal, kein Freifahrtschein).

import { candidatesFromInputs, reviewsFromInputs } from './profiles.mjs';

const URTEILE = ['frei', 'verengt', 'unklar', 'besetzt'];

export function mergeRuns(runs) {
  const candidates = candidatesFromInputs(runs);
  const reviews = reviewsFromInputs(runs);
  const engines = runs.filter((r) => r?.contract === 'candidates');
  return {
    runs: runs.map((r) => ({ run_id: r.run_id, agent: r.agent, status: r.status, summary: r.summary })),
    counts: Object.fromEntries(URTEILE.map((u) => [u, candidates.filter((c) => c.urteil === u).length])),
    doppelfunde: candidates.filter((c) => c.doppelfund).map((c) => ({ id: c.id, foundBy: c.foundBy })),
    candidates: candidates.map((c) => ({ ...c, review: reviews.get(c.id) ? { kern: reviews.get(c.id).kern, triage: reviews.get(c.id).triage } : null })),
    zumReviewer: candidates.filter((c) => c.urteil !== 'besetzt').map((c) => c.id),
    quellenmeldungen: engines.reduce((a, r) => a + (r.data?.quellenmeldung?.length ?? 0), 0),
    unvollstaendig: runs.filter((r) => r.status !== 'ok').map((r) => r.run_id),
  };
}

export function renderMerge(m) {
  const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');
  return [
    `Läufe: ${m.runs.map((r) => `${r.agent} (${r.status})`).join(', ')}`,
    `Ideen: ${m.candidates.length} · ${URTEILE.map((u) => `${m.counts[u]} ${u}`).join(' / ')} · Doppelfunde: ${m.doppelfunde.length} · Quellenmeldungen: ${m.quellenmeldungen}`,
    ...(m.unvollstaendig.length ? [`Unvollständig (zählen nicht): ${m.unvollstaendig.join(', ')}`] : []),
    '',
    '| Idee | Urteil | Engines | Review | Beleg |',
    '|---|---|---|---|---|',
    ...m.candidates.map((c) => `| ${cell(c.title)} (\`${c.id}\`) | ${c.urteil} | ${c.foundBy.join(' + ')}${c.doppelfund ? ' **Doppelfund**' : ''} | ${c.review ? `${c.review.kern}/35 → ${c.review.triage}` : '–'} | ${cell(c.beleg).slice(0, 140)} |`),
  ].join('\n');
}
