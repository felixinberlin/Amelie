import { describe, it, expect } from 'vitest';
import {
  PLAYBOOK_THEMES,
  SATURATION_ATLAS_DATA,
  SEARCH_THEME_PRESETS,
  PLAYBOOK_RECIPES,
  ANCHOR_FRAMES,
  COLLIDER_FRAMES
} from './index';

describe('Search Playbook & Saturation Atlas Data', () => {
  it('has valid playbook themes defined', () => {
    expect(PLAYBOOK_THEMES.length).toBeGreaterThan(5);
    const allTheme = PLAYBOOK_THEMES.find(t => t.id === 'all');
    expect(allTheme).toBeDefined();
    for (const theme of PLAYBOOK_THEMES) {
      expect(theme.label.de).toBeTruthy();
      expect(theme.label.en).toBeTruthy();
      expect(theme.icon).toBeTruthy();
    }
  });

  it('has comprehensive saturation atlas entries across multiple themes', () => {
    expect(SATURATION_ATLAS_DATA.length).toBeGreaterThanOrEqual(20);
    const themes = new Set(SATURATION_ATLAS_DATA.map(d => d.theme));
    expect(themes.size).toBeGreaterThanOrEqual(6);

    for (const entry of SATURATION_ATLAS_DATA) {
      expect(entry.id).toBeTruthy();
      expect(entry.fieldDe).toBeTruthy();
      expect(entry.fieldEn).toBeTruthy();
      expect(entry.evidenceDe).toBeTruthy();
      expect(entry.evidenceEn).toBeTruthy();
      expect(['frei', 'verengt', 'beim_empfaenger', 'wird_besetzt', 'dicht', 'dicht_kommerziell', 'dicht_forschung']).toContain(entry.status);
    }
  });

  it('contains diverse search theme presets with valid query keywords', () => {
    expect(SEARCH_THEME_PRESETS.length).toBeGreaterThanOrEqual(10);
    for (const preset of SEARCH_THEME_PRESETS) {
      expect(preset.topicInput).toBeTruthy();
      expect(preset.recipientInput).toBeTruthy();
      expect(preset.foreignRegulationKeyword).toBeTruthy();
      expect(preset.fundingKeyword).toBeTruthy();
    }
  });

  it('contains core playbook heuristics and recipes', () => {
    expect(PLAYBOOK_RECIPES.length).toBeGreaterThanOrEqual(8);
    for (const recipe of PLAYBOOK_RECIPES) {
      expect(recipe.number).toBeGreaterThan(0);
      expect(recipe.titleDe).toBeTruthy();
      expect(recipe.formulaDe).toBeTruthy();
      expect(recipe.queryExample).toBeTruthy();
    }
  });

  it('contains authentic anchor and collider frames for bisociation', () => {
    expect(ANCHOR_FRAMES.length).toBeGreaterThanOrEqual(8);
    expect(COLLIDER_FRAMES.length).toBeGreaterThanOrEqual(8);

    for (const anchor of ANCHOR_FRAMES) {
      expect(anchor.orgDe).toBeTruthy();
      expect(anchor.problemDe).toBeTruthy();
      expect(anchor.mandateHolderDe).toBeTruthy();
    }

    for (const collider of COLLIDER_FRAMES) {
      expect(collider.titleDe).toBeTruthy();
      expect(collider.techDe).toBeTruthy();
      expect(collider.whyZeroCostDe).toBeTruthy();
    }
  });
});
