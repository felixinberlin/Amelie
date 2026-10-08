// Gemeinsame Drossel für parallele Agenten (eigene Prozesse) gegen Ratenbegrenzungen (429/503).
//
// Problem: Jeder Agent ist ein eigener Prozess. Wiederholt jeder für sich, laufen drei Engines in dieselbe Quote und
// treffen sie immer wieder gemeinsam. Lösung: eine kleine Zustandsdatei je Modell, die alle Prozesse teilen:
//
//   nextSlot       frühester Zeitpunkt des nächsten Aufrufs (Abstand gapMs zwischen Aufrufen, über alle Prozesse)
//   cooldownUntil  nach einem 429 für alle gesperrt, mit Jitter, damit sie nicht gleichzeitig wieder anlaufen
//
// Wiederholt wird auf Schrittebene (der Gesprächsstand bleibt erhalten), mit mehr Versuchen als der einfache
// withRetry, gedeckelter Pause und der Wartezeit, die der Anbieter nennt („retry in 12s“, Retry-After).

import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isTransient } from '../lab-librarian-agent.mjs';

const real = { now: () => Date.now(), sleep: (ms) => new Promise((r) => setTimeout(r, ms)), rand: Math.random };

export const DEFAULTS = { gapMs: 1500, tries: 8, baseMs: 10_000, maxMs: 120_000 };

/** Wartezeit aus der Fehlermeldung des Anbieters (Sekunden → ms), sonst null. */
export function retryHint(err) {
  const m = String(err?.message ?? err).match(/retry(?:Delay|[- ]after|\s+in)["':\s=]*([\d.]+)\s*(ms|s)?/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? Math.round(m[2] === 'ms' ? n : n * 1000) : null;
}

/** Pause vor Versuch i (1-basiert): exponentiell, gedeckelt, mit Jitter; mindestens die Angabe des Anbieters. */
export function backoffMs(i, err, { baseMs = DEFAULTS.baseMs, maxMs = DEFAULTS.maxMs, rand = Math.random } = {}) {
  const exp = Math.min(maxMs, baseMs * 2 ** (i - 1));
  const hint = retryHint(err);
  const base = hint ? Math.max(exp / 2, Math.min(hint + 1000, maxMs)) : exp;
  return Math.round(base * (0.75 + rand() * 0.5));
}

/** Zustandsdatei mit kurzem Verzeichnis-Lock (atomar auf allen Systemen). */
export function sharedState({ key, dir = tmpdir(), now = real.now, sleep = real.sleep } = {}) {
  const safe = String(key ?? 'default').replace(/[^A-Za-z0-9._-]/g, '_');
  const file = join(dir, `amelie-ratelimit-${safe}.json`);
  const lock = `${file}.lock`;

  async function locked(fn) {
    for (let tries = 0; ; tries++) {
      try { mkdirSync(lock); break; } catch (e) {
        if (e.code !== 'EEXIST') throw e;
        try { if (now() - statSync(lock).mtimeMs > 5000) rmSync(lock, { recursive: true, force: true }); } catch { /* weg */ }
        if (tries > 400) { rmSync(lock, { recursive: true, force: true }); continue; }
        await sleep(10 + (tries % 7) * 5);
      }
    }
    try { return fn(); } finally { rmSync(lock, { recursive: true, force: true }); }
  }
  const read = () => { try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return { nextSlot: 0, cooldownUntil: 0 }; } };
  const write = (s) => { writeFileSync(`${file}.tmp`, JSON.stringify(s)); renameSync(`${file}.tmp`, file); };

  return {
    file,
    /** Reserviert den nächsten Aufruf-Slot und liefert, wie lange zu warten ist (ms). */
    claim: (gapMs) => locked(() => {
      const s = read();
      const t = now();
      const slot = Math.max(t, s.nextSlot ?? 0, s.cooldownUntil ?? 0);
      write({ ...s, nextSlot: slot + gapMs });
      return Math.max(0, slot - t);
    }),
    /** Sperrt alle Prozesse für ms (nur verlängern, nie verkürzen). */
    cooldown: (ms) => locked(() => {
      const s = read();
      const until = Math.max(s.cooldownUntil ?? 0, now() + ms);
      write({ ...s, cooldownUntil: until, nextSlot: Math.max(s.nextSlot ?? 0, until) });
      return until;
    }),
    peek: read,
    reset: () => { try { rmSync(file, { force: true }); } catch { /* egal */ } },
  };
}

/**
 * Umhüllt einen Adapter: Abstand zwischen Aufrufen über alle Prozesse, gemeinsame Abkühlzeit nach 429/503,
 * Wiederholung des Schritts mit Jitter. opts: { key, gapMs, tries, baseMs, maxMs, dir, now, sleep, rand, onRetry, onWait }
 */
export function withThrottle(adapter, opts = {}) {
  const { key = 'default', gapMs = DEFAULTS.gapMs, tries = DEFAULTS.tries, baseMs = DEFAULTS.baseMs, maxMs = DEFAULTS.maxMs, dir, now = real.now, sleep = real.sleep, rand = real.rand, onRetry, onWait } = opts;
  const state = opts.state ?? sharedState({ key, dir, now, sleep });
  return {
    ...adapter,
    start: (a) => adapter.start(a),
    addToolResults: (st, res) => adapter.addToolResults(st, res),
    state,
    async step(st) {
      for (let i = 1; ; i++) {
        const wait = await state.claim(gapMs);
        if (wait > 1500) onWait?.(wait);
        if (wait > 0) await sleep(wait);
        try { return await adapter.step(st); } catch (e) {
          if (i >= tries || !isTransient(e)) throw e;
          const ms = backoffMs(i, e, { baseMs, maxMs, rand });
          await state.cooldown(ms);
          onRetry?.(i, ms, e);
        }
      }
    },
  };
}

/** Modellschlüssel für die gemeinsame Zustandsdatei: alle Läufe desselben Modells teilen sich die Quote. */
export const throttleKey = (spec) => `${spec?.provider ?? 'x'}-${spec?.project ?? ''}-${spec?.model ?? spec?.id ?? 'x'}`;

export const existsState = (dir, key) => existsSync(join(dir, `amelie-ratelimit-${String(key).replace(/[^A-Za-z0-9._-]/g, '_')}.json`));
