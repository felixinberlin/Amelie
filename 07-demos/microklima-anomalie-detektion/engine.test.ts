// 07-demos/microklima-anomalie-detektion.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { MicroclimateAnomalyService, ThermalPoint, MicroclimateContext, MicroclimateAnomaly, IMicroclimateAnomalyService } from './microklima-anomalie-detektion';

describe('MicroclimateAnomalyService', () => {
  let service: IMicroclimateAnomalyService;

  beforeEach(() => {
    service = new MicroclimateAnomalyService();
  });

  it('should successfully ingest thermal data', async () => {
    const thermalPoints: ThermalPoint[] = [
      { latitude: 52.52, longitude: 13.40, temperatureCelsius: 35.1, timestamp: '2023-07-20T14:00:00Z' },
      { latitude: 52.521, longitude: 13.401, temperatureCelsius: 28.5, timestamp: '2023-07-20T14:00:00Z' }
    ];
    const result = await service.ingestThermalData(thermalPoints);
    expect(result).toBe(true);
  });

  it('should successfully update microclimate context data', async () => {
    const contextData: MicroclimateContext[] = [
      { osmId: 'node/12345', landCoverType: 'building', albedoCoefficient: 0.15, buildingHeightMeters: 25 },
      { osmId: 'way/67890', landCoverType: 'green_space', vegetationIndex: 0.7, populationDensityPerSqKm: 500 }
    ];
    const result = await service.updateMicroclimateContext(contextData);
    expect(result).toBe(true);
  });

  it('should detect anomalies within a specified bounding box and time range', async () => {
    const bbox: [number, number, number, number] = [52.51, 13.39, 52.53, 13.41]; // Berlin city center example
    const startTime = '2023-07-19T00:00:00Z';
    const endTime = '2023-07-20T23:59:59Z';

    // First, ingest some data to make detection plausible (even if simulated)
    await service.ingestThermalData([
      { latitude: 52.521, longitude: 13.401, temperatureCelsius: 38.0, timestamp: '2023-07-20T14:30:00Z' },
      { latitude: 52.522, longitude: 13.402, temperatureCelsius: 25.0, timestamp: '2023-07-20T14:30:00Z' }
    ]);
    await service.updateMicroclimateContext([
      { osmId: 'node/10001', landCoverType: 'building', albedoCoefficient: 0.1, buildingHeightMeters: 30 }
    ]);

    const anomalies: MicroclimateAnomaly[] = await service.detectAnomalies(bbox, startTime, endTime);

    // Since the actual detection is simulated, we expect an array, potentially empty or with simulated data
    expect(Array.isArray(anomalies)).toBe(true);
    // If a simulated anomaly is generated, check its structure
    if (anomalies.length > 0) {
      const anomaly = anomalies[0];
      expect(anomaly).toHaveProperty('id');
      expect(anomaly).toHaveProperty('latitude');
      expect(anomaly).toHaveProperty('longitude');
      expect(anomaly).toHaveProperty('anomalyScore');
      expect(anomaly.anomalyScore).toBeGreaterThan(0);
      expect(anomaly.severity).toMatch(/^(low|medium|high|critical)$/);
      expect(anomaly.contributingFactors).toBeInstanceOf(Array);
      expect(anomaly.timestamp).toBeTypeOf('string');
    }
  });

  it('should retrieve historical anomalies (even if none exist in mock)', async () => {
    const bbox: [number, number, number, number] = [52.51, 13.39, 52.53, 13.41];
    const startTime = '2023-01-01T00:00:00Z';
    const endTime = '2023-01-31T23:59:59Z';
    const historicalAnomalies = await service.getHistoricalAnomalies(bbox, startTime, endTime);
    expect(Array.isArray(historicalAnomalies)).toBe(true);
    expect(historicalAnomalies.length).toBe(0); // Expect 0 for mock
  });
});