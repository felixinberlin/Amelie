/**
 * Seeded pseudo-random numbers for Kristallwachstum 3D.
 *
 * The recipe token promises that the same seed reproduces the same crystal.
 * That only holds if every random decision comes from a seeded generator,
 * never from Math.random(). mulberry32 is small, fast and good enough for
 * random walks; it is not cryptographic.
 */

/** FNV-1a 32-bit hash of a string → unsigned 32-bit seed. */
export function hashSeed(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: returns a function yielding floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convenience: generator from a seed string. */
export function rngFromSeed(seed: string): () => number {
  return mulberry32(hashSeed(seed));
}
