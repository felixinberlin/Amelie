// Reine Regeln der Lab-PR-Prüfung (Protokoll: 06-suche/amelie-lab-protokoll.md §7).
// Kein Netz, kein Schreiben; scripts/lab-review.mjs setzt sie zusammen.

export const PROPOSALS = '06-suche/proposals/';

/** `git diff --name-status` → [{status, path}] (bei Umbenennung der neue Pfad). */
export function parseNameStatus(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((l) => {
      const [status, ...p] = l.split('\t');
      return { status: status[0], path: p[p.length - 1] };
    });
}

/** Umfang: nur neue Dateien unter 06-suche/proposals/. Leere Liste = ok. Muss laufen, bevor Code des PR ausgeführt wird. */
export function checkScope(files) {
  const errs = [];
  if (!files.length) errs.push('Der PR ändert keine Dateien.');
  for (const f of files) {
    if (!f.path.startsWith(PROPOSALS)) errs.push(`Datei außerhalb von ${PROPOSALS}: ${f.path}`);
    else if (f.status !== 'A') errs.push(`Bestehende Datei geändert (${f.status}): ${f.path} (create-only)`);
  }
  return errs;
}

/** PR-Metadaten aus `gh pr view --json number,state,headRefName` prüfen. Leere Liste = ok. */
export function checkPr(pr) {
  const errs = [];
  if (pr.state !== 'OPEN') errs.push(`PR #${pr.number} ist nicht offen (${pr.state}).`);
  if (!String(pr.headRefName ?? '').startsWith('lab/')) errs.push(`Branch ${pr.headRefName} beginnt nicht mit lab/; das ist kein Lab-PR.`);
  return errs;
}

/** Die Zeile `EMPFEHLUNG: merge|nicht mergen` aus dem Agentenbericht. null, wenn sie fehlt. */
export function parseRecommendation(text) {
  const m = String(text ?? '').match(/^\s*EMPFEHLUNG:\s*(merge|nicht mergen)\b/im);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Entscheidung aus den Befunden. merged = PR wurde von diesem Lauf gemergt.
 * Ohne Merge und ohne Fehler bleibt sie null: Empfehlung ja, Entscheidung noch nicht.
 */
export function decide({ blockers, merged }) {
  if (merged) return 'gemergt';
  if (blockers.length) return 'abgelehnt';
  return null;
}

/** Kommentar mit der festen Kopfzeile aus Protokoll §7. */
export function buildComment({ decision, existenzCheck, sources = [], findings = [], agentText = '' }) {
  const head = [
    `Entscheidung: ${decision}`,
    `Existenzprüfung: ${existenzCheck ? 'erfolgt' : 'offen'}`,
    `Gebuchte Quellen: ${sources.length ? sources.join(', ') : 'keine'}`,
  ];
  const body = [];
  if (findings.length) body.push('**Befund (maschinell)**', ...findings.map((f) => `- ${f}`));
  const text = String(agentText ?? '').replace(/^\s*EMPFEHLUNG:.*$/im, '').trim();
  if (text) body.push('', '**Prüfung des Bibliothekars**', text);
  return `${head.join('\n')}\n\n${body.join('\n')}\n`.replace(/\n{3,}/g, '\n\n');
}

/**
 * Bewertet die Prüfschritte. results: [{name, ok, note, tool}], tool = Schritt ausgefallen (Agent, Netz).
 * - blockers: Sachbefunde (Umfang, Manifest, Pläne, lint, test, Empfehlung „nicht mergen“) → Ablehnung
 * - incomplete: ausgefallene Schritte → keine Entscheidung, nie gepostet, nie gemergt
 * - mergeReady: nichts davon, und (ohne Agent) oder Empfehlung „merge“
 */
export function assess({ results, recommendation = null, noAgent = false }) {
  const label = (x) => `${x.name}${x.note ? `: ${x.note}` : ''}`;
  const blockers = results.filter((x) => !x.ok && !x.tool).map(label);
  if (recommendation === 'nicht mergen') blockers.push('Der Bibliothekar empfiehlt, nicht zu mergen.');
  const incomplete = results.filter((x) => !x.ok && x.tool).map(label);
  const mergeReady = blockers.length === 0 && incomplete.length === 0 && (noAgent || recommendation === 'merge');
  return { blockers, incomplete, mergeReady };
}
