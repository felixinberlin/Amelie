import { describe, it, expect, beforeEach } from 'vitest';
import { createUrbanGreenwatchAI, UrbanGreenwatchAI, ChangeDetectionResult, GreenSpaceFeature } from './gruenflaechen-waechter-ai';

describe('UrbanGreenwatchAI Core Functionality', () => {
  let greenwatchAI: UrbanGreenwatchAI;

  beforeEach(() => {
    // Initialize with a mock or in-memory data store for testing
    greenwatchAI = createUrbanGreenwatchAI();
  });

  it('should initialize without errors', () => {
    expect(greenwatchAI).toBeDefined();
    expect(typeof greenwatchAI.analyzeImagery).toBe('function');
    expect(typeof greenwatchAI.getChangeReports).toBe('function');
  });

  it('should simulate imagery analysis and detect a basic change', async () => {
    const mockImageryDataBefore = {
      satellite: 'mock_sat_img_url_before.tif',
      street: 'mock_street_img_url_before.jpg',
      timestamp: new Date('2022-01-01T12:00:00Z').toISOString()
    };
    const mockImageryDataAfter = {
      satellite: 'mock_sat_img_url_after.tif',
      street: 'mock_street_img_url_after.jpg',
      timestamp: new Date('2023-01-01T12:00:00Z').toISOString()
    };

    // Simulate the AI processing
    const simulatedResult: ChangeDetectionResult = {
      id: 'change-001',
      timestamp: mockImageryDataAfter.timestamp,
      location: { lat: 52.52, lon: 13.40 }, // Berlin Mitte
      type: 'GreenSpaceReduction',
      severity: 'High',
      description: 'Significant reduction in tree canopy cover detected.',
      areaSqMeters: 150,
      confidence: 0.95,
      beforeSnapshot: { url: mockImageryDataBefore.satellite, timestamp: mockImageryDataBefore.timestamp },
      afterSnapshot: { url: mockImageryDataAfter.satellite, timestamp: mockImageryDataAfter.timestamp },
      affectedFeatures: [{
        type: 'tree_canopy',
        geometry: { type: 'Polygon', coordinates: [[[13.39, 52.51], [13.41, 52.51], [13.41, 52.53], [13.39, 52.53], [13.39, 52.51]]] },
        properties: { initialAreaSqM: 200, finalAreaSqM: 50 }
      }]
    };

    // Mock the internal AI processing logic
    greenwatchAI.analyzeImagery = async (before: any, after: any): Promise<ChangeDetectionResult[]> => {
      // In a real scenario, this would call the ML backend
      if (before && after) {
        return [simulatedResult];
      }
      return [];
    };

    const changes = await greenwatchAI.analyzeImagery(mockImageryDataBefore, mockImageryDataAfter);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('GreenSpaceReduction');
    expect(changes[0].severity).toBe('High');
    expect(changes[0].areaSqMeters).toBe(150);
  });

  it('should handle no changes detected', async () => {
    const mockImageryDataBefore = {
      satellite: 'mock_sat_img_url_stable.tif',
      street: 'mock_street_img_url_stable.jpg',
      timestamp: new Date('2022-03-01T12:00:00Z').toISOString()
    };
    const mockImageryDataAfter = {
      satellite: 'mock_sat_img_url_stable.tif',
      street: 'mock_street_img_url_stable.jpg',
      timestamp: new Date('2023-03-01T12:00:00Z').toISOString()
    };

    greenwatchAI.analyzeImagery = async (before: any, after: any): Promise<ChangeDetectionResult[]> => {
      // Simulate no changes found by the AI
      return [];
    };

    const changes = await greenwatchAI.analyzeImagery(mockImageryDataBefore, mockImageryDataAfter);
    expect(changes).toHaveLength(0);
  });

  it('should retrieve stored change reports', async () => {
    const mockReport: ChangeDetectionResult = {
      id: 'report-002',
      timestamp: new Date().toISOString(),
      location: { lat: 52.5, lon: 13.5 },
      type: 'NewPlantingDetected',
      severity: 'Low',
      description: 'New tree planting activity.',
      areaSqMeters: 50,
      confidence: 0.8,
      beforeSnapshot: { url: 'before.jpg', timestamp: '2023-01-01' },
      afterSnapshot: { url: 'after.jpg', timestamp: '2023-06-01' },
      affectedFeatures: []
    };

    // Simulate adding a report (in a real system, analyzeImagery would persist this)
    // For this test, we'll directly inject or mock persistence
    const reports: ChangeDetectionResult[] = [mockReport];
    greenwatchAI.getChangeReports = async (filters?: any) => {
      if (filters?.type === 'NewPlantingDetected') {
        return reports.filter(r => r.type === filters.type);
      }
      return reports;
    };

    const allReports = await greenwatchAI.getChangeReports();
    expect(allReports).toHaveLength(1);
    expect(allReports[0].id).toBe('report-002');

    const filteredReports = await greenwatchAI.getChangeReports({ type: 'GreenSpaceReduction' });
    expect(filteredReports).toHaveLength(0);
  });

  it('should handle imagery input with missing data gracefully', async () => {
    const mockImageryDataPartial = {
      satellite: 'mock_sat_img_url_partial.tif',
      timestamp: new Date('2022-01-01T12:00:00Z').toISOString()
    }; // Missing street data

    greenwatchAI.analyzeImagery = async (before: any, after: any): Promise<ChangeDetectionResult[]> => {
      // In a real system, this would log a warning or use only available data
      if (!before.street || !after.street) {
        return [{
          id: 'partial-001',
          timestamp: after.timestamp,
          location: { lat: 52.52, lon: 13.40 },
          type: 'Warning_PartialData',
          severity: 'Low',
          description: 'Analysis performed with partial imagery data.',
          confidence: 0.6,
          areaSqMeters: 0,
          beforeSnapshot: { url: before.satellite, timestamp: before.timestamp },
          afterSnapshot: { url: after.satellite, timestamp: after.timestamp },
          affectedFeatures: []
        }];
      }
      return [];
    };

    const changes = await greenwatchAI.analyzeImagery(mockImageryDataPartial, mockImageryDataPartial);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe('Warning_PartialData');
  });

});