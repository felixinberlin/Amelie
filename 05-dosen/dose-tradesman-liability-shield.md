# BedenkenBlitz (VOB/B Baustellen-Schutzschirm)

**Ein Satz:** 15 Sekunden Sprachmemo + Foto vom feuchten Estrich: Erstellt sofort eine wasserdichte VOB/B-Bedenkenanmeldung gegen Schadensersatzklagen.

**Stand:** 17.09.2026 · **Prüfen ab:** 10/2026
**Empfänger:** Fachverband Fliesen und Naturstein · Zentralverband des Deutschen Baugewerbes · IG BAU
**Verdikt:** 🎁 verschenken

---

## Das Problem

Wer als Fliesenleger oder Handwerker auf unzureichenden Vorleistungen (Risse, Restfeuchte) arbeitet, ohne vorher schriftlich Bedenken nach VOB § 4 anzumelden, haftet mit tausenden Euro. Mit Arbeitshandschuhen schreibt niemand juristische Briefe.

## Warum das jetzt geht

- Robuste Spracherkennung versteht Baustellenjargon trotz Baulärms.
- Multimodale Modelle erfassen Messwerte von Feuchtemessgeräten und Rissbreitenlinealen im Foto.
- DIN-Normen (DIN 18560, DIN 18202) werden automatisch korrekt zitiert.

## Skizze

Handwerker spricht: "Hier Estrich 3,2% Feuchte, Riss an Türschwelle". Foto schießen. App erzeugt unterschriftsbereites PDF mit DIN 18560 Zitat und schickt es per WhatsApp an Architekt und Bauherr.

## Erster Schritt

**Ticket:** P0: Audio-Transkription für Baustellen-Vokabular mit PDF-Generierung nach VOB/B § 4 Abs. 3.

Generiert aus 3 Beispielsätzen ein formell gültiges Bedenkenanmeldungs-Schreiben mit Baustellen-Metadaten.

## Wo es kippt

Mangelhafte Baustellen-Adresse: App muss GPS nutzen, um das Bauvorhaben automatisch mit Straße und Hausnummer zu versehen.

## Wer es schon versucht hat

Kommerzielle Bausoftware kostet 80 €/Nutzer/Monat und setzt ein Büro-Team voraus — für den 1-Mann-Fliesenleger unbrauchbar.

---

*Diese Seite wurde aus dem Frontend-Datensatz erzeugt: `node scripts/dose-md-from-data.mjs dose-tradesman-liability-shield`.
Inhaltliche Quelle ist `src/data/dosen.ts`. Wer den Text hier ändert, ändert ihn auch dort — sonst
meldet `scripts/check-dosen-drift.mjs` beim nächsten Lauf nichts, und die Seite und die App erzählen
Verschiedenes.*

Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal
eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
