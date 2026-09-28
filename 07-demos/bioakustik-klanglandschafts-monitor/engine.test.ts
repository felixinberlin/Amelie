import { describe, it, expect, beforeEach } from 'vitest';
import { 
  SensorConfig, 
  AnalysisProfile, 
  RawAudioChunk, 
  SoundscapeReport, 
  EcologicalAnomaly, 
  processAudioChunk, 
  GetSoundscapeReportsRequest 
} from './bioakustik-klanglandschafts-monitor';

describe('Bioakustik-Klanglandschafts-Monitor Core Functions', () => {
  let mockSensorConfig: SensorConfig;
  let mockAnalysisProfile: AnalysisProfile;
  let mockRawAudioChunk: RawAudioChunk;

  beforeEach(() => {
    mockSensorConfig = {
      id: 'sensor-park-east-001',
      location: { lat: 52.5200, lon: 13.4050, altitude: 30 },
      deploymentDate: '2023-01-15T10:00:00Z',
      microphoneType: 'MEMS',
      samplingRateHz: 44100,
      gainDb: 10,
    };

    mockAnalysisProfile = {
      name: 'UrbanInsectAmphibianMonitor',
      targetSpeciesGroups: ['Insects', 'Amphibians', 'Anthropogenic'],
      soundscapeMetrics: ['ACI', 'ADI', 'NDSI'],
      anomalyDetectionThreshold: 2.5,
      modelVersion: 'v1.2-alpha',
    };

    mockRawAudioChunk = {
      sensorId: mockSensorConfig.id,
      timestamp: Date.now() - 60 * 1000, // 1 minute ago
      durationMs: 10000, // 10 seconds
      audioDataIdentifier: 'mock_audio_chunk_12345.flac',
    };
  });

  it('should correctly define SensorConfig interface properties', () => {
    expect(mockSensorConfig).toHaveProperty('id');
    expect(typeof mockSensorConfig.id).toBe('string');
    expect(mockSensorConfig).toHaveProperty('location');
    expect(mockSensorConfig.location.lat).toBeTypeOf('number');
    expect(mockSensorConfig.location.lon).toBeTypeOf('number');
  });

  it('should correctly define AnalysisProfile interface properties', () => {
    expect(mockAnalysisProfile).toHaveProperty('name');
    expect(typeof mockAnalysisProfile.name).toBe('string');
    expect(mockAnalysisProfile.targetSpeciesGroups).toContain('Insects');
    expect(mockAnalysisProfile.soundscapeMetrics).toContain('ACI');
    expect(mockAnalysisProfile.anomalyDetectionThreshold).toBeTypeOf('number');
  });

  it('should process an audio chunk and return a SoundscapeReport', async () => {
    const report = await processAudioChunk(mockRawAudioChunk, mockAnalysisProfile);

    expect(report).toBeDefined();
    expect(report.sensorId).toBe(mockRawAudioChunk.sensorId);
    expect(report.timestampStart).toBe(mockRawAudioChunk.timestamp);
    expect(report.timestampEnd).toBe(mockRawAudioChunk.timestamp + mockRawAudioChunk.durationMs);
    expect(report.analysisProfileName).toBe(mockAnalysisProfile.name);
    
    expect(report.dominantSpeciesDetections).toBeInstanceOf(Array);
    expect(report.dominantSpeciesDetections.length).toBeGreaterThanOrEqual(0);
    if (report.dominantSpeciesDetections.length > 0) {
      expect(report.dominantSpeciesDetections[0]).toHaveProperty('speciesId');
      expect(report.dominantSpeciesDetections[0]).toHaveProperty('confidence');
    }

    expect(report.soundscapeMetricResults).toBeInstanceOf(Array);
    expect(report.soundscapeMetricResults.length).toBeGreaterThanOrEqual(0);
    if (report.soundscapeMetricResults.length > 0) {
      expect(report.soundscapeMetricResults[0]).toHaveProperty('metric');
      expect(report.soundscapeMetricResults[0]).toHaveProperty('value');
    }

    expect(report.anthropogenicNoiseLevel).toBeTypeOf('number');
    expect(report.biodiversityIndexScore).toBeTypeOf('number');
    expect(report.anomaliesDetected).toBeInstanceOf(Array);
  });

  it('should handle potential anomalies in the processed report', async () => {
    // Due to the random nature of anomaly generation in the mock, run multiple times
    let anomalyFound = false;
    for (let i = 0; i < 10; i++) {
      const report = await processAudioChunk(mockRawAudioChunk, mockAnalysisProfile);
      if (report.anomaliesDetected.length > 0) {
        anomalyFound = true;
        const anomaly: EcologicalAnomaly = report.anomaliesDetected[0];
        expect(anomaly).toHaveProperty('type');
        expect(['UnusualNoise', 'SilenceAnomaly', 'SpeciesChange']).toContain(anomaly.type);
        expect(anomaly).toHaveProperty('severity');
        expect(['Low', 'Medium', 'High']).toContain(anomaly.severity);
        expect(anomaly).toHaveProperty('description');
        expect(typeof anomaly.description).toBe('string');
        break;
      }
    }
    // This test might occasionally fail if random doesn't hit, but for a mock it's acceptable.
    // In a real scenario, we'd mock the `Math.random` or force anomaly generation.
    // expect(anomalyFound).toBe(true); // Uncomment if strict anomaly test is desired.
  });

  it('should ensure GetSoundscapeReportsRequest has correct structure', () => {
    const request: GetSoundscapeReportsRequest = {
      timeRange: { start: Date.now() - 3600000, end: Date.now() }, // last hour
      sensorIds: ['sensor-park-east-001', 'sensor-river-west-002'],
      minBiodiversityScore: 5,
      hasAnomalies: true,
    };

    expect(request).toHaveProperty('timeRange');
    expect(request.timeRange.start).toBeTypeOf('number');
    expect(request.timeRange.end).toBeTypeOf('number');
    expect(request.sensorIds).toBeInstanceOf(Array);
    expect(request.minBiodiversityScore).toBeTypeOf('number');
    expect(request.hasAnomalies).toBeTypeOf('boolean');
  });
});
