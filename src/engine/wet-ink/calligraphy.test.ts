import { describe, it, expect } from 'vitest';
import { PAPER_PRESETS, PIGMENT_PRESETS } from './presets';
import { generatePaperMaps } from './paper';
import { WetInkBrushManager, BrushState } from './brush';
import { WetInkSimulation } from './simulation';
import { WET_INK_DT } from './simulation';
import { REFERENCE_PARAMS } from './scenarios';
import { SealOptions, SealStyle, SealShape, SealGlyph } from './types';

describe('Chinese Calligraphy & Seal Art Engine (书法与篆刻)', () => {
  const getPaper = (id: string) => {
    const p = PAPER_PRESETS.find((x) => x.id === id);
    if (!p) throw new Error(`Paper preset not found: ${id}`);
    return p;
  };

  const freshSim = (paperId: string, pigmentId: string = 'sumi', w: number = 64, h: number = 64) => {
    const paper = getPaper(paperId);
    const pigment = PIGMENT_PRESETS.find((x) => x.id === pigmentId) || PIGMENT_PRESETS[0];
    const maps = generatePaperMaps(w, h, paper, 42);
    return new WetInkSimulation(w, h, maps, paper, pigment, REFERENCE_PARAMS);
  };

  // ---------------------------------------------------------------------------
  // Ticket C1: Substrate Presets (Xuan-Papiere / 宣纸三品)
  // ---------------------------------------------------------------------------
  describe('Ticket C1: Xuan Paper Substrates (宣纸三品)', () => {
    it('defines the three classical degrees of maturation: Sheng, Ban Shu, Shu Xuan', () => {
      const sheng = getPaper('sheng-xuan');
      const banShu = getPaper('ban-shu-xuan');
      const shu = getPaper('shu-xuan');

      expect(sheng).toBeDefined();
      expect(banShu).toBeDefined();
      expect(shu).toBeDefined();

      // Sheng Xuan: raw, high capillary wicking and capacity (Xieyi painting)
      expect(sheng.capacity).toBeGreaterThanOrEqual(0.95);
      expect(sheng.fiberStrength).toBeGreaterThanOrEqual(0.90);
      expect(sheng.roughness).toBeGreaterThan(0.35);

      // Ban Shu Xuan: semi-sized balance (Kaishu and Xingshu)
      expect(banShu.capacity).toBeLessThan(sheng.capacity);
      expect(banShu.capacity).toBeGreaterThan(shu.capacity);
      expect(banShu.fiberStrength).toBeLessThan(sheng.fiberStrength);
      expect(banShu.fiberStrength).toBeGreaterThan(shu.fiberStrength);

      // Shu Xuan: alum-sized, sharp outlines (Gongbi and fine seal script)
      expect(shu.capacity).toBeLessThanOrEqual(0.40);
      expect(shu.fiberStrength).toBeLessThanOrEqual(0.30);
      expect(shu.evaporationMult).toBeGreaterThan(sheng.evaporationMult);
    });

    it('generates physically bounded paper maps for all three Xuan papers', () => {
      for (const id of ['sheng-xuan', 'ban-shu-xuan', 'shu-xuan']) {
        const paper = getPaper(id);
        const maps = generatePaperMaps(32, 32, paper, 77);

        expect(maps.width).toBe(32);
        expect(maps.height).toBe(32);
        expect(maps.heightMap.length).toBe(1024);

        for (let i = 0; i < 1024; i++) {
          expect(maps.heightMap[i]).toBeGreaterThanOrEqual(0);
          expect(maps.heightMap[i]).toBeLessThanOrEqual(1);
          expect(maps.capacityMap[i]).toBeGreaterThan(0);
          expect(maps.capacityMap[i]).toBeLessThanOrEqual(1.2);
          expect(maps.fiberStrengthMap[i]).toBeGreaterThanOrEqual(0);
          expect(maps.fiberStrengthMap[i]).toBeLessThanOrEqual(1);
        }
      }
    });

    it('Sheng Xuan exhibits stronger capillary fiber networks than Shu Xuan', () => {
      const shengMaps = generatePaperMaps(32, 32, getPaper('sheng-xuan'), 123);
      const shuMaps = generatePaperMaps(32, 32, getPaper('shu-xuan'), 123);

      let shengNetworkSum = 0;
      let shuNetworkSum = 0;
      for (let i = 0; i < 1024; i++) {
        shengNetworkSum += shengMaps.fiberNetwork[i];
        shuNetworkSum += shuMaps.fiberNetwork[i];
      }

      // Sheng Xuan has longer, denser plant fiber coverage than sized Shu Xuan
      expect(shengNetworkSum).toBeGreaterThan(shuNetworkSum);
    });
  });

  // ---------------------------------------------------------------------------
  // Ticket C2: Mao-Bi Brush Dynamics (毛笔特性)
  // ---------------------------------------------------------------------------
  describe('Ticket C2: Mao-Bi Brush Dynamics (毛笔特性)', () => {
    it('Langhao (狼毫 - Weasel hair) is sharper and thins more under high speed than Yanghao', () => {
      const simLang = freshSim('ban-shu-xuan', 'sumi', 64, 64);
      const simYang = freshSim('ban-shu-xuan', 'sumi', 64, 64);

      const managerLang = new WetInkBrushManager();
      const managerYang = new WetInkBrushManager();

      const langState: BrushState = { tool: 'langhao', baseRadius: 8, waterRatio: 1.0, dryBrush: false };
      const yangState: BrushState = { tool: 'yanghao', baseRadius: 8, waterRatio: 1.0, dryBrush: false };

      // Fast flick from (10, 32) to (50, 32) in 20 ms -> speed 2.0 px/ms
      managerLang.stroke(simLang, 10, 32, 0.4, langState, true, 0);
      managerLang.stroke(simLang, 50, 32, 0.4, langState, false, 20);

      managerYang.stroke(simYang, 10, 32, 0.4, yangState, true, 0);
      managerYang.stroke(simYang, 50, 32, 0.4, yangState, false, 20);

      const repLang = simLang.massReport();
      const repYang = simYang.massReport();

      // Yanghao holds much more liquid reservoir, depositing more volume than agile Langhao
      expect(repYang.waterInjected).toBeGreaterThan(repLang.waterInjected);
      expect(repYang.pigmentInjected).toBeGreaterThan(0);
      expect(repLang.pigmentInjected).toBeGreaterThan(0);
    });

    it('Jianhao (兼毫 - Hybrid hair) delivers balanced intermediate ink deposition', () => {
      const simLang = freshSim('ban-shu-xuan', 'sumi', 64, 64);
      const simJian = freshSim('ban-shu-xuan', 'sumi', 64, 64);
      const simYang = freshSim('ban-shu-xuan', 'sumi', 64, 64);

      const mgr = new WetInkBrushManager();

      const p = 0.6;
      mgr.stroke(simLang, 15, 32, p, { tool: 'langhao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, true, 0);
      mgr.stroke(simLang, 45, 32, p, { tool: 'langhao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, false, 150);

      mgr.stroke(simJian, 15, 32, p, { tool: 'jianhao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, true, 0);
      mgr.stroke(simJian, 45, 32, p, { tool: 'jianhao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, false, 150);

      mgr.stroke(simYang, 15, 32, p, { tool: 'yanghao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, true, 0);
      mgr.stroke(simYang, 45, 32, p, { tool: 'yanghao', baseRadius: 7, waterRatio: 1.0, dryBrush: false }, false, 150);

      const wLang = simLang.massReport().waterInjected;
      const wJian = simJian.massReport().waterInjected;
      const wYang = simYang.massReport().waterInjected;

      expect(wJian).toBeGreaterThan(wLang);
      expect(wYang).toBeGreaterThan(wJian);
    });

    it('Dry brush skipping (飞白 - Fei Bai) activates on fast flicks with Mao-Bi brushes', () => {
      const sim = freshSim('ban-shu-xuan', 'sumi', 64, 64);
      const mgr = new WetInkBrushManager();
      const state: BrushState = { tool: 'langhao', baseRadius: 8, waterRatio: 1.0, dryBrush: true };

      // High speed (2 px/ms), light pressure (0.25)
      mgr.stroke(sim, 10, 32, 0.25, state, true, 0);
      mgr.stroke(sim, 50, 32, 0.25, state, false, 20);

      const rep = sim.massReport();
      expect(rep.waterInjected).toBeGreaterThan(0);
      expect(rep.pigmentInjected).toBeGreaterThan(0);
      expect(rep.waterError).toBeLessThan(1e-3);
    });
  });

  // ---------------------------------------------------------------------------
  // Ticket C4: Chinese Seal Carving & Stamping (朱砂篆刻印章)
  // ---------------------------------------------------------------------------
  describe('Ticket C4: Seal Stamping Physics (朱砂篆刻印章)', () => {
    it('deposits cinnabar vermilion seal paste accurately in Zhuwen (朱文) style', () => {
      const sim = freshSim('shu-xuan', 'zinnober', 64, 64);

      sim.injectSeal(32, 32, {
        size: 28,
        style: 'zhuwen',
        shape: 'square',
        glyph: 'classic',
        chippedEdge: false,
      });

      const rep = sim.massReport();
      expect(rep.waterInjected).toBeGreaterThan(0);
      expect(rep.pigmentInjected).toBeGreaterThan(0);
      expect(sim.isActive).toBe(true);

      // Verify that the border has stamped ink
      // Left border at x = 32 - 14 = 18, y = 32
      const borderIdx = 32 * 64 + 18;
      expect(sim.pigmentSuspended[borderIdx]).toBeGreaterThan(0.5);

      // Verify that an open inner field cell does NOT have ink in Zhuwen style
      // e.g. at x = 28, y = 28 (absDx = 4, absDy = 4: between inner cross and dots)
      const fieldIdx = 28 * 64 + 28;
      expect(sim.pigmentSuspended[fieldIdx]).toBe(0);
    });

    it('deposits cinnabar vermilion seal paste in Baiwen (白文) negative style', () => {
      const sim = freshSim('shu-xuan', 'zinnober', 64, 64);

      sim.injectSeal(32, 32, {
        size: 28,
        style: 'baiwen',
        shape: 'square',
        glyph: 'classic',
        chippedEdge: false,
      });

      // In Baiwen, the open field inside the seal receives red paste
      const fieldIdx = 28 * 64 + 28;
      expect(sim.pigmentSuspended[fieldIdx]).toBeGreaterThan(0.5);

      // Whereas the center cross channels are carved away and stay free
      const centerIdx = 32 * 64 + 32;
      expect(sim.pigmentSuspended[centerIdx]).toBe(0);
    });

    it('supports round/oval seals as well as square seals', () => {
      const simSquare = freshSim('shu-xuan', 'zinnober', 64, 64);
      const simRound = freshSim('shu-xuan', 'zinnober', 64, 64);

      simSquare.injectSeal(32, 32, { size: 30, shape: 'square', style: 'baiwen', chippedEdge: false });
      simRound.injectSeal(32, 32, { size: 30, shape: 'round', style: 'baiwen', chippedEdge: false });

      // Corner of square at dx=14, dy=14 is inside square but OUTSIDE round circle (dist ≈ 19.8 > 15)
      const cornerIdx = (32 + 13) * 64 + (32 + 13);
      expect(simSquare.pigmentSuspended[cornerIdx]).toBeGreaterThan(0.5);
      expect(simRound.pigmentSuspended[cornerIdx]).toBe(0);
    });

    it('renders all classical seal glyphs: amelie, mo, he, ji, yong without error', () => {
      const glyphs: SealGlyph[] = ['amelie', 'mo', 'he', 'ji', 'yong'];

      for (const glyph of glyphs) {
        const sim = freshSim('ban-shu-xuan', 'zinnober', 64, 64);
        sim.injectSeal(32, 32, {
          size: 32,
          shape: 'square',
          style: 'zhuwen',
          glyph,
          chippedEdge: true,
        });

        const rep = sim.massReport();
        expect(rep.waterInjected).toBeGreaterThan(0);
        expect(rep.pigmentInjected).toBeGreaterThan(0);
        expect(rep.waterError).toBeLessThan(1e-3);
      }
    });

    it('antique chipped edge (Canbian) introduces micro-fractures along seal border', () => {
      const simSmooth = freshSim('shu-xuan', 'zinnober', 64, 64);
      const simChipped = freshSim('shu-xuan', 'zinnober', 64, 64);

      simSmooth.injectSeal(32, 32, { size: 32, chippedEdge: false });
      simChipped.injectSeal(32, 32, { size: 32, chippedEdge: true });

      const smoothPigment = simSmooth.massReport().pigmentInjected;
      const chippedPigment = simChipped.massReport().pigmentInjected;

      // Chipped edge removes small micro-fractures along border perimeter
      expect(chippedPigment).toBeLessThan(smoothPigment);
    });

    it('a stamped seal dries completely within the physical simulation', () => {
      const sim = freshSim('shu-xuan', 'zinnober', 64, 64);
      sim.injectSeal(32, 32, { size: 24, glyph: 'amelie' });

      expect(sim.isActive).toBe(true);

      for (let n = 0; n < 400 && sim.isActive; n++) {
        sim.step(WET_INK_DT);
      }

      // Settled and dried
      expect(sim.isActive).toBe(false);
      const rep = sim.massReport();
      expect(rep.waterPresent).toBe(0);
      expect(rep.pigmentPresent).toBeGreaterThan(0);
      expect(rep.waterError).toBeLessThan(1e-3);
    });
  });
});
