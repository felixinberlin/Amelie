import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  EntomoDiagnosticaService,
  MockImageRecognitionService,
  MockEcologicalDatabaseService,
  InMemoryObservationStore,
  type Observation,
  type EcologicalAssessment,
  type SpeciesIdentificationResult,
  type Location
} from './entomo-diagnostica'; // Assuming this file is src/entomo-diagnostica.ts

describe('EntomoDiagnosticaService', () => {
  let service: EntomoDiagnosticaService;
  let mockImageRecognition: MockImageRecognitionService;
  let mockEcologicalDatabase: MockEcologicalDatabaseService;
  let mockObservationStore: InMemoryObservationStore;

  beforeEach(() => {
    vi.clearAllMocks();
    mockImageRecognition = new MockImageRecognitionService();
    mockEcologicalDatabase = new MockEcologicalDatabaseService();
    mockObservationStore = new InMemoryObservationStore();

    vi.spyOn(mockImageRecognition, 'identifySpecies');
    vi.spyOn(mockEcologicalDatabase, 'getIndicatorValues');
    vi.spyOn(mockObservationStore, 'add');
    vi.spyOn(mockObservationStore, 'getAll');

    service = new EntomoDiagnosticaService(mockImageRecognition, mockEcologicalDatabase, mockObservationStore);
  });

  it('should correctly identify a species and assess ecological health for a polluted water larva', async () => {
    const mockImage = Buffer.from('polluted_water_larva_image_data');
    const location: Location = { lat: 52.52, lon: 13.40 };
    const habitatType = 'stream';

    const assessment = await service.processObservation(mockImage, location, habitatType);

    expect(mockImageRecognition.identifySpecies).toHaveBeenCalledWith(mockImage);
    expect(mockEcologicalDatabase.getIndicatorValues).toHaveBeenCalledWith('chironomus_plumosus');
    expect(mockObservationStore.add).toHaveBeenCalled();

    expect(assessment).toBeDefined();
    expect(assessment.speciesIdentification.speciesId).toBe('chironomus_plumosus');
    expect(assessment.ecologicalAssessment.healthScore).toBe(2); // Based on 'poor' healthImpact
    expect(assessment.ecologicalAssessment.summary).toContain('poor');
    expect(assessment.ecologicalAssessment.summary).toContain('high pollution tolerance');
  });

  it('should correctly identify a species and assess ecological health for a clean water nymph', async () => {
    const mockImage = Buffer.from('clean_water_nymph_image_data');
    const location: Location = { lat: 52.53, lon: 13.41 };
    const habitatType = 'river';

    const assessment = await service.processObservation(mockImage, location, habitatType);

    expect(mockImageRecognition.identifySpecies).toHaveBeenCalledWith(mockImage);
    expect(mockEcologicalDatabase.getIndicatorValues).toHaveBeenCalledWith('ephemera_danica');
    expect(mockObservationStore.add).toHaveBeenCalled();

    expect(assessment).toBeDefined();
    expect(assessment.speciesIdentification.speciesId).toBe('ephemera_danica');
    expect(assessment.ecologicalAssessment.healthScore).toBe(5); // Based on 'excellent' healthImpact
    expect(assessment.ecologicalAssessment.summary).toContain('excellent');
    expect(assessment.ecologicalAssessment.summary).toContain('low pollution tolerance');
  });

  it('should handle unknown species identification gracefully', async () => {
    const mockImage = Buffer.from('unidentifiable_creature_image_data');
    const location: Location = { lat: 52.54, lon: 13.42 };
    const habitatType = 'forest_floor';

    const assessment = await service.processObservation(mockImage, location, habitatType);

    expect(mockImageRecognition.identifySpecies).toHaveBeenCalledWith(mockImage);
    expect(mockEcologicalDatabase.getIndicatorValues).not.toHaveBeenCalledWith('unknown'); // Should not query for 'unknown'
    expect(mockObservationStore.add).toHaveBeenCalled();

    expect(assessment).toBeDefined();
    expect(assessment.speciesIdentification.speciesId).toBe('unknown');
    expect(assessment.ecologicalAssessment.healthScore).toBeNull();
    expect(assessment.ecologicalAssessment.summary).toContain('Unable to confidently identify species');
  });

  it('should retrieve all observations', async () => {
    const mockImage1 = Buffer.from('polluted_water_larva_image_data');
    const mockImage2 = Buffer.from('clean_water_nymph_image_data');

    await service.processObservation(mockImage1, { lat: 52.52, lon: 13.40 }, 'stream');
    await service.processObservation(mockImage2, { lat: 52.53, lon: 13.41 }, 'river');

    const allObservations = await service.getAllObservations();
    expect(allObservations).toHaveLength(2);
    expect(allObservations[0].speciesIdentification.speciesId).toBe('chironomus_plumosus');
    expect(allObservations[1].speciesIdentification.speciesId).toBe('ephemera_danica');
    expect(mockObservationStore.getAll).toHaveBeenCalledOnce();
  });

  it('should store additional metadata like imageUrl and userId if provided', async () => {
    const mockImage = Buffer.from('soil_beetle_image_data');
    const location: Location = { lat: 52.55, lon: 13.43 };
    const habitatType = 'garden';
    const imageUrl = 'http://example.com/beetle.jpg';
    const userId = 'testuser123';

    const observation = await service.processObservation(mockImage, location, habitatType, imageUrl, userId);

    expect(observation.imageUrl).toBe(imageUrl);
    expect(observation.userId).toBe(userId);
    expect(mockObservationStore.add).toHaveBeenCalledWith(expect.objectContaining({
      imageUrl,
      userId
    }));
  });
});