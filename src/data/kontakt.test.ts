import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { AMELIE_EMAIL, MAILTO_MAX, amelieMailto } from './kontakt';

describe('Kontakt', () => {
  it('mailto geht an die Amélie-Adresse und trägt Betreff und Text', () => {
    const u = amelieMailto('Idee: Test', 'Zeile 1\nZeile 2');
    expect(u.startsWith(`mailto:${AMELIE_EMAIL}?subject=`)).toBe(true);
    expect(decodeURIComponent(u.split('&body=')[1])).toBe('Zeile 1\nZeile 2');
  });

  it('langer Text wird gekürzt und markiert (Gegenprobe: kurzer bleibt ganz)', () => {
    const u = amelieMailto('Dose', 'Wort '.repeat(2000));
    expect(u.length).toBeLessThanOrEqual(MAILTO_MAX);
    expect(decodeURIComponent(u)).toContain('[… gekürzt]');
    expect(decodeURIComponent(amelieMailto('x', 'kurz'))).not.toContain('gekürzt');
  });

  it('keine Komponente nutzt eine andere Amélie-Adresse', () => {
    const falsch: string[] = [];
    const lauf = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) lauf(p);
        else if (/\.(tsx?|html)$/.test(n) && /amelie[a-z]*\.(org|de|com)/i.test(readFileSync(p, 'utf8'))) {
          for (const m of readFileSync(p, 'utf8').matchAll(/[\w.+-]+@[\w-]*amelie[\w-]*\.(?:org|de|com)/gi)) if (m[0] !== AMELIE_EMAIL) falsch.push(`${p}: ${m[0]}`);
        }
      }
    };
    lauf(resolve(__dirname, '..'));
    expect(falsch).toEqual([]);
  });
});
