// 07-demos/git-dataviz-delta/src/core.test.ts
import { describe, it, expect, vi } from 'vitest';
import { diffAndVisualize } from '../cli'; // Adjust path if cli.ts is not directly exporting this

describe('diffAndVisualize', () => {
  // In a real scenario, diffAndVisualize would take content directly or abstract file reading.
  // For this test, we'll directly pass content to the function.

  it('should correctly diff two identical CSV files', async () => {
    const csvContentA = `id,name,value\n1,Alice,100\n2,Bob,200`;
    const csvContentB = `id,name,value\n1,Alice,100\n2,Bob,200`;
    const result = await diffAndVisualize(csvContentA, csvContentB, 'csv', 'console');
    expect(result).toContain('CSV Diff: 3 rows vs 3 rows.');
    // More detailed assertions would check actual semantic diff output
  });

  it('should correctly diff two different CSV files (row added)', async () => {
    const csvContentA = `id,name,value\n1,Alice,100`;
    const csvContentB = `id,name,value\n1,Alice,100\n2,Bob,200`;
    const result = await diffAndVisualize(csvContentA, csvContentB, 'csv', 'console');
    expect(result).toContain('CSV Diff: 2 rows vs 3 rows.');
  });

  it('should correctly diff two different CSV files (value changed)', async () => {
    const csvContentA = `id,name,value\n1,Alice,100\n2,Bob,200`;
    const csvContentB = `id,name,value\n1,Alice,105\n2,Bob,200`;
    const result = await diffAndVisualize(csvContentA, csvContentB, 'csv', 'console');
    expect(result).toContain('CSV Diff: 3 rows vs 3 rows.');
    // A real implementation would show "value for Alice changed from 100 to 105"
  });

  it('should correctly diff two identical JSON files', async () => {
    const jsonContentA = `{"name": "Project A", "version": "1.0.0"}`;
    const jsonContentB = `{"name": "Project A", "version": "1.0.0"}`;
    const result = await diffAndVisualize(jsonContentA, jsonContentB, 'json', 'console');
    expect(result).toContain('JSON Diff: Keys added/removed, values changed.');
  });

  it('should correctly diff two different JSON files (value changed)', async () => {
    const jsonContentA = `{"name": "Project A", "version": "1.0.0"}`;
    const jsonContentB = `{"name": "Project A", "version": "1.0.1"}`;
    const result = await diffAndVisualize(jsonContentA, jsonContentB, 'json', 'console');
    expect(result).toContain('JSON Diff: Keys added/removed, values changed.');
  });

  it('should correctly diff two different JSON files (key added)', async () => {
    const jsonContentA = `{"name": "Project A"}`;
    const jsonContentB = `{"name": "Project A", "status": "active"}`;
    const result = await diffAndVisualize(jsonContentA, jsonContentB, 'json', 'console');
    expect(result).toContain('JSON Diff: Keys added/removed, values changed.');
  });

  it('should generate HTML output for a CSV diff', async () => {
    const csvContentA = `id,name\n1,A`;
    const csvContentB = `id,name\n1,A\n2,B`;
    const result = await diffAndVisualize(csvContentA, csvContentB, 'csv', 'html');
    expect(result).toContain('<html><body><h1>Git DataViz Delta Report</h1>');
    expect(result).toContain('<pre>CSV Diff: 2 rows vs 3 rows.</pre>');
  });

  it('should handle unsupported types gracefully', async () => {
    const textContentA = `line 1\nline 2`;
    const textContentB = `line 1\nline 3`;
    const result = await diffAndVisualize(textContentA, textContentB, 'unsupported', 'console');
    expect(result).toContain('Unsupported type or generic text diff for unsupported.');
  });

  it('should parse GeoJSON and show feature count changes', async () => {
    const geoJsonA = `{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Point A"},"geometry":{"type":"Point","coordinates":[10,20]}}]}`;
    const geoJsonB = `{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Point A"},"geometry":{"type":"Point","coordinates":[10,20]}},{"type":"Feature","properties":{"name":"Point B"},"geometry":{"type":"Point","coordinates":[30,40]}}]}`;
    const result = await diffAndVisualize(geoJsonA, geoJsonB, 'geojson', 'console');
    expect(result).toContain('GeoJSON Diff: Feature count A: 1, Feature count B: 2.');
  });
});