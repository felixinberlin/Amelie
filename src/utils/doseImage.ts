/**
 * Quellen für das Bild einer Dose.
 *
 * Die Dose nennt nur den Dateinamen (image: 'eurobird.png'). Daneben liegen
 * zwei WebP-Varianten, erzeugt von scripts/prepare-dose-image.mjs. Der
 * Browser wählt über srcset und sizes; das Original bleibt Fallback.
 *
 * Die Basis-URL muss mit: Auf GitHub Pages liegt die Seite unter /Amelie/,
 * und ein blanker relativer Pfad bricht, sobald die Seite je unter einem
 * tieferen Pfad ausgeliefert wird.
 */

function base(): string {
  const b = import.meta.env.BASE_URL || '/';
  return b.endsWith('/') ? b : `${b}/`;
}

export function doseImageSrc(datei: string): string {
  return `${base()}${datei.replace(/^\/+/, '')}`;
}

export function doseImageSrcSet(datei: string): string {
  const stamm = datei.replace(/^\/+/, '').replace(/\.(png|jpe?g|webp)$/i, '');
  return `${base()}${stamm}-640.webp 640w, ${base()}${stamm}-1280.webp 1280w`;
}

/**
 * Das Bild steht in der Kopfspalte der Dose, nicht über die volle Fensterbreite.
 * Stünde hier 100vw, lüde ein Telefon mit doppelter Pixeldichte die große
 * Variante — genau das, was die Varianten verhindern sollen.
 *
 * Bei Hochformaten deckelt die Höhe (34rem) die Breite, nicht die Spalte:
 * ein 0,558er Bild ist dann rund 300 Pixel breit, gleich wie groß das Fenster
 * ist. Ohne diesen Fall lädt ein Desktop die 1280er Datei für 304 Pixel.
 */
export function doseImageSizes(aspect?: number): string {
  if (aspect && aspect < 1) {
    // Ab rund 392 Pixel Fensterbreite deckelt die Höhe, darunter die Spalte.
    // min() bildet beides ab, statt an einer Bruchstelle falsch zu raten.
    const breite = Math.ceil(544 * aspect) + 8;
    return `min(calc(100vw - 5.5rem), ${breite}px)`;
  }
  return '(max-width: 768px) calc(100vw - 5.5rem), (max-width: 1280px) calc(100vw - 12rem), 900px';
}

/** Fallback für Bilder ohne bekanntes Seitenverhältnis */
export const DOSE_IMAGE_SIZES = doseImageSizes();
