import { AmelieHealth } from './types.js';

export function renderHealthMarkdown(health: AmelieHealth): string {
  const lines: string[] = [];

  lines.push('# Amélie Status');
  lines.push('');
  lines.push(`Generated: ${health.generatedAt}`);
  lines.push('');

  lines.push('## System');
  lines.push('');
  lines.push(`* Dosen: ${health.inventory.doses}`);
  lines.push(`* Gräber: ${health.inventory.graves}`);
  lines.push(`* Demos: ${health.inventory.demos}`);
  lines.push(`* Books: ${health.inventory.books}`);
  lines.push(`* Research entries: ${health.inventory.researchEntries}`);
  lines.push(`* Candidate ideas: ${health.inventory.candidateIdeas}`);
  lines.push('');

  lines.push('## Dose distribution');
  lines.push('');
  lines.push('| Status | Count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(health.distributions.doseStatus).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Grave distribution');
  lines.push('');
  lines.push('| Category | Count |');
  lines.push('|---|---:|');
  for (const [k, v] of Object.entries(health.distributions.graveCategory).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Validation');
  lines.push('');
  lines.push('| Check | Status |');
  lines.push('|---|---|');
  for (const check of health.checks) {
    const icon = check.status === 'pass' ? 'PASS' : check.status === 'fail' ? 'FAIL' : 'NOT_AVAILABLE';
    lines.push(`| ${check.name} | ${icon} |`);
  }
  lines.push('');

  lines.push('## Findings');
  lines.push('');
  const errors = health.findings.filter((f) => f.severity === 'error');
  const warnings = health.findings.filter((f) => f.severity === 'warning');
  const infos = health.findings.filter((f) => f.severity === 'info');

  lines.push('### Errors');
  lines.push('');
  if (errors.length === 0) {
    lines.push('None.');
  } else {
    for (const e of errors) {
      lines.push(`* **[${e.id}]** ${e.message}${e.file ? ` (${e.file})` : ''}`);
    }
  }
  lines.push('');

  lines.push('### Warnings');
  lines.push('');
  if (warnings.length === 0) {
    lines.push('None.');
  } else {
    for (const w of warnings) {
      lines.push(`* **[${w.id}]** ${w.message}${w.file ? ` (${w.file})` : ''}`);
    }
  }
  lines.push('');

  lines.push('### Information');
  lines.push('');
  if (infos.length === 0) {
    lines.push('None.');
  } else {
    for (const i of infos) {
      lines.push(`* **[${i.id}]** ${i.message}`);
    }
  }
  lines.push('');

  lines.push('## Generated from');
  lines.push('');
  lines.push(`* Audit version: ${health.auditVersion}`);
  lines.push(`* Commit: ${health.repository.commit || 'unknown'}`);
  lines.push(`* Branch: ${health.repository.branch || 'unknown'}`);
  lines.push('');

  return lines.join('\n');
}
