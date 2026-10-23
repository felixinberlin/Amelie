import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { zipStore, crc32 } from './zipStore';
import { build3MF, buildBinarySTL, buildModelXml } from './export3mf';
import { analyzePrintability } from './printability';
import { extractIsosurface, IndexedMesh } from './isosurface';

/** Tiny ZIP reader for tests: walks the central directory. */
function readZip(buf: Uint8Array): Map<string, Uint8Array> {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const endOff = buf.length - 22;
  expect(dv.getUint32(endOff, true)).toBe(0x06054b50);
  const count = dv.getUint16(endOff + 10, true);
  let p = dv.getUint32(endOff + 16, true);
  const dec = new TextDecoder();
  const out = new Map<string, Uint8Array>();
  for (let k = 0; k < count; k++) {
    expect(dv.getUint32(p, true)).toBe(0x02014b50);
    const crc = dv.getUint32(p + 16, true);
    const size = dv.getUint32(p + 24, true);
    const nameLen = dv.getUint16(p + 28, true);
    const local = dv.getUint32(p + 42, true);
    const name = dec.decode(buf.subarray(p + 46, p + 46 + nameLen));
    expect(dv.getUint32(local, true)).toBe(0x04034b50);
    const lNameLen = dv.getUint16(local + 26, true);
    const data = buf.subarray(local + 30 + lNameLen, local + 30 + lNameLen + size);
    expect(crc32(data)).toBe(crc);
    out.set(name, data);
    p += 46 + nameLen;
  }
  return out;
}

const cube = (): IndexedMesh => {
  const g = 8;
  const f = new Float32Array(g ** 3);
  for (let z = 2; z < 6; z++) for (let y = 2; y < 6; y++) for (let x = 2; x < 6; x++) f[x + g * (y + g * z)] = 1;
  return extractIsosurface(f, g, { voxelSize: 1 });
};

describe('zipStore', () => {
  it('round-trips names, sizes, CRC and data', () => {
    const enc = new TextEncoder();
    const files = [
      { name: 'a.txt', data: enc.encode('hello') },
      { name: 'dir/ü.bin', data: new Uint8Array([0, 1, 2, 255]) },
      { name: 'empty', data: new Uint8Array(0) },
    ];
    const z = readZip(zipStore(files));
    expect([...z.keys()]).toEqual(files.map((f) => f.name));
    for (const f of files) expect(Array.from(z.get(f.name)!)).toEqual(Array.from(f.data));
  });

  it('is deterministic and uses the standard CRC-32', () => {
    const files = [{ name: 'x', data: new TextEncoder().encode('123456789') }];
    expect(crc32(files[0].data)).toBe(0xcbf43926);
    expect(Array.from(zipStore(files))).toEqual(Array.from(zipStore(files)));
  });
});

describe('3MF export', () => {
  it('contains the three OPC parts with correct namespace and counts', () => {
    const mesh = cube();
    const nTri = mesh.indices.length / 3;
    const palette = [
      { name: 'Kern', color: '#ff0000' },
      { name: 'Rand', color: '#00ff00' },
    ];
    const mat = new Uint8Array(nTri).map((_, i) => i % 2);
    const zip = readZip(build3MF(mesh, { palette, triangleMaterial: mat, title: 'Test & <Kristall>' }));
    expect(zip.has('[Content_Types].xml')).toBe(true);
    expect(zip.has('_rels/.rels')).toBe(true);
    const xml = new TextDecoder().decode(zip.get('3D/3dmodel.model')!);
    const doc = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
    expect(doc.getElementsByTagName('parsererror').length).toBe(0);
    const model = doc.documentElement;
    expect(model.getAttribute('xmlns')).toBe('http://schemas.microsoft.com/3dmanufacturing/core/2015/02');
    expect(model.getAttribute('unit')).toBe('millimeter');
    expect(doc.getElementsByTagName('vertex').length).toBe(mesh.positions.length / 3);
    expect(doc.getElementsByTagName('triangle').length).toBe(nTri);
    expect(doc.getElementsByTagName('base').length).toBe(palette.length);
    for (const t of Array.from(doc.getElementsByTagName('triangle'))) {
      const p1 = Number(t.getAttribute('p1'));
      expect(p1).toBeGreaterThanOrEqual(0);
      expect(p1).toBeLessThan(palette.length);
    }
    expect(xml).toContain('Test &amp; &lt;Kristall&gt;');
    const rels = new TextDecoder().decode(zip.get('_rels/.rels')!);
    expect(rels).toContain('Target="/3D/3dmodel.model"');
  });

  it('works without colours', () => {
    const xml = buildModelXml(cube());
    expect(xml).not.toContain('basematerials');
    expect(xml).toContain('<object id="2" type="model">');
  });

  it('rejects a material array of the wrong length', () => {
    expect(() => buildModelXml(cube(), { palette: [{ name: 'a', color: '#000000' }], triangleMaterial: new Uint8Array(1) })).toThrow();
  });

  it('binary STL has 84 + 50·n bytes and the triangle count in the header', () => {
    const mesh = cube();
    const stl = buildBinarySTL(mesh);
    const n = mesh.indices.length / 3;
    expect(stl.length).toBe(84 + 50 * n);
    expect(new DataView(stl.buffer).getUint32(80, true)).toBe(n);
  });
});

describe('printability', () => {
  const quadMesh = (pts: number[][]): IndexedMesh => ({
    positions: new Float32Array(pts.flat()),
    indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
  });

  it('a flat downward face above the bed is an overhang, a vertical wall is not', () => {
    // put a bed-contact point lower so the ceiling is not on the bed
    const ceiling: IndexedMesh = {
      positions: new Float32Array([0, 0, 5, 0, 1, 5, 1, 1, 5, 1, 0, 5, 0, 0, 0]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3]), // normal −Z (clockwise seen from above)
    };
    const r1 = analyzePrintability(ceiling, { voxelSize: 1 });
    expect(r1.overhangTriangles).toBe(2);
    expect(r1.overhangAreaFraction).toBeCloseTo(1, 5);

    const wall = quadMesh([[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]]);
    expect(analyzePrintability(wall, { voxelSize: 1 }).overhangTriangles).toBe(0);
  });

  it('the bottom face of a cube rests on the bed and is not counted', () => {
    const r = analyzePrintability(cube(), { voxelSize: 1, maxOverhangDeg: 45 });
    expect(r.overhangAreaFraction).toBeLessThan(0.2);
  });

  it('warns when the grid resolution is below the nozzle', () => {
    const r = analyzePrintability(cube(), { voxelSize: 0.2, nozzleMm: 0.4 });
    expect(r.belowNozzle).toBe(true);
    expect(r.warningsDe.length).toBeGreaterThan(0);
    expect(r.warningsEn.length).toBe(r.warningsDe.length);
  });
});
