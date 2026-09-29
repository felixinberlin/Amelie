import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { repoRoot, readDataIds, readDoseFiles } from './dosenLibHelper';
import { AuditFinding } from './types';

export interface DoseInventoryItem {
  id: string;
  title: string;
  status: string;
  verdict: string;
  domain: string;
  date?: string;
  recipientsDe?: string;
  recipientsEn?: string;
  firstStepDe?: unknown;
  firstStepEn?: unknown;
  reviewScore?: string;
  architectureTier?: string;
  hasMarkdown: boolean;
  hasEnMarkdown: boolean;
}

export interface GraveInventoryItem {
  id: string;
  title: string;
  cause: string;
  killer: string;
  foundBy: string;
  origin: string;
  stage: string;
  diedOn: string;
}

export interface InventoryResult {
  doses: DoseInventoryItem[];
  graves: GraveInventoryItem[];
  demos: { id: string; dir: string; hasReadme: boolean; hasTests: boolean }[];
  books: { doseId: string; title: string; path: string; slug: string }[];
  protocolCount: number;
  candidateCount: number;
  findings: AuditFinding[];
}

export function collectInventory(root?: string): InventoryResult {
  const effectiveRoot = root || repoRoot;
  const findings: AuditFinding[] = [];
  
  // 1. Dosen
  const dosenDataPath = join(effectiveRoot, 'src/data/dosen.ts');
  if (!existsSync(dosenDataPath)) {
    return {
      doses: [],
      graves: [],
      demos: [],
      books: [],
      protocolCount: 0,
      candidateCount: 0,
      findings: [
        {
          id: 'MISSING-DOSEN-DATA',
          severity: 'error',
          category: 'inventory',
          message: `Source file src/data/dosen.ts not found in root ${effectiveRoot}`,
        },
      ],
    };
  }
  const doseSrc = readFileSync(dosenDataPath, 'utf8');

  // We extract full objects from DOSEN_DATA using simple AST/regex or structural scan
  // Since dosen.ts is standard TS, let's parse basic fields for each dose block
  const dosenStart = doseSrc.indexOf('export const DOSEN_DATA');
  const discardedStart = doseSrc.indexOf('export const DISCARDED_DATA');
  const dosenText = doseSrc.slice(dosenStart, discardedStart);

  const doseBlocks = dosenText.split(/{\s*\n\s*id: '/g).slice(1);
  const doseFiles = readDoseFiles(join(effectiveRoot, '05-dosen'));
  const enDoseFiles = existsSync(join(effectiveRoot, 'en/05-dosen'))
    ? readdirSync(join(effectiveRoot, 'en/05-dosen')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : [];

  const doses: DoseInventoryItem[] = [];

  for (const block of doseBlocks) {
    const id = block.slice(0, block.indexOf("'"));
    const titleMatch = block.match(/\n\s*title: '((?:[^'\\]|\\.)*)'/);
    const title = titleMatch ? titleMatch[1].replace(/\\'/g, "'") : id;

    const statusMatch = block.match(/\n\s*status: '([^']*)'/);
    const status = statusMatch ? statusMatch[1] : 'unknown';

    const verdictMatch = block.match(/\n\s*verdict: '([^']*)'/);
    const verdict = verdictMatch ? verdictMatch[1] : 'unknown';

    const domainMatch = block.match(/\n\s*domain: '([^']*)'/);
    const domain = domainMatch ? domainMatch[1] : 'unknown';

    const dateMatch = block.match(/\n\s*date: '([^']*)'/);
    const date = dateMatch ? dateMatch[1] : undefined;

    const recipientsDeMatch = block.match(/\n\s*recipientsDe: '((?:[^'\\]|\\.)*)'/);
    const recipientsDe = recipientsDeMatch ? recipientsDeMatch[1].replace(/\\'/g, "'") : undefined;

    const recipientsEnMatch = block.match(/\n\s*recipientsEn: '((?:[^'\\]|\\.)*)'/);
    const recipientsEn = recipientsEnMatch ? recipientsEnMatch[1].replace(/\\'/g, "'") : undefined;

    const hasFirstStepDe = block.includes('firstStepDe:');
    const hasFirstStepEn = block.includes('firstStepEn:');

    const hasMarkdown = doseFiles.includes(id);
    const hasEnMarkdown = enDoseFiles.includes(id);

    doses.push({
      id,
      title,
      status,
      verdict,
      domain,
      date,
      recipientsDe,
      recipientsEn,
      firstStepDe: hasFirstStepDe ? true : undefined,
      firstStepEn: hasFirstStepEn ? true : undefined,
      hasMarkdown,
      hasEnMarkdown,
    });
  }

  // Dosen Findings
  for (const d of doses) {
    if (!d.recipientsDe && !d.recipientsEn) {
      findings.push({
        id: `DOS-NO-RECIPIENT-${d.id}`,
        severity: 'warning',
        category: 'inventory',
        message: `Dose "${d.id}" has no specified recipient (recipientsDe/En).`,
        relatedId: d.id,
      });
    }
    if (!d.firstStepDe) {
      findings.push({
        id: `DOS-NO-FIRSTSTEP-${d.id}`,
        severity: 'warning',
        category: 'inventory',
        message: `Dose "${d.id}" has no first step defined (firstStepDe).`,
        relatedId: d.id,
      });
    }
    if (!d.hasMarkdown) {
      findings.push({
        id: `DOS-NO-MD-${d.id}`,
        severity: 'error',
        category: 'inventory',
        message: `Dose "${d.id}" in DOSEN_DATA is missing corresponding 05-dosen/${d.id}.md file.`,
        file: `05-dosen/${d.id}.md`,
        relatedId: d.id,
      });
    }
  }

  // 2. Gräber (DISCARDED_DATA)
  const graeberPath = join(dirname(dosenDataPath), 'graeber.json');
  const rawGraves: Record<string, string>[] = existsSync(graeberPath)
    ? JSON.parse(readFileSync(graeberPath, 'utf8'))
    : [];
  const graves: GraveInventoryItem[] = [];

  for (const g of rawGraves) {
    const id = g.id;
    const title = g.title ?? id;
    const cause = g.cause ?? 'unknown';
    const killer = g.killer ?? 'unknown';
    const foundBy = g.foundBy ?? 'unknown';
    const origin = g.origin ?? 'unknown';
    const stage = g.stage ?? 'unknown';
    const diedOn = g.diedOn ?? 'unknown';

    graves.push({ id, title, cause, killer, foundBy, origin, stage, diedOn });

    if (cause === 'unknown' || killer === 'unknown' || stage === 'unknown') {
      findings.push({
        id: `GRAVE-INCOMPLETE-${id}`,
        severity: 'warning',
        category: 'inventory',
        message: `Grave "${id}" has incomplete death certificate metadata.`,
        relatedId: id,
      });
    }
  }

  // Duplicate Grave / Dose ID check
  const allIds = new Set<string>();
  for (const d of doses) {
    if (allIds.has(d.id)) {
      findings.push({
        id: `DUPLICATE-ID-DOSE-${d.id}`,
        severity: 'error',
        category: 'inventory',
        message: `Duplicate Dose ID found: ${d.id}`,
        relatedId: d.id,
      });
    }
    allIds.add(d.id);
  }
  const graveIds = new Set<string>();
  for (const g of graves) {
    if (graveIds.has(g.id)) {
      findings.push({
        id: `DUPLICATE-ID-GRAVE-${g.id}`,
        severity: 'error',
        category: 'inventory',
        message: `Duplicate Grave ID found in DISCARDED_DATA: ${g.id}`,
        relatedId: g.id,
      });
    }
    graveIds.add(g.id);
    if (allIds.has(g.id)) {
      findings.push({
        id: `ID-IN-BOTH-DOSEN-AND-GRAVES-${g.id}`,
        severity: 'error',
        category: 'inventory',
        message: `ID "${g.id}" exists in both DOSEN_DATA and DISCARDED_DATA.`,
        relatedId: g.id,
      });
    }
  }

  // 3. Demos in 07-demos/
  const demosDir = join(effectiveRoot, '07-demos');
  const demos: { id: string; dir: string; hasReadme: boolean; hasTests: boolean }[] = [];
  if (existsSync(demosDir)) {
    const entries = readdirSync(demosDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const id = entry.name;
        const subFiles = readdirSync(join(demosDir, id));
        const hasReadme = subFiles.some((f) => f.toLowerCase().startsWith('readme'));
        // check engine or demo tests
        const engineTestDir = join(effectiveRoot, `src/engine/${id}`);
        const hasEngineTests = existsSync(engineTestDir) && readdirSync(engineTestDir).some((f) => f.includes('.test.'));
        const hasDemoTests = subFiles.some((f) => f.includes('.test.'));
        demos.push({ id, dir: `07-demos/${id}`, hasReadme, hasTests: hasEngineTests || hasDemoTests });

        if (!hasReadme) {
          findings.push({
            id: `DEMO-NO-README-${id}`,
            severity: 'warning',
            category: 'demo',
            message: `Demo 07-demos/${id} is missing a README file.`,
            file: `07-demos/${id}`,
            relatedId: id,
          });
        }
      }
    }
  }

  // 4. Books (doseBooks.ts)
  const booksPath = join(effectiveRoot, 'src/data/doseBooks.ts');
  const books: { doseId: string; title: string; path: string; slug: string }[] = [];
  if (existsSync(booksPath)) {
    const booksSrc = readFileSync(booksPath, 'utf8');
    const bloecke = [...booksSrc.matchAll(/^ {2}'?([a-z0-9-]+)'?:\s*\[([\s\S]*?)^ {2}\],/gm)];
    for (const [, doseId, block] of bloecke) {
      const pfade = [...block.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
      const slugs = [...block.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
      const titles = [...block.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);
      for (let i = 0; i < pfade.length; i++) {
        books.push({
          doseId,
          title: titles[i] || slugs[i] || 'Untitled',
          path: pfade[i],
          slug: slugs[i],
        });
      }
    }
  }

  // 5. Search protocol & candidates count
  let protocolCount = 0;
  const protokollPath = join(effectiveRoot, '06-suche/amelie-pruefprotokoll.md');
  if (existsSync(protokollPath)) {
    const protText = readFileSync(protokollPath, 'utf8');
    // count table rows with verdicts
    const tableRows = protText.match(/\|\s*\*\*`?(frei|verengt|unklar|besetzt)`?\*\*\s*\|/g);
    protocolCount = tableRows ? tableRows.length : 0;
  }

  let candidateCount = 0;
  const unpackedPath = join(effectiveRoot, 'src/data/unpacked.ts');
  if (existsSync(unpackedPath)) {
    const unpText = readFileSync(unpackedPath, 'utf8');
    const matches = unpText.match(/\n\s*id: '/g);
    candidateCount = matches ? matches.length : 0;
  }

  return {
    doses,
    graves,
    demos,
    books,
    protocolCount,
    candidateCount,
    findings,
  };
}
