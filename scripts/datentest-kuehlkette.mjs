// Datentest zu `kuehlketten-steckbrief` (Farmacia-Runde 30.09.2026): Wie oft nennt die spanische Ficha técnica (CIMA) in 6.3/6.4
// eine zitierbare Temperatur UND Dauer für die Lagerung außerhalb des Kühlschranks? Nur lesend, offene API, ohne Schlüssel.
//   node scripts/datentest-kuehlkette.mjs [Produktname …]
// Muster sind bewusst eng (Temperatur und Dauer im selben Satzfenster): ein Treffer ist belastbar, ein Fehlen nicht (siehe Ergebnisnotiz).
const get = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(r.status); return r.text(); };
const dec = (s) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const section = async (nreg, s) => { try { const j = JSON.parse(await get(`https://cima.aemps.es/cima/rest/docSegmentado/contenido/1?nregistro=${nreg}&seccion=${s}`)); return dec((j[0]?.contenido ?? '').replace(/<[^>]+>/g, ' ')); } catch { return ''; } };
const names = process.argv.length > 2 ? process.argv.slice(2) : ['Lantus', 'Humira', 'Victoza', 'Enbrel', 'Ozempic', 'Tresiba', 'Stelara', 'Eylea', 'Insuman', 'NovoRapid', 'Trulicity', 'Mounjaro', 'Levemir', 'Cosentyx', 'Orencia', 'Fluenz', 'Gardasil', 'Skyrizi', 'Dupixent', 'Prolia'];
const rows = [];
for (const n of names) {
  const j = JSON.parse(await get(`https://cima.aemps.es/cima/rest/medicamentos?nombre=${encodeURIComponent(n)}&comerc=1&pagina=1`));
  const m = j.resultados?.[0]; if (!m) continue;
  const t64 = await section(m.nregistro, '6.4'), t63 = await section(m.nregistro, '6.3');
  const all = `${t64} ${t63}`;
  const cold = /nevera|refrigerad|2\s*[º°]?\s*C\s*(?:-|y|a)\s*8\s*[º°]?\s*C/i.test(all);
  // Klausel: Hinweis auf Lagerung außerhalb der Kühlung, mit Temperatur UND Dauer im Umkreis
  const hits = [...all.matchAll(/(fuera de (?:la )?nevera|fuera del frigor[ií]fico|sin refrigerar|temperatura ambiente|temperatura m[aá]xima|no (?:superior|exceda)[^.]{0,30}(?:25|30)\s*[º°]\s*C|por debajo de (?:25|30)\s*[º°]\s*C)/gi)];
  let best = '';
  for (const h of hits) { const w = all.slice(Math.max(0, h.index - 80), h.index + 200); if (/\d+\s*[º°]\s*C/.test(w) && /\d+\s*(d[ií]as?|horas?|semanas?|meses|minutos)/i.test(w)) { best = w; break; } }
  rows.push({ n, cold, clause: hits.length > 0, citable: !!best, sample: best.replace(/\s+/g, ' ').slice(0, 170) });
}
for (const r of rows) console.log(`${r.cold ? '❄' : ' '} ${r.n.padEnd(10)} Klausel:${r.clause ? 'ja ' : 'nein'} zitierbar(Temp+Dauer):${r.citable ? 'ja' : 'nein'}  ${r.sample}`);
const c = rows.filter((x) => x.cold);
console.log(`\nKühlware ${c.length} von ${rows.length}; mit Klausel ${c.filter((x) => x.clause).length}; mit zitierbarer Temperatur und Dauer ${c.filter((x) => x.citable).length}`);
