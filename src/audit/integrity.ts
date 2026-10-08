import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './dosenLibHelper';
import { AuditFinding } from './types';
import { InventoryResult } from './inventory';

export function checkIntegrity(inventory: InventoryResult, root: string = repoRoot): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const doseIds = new Set(inventory.doses.map((d) => d.id));
  const graveIds = new Set(inventory.graves.map((g) => g.id));

  // 1. Check book path resolution & Dose reference
  for (const book of inventory.books) {
    if (!doseIds.has(book.doseId) && !graveIds.has(book.doseId)) {
      findings.push({
        id: `BOOK-UNKNOWN-DOSE-${book.doseId}`,
        severity: 'error',
        category: 'integrity',
        message: `Book references unknown Dose/Grave ID "${book.doseId}".`,
        file: 'src/data/doseBooks.ts',
        relatedId: book.doseId,
      });
    }
    const fullPath = join(root, book.path);
    if (!existsSync(fullPath)) {
      findings.push({
        id: `BOOK-BROKEN-FILE-${book.doseId}-${book.slug}`,
        severity: 'error',
        category: 'integrity',
        message: `Book chapter file for "${book.doseId}" does not exist: ${book.path}`,
        file: book.path,
        relatedId: book.doseId,
      });
    }
  }

  // 2. Check Demo references to Dosen
  for (const demo of inventory.demos) {
    const isDirectMatch = doseIds.has(demo.id) || graveIds.has(demo.id);
    const isPrefixedMatch = Array.from(doseIds).some(d => d.replace(/^dose-/, '') === demo.id || demo.id.replace(/^dose-/, '') === d);
    if (!isDirectMatch && !isPrefixedMatch) {
      findings.push({
        id: `DEMO-UNLINKED-${demo.id}`,
        severity: 'warning',
        category: 'demo',
        message: `Demo folder "07-demos/${demo.id}" does not correspond to any active Dose or Grave ID.`,
        file: demo.dir,
        relatedId: demo.id,
      });
    }
  }

  // 3. Check markdown link resolution inside 05-dosen/*.md files
  const dosenDir = join(root, '05-dosen');
  if (existsSync(dosenDir)) {
    const mdFiles = readdirSync(dosenDir).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
    for (const file of mdFiles) {
      const doseId = file.replace(/\.md$/, '');
      const content = readFileSync(join(dosenDir, file), 'utf8');

      // extract markdown relative links: [label](./path) or [label](path.md)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match: RegExpExecArray | null;
      while ((match = linkRegex.exec(content)) !== null) {
        const target = match[2].trim();
        // ignore web urls, anchors, or root-relative public assets (/file.jpg)
        if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('/')) {
          continue;
        }
        const cleanPath = target.split('#')[0];
        if (!cleanPath) continue;
        const resolvedPath = join(dosenDir, cleanPath);
        if (!existsSync(resolvedPath)) {
          findings.push({
            id: `MD-BROKEN-LINK-${doseId}-${cleanPath}`,
            severity: 'error',
            category: 'integrity',
            message: `Markdown file 05-dosen/${file} contains broken link to "${target}".`,
            file: `05-dosen/${file}`,
            relatedId: doseId,
          });
        }
      }
    }
  }

  return findings;
}
