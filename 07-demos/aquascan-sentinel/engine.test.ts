// 07-demos/aquascan-sentinel/test/aquascan-sentinel.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  WaterBody,
  WaterQualityRecord,
  AnalysisParameters,
  initializeAquaScanSentinel
} from '../src/index';

// Mock dependencies using vi.mock to control their behavior
const mockWaterBodyService = {
  getAllWaterBodies: vi.fn(),
  getLatestWaterQuality: vi.fn(),
  saveWaterQualityRecord: vi.fn()
};

const mockSatelliteImageryService = {
  fetchImagery: vi.fn()
};

const mockMLInferenceService = {
  performInference: vi.fn()
};

// Mock the classes directly, then mock their instances
const mockMapViewerInstance = {
  onWaterBodySelected: vi.fn(),
  displayAnalysisOverlay: vi.fn(),
  loadWaterBodies: vi.fn()
};
const mockAnalysisPanelInstance = {
  displayWaterBodyInfo: vi.fn(),
  displayLatestResults: vi.fn(),
  onAnalyzeRequest: vi.fn(),
  setLoading: vi.fn(),
  displayHistoricalData: vi.fn(),
  showError: vi.fn()
};

vi.mock('../src/services/WaterBodyService', () => ({
  WaterBodyService: mockWaterBodyService
}));
vi.mock('../src/services/SatelliteImageryService', () => ({
  SatelliteImageryService: mockSatelliteImageryService
}));
vi.mock('../src/services/MLInferenceService', () => ({
  MLInferenceService: mockMLInferenceService
}));
vi.mock('../src/components/MapViewer', () => ({
  MapViewer: vi.fn(() => mockMapViewerInstance) // Return the mock instance
}));
vi.mock('../src/components/AnalysisPanel', () => ({
  AnalysisPanel: vi.fn(() => mockAnalysisPanelInstance) // Return the mock instance
}));

describe('AquaScan Sentinel Core Logic', () => {
  let rootElement: HTMLDivElement;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Create a dummy root element for the app
    rootElement = document.createElement('div');
    rootElement.id = 'app-root';
    document.body.appendChild(rootElement);

    // Mock implementations for services
    mockWaterBodyService.getAllWaterBodies.mockResolvedValue([]);
    mockWaterBodyService.getLatestWaterQuality.mockResolvedValue(null);
    mockWaterBodyService.saveWaterQualityRecord.mockResolvedValue(true);

    mockSatelliteImageryService.fetchImagery.mockResolvedValue({ data: 'satellite-image-data' });
    mockMLInferenceService.performInference.mockResolvedValue({
      historicalData: [{ date: new Date(), algaeIndex: 0.5, turbidityIndex: 0.3, imageUrl: 'test-image.png', rawSatelliteDataUrl: 'raw.tiff' }],
      latestImageUrl: 'latest-image.png'
    });
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
  });

  it('should initialize the application and load water bodies', async () => {
    const mockWaterBodies: WaterBody[] = [
      { id: '1', name: 'Lake Test', geometry: { type: 'Polygon', coordinates: [] } }
    ];
    mockWaterBodyService.getAllWaterBodies.mockResolvedValue(mockWaterBodies);

    initializeAquaScanSentinel('app-root');

    // Wait for promises to resolve (if any initial async operations)
    await vi.waitFor(() => {
      expect(mockMapViewerInstance.loadWaterBodies).toHaveBeenCalledWith(mockWaterBodies);
      expect(mockMapViewerInstance.onWaterBodySelected).toBeInstanceOf(Function);
      expect(mockAnalysisPanelInstance.onAnalyzeRequest).toBeInstanceOf(Function);
    });
  });

  it('should handle water body selection and display info', async () => {
    initializeAquaScanSentinel('app-root');

    const testWaterBody: WaterBody = {
      id: '2',
      name: 'River Test',
      geometry: { type: 'Polygon', coordinates: [] }
    };
    const latestRecord: WaterQualityRecord = {
      date: new Date(),
      algaeIndex: 0.7,
      turbidityIndex: 0.4,
      imageUrl: 'latest-river-image.png',
      rawSatelliteDataUrl: 'raw-river.tiff'
    };
    mockWaterBodyService.getLatestWaterQuality.mockResolvedValue(latestRecord);

    // Simulate mapViewer.onWaterBodySelected being called
    // We need to call the function assigned to onWaterBodySelected directly
    if (typeof mockMapViewerInstance.onWaterBodySelected === 'function') {
      await mockMapViewerInstance.onWaterBodySelected(testWaterBody);
    }

    expect(mockAnalysisPanelInstance.displayWaterBodyInfo).toHaveBeenCalledWith(testWaterBody);
    expect(mockWaterBodyService.getLatestWaterQuality).toHaveBeenCalledWith(testWaterBody.id);
    expect(mockMapViewerInstance.displayAnalysisOverlay).toHaveBeenCalledWith(latestRecord.imageUrl);
    expect(mockAnalysisPanelInstance.displayLatestResults).toHaveBeenCalledWith(latestRecord);
  });

  it('should handle analysis request and display results', async () => {
    initializeAquaScanSentinel('app-root');

    const analysisParams: AnalysisParameters = {
      waterBodyId: '3',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-01-31'),
      indicator: 'algae'
    };

    // Simulate analysisPanel.onAnalyzeRequest being called
    if (typeof mockAnalysisPanelInstance.onAnalyzeRequest === 'function') {
      await mockAnalysisPanelInstance.onAnalyzeRequest(analysisParams);
    }

    expect(mockAnalysisPanelInstance.setLoading).toHaveBeenCalledWith(true);
    expect(mockSatelliteImageryService.fetchImagery).toHaveBeenCalledWith(
      analysisParams.waterBodyId,
      analysisParams.startDate,
      analysisParams.endDate
    );
    expect(mockMLInferenceService.performInference).toHaveBeenCalled();
    expect(mockWaterBodyService.saveWaterQualityRecord).toHaveBeenCalled();
    expect(mockAnalysisPanelInstance.displayHistoricalData).toHaveBeenCalled();
    expect(mockMapViewerInstance.displayAnalysisOverlay).toHaveBeenCalledWith('latest-image.png');
    expect(mockAnalysisPanelInstance.setLoading).toHaveBeenCalledWith(false);
  });

  it('should show error if analysis fails', async () => {
    initializeAquaScanSentinel('app-root');

    mockMLInferenceService.performInference.mockRejectedValue(new Error('ML error'));

    const analysisParams: AnalysisParameters = {
      waterBodyId: '4',
      startDate: new Date('2023-02-01'),
      endDate: new Date('2023-02-28'),
      indicator: 'turbidity'
    };

    if (typeof mockAnalysisPanelInstance.onAnalyzeRequest === 'function') {
      await mockAnalysisPanelInstance.onAnalyzeRequest(analysisParams);
    }

    expect(mockAnalysisPanelInstance.setLoading).toHaveBeenCalledWith(true); // Called before try block
    expect(mockAnalysisPanelInstance.showError).toHaveBeenCalledWith('Failed to perform analysis. Please try again.');
    expect(mockAnalysisPanelInstance.setLoading).toHaveBeenCalledWith(false); // Called in finally block
  });

  it('should log error if root element is not found', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    initializeAquaScanSentinel('non-existent-root');
    expect(consoleErrorSpy).toHaveBeenCalledWith("Root element with ID 'non-existent-root' not found.");
    consoleErrorSpy.mockRestore();
  });
});