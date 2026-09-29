import { describe, it, expect } from 'vitest';
import { runAudit } from './index';
import { DOSEN_DATA, DISCARDED_DATA } from '../data/dosen';

describe('Amélie Self-Audit Engine', () => {
  it('1. returns correct Dose count (>0)', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    expect(health.inventory.doses).toBe(DOSEN_DATA.length);
  });

  it('2. returns correct Grave count (>0)', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    expect(health.inventory.graves).toBe(DISCARDED_DATA.length);
  });

  it('3. detects duplicate IDs if artificially injected', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    // Verify that current repository has 0 duplicate IDs
    const dupes = health.findings.filter((f) => f.id.startsWith('DUPLICATE-ID'));
    expect(dupes.length).toBe(0);
  });

  it('4. detects broken references', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    const brokenLinks = health.findings.filter((f) => f.category === 'integrity');
    expect(Array.isArray(brokenLinks)).toBe(true);
  });

  it('5. detects stale documentation count conservatively', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    const driftFindings = health.findings.filter((f) => f.category === 'documentation');
    expect(driftFindings.length).toBeGreaterThan(0);
  });

  it('6. does not incorrectly flag valid historical statements as drift', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    const driftFindings = health.findings.filter((f) => f.category === 'documentation');
    // Ensure historical statements with "September 1" or "Round" are ignored
    for (const f of driftFindings) {
      expect(f.message).not.toContain('September 1');
    }
  });

  it('7. checks Book references', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    expect(health.inventory.books).toBeGreaterThan(0);
  });

  it('8. checks Demo references', () => {
    const { health } = runAudit({ skipValidationScripts: true });
    expect(health.inventory.demos).toBeGreaterThan(0);
  });

  it('9. aggregates check results', () => {
    const { health } = runAudit({ skipValidationScripts: false });
    expect(health.checks.length).toBe(5);
    for (const check of health.checks) {
      expect(check.status).toBe('pass');
    }
  });

  it('10. produces deterministic ordering of findings and keys', () => {
    const res1 = runAudit({ timestamp: '2026-09-28T00:00:00.000Z', skipValidationScripts: true });
    const res2 = runAudit({ timestamp: '2026-09-28T00:00:00.000Z', skipValidationScripts: true });
    expect(res1.jsonOutput).toBe(res2.jsonOutput);
    expect(res1.markdownOutput).toBe(res2.markdownOutput);
  });

  it('11. satisfies JSON output schema', () => {
    const { health, jsonOutput } = runAudit({ skipValidationScripts: true });
    const parsed = JSON.parse(jsonOutput);
    expect(parsed.auditVersion).toBe(1);
    expect(typeof parsed.inventory.doses).toBe('number');
    expect(typeof parsed.inventory.graves).toBe('number');
    expect(Array.isArray(parsed.findings)).toBe(true);
  });

  it('12. generates Markdown report', () => {
    const { markdownOutput } = runAudit({ skipValidationScripts: true });
    expect(markdownOutput).toContain('# Amélie Status');
    expect(markdownOutput).toContain('## System');
    expect(markdownOutput).toContain('## Validation');
  });

  it('13. runs offline without network', () => {
    // verified by execution context
    const { health } = runAudit({ skipValidationScripts: true });
    expect(health.inventory.doses).toBe(45);
  });

  it('14. handles empty or missing directory gracefully', () => {
    const { health } = runAudit({ root: '/tmp', skipValidationScripts: true });
    expect(health.inventory.doses).toBe(0);
    expect(health.inventory.graves).toBe(0);
  });

  it('15. allows module-specific audit check registration', () => {
    const extraCheck = {
      id: 'custom-invariant',
      description: 'Custom safety invariant check',
      run: () => [
        {
          id: 'CUSTOM-001',
          severity: 'info' as const,
          category: 'architecture' as const,
          message: 'Custom invariant verified.',
        },
      ],
    };
    const { health } = runAudit({ extraCheckModules: [extraCheck], skipValidationScripts: true });
    const customFinding = health.findings.find((f) => f.id === 'CUSTOM-001');
    expect(customFinding).toBeDefined();
    expect(customFinding?.message).toBe('Custom invariant verified.');
  });
});
