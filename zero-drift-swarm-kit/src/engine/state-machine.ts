/**
 * Deterministic State Machine Engine
 * 
 * Demonstrates the core pattern: explicit state enums, exhaustive transition tables,
 * and immutable history logging that agents cannot silently break.
 */

export type SwarmState = 'idle' | 'researching' | 'reviewing' | 'building' | 'verified' | 'failed';

export interface StateTransitionEvent {
  from: SwarmState;
  to: SwarmState;
  timestamp: string;
  trigger: string;
}

export class StateTransitionError extends Error {
  constructor(public readonly from: SwarmState, public readonly to: SwarmState) {
    super(`Illegal state transition from '${from}' to '${to}'`);
    this.name = 'StateTransitionError';
  }
}

export class SwarmStateMachine {
  private currentState: SwarmState = 'idle';
  private history: StateTransitionEvent[] = [];

  private readonly allowedTransitions: Record<SwarmState, SwarmState[]> = {
    idle: ['researching', 'failed'],
    researching: ['reviewing', 'failed'],
    reviewing: ['building', 'failed', 'researching'],
    building: ['verified', 'failed'],
    verified: ['idle'],
    failed: ['idle']
  };

  constructor(initialState: SwarmState = 'idle') {
    this.currentState = initialState;
  }

  getState(): SwarmState {
    return this.currentState;
  }

  getHistory(): readonly StateTransitionEvent[] {
    return this.history;
  }

  transition(to: SwarmState, trigger: string): void {
    const validTargets = this.allowedTransitions[this.currentState] || [];
    if (!validTargets.includes(to)) {
      throw new StateTransitionError(this.currentState, to);
    }

    const event: StateTransitionEvent = {
      from: this.currentState,
      to,
      timestamp: new Date().toISOString(),
      trigger
    };

    this.history.push(event);
    this.currentState = to;
  }

  reset(): void {
    this.transition('idle', 'manual-reset');
  }
}
