import { describe, it, expect } from 'vitest';

// Assume this is part of a utility module for data processing
function normalizeDate(dateString: string): string | null {
  if (!dateString) return null;

  // Attempt to parse common German date formats (DD.MM.YYYY)
  const deDateMatch = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (deDateMatch) {
    const [_, day, month, year] = deDateMatch;
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  }

  // Attempt to parse common US date formats (MM/DD/YYYY)
  const usDateMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (usDateMatch) {
    const [_, month, day, year] = usDateMatch;
    return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
  }

  // Attempt to parse ISO 8601 (YYYY-MM-DD) which is already normalized
  const isoDateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateMatch) {
    return dateString;
  }

  // Fallback for unrecognised formats or invalid dates (can be extended with more robust parsing)
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    // console.error("Could not parse date:", dateString, e);
  }

  return null; // Return null if date cannot be normalized
}

describe('normalizeDate', () => {
  it('should normalize German DD.MM.YYYY format to YYYY-MM-DD', () => {
    expect(normalizeDate('25.12.2023')).toBe('2023-12-25');
  });

  it('should normalize US MM/DD/YYYY format to YYYY-MM-DD', () => {
    expect(normalizeDate('12/25/2023')).toBe('2023-12-25');
  });

  it('should return ISO 8601 YYYY-MM-DD as is', () => {
    expect(normalizeDate('2023-12-25')).toBe('2023-12-25');
  });

  it('should return null for invalid date strings', () => {
    expect(normalizeDate('not-a-date')).toBeNull();
    expect(normalizeDate('31.02.2023')).toBeNull(); // Invalid day for February
  });

  it('should handle empty or null input', () => {
    expect(normalizeDate('')).toBeNull();
    expect(normalizeDate(null as any)).toBeNull(); // Test with null explicitly
    expect(normalizeDate(undefined as any)).toBeNull(); // Test with undefined explicitly
  });

  it('should attempt to parse other valid date strings', () => {
    expect(normalizeDate('Dec 25 2023')).toBe('2023-12-25');
  });
});