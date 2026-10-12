#!/usr/bin/env node
// Read-only acquisition: PDF bytes are temporary; output contains extracted facts,
// hashes and identity checks, never modifies the runtime catalogue or review flags.
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseSdsText, sdsSection } from './chemhazard-sds.mjs';

const manifest = JSON.parse(await readFile('07-demos/chemhazard-stop/data/source-audit-manifest.json', 'utf8'));
const output = process.argv[2];
const permitted = new Set([
  'www.kiehl-group.com', 'app.kiehl-group.com', 'www.buzil.com', 'shop.dr-schnell.com',
  'static.vikingdirekt.at', 'www.otto-office.com', 'media.hornbach.de', 'mellerud.de',
  'sdslibrary.solenis.com', 'sds.diversey.com'
]);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
async function get(url) {
  if (!permitted.has(new URL(url).hostname)) throw new Error('Source host not allowed');
  const res = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'user-agent': 'Amelie ChemHazard source audit' } });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return { bytes: Buffer.from(await res.arrayBuffer()), finalUrl: res.url };
}
const folder = await mkdtemp(path.join(tmpdir(), 'chemhazard-audit-'));
const results = [];
try {
  for (const p of manifest.products) {
    const result = { id: p.id, expectedName: p.name, accessedAt: new Date().toISOString().slice(0,10), attempts: [] };
    for (const url of p.documentUrls) {
      try {
        const { bytes, finalUrl } = await get(url);
        if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Not PDF');
        const file = path.join(folder, p.id + '.pdf');
        await writeFile(file, bytes);
        const parsed = spawnSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', maxBuffer: 32 << 20 });
        if (parsed.status !== 0 || !parsed.stdout.trim()) throw new Error('PDF text unavailable');
        const text = parsed.stdout;
        const facts = parseSdsText(text);
        const section1 = sdsSection(text, 1);
        const section10 = sdsSection(text, 10);
        const lower = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
        result.sourceUrl = url;
        result.finalUrl = finalUrl;
        result.sha256 = hash(bytes);
        result.matchesPreviousHash = p.previousSha256 ? result.sha256 === p.previousSha256 : null;
        result.productNamePresent = lower(section1 || text.slice(0,1500)).includes(lower(p.name));
        // Preserve facts, not copyrighted SDS paragraphs.
        result.facts = { ...facts, incompatibleMaterials: undefined };
        result.incompatibilityKeywords = ['säure', 'laugen', 'oxidationsmittel', 'hypochlorit', 'ammoniak', 'peroxid', 'metall', 'alkalien', 'alkali']
          .filter((k) => section10.toLowerCase().includes(k));
        result.status = 'retrieved_requires_review';
        break;
      } catch (error) {
        result.attempts.push({ url, error: error.message });
      }
    }
    if (!result.sourceUrl) result.status = 'unavailable';
    if (p.productPage && permitted.has(new URL(p.productPage).hostname)) {
      try {
        const { bytes, finalUrl } = await get(p.productPage);
        const html = bytes.toString('utf8');
        result.identityPage = { sourceUrl: p.productPage, finalUrl, sha256: hash(bytes),
          codesPresent: Object.fromEntries((p.gtins || []).map((g) => [g, html.includes(g) || html.includes(g.replace(/^0(?=\\d{13}$)/, ''))])) };
      } catch (error) { result.identityPage = { sourceUrl: p.productPage, error: error.message }; }
    }
    results.push(result);
    console.log('CHEMHAZARD_AUDIT_RESULT ' + JSON.stringify(result));
  }
  if (output) await writeFile(output, JSON.stringify({ manifestDate: manifest.date, results }, null, 2) + '\n');
} finally {
  await rm(folder, { recursive: true, force: true });
}
