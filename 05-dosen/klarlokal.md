# KlarLokal – Das Brecheisen (The Battering Ram)

**Ein Satz:** 100% offline, WebGPU-gestützte Übersetzung von bedrohlichem Beamtendeutsch in Leichte Sprache (DIN SPEC 33429) — ohne dass ein einziges Byte das Gerät verlässt.

**Stand:** September 2026 · **Prüfen ab:** September 2027  
**Empfänger:** Prototype Fund (Runde Herbst 2026 / BMBF) · nachrangig: CityLAB Berlin, GovTech Hackathons, Berliner Flüchtlingsrat & Erwerbslosen-Initiativen  
**Verdikt:** 🎁 verschenken — Zielgrant: Prototype Fund (Herbst 2026)

---

## 1. Das Kernproblem (Der Haken)

Das Öffnen behördlicher Post (Finanzamt, Jobcenter, Ausländerbehörde, Krankenkassen) löst bei Millionen Menschen akute Panik aus — insbesondere bei Zugewanderten, Freelancern, Alleinerziehenden und Menschen in existenziellen Krisen. 

Der Grund ist nicht fehlende Intelligenz, sondern ein asymmetrischer bürokratischer Code: verschachtelter Nominalstil, Passivkonstruktionen, Paragrafenketten ohne Handlungsanweisung und versteckte Rechtsbehelfsbelehrungen. 

Bestehende KI-Vereinfachungs-Tools (ChatGPT, DeepL Write, kommerzielle SaaS) scheitern an einem unüberwindbaren Hindernis: Sie verlangen den Upload hochsensibler Steuer-, Melde-, Einkommens- und Aufenthaltsdaten auf US-amerikanische Cloud-Server. Für vulnerable Gruppen und rechtliche Beratungsstellen ist das ein massiver Verstoß gegen die DSGVO, das Sozialgeheimnis (§ 35 SGB I) und das Steuergeheimnis (§ 30 AO). Das Ergebnis: Briefe bleiben aus Furcht ungeöffnet in der Schublade liegen, bis Fristen verstreichen, Konten gepfändet werden oder der Aufenthaltsstatus erlischt.

## 2. Die Lösung (Die Intervention)

KlarLokal ist ein lokales, Browser-basiertes Werkzeug (Local-First). Nutzer ziehen das Foto oder den Scan eines behördlichen Schreibens per Drag-and-Drop in die Web-App. Ohne dass ein einziges Byte das Gerät verlässt, führt die Anwendung im Arbeitsspeicher des Browsers eine OCR-Texterkennung durch und übersetzt das Amtsdeutsch in eine barrierefreie, DIN SPEC 33429-konforme Leichte Sprache.

Die Anwendung liefert exakt drei klare, unmissverständliche Antworten:

1. **Das Urteil (The Verdict):** Was bedeutet dieser Brief für mein Leben in einem einzigen, ruhigen Satz? *(z. B. „Das Finanzamt fordert 340 Euro Nachzahlung für 2024, weil Ihre Einkommensteuererklärung gefehlt hat.")*
2. **Die Frist (The Deadline):** Bis zu welchem konkreten Datum muss gehandelt werden? *(z. B. „Frist: 14. Oktober 2026 — noch 26 Tage Zeit. Bei Fristversäumnis droht Zwangsgeld.")*
3. **Die Checkliste (The Checklist):** Welche konkreten drei Schritte muss ich jetzt der Reihe nach tun? *(z. B. 1. Belegordner für 2024 öffnen; 2. Einspruchsschreiben mit Vorlage X absenden oder Steuerberater kontaktieren; 3. Fristverlängerung online im Elster-Portal beantragen).*

## 3. Der technische Bauplan (Die Geheimwaffe)

Die technische Reibung, die dieses Tool vor zwölf Monaten noch unmöglich gemacht hat, ist 2026 vollständig verschwunden. Die Architektur ist bereits gelöst:

- **Die Engine:** Vite, Astro 5 und React. Ausgeliefert als Progressive Web App (PWA), die sämtliche Programmbausteine und Sprachmodelle lokal im IndexedDB-/Cache-Storage des Browsers vorhält. Einmal geladen, funktioniert KlarLokal selbst im Flugmodus oder bei gekappter Internetverbindung.
- **Das Gehirn:** Wir umgehen Cloud-APIs vollständig durch **WebLLM** und die standardisierte **WebGPU**-Schnittstelle moderner Browser. Das Sprachmodell wird beim ersten Aufruf gestreamt im lokalen Cache abgelegt und führt Inferenz direkt auf der lokalen GPU des Endgeräts aus.
- **Das Modell:** Wir setzen auf die offenen Gewichte von **German4All** (Ende 2025 veröffentlicht), die explizit für kontrollierte Textvereinfachung und Leichte Sprache nach europäischen Barrierefreiheits-Standards trainiert wurden.
- **Die Prompt-Architektur:** Wir nutzen das staatliche Vorgehen gegen den Staat selbst: Wir adaptieren die Open-Source-Systemprompts des Bundesministeriums für Arbeit und Soziales (BMAS) aus dem offiziellen *Behörden-KlarText*-Repository. Wir verwenden exakt die linguistischen Filter des Bundes (Auflösung von Nominalstil, Passiv-Eliminierung, Konjunktiv-Entflechtung), um behördliche Bescheide mit ihren eigenen Regeln lesbar zu machen.
- **Lokale Extraktion:** PDF.js und WASM-basiertes Tesseract OCR extrahieren Text lokal, ohne dass Dokumenten-Pixel über das Netzwerk gesendet werden.

## 4. Warum das beim Prototype Fund gewinnt

Der Prototype Fund (gefördert durch das Bundesministerium für Bildung und Forschung BMBF) finanziert Civic Tech und Public-Interest-Software, die der kommerzielle Markt liegen lässt, weil sich damit keine Abo-Modelle und Werbedaten monetarisieren lassen. KlarLokal erfüllt jede Kernanforderung des Funds zu 100%:

1. **100% Open Source (Public Money, Public Code):** Vollständig quelloffen unter MIT/CC0 lizenziert, gebaut auf freien Modellen für das Gemeinwohl.
2. **Absolute Privatsphäre:** Zero-Knowledge- und Edge-Compute-Architektur bedeutet: keine Server-Logs, keine Datenbank, keine DSGVO-Haftung für Trägerorganisationen.
3. **Zivilgesellschaftliche Ermächtigung (Civic Empowerment):** Es bricht die Informationsasymmetrie zwischen Behörde und Bürger auf und senkt die gesellschaftlichen Kosten unverschuldeter Vollstreckungsverfahren und Fristversäumnisse.
4. **Machbarkeit in 6 Monaten:** Alle Basis-Primitive (WebLLM, WebGPU, German4All-Gewichte, BMAS-Prompts, PDF.js) existieren heute stabil. Es braucht kein zweijähriges Forschungsprojekt, sondern ein fokussiertes Frontend-Team, das die Pipeline zusammensteckt und benutzbar macht.

## 5. Skizze & Nutzerführung

1. **PWA Offline-Start:** Startet in unter 800ms. Ein Diskretions-Banner bestätigt: *„0 Bytes ins Internet. WebGPU aktiv. Flugmodus-sicher."*
2. **Drop-Zone:** PDF oder Foto eines Dokuments ablegen. Lokale Vorfilterung scannt Aussteller (Finanzamt, Jobcenter, LEA, Krankenkasse, Inkasso).
3. **Deterministischer Datums-Extraktor:** Reguläre Ausdrücke und Datums-Filter isolieren Datumsangaben im Bescheid („bis zum...", „binnen eines Monats nach Zustellung") noch vor dem Sprachmodell, um Halluzinationen auszuschließen.
4. **WebGPU-Synthese:** German4All generiert in 3–5 Sekunden das standardisierte Dreiklang-Dashboard: *Das Urteil*, *Die Frist*, *Die Checkliste*.
5. **Aktions-Knöpfe:** Vorformulierte, rechtssichere Muster-Fristverlängerungsschreiben (ODT/PDF) zum Ausdrucken oder per E-Mail versenden.

## 6. Erster Schritt

**Ticket: Ein Bescheid, ein Browser-Tab, drei Antworten offline.**

Minimaler Prototyp: Vite + React + WebLLM im Browser. Drag-and-drop eines anonymisierten Muster-Steuerbescheids bei gekappter WLAN-Verbindung. 

**Fertig, wenn:** Die Anwendung bei ausgeschaltetem Internet in unter 5 Sekunden das korrekte Fristdatum extrahiert, die Kernaussage in genau einem Satz Leichter Sprache formuliert und drei konkrete Handlungsschritte anzeigt.

## 7. Wo es kippt (Bruchstelle & Gegenmaßnahme)

**Das juristische Risiko:** Ein fehlerhaft verstandener Brief könnte Nutzer dazu verleiten, Fristen zu versäumen, oder in Konflikt mit dem Rechtsdienstleistungsgesetz (RDG) geraten.  
**Gegenmaßnahme:** 
- Hybrid-Verifikation: Datums- und Fristangaben werden immer doppelt geprüft — deterministisch per OCR/Regex und per LLM. Bei Diskrepanzen warnt das Tool gelb mit Verweis auf die Originalzeile im Dokument.
- Klarer Scope: KlarLokal ist kein Anwaltsersatz, sondern ein Lesegerät nach DIN SPEC 33429. Die Originaltextstellen werden neben der Leichten Sprache synchron markiert („Klick auf die Checkliste zeigt den Originalparagrafen").
- Worst-Case-Fallback: Wenn die Signalwörter auf existenziell kritische Maßnahmen hinweisen (z. B. Abschiebeandrohung, fristlose Kündigung, Kontenpfändung), verlinkt das Tool sofort lokale Beratungsstellen, Kiez-Anlaufstellen und Notfallkontakte.

## 8. Wer es schon versucht hat

- **Kommerzielle KI-Chats (ChatGPT, Claude):** Verlangen Cloud-Upload vertraulicher Finanz- und Asyldaten; für Beratungsstellen und Datenschutzbewusste unbenutzbar.
- **Amts-Websites in Leichter Sprache:** Erklären allgemeine Gesetze, können aber den individuellen, konkreten Einzelfall-Bescheid im Briefkasten nicht lesen.
- **Amtliche Digitalisierung (OZG):** Digitalisiert Behördenprozesse von oben nach unten, ändert aber nichts an der Unverständlichkeit von Millionen postalischen Bescheiden.

## 9. Wie die Dose übergeben wird

Man muss dieses Werkzeug nicht selbst bis zum Release fertigbauen. Man nimmt dieses Dossier, skizziert den Frontend-Zustandsautomaten und reicht es als Geschenk bei der nächsten Runde des **Prototype Fund (Herbst 2026)** ein oder übergibt es einem Civic-Tech-Team auf dem nächsten Berliner GovTech-Hackathon oder im Umfeld des CityLAB Berlin.

Der Prototype Fund öffnet alle sechs Monate. Die Architektur ist fertig durchdacht. Man stellt die Kiste auf den Tisch, tritt zurück und überlässt der Community das Öffnen.

---

Diese Idee gehört niemandem. Nimm sie, bau sie, verschenke sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
