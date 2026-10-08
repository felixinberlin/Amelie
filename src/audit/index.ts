import { execSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { repoRoot } from './dosenLibHelper';
import { AmelieHealth, AuditCheckModule, AuditFinding } from './types';
import { collectInventory } from './inventory';
import { checkIntegrity } from './integrity';
import { checkDocumentationDrift } from './documentation';
import { runValidationChecks } from './checks';
import { renderHealthJson } from './renderer-json';
import { renderHealthMarkdown } from './renderer-markdown';

export interface AuditRunnerOptions {
  root?: string;
  timestamp?: string;
  skipValidationScripts?: boolean;
  extraCheckModules?: AuditCheckModule[];
}

export function runAudit(options: AuditRunnerOptions = {}): {
  health: AmelieHealth;
  jsonOutput: string;
  markdownOutput: string;
} {
  const root = options.root || process.cwd();
  const generatedAt = options.timestamp || new Date().toISOString();

  let commit: string | undefined;
  let branch: string | undefined;

  try {
    commit = execSync('git rev-parse --short HEAD', { cwd: root, stdio: 'pipe', encoding: 'utf8' }).trim();
    branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, stdio: 'pipe', encoding: 'utf8' }).trim();
  } catch {
    // Git metadata fallback if git command fails or is not in a repo
  }

  // 1. Collect inventory
  const inventory = collectInventory(root);

  // 2. Check referential integrity
  const integrityFindings = checkIntegrity(inventory, root);

  // 3. Check documentation drift
  const driftFindings = checkDocumentationDrift(inventory, root);

  // 4. Run validation checks
  const checks = options.skipValidationScripts ? [] : runValidationChecks(root);

  // 5. Run module-specific registered checks
  const moduleFindings: AuditFinding[] = [];
  if (options.extraCheckModules) {
    for (const mod of options.extraCheckModules) {
      try {
        const res = mod.run({ repoRoot: root });
        moduleFindings.push(...res);
      } catch (err: any) {
        moduleFindings.push({
          id: `MODULE-CHECK-ERR-${mod.id}`,
          severity: 'error',
          category: 'architecture',
          message: `Check module "${mod.id}" threw an error: ${err.message}`,
        });
      }
    }
  }

  // Aggregate findings deterministically
  const allFindings: AuditFinding[] = [
    ...inventory.findings,
    ...integrityFindings,
    ...driftFindings,
    ...moduleFindings,
  ];

  // Also include findings from validation check failures
  for (const c of checks) {
    allFindings.push(...c.findings);
  }

  // Sort findings deterministically by severity (error > warning > info), then ID
  const severityRank = { error: 0, warning: 1, info: 2 };
  allFindings.sort((a, b) => {
    const s = severityRank[a.severity] - severityRank[b.severity];
    if (s !== 0) return s;
    return a.id.localeCompare(b.id);
  });

  // Calculate distributions
  const doseStatus: Record<string, number> = {};
  const doseVerdict: Record<string, number> = {};
  const doseDomain: Record<string, number> = {};
  for (const d of inventory.doses) {
    doseStatus[d.status] = (doseStatus[d.status] || 0) + 1;
    doseVerdict[d.verdict] = (doseVerdict[d.verdict] || 0) + 1;
    doseDomain[d.domain] = (doseDomain[d.domain] || 0) + 1;
  }

  const graveCategory: Record<string, number> = {};
  for (const g of inventory.graves) {
    graveCategory[g.cause] = (graveCategory[g.cause] || 0) + 1;
  }

  const jsonFile = 'public/data/amelie-health.json';
  const mdFile = 'AMELIE_STATUS.md';

  const health: AmelieHealth = {
    auditVersion: 1,
    generatedAt,
    repository: {
      commit,
      branch,
    },
    inventory: {
      doses: inventory.doses.length,
      graves: inventory.graves.length,
      demos: inventory.demos.length,
      researchEntries: inventory.protocolCount,
      candidateIdeas: inventory.candidateCount,
      books: inventory.books.length,
    },
    distributions: {
      doseStatus,
      doseVerdict,
      doseDomain,
      graveCategory,
    },
    checks,
    findings: allFindings,
    generatedFiles: {
      json: jsonFile,
      markdown: mdFile,
    },
  };

  const jsonOutput = renderHealthJson(health);
  const markdownOutput = renderHealthMarkdown(health);

  return { health, jsonOutput, markdownOutput };
}

export function writeAuditArtifacts(options: AuditRunnerOptions = {}) {
  const root = options.root || process.cwd();
  const { jsonOutput, markdownOutput } = runAudit({ ...options, root });

  const jsonPath = join(root, 'public/data/amelie-health.json');
  const mdPath = join(root, 'AMELIE_STATUS.md');

  writeFileSync(jsonPath, jsonOutput, 'utf8');
  writeFileSync(mdPath, markdownOutput, 'utf8');
}
