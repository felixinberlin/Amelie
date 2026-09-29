import { CandidateIdea } from '../../types';

/**
 * Spielideen (Tab „Games").
 *
 * Alles, was im Kern ein Spiel oder eine spielerische Mechanik ist, steht hier
 * statt in den Themenlisten. Die Ideen bleiben Teil von ALL_NEW_CANDIDATE_IDEAS
 * (Export, Prüfprotokoll-Abgleich), erscheinen aber nicht mehr in der Pipeline.
 * Fertige Spiel-Dosen (fugenduell-asphalt-arena, lebendes-spielobjekt,
 * tischschiedsrichter) und die spielbaren Mini-Spiele zeigt die GamesView
 * direkt aus DOSEN_DATA bzw. den Komponenten.
 */
export const GAME_IDEAS: CandidateIdea[] = [
  {
    id: 'family-game-night-trivia-generator',
    title: 'Family Game Night Custom Trivia Generator',
    round: 'Katalog 2026',
    date: '17.09.2026',
    conceptDe: 'Web-App zur schnellen Erstellung personalisierter Quizfragen und Worträtsel basierend auf Familiengeschichte, regionalen Dialekten und lokalen Meilensteinen für Feiern.',
    conceptEn: 'A web app that generates fresh, customized daily trivia or word puzzles based on local family history, regional landmarks, or inside jokes for gatherings.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'Spieleautoren-Zunft · Familienbildungsstätten',
    recipientEn: 'Board Game Designers Guild · Family Activity Groups',
    sourceType: 'Micro-Utilities',
    sourceDe: 'Lightweight web game engines (PICO-8 style / Web Canvas)',
    sourceEn: 'Lightweight web game engines (PICO-8 style / Web Canvas)',
    evidenceDe: 'Kommerzielle Quizspiele sind oft zu akademisch oder wiederholen alte Fragen; persönliche Quizze per Hand zu erstellen dauert Tage.',
    evidenceEn: 'Commercial trivia games are either too generic or obsolete; making custom family trivia decks manually takes hours in slide software.',
    reviewDate: '10/2026',
    problemDe: 'Mangel an verbindenden, generationsübergreifenden Aktivitäten bei Familienfesten und runden Geburtstagen.',
    problemEn: 'Awkward silence or screen-isolation at multi-generational gatherings lacking a personalized shared social activity.',
    whyNowDe: ['Einfache Vorlagen mit Druck- und Beamer-Modus lassen sich ohne Installation in 5 Minuten befüllen.'],
    whyNowEn: ['Responsive web canvases can render customized Jeopardy-style buzzer boards directly on a smart TV without setup.'],
    firstStepTicketDe: 'Fragen-Editor mit Beamer-Vollbildanzeige und Buzzer-Modus über Smartphone-Tasten',
    firstStepTicketEn: 'Question card editor with projector presentation view and phone-as-buzzer local sync',
    tags: ['Games', 'Family', 'Trivia', 'Culture', 'Web App']
  },
  {
    id: 'bird-song-frequency-ear-trainer',
    title: 'Local Backyard Bird Song & Spectrogram Ear Trainer',
    round: 'Katalog 2026',
    date: '17.09.2026',
    conceptDe: 'Interaktiver Gehörtrainer für heimische Gartenvögel: Zeigt gleichzeitig Klang und optisches Spektrogramm (Amsel, Blaumeise, Buchfink, Rotkehlchen) zum spielerischen Erkennenlernen.',
    conceptEn: 'An interactive ear training game for native songbirds: displays synchronized audio and visual spectrograms (blackbird, robin, chaffinch) for bird call identification.',
    status: 'ungeprüft',
    suggestedVerdict: 'gift',
    recipientDe: 'NABU Vogel des Jahres Kampagne · LBV Bayern',
    recipientEn: 'Royal Society for the Protection of Birds (RSPB) · Audubon Society',
    sourceType: 'Education & Family',
    sourceDe: 'Xeno-Canto open bird sound library & Web Audio FFT sonogram renderer',
    sourceEn: 'Xeno-Canto open bird sound library & Web Audio FFT sonogram renderer',
    evidenceDe: 'Früher kannten Kinder 20 Vogelstimmen; heute können die meisten nicht einmal mehr Amsel von Spatz unterscheiden.',
    evidenceEn: 'Nature alienation has escalated; fewer than 15% of schoolchildren can distinguish common garden bird calls.',
    reviewDate: '10/2026',
    problemDe: 'Verlust des Naturbezugs und der Artenkenntnis in urbanen und ländlichen Familien.',
    problemEn: 'Extinction of ecological literacy across generations, reducing public commitment to biodiversity conservation.',
    whyNowDe: ['Web Audio Sonogramme machen Tonhöhenverläufe und Triller visuell lesbar wie Notenblätter.'],
    whyNowEn: ['Real-time audio waterfalls allow children to "see" bird pitch melodies, speeding up acoustic retention tenfold.'],
    firstStepTicketDe: 'Quiz-Spiel mit 10 häufigsten Gartenvögeln mit umschaltbarem Sonogramm-Spickzettel',
    firstStepTicketEn: 'Audio quiz game featuring 10 common garden songbirds with synchronized visual sonograms',
    tags: ['Ornithology', 'Birding', 'Nature', 'Audio', 'Education']
  },
  {
    id: 'ai-dinner-table-politics-buzzer',
    packedDoseId: 'tischschiedsrichter',
    title: 'TischSchiedsrichter: Offline Dinner Table Referee & Keyword Whistle',
    round: 'AI Frontier 2026',
    date: '24.09.2026',
    conceptDe: 'Ein Smartphone in der Tischmitte hört offline auf eine vorher gemeinsam beschlossene Liste von Reizwörtern (z. B. „Wahl", „Partei"). Fällt eines, pfeift es wie ein Schiedsrichter und zeigt Gelb, beim zweiten Mal Rot. Audio verlässt das Gerät nicht.',
    conceptEn: 'A phone in the middle of the dinner table listens offline for a word list everyone agreed on beforehand (e.g. "election", "party"). When one is spoken it blows a referee whistle and shows a yellow card, red on repeat. No audio leaves the device.',
    status: 'verengt',
    suggestedVerdict: 'build_first',
    recipientDe: 'Die Öffentlichkeit, mit lauffähigem Skelett (Blogbeitrag/Show HN vor dem 1. Advent)',
    recipientEn: 'The public, with a working skeleton (blog post / Show HN before Advent)',
    sourceType: 'Home & Family',
    sourceDe: 'Mitgebrachte Idee (Gemini-Plan, 24.09.2026); geprüft in 02-recherche/tischschiedsrichter-review-2026-09-24.md',
    sourceEn: 'User-supplied idea (Gemini plan, 24.09.2026); checked in 02-recherche/tischschiedsrichter-review-2026-09-24.md',
    evidenceDe: 'Besetzt im Szenario: Noche de Paz / SilentNight (Shackleton, 2015) — Handy in der Tischmitte, politische Wörter, Alarm. Besetzt in der Funktion: JarGone (2018, frei wählbare Wörter, Familie), Swearing Jar (App Store 03/2025, eigene Wörter, Audio mit Identität verknüpft). Restlücke: garantiert offline + Deutsch + freie Wortliste ohne Training + Tischregeln (Gelb/Rot).',
    evidenceEn: 'Scenario taken: Noche de Paz / SilentNight (Shackleton, 2015) — phone in the middle of the table, political words, alarm. Function taken: JarGone (2018, custom words, family), Swearing Jar (App Store 03/2025, custom words, audio linked to identity). Remaining gap: guaranteed offline + German + open word list without training + table rules (yellow/red).',
    reviewDate: '03/2027',
    problemDe: 'Niemand will derjenige sein, der den Schwiegervater unterbricht. Eine vorher gemeinsam beschlossene Regel mit neutralem Pfiff nimmt dem Gastgeber diese Rolle ab.',
    problemEn: 'Nobody wants to be the one who interrupts the father-in-law. A rule agreed on beforehand, enforced by a neutral whistle, takes that role off the host.',
    workerPersona: {
      name: 'Markus Thiel (45) — fiktive Persona',
      role: 'Familienvater und unfreiwilliger Feiertags-Gastgeber',
      location: 'Recklinghausen, NRW',
      quoteDe: 'Jedes Jahr an Weihnachten brüllen sich mein Schwiegervater und mein Bruder über Politik an, bis die Kinder den Raum verlassen. Wenn ich dazwischengehe, bin ich der Böse.',
      quoteEn: 'Every Christmas my father-in-law and my brother shout at each other about politics until the kids leave the room. If I step in, I am the bad guy.',
      storyDe: 'Markus kocht gern für die Großfamilie. Sobald „Wahlen" oder „Steuern" fällt, kippt die Stimmung. Einen Buzzer von Hand drückt niemand gegen den Schwiegervater, und einen Cloud-Lautsprecher stellt er nicht auf den Tisch.',
      storyEn: 'Markus loves cooking for the extended family. As soon as "elections" or "taxes" come up, the mood turns. Nobody will press a manual buzzer on the father-in-law, and he will not put a cloud speaker on the table.'
    },
    techShift: {
      beforeAiDe: 'Nicht unmöglich: Noche de Paz (2015) und JarGone (2018) gab es schon. Offline ging aber nur mit fest trainierten Wörtern, eigene Wörter brauchten die Cloud.',
      beforeAiEn: 'Not impossible: Noche de Paz (2015) and JarGone (2018) existed. Offline only worked with fixed pre-trained words; custom words needed the cloud.',
      nowEasyDe: 'Heute gehen frei wählbare Wörter offline ohne Training (sherpa-onnx, nur Englisch/Chinesisch; Deutsch über Vosk-Grammatik, mit Fehlalarm-Risiko) oder im Browser per Chrome-On-Device-Spracherkennung (processLocally).',
      nowEasyEn: 'Today custom words work offline without training (sherpa-onnx, English/Chinese only; German via Vosk grammar mode, with false-alarm risk) or in the browser via Chrome on-device speech recognition (processLocally).'
    },
    whyNowDe: [
      'Datenschutz belegbar: Die aktuelle Konkurrenz (Swearing Jar) verknüpft laut App-Store-Label Audiodaten mit der Identität.',
      'Entlastung: Der Pfiff übernimmt die Rolle des „Bösen", die sonst beim Gastgeber liegt.',
      'Einwilligung als Spielregel: Alle beschließen die Wortliste vorher gemeinsam.'
    ],
    whyNowEn: [
      'Privacy is provable: the current competitor (Swearing Jar) links audio data to identity according to its App Store label.',
      'Relief: the whistle takes the "bad cop" role that otherwise falls to the host.',
      'Consent as a game rule: everyone agrees on the word list together beforehand.'
    ],
    firstStepTicketDe: 'PWA: Wortliste eintragen, Chrome-On-Device-Spracherkennung (processLocally) starten, bei Treffer Pfiff + gelbe Karte, zweiter Treffer rot, 15 s Abkühlzeit.',
    firstStepTicketEn: 'PWA: enter word list, start Chrome on-device speech recognition (processLocally), on match whistle + yellow card, second match red, 15 s cooldown.',
    firstStepCriteriaDe: 'In einer aufgenommenen Tischszene (4 Personen, 10 Minuten) mindestens 80 % der gesagten Listenwörter erkannt und höchstens 2 Fehlpfiffe; im Flugmodus lauffähig.',
    firstStepCriteriaEn: 'In a recorded table scene (4 people, 10 minutes) at least 80 % of spoken list words detected and at most 2 false whistles; runs in airplane mode.',
    userNotes: 'Am 24.09.2026 als Spielzeug-Dose gepackt (05-dosen/tischschiedsrichter.md), mit lauffähigem Skelett im Tab Sandboxes. Empfänger: die Öffentlichkeit. Prüfung: 02-recherche/tischschiedsrichter-review-2026-09-24.md',
    tags: ['Family', 'Audio AI', 'Local-First', 'Party Game', 'Vibecode']
  }
];
