/**
 * EAN-13 as a row of 95 modules ('1' = bar, '0' = space), so the simulator can
 * draw the barcode that is printed on the real container.
 *
 * License: CC0-1.0 / AGPL-3.0
 */
import { isValidGtin } from './chemHazardEngine';

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
const PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

/** Returns the 95 modules, or null when the input is not a valid EAN-13. */
export function ean13Modules(gtin: string): string | null {
  if (!/^\d{13}$/.test(gtin) || !isValidGtin(gtin)) return null;
  const d = gtin.split('').map(Number);
  const parity = PARITY[d[0]];
  let out = '101';
  for (let i = 1; i <= 6; i++) out += (parity[i - 1] === 'L' ? L : G)[d[i]];
  out += '01010';
  for (let i = 7; i <= 12; i++) out += R[d[i]];
  return out + '101';
}

/** Reads the digits back from 95 modules. Used by the tests as a counter-check. */
export function decodeEan13Modules(modules: string): string | null {
  if (!/^[01]{95}$/.test(modules) || !modules.startsWith('101') || !modules.endsWith('101') || modules.slice(45, 50) !== '01010') return null;
  let parity = '';
  let digits = '';
  for (let i = 0; i < 6; i++) {
    const chunk = modules.slice(3 + i * 7, 10 + i * 7);
    const l = L.indexOf(chunk);
    const g = G.indexOf(chunk);
    if (l < 0 && g < 0) return null;
    parity += l >= 0 ? 'L' : 'G';
    digits += l >= 0 ? l : g;
  }
  const first = PARITY.indexOf(parity);
  if (first < 0) return null;
  for (let i = 0; i < 6; i++) {
    const r = R.indexOf(modules.slice(50 + i * 7, 57 + i * 7));
    if (r < 0) return null;
    digits += r;
  }
  const gtin = `${first}${digits}`;
  return isValidGtin(gtin) ? gtin : null;
}
