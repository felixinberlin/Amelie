import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildInbox, exportInbox } from './export-lab-inbox.mjs';
import { processBatch } from './lab-inbox.mjs';

const fixture = () => {
  const root = mkdtempSync(join(tmpdir(), 'amelie-intake-'));
  mkdirSync(join(root, '06-suche/proposals'), { recursive: true });
  writeFileSync(join(root, '06-suche/bib-actors.json'), JSON.stringify({ actors: { bibliothekar: { allow: ['*'] }, 'lab-librarian': { allow: ['source.log'] } } }));
  return root;
};
const record = (lab, revision = 'a'.repeat(64)) => ({ contract_version: '1.0.0', batch_id: `${lab}-lacunar-same-run-${revision.slice(0,16)}`,
  lab_id: lab, engine: 'lacunar', run_id: 'same-run', revision, created_at: '2026-10-10T12:00:00Z', model: 'recorded-model', intent: 'A hypothesis',
  ideas: [{local_id:'C1', record:{candidate_id:'C1',idea:'<script>unsafe</script>',grounded:false}}], record:{run_id:'same-run',result:{survivors:[{candidate_id:'C1',idea:'<script>unsafe</script>',grounded:false}]}}, existence_check:false });
const save = (root, name, data) => writeFileSync(join(root, '06-suche/proposals', `${name}.inbox.json`), JSON.stringify(data));

test('two Labs sharing run and candidate IDs remain distinct; identical retries deduplicate', () => {
  const root = fixture();
  try {
    save(root,'one',record('lab-a'));save(root,'two',record('lab-b'));save(root,'retry',record('lab-a'));
    const { index } = buildInbox(root);
    assert.equal(index.batches.length,2);
    assert.equal(new Set(index.batches.flatMap(b=>b.ideas.map(i=>i.id))).size,2);
    assert.ok(index.batches.every(b=>b.processing.state==='received'&&!b.existence_check));
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('a revised run is a separate receipt; conflicting immutable records block export', () => {
  const root = fixture();
  try {
    save(root,'one',record('lab-a'));save(root,'revision',record('lab-a','b'.repeat(64)));
    assert.equal(buildInbox(root).index.batches.length,2);
    exportInbox(root);
    const path=join(root,'public/data/lab-inbox.json'),before=readFileSync(path,'utf8');
    const conflicting=record('lab-a');conflicting.ideas[0].record.idea='different payload';conflicting.record.result.survivors[0].idea='different payload';save(root,'conflict',conflicting);
    assert.throws(()=>exportInbox(root),/conflicting immutable batch/);
    assert.equal(readFileSync(path,'utf8'),before);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('claims are exclusive, lease expiry permits recovery, and only the lease owner can finish', () => {
  const root=fixture();
  try {
    const batch=record('lab-a');save(root,'one',batch);
    const options={batch_id:batch.batch_id,actor:'bibliothekar',lease_seconds:60,now:1000000};
    processBatch(root,{...options,action:'claim',worker:'worker-one'});
    assert.throws(()=>processBatch(root,{...options,action:'claim',worker:'worker-two'}),/leased/);
    assert.throws(()=>processBatch(root,{...options,action:'finish',worker:'worker-two'}),/current lease/);
    processBatch(root,{...options,now:1060001,action:'claim',worker:'worker-two'});
    assert.throws(()=>processBatch(root,{...options,now:1060002,action:'finish',worker:'worker-one'}),/current lease/);
    processBatch(root,{...options,now:1060002,action:'finish',worker:'worker-two',note:'Review recorded elsewhere'});
    const updated=buildInbox(root).index.batches[0];
    assert.equal(updated.processing.state,'processed');assert.equal(updated.existence_check,false);
    assert.throws(()=>processBatch(root,{...options,action:'claim',worker:'worker-three'}),/already been processed/);
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('Labs cannot change host processing state; dry-run leaves no status file', () => {
  const root=fixture();
  try {
    const batch=record('lab-a');save(root,'one',batch);
    assert.throws(()=>processBatch(root,{batch_id:batch.batch_id,action:'claim',worker:'worker-one',actor:'lab-librarian'}),/may not change/);
    const result=processBatch(root,{batch_id:batch.batch_id,action:'claim',worker:'worker-one',dry:true});
    assert.ok(result.dry_run);assert.equal(buildInbox(root).index.batches[0].processing.state,'received');
  } finally { rmSync(root,{recursive:true,force:true}); }
});

test('simultaneous workers cannot both claim the same immutable receipt', async () => {
  const { spawn } = await import('node:child_process');
  const root=fixture(),batch=record('lab-a');save(root,'one',batch);
  const moduleUrl=new URL('./lab-inbox.mjs',import.meta.url).href;
  const claim=worker=>new Promise((resolve,reject)=>{
    const code=`import {processBatch} from ${JSON.stringify(moduleUrl)};try{console.log(JSON.stringify(processBatch(${JSON.stringify(root)},{action:'claim',batch_id:${JSON.stringify(batch.batch_id)},worker:${JSON.stringify(worker)}})))}catch(error){console.log(JSON.stringify({code:error.code}));process.exitCode=1;}`;
    const child=spawn(process.execPath,['--input-type=module','-e',code],{stdio:['ignore','pipe','pipe']});
    let stdout='',stderr='';child.stdout.on('data',chunk=>stdout+=chunk);child.stderr.on('data',chunk=>stderr+=chunk);
    child.on('error',reject);child.on('close',exit=>resolve({exit,stdout,stderr}));
  });
  try {
    const results=await Promise.all([claim('one'),claim('two')]);
    assert.equal(results.filter(r=>r.exit===0).length,1,JSON.stringify(results));
    const failure=JSON.parse(results.find(r=>r.exit!==0).stdout);
    assert.ok(['LOCK_TIMEOUT','PRECONDITION_FAILED'].includes(failure.code));
    assert.equal(buildInbox(root).index.batches[0].processing.state,'in_progress');
  } finally {rmSync(root,{recursive:true,force:true});}
});
