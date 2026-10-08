#!/usr/bin/env node
/**
 * Zero-Drift Swarm Kit: Graveyard Analytics Generator
 * 
 * Aggregates failure patterns from `graveyard.json` and updates `memory/graveyard/README.md`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const graveyardFile = path.join(rootDir, 'memory', 'graveyard', 'graveyard.json');
const readmeFile = path.join(rootDir, 'memory', 'graveyard', 'README.md');

const entries = JSON.parse(fs.readFileSync(graveyardFile, 'utf-8'));

function countBy(field) {
  const map = {};
  entries.forEach(e => {
    const val = e[field] || 'unknown';
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

const causes = countBy('cause');
const killers = countBy('killer');
const stages = countBy('stage');

const statsMarkdown = `
<!-- MUSTER:START -->
### Failure Statistics (${entries.length} Buried Hypotheses)

#### Why Approaches Died
| Cause | Count | Ratio |
|---|---:|---:|
${causes.map(([c, count]) => `| \`${c}\` | ${count} | ${((count / entries.length) * 100).toFixed(0)}% |`).join('\n')}

#### Who Disproved Them
| Disproved By | Count | Ratio |
|---|---:|---:|
${killers.map(([k, count]) => `| \`${k}\` | ${count} | ${((count / entries.length) * 100).toFixed(0)}% |`).join('\n')}

#### At Which Stage They Died
| Stage | Count | Ratio |
|---|---:|---:|
${stages.map(([s, count]) => `| \`${s}\` | ${count} | ${((count / entries.length) * 100).toFixed(0)}% |`).join('\n')}

#### Recent Autopsies
| ID | Date | Cause | Killer | Stage |
|---|---|---|---|---|
${entries.slice(-5).reverse().map(e => `| **${e.name}** (\`${e.id}\`) | ${e.date} | \`${e.cause}\` | ${e.killer} | \`${e.stage}\` |`).join('\n')}
<!-- MUSTER:END -->
`.trim();

let readme = fs.readFileSync(readmeFile, 'utf-8');
const regex = /<!-- MUSTER:START -->[\s\S]*?<!-- MUSTER:END -->/;
if (regex.test(readme)) {
  readme = readme.replace(regex, statsMarkdown);
} else {
  readme += '\n\n' + statsMarkdown + '\n';
}

fs.writeFileSync(readmeFile, readme, 'utf-8');
console.log(`✅ [GRAVEYARD] Updated graveyard analytics in memory/graveyard/README.md (${entries.length} entries).`);
