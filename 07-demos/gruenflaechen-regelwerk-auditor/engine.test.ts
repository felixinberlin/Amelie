import { describe, it, expect } from 'vitest';

// Mock data structure for a simplified parcel
interface ParcelData {
  id: string;
  greenAreaRatio: number; // e.g., 0.0 to 1.0
  isProtectedTreeNearby: boolean;
  buildingHeight: number; // in meters
  allowedBuildingHeight: number; // in meters
}

// Simplified rule engine function to check green space compliance
function checkGreenSpaceCompliance(parcel: ParcelData, minGreenRatio: number): boolean {
  return parcel.greenAreaRatio >= minGreenRatio;
}

// Simplified rule engine function to check building height compliance
function checkBuildingHeightCompliance(parcel: ParcelData): boolean {
  return parcel.buildingHeight <= parcel.allowedBuildingHeight;
}

// Simplified rule engine function to check protected tree proximity
function checkProtectedTreeProximity(parcel: ParcelData, ruleRequiresSeparation: boolean): boolean {
  if (ruleRequiresSeparation) {
    return !parcel.isProtectedTreeNearby;
  }
  return true; // No specific rule, or tree proximity is allowed
}

describe('Urban Green Space Regulatory Auditor (UGRA) - Compliance Checks', () => {
  it('should identify a parcel as compliant if green space ratio is met', () => {
    const compliantParcel: ParcelData = {
      id: 'P001',
      greenAreaRatio: 0.45,
      isProtectedTreeNearby: false,
      buildingHeight: 10,
      allowedBuildingHeight: 12
    };
    expect(checkGreenSpaceCompliance(compliantParcel, 0.3)).toBe(true);
  });

  it('should identify a parcel as non-compliant if green space ratio is not met', () => {
    const nonCompliantParcel: ParcelData = {
      id: 'P002',
      greenAreaRatio: 0.2,
      isProtectedTreeNearby: false,
      buildingHeight: 10,
      allowedBuildingHeight: 12
    };
    expect(checkGreenSpaceCompliance(nonCompliantParcel, 0.3)).toBe(false);
  });

  it('should identify a parcel as compliant if building height is within limits', () => {
    const compliantParcel: ParcelData = {
      id: 'P003',
      greenAreaRatio: 0.5,
      isProtectedTreeNearby: true,
      buildingHeight: 8,
      allowedBuildingHeight: 10
    };
    expect(checkBuildingHeightCompliance(compliantParcel)).toBe(true);
  });

  it('should identify a parcel as non-compliant if building height exceeds limits', () => {
    const nonCompliantParcel: ParcelData = {
      id: 'P004',
      greenAreaRatio: 0.5,
      isProtectedTreeNearby: true,
      buildingHeight: 15,
      allowedBuildingHeight: 10
    };
    expect(checkBuildingHeightCompliance(nonCompliantParcel)).toBe(false);
  });

  it('should identify a parcel as non-compliant if a protected tree is nearby and rule requires separation', () => {
    const nonCompliantParcel: ParcelData = {
      id: 'P005',
      greenAreaRatio: 0.5,
      isProtectedTreeNearby: true,
      buildingHeight: 8,
      allowedBuildingHeight: 10
    };
    expect(checkProtectedTreeProximity(nonCompliantParcel, true)).toBe(false);
  });

  it('should identify a parcel as compliant if a protected tree is nearby but no separation rule applies', () => {
    const compliantParcel: ParcelData = {
      id: 'P006',
      greenAreaRatio: 0.5,
      isProtectedTreeNearby: true,
      buildingHeight: 8,
      allowedBuildingHeight: 10
    };
    expect(checkProtectedTreeProximity(compliantParcel, false)).toBe(true);
  });
});