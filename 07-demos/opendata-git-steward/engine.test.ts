/**
 * 07-demos/opendata-git-steward/tests/validator.test.ts
 * 
 * This file contains a comprehensive test suite for the `OpenDataValidator` class
 * using Vitest. It covers various scenarios for CSV, JSON, and GeoJSON validation,
 * including correct data, missing required fields, invalid data types, and structural errors.
 */

import { describe, it, expect, vi } from 'vitest';
import { OpenDataValidator, DataSchema, ValidationError } from '../src/validator';

// Mock external libraries for isolated testing. In a real project, these might be global mocks or configured in vitest.config.ts
// For this snippet, we'll use inline mocks or assume they are available in a test environment.

const mockPapaParse = { 
  parse: (csvString: string, config: any) => {
    // A simplified mock that handles basic header parsing and error simulation
    const lines = csvString.split('\n');
    const header = config.header ? lines[0].split(',') : [];
    const data = lines.slice(config.header ? 1 : 0).filter(line => line.trim() !== '').map(line => {
      const values = line.split(',');
      if (config.header) {
        const row: { [key: string]: string } = {};
        header.forEach((h, i) => row[h.trim()] = values[i] ? values[i].trim() : '');
        return row;
      }
      return values;
    });
    
    const errors: any[] = [];
    // Simulate a basic parsing error for malformed CSV
    if (csvString.includes('MALFORMED_CSV')) {
      errors.push({ message: 'Simulated CSV parsing error', row: 0, code: 'BadData' });
    }

    return { data, errors, meta: { fields: header.map(h => h.trim()) } };
  }
};

const mockAjv = function(options: any) {
  this.compile = (schema: any) => {
    return (data: any) => {
      const errors: any[] = [];
      let isValid = true;

      // Basic required property check
      if (schema.required) {
        schema.required.forEach((prop: string) => {
          if (data[prop] === undefined) {
            isValid = false;
            errors.push({ instancePath: '/', message: `must have required property '${prop}'`, keyword: 'required' });
          }
        });
      }

      // Basic type check for properties
      if (schema.properties) {
        for (const prop in schema.properties) {
          if (data[prop] !== undefined) {
            const propSchema = schema.properties[prop];
            if (propSchema.type === 'number' && typeof data[prop] !== 'number') {
              isValid = false;
              errors.push({ instancePath: `/${prop}`, message: 'must be number', keyword: 'type', params: { type: 'number' } });
            }
            if (propSchema.type === 'string' && typeof data[prop] !== 'string') {
              isValid = false;
              errors.push({ instancePath: `/${prop}`, message: 'must be string', keyword: 'type', params: { type: 'string' } });
            }
            if (propSchema.const !== undefined && data[prop] !== propSchema.const) {
                isValid = false;
                errors.push({ instancePath: `/${prop}`, message: `must be equal to constant ${propSchema.const}`, keyword: 'const', params: { allowedValue: propSchema.const } });
            }
          }
        }
      }
      
      // Simplified GeoJSON type check for top-level only
      if (schema.type === 'object' && schema.properties?.type?.const === 'FeatureCollection') {
          if (data.type !== 'FeatureCollection') {
              isValid = false;
              errors.push({ instancePath: '/type', message: 'must be equal to constant FeatureCollection', keyword: 'const', params: { allowedValue: 'FeatureCollection' } });
          }
      }

      validate.errors = errors.length > 0 ? errors : null;
      return isValid;
    };
  };
};

// Mock the dynamic imports for papaparse and ajv
vi.mock('papaparse', () => ({
  default: mockPapaParse
}));
vi.mock('ajv', () => ({
  default: mockAjv
}));

describe('OpenDataValidator', () => {

  // Test CSV validation
  it('should validate a correct CSV file', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'id', type: 'number', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'date', type: 'date' }
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'id,name,date\n1,Test A,2023-01-01\n2,Test B,2023-01-02';
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect missing required CSV headers', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'id', type: 'number', required: true },
        { name: 'name', type: 'string', required: true }
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'id,description\n1,Some text';
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: 'Missing required CSV headers: name',
      severity: 'error'
    }));
  });

  it('should detect invalid data types in CSV', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'id', type: 'number', required: true },
        { name: 'name', type: 'string', required: true }
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'id,name\nA,Test A';
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: "Field 'id' expected number, got 'A'",
      severity: 'error',
      row: 1,
      column: 'id'
    }));
  });

  it('should detect missing required CSV fields', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'id', type: 'number', required: true },
        { name: 'name', type: 'string', required: true }
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'id,name\n1,'; // name is missing
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: "Required field 'name' is empty",
      severity: 'error',
      row: 2,
      column: 'name'
    }));
  });

  it('should detect CSV data not matching pattern', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'postcode', type: 'string', pattern: '^\\d{5}$' } // German postcode
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'postcode\n1234\n123456'; // Invalid postcodes
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining("does not match pattern '^\\d{5}$'"),
      row: 1
    }));
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining("does not match pattern '^\\d{5}$'"),
      row: 2
    }));
  });

  it('should detect invalid date format in CSV', async () => {
    const schema: DataSchema = {
      type: 'csv',
      fields: [
        { name: 'event_date', type: 'date' }
      ]
    };
    const validator = new OpenDataValidator(schema);
    const csvContent = 'event_date\nnot-a-date\n2023-13-01'; // Invalid dates
    const result = await validator.validate(csvContent, 'test.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining("expected a valid date format"),
      row: 1
    }));
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining("expected a valid date format"),
      row: 2
    }));
  });

  // Test JSON validation
  it('should validate a correct JSON file against schema', async () => {
    const schema: DataSchema = {
      type: 'json',
      jsonSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    };
    const validator = new OpenDataValidator(schema);
    const jsonContent = '{"id": 1, "name": "Item A"}';
    const result = await validator.validate(jsonContent, 'test.json');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect JSON schema validation errors', async () => {
    const schema: DataSchema = {
      type: 'json',
      jsonSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    };
    const validator = new OpenDataValidator(schema);
    const jsonContent = '{"id": "invalid", "name": "Item B"}'; // id should be number
    const result = await validator.validate(jsonContent, 'test.json');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: "JSON Schema error: must be number ({"type":"number"})",
      path: "test.json/id",
      severity: 'error',
      code: 'type'
    }));
  });

  it('should detect missing required fields in JSON', async () => {
    const schema: DataSchema = {
      type: 'json',
      jsonSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      }
    };
    const validator = new OpenDataValidator(schema);
    const jsonContent = '{"id": 1}'; // name is missing
    const result = await validator.validate(jsonContent, 'test.json');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: "JSON Schema error: must have required property 'name'",
      path: "test.json/",
      severity: 'error',
      code: 'required'
    }));
  });

  // Test GeoJSON validation
  it('should validate a correct GeoJSON FeatureCollection', async () => {
    const schema: DataSchema = {
      type: 'geojson',
      jsonSchema: { // Can combine with general JSON Schema for properties
        type: 'object',
        properties: {
          type: { const: 'FeatureCollection' },
          features: { type: 'array' }
        },
        required: ['type', 'features']
      }
    };
    const validator = new OpenDataValidator(schema);
    const geojsonContent = `{
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": { "type": "Point", "coordinates": [10.0, 20.0] },
          "properties": { "name": "Location A" }
        }
      ]
    }`;
    const result = await validator.validate(geojsonContent, 'test.geojson');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should detect invalid GeoJSON top-level type', async () => {
    const schema: DataSchema = {
      type: 'geojson'
    };
    const validator = new OpenDataValidator(schema);
    const geojsonContent = `{"type": "InvalidCollection", "features": []}`; // Invalid type for GeoJSON
    const result = await validator.validate(geojsonContent, 'test.geojson');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: 'GeoJSON must have a valid top-level "type" (FeatureCollection, Feature, GeometryCollection).',
      path: 'test.geojson.type',
      severity: 'error'
    }));
  });

  it('should handle empty file', async () => {
    const schema: DataSchema = { type: 'csv' };
    const validator = new OpenDataValidator(schema);
    const result = await validator.validate('', 'empty.csv');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: 'File is empty or contains only whitespace.',
      severity: 'error'
    }));
  });

  it('should handle malformed JSON', async () => {
    const schema: DataSchema = { type: 'json' };
    const validator = new OpenDataValidator(schema);
    const malformedJson = '{"id": 1, "name": "Item A"'; // Missing closing brace
    const result = await validator.validate(malformedJson, 'malformed.json');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining('General validation error: Unexpected end of JSON input'),
      severity: 'error'
    }));
  });

  it('should handle unsupported schema type', async () => {
    const schema: DataSchema = { type: 'xml' as any }; // Cast to any to simulate unsupported type
    const validator = new OpenDataValidator(schema);
    const content = '<data><item>1</item></data>';
    const result = await validator.validate(content, 'test.xml');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining<Partial<ValidationError>>({
      message: expect.stringContaining("Unsupported schema type: xml"),
      severity: 'error'
    }));
  });
});