import { test, expect } from '@playwright/test';

test('Fugenduell presets, evolved capacity and replay controls work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/Amelie/simulators/fugenduell/?lang=en');
  const game = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Weather year: pick a city, pick a place, watch.', exact: true }) });
  await game.getByLabel('Crack Soil (Evolution)').selectOption('3');
  await game.getByRole('button', { name: 'Heatwave gang', exact: true }).click();
  await game.getByRole('button', { name: 'Load the year and watch', exact: true }).click();
  await expect(game.getByRole('heading', { name: 'The race for the crack' })).toBeVisible();
  await expect(game.getByRole('img', { name: /Green 6, red 6, space/ })).toHaveAttribute('aria-label', /space 65$/);
  await game.getByLabel('Playback speed').selectOption('650');
  await game.getByRole('button', { name: '▶ Play', exact: true }).click();
  await expect(game.getByRole('heading', { name: 'Start: 2 shoots and 2 seeds each', exact: true })).not.toBeVisible();
  await page.getByRole('button', { name: 'View plant · real botany', exact: true }).click();
  await page.getByRole('button', { name: 'Weather year · watch', exact: true }).click();
  await expect(game.getByRole('button', { name: '▶ Play', exact: true })).toBeVisible();
  const current = await game.locator('[aria-current="step"]').innerText();
  await page.waitForTimeout(800);
  expect(await game.locator('[aria-current="step"]').innerText()).toBe(current);
  await game.getByRole('button', { name: 'End ⏭', exact: true }).click();
  await expect(game.getByRole('status')).toContainText(/Team .* wins|Draw/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/fugenduell-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
