// Eine Adresse für alles, was an Amélie geht: Fragen, Ideen, Dosen, Korrekturen.
export const AMELIE_EMAIL = 'Felix@projectamelie.org';

/** Viele Mailprogramme schneiden mailto-Links um 2000 Zeichen ab. */
export const MAILTO_MAX = 1800;

/** mailto-Link an Amélie; ein zu langer Text wird gekürzt und als gekürzt markiert. */
export function amelieMailto(betreff: string, text = ''): string {
  const bau = (t: string) => `mailto:${AMELIE_EMAIL}?subject=${encodeURIComponent(betreff)}${t ? `&body=${encodeURIComponent(t)}` : ''}`;
  let t = text;
  let url = bau(t);
  while (url.length > MAILTO_MAX && t.length > 0) {
    t = t.slice(0, Math.floor(t.length * 0.8)).trimEnd();
    url = bau(t ? `${t}\n\n[… gekürzt]` : '');
  }
  return url;
}
