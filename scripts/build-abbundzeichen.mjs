// CC0 1.0 Public Domain.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const result = await build({
  entryPoints: [root + '07-demos/abbundzeichen-fundbuch/browser.ts'],
  bundle: true, write: false, format: 'iife', platform: 'browser',
  target: 'es2020', charset: 'utf8', legalComments: 'inline',
});
const script = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const template = await readFile(root + '07-demos/abbundzeichen-fundbuch/index.template.html', 'utf8');
if (template.split('/*__BUNDLE__*/').length !== 2) throw new Error('Expected one bundle marker.');
const html = template.replace('/*__BUNDLE__*/', () => script);
const output = root + 'public/abbundzeichen-fundbuch/index.html';
if (process.argv.includes('--check')) {
  if (await readFile(output, 'utf8').catch(() => '') !== html) {
    console.error('Abbundzeichen HTML drift: run node scripts/build-abbundzeichen.mjs');
    process.exitCode = 1;
  } else console.log('Abbundzeichen standalone HTML is current.');
} else {
  await mkdir(root + 'public/abbundzeichen-fundbuch', { recursive: true });
  await writeFile(output, html);
  console.log('Built public/abbundzeichen-fundbuch/index.html');
}
