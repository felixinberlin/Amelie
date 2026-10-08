/**
 * Lichter im Hof — Regelkern.
 *
 * Ein Hinterhof bei Einbruch der Dämmerung. Wer ein Fenster anknipst, schaltet
 * auch die Fenster darüber, darunter und daneben um: Licht an wird Licht aus
 * und umgekehrt. Ziel ist, dass am Ende alle Fenster leuchten.
 *
 * Reines Lights-Out über GF(2), nur mit umgekehrtem Ziel. Jede Stufe entsteht
 * aus einem hellen Hof, in dem eine feste Liste von Fenstern gedrückt wurde —
 * jede Stufe ist deshalb lösbar, und `par` ist eine obere Schranke für die
 * Zahl der nötigen Züge (Drücken vertauscht und hebt sich bei zweimal auf).
 */

export interface HofLevel {
  id: number;
  rows: number;
  cols: number;
  /** Fenster, die vom hellen Hof aus gedrückt wurden, um die Stufe zu erzeugen. */
  scramble: number[];
  titleDe: string;
  titleEn: string;
  titleEs: string;
  /** Zettel, den die Nachbarschaft nach der Stufe unter der Tür durchschiebt. */
  noteDe: string;
  noteEn: string;
  noteEs: string;
}

export const HOF_LEVELS: HofLevel[] = [
  {
    id: 1, rows: 3, cols: 3, scramble: [0, 4],
    titleDe: 'Erdgeschoss', titleEn: 'Ground floor', titleEs: 'Planta baja',
    noteDe: 'Frau Mertens vom Erdgeschoss: „Ich hab Suppe zu viel gekocht. Klingeln Sie einfach.“',
    noteEn: 'Mrs Mertens from downstairs: “I made too much soup. Just ring the bell.”',
    noteEs: 'La señora Mertens, de la planta baja: «Me ha sobrado sopa. Llame sin más.»',
  },
  {
    id: 2, rows: 3, cols: 4, scramble: [1, 5, 10],
    titleDe: 'Hinterhaus', titleEn: 'Back building', titleEs: 'Edificio trasero',
    noteDe: 'Zettel am Fahrradständer: „Wer immer meinen Reifen aufgepumpt hat — danke. Kaffee steht im Treppenhaus.“',
    noteEn: 'Note on the bike rack: “Whoever pumped up my tyre — thank you. Coffee is waiting in the stairwell.”',
    noteEs: 'Nota en el aparcabicis: «Quien me inflara la rueda: gracias. El café espera en la escalera.»',
  },
  {
    id: 3, rows: 4, cols: 4, scramble: [0, 5, 6, 11, 14],
    titleDe: 'Vorderhaus', titleEn: 'Front building', titleEs: 'Edificio delantero',
    noteDe: 'Der Geiger aus dem Dritten spielt heute Abend bei offenem Fenster. Nur für den Hof.',
    noteEn: 'The violinist on the third floor plays tonight with the window open. Just for the courtyard.',
    noteEs: 'El violinista del tercero toca esta noche con la ventana abierta. Solo para el patio.',
  },
  {
    id: 4, rows: 4, cols: 5, scramble: [2, 4, 7, 12, 15, 18],
    titleDe: 'Ganzes Haus', titleEn: 'Whole house', titleEs: 'La casa entera',
    noteDe: 'Im ganzen Haus brennt Licht. Irgendwo backt jemand Brot, und der Duft zieht bis ins Dachgeschoss.',
    noteEn: 'Every window in the house is lit. Somewhere someone is baking bread, and the smell drifts up to the attic.',
    noteEs: 'En toda la casa hay luz. En algún lugar alguien hornea pan, y el olor sube hasta el desván.',
  },
];

export type Board = boolean[];

export const cellCount = (l: Pick<HofLevel, 'rows' | 'cols'>): number => l.rows * l.cols;

/** Das Fenster selbst plus seine bis zu vier Nachbarn (oben, unten, links, rechts). */
export function affectedCells(rows: number, cols: number, index: number): number[] {
  const r = Math.floor(index / cols);
  const c = index % cols;
  const out = [index];
  if (r > 0) out.push(index - cols);
  if (r < rows - 1) out.push(index + cols);
  if (c > 0) out.push(index - 1);
  if (c < cols - 1) out.push(index + 1);
  return out;
}

export function press(board: Board, rows: number, cols: number, index: number): Board {
  const next = board.slice();
  for (const i of affectedCells(rows, cols, index)) next[i] = !next[i];
  return next;
}

export const litBoard = (rows: number, cols: number): Board => new Array<boolean>(rows * cols).fill(true);

export function startBoard(level: HofLevel): Board {
  return level.scramble.reduce((b, i) => press(b, level.rows, level.cols, i), litBoard(level.rows, level.cols));
}

export const isSolved = (board: Board): boolean => board.length > 0 && board.every(Boolean);

export const litCount = (board: Board): number => board.filter(Boolean).length;

/**
 * Eine Zugfolge, die den Hof vollständig erleuchtet (Gauß über GF(2)), oder null.
 * Von allen Lösungen wird eine mit den wenigsten Zügen geliefert.
 */
export function solve(board: Board, rows: number, cols: number): number[] | null {
  const n = rows * cols;
  // Zeile i: Gleichung für Fenster i. Spalte j = "Fenster j gedrückt". Letzte Spalte = rechte Seite.
  const m: number[][] = Array.from({ length: n }, () => new Array<number>(n + 1).fill(0));
  for (let j = 0; j < n; j++) for (const i of affectedCells(rows, cols, j)) m[i][j] = 1;
  for (let i = 0; i < n; i++) m[i][n] = board[i] ? 0 : 1; // dunkle Fenster müssen ungerade oft umgeschaltet werden

  const pivotCol: number[] = [];
  let row = 0;
  for (let col = 0; col < n && row < n; col++) {
    let sel = -1;
    for (let r = row; r < n; r++) if (m[r][col]) { sel = r; break; }
    if (sel < 0) continue;
    [m[row], m[sel]] = [m[sel], m[row]];
    for (let r = 0; r < n; r++) {
      if (r !== row && m[r][col]) for (let k = col; k <= n; k++) m[r][k] ^= m[row][k];
    }
    pivotCol.push(col);
    row++;
  }
  for (let r = row; r < n; r++) if (m[r][n]) return null; // 0 = 1: unlösbar

  // Freie Spalten = Spielraum der Lösung; alle Belegungen durchgehen und die mit den wenigsten Zügen nehmen.
  const pivots = new Set(pivotCol);
  const free = Array.from({ length: n }, (_, c) => c).filter((c) => !pivots.has(c));
  if (free.length > 12) return null; // nur für kleine Höfe gedacht
  let best: number[] | null = null;
  for (let mask = 0; mask < 1 << free.length; mask++) {
    const x = new Array<number>(n).fill(0);
    free.forEach((c, k) => { x[c] = (mask >> k) & 1; });
    pivotCol.forEach((col, r) => {
      let v = m[r][n];
      for (const c of free) v ^= m[r][c] & x[c];
      x[col] = v;
    });
    const presses = x.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    if (!best || presses.length < best.length) best = presses;
  }
  return best;
}

/** Welches Fenster als Nächstes ein guter Zug ist, oder null wenn schon alles leuchtet / nichts geht. */
export function hint(board: Board, rows: number, cols: number): number | null {
  if (isSolved(board)) return null;
  const s = solve(board, rows, cols);
  return s && s.length > 0 ? s[0] : null;
}

/** Bewertung nach Zügen im Verhältnis zu par: 3 = wie geplant oder besser, 2 = bis +2, 1 = geschafft. */
export function warmth(moves: number, par: number): 1 | 2 | 3 {
  if (moves <= par) return 3;
  if (moves <= par + 2) return 2;
  return 1;
}
