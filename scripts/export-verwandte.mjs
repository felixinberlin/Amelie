#!/usr/bin/env node
// Erzeugt die Markdown-Fassungen der beiden Frontend-Datensätze:
//   02-recherche/amelie-verwandte-dossier.md       + en/02-recherche/amelie-relatives-dossier.md
//   06-suche/amelie-ki-credits-und-runway.md       + en/06-suche/amelie-ai-credits-and-runway.md
// Quelle der Wahrheit sind src/data/sisterProjects.ts und src/data/aiCredits.ts.
// Aufruf: npm run export:verwandte [-- --check]   (--check bricht ab, wenn die Dateien veraltet sind)

import { build } from 'esbuild';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { repoRoot } from './dosen-lib.mjs';

const check = process.argv.includes('--check');
const dir = mkdtempSync(join(tmpdir(), 'amelie-verwandte-'));
const entry = join(dir, 'entry.ts');
const out = join(dir, 'bundle.mjs');
writeFileSync(
  entry,
  `export * from ${JSON.stringify(join(repoRoot, 'src/data/sisterProjects.ts'))};
export * from ${JSON.stringify(join(repoRoot, 'src/data/aiCredits.ts'))};
`,
);
await build({ entryPoints: [entry], outfile: out, bundle: true, format: 'esm', platform: 'node', logLevel: 'error' });
const d = await import(pathToFileURL(out).href);
rmSync(dir, { recursive: true, force: true });

const T = {
  de: {
    kind: { kin: 'Nächste Verwandte', ideas: 'Ideen-Verschenker und Ideenbanken', commons: 'Bauplan-Commons', legal: 'Rechts-Werkzeuge', civic: 'Civic-Tech-Nachbarn' },
    status: { active: 'aktiv', rebooted: 'beendet, Neustart 2025', ended: 'beendet', dormant: 'ruhend' },
    fit: { try: 'jetzt versuchen', maybe: 'mit Bedingungen', blocked: 'derzeit verschlossen' },
    verified: 'Seite gelesen',
    snippet: 'nur Schnipsel, prüfen',
  },
  en: {
    kind: { kin: 'Closest kin', ideas: 'Idea gifters and idea banks', commons: 'Blueprint commons', legal: 'Legal tools', civic: 'Civic-tech neighbours' },
    status: { active: 'active', rebooted: 'ended, restarted 2025', ended: 'ended', dormant: 'dormant' },
    fit: { try: 'try now', maybe: 'with conditions', blocked: 'currently closed to you' },
    verified: 'page read',
    snippet: 'snippet only, verify',
  },
};

const pick = (l, de, en) => (l === 'de' ? de : en);

function contactLine(c, l) {
  const target = c.kind === 'email' ? `[${c.value}](mailto:${c.value})` : `<${c.value}>`;
  return `- ${target}: ${pick(l, c.labelDe, c.labelEn)} (${c.verified ? T[l].verified : T[l].snippet})`;
}

function relatives(l) {
  const approach = Object.fromEntries(d.SISTER_APPROACHES.map((a) => [a.id, pick(l, a.de, a.en)]));
  const lines = [];
  lines.push(`# ${pick(l, 'Amélie: Das Verwandten-Dossier', 'Amélie: The Relatives Dossier')}`);
  lines.push('');
  lines.push(
    pick(
      l,
      '*Erzeugt aus `src/data/sisterProjects.ts` mit `npm run export:verwandte`. Nicht von Hand ändern. Stand 01.10.2026. Dieselben Inhalte stehen im Frontend unter Recherche, Reiter „Verwandte“. Kurzfassung: `amelie-verwandte.md`.*',
      '*Generated from `src/data/sisterProjects.ts` with `npm run export:verwandte`. Do not edit by hand. As of 1 Oct 2026. The same content is in the front end under Research, tab "Relatives". Short version: `amelie-relatives.md`.*',
    ),
  );
  lines.push('');
  lines.push(`## ${pick(l, 'Haltung beim Kontakt', 'Stance when in contact')}`);
  lines.push('');
  for (const e of d.SISTER_ETIQUETTE) lines.push(`- ${pick(l, e.de, e.en)}`);
  lines.push('');
  lines.push(`## ${pick(l, 'Fünf Lehren aus der Verwandtschaft', 'Five lessons from the kinship')}`);
  lines.push('');
  d.SISTER_LESSONS.forEach((x, i) => lines.push(`${i + 1}. **${pick(l, x.titleDe, x.titleEn)}.** ${pick(l, x.bodyDe, x.bodyEn)}`));
  for (const g of d.SISTER_GROUPS) {
    lines.push('');
    lines.push(`## ${pick(l, g.de, g.en)}`);
    lines.push('');
    lines.push(`*${pick(l, g.hintDe, g.hintEn)}*`);
    for (const p of d.SISTER_PROJECTS.filter((x) => x.group === g.id)) {
      lines.push('');
      lines.push(`### ${p.name}`);
      lines.push('');
      lines.push(`**${pick(l, 'Status', 'Status')}:** ${T[l].status[p.status]} · **${pick(l, 'Ort', 'Place')}:** ${p.place} · **${pick(l, 'Seit', 'Since')}:** ${p.founded}`);
      lines.push('');
      lines.push(`> ${pick(l, p.taglineDe, p.taglineEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Was sie tun.', 'What they do.')}** ${pick(l, p.whatDe, p.whatEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Modell, Lizenz, Größe.', 'Model, licence, scale.')}** ${pick(l, p.modelDe, p.modelEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Warum Schwester, wo sich Amélie unterscheidet.', 'Why a sister, where Amélie differs.')}** ${pick(l, p.kinshipDe, p.kinshipEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Was Amélie lernt.', 'What Amélie learns.')}** ${pick(l, p.lessonDe, p.lessonEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Haltung beim Kontakt', 'Stance when in contact')}: ${approach[p.approach]}.** ${pick(l, p.approachDe, p.approachEn)}`);
      lines.push('');
      lines.push(`**${pick(l, 'Kontaktwege', 'Contact routes')}**`);
      lines.push('');
      for (const c of p.contacts) lines.push(contactLine(c, l));
      lines.push('');
      lines.push(`*${pick(l, 'Evidenz', 'Evidence')}: ${p.evidence === 'read' ? T[l].verified : pick(l, 'Suchschnipsel', 'search snippet')}, ${pick(l, 'geprüft', 'checked')} ${p.checked}.*`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function credits(l) {
  const lines = [];
  lines.push(`# ${pick(l, 'KI-Credits und Runway', 'AI credits and runway')}`);
  lines.push('');
  lines.push(
    pick(
      l,
      `*Erzeugt aus \`src/data/aiCredits.ts\` mit \`npm run export:verwandte\`. Nicht von Hand ändern. Stand ${d.AI_CREDIT_CHECKED}. Frontend: Recherche, Förderkompass, Reiter „KI-Credits & Runway“.*`,
      `*Generated from \`src/data/aiCredits.ts\` with \`npm run export:verwandte\`. Do not edit by hand. As of ${d.AI_CREDIT_CHECKED}. Front end: Research, funding compass, tab "AI credits & runway".*`,
    ),
  );
  lines.push('');
  lines.push(pick(l, d.AI_CREDIT_SUMMARY.de, d.AI_CREDIT_SUMMARY.en));
  lines.push('');
  lines.push(`## ${pick(l, 'Fünf Wege', 'Five paths')}`);
  for (const p of d.AI_CREDIT_PATHS) {
    lines.push('');
    lines.push(`### ${pick(l, p.titleDe, p.titleEn)}`);
    lines.push('');
    lines.push(`*${pick(l, p.speedDe, p.speedEn)}*`);
    lines.push('');
    lines.push(pick(l, p.bodyDe, p.bodyEn));
  }
  lines.push('');
  lines.push(`## ${pick(l, 'Programme', 'Programmes')}`);
  for (const p of d.AI_CREDIT_PROGRAMS) {
    lines.push('');
    lines.push(`### ${pick(l, p.nameDe, p.nameEn)}`);
    lines.push('');
    lines.push(`**${pick(l, 'Passung', 'Fit')}:** ${T[l].fit[p.fit]} · **${pick(l, 'Anbieter', 'Provider')}:** ${p.provider} · **${pick(l, 'Wert', 'Value')}:** ${pick(l, p.valueDe, p.valueEn)}`);
    lines.push('');
    lines.push(`**${pick(l, 'Wer darf.', 'Who may.')}** ${pick(l, p.whoDe, p.whoEn)}`);
    lines.push('');
    lines.push(`**${pick(l, 'Für Félix.', 'For Félix.')}** ${pick(l, p.nextDe, p.nextEn)}`);
    lines.push('');
    lines.push(`<${p.url}> (${p.evidence === 'read' ? T[l].verified : pick(l, 'Suchschnipsel, prüfen', 'search snippet, verify')}, ${p.checked})`);
  }
  lines.push('');
  lines.push(`## ${pick(l, 'Agenten-Orchestrierung selbst ausprobieren', 'Try agent orchestration yourself')}`);
  lines.push('');
  for (const st of d.AI_STARTER_STEPS) {
    lines.push(`### ${pick(l, st.titleDe, st.titleEn)}`);
    lines.push('');
    lines.push(pick(l, st.bodyDe, st.bodyEn));
    if (st.command) {
      lines.push('');
      lines.push('```');
      lines.push(st.command);
      lines.push('```');
    }
    lines.push('');
  }
  lines.push(`## ${pick(l, 'Hindernisse', 'Blockers')}`);
  lines.push('');
  for (const b of d.AI_CREDIT_BLOCKERS) lines.push(`- **${pick(l, b.titleDe, b.titleEn)}.** ${pick(l, b.bodyDe, b.bodyEn)}`);
  lines.push('');
  lines.push(`## ${pick(l, 'Termine', 'Dates')}`);
  lines.push('');
  for (const x of d.AI_CREDIT_DATES) lines.push(`- ${x.date}: ${pick(l, x.labelDe, x.labelEn)}`);
  lines.push('');
  lines.push(`## ${pick(l, 'Nächste Schritte', 'Next steps')}`);
  lines.push('');
  d.AI_CREDIT_STEPS.forEach((s, i) => lines.push(`${i + 1}. ${pick(l, s.de, s.en)}`));
  lines.push('');
  lines.push(`## ${pick(l, 'Offene Fragen', 'Open questions')}`);
  lines.push('');
  for (const q of d.AI_CREDIT_QUESTIONS) lines.push(`- ${pick(l, q.de, q.en)}`);
  lines.push('');
  return lines.join('\n');
}

const files = [
  ['02-recherche/amelie-verwandte-dossier.md', relatives('de')],
  ['en/02-recherche/amelie-relatives-dossier.md', relatives('en')],
  ['06-suche/amelie-ki-credits-und-runway.md', credits('de')],
  ['en/06-suche/amelie-ai-credits-and-runway.md', credits('en')],
];

let stale = 0;
for (const [rel, content] of files) {
  const abs = join(repoRoot, rel);
  const current = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
  if (current === content) continue;
  if (check) {
    stale++;
    console.error(`veraltet: ${rel} (npm run export:verwandte)`);
  } else {
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
    console.log(`geschrieben: ${rel}`);
  }
}
if (check) {
  if (stale) process.exit(1);
  console.log('Verwandten- und Credits-Dossiers aktuell.');
}
