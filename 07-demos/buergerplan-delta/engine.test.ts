// 07-demos/buergerplan-delta/src/index.ts
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-sidebar-v2/css/leaflet-sidebar.min.css';
import '@geoman-io/leaflet-sidebar-v2';
import '@geoman-io/leaflet-editable/dist/leaflet-editable.css';
import '@geoman-io/leaflet-editable';

import { initMap, loadGeoJsonLayer, setupDrawingTools } from './map';
import { calculateGeoJsonDiff } from './diff';

document.addEventListener('DOMContentLoaded', () => {
    const mapElementId = 'map';
    const initialGeoJsonUrl = '/data/official_plan.geojson';
    const userProposedGeoJsonUrl = '/data/user_proposal.geojson';

    const map = initMap(mapElementId, [52.52, 13.40], 12);

    loadGeoJsonLayer(map, initialGeoJsonUrl, { style: { color: 'blue', weight: 3, opacity: 0.7 } })
        .then(officialLayer => {
            console.log('Official plan loaded:', officialLayer);
            const editableLayer = setupDrawingTools(map);
            console.log('Drawing tools enabled.');

            loadGeoJsonLayer(map, userProposedGeoJsonUrl, { style: { color: 'green', weight: 3, opacity: 0.7, dashArray: '5, 5' } })
                .then(userLayer => {
                    console.log('User proposal loaded:', userLayer);
                })
                .catch(err => console.log('No existing user proposal to load or error:', err));

            const diffButton = document.createElement('button');
            diffButton.textContent = 'Calculate Diff';
            diffButton.style.position = 'absolute';
            diffButton.style.zIndex = '1000';
            diffButton.style.top = '10px';
            diffButton.style.right = '10px';
            document.body.appendChild(diffButton);

            diffButton.addEventListener('click', async () => {
                const userModifiedGeoJson = editableLayer.toGeoJSON();
                const officialGeoJson = officialLayer.toGeoJSON();

                console.log('Calculating diff...');
                const diffResult = await calculateGeoJsonDiff(officialGeoJson, userModifiedGeoJson);
                console.log('GeoJSON Diff:', diffResult);
                alert('Diff calculated. Check console for details.');
            });

        })
        .catch(error => {
            console.error('Failed to load official plan:', error);
            alert('Error loading official plan data.');
        });
});

// src/map.ts
export function initMap(elementId: string, center: [number, number], zoom: number): L.Map {
    const map = L.map(elementId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{x}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    (map as any).editTools = new (L.Editable as any)(map);

    return map;
}

export async function loadGeoJsonLayer(map: L.Map, url: string, options?: L.GeoJSONOptions): Promise<L.GeoJSON> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geojson = await response.json();
    const layer = L.geoJSON(geojson, options).addTo(map);
    map.fitBounds(layer.getBounds());
    return layer;
}

export function setupDrawingTools(map: L.Map): L.FeatureGroup {
    const editableLayer = L.featureGroup().addTo(map);
    (editableLayer as any).enableEdit();
    return editableLayer;
}

// src/diff.ts
export async function calculateGeoJsonDiff(
    original: GeoJSON.FeatureCollection,
    modified: GeoJSON.FeatureCollection
): Promise<any> {
    return new Promise(resolve => {
        setTimeout(() => {
            const originalFeatures = original.features.map(f => f.properties?.id || JSON.stringify(f.geometry));
            const modifiedFeatures = modified.features.map(f => f.properties?.id || JSON.stringify(f.geometry));

            const added = modifiedFeatures.filter(f => !originalFeatures.includes(f));
            const removed = originalFeatures.filter(f => !modifiedFeatures.includes(f));

            resolve({
                summary: `Detected ${added.length} added, ${removed.length} removed features.`,
                addedFeatures: added.length > 0 ? modified.features.filter(f => added.includes(f.properties?.id || JSON.stringify(f.geometry))) : [],
                removedFeatures: removed.length > 0 ? original.features.filter(f => removed.includes(f.properties?.id || JSON.stringify(f.geometry))) : []
            });
        }, 100);
    });
}

// 07-demos/buergerplan-delta/test/diff.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateGeoJsonDiff } from '../src/diff';
import { loadGeoJsonLayer, initMap, setupDrawingTools } from '../src/map';

vi.mock('leaflet', () => {
    const mockMap = {
        setView: vi.fn().mockReturnThis(),
        addLayer: vi.fn().mockReturnThis(),
        removeLayer: vi.fn().mockReturnThis(),
        fitBounds: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
        off: vi.fn().mockReturnThis(),
        editTools: {
            enable: vi.fn(),
            disable: vi.fn(),
            featuresLayer: {
                toGeoJSON: vi.fn().mockReturnValue({ type: 'FeatureCollection', features: [] })
            }
        },
        _leaflet_id: 1
    };
    const mockTileLayer = vi.fn(() => mockMap);
    const mockGeoJSON = vi.fn((geojson, options) => ({
        addTo: vi.fn().mockReturnThis(),
        remove: vi.fn().mockReturnThis(),
        getBounds: vi.fn(() => ({ isValid: vi.fn(() => true), getNorthEast: vi.fn(), getSouthWest: vi.fn() })),
        toGeoJSON: vi.fn(() => geojson),
        _leaflet_id: Math.random()
    }));
    const mockFeatureGroup = vi.fn(() => ({
        addTo: vi.fn().mockReturnThis(),
        toGeoJSON: vi.fn().mockReturnValue({ type: 'FeatureCollection', features: [] }),
        enableEdit: vi.fn(),
        addLayer: vi.fn(),
        removeLayer: vi.fn(),
        eachLayer: vi.fn((cb) => {}),
        getLayers: vi.fn(() => [])
    }));
    return {
        default: {
            map: vi.fn(() => mockMap),
            tileLayer: mockTileLayer,
            geoJSON: mockGeoJSON,
            featureGroup: mockFeatureGroup,
            Editable: vi.fn(() => ({
                enable: vi.fn(),
                disable: vi.fn(),
                featuresLayer: {
                    toGeoJSON: vi.fn().mockReturnValue({ type: 'FeatureCollection', features: [] })
                }
            })),
            Layer: {
                include: vi.fn()
            },
            Control: {
                extend: vi.fn(() => vi.fn())
            },
            Util: {
                setOptions: vi.fn()
            },
            DomUtil: {
                get: vi.fn()
            },
            Popup: vi.fn(() => ({ setLatLng: vi.fn().mockReturnThis(), setContent: vi.fn().mockReturnThis(), openOn: vi.fn() }))
        }
    };
});

vi.mock('../src/map', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        loadGeoJsonLayer: vi.fn(async (map, url, options) => {
            const mockGeoJSONData = {
                '/data/official_plan.geojson': {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', id: 'f1', properties: { name: 'Park' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]] } },
                        { type: 'Feature', id: 'f2', properties: { name: 'Road' }, geometry: { type: 'LineString', coordinates: [[2, 2], [3, 3]] } }
                    ]
                },
                '/data/user_proposal_add.geojson': {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', id: 'f1', properties: { name: 'Park' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]] } },
                        { type: 'Feature', id: 'f2', properties: { name: 'Road' }, geometry: { type: 'LineString', coordinates: [[2, 2], [3, 3]] } },
                        { type: 'Feature', id: 'f3', properties: { name: 'New Building' }, geometry: { type: 'Point', coordinates: [5, 5] } }
                    ]
                },
                '/data/user_proposal_remove.geojson': {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', id: 'f1', properties: { name: 'Park' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]] } }
                    ]
                },
                '/data/user_proposal_modify.geojson': {
                    type: 'FeatureCollection',
                    features: [
                        { type: 'Feature', id: 'f1', properties: { name: 'Park Extension' }, geometry: { type: 'Polygon', coordinates: [[[0, 0], [0, 1.5], [1.5, 1.5], [1.5, 0], [0, 0]]] } },
                        { type: 'Feature', id: 'f2', properties: { name: 'Road' }, geometry: { type: 'LineString', coordinates: [[2, 2], [3, 3]] } }
                    ]
                },
                '/data/empty.geojson': {
                    type: 'FeatureCollection',
                    features: []
                }
            };
            const geojson = mockGeoJSONData[url as keyof typeof mockGeoJSONData];
            if (!geojson) {
                throw new Error(`Mock fetch error: No data for URL ${url}`);
            }
            const mockLayer = {
                addTo: vi.fn().mockReturnThis(),
                getBounds: vi.fn(() => ({ isValid: vi.fn(() => true), getNorthEast: vi.fn(), getSouthWest: vi.fn() })),
                toGeoJSON: vi.fn(() => geojson),
                _leaflet_id: Math.random()
            };
            return Promise.resolve(mockLayer as any);
        }),
        initMap: vi.fn(() => (global.L as any).map()),
        setupDrawingTools: vi.fn(() => (global.L as any).featureGroup())
    };
});

describe('calculateGeoJsonDiff', () => {
    it('should correctly identify added features', async () => {
        const original = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };
        const modified = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } },
                { type: 'Feature', id: 'f2', properties: {}, geometry: { type: 'Point', coordinates: [1, 1] } }
            ]
        };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(1);
        expect(diff.addedFeatures[0].id).toBe('f2');
        expect(diff.removedFeatures).toHaveLength(0);
    });

    it('should correctly identify removed features', async () => {
        const original = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } },
                { type: 'Feature', id: 'f2', properties: {}, geometry: { type: 'Point', coordinates: [1, 1] } }
            ]
        };
        const modified = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(0);
        expect(diff.removedFeatures).toHaveLength(1);
        expect(diff.removedFeatures[0].id).toBe('f2');
    });

    it('should identify no changes for identical collections', async () => {
        const geojson = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };

        const diff = await calculateGeoJsonDiff(geojson, geojson);
        expect(diff.addedFeatures).toHaveLength(0);
        expect(diff.removedFeatures).toHaveLength(0);
    });

    it('should handle empty input collections', async () => {
        const original = { type: 'FeatureCollection', features: [] };
        const modified = { type: 'FeatureCollection', features: [] };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(0);
        expect(diff.removedFeatures).toHaveLength(0);
    });

    it('should handle adding features to an empty collection', async () => {
        const original = { type: 'FeatureCollection', features: [] };
        const modified = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(1);
        expect(diff.addedFeatures[0].id).toBe('f1');
        expect(diff.removedFeatures).toHaveLength(0);
    });

    it('should handle removing all features from a collection', async () => {
        const original = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: {}, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };
        const modified = { type: 'FeatureCollection', features: [] };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(0);
        expect(diff.removedFeatures).toHaveLength(1);
        expect(diff.removedFeatures[0].id).toBe('f1');
    });

    it('should not detect modified features with current simplistic diff', async () => {
        const original = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: { name: 'Old' }, geometry: { type: 'Point', coordinates: [0, 0] } }
            ]
        };
        const modified = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', id: 'f1', properties: { name: 'New' }, geometry: { type: 'Point', coordinates: [0, 1] } }
            ]
        };

        const diff = await calculateGeoJsonDiff(original, modified);
        expect(diff.addedFeatures).toHaveLength(0);
        expect(diff.removedFeatures).toHaveLength(0);
    });
});

describe('Integration test: Map initialization and loading', () => {
    let mapDiv: HTMLDivElement;
    beforeEach(() => {
        mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        document.body.appendChild(mapDiv);
        vi.clearAllMocks();
    });

    afterEach(() => {
        document.body.removeChild(mapDiv);
    });

    it('should initialize the map and load official GeoJSON layer', async () => {
        const mapElementId = 'map';
        const initialGeoJsonUrl = '/data/official_plan.geojson';

        const map = initMap(mapElementId, [52.52, 13.40], 12);
        expect(map).toBeDefined();
        expect((global.L as any).map).toHaveBeenCalledWith(mapElementId);
        expect(map.setView).toHaveBeenCalledWith([52.52, 13.40], 12);
        expect((global.L as any).tileLayer).toHaveBeenCalled();

        const officialLayer = await loadGeoJsonLayer(map, initialGeoJsonUrl);
        expect(officialLayer).toBeDefined();
        expect(loadGeoJsonLayer).toHaveBeenCalledWith(map, initialGeoJsonUrl, expect.any(Object));
        expect(officialLayer.addTo).toHaveBeenCalledWith(map);
        expect(officialLayer.getBounds).toHaveBeenCalled();
        expect(map.fitBounds).toHaveBeenCalled();
    });

    it('should setup drawing tools on the map', () => {
        const map = initMap('map', [0,0], 10);
        const editableLayer = setupDrawingTools(map);
        expect(editableLayer).toBeDefined();
        expect((global.L as any).featureGroup).toHaveBeenCalled();
        expect(editableLayer.addTo).toHaveBeenCalledWith(map);
        expect(editableLayer.enableEdit).toHaveBeenCalled();
    });
});
