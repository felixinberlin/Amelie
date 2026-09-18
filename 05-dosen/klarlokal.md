# KlarLokal

**Ein Satz:** Behördenbrief fotografieren, in Leichte Sprache übersetzt bekommen — vollständig on-device, ohne dass je ein Byte das Gerät verlässt, auch nicht verschlüsselt an eine Cloud.

**Stand:** September 2026 · **Prüfen ab:** März 2027 (direkte Konkurrenz existiert bereits, Feld bewegt sich)
**Empfänger:** Prototype Fund (Runde ab 1. Oktober 2026) · nachrangig: Berliner Flüchtlingsrat, Erwerbslosen-Initiativen, Sozialberatungsstellen
**Verdikt:** 🎁 verschenken — Prämisse verengt, siehe „Wer es schon versucht hat"

---

## Das Problem

Das Öffnen behördlicher Post (Finanzamt, Jobcenter, Ausländerbehörde, Krankenkasse) löst bei vielen Menschen Panik aus — verschärft bei Zugewanderten, Alleinerziehenden, Menschen in existenziellen Krisen. Der Grund ist ein bürokratischer Code: verschachtelter Nominalstil, Passivkonstruktionen, Paragrafenketten ohne klare Handlungsanweisung.

Bestehende KI-Vereinfachungstools verlangen fast immer den Upload des Dokuments zu einem Server. Für Steuer-, Melde-, Einkommens- und Aufenthaltsdaten ist das für einen Teil der Betroffenen — insbesondere Menschen ohne gesicherten Aufenthaltsstatus und Beratungsstellen, die dem Sozialgeheimnis (§ 35 SGB I) unterliegen — keine akzeptable Option, selbst wenn der Anbieter DSGVO-konform ist und der Server in der EU steht. Für diese Gruppe bleiben Briefe ungeöffnet liegen, bis Fristen verstreichen.

## Warum das jetzt geht

1. **WebLLM + WebGPU machen Browser-Inferenz praktikabel.** Ein Sprachmodell läuft heute im Cache des Browsers und rechnet auf der lokalen GPU — vor zwölf Monaten war das nicht praxistauglich.
2. **German4All** (TUM, veröffentlicht 2025, offene Gewichte auf Hugging Face) ist ein Modell speziell für kontrollierte Textvereinfachung im Deutschen, inklusive einer „Leichte Sprache"-Stufe.
3. **Der Bund hat die linguistische Vorarbeit bereits Open Source gemacht.** Das BMAS-Projekt **Behörden-KlarText** wurde am 30. Januar 2026 vollständig als Open Source auf openCode veröffentlicht — Prompts und Regeln für Nominalstil-Auflösung und Passiv-Eliminierung liegen fertig vor.
4. **PDF.js + WASM-Tesseract** erledigen die Texterkennung lokal, ohne dass Dokumenten-Pixel das Gerät verlassen.

## Skizze

- PWA, offline-fähig nach erstem Laden: Foto/Scan per Drag-and-Drop, lokale OCR (PDF.js/Tesseract-WASM), lokale Inferenz (WebLLM + German4All-Gewichte, adaptierte Behörden-KlarText-Prompts).
- Drei feste Ausgaben statt Fließtext: **Das Urteil** (ein Satz, was der Brief bedeutet), **Die Frist** (konkretes Datum, deterministisch per Regex aus dem Text extrahiert, nicht vom Sprachmodell geraten), **Die Checkliste** (die nächsten drei Schritte).
- Datums-/Fristextraktion läuft **immer doppelt**: deterministisch (Regex) und über das Modell; bei Abweichung wird gewarnt statt geraten.

**Nicht dabei:** kein Cloud-Fallback, auch nicht verschlüsselt und auch nicht bei niedriger Erkennungssicherheit. Das ist die Grenze, die das Produkt von seiner nächsten Konkurrenz unterscheidet (siehe unten) — sie fällt zu lassen heißt, ein anderes Produkt zu bauen.

## Erster Schritt

**Ticket: Ein Bescheid, ein Browser-Tab, drei Antworten offline.**

Minimaler Prototyp: Vite + React + WebLLM. Ein anonymisierter Muster-Steuerbescheid wird bei gekapptem WLAN per Drag-and-Drop eingelesen.

**Fertig, wenn:** die Anwendung bei ausgeschaltetem Internet das Fristdatum korrekt extrahiert, die Kernaussage in einem Satz Leichter Sprache formuliert und drei Handlungsschritte anzeigt.

## Wo es kippt

**Direkte Konkurrenz mit Cloud-Fallback macht das Produkt uninteressant, wenn die Abgrenzung verwässert.** Sobald „auch mal Cloud, aber nur ein bisschen" ins Produkt einzieht, ist es ein schlechteres Zetteln (siehe unten) statt einer eigenen Nische. Gegenmaßnahme: die Zero-Cloud-Grenze ist keine technische Übergangslösung, sondern das ganze Produkt — sie steht so im Pitch an den Fund, nicht nur im Code.

**Juristisches Risiko:** Ein falsch verstandener Brief könnte zu Fristversäumnis führen oder in die Nähe des Rechtsdienstleistungsgesetzes (RDG) geraten. Gegenmaßnahme: Datums-Doppelprüfung (siehe Skizze), Originaltext neben der Übersetzung sichtbar, klarer Scope „Lesegerät, kein Anwaltsersatz", und ein Fallback auf lokale Beratungsstellen bei Signalwörtern wie Abschiebeandrohung oder Kontenpfändung.

## Wer es schon versucht hat

Recherche September 2026: **Zetteln** (zetteln.app) macht bereits fast genau das — Behördenbrief fotografieren, in Leichte Sprache erklärt bekommen, Fristen hervorgehoben, bis zu 21 Sprachen. Es ist live, DSGVO-konform, und läuft **hybrid**: Bildklassifikation und einfache Auswertung on-device, aber bei Unsicherheit wird das Dokument verschlüsselt an einen EU-KI-Dienst geschickt.

Genau diese Fallback-Grenze ist die verbleibende Lücke: für Menschen, die *keine* Übertragung akzeptieren können oder wollen — unsicherer Aufenthaltsstatus, Beratungsstellen mit Sozialgeheimnis-Pflicht, grundsätzliches Misstrauen gegenüber jeder externen Verarbeitung — bleibt Zetteln unbrauchbar, ganz gleich wie gut sein Datenschutz sonst ist. KlarLokal ist damit keine neue Idee mehr, sondern eine bewusst engere: **dieselbe Funktion, aber mit einer Garantie, die Zetteln architektonisch nicht geben kann.**

Daneben: kommerzielle KI-Chats verlangen Rohdaten-Upload in Nicht-EU-Clouds; amtliche Leichte-Sprache-Seiten erklären Gesetze allgemein, nicht den individuellen Bescheid; die OZG-Digitalisierung ändert nichts an der Verständlichkeit bestehender Bescheide.

## Vorarbeit

- **Zetteln** (zetteln.app) — nächster Nachbar, hybrides Modell, DSGVO-konform, Referenz und Abgrenzung zugleich.
- **German4All** (TUM, 2025) — `tum-nlp/German4all-paraphrasing-xl` auf Hugging Face, Paper auf arXiv/ACL Anthology (INLG 2025).
- **Behörden-KlarText** (BMAS/VBG) — seit 30. Januar 2026 Open Source auf openCode, Prompts für Behördendeutsch-Vereinfachung.
- **Prototype Fund** — Bewerbungsfenster ab 1. Oktober 2026, Open-Source-Pflicht, Zuschnitt passt.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
