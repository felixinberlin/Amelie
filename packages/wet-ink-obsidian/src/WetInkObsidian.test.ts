import { describe, it, expect, vi } from 'vitest';
import { registerWetInkCodeBlock } from './index';

describe('@wet-ink/obsidian — Modular Obsidian Layer', () => {
  it('registers markdown codeblock processor with Obsidian plugin instance', () => {
    let registeredType = '';
    let handlerFn: any = null;

    const mockPlugin = {
      registerMarkdownCodeBlockProcessor: (type: string, fn: any) => {
        registeredType = type;
        handlerFn = fn;
      }
    };

    registerWetInkCodeBlock(mockPlugin, {
      defaultPaper: 'washi',
      defaultPigment: 'indigo'
    });

    expect(registeredType).toBe('wet-ink');
    expect(typeof handlerFn).toBe('function');
  });

  it('throws an error if plugin does not support codeblock processors', () => {
    expect(() => registerWetInkCodeBlock(null)).toThrow();
    expect(() => registerWetInkCodeBlock({})).toThrow();
  });
});
