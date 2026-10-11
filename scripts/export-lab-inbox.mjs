// Immutable multi-Lab intake -> derived public index. No register or verdict writes.
import { readFileSync, readdirSync, existsSync, lstatSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const schema = JSON.parse(readFileSync(new URL('./lab-inbox.schema.json', import.meta.url), 'utf8'));
const validate = new Ajv({ allErrors: true }).compile(schema);
const stable = value => JSON.stringify(value, (_key, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const states = new Set(['received', 'in_progress', 'needs_research', 'processed', 'archived']);

export function buildInbox(root = ROOT) {
  const directory = join(root, '06-suche/proposals');
  const batches = new Map();
  const files = existsSync(directory) ? readdirSync(directory).filter(f => /^[A-Za-z0-9][A-Za-z0-9._-]*\.inbox\.json$/.test(f)).sort() : [];
  for (const file of files) {
    if (!lstatSync(join(directory, file)).isFile()) throw Error(`${file}: intake must be a regular file`);
    const data = JSON.parse(readFileSync(join(directory, file), 'utf8'));
    if (!validate(data)) throw Error(`${file}: invalid Lab intake: ${JSON.stringify(validate.errors)}`);
    const slug = data.run_id.replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 45).replace(/^-+|-+$/g, '') || 'run';
    const expected = `${data.lab_id}-${data.engine}-${slug}-${data.revision.slice(0, 16)}`;
    if (data.batch_id !== expected) throw Error(`${file}: batch identity differs from Lab/run/revision`);
    const candidates = data.record.result?.survivors?.length ? data.record.result.survivors : data.record.result?.opportunities ?? [];
    const normalized = candidates.map((record, i) => ({ local_id: String(record.candidate_id || record.id || `idea-${i + 1}`), record }));
    if (stable(normalized) !== stable(data.ideas)) throw Error(`${file}: ideas differ from the preserved source record`);
    if (new Set(data.ideas.map(i => i.local_id)).size !== data.ideas.length) throw Error(`${file}: duplicate local idea ID`);
    const prior = batches.get(data.batch_id);
    if (prior && stable(prior.data) !== stable(data)) throw Error(`${file}: conflicting immutable batch ${data.batch_id}`);
    if (!prior) batches.set(data.batch_id, { data, source: `06-suche/proposals/${file}` });
  }
  const output = [];
  for (const { data, source } of batches.values()) {
    const statusPath = join(root, '06-suche/lab-processing', `${data.batch_id}.json`);
    let processing = { state: 'received', note: '', updated_at: '', worker: '', lease_until: '' };
    if (existsSync(statusPath)) {
      const stored = JSON.parse(readFileSync(statusPath, 'utf8'));
      if (stored.batch_id !== data.batch_id || !states.has(stored.state) || typeof (stored.note ?? '') !== 'string') throw Error(`${statusPath}: invalid processing status`);
      processing = { state: stored.state, note: stored.note ?? '', updated_at: stored.updated_at ?? '', worker: stored.worker ?? '', lease_until: stored.lease_until ?? '' };
    }
    output.push({ batch_id: data.batch_id, lab_id: data.lab_id, engine: data.engine, run_id: data.run_id,
      revision: data.revision, created_at: data.created_at, model: data.model, intent: data.intent,
      existence_check: false, processing, source, detail: `lab-runs/${data.batch_id}.json`,
      ideas: data.ideas.map(idea => ({ id: `${data.batch_id}:${idea.local_id}`, local_id: idea.local_id, record: idea.record })) });
  }
  output.sort((a, b) => b.created_at.localeCompare(a.created_at) || a.batch_id.localeCompare(b.batch_id));
  return { index: { version: 1, batches: output }, records: [...batches.values()].map(v => v.data) };
}

export function exportInbox(root = ROOT) {
  // Validate every input before writing any derived file. Concurrent Labs write
  // disjoint immutable proposal files; only Amélie's build generates the index.
  const { index, records } = buildInbox(root);
  const directory = join(root, 'public/data');
  mkdirSync(join(directory, 'lab-runs'), { recursive: true });
  const write = (path, value) => {
    const tmp = `${path}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
    renameSync(tmp, path);
  };
  for (const record of records) write(join(directory, 'lab-runs', `${record.batch_id}.json`), record);
  write(join(directory, 'lab-inbox.json'), index);
  console.log(`Lab inbox: ${index.batches.length} immutable batches, ${index.batches.reduce((n, b) => n + b.ideas.length, 0)} ideas`);
  return index;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) exportInbox();
