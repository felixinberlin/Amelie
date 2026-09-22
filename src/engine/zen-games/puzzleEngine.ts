export interface PuzzlePiece {
  id: number;
  currentSlot: number;
  correctSlot: number;
  label: string;
}

export function createInitialPuzzlePieces(): PuzzlePiece[] {
  return [
    { id: 0, currentSlot: 2, correctSlot: 0, label: 'Oben Links' },
    { id: 1, currentSlot: 0, correctSlot: 1, label: 'Oben Rechts' },
    { id: 2, currentSlot: 3, correctSlot: 2, label: 'Unten Links' },
    { id: 3, currentSlot: 1, correctSlot: 3, label: 'Unten Rechts' },
  ];
}

export function swapPuzzlePieces(
  pieces: PuzzlePiece[],
  pieceIdA: number,
  pieceIdB: number
): PuzzlePiece[] {
  const pieceA = pieces.find((p) => p.id === pieceIdA);
  const pieceB = pieces.find((p) => p.id === pieceIdB);
  if (!pieceA || !pieceB || pieceIdA === pieceIdB) return pieces;

  const slotA = pieceA.currentSlot;
  const slotB = pieceB.currentSlot;

  return pieces.map((p) => {
    if (p.id === pieceA.id) return { ...p, currentSlot: slotB };
    if (p.id === pieceB.id) return { ...p, currentSlot: slotA };
    return p;
  });
}

export function isPuzzleSolved(pieces: PuzzlePiece[]): boolean {
  if (pieces.length === 0) return false;
  return pieces.every((p) => p.currentSlot === p.correctSlot);
}

export function calculatePuzzleProgress(pieces: PuzzlePiece[]): {
  correctCount: number;
  totalCount: number;
  percentage: number;
} {
  const totalCount = pieces.length;
  if (totalCount === 0) return { correctCount: 0, totalCount: 0, percentage: 0 };
  const correctCount = pieces.filter((p) => p.currentSlot === p.correctSlot).length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  return { correctCount, totalCount, percentage };
}
