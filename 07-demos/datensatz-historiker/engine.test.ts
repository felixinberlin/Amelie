import { describe, it, expect } from 'vitest';

export type DataChangeType = 'added' | 'modified' | 'deleted';

export interface DataChange {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
}

export interface DataChangeRecord {
  datasetId: string;
  fileName: string;
  recordIdentifier: string;
  changeType: DataChangeType;
  changes?: DataChange[];
  oldRecord?: Record<string, any>;
  newRecord?: Record<string, any>;
  timestamp: string;
  committer: string;
  message: string;
}

describe('DataChangeRecord', () => {
  it('should correctly represent an added record', () => {
    const newRecord = { id: '1', name: 'New Tree', location: 'Park', species: 'Oak' };
    const record: DataChangeRecord = {
      datasetId: 'berlin-strassenbaeume',
      fileName: 'strassenbaeume.csv',
      recordIdentifier: '1',
      changeType: 'added',
      newRecord: newRecord,
      timestamp: new Date().toISOString(),
      committer: 'system-bot',
      message: 'Added new tree record: New Tree (ID: 1)'
    };

    expect(record.changeType).toBe('added');
    expect(record.newRecord).toEqual(newRecord);
    expect(record.changes).toBeUndefined();
  });

  it('should correctly represent a modified record with specific field changes', () => {
    const oldRecord = { id: '2', name: 'Old Tree', location: 'Street', species: 'Maple' };
    const newRecord = { id: '2', name: 'Updated Tree', location: 'Street', species: 'Maple' };
    const record: DataChangeRecord = {
      datasetId: 'berlin-strassenbaeume',
      fileName: 'strassenbaeume.csv',
      recordIdentifier: '2',
      changeType: 'modified',
      oldRecord: oldRecord,
      newRecord: newRecord,
      changes: [
        { field: 'name', oldValue: 'Old Tree', newValue: 'Updated Tree' }
      ],
      timestamp: new Date().toISOString(),
      committer: 'data-editor',
      message: 'Updated tree name for ID 2'
    };

    expect(record.changeType).toBe('modified');
    expect(record.oldRecord).toEqual(oldRecord);
    expect(record.newRecord).toEqual(newRecord);
    expect(record.changes).toHaveLength(1);
    expect(record.changes![0].field).toBe('name');
    expect(record.changes![0].newValue).toBe('Updated Tree');
  });

  it('should correctly represent a deleted record', () => {
    const oldRecord = { id: '3', name: 'Deleted Tree', location: 'Forest', species: 'Birch' };
    const record: DataChangeRecord = {
      datasetId: 'berlin-strassenbaeume',
      fileName: 'strassenbaeume.csv',
      recordIdentifier: '3',
      changeType: 'deleted',
      oldRecord: oldRecord,
      timestamp: new Date().toISOString(),
      committer: 'system-bot',
      message: 'Deleted tree record: Deleted Tree (ID: 3)'
    };

    expect(record.changeType).toBe('deleted');
    expect(record.oldRecord).toEqual(oldRecord);
    expect(record.newRecord).toBeUndefined();
    expect(record.changes).toBeUndefined();
  });

  it('should handle null values in changes', () => {
    const oldRecord = { id: '4', name: 'Tree with no species', species: null };
    const newRecord = { id: '4', name: 'Tree with no species', species: 'Pine' };
    const record: DataChangeRecord = {
      datasetId: 'berlin-strassenbaeume',
      fileName: 'strassenbaeume.csv',
      recordIdentifier: '4',
      changeType: 'modified',
      oldRecord: oldRecord,
      newRecord: newRecord,
      changes: [
        { field: 'species', oldValue: null, newValue: 'Pine' }
      ],
      timestamp: new Date().toISOString(),
      committer: 'data-editor',
      message: 'Added species for ID 4'
    };
    expect(record.changes![0].oldValue).toBeNull();
    expect(record.changes![0].newValue).toBe('Pine');
  });
});