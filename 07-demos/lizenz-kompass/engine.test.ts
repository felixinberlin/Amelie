import { describe, it, expect } from 'vitest';
import { parseLicenseString, getLicenseDetails, buildCompatibilityMatrix, suggestLicense, LicenseIdentifier } from '../src/lizenz-kompass/core';

describe('Lizenz-Kompass Core Functions', () => {

  it('should parse known license strings correctly', () => {
    expect(parseLicenseString('CC-BY-4.0')).toBe('CC-BY-4.0');
    expect(parseLicenseString('ODC-BY 1.0')).toBe('ODC-BY-1.0');
    expect(parseLicenseString('Datenlizenz Deutschland – Namensnennung – Version 2.0')).toBe('DLDE-BY-2.0');
    expect(parseLicenseString('cc-by-sa-4.0')).toBe('CC-BY-SA-4.0');
    expect(parseLicenseString('CC0')).toBe('CC0-1.0'); // Assuming common alias
    expect(parseLicenseString('Unknown License')).toBeNull();
  });

  it('should return correct details for known licenses', () => {
    const ccby4 = getLicenseDetails('CC-BY-4.0');
    expect(ccby4).not.toBeNull();
    expect(ccby4?.name).toContain('Attribution 4.0');
    expect(ccby4?.requiresAttribution).toBe(true);
    expect(ccby4?.requiresShareAlike).toBe(false);

    const cc0 = getLicenseDetails('CC0-1.0');
    expect(cc0).not.toBeNull();
    expect(cc0?.name).toContain('Public Domain Dedication');
    expect(cc0?.requiresAttribution).toBe(false);
    expect(cc0?.requiresShareAlike).toBe(false);

    expect(getLicenseDetails('NonExistentLicense')).toBeNull();
  });

  it('should build a compatibility matrix for a given set of licenses', () => {
    const licenses: LicenseIdentifier[] = ['CC-BY-4.0', 'CC-BY-SA-4.0', 'CC0-1.0'];
    const matrix = buildCompatibilityMatrix(licenses);

    expect(matrix.size).toBe(3);
    expect(matrix.get('CC-BY-4.0')?.size).toBe(3);

    // Test specific compatibilities (simplified logic)
    expect(matrix.get('CC-BY-4.0')?.get('CC-BY-4.0')).toBe(1); // Self-compatible
    expect(matrix.get('CC-BY-4.0')?.get('CC-BY-SA-4.0')).toBe(0); // Different SA requirements -> incompatible (in this simplified model)
    expect(matrix.get('CC-BY-4.0')?.get('CC0-1.0')).toBe(1); // CC0 is generally compatible

    expect(matrix.get('CC-BY-SA-4.0')?.get('CC-BY-4.0')).toBe(0); // Incompatible
    expect(matrix.get('CC-BY-SA-4.0')?.get('CC-BY-SA-4.0')).toBe(1); // Self-compatible
    expect(matrix.get('CC-BY-SA-4.0')?.get('CC0-1.0')).toBe(1); // CC0 is generally compatible
  });

  it('should suggest appropriate licenses based on use case requirements', () => {
    // Public Domain equivalent
    const publicDomainSuggestions = suggestLicense({ attributionRequired: false, shareAlikeRequired: false, commercialUseAllowed: true });
    expect(publicDomainSuggestions).toContain('CC0-1.0');
    expect(publicDomainSuggestions.length).toBe(1);

    // Attribution only
    const attributionSuggestions = suggestLicense({ attributionRequired: true, shareAlikeRequired: false, commercialUseAllowed: true });
    expect(attributionSuggestions).toContain('CC-BY-4.0');
    expect(attributionSuggestions).toContain('ODC-BY-1.0');
    expect(attributionSuggestions).toContain('DLDE-BY-2.0');
    expect(attributionSuggestions.length).toBe(3);

    // Attribution and ShareAlike
    const shareAlikeSuggestions = suggestLicense({ attributionRequired: true, shareAlikeRequired: true, commercialUseAllowed: true });
    expect(shareAlikeSuggestions).toContain('CC-BY-SA-4.0');
    expect(shareAlikeSuggestions.length).toBe(1);
  });
});
