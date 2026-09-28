import { describe, it, expect } from 'vitest';

// Assume a utility function that processes raw vibration data
// and checks it against a given threshold (e.g., DIN 4150-3 for structural integrity)
interface VibrationReading {
  timestamp: number;
  x: number; // raw accelerometer value
  y: number;
  z: number;
}

interface VibrationAnalysisResult {
  rmsAcceleration: number; // Root Mean Square acceleration
  exceedsThreshold: boolean;
  thresholdValue: number;
  unit: string;
}

/**
 * Simulates processing raw vibration data to calculate RMS acceleration
 * and check against a specific threshold (e.g., based on DIN 4150-3 categories).
 * This is a simplified model. Real-world would involve frequency analysis,
 * specific filtering, and more complex standards.
 * @param readings Array of raw vibration readings
 * @param thresholdMs2 Threshold in m/s^2 (e.g., 0.5 m/s^2 for sensitive structures)
 * @returns Analysis result including RMS acceleration and threshold check
 */
function analyzeVibrationData(
  readings: VibrationReading[],
  thresholdMs2: number
): VibrationAnalysisResult {
  if (readings.length === 0) {
    return {
      rmsAcceleration: 0,
      exceedsThreshold: false,
      thresholdValue: thresholdMs2,
      unit: "m/s^2"
    };
  }

  // Simplified: Calculate RMS of magnitudes (sqrt(x^2 + y^2 + z^2))
  const squaredMagnitudesSum = readings.reduce((sum, r) => {
    const magnitude = Math.sqrt(r.x * r.x + r.y * r.y + r.z * r.z);
    return sum + magnitude * magnitude;
  }, 0);

  const rmsAcceleration = Math.sqrt(squaredMagnitudesSum / readings.length);

  return {
    rmsAcceleration: parseFloat(rmsAcceleration.toFixed(3)), // Round for comparison
    exceedsThreshold: rmsAcceleration > thresholdMs2,
    thresholdValue: thresholdMs2,
    unit: "m/s^2"
  };
}

describe('VibroGuard Data Analysis', () => {
  it('should correctly calculate RMS acceleration and not exceed threshold for low vibrations', () => {
    const readings: VibrationReading[] = [
      { timestamp: 1, x: 0.1, y: 0.05, z: 0.02 },
      { timestamp: 2, x: 0.12, y: 0.06, z: 0.03 },
      { timestamp: 3, x: 0.09, y: 0.04, z: 0.025 }
    ];
    const threshold = 0.5; // m/s^2

    const result = analyzeVibrationData(readings, threshold);
    expect(result.rmsAcceleration).toBeLessThan(threshold);
    expect(result.exceedsThreshold).toBe(false);
    expect(result.rmsAcceleration).toBeCloseTo(0.122); // Example calculated RMS for these values
  });

  it('should correctly identify when vibrations exceed the threshold', () => {
    const readings: VibrationReading[] = [
      { timestamp: 1, x: 0.4, y: 0.3, z: 0.2 },
      { timestamp: 2, x: 0.6, y: 0.4, z: 0.3 },
      { timestamp: 3, x: 0.5, y: 0.35, z: 0.25 }
    ];
    const threshold = 0.5; // m/s^2

    const result = analyzeVibrationData(readings, threshold);
    expect(result.rmsAcceleration).toBeGreaterThan(threshold);
    expect(result.exceedsThreshold).toBe(true);
    expect(result.rmsAcceleration).toBeCloseTo(0.710); // Example calculated RMS
  });

  it('should handle empty readings array gracefully', () => {
    const readings: VibrationReading[] = [];
    const threshold = 0.5;

    const result = analyzeVibrationData(readings, threshold);
    expect(result.rmsAcceleration).toBe(0);
    expect(result.exceedsThreshold).toBe(false);
  });

  it('should return correct unit and threshold value', () => {
    const readings: VibrationReading[] = [{ timestamp: 1, x: 0.1, y: 0.1, z: 0.1 }];
    const threshold = 0.7;

    const result = analyzeVibrationData(readings, threshold);
    expect(result.thresholdValue).toBe(threshold);
    expect(result.unit).toBe("m/s^2");
  });
});