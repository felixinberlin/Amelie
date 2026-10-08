import { test, expect } from '@playwright/test';

const project = '/Amelie/dosen/eurobirdcast/';

test('historical bird movement map exposes dates, readings and source provenance', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  await expect(demo.getByRole('heading', { name: 'Bird movement over Germany and neighbouring countries' })).toBeVisible();
  await expect(demo.getByRole('region', { name: 'Bird migration radar map' })).toBeVisible();
  const dates = demo.getByLabel('Date (UTC)', { exact: true });
  await expect(dates.locator('option')).toHaveCount(7);
  expect(await dates.locator('option').allTextContents()).toEqual(expect.arrayContaining([
    expect.stringContaining('2017-10-01'), expect.stringContaining('2017-10-07'),
  ]));
  await expect(demo).toContainText(/historical|replay/i);
  await expect(demo.getByRole('link', { name: /source|zenodo|flux|data/i }).first()).toHaveAttribute('href', /zenodo\.org|doi\.org/);
  const readings = demo.locator('details').filter({ has: page.locator('summary', { hasText: /^Radar readings$/ }) });
  await expect(readings).not.toHaveAttribute('open', '');
  await readings.locator('summary').click();
  await expect(readings.getByRole('table')).toBeVisible();
  await expect(readings.locator('tbody tr')).toHaveCount(21);
  const slider = demo.getByRole('slider', { name: 'Observation time', exact: true });
  const original = await slider.inputValue();
  await slider.focus();
  await slider.press('ArrowRight');
  await expect.poll(() => slider.inputValue()).not.toBe(original);
  await dates.selectOption({ index: 6 });
  await expect(dates).toHaveValue(/2017-10-07|6/);
  expect(errors).toEqual([]);
});

test('movement replay can be played and paused without leaking playback', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  const slider = demo.getByRole('slider', { name: 'Observation time', exact: true });
  const initial = await slider.inputValue();
  await demo.getByRole('button', { name: 'Play movement', exact: true }).click();
  await expect.poll(() => slider.inputValue()).not.toBe(initial);
  await demo.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await slider.inputValue();
  await page.waitForTimeout(1200);
  await expect(slider).toHaveValue(paused);
  await expect(demo.getByRole('button', { name: 'Play movement', exact: true })).toBeVisible();
});

test('German bird movement controls work and research is available on demand', async ({ page }) => {
  await page.goto(`${project}?lang=de`);
  const demo = page.locator('#bird-migration-demo');
  await expect(demo.getByRole('heading', { name: 'Vogelbewegung über Deutschland und Nachbarländern' })).toBeVisible();
  await expect(demo.getByLabel('Datum (UTC)', { exact: true })).toBeVisible();
  await expect(demo.getByRole('button', { name: 'Bewegung abspielen', exact: true })).toBeVisible();
  await demo.locator('summary', { hasText: /^Radarmessungen$/ }).click();
  await expect(demo.getByRole('table')).toBeVisible();
  const research = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Daten, Wissenschaft und Kontakte$/ }) });
  await expect(research).not.toHaveAttribute('open', '');
  await research.locator(':scope > summary').click();
  await expect(research).toHaveAttribute('open', '');
});
