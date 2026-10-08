import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { doseImageSrc } from '../utils/doseImage';

/**
 * Video zu einer Dose, ohne die Seite langsamer zu machen.
 *
 * Bis zum Klick steht nur ein Vorschaubild da (WebP, 640 oder 1280 Pixel breit, lazy):
 * kein <video>-Element, also auch kein Abruf von Metadaten. Erst der Klick setzt das
 * Video mit preload="none" und autoPlay ein; der Rahmen hält das Seitenverhältnis,
 * damit beim Wechsel nichts springt. Die Datei liegt in public/ (komprimiert,
 * faststart), der Pfad läuft über dieselbe Basis-URL wie die Bilder.
 */
export function DoseVideo({ file, poster, aspect = 16 / 9, title, lang }: {
  file: string;
  poster?: string;
  aspect?: number;
  title?: string;
  lang: string;
}) {
  const [playing, setPlaying] = useState(false);
  const isDe = lang === 'de';
  const label = title || (isDe ? 'Video ansehen' : lang === 'es' ? 'Ver vídeo' : 'Watch video');
  const posterSmall = poster?.replace(/\.webp$/i, '-640.webp');

  return (
    <figure className="space-y-2">
      <div
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--m-line-strong)] bg-[var(--m-surface-2)] shadow-xs"
        style={{ aspectRatio: String(aspect) }}
      >
        {playing ? (
          <video
            className="absolute inset-0 h-full w-full bg-black object-contain"
            src={doseImageSrc(file)}
            poster={poster ? doseImageSrc(poster) : undefined}
            controls
            autoPlay
            playsInline
            preload="none"
            aria-label={label}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`${label} (${isDe ? 'abspielen' : 'play'})`}
          >
            {poster && (
              <picture>
                <source
                  type="image/webp"
                  srcSet={`${doseImageSrc(posterSmall!)} 640w, ${doseImageSrc(poster)} 1280w`}
                  sizes="(min-width: 800px) 768px, 100vw"
                />
                <img
                  src={doseImageSrc(poster)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            )}
            <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition-transform group-hover:scale-110 sm:h-16 sm:w-16">
              <Play className="ml-1 h-6 w-6 fill-current text-[var(--m-accent)] sm:h-7 sm:w-7" />
            </span>
          </button>
        )}
      </div>
      {title && (
        <figcaption className="text-center text-xs font-typewriter text-[var(--m-muted)]">{title}</figcaption>
      )}
    </figure>
  );
}
