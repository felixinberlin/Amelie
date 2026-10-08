import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './dosenLibHelper';
import { AuditFinding } from './types';
import { InventoryResult } from './inventory';

export function checkDocumentationDrift(inventory: InventoryResult, root: string = repoRoot): AuditFinding[] {
  const findings: AuditFinding[] = [];

  const filesToScan = [
    'README.md',
    'README.de.md',
    'en/README.md',
    'AGENTS.md',
  ];

  const actualDosen = inventory.doses.length;
  const actualGraves = inventory.graves.length;

  for (const relFile of filesToScan) {
    const fullPath = join(root, relFile);
    if (!existsSync(fullPath)) continue;

    const content = readFileSync(fullPath, 'utf8');

    // Scan for claims like "19 ideas", "19 Dosen", "15 tins", "33 beerdigte Ideen", "33 Gräber"
    // Regex conservative patterns:
    // e.g. "19 ideas", "19 Dosen", "15 tins"
    const patterns = [
      { regex: /(\b\d+)\s+Dosen\b/gi, actual: actualDosen, type: 'Dosen' },
      { regex: /(\b\d+)\s+tins\b/gi, actual: actualDosen, type: 'Dosen' },
      { regex: /(\b\d+)\s+(?:beerdigte\s+Ideen|Gräber)\b/gi, actual: actualGraves, type: 'Gräber' },
      { regex: /(\b\d+)\s+graves\b/gi, actual: actualGraves, type: 'Gräber' },
    ];

    for (const p of patterns) {
      let match: RegExpExecArray | null;
      while ((match = p.regex.exec(content)) !== null) {
        const claimNum = parseInt(match[1], 10);
        // Exclude 0 or numbers matching current state or historical contexts like "In the September 1 round, 19 ideas were checked"
        if (claimNum > 0 && claimNum !== p.actual) {
          // Check line context to avoid flagging explicit round historical statements
          const lineStart = content.lastIndexOf('\n', match.index) + 1;
          const lineEnd = content.indexOf('\n', match.index);
          const line = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);

          if (
            line.toLowerCase().includes('round') ||
            line.toLowerCase().includes('runde') ||
            line.toLowerCase().includes('september 1') ||
            line.toLowerCase().includes('original list') ||
            line.toLowerCase().includes('ursprüngliche liste') ||
            line.toLowerCase().includes('stand:') ||
            line.toLowerCase().includes('as of:')
          ) {
            // Historical statement, ignore
            continue;
          }

          findings.push({
            id: `DRIFT-${relFile}-${p.type}-${claimNum}`,
            severity: 'warning',
            category: 'documentation',
            message: `${relFile} claims ${claimNum} ${p.type}, but deterministic source scanner finds ${p.actual}.`,
            file: relFile,
            details: {
              claim: match[0],
              actual: p.actual,
              type: 'stale_count',
            },
          });
        }
      }
    }
  }

  return findings;
}
