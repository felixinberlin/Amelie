// 07-demos/kosmische-strahlen-visualisierer/src/utils/dataProcessor.ts
export interface CosmicRayEvent {
  detectorId: string;
  timestamp: number; // Unix timestamp in milliseconds
  counts: number; // Number of events detected in a given interval
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

export interface AggregatedData {
  time: number;
  totalCounts: number;
  detectorCounts: { [detectorId: string]: number };
}

/**
 * Processes a stream of raw cosmic ray events into aggregated data points
 * over a specified time window.
 * @param events An array of raw cosmic ray events.
 * @param windowMs The aggregation time window in milliseconds.
 * @returns An array of aggregated data points.
 */
export function aggregateCosmicRayData(
  events: CosmicRayEvent[],
  windowMs: number
): AggregatedData[] {
  if (!events || events.length === 0) {
    return [];
  }

  // Sort events by timestamp to ensure correct windowing
  events.sort((a, b) => a.timestamp - b.timestamp);

  const aggregated: AggregatedData[] = [];
  let currentWindowStart = events[0].timestamp - (events[0].timestamp % windowMs);
  let currentWindow: CosmicRayEvent[] = [];

  for (const event of events) {
    const eventWindowStart = event.timestamp - (event.timestamp % windowMs);

    if (eventWindowStart !== currentWindowStart) {
      if (currentWindow.length > 0) {
        aggregated.push(processWindow(currentWindow, currentWindowStart));
      }
      currentWindowStart = eventWindowStart;
      currentWindow = [];
    }
    currentWindow.push(event);
  }

  // Process the last window
  if (currentWindow.length > 0) {
    aggregated.push(processWindow(currentWindow, currentWindowStart));
  }

  return aggregated;
}

function processWindow(events: CosmicRayEvent[], windowTime: number): AggregatedData {
  let totalCounts = 0;
  const detectorCounts: { [detectorId: string]: number } = {};

  for (const event of events) {
    totalCounts += event.counts;
    detectorCounts[event.detectorId] = (detectorCounts[event.detectorId] || 0) + event.counts;
  }

  return {
    time: windowTime,
    totalCounts,
    detectorCounts,
  };
}

// 07-demos/kosmische-strahlen-visualisierer/src/tests/dataProcessor.test.ts
import { describe, it, expect } from 'vitest';
import { aggregateCosmicRayData, CosmicRayEvent, AggregatedData } from '../utils/dataProcessor';

describe('aggregateCosmicRayData', () => {
  it('should return an empty array for empty input', () => {
    expect(aggregateCosmicRayData([], 60 * 1000)).toEqual([]);
  });

  it('should aggregate events within a single time window', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'det1', timestamp: 1678886400000, counts: 5 }, // March 15, 2023 00:00:00 GMT
      { detectorId: 'det2', timestamp: 1678886415000, counts: 3 }, // 00:00:15
      { detectorId: 'det1', timestamp: 1678886430000, counts: 7 }, // 00:00:30
    ];
    const windowMs = 60 * 1000; // 1 minute window

    const expected: AggregatedData[] = [
      {
        time: 1678886400000, // Start of the minute
        totalCounts: 15,
        detectorCounts: { det1: 12, det2: 3 },
      },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });

  it('should aggregate events across multiple time windows', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'det1', timestamp: 1678886400000, counts: 5 }, // 00:00:00
      { detectorId: 'det2', timestamp: 1678886415000, counts: 3 }, // 00:00:15
      { detectorId: 'det1', timestamp: 1678886460000, counts: 10 }, // 00:01:00 (new window)
      { detectorId: 'det3', timestamp: 1678886475000, counts: 2 }, // 00:01:15
    ];
    const windowMs = 60 * 1000; // 1 minute window

    const expected: AggregatedData[] = [
      {
        time: 1678886400000, // 00:00:00
        totalCounts: 8,
        detectorCounts: { det1: 5, det2: 3 },
      },
      {
        time: 1678886460000, // 00:01:00
        totalCounts: 12,
        detectorCounts: { det1: 10, det3: 2 },
      },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });

  it('should handle events from different detectors correctly', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'detA', timestamp: 1678886400000, counts: 1 },
      { detectorId: 'detB', timestamp: 1678886410000, counts: 2 },
      { detectorId: 'detA', timestamp: 1678886420000, counts: 3 },
    ];
    const windowMs = 30 * 1000; // 30 second window

    const expected: AggregatedData[] = [
      {
        time: 1678886400000,
        totalCounts: 6,
        detectorCounts: { detA: 4, detB: 2 },
      },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });

  it('should handle unsorted input by sorting internally', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'det1', timestamp: 1678886430000, counts: 7 },
      { detectorId: 'det2', timestamp: 1678886415000, counts: 3 },
      { detectorId: 'det1', timestamp: 1678886400000, counts: 5 },
    ];
    const windowMs = 60 * 1000; // 1 minute window

    const expected: AggregatedData[] = [
      {
        time: 1678886400000,
        totalCounts: 15,
        detectorCounts: { det1: 12, det2: 3 },
      },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });

  it('should handle events that span multiple windows with some empty windows in between', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'det1', timestamp: 1678886400000, counts: 1 }, // 00:00
      { detectorId: 'det2', timestamp: 1678886405000, counts: 1 }, // 00:00
      { detectorId: 'det1', timestamp: 1678886520000, counts: 1 }, // 00:02 (skip 00:01)
    ];
    const windowMs = 60 * 1000; // 1 minute window

    const expected: AggregatedData[] = [
      {
        time: 1678886400000, // 00:00
        totalCounts: 2,
        detectorCounts: { det1: 1, det2: 1 },
      },
      {
        time: 1678886520000, // 00:02
        totalCounts: 1,
        detectorCounts: { det1: 1 },
      },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });

  it('should correctly handle a window size of 1ms for individual events', () => {
    const events: CosmicRayEvent[] = [
      { detectorId: 'det1', timestamp: 1000, counts: 1 },
      { detectorId: 'det2', timestamp: 1001, counts: 2 },
      { detectorId: 'det1', timestamp: 1002, counts: 3 },
    ];
    const windowMs = 1;

    const expected: AggregatedData[] = [
      { time: 1000, totalCounts: 1, detectorCounts: { det1: 1 } },
      { time: 1001, totalCounts: 2, detectorCounts: { det2: 2 } },
      { time: 1002, totalCounts: 3, detectorCounts: { det1: 3 } },
    ];

    expect(aggregateCosmicRayData(events, windowMs)).toEqual(expected);
  });
});