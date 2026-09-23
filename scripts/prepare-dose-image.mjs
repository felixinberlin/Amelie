#!/usr/bin/env node
/**
 * Macht ein Bild in public/ web-tauglich.
 *
 * Aufruf: node scripts/prepare-dose-image.mjs public/eurobird.png
 *
 * Erzeugt daneben <name>-640.webp und <name>-1280.webp und schrumpft das
 * Original auf höchstens 1280 Pixel Breite. Das Original bleibt als Fallback
 * für Browser ohne WebP liegen — praktisch nimmt es niemand mehr.
 *
 * Warum überhaupt: Ein 1536 Pixel breites Bild wird auf einem Telefon mit
 * 306 Pixeln dargestellt. Ohne Varianten lädt das Telefon trotzdem alles.
 *
 * sharp ist keine Projektabhängigkeit — das Skript läuft von Hand:
 *   npm i --no-save sharp && node scripts/prepare-dose-image.mjs <datei>
 */

import { statSync, renameSync } from 'node:fs';
import { resolve, dirname, basename, extname } from 'node:path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('sharp fehlt:  npm i --no-save sharp');
  process.exit(1);
}

const datei = process.argv[2];
if (!datei) {
  console.error('Aufruf: node scripts/prepare-dose-image.mjs public/<datei>');
  process.exit(1);
}

const pfad = resolve(datei);
const ordner = dirname(pfad);
const endung = extname(pfad);
const stamm = basename(pfad, endung);
const vorher = statSync(pfad).size;
const meta = await sharp(pfad).metadata();

let nachher = 0;
for (const breite of [640, 1280]) {
  const ziel = resolve(ordner, `${stamm}-${breite}.webp`);
  const info = await sharp(pfad).resize({ width: breite, withoutEnlargement: true }).webp({ quality: 82 }).toFile(ziel);
  nachher += info.size;
}

// Original auf 1280 begrenzen (über eine Zwischendatei, sharp liest sonst
// aus der Datei, in die es gerade schreibt)
const tmp = resolve(ordner, `${stamm}.tmp${endung}`);
const pipeline = sharp(pfad).resize({ width: 1280, withoutEnlargement: true });
const fallback = endung.toLowerCase() === '.png'
  ? await pipeline.png({ compressionLevel: 9, palette: true }).toFile(tmp)
  : await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(tmp);
renameSync(tmp, pfad);
nachher += fallback.size;

const aspect = (meta.width / meta.height).toFixed(3);
console.log(
  `${basename(pfad)}: ${meta.width}×${meta.height}, ${(vorher / 1024 / 1024).toFixed(2)} MB ` +
    `→ ${(nachher / 1024).toFixed(0)} kB in drei Dateien · imageAspect: ${aspect}`
);
