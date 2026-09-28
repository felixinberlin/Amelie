// 07-demos/quanten-visualisierer.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuantumVisualizerApp, DummySimulationEngine, SimulationEngine, QuantumState, PotentialFunction, MeasurementResult } from './quanten-visualisierer';

// Mock Canvas for testing
class MockCanvasElement {
  getContext(type: string) {
    if (type === '2d') {
      return {
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fillStyle: '',
        strokeStyle: '',
      };
    }
    return null;
  }
  width = 800;
  height = 600;
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  appendChild = vi.fn();
  createElement = vi.fn(() => ({
    type: 'input',
    min: '0',
    max: '1',
    step: '0.1',
    value: '0.5',
    id: 'test-param',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    options: [],
    appendChild: vi.fn(),
  }));
}

// Mock SimulationEngine for testing specific app logic
class MockSimulationEngine implements SimulationEngine {
    createInitialState = vi.fn((definition: string) => ({
        waveFunction: (x, t) => ({ re: 0, im: 0 }),
        probabilityDensity: (x, t) => 0,
        potential: (x) => 0,
        energy: definition === 'ground-state' ? 1 : 2,
    }));
    evolveState = vi.fn((state: QuantumState, deltaTime: number) => ({
        ...state,
        energy: (state.energy || 0) + deltaTime,
    }));
    recalculateStateForPotential = vi.fn((state: QuantumState, newPotential: PotentialFunction) => ({
        ...state,
        potential: newPotential,
        energy: (state.energy || 0) + 0.5, // Simulate some change
    }));
    measure = vi.fn((state: QuantumState) => ({
        observedValue: 'mock-measurement',
        collapsedState: { ...state, energy: 0.1 }, // Simulate collapse
    }));
}

describe('QuantumVisualizerApp', () => {
  let mockCanvas: MockCanvasElement;
  let mockEngine: MockSimulationEngine;
  let app: QuantumVisualizerApp;

  beforeEach(() => {
    mockCanvas = new MockCanvasElement();
    mockEngine = new MockSimulationEngine();
    // Mock document.createElement for UI components
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'input') {
            const input = {
                type: 'range',
                min: '0.1',
                max: '10',
                step: '0.1',
                value: '1',
                id: 'mass-param',
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            };
            return input as any; // Cast to any to match HTMLInputElement interface partially
        }
        if (tagName === 'select') {
            const select = {
                id: 'potential-type',
                options: [],
                value: 'free-particle',
                appendChild: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            };
            return select as any;
        }
        if (tagName === 'option') {
            return { value: '', textContent: '' } as any;
        }
        if (tagName === 'button') {
            return { textContent: 'Perform Measurement', addEventListener: vi.fn() } as any;
        }
        return {} as any;
    });

    app = new QuantumVisualizerApp(mockCanvas as any, mockEngine);
  });

  it('should be created successfully with a canvas and engine', () => {
    expect(app).toBeDefined();
    expect(mockCanvas.addEventListener).toHaveBeenCalledTimes(0); // Event listeners are set up for internal elements, not canvas itself
  });

  it('should throw an error if canvas element is missing', () => {
    expect(() => new QuantumVisualizerApp(null as any, mockEngine)).toThrow("Canvas element is required for QuantumVisualizerApp.");
  });

  it('should initialize UI elements and their event listeners', () => {
    // Check if createElement was called for expected UI elements
    expect(document.createElement).toHaveBeenCalledWith('input'); // For mass-param
    expect(document.createElement).toHaveBeenCalledWith('select'); // For potential-type
    expect(document.createElement).toHaveBeenCalledWith('option'); // For select options
    expect(document.createElement).toHaveBeenCalledWith('button'); // For measure button

    // Check if event listeners were attached to the mock UI elements
    // We need to get the mocked elements to check their listeners
    const massInput = (document.createElement as any).mock.results[0].value;
    const potentialSelect = (document.createElement as any).mock.results[1].value;
    const measureButton = (document.createElement as any).mock.results[6].value; // Assuming it's the 7th call after input, select, and 4 options

    expect(massInput.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(massInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
    expect(potentialSelect.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(measureButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });


  it('should initialize a quantum state via the engine', () => {
    app.initializeState('ground-state');
    expect(mockEngine.createInitialState).toHaveBeenCalledWith('ground-state');
    const ctx = mockCanvas.getContext('2d');
    expect(ctx?.clearRect).toHaveBeenCalled(); // Should render after initialization
    expect(ctx?.stroke).toHaveBeenCalled();
  });

  it('should update the simulation based on new parameters', () => {
    app.initializeState('ground-state');
    mockEngine.createInitialState.mockClear(); // Clear previous calls

    // Simulate a parameter change
    // This is a bit tricky as the event listeners are on mocked elements
    // We need to manually trigger the internal method
    const massInput = (document.createElement as any).mock.results[0].value;
    const changeHandler = massInput.addEventListener.mock.calls.find(call => call[0] === 'change')[1];
    massInput.value = '2.5';
    changeHandler(); // Trigger the change event handler

    expect(mockEngine.recalculateStateForPotential).toHaveBeenCalled();
    const ctx = mockCanvas.getContext('2d');
    expect(ctx?.clearRect).toHaveBeenCalled(); // Should re-render
    expect(ctx?.stroke).toHaveBeenCalled();
  });

  it('should perform a measurement and update the state', () => {
    app.initializeState('superposition');
    const initialEnergy = mockEngine.createInitialState.mock.results[0].value.energy;

    const result = app.performMeasurement();

    expect(mockEngine.measure).toHaveBeenCalled();
    expect(result.observedValue).toBe('mock-measurement');
    expect(result.collapsedState).toBeDefined();

    const ctx = mockCanvas.getContext('2d');
    expect(ctx?.clearRect).toHaveBeenCalled(); // Should re-render after collapse
    expect(ctx?.stroke).toHaveBeenCalled();
  });

  it('should render the state to the canvas', () => {
    app.initializeState('ground-state');
    const ctx = mockCanvas.getContext('2d');
    expect(ctx?.clearRect).toHaveBeenCalledTimes(1); // Initial clear
    expect(ctx?.fillRect).toHaveBeenCalledTimes(1); // Background fill
    expect(ctx?.beginPath).toHaveBeenCalledTimes(2); // Wave function and probability
    expect(ctx?.moveTo).toHaveBeenCalledTimes(2);
    expect(ctx?.lineTo).toHaveBeenCalled();
    expect(ctx?.stroke).toHaveBeenCalledTimes(2); // Two strokes for wave and prob
  });

  it('should not render if no quantum state is present', () => {
    const ctx = mockCanvas.getContext('2d');
    // Ensure no state is initialized initially
    app = new QuantumVisualizerApp(mockCanvas as any, mockEngine); // Re-init to ensure no state
    (ctx?.clearRect as any).mockClear(); // Clear any calls from constructor UI init (if any)
    (ctx?.stroke as any).mockClear();

    app.updateSimulation(); // Should not do anything if no state
    expect(ctx?.clearRect).not.toHaveBeenCalled();
    expect(ctx?.stroke).not.toHaveBeenCalled();

    app.performMeasurement(); // Should not do anything if no state
    expect(ctx?.clearRect).not.toHaveBeenCalled();
    expect(ctx?.stroke).not.toHaveBeenCalled();
  });
});

describe('DummySimulationEngine', () => {
    let engine: DummySimulationEngine;
    beforeEach(() => {
        engine = new DummySimulationEngine();
    });

    it('should create an initial state with default properties', () => {
        const state = engine.createInitialState('test-state');
        expect(state).toHaveProperty('waveFunction');
        expect(state).toHaveProperty('probabilityDensity');
        expect(state).toHaveProperty('potential');
        expect(state.energy).toBe(1);
    });

    it('should evolve a state over time', () => {
        const initialState = engine.createInitialState('test');
        const evolvedState = engine.evolveState(initialState, 0.5);
        // Dummy implementation simply shifts 't' in waveFunction, no direct energy change
        // For testing, we can check if it returns a new object with expected properties.
        expect(evolvedState).not.toBe(initialState);
        expect(evolvedState.waveFunction(0, 0)).not.toEqual(initialState.waveFunction(0, 0)); // Wave function should change
    });

    it('should recalculate state for a new potential', () => {
        const initialState = engine.createInitialState('test');
        const newPotential: PotentialFunction = (x) => x * x;
        const recalculatedState = engine.recalculateStateForPotential(initialState, newPotential);
        expect(recalculatedState).not.toBe(initialState);
        expect(recalculatedState.potential).toBe(newPotential);
        expect(recalculatedState.energy).toBeGreaterThan(initialState.energy || 0);
    });

    it('should perform a measurement and return a collapsed state', () => {
        const initialState = engine.createInitialState('test');
        const result = engine.measure(initialState);
        expect(result).toHaveProperty('observedValue');
        expect(result).toHaveProperty('collapsedState');
        expect(result.collapsedState).not.toBe(initialState);
        expect(result.collapsedState?.waveFunction(0,0)).toBeDefined();
    });
});