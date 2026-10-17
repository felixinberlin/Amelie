# Gründungsnavigator: Konzept

**Stand:** 11.10.2026 · **Urteil:** `verengt` (Prüfprotokoll, Abschnitt „Gründungsnavigator — 11.10.2026“, Zeile G1) · **Prüfen ab:** 10/2027
**Status:** Seit 11.10.2026 **gepackt als Dose** [`gruendungsnavigator`](../05-dosen/gruendungsnavigator.md) (Reviewer 26/35). Kein Empfänger angeschrieben.
**Lizenz:** CC0 1.0 Public Domain

---

## Ein Satz

Eine kostenlose Web-App bereitet Menschen im Grundsicherungsgeld, die sich selbständig machen wollen, auf das **Gespräch** mit dem Jobcenter vor: was sie sagen, was das Gegenüber antworten kann, welche Norm gilt, und was danach schriftlich festgehalten wird.

## Das Problem

- **Die Förderung ist Ermessen.** Auf Einstiegsgeld (§ 16b SGB II) und Zuschüsse für Sachgüter (§ 16c SGB II) gibt es keinen Rechtsanspruch; ein Gespräch entscheidet über das Geld.
- **Reihenfolge entscheidet und ist unbekannt.** „Leistungen nach diesem Buch werden nicht für Zeiten vor der Antragstellung erbracht“ (§ 37 Abs. 2 SGB II). Wer zuerst gründet und dann fragt, verliert die Förderung.
- **Das Gespräch ist ungleich.** Die Fachkraft kennt die Regeln; die Gründerin ist nervös, sagt am Telefon Dinge zu oder vermeidet den Anruf.
- **Seit 1. Juli 2026 ist es strenger.** Dreizehntes SGB-II-Änderungsgesetz vom 16.04.2026 (BGBl. I Nr. 107): Prüfung der Selbständigkeit „spätestens nach einem Jahr ununterbrochenen Leistungsbezuges“ (§ 10 Abs. 2 Nr. 5), Nachweise nach dem Widerspruchsbescheid zählen nicht mehr (§ 41a Abs. 3), Meldeversäumnisse kosten wiederholt 30 % für einen Monat (§ 32), Vermögensfreibeträge nach Alter (§ 12 Abs. 2).
- **KI-Hilfe ist heute unzuverlässig.** Jobcenter und Sozialgerichte berichten von KI-Schreiben mit unpassenden Paragrafen und erfundenen Urteilen ([LTO, 24.04.2026](https://www.lto.de/recht/justiz/j/lsg-nrw-jahres-pressekonferenz-2026-ki-klagen-ueberlastung-sozialgerichte); [gegen-hartz.de, 09.08.2026](https://www.gegen-hartz.de/news/ki-ueberlastung-in-jobcentern-bezieher-der-grundsicherung-fluten-erfolgreich-aemter-mit-widerspruechen)).

## Warum das jetzt geht

- Die neue Rechtslage ist seit Juli 2026 stabil und im Normtext abrufbar; ein Werkzeug kann sie wörtlich zitieren statt sie zu erraten.
- Ein Browser reicht: keine Konten, keine Server, Daten bleiben auf dem Gerät.
- Modelle helfen beim Formulieren der eigenen Antworten; Normen, Fristen und Rechnungen kommen aus geprüften Daten (deterministisch zuerst).

## Skizze (so ist der Prototyp gebaut)

| Modul | Was es tut |
|---|---|
| Vorbereitung | Persönliche Angaben nur im Browser; Grundregeln; Mitbring-Liste |
| Telefonat | Entscheidungsbaum: 7 Fragen, 23 mögliche Antworten, jeweils Formulierung, Hintergrund, zitierte Norm; Live-Protokoll; Tastatur 1–5 |
| Fragen | 43 wahrscheinliche Fragen im Termin (Beispiel Webentwicklung, Stand 17.10.2026) mit anpassbarer Antwort, Beleg und Norm; Übungsfortschritt; Druckfassung |
| Rechte-Karten | 30 typische Antworten des Gegenübers („Das fördern wir nicht“, „Unterschreiben Sie hier“); ein Klick zeigt Anliegen, Normtext und formalen nächsten Schritt |
| Präsentationsmodus | Neutrale Ansicht für das Gegenüber: Überblick, Fragen & Antworten, Verfahren & Rechtsgrundlagen; Zitate und Taktik bleiben verborgen |
| Zusammenfassung | Mail aus den Klicks mit korrekten Normverweisen; Danach-Liste |

Jede Norm verlinkt auf gesetze-im-internet.de; Wörtliches ist zitiert, Sinngemäßes als „Kurzfassung“ markiert. Normtexte geprüft am 11.10.2026 gegen dejure.org (Fassung 16.04.2026, in Kraft 01.07.2026).

## Erster Schritt

**Ticket 01:** Alles Persönliche (Branche, Zahlen, Antworten) aus dem Prototyp in eine Datendatei ziehen, sodass die Seite zur Vorlage wird; dazu ein Branchen-Paket „Webentwicklung“ als Beispiel und ein leeres. **Fertig, wenn:** eine zweite Person ohne Programmierkenntnis ihre eigene Fassung in 30 Minuten erzeugt.

## Wo es kippt

- **Rechtsdienstleistung:** Allgemeine Information ist erlaubt, Entscheidung im Einzelfall nicht (RDG). Grenze vor Veröffentlichung juristisch prüfen lassen.
- **Aktualität:** Jede SGB-II-Änderung macht Texte falsch. Braucht einen Pflegeprozess (jährlich und nach jeder Novelle).
- **Ton:** Ein Werkzeug, das wie eine Drohung wirkt, schadet. Der Präsentationsmodus zwingt zur kooperativen Fassung.

## Wer es schon versucht hat

Siehe Prüfprotokoll G1: jobcenter.guru (Briefe, Widerspruch, kommerziell), BürgerChat (Q&A mit amtlichen Quellen, Open Source), Sozialrat Deutschland e.V. (Generatoren, Pilot pausiert), Münchner Gründungsbüro (Leitfaden), Gründerplattform (Businessplan). Keiner bereitet das Gespräch vor.

## Empfänger (Vorschlag, nicht kontaktiert)

1. **Sozialrat Deutschland e.V.** (Berlin): baut gerade für den Relaunch um, hat nichts zu Selbständigen.
2. **ver.di Selbstständigenberatung**: berät Selbständige zur neuen Grundsicherung.
3. **Münchner Gründungsbüro**: hat den passenden Leitfaden, aber kein Werkzeug.
4. **Tacheles e.V.**: fachliche Prüfung der Normtexte.
5. **BürgerChat**: Andockpunkt als Modul (MIT).

## Nebenbefund: Paragrafen-Prüfer (Zeile G2, `verengt`)

Ein freier Prüfer, der jede §-Angabe und jedes Aktenzeichen in einem Schreiben gegen die amtlichen Quellen hält (existiert, geltende Fassung, passt zum Thema). Kanzleien haben Recherche-KI mit Quellennachweis; Betroffene und Beratungsstellen haben nichts. Der Prototyp des Gründungsnavigators enthält den Kern bereits: ein Register geprüfter Normtexte mit Fassung und Link.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
