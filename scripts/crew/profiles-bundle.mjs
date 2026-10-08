// Profile der Bauer-Rollen: dose-packer, demo-builder, venture-analyst. Sie liefern ein geprüftes Datei-PAKET
// (scripts/crew/bundle.mjs) statt Schreibzugriff. Geschrieben wird nur mit --write, danach läuft die Schranke der Rolle
// (export:data, lint, test …) und bei einem Fehler wird alles zurückgesetzt.
//
// Als Fabrik, damit die Hilfen aus profiles.mjs (Kandidaten und Reviews aus früheren Läufen) ohne Zirkelimport ankommen.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtempSync } from 'node:fs';
import { bibApply } from './write.mjs';
import { runsDir } from './runs.mjs';
import { REL } from '../bib-store.mjs';
import { bundleToolText, validateBundle, testBundle } from './bundle.mjs';

export const PACKER_ACTOR = 'cli-packer';

const CHECK_TOOL = (extra = '') => ({
  name: 'bundle_check',
  description: `Prüft deinen Paket-Entwurf (gleiche Form wie dein Abschluss-Block) ohne zu schreiben: erlaubte Pfade, nichts überschreiben, TypeScript-Syntax, Pflichtbestandteile.${extra} Liefert „sauber“ oder die Fehlerliste. So oft aufrufen, bis er sauber ist.`,
  input_schema: { type: 'object', properties: { draft: { type: 'object', description: 'Dein Paket: id, files, inserts, …' } }, required: ['draft'] },
});

const TEST_TOOL = {
  name: 'bundle_test',
  description: 'Legt deinen Paket-Entwurf in einen Wegwerf-Worktree (das Repo bleibt unberührt) und führt `vitest run src/engine/<id>` und `tsc --noEmit` aus. Liefert die Ausgabe. Rufe das auf, bis alles grün ist; erst dann gib ab. Dauert bis zu einigen Minuten.',
  input_schema: { type: 'object', properties: { draft: { type: 'object' } }, required: ['draft'] },
};

const sample = (id) => ({
  id,
  files: [
    { path: `05-dosen/${id}.md`, content: `---\nstatus: Available\n---\n\n# Mock\n\nDeep-Link: https://felixinberlin.github.io/Amelie/#dose=${id}\n\n---\nDiese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie.\n` },
    { path: `en/05-dosen/${id}.md`, content: `---\nstatus: Available\n---\n\n# Mock\n\nDeep link: https://felixinberlin.github.io/Amelie/#dose=${id}\n\n---\nThis idea belongs to no one. Take it, build it, sell it.\n` },
  ],
  inserts: [
    { target: 'src/data/dosen.ts', mode: 'ts-array', text: `{\n  id: '${id}',\n  title: 'Mock',\n},` },
    { target: 'src/data/doseVectors.json', mode: 'json-key', key: id, value: { v: [3, 3, 3, 3, 3, 3, 3], fun: 2, funSource: 'mock', funDe: 'Mock.', funEn: 'Mock.', note: 'Mock' } },
  ],
  protokoll: { runde: 'Mock-Runde', titel: 'Mock', id, urteil: 'verengt', beleg: 'Mock: https://example.org/a', evidenz: 'schnipsel', method: 'review', pruefenAb: '10/2027' },
  notes: ['Mock-Paket'], offen: [],
});

export function makeBundleProfiles({ candidatesFromInputs, reviewsFromInputs }) {
  const planFileFor = (root, record, plan) => {
    const f = join(runsDir(root), record.agent, `${record.run_id}.plan.json`);
    mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, `${JSON.stringify(plan, null, 2)}\n`);
    return f;
  };
  const protokollPlan = (data, planId) => ({ plan_id: planId, actor: PACKER_ACTOR, agent: 'dose-packer', runde: data.protokoll.runde, ops: [{ op: 'protokoll.add', ...data.protokoll, id: data.protokoll.id ?? data.id }] });

  const idFrom = (inputs, thema, { label, accept }) => {
    if (thema) return thema;
    const ids = (inputs ?? []).flatMap((r) => accept(r)).filter(Boolean);
    const uniq = [...new Set(ids)];
    if (uniq.length === 1) return uniq[0];
    if (!uniq.length) throw new Error(`${label} braucht --thema <id> oder --input <Lauf>.`);
    throw new Error(`${label}: mehrere Kandidaten (${uniq.join(', ')}). Wähle einen mit --thema <id>.`);
  };

  // ------------------------------------------------------------ dose-packer
  const packerTask = ({ task, thema, inputs }) => {
    if (task?.trim()) return task.trim();
    const reviews = reviewsFromInputs(inputs);
    const id = idFrom(inputs, thema, { label: 'dose-packer', accept: (r) => (r?.contract === 'reviews' ? (r.data?.reviews ?? []).filter((x) => x.triage === 'Dose Ready').map((x) => x.id) : []) });
    const rev = reviews.get(id);
    const cand = candidatesFromInputs(inputs).find((c) => c.id === id);
    if (rev && rev.triage !== 'Dose Ready') throw new Error(`${id} hat das Urteil „${rev.triage}“, nicht „Dose Ready“: es wird nicht gepackt.`);
    return `Packe die Dose „${id}“ (Reviewer-Urteil Dose Ready${rev ? `, ${rev.kern}/35` : ''}).

Eingang:
${rev ? `REVIEW: ${JSON.stringify(rev)}` : '(kein Review-Lauf übergeben: lies das Urteil in 06-suche/amelie-classification-log.md)'}
${cand ? `KANDIDAT: ${JSON.stringify(cand)}` : ''}

Arbeitsreihenfolge:
1. run_cli bib find ${id} (Exit 2 mit Treffer in Dosen/Friedhof = Wiedergänger-Alarm: abbrechen und im Bericht melden).
2. load_skill dose-packer; Vorlage 04-werkzeug/amelie-vorlagen.md; die jüngste Dose als Stilvorlage (read_file 05-dosen/strassennamen-pruefer.md) und ihren Eintrag in src/data/dosen.ts (search_repo "id: 'strassennamen-pruefer'", dann read_file mit offset), damit dein DoseItem dieselben Felder hat (Typ in src/types.ts).
3. Empfänger und Förderbrücke: Kontaktpersonen nur aus gelesenen Seiten; was nicht verifiziert ist, steht ausdrücklich als „vor Versand verifizieren“ im Dossier und unter "offen".
4. Baue das Paket: deutsches und englisches Dossier, ein DoseItem für src/data/dosen.ts, den Vektoreintrag für src/data/doseVectors.json (V1–V7 und V8 aus dem Review, Fun begründet) und genau eine Prüfprotokoll-Zeile.
5. Prüfe mit bundle_check, bis „sauber“. Keine Mail, kein Versand.
Liefere Bericht + JSON-Block (Vertrag „Paket“).`;
  };

  const packer = {
    role: 'Packer: verpackt eine Dose-Ready-Idee in Dossiers (DE/EN), Frontend-Eintrag, Vektoren und Protokollzeile; Schranke export:data + lint.',
    contract: 'bundle-dose-packer',
    extraTools: ['bundle_check'],
    toolDefs: { bundle_check: CHECK_TOOL(' Das Gegenstück zu check:dosen läuft erst nach dem Schreiben.') },
    handlers: ({ root }) => ({ bundle_check: (a) => bundleToolText({ agent: 'dose-packer', root, draft: a?.draft }) }),
    buildTask: packerTask,
    postValidate: (data, { root, record }) => {
      const e = validateBundle(data, { agent: 'dose-packer', root });
      if (e.length || record.model?.provider === 'mock' || !data.protokoll) return e;
      const dir = mkdtempSync(join(tmpdir(), 'crew-packer-'));
      const planFile = join(dir, 'plan.json');
      writeFileSync(planFile, JSON.stringify(protokollPlan(data, 'crew-packer-check')));
      const r = bibApply({ root, planFile, actor: PACKER_ACTOR, dryRun: true });
      return r.status === 0 ? [] : (r.out?.errors ?? []).map((x) => `Protokollzeile (bib apply): ${x.code} ${x.field ?? ''}: ${x.message}`);
    },
    summarize: (d) => `Dose ${d.id}: ${d.files.length} Dateien, ${d.inserts.length} Einfügungen, Protokollzeile „${d.protokoll?.urteil}“`,
    writes: {
      describe: `Dossiers (05-dosen/, en/05-dosen/), src/data/dosen.ts, src/data/doseVectors.json, Prüfprotokoll (bib apply als ${PACKER_ACTOR}); danach export:data + lint, bei Fehler alles zurückgesetzt. Nur mit --write`,
      files: [],
      build: (record, { root }) => [{
        kind: 'bundle',
        data: record.data,
        touch: [REL.protokoll, REL.ledger, REL.audit, REL.status],
        pre: () => {
          const planFile = planFileFor(root, record, protokollPlan(record.data, `crew-${record.run_id}`));
          const r = bibApply({ root, planFile, actor: PACKER_ACTOR, dryRun: false });
          if (r.status !== 0) throw new Error(`bib apply (Protokollzeile) abgelehnt, Exit ${r.status}: ${(r.out?.errors ?? []).map((x) => x.message).join('; ')}`);
        },
      }],
    },
    mockReply: () => `## Paket (Mock)\n\nEine Mock-Dose.\n\n\`\`\`json\n${JSON.stringify(sample('mock-dose'), null, 2)}\n\`\`\``,
  };

  // ------------------------------------------------------------ demo-builder
  const demoTask = ({ task, thema, inputs }) => {
    if (task?.trim()) return task.trim();
    const id = idFrom(inputs, thema, { label: 'demo-builder', accept: (r) => (r?.agent === 'dose-packer' && r.status === 'ok' ? [r.data?.id] : []) });
    return `Baue das lauffähige Scaffolding für die gepackte Dose „${id}“.

Arbeitsreihenfolge:
1. read_file 05-dosen/${id}.md (Ticket 01 und „Wo es kippt“ sind dein Auftrag) und, falls vorhanden, die Review-Begründung in 06-suche/amelie-classification-log.md (search_repo ${id}).
2. load_skill demo-builder. Stilvorlage: 07-demos/strassennamen-pruefer/ (README.md, ticket-01-strassenname-pruefer.md, Schema) und src/engine/strassennamen-pruefer/ (Kern + Test); lies sie mit read_file.
3. Paket: 07-demos/${id}/README.md, ticket-01-*.md, Daten/Schema; src/engine/${id}/<kern>.ts und <kern>.test.ts (reiner TypeScript-Kern, keine Fakes, nie ein hartkodiertes „sicher/grün“, Fixtures ehrlich als synthetisch kennzeichnen); Kapitel in src/data/doseBooks.ts (Schlüssel '${id}', Pfade zu README und Ticket); eine Zeile für 07-demos/README.md (englisch, Spalten Tin | What | Built | What is faked).
4. Jede Datei trägt eine CC0-Zeile und den Deep-Link https://felixinberlin.github.io/Amelie/#dose=${id}.
5. Rufe bundle_test auf, bis vitest und tsc grün sind. Erst dann abgeben. Prüfe zusätzlich mit bundle_check.
Liefere Bericht + JSON-Block (Vertrag „Paket“).`;
  };

  const demo = {
    role: 'Demo-Bauer: baut 07-demos/<id>/ und die TypeScript-Engine mit Tests, registriert das Buch; Testlauf im Wegwerf-Worktree, Schranke lint + test.',
    contract: 'bundle-demo-builder',
    extraTools: ['bundle_check', 'bundle_test'],
    toolDefs: { bundle_check: CHECK_TOOL(), bundle_test: TEST_TOOL },
    handlers: ({ root }) => ({
      bundle_check: (a) => bundleToolText({ agent: 'demo-builder', root, draft: a?.draft }),
      bundle_test: (a) => bundleToolText({ agent: 'demo-builder', root, draft: a?.draft, test: true }),
    }),
    buildTask: demoTask,
    postValidate: (data, { root, record }) => {
      const e = validateBundle(data, { agent: 'demo-builder', root });
      if (e.length || record.model?.provider === 'mock') return e;
      const t = testBundle({ root, data });
      return t.ok ? [] : [`Tests im Wegwerf-Worktree rot:\n${t.output}`];
    },
    summarize: (d) => `Scaffolding ${d.id}: ${d.files.length} Dateien (${d.files.filter((f) => /\.test\.ts$/.test(f.path)).length} Testdatei(en)), ${d.inserts.length} Einfügungen`,
    writes: {
      describe: '07-demos/<id>/, src/engine/<id>/, src/data/doseBooks.ts, 07-demos/README.md; danach lint + test, bei Fehler alles zurückgesetzt. Nur mit --write',
      files: [],
      build: (record) => [{ kind: 'bundle', data: record.data }],
    },
    mockReply: () => {
      const id = 'mock-dose';
      const data = {
        id,
        files: [
          { path: `07-demos/${id}/README.md`, content: `# Mock\nCC0. https://felixinberlin.github.io/Amelie/#dose=${id}\n` },
          { path: `07-demos/${id}/ticket-01-mock.md`, content: `# Ticket 01\nCC0. https://felixinberlin.github.io/Amelie/#dose=${id}\n` },
          { path: `src/engine/${id}/kern.ts`, content: `// CC0 — https://felixinberlin.github.io/Amelie/#dose=${id}\nexport const kern = (x: number): number => x + 1;\n` },
          { path: `src/engine/${id}/kern.test.ts`, content: `// CC0\nimport { describe, it, expect } from 'vitest';\nimport { kern } from './kern';\ndescribe('kern', () => { it('zählt', () => { expect(kern(1)).toBe(2); }); });\n` },
        ],
        inserts: [
          { target: 'src/data/doseBooks.ts', mode: 'ts-record', key: id, text: `'${id}': [\n  { slug: 'readme', path: '07-demos/${id}/README.md', titleDe: 'Mock', titleEn: 'Mock', noteDe: 'Mock.', noteEn: 'Mock.', date: '01.10.2026', kind: 'md' },\n],` },
          { target: '07-demos/README.md', mode: 'append', text: `| \`${id}\` | Mock | 2026-10-01 | Alles |` },
        ],
        notes: ['Mock'], offen: [],
      };
      return `## Scaffolding (Mock)\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    },
  };

  // ------------------------------------------------------------ venture-analyst
  const ventureTask = ({ task, thema, inputs }) => {
    if (task?.trim()) return task.trim();
    const id = idFrom(inputs, thema, { label: 'venture-analyst', accept: (r) => (r?.contract === 'reviews' && r.status === 'ok' ? (r.data?.reviews ?? []).filter((x) => x.triage === 'Market Route').map((x) => x.id) : []) });
    const rev = reviewsFromInputs(inputs).get(id);
    return `Prüfe den kommerziellen Zwilling von „${id}“ (Dose, Kandidat oder Grab).
${rev ? `\nREVIEW: ${JSON.stringify(rev)}\n` : ''}
Arbeitsreihenfolge:
1. Doppelprüfung: run_cli bib find ${id}; read_file ventures/market-leads.json (gibt es den Lead schon?), ventures/funding-and-angels.md, Abschnitt E/G von 06-suche/amelie-foerderlandschaft.md.
2. Die 5 Vektoren schonungslos bewerten (Pain & WTP, Time-to-Ship, Channel, Monetization, Defensibility, je 1–5). Frage zuerst: Wer zahlt, und gibt es eine Gratis-Konkurrenz oder ein Formular der Behörde? (Erfahrung: Firmenseiten-Zwillinge sind meist Kills.) Belege holen (web_search, web_fetch), Schnipsel nicht als Seite ausgeben. Mitbewerber, Kunden und Pilotstellen vor Ort mit places_find prüfen (Maps-Seite und Website sind hier zitierfähig; höchstens 8 Aufrufe).
3. Entscheide „lead“ oder „kill“. Bei kill: nur Begründung, kein Dossier.
4. Bei lead: Dossier ventures/opportunities/${id}.md (Problem, 5 Vektoren, Zielgruppe, MVP-Scoping, Preis, Kanal, passender Geldgeber/Pilot) und ein Eintrag für ventures/market-leads.json. Nichts Kommerzielles in Amélies Verzeichnisse.
5. bundle_check bis „sauber“.
Liefere Bericht + JSON-Block (Vertrag „Paket“).`;
  };

  const venture = {
    role: 'Venture-Analyst: bewertet kommerzielle Zwillinge (5 Vektoren), schreibt Dossier und Lead; nur auf feat/venture-*, Schranke export:market.',
    contract: 'bundle-venture-analyst',
    kitOptions: { citePlaces: true, budgets: { places_find: 8 } }, // Mitbewerber und Kunden vor Ort; Orte sind hier zitierfähig (wie Mark im Lab)
    extraTools: ['bundle_check'],
    toolDefs: { bundle_check: CHECK_TOOL() },
    handlers: ({ root }) => ({ bundle_check: (a) => bundleToolText({ agent: 'venture-analyst', root, draft: a?.draft }) }),
    buildTask: ventureTask,
    postValidate: (data, { root }) => validateBundle(data, { agent: 'venture-analyst', root }),
    summarize: (d) => `${d.verdict === 'kill' ? 'Kill' : 'Lead'} ${d.id}: WTP ${d.vectors.wtp} · TTS ${d.vectors.tts} · Kanal ${d.vectors.channel} · Monetarisierung ${d.vectors.monetization} · Verteidigbarkeit ${d.vectors.defensibility}`,
    writes: {
      describe: 'ventures/opportunities/<id>.md und ventures/market-leads.json, NUR auf einem Branch feat/venture-* (nie main, nie pushen); danach export:market. Nur mit --write',
      files: [],
      build: (record) => [{ kind: 'bundle', data: record.data }],
    },
    mockReply: () => {
      const id = 'mock-lead';
      const data = {
        id, verdict: 'lead', vectors: { wtp: 3, tts: 4, channel: 2, monetization: 3, defensibility: 4 }, begruendung: 'Mock-Begründung.',
        files: [{ path: `ventures/opportunities/${id}.md`, content: '# Mock\n\nPain & WTP: 3 — Verteidigbarkeit (Defensibility): 4\n\nPreis: 79 € einmalig\n' }],
        inserts: [{ target: 'ventures/market-leads.json', mode: 'json-array', value: { id, name: 'Mock', category: 'b2b-compliance', stage: 'idea', pricingModel: 'one-time', targetPrice: '79 €', targetAudience: 'Test', amelieTwin: 'mock-dose', mvpEngineReady: false, lastUpdated: '2026-10-01' } }],
        notes: [], offen: [],
      };
      return `## Venture (Mock)\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``;
    },
  };

  return { 'dose-packer': packer, 'demo-builder': demo, 'venture-analyst': venture };
}
