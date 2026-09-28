import { describe, it, expect } from 'vitest';
import { parseCSV, calculateLinearRegression, applyErrorPropagation } from './physidataviz-core';

describe('PhysiDataViz Core Data Processing', () => {
  it('should correctly parse a simple CSV string', () => {
    const csvData = 'x,y\n1,2\n3,4\n5,6';
    const result = parseCSV(csvData);
    expect(result).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 }
    ]);
  });

  it('should calculate linear regression for given data points', () => {
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 }
    ];
    const { slope, intercept } = calculateLinearRegression(data.map(p => p.x), data.map(p => p.y));
    expect(slope).toBeCloseTo(2);
    expect(intercept).toBeCloseTo(0);
  });

  it('should handle data with measurement uncertainties in linear regression', () => {
    const x = [1, 2, 3];
    const y = [2.1, 3.9, 6.2];
    const dy = [0.1, 0.1, 0.1]; // Uncertainty in y
    const { slope, intercept } = calculateLinearRegression(x, y, dy);
    // These values are approximate for manual calculation, but should be close
    expect(slope).toBeCloseTo(2.05, 1); 
    expect(intercept).toBeCloseTo(0.06, 1);
  });

  it('should apply simple error propagation for a sum', () => {
    const val1 = { value: 10, uncertainty: 0.5 };
    const val2 = { value: 20, uncertainty: 1.0 };
    // For sum: z = a + b, dz^2 = da^2 + db^2
    const result = applyErrorPropagation(val1, val2, (a, b) => a + b, (da, db) => Math.sqrt(da*da + db*db));
    expect(result.value).toBe(30);
    expect(result.uncertainty).toBeCloseTo(Math.sqrt(0.5*0.5 + 1.0*1.0));
  });

  it('should throw error for invalid CSV format', () => {
    const invalidCsv = 'x,y\n1\n2,3,4';
    expect(() => parseCSV(invalidCsv)).toThrow('CSV parsing error: Mismatched column count');
  });
});

// Placeholder for core functions. In a real scenario, these would be in their own files.

interface DataPoint {
  x: number;
  y: number;
}

interface ValueWithUncertainty {
  value: number;
  uncertainty: number;
}

function parseCSV(csvString: string): DataPoint[] {
  const lines = csvString.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV parsing error: Not enough data lines');
  }
  const headers = lines[0].split(',').map(h => h.trim());
  if (headers.length !== 2) {
    throw new Error('CSV parsing error: Expected exactly two columns (x,y)');
  }

  const data: DataPoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim());
    if (parts.length !== headers.length) {
        throw new Error('CSV parsing error: Mismatched column count');
    }
    const x = parseFloat(parts[0]);
    const y = parseFloat(parts[1]);
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`CSV parsing error: Invalid number found at line ${i + 1}`);
    }
    data.push({ x, y });
  }
  return data;
}

function calculateLinearRegression(x: number[], y: number[], dy?: number[]): { slope: number; intercept: number } {
    if (x.length !== y.length) {
        throw new Error('Input arrays x and y must have the same length.');
    }
    if (dy && dy.length !== y.length) {
        throw new Error('Input array dy must have the same length as y.');
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, N = x.length;

    if (dy) {
        // Weighted linear regression (using inverse of uncertainty squared as weights)
        let sumW = 0, sumWX = 0, sumWY = 0, sumWXY = 0, sumWX2 = 0;
        for (let i = 0; i < N; i++) {
            const w = 1 / (dy[i] * dy[i]);
            sumW += w;
            sumWX += w * x[i];
            sumWY += w * y[i];
            sumWXY += w * x[i] * y[i];
            sumWX2 += w * x[i] * x[i];
        }
        const delta = sumW * sumWX2 - sumWX * sumWX;
        if (delta === 0) throw new Error('Cannot perform weighted linear regression: Delta is zero.');
        const slope = (sumW * sumWXY - sumWX * sumWY) / delta;
        const intercept = (sumWY * sumWX2 - sumWX * sumWXY) / delta;
        return { slope, intercept };
    } else {
        // Unweighted linear regression
        for (let i = 0; i < N; i++) {
            sumX += x[i];
            sumY += y[i];
            sumXY += x[i] * y[i];
            sumX2 += x[i] * x[i];
        }

        const denominator = (N * sumX2 - sumX * sumX);
        if (denominator === 0) throw new Error('Cannot perform linear regression: Denominator is zero (e.g., all x values are the same).');

        const slope = (N * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY * sumX2 - sumX * sumXY) / denominator;
        return { slope, intercept };
    }
}

function applyErrorPropagation(
  val1: ValueWithUncertainty,
  val2: ValueWithUncertainty,
  func: (a: number, b: number) => number,
  errFunc: (da: number, db: number) => number
): ValueWithUncertainty {
  const value = func(val1.value, val2.value);
  const uncertainty = errFunc(val1.uncertainty, val2.uncertainty);
  return { value, uncertainty };
}

