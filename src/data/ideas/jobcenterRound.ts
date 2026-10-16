import { CandidateIdea } from '../../types';

/**
 * Kandidaten der Jobcenter-Runde (SGB II nach der Reform vom 01.07.2026, Reviewer 14.10.2026, nachgebucht 16.10.2026).
 * Keine Dose: Scorecards in 06-suche/amelie-classification-log.md (Abschnitt „Jobcenter / Grundsicherung“), Protokollzeilen
 * M1 bis M12 im Prüfprotokoll. Empfänger sind nur Institutionen; Ansprechpersonen sind nicht verifiziert. Vektoren: candidateVectors.json.
 */
const ROUND = 'Jobcenter / Grundsicherung 14.10.2026';
const DATE = '14.10.2026';

export const JOBCENTER_ROUND_IDEAS: CandidateIdea[] = [
  {
    id: 'meldeversaeumnis-zaehler',
    title: 'Meldeversäumnis-Zähler',
    titleEn: 'Missed-appointment counter',
    round: ROUND,
    date: DATE,
    conceptDe: 'Lokaler, deterministischer Zustandsautomat: Wer die Einladungen und Bescheide eintippt, sieht zwei getrennte Zählstände („wiederholt“ nach § 32 und „drei in Folge“ nach § 7b Abs. 4 SGB II) samt Stichtag 01.07.2026, Warnmonat und Fundstelle je Schritt. Rechnet keine Euro-Beträge, bewertet nie wichtigen Grund oder Härte und sagt nie „rechtswidrig“ oder „kein Risiko“.',
    conceptEn: 'A local, deterministic state machine: entering invitations and notices shows two separate counts ("repeated" under section 32 and "three in a row" under section 7b(4) SGB II) with the 1 July 2026 cut-off, the warning month and a citation per step. No euro amounts, never judges good cause or hardship, never says "unlawful" or "no risk".',
    status: 'verengt',
    suggestedVerdict: 'build_first',
    recipientDe: 'Tacheles e.V. (Wuppertal) · Zweitwahl Sozialrechts-Hilfe Offenbach e.V.',
    recipientEn: 'Tacheles e.V. (Wuppertal) · second choice Sozialrechts-Hilfe Offenbach e.V.',
    sourceType: 'Civic & Ecology',
    sourceDe: 'BA Fachliche Weisungen § 32 SGB II (Stand 01.07.2026); Arbeitshilfe JC Wuppertal „Einladungen und Rechtsfolgen“ (29.06.2026); § 7b Abs. 4 SGB II',
    sourceEn: 'BA directives on section 32 SGB II (as of 1 July 2026); Jobcenter Wuppertal working aid (29 June 2026); section 7b(4) SGB II',
    evidenceDe: 'Reviewer 26/35, „Dose Ready (bedingt)“, nicht gepackt: Empfängerkonflikt mit gruendungsnavigator bei Tacheles ist Félix’ Entscheidung. Kein Zähler gefunden, nur Merkblätter [Schnipsel]. FW und Arbeitshilfe gelesen [Seite]; offen: Quellenkonflikt Unterbrechung (Rz 32.6 gegen „mindestens ein Kalendermonat“), Lücke § 66 SGB I, FW § 7b ungelesen.',
    evidenceEn: 'Reviewer 26/35, "Dose Ready (conditional)", not packed: recipient conflict with gruendungsnavigator at Tacheles is Félix’s decision. No counter found, only leaflets [snippet]. Directive and working aid read [page]; open: source conflict on interruption (Rz 32.6 vs. "at least one calendar month"), gap on section 66 SGB I, FW section 7b unread.',
    reviewDate: '04/2027',
    problemDe: 'Wer einen Termin versäumt hat, kann aus den Briefen nicht ablesen, welche Rechtsfolge ein weiterer versäumter Termin hätte.',
    problemEn: 'Anyone who missed an appointment cannot tell from the letters what a further missed appointment would trigger.',
    firstStepTicketDe: 'src/engine/meldeversaeumnis/ als Zustandsautomat mit Fixtures F1 bis F19 und Gegenprobe G1; GN-Datumskern importieren; vorher FW § 7b und FW §§ 31 bis 31b lesen',
    firstStepTicketEn: 'src/engine/meldeversaeumnis/ as a state machine with fixtures F1 to F19 and counter-test G1; import the GN date core; read FW section 7b and FW sections 31 to 31b first',
    tags: ['Jobcenter', 'SGB II', 'Meldeversäumnis', 'Zustandsautomat', 'Needs Research'],
  },
  {
    id: 'kdu-grenzen-register',
    title: 'KdU-Angemessenheitsgrenzen-Register',
    titleEn: 'Housing-cost limits register',
    round: ROUND,
    date: DATE,
    conceptDe: 'Strukturdaten statt Rechner: je Kreis die Bruttokaltmiete nach Haushaltsgröße, Heizkostengrenze, „gilt ab“, Fundstelle mit SHA-256 und Vorgängerwert. Browser-Abgleich der eigenen Miete gegen die Grenze und die 1,5-fache Grenze (§ 22 Abs. 1 S. 6 SGB II); bei Quelle älter als 24 Monate Hinweis auf Auskunft nach §§ 14, 15 SGB I.',
    conceptEn: 'Structured data instead of a calculator: per district gross cold rent by household size, heating limit, "valid from", source with SHA-256 and previous value. Browser check of one’s own rent against the limit and 1.5 times the limit (section 22(1) sentence 6 SGB II); sources older than 24 months point to information requests under sections 14, 15 SGB I.',
    status: 'verengt',
    suggestedVerdict: 'keep',
    recipientDe: 'Sozialrechts-Hilfe Offenbach e.V. · Tacheles e.V. / Thomé-Sammlung · Paritätischer Gesamtverband',
    recipientEn: 'Sozialrechts-Hilfe Offenbach e.V. · Tacheles e.V. / Thomé collection · Paritätischer Gesamtverband',
    sourceType: 'Civic & Ecology',
    sourceDe: 'Kommunale schlüssige Konzepte und Dienstanweisungen; Thomé-Liste (ca. 350 Fundstellen); Offenbacher Tabelle (223 von 237 Orten)',
    sourceEn: 'Municipal conceptual studies and service instructions; Thomé list (about 350 sources); Offenbach table (223 of 237 places)',
    evidenceDe: 'Reviewer 18/35, Needs Research. Rest-Lücke nur Lizenz und Format (§ 87a UrhG, § 5 UrhG ungeklärt); keine bundesweite offene Tabelle gefunden [Schnipsel]. Offen: Offenbach nach Lizenz fragen, Datentest 10 Kreise, 1,5-fach-Regel dort prüfen.',
    evidenceEn: 'Reviewer 18/35, needs research. Remaining gap is only licence and format (sections 87a, 5 UrhG unresolved); no nationwide open table found [snippet]. Open: ask Offenbach about licence, data test on 10 districts, check the 1.5x rule there.',
    reviewDate: '04/2027',
    firstStepTicketDe: 'Datentest: 10 Kreise aus der Thomé-Liste in Tabellenform bringen und die Spaltenvarianten zählen; Lizenz bei Offenbach klären',
    firstStepTicketEn: 'Data test: bring 10 districts from the Thomé list into table form and count column variants; clarify licence with Offenbach',
    tags: ['Jobcenter', 'KdU', 'Mietgrenzen', 'Datensatz', 'Needs Research'],
  },
];
