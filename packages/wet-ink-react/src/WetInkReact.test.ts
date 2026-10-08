import { describe, it, expect } from 'vitest';
import { WetInkSignature } from './WetInkSignature';
import { useWetInk } from './useWetInk';

describe('@wet-ink/react — Modular React Layer', () => {
  it('exports WetInkSignature forwardRef component with correct displayName', () => {
    expect(WetInkSignature).toBeDefined();
    expect(WetInkSignature.displayName).toBe('WetInkSignature');
  });

  it('exports useWetInk hook function', () => {
    expect(useWetInk).toBeDefined();
    expect(typeof useWetInk).toBe('function');
  });
});
