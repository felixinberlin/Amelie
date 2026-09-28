import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the DOM for testing client-side components
const dom = new JSDOM(`<!DOCTYPE html>
    <body>
        <canvas id="spectrogramCanvas"></canvas>
        <button id="classifyButton"></button>
        <button id="skipButton"></button>
        <select id="classificationSelect"></select>
    </body>`);
global.document = dom.window.document;
global.window = dom.window as any;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.Image = dom.window.Image;

// Simplified mock classes for testing
class MockSpectrogramRenderer {
    canvas: HTMLCanvasElement;
    messages: string[] = [];
    renderedDataUrls: string[] = [];

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        // Mock canvas context methods
        const mockCtx = {
            clearRect: vi.fn(),
            fillText: vi.fn(),
            drawImage: vi.fn(),
            font: '', textAlign: '', fillStyle: ''
        };
        vi.spyOn(this.canvas, 'getContext').and.returnValue(mockCtx as any);
    }

    renderSpectrogram(dataUrl: string) {
        this.renderedDataUrls.push(dataUrl);
        this.messages.push(`Rendered: ${dataUrl}`);
    }

    displayMessage(message: string) {
        this.messages.push(message);
    }
}

class MockDataFetcher {
    private eventsToReturn: any[];
    private currentIndex = 0;

    constructor(events: any[]) {
        this.eventsToReturn = events;
    }

    async fetchNextEvent(): Promise<any | null> {
        if (this.currentIndex < this.eventsToReturn.length) {
            return Promise.resolve(this.eventsToReturn[this.currentIndex++]);
        }
        return Promise.resolve(null);
    }
}

class MockUserClassifier {
    classifyButton: HTMLButtonElement;
    skipButton: HTMLButtonElement;
    classificationDropdown: HTMLSelectElement;
    classifyCallbacks: ((classification: string) => void)[] = [];
    skipCallbacks: (() => void)[] = [];

    constructor(
        classifyButton: HTMLButtonElement,
        skipButton: HTMLButtonElement,
        classificationDropdown: HTMLSelectElement
    ) {
        this.classifyButton = classifyButton;
        this.skipButton = skipButton;
        this.classificationDropdown = classificationDropdown;

        // Mock dropdown population
        const option1 = document.createElement('option');
        option1.value = 'BBH_Merger';
        this.classificationDropdown.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = 'Terrestrial_Glitch';
        this.classificationDropdown.appendChild(option2);

        this.classifyButton.addEventListener = vi.fn((event, callback) => {
            if (event === 'click') {
                (this.classifyButton as any)._clickCallback = callback;
            }
        });
        this.skipButton.addEventListener = vi.fn((event, callback) => {
            if (event === 'click') {
                (this.skipButton as any)._clickCallback = callback;
            }
        });
    }

    onClassify(callback: (classification: string) => void) {
        this.classifyCallbacks.push(callback);
    }

    onSkip(callback: () => void) {
        this.skipCallbacks.push(callback);
    }

    resetClassification() {
        this.classificationDropdown.value = '';
    }

    // Helper to simulate clicks
    simulateClassifyClick(classification: string) {
        this.classificationDropdown.value = classification;
        if ((this.classifyButton as any)._clickCallback) {
            (this.classifyButton as any)._clickCallback();
        }
    }

    simulateSkipClick() {
        if ((this.skipButton as any)._clickCallback) {
            (this.skipButton as any)._clickCallback();
        }
    }
}

class MockAnalytics {
    events: { name: string; props: Record<string, any> }[] = [];
    trackEvent(eventName: string, properties: Record<string, any>) {
        this.events.push({ name: eventName, props: properties });
    }
}

// Re-define the main App class using mocks for testing
class TestKosmischeKaskadenKlassifiziererApp {
    private currentEvent: any | null = null;
    private renderer: MockSpectrogramRenderer;
    private dataFetcher: MockDataFetcher;
    private userClassifier: MockUserClassifier;
    private analytics: MockAnalytics;

    constructor(
        canvasElement: HTMLCanvasElement,
        classifyButton: HTMLButtonElement,
        skipButton: HTMLButtonElement,
        classificationDropdown: HTMLSelectElement,
        mockEvents: any[] = []
    ) {
        this.renderer = new MockSpectrogramRenderer(canvasElement);
        this.dataFetcher = new MockDataFetcher(mockEvents);
        this.userClassifier = new MockUserClassifier(classifyButton, skipButton, classificationDropdown);
        this.analytics = new MockAnalytics();

        this.userClassifier.onClassify(this.handleClassification.bind(this));
        this.userClassifier.onSkip(this.loadNextEvent.bind(this));

        // Auto-init for test clarity
        this.init();
    }

    private async init() {
        await this.loadNextEvent();
    }

    private async loadNextEvent() {
        try {
            const event = await this.dataFetcher.fetchNextEvent();
            this.currentEvent = event;
            if (event) {
                this.renderer.renderSpectrogram(event.spectrogramDataUrl);
                this.userClassifier.resetClassification();
                this.analytics.trackEvent('event_loaded', { eventId: event.id });
            } else {
                this.renderer.displayMessage('No more events. Thank you for your contribution!');
            }
        } catch (error) {
            console.error('Failed to load next event:', error);
            this.renderer.displayMessage('Error loading event. Please try again later.');
        }
    }

    private async handleClassification(classification: string) {
        if (!this.currentEvent) return;

        this.analytics.trackEvent('event_classified', {
            eventId: this.currentEvent.id,
            classification: classification
        });

        // Simulate API call for classification
        await Promise.resolve(); // Simulate async fetch

        await this.loadNextEvent();
    }
    // Expose mocks for assertions
    getMockRenderer() { return this.renderer; }
    getMockDataFetcher() { return this.dataFetcher; }
    getMockUserClassifier() { return this.userClassifier; }
    getMockAnalytics() { return this.analytics; }
}

describe('KosmischeKaskadenKlassifiziererApp', () => {
    let canvas: HTMLCanvasElement;
    let classifyButton: HTMLButtonElement;
    let skipButton: HTMLButtonElement;
    let classificationSelect: HTMLSelectElement;
    let app: TestKosmischeKaskadenKlassifiziererApp;

    const mockEvents = [
        { id: 'event-1', spectrogramDataUrl: 'data-url-1', metadata: {} },
        { id: 'event-2', spectrogramDataUrl: 'data-url-2', metadata: {} }
    ];

    beforeEach(() => {
        canvas = document.getElementById('spectrogramCanvas') as HTMLCanvasElement;
        classifyButton = document.getElementById('classifyButton') as HTMLButtonElement;
        skipButton = document.getElementById('skipButton') as HTMLButtonElement;
        classificationSelect = document.getElementById('classificationSelect') as HTMLSelectElement;

        // Reset elements
        canvas.width = 0; canvas.height = 0; // Reset width/height
        classificationSelect.innerHTML = ''; // Clear options

        // Re-initialize app for each test
        app = new TestKosmischeKaskadenKlassifiziererApp(canvas, classifyButton, skipButton, classificationSelect, mockEvents);

        // Mock Image onload for renderer
        vi.spyOn(dom.window.Image.prototype, 'onload', 'set').and.callFake(function (this: HTMLImageElement, cb) {
            if (cb) cb.call(this); // Immediately call onload for tests
        });
    });

    it('should load the first event on initialization and render its spectrogram', async () => {
        // Wait for async init to complete
        await vi.runAllTimersAsync();

        const renderer = app.getMockRenderer();
        const analytics = app.getMockAnalytics();

        expect(renderer.renderedDataUrls).toContain('data-url-1');
        expect(analytics.events).toContainEqual(
            expect.objectContaining({ name: 'event_loaded', props: { eventId: 'event-1' } })
        );
    });

    it('should load the next event after a classification', async () => {
        await vi.runAllTimersAsync(); // Init + first event load

        const userClassifier = app.getMockUserClassifier();
        const renderer = app.getMockRenderer();
        const analytics = app.getMockAnalytics();

        userClassifier.simulateClassifyClick('BBH_Merger');
        await vi.runAllTimersAsync(); // Simulate classification and next event load

        expect(analytics.events).toContainEqual(
            expect.objectContaining({ name: 'event_classified', props: { eventId: 'event-1', classification: 'BBH_Merger' } })
        );
        expect(renderer.renderedDataUrls).toContain('data-url-2');
        expect(analytics.events).toContainEqual(
            expect.objectContaining({ name: 'event_loaded', props: { eventId: 'event-2' } })
        );
    });

    it('should load the next event when skip button is clicked', async () => {
        await vi.runAllTimersAsync(); // Init + first event load

        const userClassifier = app.getMockUserClassifier();
        const renderer = app.getMockRenderer();
        const analytics = app.getMockAnalytics();

        userClassifier.simulateSkipClick();
        await vi.runAllTimersAsync(); // Simulate skip and next event load

        expect(renderer.renderedDataUrls).toContain('data-url-2');
        expect(analytics.events).not.toContainEqual(
            expect.objectContaining({ name: 'event_classified' })
        );
        expect(analytics.events).toContainEqual(
            expect.objectContaining({ name: 'event_loaded', props: { eventId: 'event-2' } })
        );
    });

    it('should display a message when no more events are available', async () => {
        // Create an app with no events
        app = new TestKosmischeKaskadenKlassifiziererApp(canvas, classifyButton, skipButton, classificationSelect, []);
        await vi.runAllTimersAsync(); // Init (will try to load, find none)

        const renderer = app.getMockRenderer();
        expect(renderer.messages).toContain('No more events. Thank you for your contribution!');
    });
});

vi.useFakeTimers(); // Enable fake timers for async operations in tests