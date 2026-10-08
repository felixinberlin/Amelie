import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';
const pages: { path: string; title: string }[] = JSON.parse(readFileSync('dist/route-manifest.json', 'utf8'));
const dose = '/Amelie/dosen/strassennamen-pruefer/';

test('every published route serves a real HTML file with valid assets', async ({ request }) => {
  expect(new Set(pages.map(p => p.path)).size).toBe(pages.length);
  for (const page of pages) {
    const response = await request.get('/Amelie' + page.path);
    expect(response.status(), page.path).toBe(200);
    const html = await response.text();
    expect(html, page.path).toContain('<link rel="canonical"');
    for (const [, src] of html.matchAll(/(?:src|href)="(\/Amelie\/assets\/[^"#]+)"/g)) {
      expect((await request.get(src)).status(), src).toBe(200);
    }
  }
  expect((await request.get('/Amelie/unknown-route/')).status()).toBe(404);
});

test('gallery loads under the JavaScript budget without unrelated features', async ({ page }, testInfo) => {
  const scripts = new Set<string>();
  page.on('request', req => { if (req.url().includes('/assets/') && req.url().endsWith('.js')) scripts.add(new URL(req.url()).pathname); });
  await page.goto('/Amelie/dosen/');
  await expect(page.locator('article').first()).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  const names = [...scripts].join('\n');
  expect(names).not.toMatch(/Simulator|FugenduellArena|GrainSackZenGame|HofLichterGame|QuellenView|FundingCompass|GoogleAccountImporter|firebase/i);
  const gzipBytes = [...scripts].reduce((sum, path) => sum + gzipSync(readFileSync(resolve('dist', path.replace('/Amelie/', '')))).length, 0);
  console.log(JSON.stringify({ galleryScripts: [...scripts], gzipBytes, baselineGzipBytes: 1224090 }));
  expect(gzipBytes).toBeLessThan(1224090 / 2);
  await page.screenshot({ path: testInfo.outputPath('gallery.png') });
});

test('dose links support new tabs, navigation, refresh, back and forward', async ({ page, context }) => {
  await page.goto('/Amelie/dosen/?lang=de');
  const link = page.locator('article a[href*="/dosen/strassennamen-pruefer/"]').first();
  await expect(link).toHaveAttribute('href', /\/dosen\/strassennamen-pruefer\/\?lang=de$/);
  const other = await context.newPage();
  await other.goto(await link.getAttribute('href') as string);
  await expect(other.locator('main h1')).toBeVisible();
  await other.close();
  await link.click();
  await expect(page).toHaveURL(/dosen\/strassennamen-pruefer\/\?lang=de$/);
  expect((await page.reload())?.status()).toBe(200);
  await expect(page.locator('main h1')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/dosen\/\?lang=de$/);
  await page.goForward();
  await expect(page).toHaveURL(/strassennamen-pruefer/);
});

test('legacy delivery and chapter links resolve without losing preferences', async ({ page }) => {
  await page.goto('/Amelie/?admin&mood=cinema#dose=strassennamen-pruefer&lang=de');
  await expect(page).toHaveURL(/\/dosen\/strassennamen-pruefer\/\?admin=&mood=cinema&lang=de$/);
  await expect(page.locator('main h1')).toBeVisible();
  const chapterPage = pages.find(p => p.path.startsWith('/dosen/strassennamen-pruefer/book/'))!;
  const slug = chapterPage.path.split('/').filter(Boolean).at(-1);
  await page.goto(`/Amelie/#dose=strassennamen-pruefer&buch=${slug}`);
  await expect(page).toHaveURL('/Amelie' + chapterPage.path);
  await expect(page.locator('main').getByText('The book behind the tin', { exact: true })).toBeVisible();
  expect((await page.reload())?.status()).toBe(200);
});

test('chapter links update history and follow back navigation', async ({ page }) => {
  const chapters = pages.filter(p => p.path.startsWith('/dosen/strassennamen-pruefer/book/'));
  expect(chapters.length).toBeGreaterThan(1);
  await page.goto('/Amelie' + chapters[0].path);
  await expect(page.locator('main').getByText('The book behind the tin', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: /^Next$/ }).last().click();
  await expect(page).toHaveURL('/Amelie' + chapters[1].path);
  await page.goBack();
  await expect(page).toHaveURL('/Amelie' + chapters[0].path);
});

test('one simulator loads and simulator switching follows URLs', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', req => { if (req.url().endsWith('.js')) scripts.push(req.url()); });
  await page.goto('/Amelie/#sim=altbau-thermal&lang=de');
  await expect(page).toHaveURL(/\/simulators\/altbau\/\?lang=de$/);
  await expect(page.getByRole('link', { name: /Glasanflug/ })).toBeVisible();
  await expect.poll(() => scripts.some(s => /AltbauThermalSimulator/.test(s))).toBe(true);
  expect(scripts.join('\n')).not.toMatch(/ChemHazardSimulator|KristallwachstumSimulator|GlasanflugSimulator/);
  await page.getByRole('link', { name: /Glasanflug/ }).click();
  await expect(page).toHaveURL(/\/simulators\/glasanflug\/\?lang=de$/);
  await expect.poll(() => scripts.some(s => /GlasanflugSimulator/.test(s))).toBe(true);
  await page.goBack();
  await expect(page).toHaveURL(/\/simulators\/altbau\/\?lang=de$/);
});

test('comparison edits stay in the query and do not hijack section navigation', async ({ page }) => {
  await page.goto('/Amelie/#compare=dose:kristallwachstum-3d,dose:dose-cleaner-chemical-safety');
  await expect(page).toHaveURL(/\/compare\/\?items=/);
  await expect(page.locator('main')).toContainText('3D Crystal Growth Simulation');
  await page.getByRole('link', { name: /^Try it$/ }).click();
  await expect(page).toHaveURL('/Amelie/games/');
  await page.goBack();
  await expect(page).toHaveURL(/\/compare\/\?items=/);
});

test('unknown identifiers render not-found and local-only doses have refresh-safe links', async ({ page }) => {
  await page.goto('/Amelie/dosen/no-such-dose/');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await page.goto(dose);
  const seed = JSON.parse(readFileSync('public/data/dosen.json', 'utf8'))[0];
  await page.evaluate(record => {
    localStorage.setItem('amelie_custom_dosen', JSON.stringify([{ ...record, id: 'local-test-dose', title: 'Local test dose', titleEn: 'Local test dose', titleDe: 'Local test dose', titleEs: 'Local test dose' }]));
    localStorage.setItem('amelie_mood_v1', 'cinema');
  }, seed);
  await page.goto('/Amelie/dosen/?dose=local-test-dose');
  await expect(page.locator('main h1')).toContainText('Local test dose');
  expect((await page.reload())?.status()).toBe(200);
  await expect(page.locator('main h1')).toContainText('Local test dose');
  await page.goto('/Amelie/dosen/');
  await expect(page.locator('article a').filter({ hasText: 'Local test dose' })).toHaveAttribute('href', /\/dosen\/\?dose=local-test-dose$/);
});

test('every existing section renders without client errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const sections = pages.filter(p => p.path.split('/').filter(Boolean).length === 1);
  for (const section of sections) {
    await page.goto('/Amelie' + section.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toHaveAttribute('data-route-ready', 'true');
    await expect(page.locator('main')).not.toContainText('This page could not load');
    await expect(page.locator('main')).not.toContainText('Page not found');
    await expect(page.locator('main')).not.toBeEmpty();
    expect(errors, section.path).toEqual([]);
  }
});

test('browser back restores gallery scroll and focus after lazy content loads', async ({ page }) => {
  await page.goto('/Amelie/dosen/');
  await expect(page.locator('article').last()).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(700);
  // Route via the sticky header so the destination link does not scroll the gallery first.
  await page.getByRole('link', { name: /^Try it$/ }).click();
  await expect(page).toHaveURL('/Amelie/games/');
  await expect(page.locator('main')).toHaveAttribute('data-route-path', '/games/');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/Amelie/dosen/');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(700);
  await expect(page.locator('#main-content')).toBeFocused();
});

test('failed lazy chunks show a retry action without removing local drafts', async ({ page }) => {
  await page.goto('/Amelie/dosen/');
  await expect(page.locator('article').first()).toBeVisible();
  await page.evaluate(() => localStorage.setItem('amelie_custom_candidates', JSON.stringify([{ id: 'saved-draft', title: 'Saved draft' }])));
  await page.route('**/assets/FundingCompass-*.js', route => route.abort());
  await page.getByRole('link', { name: /^Research$/ }).click();
  await page.getByRole('link', { name: /Funding compass/ }).click();
  await expect(page.getByRole('button', { name: 'Reload and retry' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('amelie_custom_candidates'))).toContain('saved-draft');
});

test('EuroBirdCast is the first project and exposes its revival research', async ({ page }) => {
  await page.goto('/Amelie/dosen/?lang=de');
  await expect(page.locator('article').first()).toContainText('EuroBirdCast');
  await page.goto('/Amelie/#dose=eurobirdcast&lang=de');
  await expect(page.locator('main h1')).toContainText('EuroBirdCast');
  await page.goto('/Amelie/dosen/eurobirdcast/book/revival/?lang=de');
  await expect(page.locator('main')).toContainText('Wiederaufnahme und Forschungsplan');
  await expect(page.locator('main')).toContainText('Bedarf unklar');
});
