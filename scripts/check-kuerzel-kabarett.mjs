#!/usr/bin/env node
// Deterministic audit for the stand-alone Kürzel-Kabarett proposal data.
// Usage: node scripts/check-kuerzel-kabarett.mjs
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, '06-suche/kuerzel-kabarett-woerterbuch.json'), 'utf8'));
const issues = [];
const initialLetters = (s) =>
  [...String(s).matchAll(/\p{L}+(?:['’]\p{L}+)*/gu)]
    .map((match) => match[0][0].normalize('NFC').toLocaleUpperCase('de-DE'))
    .join('');
const normalizedCode = (s) => String(s).normalize('NFC').toLocaleUpperCase('de-DE').replace(/\s+/g, '');
const ids = new Set();
const sources = data.sources ?? {};
let variants = 0;

for (const item of data.entries ?? []) {
  if (!item.id || ids.has(item.id)) issues.push(`missing/duplicate entry id: ${item.id}`);
  ids.add(item.id);
  if (item.category !== 'game_token' && (!item.officialMeaning || !sources[item.sourceKey])) {
    issues.push(`official reference missing: ${item.id}`);
  }
  // Codes with digits (e.g. UH1) need separate numeric-token handling and deliberately
  // have no initial-only variants in this data set.
  if (/\d/.test(item.code) && item.variants.length) issues.push(`numbered code not split: ${item.id}`);
  for (const v of item.variants ?? []) {
    variants++;
    if (initialLetters(v.text) !== normalizedCode(item.code)) {
      issues.push(`invalid: ${item.code} ← ${v.text} [got ${initialLetters(v.text)}]`);
    }
    if (!['user','prior','new'].includes(v.origin)) issues.push(`bad origin: ${item.id}`);
  }
}
for (const c of data.combinations ?? []) {
  const expected = normalizedCode((c.codes ?? []).join(''));
  if (initialLetters(c.text) !== expected) {
    issues.push(`invalid combination: ${expected} ← ${c.text}`);
  }
}
for (const [code, phrase] of [
  ['WBA', 'Wieder Briefe, Alter!'],
  ['EK', 'Endlose Kürzel'],
  ['EKS', 'echt kein Spaß'],
  ['BB', 'Bonus? Blabla!'],
  ['IIBB', 'Immer irgendwelche Bescheide basteln'],
  ['SGBIIBBEKEKS', 'Scheiße, Geld Brauchen! Ich Ignoriere Behördenbriefe, Bis Ein Kleiner Elf Kohle Schickt.'],
]) {
  if (!data.combinations.some((c) => normalizedCode(c.codes.join('')) === code && c.text === phrase && c.favorite)) {
    issues.push(`user favorite missing: ${code} = ${phrase}`);
  }
}
if (issues.length) {
  for (const issue of issues) console.error('FAIL:', issue);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${ids.size} acronym entries, ${variants} validated expansions, ${data.combinations.length} validated phrases.`);
}
