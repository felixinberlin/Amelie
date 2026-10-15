import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
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


test('every committed Lab idea has concise bilingual copy without changing its source record', () => {
  const root = new URL('..', import.meta.url);
  const descriptions = JSON.parse(readFileSync(new URL('src/data/labIdeaDescriptions.json', root), 'utf8'));
  const { index, records } = buildInbox(fileURLToPath(root));
  const ideas = index.batches.flatMap(batch => batch.ideas);
  assert.ok(ideas.length > 0);
  assert.deepEqual(Object.keys(descriptions.ideas).sort(), ideas.map(idea => idea.id).sort(), 'Summaries must cover every idea and use its full identity');
  for (const idea of ideas) {
    assert.deepEqual(idea.plain_language, descriptions.ideas[idea.id]);
    for (const language of ['de', 'en']) {
      const copy = idea.plain_language[language];
      assert.ok(copy.title.trim().length > 0 && copy.title.length <= 100, idea.id + ': short title');
      assert.ok(copy.description.trim().length > 0 && copy.description.length <= 400, idea.id + ': short explanation');
    }
  }
  for (const record of records) {
    const batch = index.batches.find(batch => batch.batch_id === record.batch_id);
    assert.deepEqual(batch.ideas.map(idea => ({ local_id: idea.local_id, record: idea.record })), record.ideas);
    assert.ok(record.ideas.every(idea => !Object.hasOwn(idea, 'plain_language')));
  }
});

test('Lab cards switch languages, search summaries, and retain expandable original records', async () => {
  const { JSDOM } = await import('jsdom');
  const html = readFileSync(new URL('../public/lab-ideas.html', import.meta.url), 'utf8');
  const batch = {
    batch_id: 'lab-a-test', lab_id: 'lab-a', engine: 'lacunar', run_id: 'test-run',
    revision: 'a'.repeat(64), created_at: '2026-10-15', model: 'test', intent: 'Test batch',
    processing: { state: 'received' }, detail: 'lab-runs/test.json',
    ideas: [{
      id: 'lab-a-test:C1', local_id: 'C1',
      plain_language: {
        de: { title: 'Ein kurzer Titel', description: 'Einfacher deutscher Suchtext.' },
        en: { title: 'A short title', description: 'A simple searchable explanation. <img src=x onerror=alert(1)>' },
      },
      record: { idea: 'Complicated original heading', gap: 'Original gap', evidence_urls: ['https://example.org/source'] },
    }, { id: 'lab-a-test:C2', local_id: 'C2', record: { title: 'Future idea awaiting a summary' } }],
  };
  const dom = new JSDOM(html, {
    url: 'https://example.org/Amelie/lab-ideas.html', runScripts: 'dangerously',
    beforeParse(window) {
      Object.defineProperty(window.navigator, 'language', { value: 'en-GB' });
      window.fetch = async () => ({ ok: true, json: async () => ({ version: 1, batches: [batch] }) });
    },
  });
  try {
    await dom.window.load();
    const { document, Event } = dom.window;
    const first = () => document.getElementById('lab-a-test:C1');
    assert.equal(first().querySelector('h3').textContent, 'A short title');
    assert.equal(first().querySelector('.plain-description').lang, 'en');
    assert.ok(first().querySelector('.plain-description').textContent.includes('<img'));
    assert.equal(first().querySelectorAll('img').length, 0, 'Editorial copy is rendered as text');
    const details = first().querySelector('details');
    assert.equal(details.open, false);
    details.open = true;
    assert.equal(details.querySelector('.original-title').textContent, batch.ideas[0].record.idea);
    assert.equal(details.querySelector('a').href, 'https://example.org/source');
    assert.deepEqual(JSON.parse(details.querySelector('pre').textContent), batch.ideas[0].record);
    assert.equal(document.getElementById('lab-a-test:C2').querySelector('h3').textContent, batch.ideas[1].record.title);
    const language = document.getElementById('language');
    language.value = 'de'; language.dispatchEvent(new Event('change'));
    assert.equal(first().querySelector('h3').textContent, 'Ein kurzer Titel');
    assert.equal(first().querySelector('.plain-description').lang, 'de');
    const search = document.getElementById('search');
    search.value = 'searchable explanation'; search.dispatchEvent(new Event('input'));
    assert.ok(first(), 'Both translations remain searchable regardless of display language');
    search.value = 'Original gap'; search.dispatchEvent(new Event('input'));
    assert.ok(first(), 'Original details remain searchable');
    search.value = 'no matching idea'; search.dispatchEvent(new Event('input'));
    assert.equal(document.querySelectorAll('article').length, 0);
    assert.equal(document.getElementById('empty').hidden, false);
    search.value = ''; search.dispatchEvent(new Event('input'));
    const engine = document.getElementById('engine');
    engine.value = 'lacunar'; engine.dispatchEvent(new Event('change'));
    assert.equal(document.querySelectorAll('article').length, 2);
    const state = document.getElementById('state');
    state.value = 'processed'; state.dispatchEvent(new Event('change'));
    assert.equal(document.querySelectorAll('article').length, 0);
  } finally { dom.window.close(); }
});
