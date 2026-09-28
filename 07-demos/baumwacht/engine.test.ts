/**
 * 07-demos/baumwacht/src/core/tree-ordinance-detector.ts
 *
 * Represents a geographical area with tree protection status.
 */
interface ProtectedArea {
  id: string;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  ordinanceId: string;
  protectionLevel: 'strict' | 'moderate' | 'specific';
}

/**
 * Represents a detected change in tree canopy.
 */
interface CanopyChange {
  id: string;
  geometry: GeoJSON.Polygon;
  changeType: 'loss' | 'gain'; // Loss implies potential felling, gain implies new growth/planting
  magnitude: number; // e.g., percentage of canopy area changed
  timestamp: string; // ISO date string
  sourceImagery: string; // e.g., "Sentinel-2, 2023-01-15"
}

/**
 * Represents a potential violation report.
 */
interface PotentialViolation {
  id: string;
  changeId: string;
  protectedAreaId: string;
  location: GeoJSON.Point;
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
  timestamp: string;
  imageryBeforeUrl: string;
  imageryAfterUrl: string;
}

/**
 * Core logic to detect potential tree ordinance violations.
 * Compares detected canopy changes against defined protected areas.
 */
class TreeOrdinanceDetector {
  private protectedAreas: ProtectedArea[];

  constructor(protectedAreas: ProtectedArea[]) {
    this.protectedAreas = protectedAreas;
  }

  /**
   * Identifies potential violations based on canopy changes.
   * @param changes An array of detected canopy changes.
   * @returns An array of potential violations.
   */
  async detectViolations(changes: CanopyChange[]): Promise<PotentialViolation[]> {
    const violations: PotentialViolation[] = [];

    for (const change of changes) {
      if (change.changeType === 'loss') { // Only interested in tree loss for violations
        for (const protectedArea of this.protectedAreas) {
          // Simplified intersection check: In a real scenario, use a robust GIS library
          // to check for actual spatial intersection and calculate overlap.
          const intersects = this.checkIntersection(change.geometry, protectedArea.geometry);

          if (intersects) {
            // Determine severity based on protection level and magnitude of change
            let severity: 'high' | 'medium' | 'low' = 'low';
            if (protectedArea.protectionLevel === 'strict' && change.magnitude > 0.5) {
              severity = 'high';
            } else if (protectedArea.protectionLevel === 'moderate' && change.magnitude > 0.3) {
              severity = 'medium';
            } else {
              severity = 'low';
            }

            violations.push({
              id: `violation-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              changeId: change.id,
              protectedAreaId: protectedArea.id,
              location: this.getCentroid(change.geometry), // Simplified for test
              severity: severity,
              description: `Potenzieller Verstoß: Baumkronenverlust (${(change.magnitude * 100).toFixed(0)}%) in geschütztem Bereich "${protectedArea.id}" (Schutzstufe: ${protectedArea.protectionLevel}).`,
              suggestedAction: 'Überprüfung vor Ort und Abgleich mit Genehmigungen erforderlich.',
              timestamp: new Date().toISOString(),
              imageryBeforeUrl: `https://example.com/imagery/${change.sourceImagery.split(',')[1].trim()}-before.jpg`,
              imageryAfterUrl: `https://example.com/imagery/${change.sourceImagery.split(',')[1].trim()}-after.jpg`
            });
          }
        }
      }
    }
    return violations;
  }

  /**
   * Placeholder for spatial intersection check.
   * In a real application, this would use a library like Turf.js or PostGIS.
   */
  private checkIntersection(geom1: GeoJSON.Geometry, geom2: GeoJSON.Geometry): boolean {
    // For simplicity, let's assume a basic bounding box overlap or a simple point in polygon check for tests.
    // In reality, this is complex.
    // Example: Check if any point of geom1 is within geom2's bounding box.
    // This is a highly simplified placeholder.
    return true; // Assume intersection for testing purposes if geometries are provided.
  }

  /**
   * Placeholder for centroid calculation.
   * In a real application, this would use a library like Turf.js.
   */
  private getCentroid(geom: GeoJSON.Geometry): GeoJSON.Point {
    // Return a dummy point for testing.
    return {
      type: 'Point',
      coordinates: [13.404954, 52.520008] // Berlin's approximate center
    };
  }
}

// 07-demos/baumwacht/test/tree-ordinance-detector.test.ts
import { describe, it, expect, beforeEach } from 'vitest';

describe('TreeOrdinanceDetector', () => {
  let protectedAreas: ProtectedArea[];
  let detector: TreeOrdinanceDetector;

  beforeEach(() => {
    protectedAreas = [
      {
        id: 'PA001',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.3, 52.4], [13.5, 52.4], [13.5, 52.6], [13.3, 52.6], [13.3, 52.4]]
          ]
        },
        ordinanceId: 'BSV-BER-2022-01',
        protectionLevel: 'strict'
      },
      {
        id: 'PA002',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.6, 52.5], [13.7, 52.5], [13.7, 52.7], [13.6, 52.7], [13.6, 52.5]]
          ]
        },
        ordinanceId: 'BSV-BER-2022-02',
        protectionLevel: 'moderate'
      }
    ];
    detector = new TreeOrdinanceDetector(protectedAreas);
  });

  it('should detect a high-severity violation for tree loss in a strict protection area', async () => {
    const changes: CanopyChange[] = [
      {
        id: 'CC001',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.35, 52.45], [13.45, 52.45], [13.45, 52.55], [13.35, 52.55], [13.35, 52.45]] // Overlaps PA001
          ]
        },
        changeType: 'loss',
        magnitude: 0.6, // High loss
        timestamp: '2023-02-01T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-02-01'
      }
    ];

    // Mock the intersection check for this specific test case
    detector['checkIntersection'] = (g1, g2) => {
      // Simulate intersection with PA001
      return JSON.stringify(g2) === JSON.stringify(protectedAreas[0].geometry);
    };

    const violations = await detector.detectViolations(changes);
    expect(violations).toHaveLength(1);
    expect(violations[0].severity).toBe('high');
    expect(violations[0].protectedAreaId).toBe('PA001');
    expect(violations[0].changeId).toBe('CC001');
    expect(violations[0].description).toContain('Baumkronenverlust (60%)');
  });

  it('should detect a medium-severity violation for tree loss in a moderate protection area', async () => {
    const changes: CanopyChange[] = [
      {
        id: 'CC002',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.62, 52.52], [13.68, 52.52], [13.68, 52.58], [13.62, 52.58], [13.62, 52.52]] // Overlaps PA002
          ]
        },
        changeType: 'loss',
        magnitude: 0.4, // Medium loss
        timestamp: '2023-03-01T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-03-01'
      }
    ];

    // Mock the intersection check for this specific test case
    detector['checkIntersection'] = (g1, g2) => {
      // Simulate intersection with PA002
      return JSON.stringify(g2) === JSON.stringify(protectedAreas[1].geometry);
    };

    const violations = await detector.detectViolations(changes);
    expect(violations).toHaveLength(1);
    expect(violations[0].severity).toBe('medium');
    expect(violations[0].protectedAreaId).toBe('PA002');
    expect(violations[0].changeId).toBe('CC002');
    expect(violations[0].description).toContain('Baumkronenverlust (40%)');
  });

  it('should not detect a violation if change is tree gain', async () => {
    const changes: CanopyChange[] = [
      {
        id: 'CC003',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.35, 52.45], [13.45, 52.45], [13.45, 52.55], [13.35, 52.55], [13.35, 52.45]]
          ]
        },
        changeType: 'gain', // Not a loss
        magnitude: 0.2,
        timestamp: '2023-04-01T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-04-01'
      }
    ];
    const violations = await detector.detectViolations(changes);
    expect(violations).toHaveLength(0);
  });

  it('should not detect a violation if no intersection with protected areas', async () => {
    const changes: CanopyChange[] = [
      {
        id: 'CC004',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[14.0, 53.0], [14.1, 53.0], [14.1, 53.1], [14.0, 53.1], [14.0, 53.0]] // Outside any protected area
          ]
        },
        changeType: 'loss',
        magnitude: 0.8,
        timestamp: '2023-05-01T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-05-01'
      }
    ];

    // Mock the intersection check to return false for all protected areas
    detector['checkIntersection'] = (g1, g2) => false;

    const violations = await detector.detectViolations(changes);
    expect(violations).toHaveLength(0);
  });

  it('should handle multiple changes and protected areas correctly', async () => {
    const changes: CanopyChange[] = [
      {
        id: 'CC005',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.35, 52.45], [13.45, 52.45], [13.45, 52.55], [13.35, 52.55], [13.35, 52.45]]
          ]
        },
        changeType: 'loss',
        magnitude: 0.7,
        timestamp: '2023-06-01T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-06-01'
      },
      {
        id: 'CC006',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.62, 52.52], [13.68, 52.52], [13.68, 52.58], [13.62, 52.58], [13.62, 52.52]]
          ]
        },
        changeType: 'loss',
        magnitude: 0.35,
        timestamp: '2023-06-02T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-06-02'
      },
      {
        id: 'CC007', // Non-violating change
        geometry: {
          type: 'Polygon',
          coordinates: [
            [[13.8, 52.8], [13.9, 52.8], [13.9, 52.9], [13.8, 52.9], [13.8, 52.8]]
          ]
        },
        changeType: 'loss',
        magnitude: 0.1,
        timestamp: '2023-06-03T10:00:00Z',
        sourceImagery: 'Sentinel-2, 2023-06-03'
      }
    ];

    // Mock intersection for specific protected areas
    detector['checkIntersection'] = (g1, g2) => {
      const g1Str = JSON.stringify(g1);
      const pa1Str = JSON.stringify(protectedAreas[0].geometry);
      const pa2Str = JSON.stringify(protectedAreas[1].geometry);

      if (g1Str.includes('13.35,52.45') && JSON.stringify(g2) === pa1Str) return true; // CC005 intersects PA001
      if (g1Str.includes('13.62,52.52') && JSON.stringify(g2) === pa2Str) return true; // CC006 intersects PA002
      return false; // Other cases don't intersect
    };

    const violations = await detector.detectViolations(changes);
    expect(violations).toHaveLength(2); // Two violations expected
    expect(violations.some(v => v.changeId === 'CC005' && v.severity === 'high')).toBe(true);
    expect(violations.some(v => v.changeId === 'CC006' && v.severity === 'medium')).toBe(true);
    expect(violations.every(v => v.changeId !== 'CC007')).toBe(true); // CC007 should not result in a violation due to no intersection
  });
});