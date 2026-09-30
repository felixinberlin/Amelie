#!/usr/bin/env node
/**
 * Ventures-Tab (öffentlich): erzeugt public/data/ventures-dashboard.json aus
 * ventures/market-leads.json und den Commercial Vectors der Dossiers unter
 * ventures/opportunities/. Kills, Fristen und Notizen gehören nicht hinein.
 *   node scripts/export-ventures.mjs
 * (Der Name ventures.json gehört dem Förderkompass.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = (...p) => path.join(root, 'ventures', ...p);

/** Fünf Zeilen `| **n. Label** | **x/5** | …` in Reihenfolge -> {w,t,c,m,d} oder null. */
export function parseVectors(md) {
  const nums = [];
  for (const line of md.split('\n')) {
    if (!/^\|\s*\*\*\d\./.test(line)) continue;
    const m = line.split('|')[2]?.match(/(\d)\s*\/\s*5/);
    if (m) nums.push(Number(m[1]));
  }
  if (nums.length !== 5) return null;
  const [w, t, c, m, d] = nums;
  return { w, t, c, m, d };
}

export function buildDashboard() {
  const leads = JSON.parse(fs.readFileSync(V('market-leads.json'), 'utf8')).map((l) => {
    const f = V('opportunities', `${l.id}.md`);
    const vectors = fs.existsSync(f) ? parseVectors(fs.readFileSync(f, 'utf8')) : null;
    return { ...l, vectors };
  });
  return { generatedFrom: 'ventures/', leads };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = buildDashboard();
  fs.mkdirSync(path.join(root, 'public', 'data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'public', 'data', 'ventures-dashboard.json'), JSON.stringify(data, null, 2) + '\n');
  const scored = data.leads.filter((l) => l.vectors).length;
  console.log(`ventures-dashboard.json: ${data.leads.length} Leads (${scored} mit Scores)`);
}
