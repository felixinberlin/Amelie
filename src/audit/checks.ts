import { execSync } from 'node:child_process';
import { repoRoot } from './dosenLibHelper';
import { AuditCheckResult, AuditFinding } from './types';

interface ValidationScript {
  id: string;
  name: string;
  command: string;
}

export function runValidationChecks(root: string = repoRoot): AuditCheckResult[] {
  const nodeBin = process.execPath;
  const env = { ...process.env, PATH: `/home/felix/.nvm/versions/node/v26.3.1/bin:${process.env.PATH || ''}` };

  const scripts: ValidationScript[] = [
    { id: 'dosen', name: 'check:dosen', command: `node scripts/check-dosen-drift.mjs` },
    { id: 'books', name: 'check:books', command: `node scripts/check-dose-books.mjs` },
    { id: 'ideaFrontmatter', name: 'check:idea-frontmatter', command: `node scripts/sync-idea-frontmatter.mjs --check` },
    { id: 'protokoll', name: 'check:protokoll', command: `node scripts/check-protokoll-coverage.mjs` },
    { id: 'friedhof', name: 'check:friedhof', command: `node scripts/friedhof-muster.mjs --check` },
  ];

  const results: AuditCheckResult[] = [];

  for (const script of scripts) {
    try {
      execSync(script.command, { cwd: root, env, stdio: 'pipe', encoding: 'utf8' });
      results.push({
        id: script.id,
        name: script.name,
        status: 'pass',
        findings: [],
      });
    } catch (err: any) {
      const stderr = err.stderr || err.stdout || err.message || 'Validation script failed.';
      const findings: AuditFinding[] = [
        {
          id: `CHECK-FAIL-${script.id}`,
          severity: 'error',
          category: 'test',
          message: `Validation check "${script.name}" failed: ${stderr.trim().split('\n')[0]}`,
          details: { fullOutput: stderr },
        },
      ];
      results.push({
        id: script.id,
        name: script.name,
        status: 'fail',
        findings,
      });
    }
  }

  return results;
}
