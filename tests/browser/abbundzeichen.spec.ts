import { test, expect } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';

const offlineFile = pathToFileURL(resolve('public/abbundzeichen-fundbuch/index.html')).href;

// Exercise the actual shipped, embedded engine with the network unavailable.
test('standalone file checks edits offline and preserves invalid input', async ({ page, context }) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  await context.setOffline(true);
  await page.goto(offlineFile);
  await page.getByTestId('example').selectOption('fehlender-staender');
  await page.getByTestId('load-example').click();
  await expect(page.locator('[data-rule="R1-LUECKE"]').first()).toBeVisible();
  const mark = page.locator('[data-index="0"][data-field="zeichen"]');
  await mark.fill('bad mark <img src=x onerror=alert(1)>');
  await expect(page.getByTestId('input-error')).toBeVisible();
  await expect(mark).toHaveValue('bad mark <img src=x onerror=alert(1)>');
  await expect(page.getByTestId('download')).toBeDisabled();
  await expect(page.getByTestId('results').locator('img')).toHaveCount(0);
  await mark.fill('I^');
  await expect(page.getByTestId('input-error')).toHaveCount(0);
  await expect(page.locator('[data-rule="R1-LUECKE"]').first()).toBeVisible();
  await page.getByTestId('language').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-index="0"][data-field="zeichen"]')).toHaveValue('I^');
  await expect(page.getByTestId('origin')).toContainText('Synthetic');
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test('JSON export retains synthetic provenance, unreadable marks and coarse location', async ({ page, context }) => {
  await context.setOffline(true);
  await page.goto(offlineFile + '?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByTestId('example').selectOption('unlesbares-zeichen');
  await page.getByTestId('load-example').click();
  await page.getByTestId('municipality').fill('Example municipality');
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download').click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const data = JSON.parse(await readFile(path!, 'utf8'));
  expect(data.format).toBe('abbundzeichen-fundbuch');
  expect(data.ortsgenauigkeit).toBe('gemeinde');
  expect(data.ort).toEqual({ gemeinde: 'Example municipality', landkreis: null, land: 'Deutschland' });
  expect(data.bemerkung).toContain('SYNTHETIC');
  expect(data.unlesbar).toHaveLength(1);
  expect(data.bauteile.some((part: { lesung: { zustand: string } }) => part.lesung.zustand === 'unlesbar')).toBe(true);
  expect(data.befunde.every((flag: { stufe: string }) => ['hinweis', 'verdacht'].includes(flag.stufe))).toBe(true);
  expect(Object.keys(data.ort).sort()).toEqual(['gemeinde', 'land', 'landkreis']);
});

test('manual record requires municipality and retains added member metadata', async ({ page }) => {
  await page.goto(offlineFile);
  await page.getByTestId('add-part').click();
  await page.locator('[data-index="0"][data-field="zeichen"]').fill('IIII');
  await page.getByTestId('download').click();
  await expect(page.getByTestId('export-status')).toContainText('Gemeinde');
  await page.locator('[data-testid="part"] summary').click();
  await page.locator('[data-index="0"][data-field="markierungsart"]').selectOption('geritzt');
  await page.locator('[data-index="0"][data-field="werkzeug"]').selectOption('reissmesser');
  await page.getByTestId('municipality').fill('Musterdorf');
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download').click();
  const download = await downloadPromise;
  const data = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(data.bemerkung).not.toContain('SYNTHETIC');
  expect(data.bauteile[0]).toMatchObject({ zeichen: 'IIII', markierungsart: 'geritzt', werkzeug: 'reissmesser' });
  await page.locator('[data-action="remove"]').click();
  await expect(page.getByTestId('part')).toHaveCount(0);
  await expect(page.getByTestId('download')).toBeDisabled();
});

test('dose page exposes a Pages-subpath demo link', async ({ page }) => {
  await page.goto('/Amelie/dosen/abbundzeichen-fundbuch/?lang=en');
  const link = page.getByRole('link', { name: 'Open demo (new tab)' });
  await expect(link).toHaveAttribute('href', '/Amelie/abbundzeichen-fundbuch/index.html?lang=en');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('published segment stays scoped to one beam and exports provenance even after editing', async ({ page, context }) => {
  await context.setOffline(true);
  await page.goto(offlineFile + '?lang=en');
  await page.locator('details').filter({ has: page.getByTestId('load-literature') }).locator('summary').click();
  await page.getByTestId('load-literature').click();
  await expect(page.getByTestId('part')).toHaveCount(4);
  await expect(page.getByTestId('origin')).toContainText(/one beam/i);
  await expect(page.getByTestId('results')).toContainText('Flags: 0');
  await expect(page.getByTestId('results')).toContainText(/confirms neither/i);
  await page.locator('[data-index="2"][data-field="zeichen"]').fill('IIII');
  await expect(page.locator('[data-rule="R2-DOPPELUNG"]')).toBeVisible();
  await page.getByTestId('municipality').fill('West Wycombe');
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download').click();
  const download = await downloadPromise;
  const data = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(data.bemerkung).toContain('oxfordarchaeology.com');
  expect(data.bemerkung).toContain('2.3.1');
  expect(data.bemerkung).toMatch(/edit|bearbeit/i);
  expect(data.bemerkung).toMatch(/one beam|einem Balken/i);
  expect(data.bauteile[2].zeichen).toBe('IIII');
  await page.locator('[data-action="remove"]').nth(3).click();
  await expect(page.getByTestId('part')).toHaveCount(3);
  await expect(page.getByTestId('origin')).toContainText('edited record may differ');
});
