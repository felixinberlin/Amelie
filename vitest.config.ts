import { defineConfig } from 'vitest/config';
import { sitePages } from './scripts/site-pages.mjs';

export default defineConfig({
  base: '/Amelie/',
  plugins: [sitePages()],
  test: {
    globals: true,
    // scripts/*.test.mjs mit node:test laufen über `npm run test:lab-inbox`, nicht über Vitest
    exclude: ['tests/browser/**', '**/node_modules/**', '**/dist/**', 'scripts/lab-inbox.test.mjs'],
    environment: 'node',
  },
});
