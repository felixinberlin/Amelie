import { defineConfig } from '@playwright/test';
process.env.NO_PROXY = process.env.NO_PROXY ? `${process.env.NO_PROXY},localhost,127.0.0.1` : 'localhost,127.0.0.1';
process.env.no_proxy = process.env.no_proxy ? `${process.env.no_proxy},localhost,127.0.0.1` : 'localhost,127.0.0.1';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:43189', headless: true },
  webServer: { command: `${process.execPath} scripts/serve-static.mjs`, env: { PORT: '43189' }, url: 'http://127.0.0.1:43189/Amelie/', reuseExistingServer: !process.env.CI },
});
