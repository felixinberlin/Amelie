import { WetInkEventMap } from './types';

export class WetInkEventEmitter {
  private listeners: { [K in keyof WetInkEventMap]?: Array<WetInkEventMap[K]> } = {};

  public on<K extends keyof WetInkEventMap>(event: K, handler: WetInkEventMap[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }

  public off<K extends keyof WetInkEventMap>(event: K, handler: WetInkEventMap[K]): void {
    const list = this.listeners[event];
    if (!list) return;
    this.listeners[event] = list.filter(fn => fn !== handler) as any;
  }

  public emit<K extends keyof WetInkEventMap>(event: K, ...args: Parameters<WetInkEventMap[K]>): void {
    const list = this.listeners[event];
    if (!list) return;
    for (const fn of list) {
      try {
        (fn as any)(...args);
      } catch (err) {
        console.error(`[WetInk] Error in event listener for ${event}:`, err);
      }
    }
  }

  public removeAllListeners(): void {
    this.listeners = {};
  }
}
