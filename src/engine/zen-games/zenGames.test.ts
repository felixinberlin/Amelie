import { describe, it, expect } from 'vitest';
import { DOSEN_DATA } from '../../data/dosen';
import {
  createInitialPuzzlePieces,
  swapPuzzlePieces,
  isPuzzleSolved,
  calculatePuzzleProgress,
} from './puzzleEngine';
import {
  calculateHandDepth,
  getGrainAcousticProfile,
  evaluateTreasureDiscovery,
  BuriedTreasureItem,
} from './grainSackEngine';
import {
  validateCostumeConfig,
  generatePostcardSalutation,
  GnomeCostumeConfig,
  GnomeDestinationConfig,
} from './travelingGnomeEngine';
import {
  createInitialCaramelState,
  generateCrackPattern,
  calculateAcousticCrackProfile,
  evaluateSecretDiscovery,
  calculateSatisfaction,
  SECRET_QUOTES,
  FLAVOR_CONFIGS,
} from './cremeBruleeEngine';

describe('Amélie Zen Games Modular Engines', () => {
  describe('Photobooth Puzzle Engine', () => {
    it('initializes torn passport photo pieces in an unsolved state', () => {
      const initial = createInitialPuzzlePieces();
      expect(initial.length).toBe(4);
      expect(isPuzzleSolved(initial)).toBe(false);

      const progress = calculatePuzzleProgress(initial);
      expect(progress.percentage).toBeLessThan(100);
    });

    it('swaps two slots correctly when user clicks two tiles', () => {
      const initial = createInitialPuzzlePieces();
      // Swap piece 0 and piece 1
      const swapped = swapPuzzlePieces(initial, 0, 1);
      const piece0 = swapped.find((p) => p.id === 0)!;
      const piece1 = swapped.find((p) => p.id === 1)!;

      expect(piece0.currentSlot).toBe(initial.find((p) => p.id === 1)!.currentSlot);
      expect(piece1.currentSlot).toBe(initial.find((p) => p.id === 0)!.currentSlot);
    });

    it('detects when all pieces match their correct slot', () => {
      const solvedPieces = [
        { id: 0, currentSlot: 0, correctSlot: 0, label: '1' },
        { id: 1, currentSlot: 1, correctSlot: 1, label: '2' },
        { id: 2, currentSlot: 2, correctSlot: 2, label: '3' },
        { id: 3, currentSlot: 3, correctSlot: 3, label: '4' },
      ];

      expect(isPuzzleSolved(solvedPieces)).toBe(true);
      expect(calculatePuzzleProgress(solvedPieces).percentage).toBe(100);
    });
  });

  describe('Grain Sack Zen Engine', () => {
    it('computes depth in centimeters up to 25cm limit based on stirred grain count', () => {
      expect(calculateHandDepth(0)).toBe(0);
      expect(calculateHandDepth(70)).toBe(2);
      expect(calculateHandDepth(350)).toBe(10);
      expect(calculateHandDepth(5000)).toBe(25); // capped at 25cm
    });

    it('provides distinct acoustic profiles for lentils, chickpeas and coffee', () => {
      const lentils = getGrainAcousticProfile('lentils');
      const chickpeas = getGrainAcousticProfile('chickpeas');
      const coffee = getGrainAcousticProfile('coffee');

      expect(lentils.centerFrequency).toBeGreaterThan(chickpeas.centerFrequency);
      expect(chickpeas.centerFrequency).toBeLessThan(coffee.centerFrequency);
    });

    it('detects treasure when pointer is within discovery radius while mouse is down', () => {
      const testTreasures: BuriedTreasureItem[] = [
        {
          id: 'coin',
          nameDe: 'Münze',
          nameEn: 'Coin',
          nameEs: 'Moneda',
          descDe: 'Test',
          descEn: 'Test',
          descEs: 'Test',
          icon: '🪙',
          xRatio: 0.5,
          yRatio: 0.5,
          depthThreshold: 10,
          found: false,
        },
      ];

      // Distance inside 40px radius (canvas 1000x1000, target at 500,500, pointer at 510,505 -> dist ~11.18px)
      const { updatedTreasures, newlyDiscovered } = evaluateTreasureDiscovery(
        testTreasures,
        510,
        505,
        1000,
        1000,
        true,
        true,
        40
      );

      expect(newlyDiscovered).not.toBeNull();
      expect(newlyDiscovered?.id).toBe('coin');
      expect(updatedTreasures[0].found).toBe(true);
    });

    it('does not trigger discovery if mouse is up or interaction is disabled', () => {
      const testTreasures: BuriedTreasureItem[] = [
        {
          id: 'coin',
          nameDe: 'Münze',
          nameEn: 'Coin',
          nameEs: 'Moneda',
          descDe: 'Test',
          descEn: 'Test',
          descEs: 'Test',
          icon: '🪙',
          xRatio: 0.5,
          yRatio: 0.5,
          depthThreshold: 10,
          found: false,
        },
      ];

      const res = evaluateTreasureDiscovery(
        testTreasures,
        500,
        500,
        1000,
        1000,
        true,
        false, // mouse is up
        40
      );

      expect(res.newlyDiscovered).toBeNull();
      expect(res.updatedTreasures[0].found).toBe(false);
    });
  });

  describe('Traveling Gnome Engine', () => {
    it('validates legitimate gnome costume combinations', () => {
      const costume: GnomeCostumeConfig = {
        hat: 'beret',
        eyewear: 'aviators',
        prop: 'baguette',
        expression: 'grumpy',
        tilt: -5,
      };
      expect(validateCostumeConfig(costume)).toBe(true);
    });

    it('rejects invalid or extreme angles and accessories', () => {
      const invalidCostume = {
        hat: 'space_helmet_unknown' as any,
        eyewear: 'aviators',
        prop: 'baguette',
        expression: 'grumpy',
        tilt: 90, // outside [-30, 30]
      };
      expect(validateCostumeConfig(invalidCostume)).toBe(false);
    });

    it('generates rich postcard salutation including customized prop note', () => {
      const dest: GnomeDestinationConfig = {
        id: 'paris',
        nameDe: 'Paris',
        nameEn: 'Paris',
        cityDe: 'Paris',
        cityEn: 'Paris',
        flag: '🇫🇷',
        weatherDe: 'Sonnig',
        weatherEn: 'Sunny',
        postcardLetterDe: 'Lieber Papa, hier ist es herrlich.',
        postcardLetterEn: 'Dear Dad, it is wonderful here.',
      };

      const costume: GnomeCostumeConfig = {
        hat: 'classic_red',
        eyewear: 'none',
        prop: 'baguette',
        expression: 'wink',
        tilt: 0,
      };

      const letterDe = generatePostcardSalutation(dest, costume, 'de');
      expect(letterDe).toContain('Lieber Papa');
      expect(letterDe).toContain('Baguette');

      const letterEn = generatePostcardSalutation(dest, costume, 'en');
      expect(letterEn).toContain('Dear Dad');
      expect(letterEn).toContain('baguette');
    });
  });

  describe('Crème Brûlée Zen Engine', () => {
    it('initializes pristine caramel state for flavors', () => {
      const state = createInitialCaramelState('vanilla');
      expect(state.flavor).toBe('vanilla');
      expect(state.cracks.length).toBe(0);
      expect(state.spoonTaps).toBe(0);
      expect(state.satisfactionScore).toBe(0);
      expect(FLAVOR_CONFIGS.vanilla.basePitch).toBeGreaterThan(0);
    });

    it('generates procedural branching fracture patterns on spoon strike', () => {
      const crack = generateCrackPattern(10, -15, 0.7, 0, 150);
      expect(crack.x).toBe(10);
      expect(crack.y).toBe(-15);
      expect(crack.force).toBe(0.7);
      expect(crack.branches.length).toBeGreaterThanOrEqual(3);
      for (const branch of crack.branches) {
        expect(branch.width).toBeGreaterThan(0);
        expect(branch.alpha).toBeGreaterThan(0);
      }
    });

    it('computes acoustic crack synthesis profiles with frequency scaling', () => {
      const thinProfile = calculateAcousticCrackProfile(0.8, 0.8, 'vanilla');
      const thickProfile = calculateAcousticCrackProfile(0.8, 2.4, 'vanilla');

      // Thinner crust yields a higher frequency snap than thicker crust
      expect(thinProfile.fundamentalFreq).toBeGreaterThan(thickProfile.fundamentalFreq);
      expect(thinProfile.decayTime).toBeGreaterThan(0);
      expect(thinProfile.noiseLevel).toBeGreaterThan(0);
    });

    it('evaluates discovering hidden quotes upon striking their location', () => {
      const state = createInitialCaramelState('vanilla');
      const testSecrets = SECRET_QUOTES.map((s) => ({ ...s }));
      const targetSecret = testSecrets[0];
      const ramekinRadius = 150;
      const targetX = targetSecret.xRatio * ramekinRadius;
      const targetY = targetSecret.yRatio * ramekinRadius;

      const { newlyDiscovered, updatedSecrets } = evaluateSecretDiscovery(
        state,
        testSecrets,
        targetX,
        targetY,
        ramekinRadius
      );

      expect(newlyDiscovered).not.toBeNull();
      expect(newlyDiscovered?.id).toBe(targetSecret.id);
      expect(updatedSecrets.find((s) => s.id === targetSecret.id)?.discovered).toBe(true);
    });

    it('calculates increasing satisfaction score based on taps, shatters, and secrets', () => {
      expect(calculateSatisfaction(0, 0, 0)).toBe(0);
      const intermediate = calculateSatisfaction(4, 0.4, 1);
      const mastery = calculateSatisfaction(12, 0.9, 4);
      expect(intermediate).toBeGreaterThan(0);
      expect(mastery).toBeGreaterThan(intermediate);
      expect(mastery).toBeLessThanOrEqual(100);
    });
  });

  describe('Dosen Catalog Integrity', () => {
    it('contains valid and unique IDs across all Dosen', () => {
      const ids = DOSEN_DATA.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('ensures each Dose has required bilingual fields and valid domain/status', () => {
      const validDomains = ['civic', 'tools', 'physics', 'audio', 'creative', 'knowledge', 'git'];
      const validStatuses = ['gefunden', 'gepackt', 'zugestellt', 'antwort', 'gebaut', 'entsorgt'];

      for (const dose of DOSEN_DATA) {
        expect(dose.id.length).toBeGreaterThan(0);
        expect(dose.title.length).toBeGreaterThan(0);
        expect(dose.oneLinerDe.length).toBeGreaterThan(0);
        expect(dose.oneLinerEn.length).toBeGreaterThan(0);
        expect(validDomains).toContain(dose.domain);
        expect(validStatuses).toContain(dose.status);
      }
    });
  });
});
