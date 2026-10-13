# Mail 11b — Korrektur zu ChemGefahr-Stopp (an die vier Empfänger vom 27.09.2026)

**Status:** Entwurf, 13.10.2026. **Nicht versendet.** Entscheidung Félix: Regel 3 verbietet Nachfassen; dies ist eine einmalige Richtigstellung ohne Bitte und ohne Frage. Wenn versendet, danach kein weiterer Kontakt.

**Warum:** Die Mails vom 27.09. beschrieben einen Funktionsumfang, den es nicht gibt (Kamera-Scan, Sprachbank in vielen Sprachen, 15-Hz-Stroboskop, „vollständig lauffähig“). Außerdem hatte die Chlorgas-Regel bis 12.10.2026 eine Lücke: Sie verlangte `EUH031` auf dem Etikett, und gängige Chlorreiniger tragen diesen Satz nicht (Commit `1f38cd9`).

**An (je eine Mail, gleicher Text, Anrede anpassen):**

| Ursprünglich gesendet | Adresse(n) | Anrede |
|---|---|---|
| 27.09.2026 14:25 | `gebaeudereinigung@igbau.de` | Sehr geehrte Damen und Herren der IG BAU Gebäudereinigung, |
| 27.09.2026 14:32 | `kontakt@igbau.de`, `gisbau@bgbau.de` | Sehr geehrte Damen und Herren der IG BAU und der BG BAU, |
| 27.09.2026 (Uhrzeit offen) | `info@die-gebaeudedienstleister.de`, `gl@die-gebaeudedienstleister.de` | Sehr geehrte Damen und Herren der Geschäftsführung, |
| 27.09.2026 15:11 | `biv@die-gebaeudedienstleister.de` | Sehr geehrte Frau Sudhop, |

Hinweis: Der BIV hat damit drei Mails zum selben Thema bekommen (info@, gl@, biv@). Es reicht, die Korrektur einmal an `biv@` zu schicken, mit `info@` und `gl@` in Kopie.

**Betreff:** Korrektur zu meiner Mail vom 27. September (ChemGefahr-Stopp)

---

```text
<Anrede>

am 27. September habe ich Ihnen das offene Werkzeug „ChemGefahr-Stopp“ geschickt. Zwei Angaben darin muss ich richtigstellen. Eine Antwort ist nicht nötig.

1. Eine Lücke in der Chlorgas-Regel, inzwischen behoben (12.10.2026)
Die Warnung „Säure + Chlorreiniger“ wurde nur ausgelöst, wenn eines der Produkte den Etikettenhinweis EUH031 trug. Gängige Chlorreiniger tragen ihn nicht: Dan Klorix laut Sicherheitsdatenblatt nur EUH206, Domestos Professional keinen der beiden Sätze. Eine Säure zusammen mit einem dieser Produkte ergab deshalb keine Warnung. Jetzt hängt die Regel am Inhaltsstoff Natriumhypochlorit (CAS 7681-52-9); ein Test prüft jede Säure im Bestand gegen jeden Chlorreiniger. Auch die Beispielprodukte der Demo waren teilweise erfunden. Sie sind durch 45 reale Produkte ersetzt, deren Angaben aus den Sicherheitsdatenblättern der Hersteller stammen (mit Fundstelle und Datum).

2. Der Funktionsumfang war zu groß beschrieben
Was es heute gibt:
- einen Regel-Kern, der ohne Server rechnet und getestet ist. Er sagt nie „sicher“, sondern STOP (belegte Gefahr), NICHT PRÜFBAR (Produkt unbekannt oder Daten unvollständig) oder einen grauen Hinweis „keine bekannte Unverträglichkeit“, der ausdrücklich keine Freigabe ist;
- eine Web-Demo, in der man zwei Produkte auswählt oder ihre GTIN eingibt. Bei STOP gibt es einen Warnton, Vibration (wo der Browser es erlaubt) und einen gesprochenen Warnsatz über die Sprachausgabe des Browsers; den Warnsatz gibt es auf Deutsch, Englisch, Ukrainisch, Polnisch, Türkisch, Arabisch und Rumänisch.

Was noch nicht gebaut ist: der Kamera-Scan der Gebinde, aufgenommene Warnrufe, eine Handy-App mit Alarmsteuerung. Das „15-Hz-Stroboskop“ aus meiner Mail nehme ich ganz zurück: So schnelles Blinken kann bei Menschen mit fotosensibler Epilepsie Anfälle auslösen.

ChemGefahr-Stopp ist damit eine offene Vorlage zum Weiterbauen, kein einsatzfertiges Schutzsystem. Es ersetzt weder Unterweisung noch Gefährdungsbeurteilung.

Aktueller Stand und Liste der Änderungen:
https://felixinberlin.github.io/Amelie/#dose=dose-cleaner-chemical-safety
https://github.com/felixinberlin/Amelie/tree/main/07-demos/chemhazard-stop

Ich melde mich danach nicht erneut. Entschuldigen Sie die zu großen Worte in der ersten Mail.

Mit freundlichen Grüßen
Félix Martínez Resendiz
Amélie (offenes Projekt, Berlin)
```

---

**Vor dem Versand prüfen:**
- Video-Link aus der ersten Mail: Zeigt das Video einen Kamera-Scan, den es nicht gibt? Falls ja, im Satz „Was noch nicht gebaut ist“ ergänzen: „Das Video zeigt ein Konzept, nicht die Demo.“
- Demo-Link öffnen und STOP bei „Säure + Dan Klorix“ selbst sehen.
