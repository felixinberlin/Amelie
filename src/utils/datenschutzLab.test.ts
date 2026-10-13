// Datenschutz-Wächter für Lab-Belege. Lizenz: CC0 1.0 Public Domain.
//
// Anlass 13.10.2026: Lab-Läufe (Agent Mark) trugen in ihrer Absicht den vollen
// Namen, den Wohnort und Lebensumstände von Félix. Über public/data/lab-runs/
// waren sie öffentlich. Auf seinen Wunsch geschwärzt. Kommt ein neuer Lab-Lauf
// mit derselben Profilzeile, schlägt dieser Test an: dann vor dem Import
// schwärzen (Wohnort als „Brandenburg“, Name als „Gründer“).
//
// Geprüfte Werte stehen nur als SHA-256-Präfixe hier, damit der Test sie nicht
// selbst veröffentlicht. Mail-Signaturen versendeter Post (deliveries.ts) sind
// bewusst nicht im Umfang.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const VERBOTEN = new Set(['325a769b558828f7', 'bb350a3d330b5b3a']);
// Wohnort-Formulierungen, in denen der Ort als Ausgangspunkt einer Person steht
const WOHNORT = [/\bvon\s+jamlitz\b/i, /jamlitz,\s*brandenburg/i, /kein führerschein\)/i];

function dateien(): string[] {
  const out: string[] = [];
  for (const dir of ['06-suche/proposals', '06-suche/lab-processing']) {
    const abs = resolve(ROOT, dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) if (/\.(json|md)$/.test(f)) out.push(join(dir, f));
  }
  for (const f of ['docs/lab-inbox-inventory.md', '06-suche/lab-intake-review-20261011.md']) if (existsSync(resolve(ROOT, f))) out.push(f);
  return out;
}

describe('Datenschutz: Lab-Belege ohne Name und Wohnort', () => {
  const liste = dateien();

  it('findet Lab-Belege zum Prüfen', () => {
    expect(liste.length).toBeGreaterThan(20);
  });

  it('kein Nachname in Lab-Belegen', () => {
    const treffer: string[] = [];
    for (const f of liste) {
      const text = readFileSync(resolve(ROOT, f), 'utf8').toLowerCase();
      for (const t of new Set(text.match(/[a-zà-ÿ]+/g) ?? [])) {
        if (VERBOTEN.has(createHash('sha256').update(t).digest('hex').slice(0, 16))) treffer.push(f);
      }
    }
    expect(treffer).toEqual([]);
  });

  it('kein Wohnort als Ausgangspunkt einer Person', () => {
    const treffer = liste.filter((f) => WOHNORT.some((re) => re.test(readFileSync(resolve(ROOT, f), 'utf8'))));
    expect(treffer).toEqual([]);
  });
});
