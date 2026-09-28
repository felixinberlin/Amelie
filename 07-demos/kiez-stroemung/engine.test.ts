// vitest/kiez-stroemung.test.ts
import { describe, it, expect } from 'vitest';
import {
  runMicroclimateSimulation,
  SimulationInput,
  SensorReading,
  GeoCoordinate,
  UrbanGeometry,
  SimulationResult
} from '../src/kiez-stroemung/types'; // Adjust path as needed

describe('Kiez-Strömung Simulation Core', () => {

  const mockGeoCoord1: GeoCoordinate = { latitude: 52.52, longitude: 13.40 };
  const mockGeoCoord2: GeoCoordinate = { latitude: 52.521, longitude: 13.401 };
  const mockGeoCoord3: GeoCoordinate = { latitude: 52.522, longitude: 13.402 };

  const mockSensorData: SensorReading[] = [
    {
      id: 'sensor-1',
      timestamp: new Date().toISOString(),
      location: mockGeoCoord1,
      pm2_5: 22.5,
      temperature: 25.1,
      windSpeed: 3.2,
      windDirection: 270
    },
    {
      id: 'sensor-2',
      timestamp: new Date(Date.now() - 60000).toISOString(), // 1 min ago
      location: mockGeoCoord2,
      pm2_5: 35.0,
      no2: 45.0,
      temperature: 26.5,
      windSpeed: 2.8,
      windDirection: 280
    }
  ];

  const mockUrbanGeometry: UrbanGeometry = {
    buildings: [
      {
        id: 'b-1',
        polygon: [
          { latitude: 52.519, longitude: 13.399 },
          { latitude: 52.519, longitude: 13.400 },
          { latitude: 52.520, longitude: 13.400 },
          { latitude: 52.520, longitude: 13.399 }
        ],
        height: 25
      }
    ],
    greenSpaces: []
  };

  const mockSimulationInput: SimulationInput = {
    area: {
      northEast: { latitude: 52.525, longitude: 13.405 },
      southWest: { latitude: 52.515, longitude: 13.395 }
    },
    urbanGeometry: mockUrbanGeometry,
    sensorData: mockSensorData,
    weatherConditions: {
      ambientWindSpeed: 5.0,
      ambientWindDirection: 270,
      ambientTemperature: 24.0
    },
    simulationParameters: {
      gridResolution: 5, // 5 meters per grid cell
      duration: 3600 // 1 hour simulation
    }
  };

  it('should return a SimulationResult object for valid input', async () => {
    const result = await runMicroclimateSimulation(mockSimulationInput);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('timestamp');
    expect(typeof result.timestamp).toBe('string');
    expect(result).toHaveProperty('gridResolution');
    expect(result.gridResolution).toBe(mockSimulationInput.simulationParameters?.gridResolution);
    expect(result).toHaveProperty('dataGrid');
    expect(Array.isArray(result.dataGrid)).toBe(true);
    expect(result.dataGrid.length).toBeGreaterThan(0);
    expect(result.dataGrid[0].length).toBeGreaterThan(0);
    expect(result.dataGrid[0][0]).toHaveProperty('location');
    expect(result.dataGrid[0][0]).toHaveProperty('windVector');
    expect(result.dataGrid[0][0].windVector).toHaveProperty('u');
    expect(result.dataGrid[0][0].windVector).toHaveProperty('v');
  });

  it('should include hotspots in the simulation result if detected', async () => {
    const result = await runMicroclimateSimulation(mockSimulationInput);
    expect(result).toHaveProperty('hotspots');
    expect(Array.isArray(result.hotspots)).toBe(true);
    if (result.hotspots && result.hotspots.length > 0) {
      const hotspot = result.hotspots[0];
      expect(hotspot).toHaveProperty('type');
      expect(hotspot).toHaveProperty('location');
      expect(hotspot).toHaveProperty('intensity');
    }
  });

  it('should handle empty sensor data gracefully', async () => {
    const inputWithoutSensors = { ...mockSimulationInput, sensorData: [] };
    const result = await runMicroclimateSimulation(inputWithoutSensors);
    expect(result).toBeDefined();
    expect(result.dataGrid.length).toBeGreaterThan(0); // Should still produce a grid based on geometry/weather
  });

  it('should use default grid resolution if not provided in parameters', async () => {
    const inputWithoutGridResolution = {
      ...mockSimulationInput,
      simulationParameters: { duration: 3600 } // gridResolution omitted
    };
    const result = await runMicroclimateSimulation(inputWithoutGridResolution);
    expect(result.gridResolution).toBe(10); // Default value from dummy implementation
  });

  it('should ensure wind vectors have "u" and "v" components', async () => {
    const result = await runMicroclimateSimulation(mockSimulationInput);
    const firstCell = result.dataGrid[0][0];
    expect(firstCell.windVector).toHaveProperty('u');
    expect(typeof firstCell.windVector.u).toBe('number');
    expect(firstCell.windVector).toHaveProperty('v');
    expect(typeof firstCell.windVector.v).toBe('number');
  });
});