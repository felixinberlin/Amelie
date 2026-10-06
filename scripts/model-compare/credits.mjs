// Verbrauch und Guthaben je Anbieter, vor und nach einem Lauf.
//
//   npm run credits                 Stand aller konfigurierten Anbieter
//   npm run agent -- <agent> … --credits   (zeigt Stand vor und nach dem Lauf samt Differenz)
//
// Was abfragbar ist:
//   OpenRouter  GET /key und /credits: Verbrauch in USD, bezahltes Guthaben, freie Anfragen pro Tag (echte Zahlen).
//   Gemini-API  KEINE Abfrage von Guthaben oder Kontingent möglich (AI Studio zeigt es nur im Browser:
//               https://aistudio.google.com/usage). Wir rechnen Token × Preis aus models.local.json und
//               summieren die heutigen Laufdateien in 06-suche/agent-runs/.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const usd = (n) => (n == null ? '?' : `$${Number(n).toFixed(4)}`);

async function getJson(url, key, fetchFn) {
  const res = await fetchFn(url, { headers: { authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).data;
}

/** OpenRouter-Stand: { usd_used, usd_left, free_used, free_limit, free_left } (null, wo unbekannt). */
export async function openrouterStand(spec, env = process.env, fetchFn = fetch) {
  const key = env[spec.apiKeyEnv ?? 'OPENROUTER_API_KEY'];
  if (!key) return null;
  const base = String(spec.baseUrl ?? 'https://openrouter.ai/api/v1').replace(/\/+$/, '');
  const k = await getJson(`${base}/key`, key, fetchFn);
  let c = null;
  try { c = await getJson(`${base}/credits`, key, fetchFn); } catch { /* nur Schlüsselendpunkt */ }
  const f = k.free_model_daily_requests;
  return {
    usd_used: c?.total_usage ?? k.usage ?? null,
    usd_left: c ? c.total_credits - c.total_usage : (k.limit_remaining ?? null),
    usd_eingezahlt: c?.total_credits ?? null,
    free_used: f?.used ?? null, free_limit: f?.limit ?? null, free_left: f?.remaining ?? null,
  };
}

/** Token und geschätzte Kosten aller heutigen Läufe (UTC) je Modell-Id. */
export function heuteAusLaeufen(root, models, runsRel = '06-suche/agent-runs', now = new Date()) {
  const base = join(root, runsRel);
  const tag = now.toISOString().slice(0, 10).replace(/-/g, '');
  const out = {};
  if (!existsSync(base)) return out;
  for (const agent of readdirSync(base)) {
    const d = join(base, agent);
    let files; try { files = readdirSync(d); } catch { continue; }
    for (const f of files.filter((x) => x.endsWith('.json') && x.slice(agent.length + 1, agent.length + 9) === tag)) {
      try {
        const r = JSON.parse(readFileSync(join(d, f), 'utf8'));
        const id = r.model?.id ?? '?';
        const o = (out[id] ??= { laeufe: 0, in: 0, out: 0, usd: 0 });
        o.laeufe++; o.in += r.usage?.in ?? 0; o.out += r.usage?.out ?? 0; o.usd += r.cost_usd ?? 0;
      } catch { /* kaputte Datei ignorieren */ }
    }
  }
  return out;
}

/** Stand für ein Modell als Datensatz; `lines` ist die Anzeige. */
export async function stand(spec, { root, env = process.env, fetchFn = fetch } = {}) {
  if (spec.provider === 'openai-compat') {
    try {
      const s = await openrouterStand(spec, env, fetchFn);
      if (!s) return { provider: spec.provider, kind: 'none', lines: ['kein Schlüssel gesetzt'] };
      const lines = [`verbraucht gesamt ${usd(s.usd_used)}`, s.usd_eingezahlt === 0 ? 'kein bezahltes Guthaben eingezahlt (nur :free-Modelle)' : `bezahltes Guthaben übrig ${usd(s.usd_left)}`];
      if (s.free_limit != null) lines.push(`kostenlose Anfragen heute: ${s.free_used}/${s.free_limit} (noch ${s.free_left})`);
      return { provider: spec.provider, kind: 'openrouter', ...s, lines };
    } catch (e) { return { provider: spec.provider, kind: 'error', lines: [`Abfrage fehlgeschlagen (${e.message})`] }; }
  }
  if (spec.provider === 'gemini' || spec.provider === 'anthropic' || spec.provider === 'vertex-claude') {
    const h = heuteAusLaeufen(root)[spec.id];
    const lines = [h ? `heute ${h.laeufe} Läufe, ${h.in} Token ein, ${h.out} aus, geschätzt ${usd(h.usd)}` : 'heute noch keine Läufe', 'Guthaben/Kontingent nicht abfragbar (Browser: aistudio.google.com/usage bzw. console.anthropic.com)'];
    return { provider: spec.provider, kind: 'local', heute: h ?? null, lines };
  }
  return { provider: spec.provider, kind: 'none', lines: ['–'] };
}

export function zeigeStand(label, id, s, log) {
  log(`[credits ${label}] ${id}: ${s.lines.join(' · ')}`);
}

/** Differenz für die Abschlusszeile. */
export function differenz(vor, nach) {
  if (vor?.kind === 'openrouter' && nach?.kind === 'openrouter') {
    const d = (a, b) => (a == null || b == null ? null : a - b);
    return { usd: d(nach.usd_used, vor.usd_used), freie_anfragen: d(nach.free_used, vor.free_used) };
  }
  return null;
}
