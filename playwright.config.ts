import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:43189', headless: true },
  webServer: { command: 'node scripts/serve-static.mjs', env: { PORT: '43189' }, url: 'http://127.0.0.1:43189/Amelie/', reuseExistingServer: !process.env.CI },
});
