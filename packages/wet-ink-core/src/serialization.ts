import { WetInkStroke, WetInkToolType } from './types';

const TOOL_MAP: Record<WetInkToolType, number> = {
  'fountain-pen': 0,
  'sumi-brush': 1,
  'wash-brush': 2,
  'dip-pen': 3
};

const REV_TOOL_MAP: Record<number, WetInkToolType> = {
  0: 'fountain-pen',
  1: 'sumi-brush',
  2: 'wash-brush',
  3: 'dip-pen'
};

/**
 * Compact delta-encoding serialization for stroke streams.
 * Encodes: tool index, start timestamp, and an array of points [x, y, pressure, dt].
 */
export function serializeStrokes(strokes: WetInkStroke[]): string {
  if (!strokes || strokes.length === 0) return '[]';

  const compressed = strokes.map(s => ({
    t: TOOL_MAP[s.tool] ?? 0,
    s: s.startTime,
    c: s.colorHex || undefined,
    p: s.points.map(pt => [
      Math.round(pt.x * 10) / 10,
      Math.round(pt.y * 10) / 10,
      Math.round(pt.pressure * 100) / 100,
      Math.round(pt.timeOffset)
    ])
  }));

  return JSON.stringify(compressed);
}

export function deserializeStrokes(raw: string): WetInkStroke[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any) => ({
      tool: REV_TOOL_MAP[item.t] || 'fountain-pen',
      startTime: item.s || 0,
      colorHex: item.c,
      points: (item.p || []).map((arr: number[]) => ({
        x: arr[0],
        y: arr[1],
        pressure: arr[2],
        timeOffset: arr[3]
      }))
    }));
  } catch {
    return [];
  }
}
