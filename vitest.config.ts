import { defineConfig } from 'vitest/config';
import { sitePages } from './scripts/site-pages.mjs';

export default defineConfig({
  base: '/Amelie/',
  plugins: [sitePages()],
  test: {
    globals: true,
    exclude: ['tests/browser/**', '**/node_modules/**', '**/dist/**'],
    environment: 'node',
  },
});
