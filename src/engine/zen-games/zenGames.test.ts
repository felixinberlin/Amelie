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
import {
  PEBBLE_CONFIGS,
  CANAL_CURIOSITIES,
  simulateStoneThrow,
  calculateAcousticSkipProfile,
  evaluateCanalCuriosityDiscovery,
} from './canalStoneEngine';
import {
  HISTORIC_FLURNAMEN_CORPUS,
  evaluateParcelGuess,
  calculateParcelDistanceMeters,
  computeLeaveOneOutCategoryCentroid,
} from './flurnamenEngine';
import {
  WEATHER_RULES_CORPUS,
  evaluatePlayerWeatherVerdict,
  calculateBureaucraticGrade,
} from './bauernregelnEngine';
import {
  ORTSNECKNAMEN_CORPUS,
  evaluatePlayerMockeryGuess,
  calculateVillageFeudTitle,
} from './ortsnecknamenEngine';

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

  describe('Canal Saint-Martin Stone Skipping Physics Engine', () => {
    it('initializes authentic pebble configurations with physical parameters', () => {
      expect(PEBBLE_CONFIGS.slate.flatness).toBeGreaterThan(PEBBLE_CONFIGS.granite.flatness);
      expect(PEBBLE_CONFIGS.granite.mass).toBeGreaterThan(PEBBLE_CONFIGS.slate.mass);
      expect(PEBBLE_CONFIGS.quartz.basePitch).toBeGreaterThan(0);
      expect(PEBBLE_CONFIGS.sandstone.descriptionDe).toBeTruthy();
    });

    it('simulates multiple hops when thrown with optimal angle (~20 deg) and strong spin', () => {
      // Optimal throw: force 0.85, angle 20 deg, spin 0.9, slate pebble
      const result = simulateStoneThrow(0.85, 20, 0.9, 'slate');
      expect(result.success).toBe(true);
      expect(result.hops.length).toBeGreaterThanOrEqual(4);
      expect(result.totalDistance).toBeGreaterThan(15);
      
      // Each hop should advance in distance
      for (let i = 1; i < result.hops.length; i++) {
        expect(result.hops[i].distanceMeters).toBeGreaterThan(result.hops[i - 1].distanceMeters);
        expect(result.hops[i].velocityRemaining).toBeLessThan(result.hops[i - 1].velocityRemaining);
      }
    });

    it('fails to skip when thrown too steeply into the water', () => {
      // Steep throw: angle 65 degrees
      const result = simulateStoneThrow(0.5, 65, 0.5, 'granite');
      expect(result.hops.length).toBeLessThanOrEqual(1);
      expect(result.success).toBe(false);
      expect(result.sinkReasonDe).toBeTruthy();
    });

    it('generates ascending acoustic pitches for successive lighter skips', () => {
      const hop1 = calculateAcousticSkipProfile(1, 'slate', 0.9);
      const hop4 = calculateAcousticSkipProfile(4, 'slate', 0.4);

      expect(hop4.fundamentalFreq).toBeGreaterThan(hop1.fundamentalFreq);
      expect(hop1.plopGain).toBeGreaterThan(hop4.plopGain);
      expect(hop1.decayTime).toBeGreaterThan(0);
    });

    it('unlocks canal curiosities when distance and hop thresholds are reached', () => {
      const curiosities = CANAL_CURIOSITIES.map((c) => ({ ...c }));
      const { newlyDiscovered, updatedCuriosities } = evaluateCanalCuriosityDiscovery(
        curiosities,
        15, // 15 meters
        4   // 4 hops
      );

      expect(newlyDiscovered).not.toBeNull();
      expect(newlyDiscovered?.id).toBe('passerelle-douanes');
      expect(updatedCuriosities.find((c) => c.id === 'passerelle-douanes')?.discovered).toBe(true);
      // Higher milestone remains locked
      expect(updatedCuriosities.find((c) => c.id === 'message-in-bottle')?.discovered).toBe(false);
    });
  });

  describe('Flurnamen Geolocation Engine (Historic Micro-Toponyms)', () => {
    it('initializes historic parcels with grounded etymologies and valid coordinates', () => {
      expect(HISTORIC_FLURNAMEN_CORPUS.length).toBeGreaterThanOrEqual(8);
      for (const p of HISTORIC_FLURNAMEN_CORPUS) {
        expect(p.name.length).toBeGreaterThan(0);
        expect(p.clueDe.length).toBeGreaterThan(0);
        expect(p.etymologyDe.length).toBeGreaterThan(0);
        expect(p.targetXPercent).toBeGreaterThanOrEqual(0);
        expect(p.targetXPercent).toBeLessThanOrEqual(100);
        expect(p.targetYPercent).toBeGreaterThanOrEqual(0);
        expect(p.targetYPercent).toBeLessThanOrEqual(100);
      }
    });

    it('scores exact bulls-eye guesses with 100 points and positive feedback', () => {
      const galgenberg = HISTORIC_FLURNAMEN_CORPUS.find((p) => p.id === 'galgenberg')!;
      const evalResult = evaluateParcelGuess(
        galgenberg,
        galgenberg.targetXPercent,
        galgenberg.targetYPercent
      );

      expect(evalResult.distanceMeters).toBe(0);
      expect(evalResult.score).toBe(100);
      expect(evalResult.ratingLabelDe).toContain('Volltreffer');
    });

    it('penalizes distant guesses proportionally', () => {
      const galgenberg = HISTORIC_FLURNAMEN_CORPUS.find((p) => p.id === 'galgenberg')!;
      // Guess completely opposite corner (0, 100)
      const evalResult = evaluateParcelGuess(galgenberg, 0, 100);

      expect(evalResult.distanceMeters).toBeGreaterThan(500);
      expect(evalResult.score).toBe(15);
      expect(evalResult.ratingLabelDe).toContain('Weit entfernt');
    });

    it('computes deterministic Leave-One-Out spatial category prior', () => {
      // Prior for 'agriculture' excluding 'hexenacker'
      const prior = computeLeaveOneOutCategoryCentroid(
        HISTORIC_FLURNAMEN_CORPUS,
        'agriculture',
        'hexenacker'
      );

      expect(prior.sampleCount).toBeGreaterThanOrEqual(2);
      expect(prior.centroidX).toBeGreaterThan(0);
      expect(prior.centroidY).toBeGreaterThan(0);
    });
  });

  describe('Bauernregeln vs. DWD Meteorological Engine', () => {
    it('contains comprehensive corpus of weather rules with statements and Brier scores', () => {
      expect(WEATHER_RULES_CORPUS.length).toBeGreaterThanOrEqual(8);
      for (const rule of WEATHER_RULES_CORPUS) {
        expect(rule.ruleDe.length).toBeGreaterThan(0);
        expect(rule.dwdStatementDe.length).toBeGreaterThan(0);
        expect(rule.bureaucraticTitleDe.length).toBeGreaterThan(0);
        expect(['signal', 'rhyme_emergency', 'tautology']).toContain(rule.verdict);
        expect(rule.brierSkillScore).toBeGreaterThanOrEqual(-1.0);
        expect(rule.brierSkillScore).toBeLessThanOrEqual(1.0);
      }
    });

    it('evaluates player verdict accurately with score awards', () => {
      const hahn = WEATHER_RULES_CORPUS.find((r) => r.id === 'hahn-auf-dem-mist')!;
      const correctEval = evaluatePlayerWeatherVerdict(hahn, 'tautology');
      expect(correctEval.isCorrect).toBe(true);
      expect(correctEval.scoreAwarded).toBe(100);

      const wrongEval = evaluatePlayerWeatherVerdict(hahn, 'signal');
      expect(wrongEval.isCorrect).toBe(false);
      expect(wrongEval.scoreAwarded).toBe(25);
    });

    it('generates humorous bureaucratic German grades based on total points', () => {
      const gradeTop = calculateBureaucraticGrade(480);
      expect(gradeTop.gradeTitleDe).toContain('A14');
      expect(gradeTop.verdictReportDe).toContain('Offenbach');

      const gradeMid = calculateBureaucraticGrade(350);
      expect(gradeMid.gradeTitleDe).toContain('A11');

      const gradeLow = calculateBureaucraticGrade(150);
      expect(gradeLow.gradeTitleDe).toContain('Reim-Opfer');
      expect(gradeLow.verdictReportDe).toContain('Brocken');
    });
  });

  describe('Ortsnecknamen & Cultural Village Mockery Engine', () => {
    it('contains valid and complete folklore entries with cultural voices', () => {
      expect(ORTSNECKNAMEN_CORPUS.length).toBeGreaterThanOrEqual(5);

      for (const entry of ORTSNECKNAMEN_CORPUS) {
        expect(entry.id.length).toBeGreaterThan(0);
        expect(entry.mockeryNameDe.length).toBeGreaterThan(0);
        expect(entry.correctTown.length).toBeGreaterThan(0);
        expect(entry.options.length).toBe(4);
        expect(entry.options).toContain(entry.correctTown);
        expect(new Set(entry.options).size).toBe(4); // all 4 distinct
        expect(entry.legendDe.length).toBeGreaterThan(0);
        expect(entry.etymologyDe.length).toBeGreaterThan(0);

        // All 4 cultural voices must be populated
        expect(entry.culturalVoices.aerzteDe.length).toBeGreaterThan(0);
        expect(entry.culturalVoices.onkelzDe.length).toBeGreaterThan(0);
        expect(entry.culturalVoices.mausDe.length).toBeGreaterThan(0);
        expect(entry.culturalVoices.loriotDe.length).toBeGreaterThan(0);
      }
    });

    it('evaluates player mockery guesses with accurate scores', () => {
      const entry = ORTSNECKNAMEN_CORPUS.find((e) => e.id === 'mondspritzer')!;
      const correctEval = evaluatePlayerMockeryGuess(entry, 'Zeil am Main');
      expect(correctEval.isCorrect).toBe(true);
      expect(correctEval.scoreAwarded).toBe(100);

      const wrongEval = evaluatePlayerMockeryGuess(entry, 'Schweinfurt');
      expect(wrongEval.isCorrect).toBe(false);
      expect(wrongEval.scoreAwarded).toBe(25);
    });

    it('generates humorous German village feud titles according to score tier', () => {
      const topFeud = calculateVillageFeudTitle(490);
      expect(topFeud.titleDe).toContain('Schützenfest');
      expect(topFeud.verdictDe).toContain('Ehren-Kommandanten');

      const midFeud = calculateVillageFeudTitle(325);
      expect(midFeud.titleDe).toContain('Feuerwehr-Hauptmann');

      const lowFeud = calculateVillageFeudTitle(120);
      expect(lowFeud.titleDe).toContain('Zugezogener Großstadt-Akademiker');
      expect(lowFeud.verdictDe).toContain('Bratwürste');
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
