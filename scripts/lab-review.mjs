#!/usr/bin/env node
// Lab-PR-Prüfung: ruft den Bibliothekar (eigenständiger Agent, scripts/lab-librarian-agent.mjs) für PRs vom Schwesterprojekt Amélie-lab (Branches lab/*).
// Ablauf und Regeln: 06-suche/amelie-lab-protokoll.md §7, Handbuch: 06-suche/amelie-lab-review-cli.md.
//
//   npm run lab -- list
//   npm run lab -- review <pr> [--no-agent] [--post] [--merge] [--keep] [--model <id>]
//
// Ohne --post und --merge schreibt der Lauf nur lokal (Worktree unter /tmp, Bericht als Datei).
// Nach außen geht nichts ohne Schalter: --post kommentiert, --merge mergt (Merge-Commit) und zieht main nach.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewPlans, runLabLibrarian } from './lab-librarian-agent.mjs';
import { PROPOSALS, assess, buildComment, checkPr, checkScope, decide, parseNameStatus, parseRecommendation } from './lab-review-lib.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const [cmd = 'hilfe', ...rest] = process.argv.slice(2);
const has = (k) => rest.includes(`--${k}`);
const opt = (k) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : undefined; };
const pos = rest.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--model'].includes(rest[i - 1])));

const sh = (bin, args, o = {}) => spawnSync(bin, args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...o });
const die = (msg, code = 1) => { console.error(`✗ ${msg}`); process.exit(code); };
const step = (msg) => console.log(`\n— ${msg}`);

const HILFE = `Lab-PR-Prüfung (Bibliothekar ruft die Prüfkette aus dem Lab-Protokoll §7 auf)

  npm run lab -- list                      offene PRs mit Branch lab/*
  npm run lab -- review <pr> [Optionen]    einen Lab-PR prüfen

Optionen für review:
  --no-agent        nur die maschinellen Prüfungen, kein Bibliothekar-Agent (kostet nichts)
  --no-delegate     der Agent darf keine anderen Amélie-Agenten rufen (Skills und Lesewerkzeuge bleiben)
  --post            Kommentar mit fester Kopfzeile in den PR schreiben (nur bei Merge oder Ablehnung)
  --merge           mergen, wenn alles grün ist und der Bibliothekar „EMPFEHLUNG: merge" gibt; danach git pull --ff-only
  --keep            Worktree nicht löschen
  --model <id>      Modell des Agenten aus scripts/model-compare/models.local.json (sonst "librarian", "judge", erstes)

Maschinell (immer): Umfang nur neue Dateien in ${PROPOSALS} (vor jeder Codeausführung), Manifest
(check:lab-pr mit PR-Text), lint, test, bib apply --dry-run je Plan.
Agent (scripts/lab-librarian-agent.mjs): eigene Schleife gegen ein Modell (Claude, Vertex oder Gemini). Werkzeuge, alle nur
lesend: bib_find, quellen_match, read_proposal, run_cli (bib/quellen-Lesebefehle), read_file, search_repo, web_fetch, dazu
Skills des Projekts (load_skill) und andere Amélie-Agenten als Unter-Agent (call_agent). Er bucht nie etwas.
Einrichten wie beim Modellvergleich: 06-suche/amelie-modellvergleich.md (SDK per npm i --no-save, models.local.json).`;

function ghJson(args) {
  const r = sh('gh', args);
  if (r.status !== 0) die(`gh ${args.join(' ')}: ${r.stderr.trim()}`);
  return JSON.parse(r.stdout);
}

function list() {
  const prs = ghJson(['pr', 'list', '--state', 'open', '--limit', '100', '--json', 'number,title,headRefName,updatedAt']);
  const lab = prs.filter((p) => p.headRefName.startsWith('lab/'));
  if (!lab.length) return console.log('Keine offenen Lab-PRs.');
  for (const p of lab) console.log(`#${p.number}  ${p.updatedAt.slice(0, 16).replace('T', ' ')}  ${p.headRefName}\n      ${p.title}`);
}

/** Ergebnis eines Prüfschritts: { name, ok, note } */
const results = [];
// tool=true: der Schritt ist ausgefallen (Agent, Netz), das ist keine Sachfeststellung über den PR und führt nie zu einer Ablehnung
const record = (name, ok, note = '', tool = false) => { results.push({ name, ok, note, tool }); console.log(`${ok ? '✓' : '✗'} ${name}${note ? `: ${note}` : ''}`); };
const lastLines = (s, n = 6) => s.replace(/\x1b\[[0-9;]*m/g, '').trim().split('\n').slice(-n).join(' | ');

async function review() {
  const n = Number(pos[0]);
  if (!Number.isInteger(n)) die('review braucht eine PR-Nummer: npm run lab -- review 174');
  const pr = ghJson(['pr', 'view', String(n), '--json', 'number,title,state,headRefName,body,mergeable']);
  const prErrs = checkPr(pr);
  if (prErrs.length) die(prErrs.join('\n'));
  console.log(`#${pr.number} ${pr.title}\n   Branch ${pr.headRefName}, mergeable: ${pr.mergeable}`);

  step('Stand holen');
  let r = sh('git', ['fetch', '-q', 'origin', 'main', `+pull/${n}/head:refs/lab/pr-${n}`]);
  if (r.status !== 0) die(`git fetch: ${r.stderr.trim()}`);
  const head = sh('git', ['rev-parse', `refs/lab/pr-${n}`]).stdout.trim();
  const base = 'origin/main';

  step('Umfang (vor jeder Codeausführung)');
  const files = parseNameStatus(sh('git', ['diff', '--name-status', `${base}...${head}`]).stdout);
  const scopeErrs = checkScope(files);
  record('Umfang: nur neue Dateien in ' + PROPOSALS, scopeErrs.length === 0, scopeErrs.length ? scopeErrs.slice(0, 3).join(' | ') : `${files.length} Dateien`);

  let manifest = null;
  let agentText = '';
  let recommendation = null;
  let work = null;

  if (scopeErrs.length === 0) {
    work = mkdtempSync(join(tmpdir(), `amelie-lab-pr-${n}-`));
    const wt = join(work, 'wt');
    r = sh('git', ['worktree', 'add', '--detach', wt, head]);
    if (r.status !== 0) die(`worktree: ${r.stderr.trim()}`);
    symlinkSync(join(ROOT, 'node_modules'), join(wt, 'node_modules'));
    const inWt = (bin, args) => sh(bin, args, { cwd: wt });

    try {
      step('Manifest');
      const bodyFile = join(work, 'pr-body.txt');
      writeFileSync(bodyFile, pr.body ?? '');
      r = inWt('node', [join(ROOT, 'scripts/check-lab-pr.mjs'), '--root', wt, '--pr', base, '--pr-text', bodyFile]);
      record('Manifest (check:lab-pr, PR-Text, Quellenregister)', r.status === 0, lastLines(r.stderr || r.stdout, 4));
      const manPath = files.map((f) => f.path).find((p) => p.endsWith('.manifest.json'));
      if (manPath) { try { manifest = JSON.parse(readFileSync(join(wt, manPath), 'utf8')); } catch { /* steht schon im Manifestbefund */ } }

      step('Pläne trocken anwenden');
      const plans = files.map((f) => f.path).filter((p) => p.endsWith('.json') && !p.endsWith('.manifest.json'));
      if (!plans.length) record('bib apply --dry-run', true, 'kein Plan im PR');
      for (const p of plans) {
        r = sh('node', ['scripts/bibliothek.mjs', 'apply', join(wt, p), '--dry-run', '--json', '--actor', 'lab-librarian', '--no-export']); // gegen den Stand von main
        let note = `Exit ${r.status}`;
        try { const j = JSON.parse(r.stdout); note += j.ok === false ? ` ${j.errors?.[0]?.code ?? ''} ${j.errors?.[0]?.message ?? ''}`.trimEnd() : `, ${j.ops?.length ?? 0} Operationen`; } catch { /* kein JSON */ }
        record(`bib apply --dry-run ${p.split('/').pop()}`, r.status === 0, note);
      }

      step('lint');
      r = inWt('npm', ['run', 'lint']);
      record('npm run lint', r.status === 0, r.status === 0 ? '' : lastLines(r.stderr || r.stdout));
      step('test');
      r = inWt('npm', ['test']);
      record('npm test', r.status === 0, lastLines(r.stdout, 4).replace(/\s+/g, ' ').slice(0, 160));
    } finally {
      // Der Worktree bleibt nur mit --keep stehen (Vitest sammelt sonst Fremdverzeichnisse, /tmp ist davon frei).
    }

    if (!has('no-agent')) {
      step('Bibliothekar (eigenständiger Agent, nur lesend)');
      try {
        const manifests = files.map((f) => f.path).filter((x) => x.endsWith('.manifest.json'))
          .map((x) => { try { return JSON.parse(readFileSync(join(wt, x), 'utf8')); } catch { return null; } }).filter(Boolean);
        const base = { root: ROOT, worktree: wt, pr, files, results, model: opt('model'), delegate: !has('no-delegate') };
        // Mehrere Läufe im PR: jeder Lauf bekommt einen eigenen Agentenlauf, damit keiner ungeprüft bleibt.
        const a = manifests.length ? await reviewPlans({ ...base, manifests }) : await runLabLibrarian({ ...base, manifest });
        if (a.per) console.log(`   ${a.covered} von ${a.total} Läufen geprüft`);
        agentText = a.text.trim();
        recommendation = parseRecommendation(agentText);
        const cost = a.cost === null ? '' : `, ca. ${a.cost.toFixed(2)} $`;
        for (const c of a.agentCalls) console.log(`   Unter-Agent ${c.agent}: ${c.turns} Runden, ${c.toolLog.length} Werkzeugaufrufe`);
        console.log(`   ${a.model}: ${a.turns} Runden, ${a.toolLog.length} Werkzeugaufrufe, ${a.usage.in + a.usage.out} Token${cost}`);
        record('Bibliothekar-Agent', recommendation !== null, recommendation ? `Empfehlung: ${recommendation}` : 'Bericht ohne Zeile „EMPFEHLUNG: merge|nicht mergen"', recommendation === null);
      } catch (e) {
        record('Bibliothekar-Agent', false, `nicht gelaufen: ${e.message}`, true);
      }
    }
  }

  // ── Entscheidung ───────────────────────────────────────────────────────────
  const { blockers, incomplete, mergeReady } = assess({ results, recommendation, noAgent: has('no-agent') });

  let merged = false;
  if (has('merge')) {
    if (!mergeReady) console.log('\n✗ --merge ignoriert: ' + (blockers.length ? 'es gibt Befunde (siehe oben).' : incomplete.length ? 'der Lauf ist unvollständig (siehe oben), es gibt keine Entscheidung.' : 'ohne Bibliothekar-Empfehlung „merge" wird nicht gemergt (mit --no-agent nur den Schalter weglassen oder selbst mergen).'));
    else {
      step('Mergen');
      r = sh('gh', ['pr', 'merge', String(n), '--merge']);
      if (r.status !== 0) die(`gh pr merge: ${r.stderr.trim()}`);
      r = sh('git', ['pull', '--ff-only', 'origin', 'main']);
      if (r.status !== 0) console.error(`! git pull --ff-only fehlgeschlagen: ${r.stderr.trim()}`);
      merged = true;
      console.log(`✓ #${n} gemergt`);
    }
  }

  const decision = decide({ blockers, merged });
  const findings = results.map((x) => `${x.ok ? '✓' : '✗'} ${x.name}${x.note ? `: ${x.note}` : ''}`);
  const comment = decision
    ? buildComment({ decision, existenzCheck: manifest?.existence_check === true, findings, agentText })
    : null;
  const reportPath = join(tmpdir(), `amelie-lab-pr-${n}-bericht.md`);
  writeFileSync(reportPath, (comment ?? buildComment({ decision: 'offen (Empfehlung: ' + (mergeReady ? 'merge' : 'nicht mergen') + ')', existenzCheck: manifest?.existence_check === true, findings, agentText })));

  if (has('post')) {
    if (!comment) console.log('\n✗ --post ignoriert: ' + (incomplete.length ? 'der Lauf ist unvollständig, deshalb gibt es keine Entscheidung und es wird nichts gepostet.' : 'ohne Merge und ohne Ablehnung gibt es keine Entscheidung. Erst mit --merge laufen lassen.'));
    else {
      r = sh('gh', ['pr', 'comment', String(n), '--body-file', reportPath]);
      if (r.status !== 0) die(`gh pr comment: ${r.stderr.trim()}`);
      console.log(`✓ Kommentar in #${n} gepostet`);
    }
  }

  if (work && !has('keep')) {
    sh('git', ['worktree', 'remove', '--force', join(work, 'wt')]);
    rmSync(work, { recursive: true, force: true });
  }
  sh('git', ['update-ref', '-d', `refs/lab/pr-${n}`]);
  console.log(`\nBericht: ${reportPath}`);
  if (!merged && !blockers.length && incomplete.length) { console.log(`Ergebnis: unvollständig (${incomplete.length} Schritt(e) ausgefallen), keine Entscheidung. Nochmal laufen lassen oder mit --no-agent prüfen.`); process.exit(3); }
  console.log(merged ? `Ergebnis: gemergt` : blockers.length ? `Ergebnis: ${blockers.length} Befund(e), nicht mergebar` : `Ergebnis: mergebar${recommendation ? ' (Empfehlung des Bibliothekars)' : ' (maschinell, ohne Agent)'}. Mergen mit: npm run lab -- review ${n} --merge --post`);
  process.exit(blockers.length ? 2 : 0);
}

switch (cmd) {
  case 'list': list(); break;
  case 'review': await review(); break;
  case 'hilfe': case 'help': case '--help': console.log(HILFE); break;
  default: die(`Unbekannter Befehl „${cmd}". npm run lab -- hilfe`);
}
