// Modellvergleich: reine Auswertung der Engine-Berichte (kein Netz, kein Modellzugang nötig).
//
// Gemessen wird nur, was sich im Text und im Werkzeug-Protokoll nachprüfen lässt — kein Gesamtpunktestand:
//   Form         Tabelle, „Gelernt“, Quellenmeldung; wie viele Quellenmeldungs-Zeilen `bib quellen import` annehmen würde
//   Wiedergänger Kandidaten, die das Gedächtnis schon kennt; vor allem: als frei/verengt gemeldet, obwohl es ein Grab gibt
//   Evidenz      „[Seite]“ behauptet, aber die URL nie mit web_fetch geholt (nur prüfbar ohne native Suche)
//   Konvergenz   welcher Anteil der Kandidaten eines Modells taucht auch bei einem anderen Modell auf (Doppelfund)
//   Urteil       ein Richter (anderes Modell) ordnet die Vereinigung der Kandidaten ein: nutzbar vs. Ausschuss
//   Kosten       Tokens, Dollar (aus dem Preisfeld der Konfiguration), Zeit, Werkzeugaufrufe

import { norm, verdictOf, parseQuellenmeldung } from '../bibliothek-lib.mjs';

const splitRow = (line) => line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
const isSeparator = (line) => /^\|[\s:|-]+\|?\s*$/.test(line.trim());
const STOP = new Set(['der', 'die', 'das', 'und', 'für', 'mit', 'von', 'eine', 'einer', 'ein', 'den', 'dem', 'des', 'zur', 'zum', 'aus', 'bei', 'nach', 'the', 'and', 'for', 'with', 'app', 'tool', 'rechner']);

export const VERDICTS = ['frei', 'verengt', 'unklar', 'besetzt'];

// ---------------------------------------------------------------- Kandidatentabelle

/** Liest alle Tabellen mit Kopf „Idee/Kandidat … Urteil … Beleg“ und gibt die Zeilen strukturiert zurück. */
export function parseKandidaten(text) {
  const lines = String(text ?? '').split('\n');
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith('|') || isSeparator(lines[i])) continue;
    const head = splitRow(lines[i]);
    const idx = { idee: head.findIndex((c) => /idee|kandidat/i.test(c)), urteil: head.findIndex((c) => /urteil/i.test(c)), beleg: head.findIndex((c) => /beleg/i.test(c)) };
    if (idx.idee < 0 || idx.urteil < 0 || idx.beleg < 0) continue;
    for (i += 1; i < lines.length && lines[i].trim().startsWith('|'); i++) {
      if (isSeparator(lines[i])) continue;
      const cells = splitRow(lines[i]);
      if (cells.length <= Math.max(idx.idee, idx.urteil, idx.beleg)) continue;
      const name = cells[idx.idee];
      const beleg = cells[idx.beleg];
      const id = (/`([a-z0-9][a-z0-9-]+)`/.exec(name) ?? [])[1] ?? null;
      const title = name.replace(/[*`]/g, '').replace(/^\d+[.)]?\s+/, '').trim().slice(0, 90);
      rows.push({
        id,
        title,
        urteil: verdictOf(cells[idx.urteil]),
        urteilRoh: cells[idx.urteil],
        beleg,
        urls: [...new Set((beleg.match(/https?:\/\/[^\s|)\]>,;]+/g) ?? []).map((u) => u.replace(/[.,;:]+$/, '')))],
        seite: (beleg.match(/\[Seite\b/gi) ?? []).length,
        schnipsel: (beleg.match(/\[Schnipsel\b/gi) ?? []).length,
      });
    }
    i -= 1;
  }
  return rows;
}

/** Wortmenge eines Kandidaten (Id-Teile oder Titelwörter), Grundlage für Ähnlichkeit und Suche im Gedächtnis. */
export function keyTokens(row) {
  const src = row.id ? row.id.split('-') : norm(row.title).split(/[^a-z0-9]+/);
  return [...new Set(src.map(norm).filter((w) => w.length >= 4 && !STOP.has(w)))];
}

/** Zwei Kandidaten meinen dasselbe: gleiche Id, oder die Wortmengen überlappen stark (Jaccard ≥ 0,5, mindestens zwei gemeinsame Wörter). */
export function similar(a, b) {
  if (a.id && b.id && a.id === b.id) return true;
  const A = new Set(keyTokens(a));
  const B = new Set(keyTokens(b));
  const common = [...A].filter((w) => B.has(w)).length;
  if (common < 2) return false;
  return common / (A.size + B.size - common) >= 0.5;
}

// ---------------------------------------------------------------- Vorwissen im Gedächtnis

/** Sucht einen Kandidaten im Gedächtnis (`findFn` = bibliothek-lib.findAll mit fester Quellenliste). */
export function priorArt(row, findFn) {
  const terms = keyTokens(row).sort((x, y) => y.length - x.length).slice(0, 3);
  if (!terms.length) return { known: false, buried: false, packed: false, hits: 0 };
  const hits = findFn(terms).filter((h) => h.bindend);
  return { known: hits.length > 0, buried: hits.some((h) => h.kind === 'grab'), packed: hits.some((h) => h.kind === 'dose'), hits: hits.length, terms };
}

// ---------------------------------------------------------------- Kennzahlen je Lauf

const normUrl = (u) => { try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, '')).toLowerCase(); } catch { return String(u).toLowerCase(); } };

/**
 * Kennzahlen eines einzelnen Berichts.
 * run = { text, toolLog, nativeSearch, usage, ms, error, stop }; ctx = { quellenCtx (für parseQuellenmeldung), findFn }
 */
export function scoreRun(run, ctx) {
  const text = run.text ?? '';
  const rows = parseKandidaten(text);
  const fetched = new Set((run.toolLog ?? []).filter((c) => c.name === 'web_fetch').map((c) => normUrl(c.args?.url ?? '')));
  const meldung = ctx.quellenCtx ? parseQuellenmeldung(text, ctx.quellenCtx) : { eintraege: [], fehler: [] };
  const badLines = new Set(meldung.fehler.map((f) => /^Zeile (\d+)/.exec(f)?.[1]).filter(Boolean));
  const verdicts = Object.fromEntries(VERDICTS.map((v) => [v, 0]));
  let known = 0, buried = 0, packed = 0, freiTrotzGrab = 0, seite = 0, seiteUngedeckt = 0, freiOhneSeite = 0;
  const details = rows.map((r) => {
    const pa = priorArt(r, ctx.findFn);
    if (r.urteil) verdicts[r.urteil]++;
    if (pa.known) known++;
    if (pa.buried) buried++;
    if (pa.packed) packed++;
    const meldetFrei = r.urteil === 'frei' || r.urteil === 'verengt';
    if (meldetFrei && pa.buried) freiTrotzGrab++;
    if (meldetFrei && r.seite === 0) freiOhneSeite++;
    let ungedeckt = null;
    if (r.seite > 0) {
      seite++;
      if (!run.nativeSearch) {
        ungedeckt = !r.urls.some((u) => fetched.has(normUrl(u)));
        if (ungedeckt) seiteUngedeckt++;
      }
    }
    return { id: r.id, title: r.title, urteil: r.urteil, seite: r.seite, schnipsel: r.schnipsel, urls: r.urls.length, ...pa, seiteUngedeckt: ungedeckt };
  });
  const quellenGesamt = meldung.eintraege.length;
  return {
    ok: !run.error && rows.length > 0,
    error: run.error ?? null,
    stop: run.stop ?? null,
    form: {
      kandidatenTabelle: rows.length > 0,
      gelernt: /gelernt/i.test(text),
      quellenmeldung: /quellenmeldung/i.test(text) && quellenGesamt > 0,
    },
    quellen: { zeilen: quellenGesamt, gueltig: quellenGesamt - badLines.size, fehlerhaft: badLines.size, blockFehler: meldung.eintraege.length === 0 && /quellenmeldung/i.test(text) ? meldung.fehler.length : 0 },
    kandidaten: { n: rows.length, verdicts, ohneUrteil: rows.length - Object.values(verdicts).reduce((a, b) => a + b, 0) },
    vorwissen: { bekannt: known, begraben: buried, gepackt: packed, freiTrotzGrab },
    evidenz: { seite, seiteUngedeckt: run.nativeSearch ? null : seiteUngedeckt, freiOhneSeite, pruefbar: !run.nativeSearch },
    nutzung: { in: run.usage?.in ?? 0, out: run.usage?.out ?? 0, turns: run.usage?.turns ?? 0, ms: run.ms ?? 0, werkzeugaufrufe: (run.toolLog ?? []).length, fetches: fetched.size },
    details,
  };
}

/** Dollar aus Tokens; price = {in, out} je Million Token, sonst null. */
export function costOf(usage, price) {
  if (!price || price.in == null || price.out == null) return null;
  return ((usage.in ?? 0) * price.in + (usage.out ?? 0) * price.out) / 1e6;
}

// ---------------------------------------------------------------- Vereinigung, Konvergenz, Richter

/** Gruppiert die Kandidaten aller Modelle zu Clustern (dieselbe Idee in anderem Kleid = ein Cluster). */
export function clusterKandidaten(perModel) {
  const clusters = [];
  for (const [model, rows] of Object.entries(perModel)) {
    for (const row of rows) {
      const c = clusters.find((x) => x.members.some((m) => similar(m.row, row)));
      if (c) c.members.push({ model, row });
      else clusters.push({ n: clusters.length + 1, members: [{ model, row }] });
    }
  }
  return clusters.map((c, i) => ({ ...c, n: i + 1, models: [...new Set(c.members.map((m) => m.model))], title: c.members[0].row.title, id: c.members[0].row.id }));
}

/** Anteil der Kandidaten je Modell, die auch bei mindestens einem anderen Modell vorkommen. */
export function konvergenz(clusters, models) {
  const out = {};
  for (const m of models) {
    const own = clusters.filter((c) => c.models.includes(m));
    out[m] = own.length ? own.filter((c) => c.models.length > 1).length / own.length : null;
  }
  return out;
}

/** Paarweise Überschneidung: gemeinsame Cluster / kleinere Kandidatenzahl. */
export function ueberschneidung(clusters, models) {
  const m = {};
  for (const a of models) {
    m[a] = {};
    for (const b of models) {
      const A = clusters.filter((c) => c.models.includes(a));
      const B = clusters.filter((c) => c.models.includes(b));
      const both = A.filter((c) => c.models.includes(b)).length;
      m[a][b] = Math.min(A.length, B.length) ? both / Math.min(A.length, B.length) : null;
    }
  }
  return m;
}

export const JUDGE_VERDICTS = ['dose_ready', 'needs_research', 'friedhof', 'besetzt'];

/** Nummerierte Liste für den Richter (kurz gehalten: Titel, gemeldetes Urteil, gekürzter Beleg). */
export function judgeList(clusters) {
  return clusters.map((c) => {
    const r = c.members[0].row;
    return `C${c.n}: ${r.title}${r.id ? ` (${r.id})` : ''} — gemeldet: ${r.urteil ?? '?'} — Beleg: ${r.beleg.replace(/\s+/g, ' ').slice(0, 260)}`;
  }).join('\n');
}

/** Holt das JSON-Array aus der Richter-Antwort (Codeblock oder roh) und normalisiert die Urteile. */
export function parseJudge(text) {
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(text ?? '');
  const raw = (fence ? fence[1] : text ?? '');
  const start = raw.indexOf('[');
  const end = raw.lastIndexOf(']');
  if (start < 0 || end < start) return [];
  let arr;
  try { arr = JSON.parse(raw.slice(start, end + 1)); } catch { return []; }
  const map = { dose_ready: 'dose_ready', needs_research: 'needs_research', friedhof: 'friedhof', besetzt: 'besetzt' };
  return arr.map((x) => ({ n: Number(String(x.n ?? x.id ?? '').replace(/\D/g, '')), verdict: map[String(x.verdict ?? '').toLowerCase().replace(/[-\s]+/g, '_')] ?? null, reason: String(x.reason ?? '').slice(0, 200) }))
    .filter((x) => Number.isInteger(x.n) && x.n > 0 && x.verdict);
}

/** Urteil des Richters je Modell: nutzbar (dose_ready + needs_research) und Ausschuss (friedhof + besetzt). */
export function judgeShare(clusters, judged, models) {
  const byN = new Map(judged.map((j) => [j.n, j.verdict]));
  const out = {};
  for (const m of models) {
    const own = clusters.filter((c) => c.models.includes(m) && byN.has(c.n));
    const cnt = Object.fromEntries(JUDGE_VERDICTS.map((v) => [v, 0]));
    for (const c of own) cnt[byN.get(c.n)]++;
    out[m] = { beurteilt: own.length, ...cnt, nutzbar: own.length ? (cnt.dose_ready + cnt.needs_research) / own.length : null, ausschuss: own.length ? (cnt.friedhof + cnt.besetzt) / own.length : null };
  }
  return out;
}

// ---------------------------------------------------------------- Aggregation und Bericht

const sum = (xs) => xs.reduce((a, b) => a + (b ?? 0), 0);
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)} %` : '–');
const money = (x) => (x == null ? 'n/a' : `$${x.toFixed(2)}`);

/** Fasst alle Läufe eines Modells (Engines × Wiederholungen) zusammen. */
export function aggregateModel(scores, price) {
  const ok = scores.filter((s) => s.ok);
  const total = (f) => sum(scores.map(f));
  const usage = { in: total((s) => s.nutzung.in), out: total((s) => s.nutzung.out) };
  return {
    laeufe: scores.length,
    laeufeOk: ok.length,
    fehler: scores.filter((s) => s.error).map((s) => s.error),
    formVollstaendig: scores.filter((s) => s.form.kandidatenTabelle && s.form.gelernt && s.form.quellenmeldung).length,
    quellen: { zeilen: total((s) => s.quellen.zeilen), gueltig: total((s) => s.quellen.gueltig) },
    kandidaten: total((s) => s.kandidaten.n),
    verdicts: Object.fromEntries(VERDICTS.map((v) => [v, total((s) => s.kandidaten.verdicts[v])])),
    vorwissen: { bekannt: total((s) => s.vorwissen.bekannt), begraben: total((s) => s.vorwissen.begraben), freiTrotzGrab: total((s) => s.vorwissen.freiTrotzGrab) },
    evidenz: { seite: total((s) => s.evidenz.seite), seiteUngedeckt: scores.every((s) => s.evidenz.pruefbar) ? total((s) => s.evidenz.seiteUngedeckt) : null, freiOhneSeite: total((s) => s.evidenz.freiOhneSeite) },
    nutzung: { ...usage, ms: total((s) => s.nutzung.ms), werkzeugaufrufe: total((s) => s.nutzung.werkzeugaufrufe), fetches: total((s) => s.nutzung.fetches) },
    kosten: costOf(usage, price),
  };
}

/** Markdown-Bericht: eine Tabelle je Frage, ohne Gesamtnote, mit Lesehilfe. */
export function renderReport({ meta, models, agg, konv, judge }) {
  const ids = models.map((m) => m.id);
  const head = (cols) => `| ${cols.join(' | ')} |\n|${cols.map(() => '---').join('|')}|`;
  const row = (label, f) => `| ${label} | ${ids.map((id) => f(agg[id], id)).join(' | ')} |`;
  const t = (title, rows) => `\n### ${title}\n\n${head(['', ...ids])}\n${rows.join('\n')}\n`;
  const lines = [];
  lines.push(`# Modellvergleich — ${meta.thema}`);
  lines.push(`\nLauf \`${meta.runId}\` · ${meta.datum} · Engines: ${meta.engines.join(', ')} · Wiederholungen: ${meta.repeats} · Suche: ${meta.search}${meta.judge ? ` · Richter: ${meta.judge}` : ''}`);
  lines.push(`\nModelle: ${models.map((m) => `**${m.id}** (${m.provider}, \`${m.model}\`)`).join(' · ')}`);
  lines.push(t('Läuft es überhaupt, und hält es die Form?', [
    row('Läufe ohne Fehler', (a) => `${a.laeufeOk}/${a.laeufe}`),
    row('Bericht vollständig (Tabelle, Gelernt, Quellenmeldung)', (a) => `${a.formVollstaendig}/${a.laeufe}`),
    row('Quellenmeldungs-Zeilen, die der Import annähme', (a) => `${a.quellen.gueltig}/${a.quellen.zeilen} (${pct(a.quellen.gueltig, a.quellen.zeilen)})`),
  ]));
  lines.push(t('Was kommt heraus?', [
    row('Kandidaten', (a) => String(a.kandidaten)),
    row('frei / verengt / unklar / besetzt', (a) => VERDICTS.map((v) => a.verdicts[v]).join(' / ')),
    row('Doppelfund-Quote (auch bei anderem Modell)', (a, id) => (konv[id] == null ? '–' : `${Math.round(100 * konv[id])} %`)),
  ]));
  lines.push(t('Wie ehrlich ist es?', [
    row('Kandidat war dem Gedächtnis schon bekannt', (a) => `${a.vorwissen.bekannt}/${a.kandidaten} (${pct(a.vorwissen.bekannt, a.kandidaten)})`),
    row('**als frei/verengt gemeldet, obwohl begraben**', (a) => `**${a.vorwissen.freiTrotzGrab}**`),
    row('„[Seite]“ behauptet', (a) => String(a.evidenz.seite)),
    row('davon ohne geholte URL (nur ohne native Suche prüfbar)', (a) => (a.evidenz.seiteUngedeckt == null ? 'n/a (native Suche)' : String(a.evidenz.seiteUngedeckt))),
    row('frei/verengt ohne jede [Seite]', (a) => String(a.evidenz.freiOhneSeite)),
  ]));
  if (judge) {
    lines.push(t(`Urteil des Richters (${meta.judge})`, [
      row('beurteilte Kandidaten', (a, id) => String(judge[id]?.beurteilt ?? 0)),
      row('nutzbar (Dose Ready + Needs Research)', (a, id) => (judge[id]?.nutzbar == null ? '–' : `${Math.round(100 * judge[id].nutzbar)} %`)),
      row('Ausschuss (Friedhof + besetzt)', (a, id) => (judge[id]?.ausschuss == null ? '–' : `${Math.round(100 * judge[id].ausschuss)} %`)),
    ]));
  }
  lines.push(t('Was kostet es?', [
    row('Tokens ein / aus', (a) => `${a.nutzung.in.toLocaleString('de-DE')} / ${a.nutzung.out.toLocaleString('de-DE')}`),
    row('Kosten (Preisfeld der Konfiguration)', (a) => money(a.kosten)),
    row('Zeit', (a) => `${Math.round(a.nutzung.ms / 1000)} s`),
    row('Werkzeugaufrufe / geholte Seiten', (a) => `${a.nutzung.werkzeugaufrufe} / ${a.nutzung.fetches}`),
  ]));
  lines.push('\n### Lesehilfe\n');
  lines.push('- **Fett gedruckt ist die Zeile, die zählt:** ein Modell, das etwas als frei meldet, das schon begraben ist, hätte einen Wiedergänger in die Dosen getragen. Null ist das Ziel.');
  lines.push('- „Bekannt“ ist nicht schlecht, wenn das Modell es selbst als besetzt meldet. Schlecht ist bekannt **und** frei.');
  lines.push('- „[Seite] ohne geholte URL“ heißt: das Modell behauptet, eine Seite gelesen zu haben, ohne `web_fetch` aufgerufen zu haben. Das ist die messbare Form von erfundener Evidenz.');
  lines.push('- Eine hohe Doppelfund-Quote über **verschiedene Modellfamilien** ist ein stärkeres Signal als über dieselbe Familie; über Familien mit geringem Überschneidungsgrad ist ein Treffer selten Zufall.');
  lines.push('- Der Richter ist ein einzelnes Modell und kann sich irren. Er ist am aussagekräftigsten, wenn er aus einer **anderen Familie** kommt als die Modelle, die er beurteilt.');
  lines.push(`- Stichprobe: ${meta.engines.length} Engines × ${meta.repeats} Wiederholung(en) × 1 Thema. Das reicht für „läuft es, und hält es die Form“, nicht für feine Rangfolgen. Mit \`--repeats 3\` und einem zweiten Thema wird es belastbarer.`);
  if (meta.search === 'native') lines.push('- Suche `native`: jedes Modell nutzt seine eigene Websuche. Werkzeug-Parität und die Prüfung von „[Seite]“ entfallen; verglichen wird der ganze Stapel, nicht das Modell allein.');
  return lines.join('\n') + '\n';
}
