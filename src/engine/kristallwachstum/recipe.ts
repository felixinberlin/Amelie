/**
 * Recipe token for Kristallwachstum 3D.
 *
 * Format: K3D1-<seed>-A<δ·1000>-U<ΔT·100>-S<stickiness·100>-G<grid>-<C|H>-T<ticks>
 * The seed may contain letters, digits and dashes; the parameter blocks are
 * parsed from the end. Loading a recipe resets the engine and replays the
 * ticks, which reproduces the crystal exactly (seeded PRNG, fixed tick unit).
 */

export interface Recipe {
  seed: string;
  anisotropy: number;
  undercooling: number;
  stickiness: number;
  gridSize: number;
  symmetry: 'cubic' | 'hexagonal';
  ticks: number;
}

export function formatRecipe(r: Recipe): string {
  return [
    'K3D1',
    r.seed,
    `A${Math.round(r.anisotropy * 1000)}`,
    `U${Math.round(r.undercooling * 100)}`,
    `S${Math.round(r.stickiness * 100)}`,
    `G${r.gridSize}`,
    r.symmetry === 'cubic' ? 'C' : 'H',
    `T${r.ticks}`,
  ].join('-');
}

export function parseRecipe(token: string): Recipe | null {
  const parts = token.trim().split('-');
  if (parts.length < 8 || parts[0] !== 'K3D1') return null;
  const tail = parts.slice(-6);
  const seed = parts.slice(1, -6).join('-');
  const [a, u, s, g, sym, t] = tail;
  const num = (p: string, prefix: string) => (p.startsWith(prefix) && /^\d+$/.test(p.slice(1)) ? Number(p.slice(1)) : NaN);
  const A = num(a, 'A');
  const U = num(u, 'U');
  const S = num(s, 'S');
  const G = num(g, 'G');
  const T = num(t, 'T');
  if ([A, U, S, G, T].some((x) => Number.isNaN(x)) || (sym !== 'C' && sym !== 'H') || !seed) return null;
  if (![32, 40, 48, 64].includes(G) || A > 100 || U > 100 || S > 100 || T > 5000) return null;
  return {
    seed,
    anisotropy: A / 1000,
    undercooling: U / 100,
    stickiness: S / 100,
    gridSize: G,
    symmetry: sym === 'C' ? 'cubic' : 'hexagonal',
    ticks: T,
  };
}
