/** Ventures-Tab: Datentypen und Helfer. Daten: public/data/ventures-dashboard.json (scripts/export-ventures.mjs). */
export interface VentureScores { w: number; t: number; c: number; m: number; d: number }
export const VECTOR_KEYS: (keyof VentureScores)[] = ['w', 't', 'c', 'm', 'd'];
export const VECTOR_LABELS: Record<keyof VentureScores, { de: string; en: string; es: string }> = {
  w: { de: 'Schmerz/WTP', en: 'Pain/WTP', es: 'Dolor/DAP' },
  t: { de: 'Time-to-Ship', en: 'Time-to-Ship', es: 'Time-to-Ship' },
  c: { de: 'Kanal', en: 'Channel', es: 'Canal' },
  m: { de: 'Monetarisierung', en: 'Monetization', es: 'Monetización' },
  d: { de: 'Verteidigbarkeit', en: 'Defensibility', es: 'Defendibilidad' },
};

export interface VentureLead {
  id: string; name: string; category: string; stage: string; pricingModel: string; targetPrice: string;
  targetAudience: string; amelieTwin: string; mvpEngineReady: boolean; lastUpdated: string;
  vectors: VentureScores | null;
}
export interface VenturesData { leads: VentureLead[] }

export const isScore = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= 5;
export const isScores = (s: unknown): s is VentureScores =>
  !!s && typeof s === 'object' && VECTOR_KEYS.every((k) => isScore((s as Record<string, unknown>)[k]));

export const total = (s: VentureScores): number => VECTOR_KEYS.reduce((a, k) => a + s[k], 0);

/** Durchschnitt je Vektor über alle Leads mit Scores; null wenn keiner Scores hat. */
export function averageVectors(leads: VentureLead[]): VentureScores | null {
  const scored = leads.filter((l) => l.vectors);
  if (!scored.length) return null;
  const avg = {} as VentureScores;
  for (const k of VECTOR_KEYS) avg[k] = scored.reduce((a, l) => a + l.vectors![k], 0) / scored.length;
  return avg;
}

export async function loadVentures(): Promise<VenturesData> {
  const r = await fetch(`${import.meta.env.BASE_URL || '/'}data/ventures-dashboard.json`);
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}
