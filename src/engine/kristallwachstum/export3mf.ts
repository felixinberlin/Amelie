/**
 * 3MF and binary STL export (Ticket 02, Task 2 + 3).
 *
 * 3MF layout per 3MF Core Specification: [Content_Types].xml, _rels/.rels,
 * 3D/3dmodel.model. Colours use core <basematerials> with per-triangle
 * pid/p1, which needs no extension. Slicer behaviour (PrusaSlicer, Bambu
 * Studio, OrcaSlicer) has not been verified here; see Ticket 02.
 */

import { IndexedMesh, triangleNormals } from './isosurface';
import { zipStore } from './zipStore';

export interface PaletteEntry {
  name: string;
  color: string; // #RRGGBB
}

export interface ThreeMFOptions {
  triangleMaterial?: Uint8Array;
  palette?: PaletteEntry[];
  title?: string;
  metadata?: Record<string, string>;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const num = (v: number) => {
  const r = Math.round(v * 10000) / 10000;
  return Object.is(r, -0) ? '0' : String(r);
};

export function buildModelXml(mesh: IndexedMesh, opts: ThreeMFOptions = {}): string {
  const { positions: P, indices: I } = mesh;
  const palette = opts.palette ?? [];
  const mat = opts.triangleMaterial;
  const useMat = palette.length > 0 && mat !== undefined;
  if (useMat && mat!.length !== I.length / 3) {
    throw new Error('triangleMaterial must have one entry per triangle');
  }
  const parts: string[] = [];
  parts.push('<?xml version="1.0" encoding="UTF-8"?>');
  parts.push('<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">');
  const meta: Record<string, string> = {
    Title: opts.title ?? 'Kristallwachstum 3D',
    Designer: 'Kristallwachstum 3D (CC0)',
    LicenseTerms: 'CC0 1.0 Public Domain',
    ...(opts.metadata ?? {}),
  };
  for (const [k, v] of Object.entries(meta)) parts.push(` <metadata name="${esc(k)}">${esc(v)}</metadata>`);
  parts.push(' <resources>');
  if (useMat) {
    parts.push('  <basematerials id="1">');
    for (const p of palette) {
      const hex = p.color.replace('#', '').toUpperCase();
      parts.push(`   <base name="${esc(p.name)}" displaycolor="#${hex}FF"/>`);
    }
    parts.push('  </basematerials>');
  }
  parts.push(useMat ? '  <object id="2" type="model" pid="1" pindex="0">' : '  <object id="2" type="model">');
  parts.push('   <mesh>');
  parts.push('    <vertices>');
  for (let v = 0; v < P.length; v += 3) {
    parts.push(`     <vertex x="${num(P[v])}" y="${num(P[v + 1])}" z="${num(P[v + 2])}"/>`);
  }
  parts.push('    </vertices>');
  parts.push('    <triangles>');
  for (let t = 0; t < I.length; t += 3) {
    const m = useMat ? ` pid="1" p1="${Math.min(palette.length - 1, mat![t / 3])}"` : '';
    parts.push(`     <triangle v1="${I[t]}" v2="${I[t + 1]}" v3="${I[t + 2]}"${m}/>`);
  }
  parts.push('    </triangles>');
  parts.push('   </mesh>');
  parts.push('  </object>');
  parts.push(' </resources>');
  parts.push(' <build>');
  parts.push('  <item objectid="2"/>');
  parts.push(' </build>');
  parts.push('</model>');
  return parts.join('\n');
}

export function build3MF(mesh: IndexedMesh, opts: ThreeMFOptions = {}): Uint8Array {
  const enc = new TextEncoder();
  const contentTypes =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\n' +
    ' <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\n' +
    ' <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>\n' +
    '</Types>';
  const rels =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n' +
    ' <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>\n' +
    '</Relationships>';
  return zipStore([
    { name: '[Content_Types].xml', data: enc.encode(contentTypes) },
    { name: '_rels/.rels', data: enc.encode(rels) },
    { name: '3D/3dmodel.model', data: enc.encode(buildModelXml(mesh, opts)) },
  ]);
}

export function buildBinarySTL(mesh: IndexedMesh, name = 'Kristallwachstum3D'): Uint8Array {
  const { positions: P, indices: I } = mesh;
  const nTri = I.length / 3;
  const out = new Uint8Array(84 + 50 * nTri);
  const dv = new DataView(out.buffer);
  const header = new TextEncoder().encode(`${name} (CC0)`.slice(0, 80));
  out.set(header, 0);
  dv.setUint32(80, nTri, true);
  const n = triangleNormals(mesh);
  let o = 84;
  for (let t = 0; t < nTri; t++) {
    dv.setFloat32(o, n[t * 3], true);
    dv.setFloat32(o + 4, n[t * 3 + 1], true);
    dv.setFloat32(o + 8, n[t * 3 + 2], true);
    o += 12;
    for (let k = 0; k < 3; k++) {
      const v = I[t * 3 + k] * 3;
      dv.setFloat32(o, P[v], true);
      dv.setFloat32(o + 4, P[v + 1], true);
      dv.setFloat32(o + 8, P[v + 2], true);
      o += 12;
    }
    dv.setUint16(o, 0, true);
    o += 2;
  }
  return out;
}
