// Read-only inventory of immutable receipts; never assigns review outcomes.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildInbox } from './export-lab-inbox.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const { index, records } = buildInbox(root);
const originals = new Map(records.map(record => [record.batch_id, record]));
const title = idea => String(idea.record.title ?? idea.record.idea ?? idea.record.name ?? idea.record.concept ?? idea.local_id);
const cell = text => String(text).replace(/\s+/g, ' ').replaceAll('|', '\\|');
const allIdeas = index.batches.flatMap(batch => batch.ideas.map(idea => ({ batch, idea, title: title(idea) })));
const titles = new Map();
for (const item of allIdeas) {
  const key = item.title.toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const group = titles.get(key) ?? [];
  group.push(item);
  titles.set(key, group);
}
const existing = [
  ...readdirSync(`${root}/05-dosen`).filter(name => name.endsWith('.md')).map(name => ({
    id: name.slice(0, -3), kind: 'Dose', path: `../05-dosen/${name}`,
  })),
  ...JSON.parse(readFileSync(`${root}/src/data/graeber.json`, 'utf8')).map(grave => ({
    id: grave.id, kind: 'Grab', path: '../src/data/graeber.json',
  })),
];
const totals = new Map();
const states = new Map();
const details = [];
for (const batch of [...index.batches].sort((a, b) => a.engine.localeCompare(b.engine) || a.batch_id.localeCompare(b.batch_id))) {
  const count = totals.get(batch.engine) ?? { batches: 0, ideas: 0 };
  count.batches++;
  count.ideas += batch.ideas.length;
  totals.set(batch.engine, count);
  states.set(batch.processing.state, (states.get(batch.processing.state) ?? 0) + 1);
  const record = originals.get(batch.batch_id);
  const hosts = new Set();
  const redirects = new Set();
  const findings = new Map();
  function walk(value) {
    if (typeof value === 'string' && /^https?:\/\/\S+$/.test(value)) {
      try {
        const host = new URL(value).hostname;
        if (host === 'vertexaisearch.cloud.google.com') redirects.add(value);
        else hosts.add(host);
      } catch { /* Inventory reports parseable URLs only. */ }
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') {
      if (typeof value.quote_status === 'string') {
        // Nested original runs may repeat the same finding. Count each once.
        findings.set(JSON.stringify([value.claim, value.source, value.quote, value.quote_status]), value.quote_status);
      }
      Object.values(value).forEach(walk);
    }
  }
  walk(record.record);
  const quotes = new Map();
  for (const status of findings.values()) quotes.set(status, (quotes.get(status) ?? 0) + 1);
  const serialized = JSON.stringify(record.record).toLowerCase();
  const mentions = existing.filter(item => item.id.length >= 6 && item.id.includes('-') &&
    new RegExp(`(^|[^a-z0-9_-])${item.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9_-]|$)`, 'i').test(serialized));
  details.push(`### ${batch.batch_id}`, '',
    `Engine: ${batch.engine}; Status: ${batch.processing.state}; Ideen: ${batch.ideas.length}.`, '',
    `[Originalbeleg](../${batch.source}) · [Proposal](../${batch.source.replace(/\.inbox\.json$/, '.md')})`, '',
    `Absicht: ${cell(batch.intent)}`, '',
    `URL-Domains im Originalrecord: ${[...hosts].sort().join(', ') || 'keine parsebaren direkten URLs gefunden'}. Vertex-Redirect-URLs: ${redirects.size}.`, '',
    `Quote-Status des Produzenten (keine Amélie-Prüfung): ${[...quotes].sort().map(([status, n]) => `${status}: ${n}`).join('; ') || 'nicht angegeben'}.`, '',
    `Wörtlich erwähnte Bestands-IDs: ${mentions.map(item => `[${item.kind}: ${item.id}](${item.path})`).join(', ') || 'keine'}.`, '');
  if (batch.processing.note) details.push(`Verarbeitungsnotiz: ${cell(batch.processing.note)}`, '');
  if (batch.ideas.length) {
    details.push('| Lokale ID | Originaltitel / Idee |', '| --- | --- |');
    batch.ideas.forEach(idea => details.push(`| ${cell(idea.local_id)} | ${cell(title(idea))} |`));
    details.push('');
  } else details.push('Batch ohne Survivor-Ideen: vollständige Findings, verworfene Ansätze und Historie im Originalbeleg lesen.', '');
}
const duplicates = [...titles.values()].filter(group => group.length > 1);
const lines = ['# Lab-Inbox: Arbeitsinventar', '',
  'Erzeugt mit `node scripts/inventory-lab-inbox.mjs` aus den validierten immutable Receipts und dem getrennten Verarbeitungsstatus. Diese Übersicht ist eine Lesehilfe, kein Existenztest und keine Bewertung. Keine Primärseiten wurden für die Erzeugung geöffnet.', '',
  'Domains umfassen alle parsebaren URL-Felder, auch Konkurrentenlinks und Hintergrundquellen. Quote-Status stammt unverändert vom Lab; wiederholte identische Findings werden einmal gezählt. Fehlende Felder beweisen keine fehlende Recherche. Wörtliche Bestands-ID-Erwähnungen sind Hinweise zum Nachlesen; ausbleibende Treffer schließen Überschneidungen nicht aus.', '',
  `Gesamt: **${index.batches.length} Batches / ${allIdeas.length} Ideen**. Status: ${[...states].sort().map(([state, n]) => `${state}: ${n}`).join('; ')}.`, '',
  '| Engine | Batches | Ideen |', '| --- | ---: | ---: |',
  ...[...totals].sort().map(([engine, count]) => `| ${engine} | ${count.batches} | ${count.ideas} |`), '',
  '## Wiederholte Titel', '',
  'Nur normalisierte wörtliche Titelgleichheit; ähnliche Ideen müssen zusätzlich inhaltlich verglichen werden.', '',
  ...duplicates.flatMap(group => [`- ${cell(group[0].title)}: ${group.map(item => `\`${item.batch.batch_id}:${item.idea.local_id}\``).join(', ')}`]),
  ...(duplicates.length ? [] : ['Keine identischen normalisierten Titel gefunden.']), '',
  '## Vollständige Batch-Liste', '', ...details];
writeFileSync(`${root}/docs/lab-inbox-inventory.md`, lines.join('\n') + '\n');
console.log(`Inventar: ${index.batches.length} Batches, ${allIdeas.length} Ideen, ${duplicates.length} wiederholte Titelgruppen.`);
