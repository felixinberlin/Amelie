//
// === src/oekoResonanz.ts ===
// Define interfaces for policy proposals and environmental data
export interface PolicyProposal {
  id: string;
  title: string;
  description: string;
  geojsonArea?: GeoJSON.FeatureCollection; // Geographic area affected by the policy
  keywords: string[];
  impactRules?: PolicyImpactRule[]; // Simple rules for impact assessment
}

export interface EnvironmentalData {
  id: string;
  type: 'air_quality' | 'water_quality' | 'biodiversity' | 'land_use' | 'climate_risk';
  name: string;
  geojson: GeoJSON.FeatureCollection; // Geographic data (e.g., sensor locations, habitat areas)
  properties: { [key: string]: any }; // Actual data values (e.g., NO2 levels, species count)
}

export interface PolicyImpactRule {
  condition: {
    dataField: string; // e.g., 'land_use.properties.surface_type'
    operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string | number; // e.g., 'sealed_surface', 0.5
  };
  impact: {
    type: 'positive' | 'negative' | 'neutral';
    description: string;
    severity?: 'low' | 'medium' | 'high';
  };
}

/**
 * Simulates the impact of a policy proposal on environmental data.
 * This is a highly simplified model for demonstration.
 * In a real application, this would involve more sophisticated geospatial analysis
 * and potentially external simulation engines.
 * @param proposal The policy proposal to analyze.
 * @param envData A collection of relevant environmental datasets.
 * @returns A report detailing potential impacts.
 */
export function analyzePolicyImpact(
  proposal: PolicyProposal,
  envData: EnvironmentalData[]
): { policyId: string; impacts: { type: string; description: string; severity?: string; relatedData: string[] }[] } {
  const impacts: { type: string; description: string; severity?: string; relatedData: string[] }[] = [];

  if (!proposal.geojsonArea) {
    impacts.push({
      type: 'neutral',
      description: 'No specific geographic area defined for policy, impact analysis limited.',
      relatedData: []
    });
    return { policyId: proposal.id, impacts };
  }

  // Example: Check for land use change impact
  const landUseData = envData.find(d => d.type === 'land_use');
  if (landUseData && proposal.impactRules) {
    for (const rule of proposal.impactRules) {
      if (rule.condition.dataField.startsWith('land_use')) {
        // Simplified check: if policy area overlaps with a "critical" land_use type
        // This would involve actual geospatial intersection in a real tool
        const isOverlap = landUseData.geojson.features.some(feature => {
          // Placeholder for actual geospatial intersection logic
          // For a real implementation, libraries like turf.js would be used
          const featureType = feature.properties?.[rule.condition.dataField.split('.').pop() || ''];
          return featureType && String(featureType).includes(String(rule.condition.value));
        });

        if (isOverlap) {
          impacts.push({
            type: rule.impact.type,
            description: `Potential ${rule.impact.type} impact related to land use: ${rule.impact.description}`,
            severity: rule.impact.severity,
            relatedData: [landUseData.name]
          });
        }
      }
    }
  }

  // Example: Check for keyword-based impact on air quality
  if (proposal.keywords.includes('traffic reduction') || proposal.keywords.includes('emission control')) {
    const airQualityData = envData.find(d => d.type === 'air_quality');
    if (airQualityData) {
      impacts.push({
        type: 'positive',
        description: 'Policy aims to reduce traffic/emissions, likely positive impact on air quality.',
        severity: 'medium',
        relatedData: [airQualityData.name]
      });
    }
  } else if (proposal.keywords.includes('industrial zone expansion')) {
    const airQualityData = envData.find(d => d.type === 'air_quality');
    if (airQualityData) {
      impacts.push({
        type: 'negative',
        description: 'Policy involves industrial expansion, potential negative impact on air quality.',
        severity: 'medium',
        relatedData: [airQualityData.name]
      });
    }
  }

  if (impacts.length === 0) {
    impacts.push({
      type: 'neutral',
      description: 'No specific impacts detected based on current rules and data.',
      relatedData: []
    });
  }

  return { policyId: proposal.id, impacts };
}

//
// === test/oekoResonanz.test.ts ===
import { describe, it, expect } from 'vitest';
import { analyzePolicyImpact, PolicyProposal, EnvironmentalData, PolicyImpactRule } from '../src/oekoResonanz';

describe('oekoResonanz', () => {

  const mockEnvData: EnvironmentalData[] = [
    {
      id: 'air-quality-berlin-2023',
      type: 'air_quality',
      name: 'Berlin Air Quality 2023',
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { NO2: 35, PM10: 20 },
            geometry: { type: 'Point', coordinates: [13.4, 52.5] }
          }
        ]
      },
      properties: { unit: 'µg/m³' }
    },
    {
      id: 'land-use-berlin-mitte',
      type: 'land_use',
      name: 'Berlin Mitte Land Use',
      geojson: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { surface_type: 'sealed_surface', area_sqm: 10000 },
            geometry: { type: 'Polygon', coordinates: [[[13.39, 52.51], [13.41, 52.51], [13.41, 52.52], [13.39, 52.52], [13.39, 52.51]]] }
          }
        ]
      },
      properties: {}
    }
  ];

  it('should return limited analysis if no geojsonArea is defined for policy', () => {
    const proposal: PolicyProposal = {
      id: 'P001',
      title: 'General Environmental Protection Act',
      description: 'A broad act without specific geographic focus.',
      keywords: ['protection', 'environment']
    };
    const result = analyzePolicyImpact(proposal, mockEnvData);
    expect(result.policyId).toBe('P001');
    expect(result.impacts.length).toBe(1);
    expect(result.impacts[0].description).toContain('No specific geographic area defined');
  });

  it('should identify positive impacts based on keywords for air quality', () => {
    const proposal: PolicyProposal = {
      id: 'P002',
      title: 'Traffic Reduction Initiative',
      description: 'Policy to reduce inner-city traffic.',
      geojsonArea: { type: 'FeatureCollection', features: [] },
      keywords: ['traffic reduction', 'emission control']
    };
    const result = analyzePolicyImpact(proposal, mockEnvData);
    expect(result.policyId).toBe('P002');
    expect(result.impacts).toContainEqual(
      expect.objectContaining({
        type: 'positive',
        description: expect.stringContaining('positive impact on air quality'),
        severity: 'medium',
        relatedData: ['Berlin Air Quality 2023']
      })
    );
  });

  it('should identify negative impacts based on keywords for air quality', () => {
    const proposal: PolicyProposal = {
      id: 'P003',
      title: 'New Industrial Park Development',
      description: 'Plan for a new industrial zone.',
      geojsonArea: { type: 'FeatureCollection', features: [] },
      keywords: ['industrial zone expansion', 'job creation']
    };
    const result = analyzePolicyImpact(proposal, mockEnvData);
    expect(result.policyId).toBe('P003');
    expect(result.impacts).toContainEqual(
      expect.objectContaining({
        type: 'negative',
        description: expect.stringContaining('negative impact on air quality'),
        severity: 'medium',
        relatedData: ['Berlin Air Quality 2023']
      })
    );
  });

  it('should identify impacts based on policy rules and land use data (simplified overlap)', () => {
    const policyRules: PolicyImpactRule[] = [
      {
        condition: {
          dataField: 'land_use.properties.surface_type',
          operator: 'equals',
          value: 'sealed_surface'
        },
        impact: {
          type: 'negative',
          description: 'Increased flood risk due to sealed surfaces.',
          severity: 'high'
        }
      }
    ];

    const proposal: PolicyProposal = {
      id: 'P004',
      title: 'Urban Sealing Project',
      description: 'Policy to seal a certain urban area.',
      geojsonArea: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: [[[13.395, 52.515], [13.405, 52.515], [13.405, 52.525], [13.395, 52.525], [13.395, 52.515]]] }
          }
        ]
      },
      keywords: ['urban development'],
      impactRules: policyRules
    };

    const result = analyzePolicyImpact(proposal, mockEnvData);
    expect(result.policyId).toBe('P004');
    expect(result.impacts).toContainEqual(
      expect.objectContaining({
        type: 'negative',
        description: expect.stringContaining('Increased flood risk due to sealed surfaces.'),
        severity: 'high',
        relatedData: ['Berlin Mitte Land Use']
      })
    );
  });

  it('should return neutral if no specific impacts are detected', () => {
    const proposal: PolicyProposal = {
      id: 'P005',
      title: 'Cultural Event Funding',
      description: 'Policy to fund local cultural events.',
      geojsonArea: { type: 'FeatureCollection', features: [] },
      keywords: ['culture', 'funding']
    };
    const result = analyzePolicyImpact(proposal, mockEnvData);
    expect(result.policyId).toBe('P005');
    expect(result.impacts.length).toBe(1);
    expect(result.impacts[0].description).toContain('No specific impacts detected');
    expect(result.impacts[0].type).toBe('neutral');
  });

});