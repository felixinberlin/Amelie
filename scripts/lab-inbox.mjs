// Amélie owns processing state; Labs only submit immutable inbox records.
import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { buildInbox } from './export-lab-inbox.mjs';
import { acquireLock, loadActors } from './bib-store.mjs';
import { parseArgs } from './bibliothek-lib.mjs';
import { BibError } from './bib-errors.mjs';

const error = (code, field, message) => { throw new BibError({ code, field, message }); };
export function processBatch(root, { action, batch_id, worker, actor = 'bibliothekar', note = '', lease_seconds = 1800, wait = 0, dry = false, now = Date.now() }) {
  const rights = loadActors(root).actors?.[actor]?.allow ?? [];
  if (!rights.includes('*') && !rights.includes('lab.process')) error('PERMISSION_DENIED', 'actor', `${actor} may not change Amélie's Lab processing state`);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(worker ?? '')) error('VALUE_INVALID', 'worker', 'A stable worker ID is required');
  if (!['claim', 'finish', 'needs-research', 'release', 'archive'].includes(action)) error('VALUE_INVALID', 'action', 'Unknown processing action');
  if (!Number.isInteger(lease_seconds) || lease_seconds < 60 || lease_seconds > 3600) error('VALUE_INVALID', 'lease', 'Lease must be 60–3600 seconds');
  const release = acquireLock(root, { wait, actor });
  try {
    const batch = buildInbox(root).index.batches.find(b => b.batch_id === batch_id);
    if (!batch) error('VALUE_INVALID', 'batch_id', 'Unknown immutable batch');
    const path = join(root, '06-suche/lab-processing', `${batch.batch_id}.json`);
    const prior = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { batch_id, state: 'received' };
    const live = prior.state === 'in_progress' && Date.parse(prior.lease_until ?? '') > now;
    if (action === 'claim') {
      if (['processed', 'archived'].includes(prior.state)) error('PRECONDITION_FAILED', 'state', 'This revision has already been processed or archived');
      if (live && prior.worker !== worker) error('PRECONDITION_FAILED', 'worker', `Batch is leased to ${prior.worker}`);
    } else if (!live || prior.worker !== worker) error('PRECONDITION_FAILED', 'worker', 'A current lease owned by this worker is required');
    const state = { claim: 'in_progress', finish: 'processed', 'needs-research': 'needs_research', release: 'received', archive: 'archived' }[action];
    const next = { batch_id, state, worker: action === 'claim' ? worker : '', lease_until: action === 'claim' ? new Date(now + lease_seconds * 1000).toISOString() : '',
      note, updated_at: new Date(now).toISOString() };
    if (!dry) {
      mkdirSync(join(root, '06-suche/lab-processing'), { recursive: true });
      const temporary = `${path}.${process.pid}.tmp`;
      writeFileSync(temporary, JSON.stringify(next, null, 2) + '\n');
      renameSync(temporary, path);
    }
    return { ok: true, dry_run: dry, previous: prior.state, processing: next };
  } finally { release(); }
}

export function runCli(argv, { root, actor = 'bibliothekar' }) {
  const [action = 'list', ...rest] = argv;
  const { pos, one, has } = parseArgs(rest);
  if (action === 'list') return console.log(JSON.stringify(buildInbox(root).index, null, 2));
  if (action === 'show') {
    const record = buildInbox(root).records.find(b => b.batch_id === pos[0]);
    if (!record) error('VALUE_INVALID', 'batch_id', 'Unknown immutable batch');
    return console.log(JSON.stringify(record, null, 2));
  }
  const result = processBatch(root, { action, batch_id: pos[0], worker: one('worker'), actor,
    note: one('note') ?? '', lease_seconds: Number(one('lease') ?? 1800), wait: Number(one('wait') ?? 0), dry: has('dry-run') });
  console.log(JSON.stringify(result, null, 2));
}
