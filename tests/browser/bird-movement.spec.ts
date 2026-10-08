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

test('station selection updates the observation chart and preserves missing-data gaps', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  const station = demo.getByLabel('Radar station', { exact: true });
  await expect(station.locator('option')).toHaveCount(21);
  await station.selectOption({ index: 1 });
  const selected = (await station.inputValue()).toUpperCase();
  const chart = demo.locator('svg[aria-label="Observed density over the week"]');
  await expect(chart).toBeVisible();
  await expect(chart).toContainText(selected);
  await expect(demo).toContainText('birds/km²');
  // Daytime / missing observations split the trace instead of becoming zero or an interpolated flight.
  await expect.poll(() => chart.getByTestId('density-segment').count()).toBeGreaterThan(1);
});

test('replay defaults to skipping daytime and allows all hours', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  const skip = demo.getByRole('checkbox', { name: 'Skip daytime', exact: true });
  await expect(skip).toBeChecked();
  const slider = demo.getByRole('slider', { name: 'Observation time', exact: true });
  const selectMidday = async () => {
    await slider.focus();
    await slider.press('Home');
    for (let hour = 0; hour < 12; hour++) await slider.press('ArrowRight');
    await expect(slider).toHaveValue('12');
  };
  await selectMidday();
  await demo.getByRole('button', { name: 'Play movement', exact: true }).click();
  await expect.poll(async () => Number(await slider.inputValue()), { intervals: [100] }).toBeGreaterThan(13);
  await demo.getByRole('button', { name: 'Pause', exact: true }).click();
  await skip.uncheck();
  await expect(skip).not.toBeChecked();
  await selectMidday();
  await demo.getByRole('button', { name: 'Play movement', exact: true }).click();
  await expect.poll(() => slider.inputValue(), { intervals: [100] }).toBe('13');
  await demo.getByRole('button', { name: 'Pause', exact: true }).click();
});

test('expanded map closes with Escape and restores normal controls', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  await demo.getByRole('button', { name: 'Expand map', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Expanded bird movement map', exact: true });
  await expect(dialog.getByRole('button', { name: 'Close expanded map', exact: true })).toBeVisible();
  await expect(dialog.getByRole('region', { name: 'Bird migration radar map' })).toBeVisible();
  const viewport = page.viewportSize()!;
  await expect.poll(async () => {
    const bounds = await dialog.boundingBox();
    return bounds ? Math.max(Math.abs(bounds.x), Math.abs(bounds.y), Math.abs(bounds.width - viewport.width), Math.abs(bounds.height - viewport.height)) : Infinity;
  }).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');
  await expect(demo.getByRole('button', { name: 'Expand map', exact: true })).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await expect(demo.getByRole('button', { name: 'Expand map', exact: true })).toBeFocused();
});

test('station observations can be compared on a shared scale and downloaded with provenance', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  const demo = page.locator('#bird-migration-demo');
  await demo.getByRole('checkbox', { name: 'Use the same scale for all stations' }).check();
  await expect(demo).toContainText('Shared scale');
  await expect(demo.getByTestId('bird-station-reading')).toContainText('2017-10-01');
  const downloadEvent = page.waitForEvent('download');
  await demo.getByRole('button', { name: 'Download station data (CSV)' }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('eurobirdcast-depro-2017-10-01_07.csv');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('10.5281/zenodo.6874789; CC BY 4.0');
  expect(csv.trim().split('\r\n')).toHaveLength(171);
  expect(csv).toContain('daytime,,,');
});

test('fullscreen replay restarts after the final hour', async ({ page }) => {
  await page.goto(`${project}?lang=en`);
  await page.getByRole('button', { name: 'Expand map', exact: true }).click();
  const dialog = page.getByRole('dialog');
  const slider = dialog.getByRole('slider', { name: 'Expanded observation time' });
  await slider.focus();
  await slider.press('End');
  await expect(slider).toHaveValue('167');
  await dialog.getByRole('button', { name: 'Play movement', exact: true }).click();
  await expect.poll(() => slider.inputValue()).not.toBe('167');
  await expect(dialog).toContainText('Historical replay');
});
