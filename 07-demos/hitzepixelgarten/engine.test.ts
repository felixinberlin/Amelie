import { describe, it, expect } from 'vitest';

// Simplified interfaces for demonstration
interface PixelProperties {
  albedo: number; // Reflectivity (0-1)
  evapotranspirationRate: number; // How much water vapor released (e.g., mm/hour or factor)
  heatCapacity: number; // Specific heat capacity of surface material
  isGreenSpace: boolean;
  isWaterBody: boolean;
}

interface ClimateConditions {
  solarRadiation: number; // W/m^2
  ambientAirTemp: number; // Celsius
  windSpeed: number; // m/s
}

interface CalculatedPixelState {
  surfaceTemperature: number; // Celsius
  airTemperatureInfluence: number; // Local air temp change due to surface
}

// Placeholder for a simplified physics calculation function
// In a real scenario, this would be much more complex, potentially iterative
// and considering neighbors, time, etc.
function calculateHeatBalance(
  properties: PixelProperties,
  climate: ClimateConditions,
  initialSurfaceTemp: number = climate.ambientAirTemp
): CalculatedPixelState {
  let currentTemp = initialSurfaceTemp;

  // Simplified model for demonstration purposes:
  // 1. Solar absorption:
  const absorbedSolarEnergy = climate.solarRadiation * (1 - properties.albedo);

  // 2. Cooling from evapotranspiration (significant for green/water):
  let evapotranspirationCooling = 0;
  if (properties.isGreenSpace || properties.isWaterBody) {
    // Latent heat of vaporization for water is ~2260 J/g (or Ws/g)
    // Simplified: more evapotranspiration = more cooling
    evapotranspirationCooling = properties.evapotranspirationRate * 0.5; // Arbitrary factor
  }

  // 3. Convective heat exchange with ambient air (Newton's Law of Cooling approx):
  // simplified heat transfer coefficient (h) ~ 10-100 W/(m^2*K) for natural convection
  // For forced convection (wind), h increases.
  const h = 10 + climate.windSpeed * 5; // Very simple wind influence
  const convectiveHeatExchange = h * (currentTemp - climate.ambientAirTemp);

  // 4. Net energy balance (very simplified, ignoring longwave radiation for now)
  // If absorbedSolarEnergy > (evapotranspirationCooling + convectiveHeatExchange)
  //   => temperature rises.
  // If absorbedSolarEnergy < (evapotranspirationCooling + convectiveHeatExchange)
  //   => temperature falls.
  // This needs to be integrated over time to find a stable temp, but for a single step:

  const netEnergyChange = absorbedSolarEnergy - evapotranspirationCooling - convectiveHeatExchange;

  // Very rough approximation: change in temp is proportional to net energy change
  // divided by heat capacity (per unit area) and a time step factor
  const tempChange = netEnergyChange / (properties.heatCapacity * 100); // Arbitrary scaling for demo

  currentTemp += tempChange;

  // Local air temperature influence: surface temp strongly affects air temp nearby
  const airTempInfluence = (currentTemp - climate.ambientAirTemp) * 0.3; // 30% of surface delta

  return {
    surfaceTemperature: parseFloat(currentTemp.toFixed(2)),
    airTemperatureInfluence: parseFloat(airTempInfluence.toFixed(2))
  };
}

describe('calculateHeatBalance', () => {
  const commonClimate: ClimateConditions = {
    solarRadiation: 800, // Strong sun
    ambientAirTemp: 28,  // Hot day
    windSpeed: 2
  };

  it('should show cooling effect for green spaces', () => {
    const asphalt: PixelProperties = {
      albedo: 0.05, // Dark
      evapotranspirationRate: 0.01, // Very low
      heatCapacity: 1500, // J/kg*K (concrete/asphalt)
      isGreenSpace: false,
      isWaterBody: false
    };
    const park: PixelProperties = {
      albedo: 0.25, // Lighter
      evapotranspirationRate: 0.5, // High
      heatCapacity: 2000, // Soil/vegetation
      isGreenSpace: true,
      isWaterBody: false
    };

    const asphaltResult = calculateHeatBalance(asphalt, commonClimate);
    const parkResult = calculateHeatBalance(park, commonClimate);

    expect(asphaltResult.surfaceTemperature).toBeGreaterThan(commonClimate.ambientAirTemp); // Asphalt heats up
    expect(parkResult.surfaceTemperature).toBeLessThan(asphaltResult.surfaceTemperature); // Park should be cooler
    expect(parkResult.surfaceTemperature).toBeCloseTo(28.27, 2);
    expect(asphaltResult.surfaceTemperature).toBeCloseTo(33.02, 2);
  });

  it('should show cooling effect for water bodies', () => {
    const water: PixelProperties = {
      albedo: 0.08, // Low, but reflects some
      evapotranspirationRate: 1.0, // Very high
      heatCapacity: 4186, // Water heat capacity
      isGreenSpace: false,
      isWaterBody: true
    };

    const waterResult = calculateHeatBalance(water, commonClimate);
    expect(waterResult.surfaceTemperature).toBeLessThan(commonClimate.ambientAirTemp); // Water cools significantly
    expect(waterResult.surfaceTemperature).toBeCloseTo(27.05, 2);
  });

  it('should respond to changes in solar radiation', () => {
    const park: PixelProperties = {
      albedo: 0.25, evapotranspirationRate: 0.5, heatCapacity: 2000, isGreenSpace: true, isWaterBody: false
    };
    const lowSunClimate: ClimateConditions = { ...commonClimate, solarRadiation: 200 };
    const highSunClimate: ClimateConditions = { ...commonClimate, solarRadiation: 1000 };

    const lowSunResult = calculateHeatBalance(park, lowSunClimate);
    const highSunResult = calculateHeatBalance(park, highSunClimate);

    expect(highSunResult.surfaceTemperature).toBeGreaterThan(lowSunResult.surfaceTemperature);
    expect(lowSunResult.surfaceTemperature).toBeCloseTo(27.79, 2);
    expect(highSunResult.surfaceTemperature).toBeCloseTo(28.52, 2);
  });

  it('should respond to changes in albedo', () => {
    const hotClimate: ClimateConditions = { ...commonClimate, solarRadiation: 900 };
    const darkRoof: PixelProperties = {
      albedo: 0.05, evapotranspirationRate: 0.01, heatCapacity: 1000, isGreenSpace: false, isWaterBody: false
    };
    const whiteRoof: PixelProperties = {
      albedo: 0.8, evapotranspirationRate: 0.01, heatCapacity: 1000, isGreenSpace: false, isWaterBody: false
    };

    const darkRoofResult = calculateHeatBalance(darkRoof, hotClimate);
    const whiteRoofResult = calculateHeatBalance(whiteRoof, hotClimate);

    expect(darkRoofResult.surfaceTemperature).toBeGreaterThan(whiteRoofResult.surfaceTemperature);
    expect(darkRoofResult.surfaceTemperature).toBeCloseTo(34.86, 2);
    expect(whiteRoofResult.surfaceTemperature).toBeCloseTo(27.1, 2);
  });

  it('should show reduced cooling with less wind', () => {
    const park: PixelProperties = {
      albedo: 0.25, evapotranspirationRate: 0.5, heatCapacity: 2000, isGreenSpace: true, isWaterBody: false
    };
    const calmClimate: ClimateConditions = { ...commonClimate, windSpeed: 0.5 };
    const windyClimate: ClimateConditions = { ...commonClimate, windSpeed: 5 };

    const calmResult = calculateHeatBalance(park, calmClimate);
    const windyResult = calculateHeatBalance(park, windyClimate);

    expect(calmResult.surfaceTemperature).toBeGreaterThan(windyResult.surfaceTemperature);
    expect(calmResult.surfaceTemperature).toBeCloseTo(28.45, 2);
    expect(windyResult.surfaceTemperature).toBeCloseTo(28.05, 2);
  });
});