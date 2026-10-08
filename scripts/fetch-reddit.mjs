#!/usr/bin/env node
/**
 * Amélie: nächtlicher Reddit-Cache.
 *
 * Holt pro Subreddit den öffentlichen Atom-Feed (top.rss?t=week) und schreibt
 * public/data/reddit.json. Reddit begrenzt streng (Netztest 29.09.2026: etwa ein Abruf
 * pro Minute, sonst 429), deshalb strikt seriell mit Pause und einem Wiederholungsversuch.
 * Kein Scraping, kein Login, kein .json/API (dort 403). Der Feed hat keine Scores;
 * die Reihenfolge von top.rss ist das Signal.
 *
 * Usage:
 *   node scripts/fetch-reddit.mjs                 # alle Subs aus reddit-subs.json
 *   node scripts/fetch-reddit.mjs SideProject     # nur diese (für Tests)
 *   node scripts/fetch-reddit.mjs --pause 70      # Sekunden zwischen Abrufen (Default 65)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAtom, mergeFeed } from './reddit-lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const subsFile = path.join(root, 'scripts', 'reddit-subs.json');
const outFile = path.join(root, 'public', 'data', 'reddit.json');
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AmelieResearch/1.0 (+https://github.com/felixinberlin/Amelie)';

const args = process.argv.slice(2);
const pauseIdx = args.indexOf('--pause');
const pauseSec = pauseIdx >= 0 ? Number(args[pauseIdx + 1]) : 65;
const only = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--pause');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const config = JSON.parse(fs.readFileSync(subsFile, 'utf-8'));
const period = config.period ?? 'week';
const subs = config.subs.filter((s) => only.length === 0 || only.includes(s.sub));
const previous = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf-8')) : { feeds: [] };
const prevBySub = new Map(previous.feeds.map((f) => [f.sub, f]));

async function fetchOnce(sub) {
  const res = await fetch(`https://www.reddit.com/r/${sub}/top.rss?t=${period}&limit=25`, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}` };
  const posts = parseAtom(await res.text());
  return posts.length ? { ok: true, posts } : { ok: false, error: 'Feed ohne Einträge' };
}

async function fetchSub(sub) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const r = await fetchOnce(sub);
      if (r.ok || r.status !== 429) return r;
    } catch (err) {
      if (attempt === 2) return { ok: false, error: String(err.message ?? err) };
    }
    if (attempt === 1) await sleep(pauseSec * 1000);
  }
  return { ok: false, error: 'HTTP 429' };
}

const now = new Date().toISOString();
const merged = new Map(prevBySub);
for (let i = 0; i < subs.length; i++) {
  const { sub, group } = subs[i];
  if (i > 0) await sleep(pauseSec * 1000);
  const r = await fetchSub(sub);
  const feed = mergeFeed(prevBySub.get(sub), { ...r, sub, group, period, posts: r.posts ?? [] }, now);
  merged.set(sub, feed);
  console.log(`r/${sub}: ${feed.stale ? `STALE (${feed.error}, ${feed.posts.length} alte Beiträge)` : `${feed.posts.length} Beiträge`}`);
}

// Reihenfolge und Gruppen der Konfiguration; entfernte Subs fallen heraus.
const feeds = config.subs.map((s) => merged.get(s.sub)).filter(Boolean);
const okCount = feeds.filter((f) => !f.stale).length;
const out = {
  generatedAt: now,
  period,
  source: 'reddit.com Atom-Feeds (top.rss), Reihenfolge = Ranking; keine Scores',
  feeds,
};
if (only.length === 0 && okCount === 0 && previous.feeds.length > 0) {
  console.error('Kein Feed erreichbar; bestehende reddit.json bleibt unverändert.');
  process.exit(1);
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(`geschrieben: ${path.relative(root, outFile)} (${okCount}/${feeds.length} frisch)`);
