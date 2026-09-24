import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Plus, X, ShieldCheck, Keyboard, Download, AlertTriangle, Users } from 'lucide-react';
import { Language } from '../../types';
import { pfeife, Pfiff, THEMENWECHSEL } from '../../utils/schiedsrichter';

/**
 * TischSchiedsrichter — das lauffähige Skelett der Dose.
 *
 * Datenschutzversprechen: Erkannt wird nur, wenn der Browser es auf dem Gerät
 * kann (Web Speech API mit `processLocally`, Chrome ab 139). Kann er das
 * nicht, startet der Schiedsrichter nicht — es gibt keinen stillen Rückfall
 * auf Cloud-Erkennung. Der Testmodus (Tippen) funktioniert überall.
 * Gespeichert wird nichts: Das Spielprotokoll enthält nur das getroffene Wort
 * und die Uhrzeit und lebt, bis die Seite geschlossen wird.
 */

interface Props {
  lang: Language;
  onOpenDose?: (doseId: string) => void;
  isEmbedded?: boolean;
}

type Motor =
  | 'pruefe'
  | 'fehlt' // keine Web Speech API
  | 'unbekannt' // API ohne available(): Offline nicht nachweisbar → wir starten nicht
  | 'nicht-verfuegbar' // Browser kann diese Sprache nicht offline
  | 'laden' // Sprachpaket kann geladen werden
  | 'laedt'
  | 'bereit'
  | 'laeuft';

const BCP: Record<Language, string> = { de: 'de-DE', en: 'en-US', es: 'es-ES' };
const STANDARD: Record<Language, string[]> = {
  de: ['Politik', 'Wahl', 'Partei', 'Steuern', 'Regierung'],
  en: ['politics', 'election', 'president', 'taxes', 'government'],
  es: ['política', 'elecciones', 'Congreso', 'impuestos', 'gobierno'],
};

function tx(lang: Language, de: string, en: string, es: string) {
  return lang === 'de' ? de : lang === 'es' ? es : en;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function speechCtor(): any {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/** Schiedsrichterpfiff mit Web Audio: Triller um 2,8 kHz. Gelb ein Pfiff, Rot drei. */
function pfeifen(ctxRef: React.MutableRefObject<AudioContext | null>, anzahl: number) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    const ctx = ctxRef.current;
    const start = ctx.currentTime + 0.02;
    for (let i = 0; i < anzahl; i++) {
      const t = start + i * 0.42;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 2800;
      lfo.frequency.value = 32;
      lfoGain.gain.value = 160;
      lfo.connect(lfoGain).connect(osc.frequency);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
      gain.gain.setValueAtTime(0.35, t + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      lfo.start(t);
      osc.stop(t + 0.36);
      lfo.stop(t + 0.36);
    }
    if (navigator.vibrate) navigator.vibrate(anzahl === 1 ? 250 : [200, 120, 200, 120, 200]);
  } catch {
    // Kein Ton ist kein Grund, das Spiel abzubrechen.
  }
}

export const TischSchiedsrichterSimulator: React.FC<Props> = ({ lang, onOpenDose, isEmbedded = false }) => {
  const [woerter, setWoerter] = useState<string[]>(STANDARD[lang]);
  const [neuesWort, setNeuesWort] = useState('');
  const [einverstanden, setEinverstanden] = useState(false);
  const [motor, setMotor] = useState<Motor>('pruefe');
  const [fehler, setFehler] = useState<string | null>(null);
  const [verlauf, setVerlauf] = useState<Pfiff[]>([]);
  const [karte, setKarte] = useState<Pfiff | null>(null);
  const [thema, setThema] = useState<string>('');
  const [testText, setTestText] = useState('');

  const verlaufRef = useRef<Pfiff[]>([]);
  const woerterRef = useRef<string[]>(woerter);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recRef = useRef<any>(null);
  const laeuftRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const karteTimer = useRef<number | null>(null);

  useEffect(() => {
    woerterRef.current = woerter;
  }, [woerter]);

  // Sprache der Seite wechselt → Standardliste nur ersetzen, wenn noch unverändert
  useEffect(() => {
    setWoerter((w) => (Object.values(STANDARD).some((s) => s.join() === w.join()) ? STANDARD[lang] : w));
  }, [lang]);

  // Kann dieser Browser offline erkennen?
  const pruefeMotor = useCallback(async () => {
    const SR = speechCtor();
    if (!SR) return setMotor('fehlt');
    if (typeof SR.available !== 'function') return setMotor('unbekannt');
    try {
      const st = await SR.available({ langs: [BCP[lang]], processLocally: true });
      setMotor(st === 'available' ? 'bereit' : st === 'downloadable' ? 'laden' : st === 'downloading' ? 'laedt' : 'nicht-verfuegbar');
    } catch {
      setMotor('nicht-verfuegbar');
    }
  }, [lang]);

  useEffect(() => {
    void pruefeMotor();
  }, [pruefeMotor]);

  const zeigeKarte = useCallback(
    (p: Pfiff) => {
      verlaufRef.current = [...verlaufRef.current, p];
      setVerlauf(verlaufRef.current);
      setKarte(p);
      const liste = THEMENWECHSEL[lang];
      if (p.karte === 'rot') setThema(liste[Math.floor(Math.random() * liste.length)]);
      pfeifen(audioRef, p.karte === 'gelb' ? 1 : 3);
      if (karteTimer.current) window.clearTimeout(karteTimer.current);
      karteTimer.current = window.setTimeout(() => setKarte(null), p.karte === 'gelb' ? 3500 : 9000);
    },
    [lang]
  );

  const verarbeite = useCallback(
    (text: string) => {
      const p = pfeife(text, woerterRef.current, verlaufRef.current, Date.now());
      if (p) zeigeKarte(p);
    },
    [zeigeKarte]
  );

  const stoppe = useCallback(() => {
    laeuftRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* schon gestoppt */
    }
    recRef.current = null;
    setMotor((m) => (m === 'laeuft' ? 'bereit' : m));
  }, []);

  const starte = useCallback(() => {
    const SR = speechCtor();
    if (!SR || motor !== 'bereit') return;
    setFehler(null);
    const rec = new SR();
    rec.lang = BCP[lang];
    rec.continuous = true;
    rec.interimResults = true;
    rec.processLocally = true; // nur auf dem Gerät — sonst Fehler statt Cloud
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) verarbeite(e.results[i][0].transcript);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      laeuftRef.current = false;
      setFehler(
        e.error === 'not-allowed'
          ? tx(lang, 'Mikrofon nicht freigegeben.', 'Microphone permission denied.', 'Micrófono no autorizado.')
          : tx(lang, `Erkennung abgebrochen (${e.error}). Es wurde nichts in die Cloud geschickt.`, `Recognition stopped (${e.error}). Nothing was sent to the cloud.`, `Reconocimiento detenido (${e.error}). No se envió nada a la nube.`)
      );
      setMotor('bereit');
    };
    // Chrome beendet auch „continuous" nach Stille — solange das Spiel läuft, neu starten.
    rec.onend = () => {
      if (laeuftRef.current) {
        window.setTimeout(() => {
          try {
            if (laeuftRef.current) rec.start();
          } catch {
            /* läuft schon */
          }
        }, 250);
      }
    };
    recRef.current = rec;
    laeuftRef.current = true;
    try {
      rec.start();
      setMotor('laeuft');
    } catch {
      laeuftRef.current = false;
      setMotor('bereit');
    }
  }, [lang, motor, verarbeite]);

  const ladeSprachpaket = async () => {
    const SR = speechCtor();
    if (!SR?.install) return;
    setMotor('laedt');
    try {
      const ok = await SR.install({ langs: [BCP[lang]], processLocally: true });
      setMotor(ok ? 'bereit' : 'nicht-verfuegbar');
    } catch {
      setMotor('nicht-verfuegbar');
    }
  };

  useEffect(() => () => stoppe(), [stoppe]);

  const wortHinzu = () => {
    const w = neuesWort.trim();
    if (w && !woerter.some((x) => x.toLowerCase() === w.toLowerCase())) setWoerter([...woerter, w]);
    setNeuesWort('');
  };

  const gelbe = verlauf.filter((p) => p.karte === 'gelb').length;
  const rote = verlauf.filter((p) => p.karte === 'rot').length;
  const uhr = (t: number) => new Date(t).toLocaleTimeString(lang === 'en' ? 'en-GB' : lang === 'es' ? 'es-ES' : 'de-DE', { hour: '2-digit', minute: '2-digit' });

  const motorText: Record<Motor, string> = {
    pruefe: tx(lang, 'Prüfe, ob dieser Browser offline erkennen kann …', 'Checking whether this browser can recognise speech offline …', 'Comprobando si este navegador reconoce voz sin conexión …'),
    fehlt: tx(lang, 'Dieser Browser hat keine Spracherkennung. Der Testmodus unten funktioniert trotzdem.', 'This browser has no speech recognition. The test mode below still works.', 'Este navegador no tiene reconocimiento de voz. El modo de prueba funciona igual.'),
    unbekannt: tx(lang, 'Dieser Browser kann nicht nachweisen, dass er offline erkennt. Der Schiedsrichter startet deshalb nicht — kein Ton geht in eine Cloud. Chrome ab Version 139 kann es.', 'This browser cannot prove it recognises speech offline, so the referee will not start — no audio goes to a cloud. Chrome 139+ can do it.', 'Este navegador no puede garantizar reconocimiento sin conexión, así que el árbitro no arranca. Chrome 139+ sí puede.'),
    'nicht-verfuegbar': tx(lang, 'Offline-Erkennung für diese Sprache ist hier nicht verfügbar. Der Schiedsrichter startet nicht — kein Rückfall auf die Cloud.', 'Offline recognition for this language is not available here. The referee will not start — no fallback to the cloud.', 'El reconocimiento sin conexión no está disponible aquí. El árbitro no arranca — sin recurrir a la nube.'),
    laden: tx(lang, 'Das Sprachpaket für die Offline-Erkennung kann einmalig geladen werden.', 'The offline language pack can be downloaded once.', 'El paquete de idioma sin conexión se puede descargar una vez.'),
    laedt: tx(lang, 'Sprachpaket wird geladen …', 'Downloading language pack …', 'Descargando paquete de idioma …'),
    bereit: tx(lang, 'Offline-Erkennung bereit. Ton und Text bleiben auf diesem Gerät.', 'Offline recognition ready. Audio and text stay on this device.', 'Reconocimiento sin conexión listo. Audio y texto se quedan en este dispositivo.'),
    laeuft: tx(lang, 'Der Schiedsrichter hört zu — offline.', 'The referee is listening — offline.', 'El árbitro escucha — sin conexión.'),
  };
  const motorOk = motor === 'bereit' || motor === 'laeuft';

  return (
    <div className={`rounded-2xl border border-emerald-900/30 bg-gradient-to-b from-[#1f5135] to-[#173d29] text-emerald-50 overflow-hidden ${isEmbedded ? '' : 'shadow-md'}`}>
      {/* Spielfeld-Linien */}
      <div className="relative p-5 sm:p-7 space-y-6">
        <div className="pointer-events-none absolute inset-4 rounded-xl border border-white/[0.07]" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-4 bottom-4 w-px bg-white/[0.04] hidden lg:block" aria-hidden />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/[0.04] hidden lg:block" aria-hidden />

        <header className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-mono-code uppercase tracking-[0.16em] text-emerald-200/80">
              {tx(lang, 'Skelett der Dose · läuft im Browser', 'Skeleton of the tin · runs in the browser', 'Esqueleto de la lata · funciona en el navegador')}
            </p>
            <h3 className="mt-1 font-serif-title text-2xl font-bold text-white">TischSchiedsrichter</h3>
            <p className="text-sm text-emerald-100/80 max-w-prose">
              {tx(
                lang,
                'Vorher gemeinsam die Liste festlegen, Handy in die Tischmitte. Fällt ein Wort: Pfiff und Gelb. Zweites Gelb innerhalb von zehn Minuten: Rot — und ein neues Thema.',
                'Agree on the list together first, phone in the middle of the table. A listed word: whistle and yellow. Second yellow within ten minutes: red — and a new topic.',
                'Primero acordad la lista, móvil en el centro de la mesa. Palabra de la lista: silbato y amarilla. Segunda amarilla en diez minutos: roja — y otro tema.'
              )}
            </p>
          </div>
          <div className="flex gap-2 text-sm font-mono-code">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 px-2.5 py-1.5">
              <span className="w-3 h-4 rounded-[2px] bg-yellow-300 shadow" aria-hidden /> {gelbe}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/25 px-2.5 py-1.5">
              <span className="w-3 h-4 rounded-[2px] bg-red-500 shadow" aria-hidden /> {rote}
            </span>
          </div>
        </header>

        {/* Wortliste */}
        <section className="relative space-y-2">
          <h4 className="text-xs font-mono-code uppercase tracking-wider text-emerald-200/80">
            {tx(lang, 'Die Liste (gemeinsam beschlossen)', 'The list (agreed together)', 'La lista (acordada entre todos)')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {woerter.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 pl-3 pr-1.5 py-1 text-sm">
                {w}
                <button
                  type="button"
                  onClick={() => setWoerter(woerter.filter((x) => x !== w))}
                  className="rounded-full p-0.5 hover:bg-white/15"
                  aria-label={tx(lang, `${w} entfernen`, `Remove ${w}`, `Quitar ${w}`)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                wortHinzu();
              }}
              className="inline-flex items-center rounded-full bg-black/20 border border-white/15 pl-3 pr-1"
            >
              <input
                value={neuesWort}
                onChange={(e) => setNeuesWort(e.target.value)}
                placeholder={tx(lang, 'Wort hinzufügen', 'Add a word', 'Añadir palabra')}
                className="bg-transparent text-sm w-32 py-1 placeholder:text-emerald-100/40 focus:outline-none"
              />
              <button type="submit" className="rounded-full p-1 hover:bg-white/15" aria-label={tx(lang, 'Hinzufügen', 'Add', 'Añadir')}>
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </section>

        {/* Einwilligung + Start */}
        <section className="relative grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-3">
            <label className="flex items-start gap-2.5 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={einverstanden}
                onChange={(e) => setEinverstanden(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-yellow-300"
              />
              <span>
                <Users className="inline w-4 h-4 mr-1 -mt-0.5" />
                {tx(
                  lang,
                  'Alle am Tisch wissen, dass der Schiedsrichter zuhört, und haben der Liste zugestimmt.',
                  'Everyone at the table knows the referee is listening and has agreed to the list.',
                  'Todos en la mesa saben que el árbitro escucha y han aceptado la lista.'
                )}
              </span>
            </label>
            <p className={`flex items-start gap-2 text-xs ${motorOk ? 'text-emerald-100/85' : 'text-amber-100/90'}`} role="status">
              {motorOk ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{motorText[motor]}</span>
            </p>
            {fehler && <p className="text-xs text-red-200">{fehler}</p>}
          </div>
          <div className="flex gap-2">
            {motor === 'laden' && (
              <button type="button" onClick={ladeSprachpaket} className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm hover:bg-white/20">
                <Download className="w-4 h-4" />
                {tx(lang, 'Sprachpaket laden', 'Download language pack', 'Descargar idioma')}
              </button>
            )}
            {motor === 'laeuft' ? (
              <button type="button" onClick={stoppe} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600">
                <MicOff className="w-4 h-4" />
                {tx(lang, 'Abpfiff', 'Final whistle', 'Final del partido')}
              </button>
            ) : (
              <button
                type="button"
                onClick={starte}
                disabled={!einverstanden || motor !== 'bereit' || woerter.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-emerald-950 hover:bg-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mic className="w-4 h-4" />
                {tx(lang, 'Anpfiff', 'Kick-off', 'Saque inicial')}
              </button>
            )}
          </div>
        </section>

        {/* Testmodus */}
        <section className="relative rounded-xl bg-black/20 border border-white/10 p-4 space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-emerald-200/80">
            <Keyboard className="w-3.5 h-3.5" />
            {tx(lang, 'Testmodus — ohne Mikrofon', 'Test mode — no microphone', 'Modo de prueba — sin micrófono')}
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verarbeite(testText);
              setTestText('');
            }}
            className="flex gap-2"
          >
            <input
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder={tx(lang, 'z. B. „Was haltet ihr von der Wahl?"', 'e.g. "What do you think of the election?"', 'p. ej. "¿Qué pensáis de las elecciones?"')}
              className="flex-1 min-w-0 rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm placeholder:text-emerald-100/40 focus:outline-none focus:ring-2 focus:ring-yellow-300/40"
            />
            <button type="submit" className="rounded-lg bg-white/15 px-3 py-2 text-sm hover:bg-white/25">
              {tx(lang, 'Sagen', 'Say it', 'Decir')}
            </button>
          </form>
        </section>

        {/* Spielprotokoll */}
        {verlauf.length > 0 && (
          <section className="relative space-y-2">
            <h4 className="text-xs font-mono-code uppercase tracking-wider text-emerald-200/80">
              {tx(lang, 'Spielprotokoll (nur Wort und Uhrzeit, verschwindet mit der Seite)', 'Match log (word and time only, gone when you close the page)', 'Acta (solo palabra y hora, desaparece al cerrar)')}
            </h4>
            <ol className="flex flex-wrap gap-2 text-xs">
              {verlauf.map((p, i) => (
                <li key={i} className="inline-flex items-center gap-1.5 rounded-md bg-black/25 px-2 py-1">
                  <span className={`w-2.5 h-3.5 rounded-[2px] ${p.karte === 'gelb' ? 'bg-yellow-300' : 'bg-red-500'}`} aria-hidden />
                  <span className="font-mono-code text-emerald-100/70">{uhr(p.zeit)}</span>
                  <span>{p.wort}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {onOpenDose && !isEmbedded && (
          <button type="button" onClick={() => onOpenDose('tischschiedsrichter')} className="relative text-xs underline underline-offset-2 text-emerald-100/80 hover:text-white">
            {tx(lang, 'Zur Dose', 'Open the tin', 'Abrir la lata')}
          </button>
        )}
      </div>

      {/* Die Karte */}
      {karte && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6"
          onClick={() => setKarte(null)}
          role="alert"
        >
          <div className="text-center space-y-5">
            <div
              className={`mx-auto w-40 h-56 sm:w-48 sm:h-64 rounded-xl shadow-2xl ${karte.karte === 'gelb' ? 'bg-yellow-300' : 'bg-red-600'} animate-[karte_0.35s_ease-out]`}
              style={{ transform: 'rotate(-6deg)' }}
              aria-hidden
            />
            <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white drop-shadow">
              {karte.karte === 'gelb' ? tx(lang, 'Gelbe Karte', 'Yellow card', 'Tarjeta amarilla') : tx(lang, 'Rote Karte', 'Red card', 'Tarjeta roja')}
            </p>
            <p className="text-lg text-white/90">„{karte.wort}"</p>
            {karte.karte === 'rot' && (
              <p className="mx-auto max-w-md rounded-xl bg-white/95 px-4 py-3 text-stone-900 text-base">
                <span className="block text-[11px] font-mono-code uppercase tracking-wider text-stone-500">
                  {tx(lang, 'Themenwechsel', 'New topic', 'Cambio de tema')}
                </span>
                {thema}
              </p>
            )}
          </div>
          <style>{`@keyframes karte { from { transform: rotate(-30deg) scale(.4); opacity: 0 } to { transform: rotate(-6deg) scale(1); opacity: 1 } }`}</style>
        </div>,
        document.body
      )}
    </div>
  );
};
