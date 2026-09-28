import { describe, it, expect, beforeEach } from 'vitest';
import { SwarmStateMachine, StateTransitionError } from './state-machine.js';

describe('SwarmStateMachine (Deterministic Verification Gate)', () => {
  let sm: SwarmStateMachine;

  beforeEach(() => {
    sm = new SwarmStateMachine('idle');
  });

  it('starts in idle state', () => {
    expect(sm.getState()).toBe('idle');
    expect(sm.getHistory()).toHaveLength(0);
  });

  it('allows valid sequential pipeline transitions', () => {
    sm.transition('researching', 'orchestrator-dispatch');
    expect(sm.getState()).toBe('researching');

    sm.transition('reviewing', 'scout-collider-completed');
    expect(sm.getState()).toBe('reviewing');

    sm.transition('building', 'reviewer-approved');
    expect(sm.getState()).toBe('building');

    sm.transition('verified', 'vitest-passed');
    expect(sm.getState()).toBe('verified');

    expect(sm.getHistory()).toHaveLength(4);
    expect(sm.getHistory()[0].trigger).toBe('orchestrator-dispatch');
  });

  it('rejects illegal transitions with StateTransitionError', () => {
    // Attempting to jump directly from idle to building without research or review
    expect(() => sm.transition('building', 'hallucinated-skip')).toThrowError(StateTransitionError);
    expect(sm.getState()).toBe('idle');
  });

  it('allows transitioning to failed from any active state', () => {
    sm.transition('researching', 'start');
    sm.transition('failed', 'api-timeout');
    expect(sm.getState()).toBe('failed');

    sm.reset();
    expect(sm.getState()).toBe('idle');
  });
});
