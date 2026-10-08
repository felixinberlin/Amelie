import { describe, it, expect } from 'vitest';
import {
  HOF_LEVELS,
  affectedCells,
  press,
  litBoard,
  startBoard,
  isSolved,
  solve,
  hint,
  warmth,
  litCount,
} from './hofLichterEngine';

describe('Lichter im Hof', () => {
  it('schaltet ein Eckfenster mit zwei Nachbarn, ein mittleres mit vier', () => {
    expect(affectedCells(3, 3, 0).sort()).toEqual([0, 1, 3]);
    expect(affectedCells(3, 3, 4).sort()).toEqual([1, 3, 4, 5, 7]);
  });

  it('zweimal drücken hebt sich auf', () => {
    const b = litBoard(3, 3);
    expect(press(press(b, 3, 3, 4), 3, 3, 4)).toEqual(b);
  });

  it('jede Stufe beginnt unfertig und ist mit ihrer Erzeugerfolge lösbar', () => {
    for (const l of HOF_LEVELS) {
      const start = startBoard(l);
      expect(isSolved(start), `Stufe ${l.id} startet schon fertig`).toBe(false);
      const done = l.scramble.reduce((b, i) => press(b, l.rows, l.cols, i), start);
      expect(isSolved(done), `Stufe ${l.id}`).toBe(true);
    }
  });

  it('solve findet eine gültige Lösung, die nicht länger als par ist', () => {
    for (const l of HOF_LEVELS) {
      const s = solve(startBoard(l), l.rows, l.cols);
      expect(s, `Stufe ${l.id}`).not.toBeNull();
      const after = s!.reduce((b, i) => press(b, l.rows, l.cols, i), startBoard(l));
      expect(isSolved(after)).toBe(true);
      expect(s!.length).toBeLessThanOrEqual(l.scramble.length);
    }
  });

  it('Hinweise führen Zug für Zug zum Ziel', () => {
    const l = HOF_LEVELS[2];
    let b = startBoard(l);
    for (let i = 0; i < 30 && !isSolved(b); i++) {
      const h = hint(b, l.rows, l.cols);
      expect(h).not.toBeNull();
      b = press(b, l.rows, l.cols, h!);
    }
    expect(isSolved(b)).toBe(true);
    expect(hint(b, l.rows, l.cols)).toBeNull();
  });

  it('zählt leuchtende Fenster und vergibt Wärme nach Zügen', () => {
    expect(litCount(startBoard(HOF_LEVELS[0]))).toBeLessThan(9);
    expect(warmth(2, 2)).toBe(3);
    expect(warmth(4, 2)).toBe(2);
    expect(warmth(9, 2)).toBe(1);
  });
});
