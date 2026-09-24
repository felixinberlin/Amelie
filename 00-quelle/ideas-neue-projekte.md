# Gestalt-Prüfung (Sensory Validation of Data Entry)

**Empfänger:** Citizen Science Projekte mit manueller Datenerfassung (z.B. DO IT - TU Braunschweig, Wettermeldedienste)
**Kategorie:** Zivilgesellschaft / Ehrenamt
**Urteil:** `frei` (Amélie-Prüfung am 24.09.2026)

## Das Problem
Viele Citizen Science Projekte (wie *DO IT* der TU Braunschweig) digitalisieren historische Wetter- und Abflussdaten aus analogen Tabellen. Die Qualitätssicherung ist ein Flaschenhals: Weil Menschen einzelne falsche Ziffern in langen Tabellen kaum erkennen, muss jeder Zeitraum *zweifach* von unterschiedlichen Personen transkribiert werden. Das halbiert die ohnehin knappe Arbeitskraft der Ehrenamtlichen.

## Der Gap
Bisherige Interfaces vergleichen blind zwei Textstrings, anstatt die menschliche Mustererkennung (Gestaltwahrnehmung) zu nutzen, um den Fehler schon bei der Eingabe offensichtlich zu machen.

## Die Idee: Gestalt-Prüfung
Während der Volunteer die historischen Zahlen abtippt, werden die Werte in Echtzeit in eine kontinuierliche Kurve (visuell) oder einen Ton (Sonifikation) übersetzt. Vertippt sich jemand (z.B. "200" statt "20" für Niederschlag), entsteht ein sofortiger, extremer visueller Ausschlag oder ein misstönender Peak.
Der Volunteer korrigiert den Tippfehler intuitiv im selben Moment. Die Notwendigkeit der fehleranfälligen Doppel-Eingabe durch eine zweite Person entfällt, da Ausreißer sofort sensorisch spürbar sind.

## Warum jetzt?
Browserbasierte prozedurale Generierung (Canvas API, WebAudio API) erlaubt es, Zahlen ohne Latenz und Server-Roundtrips in sensorisches Feedback zu übersetzen.

## Bisoziations-Ursprung
- **Anker:** DO IT Projekt (TU Braunschweig) - Zwang zur Mehrfachtranskription.
- **Collider:** Strickmuster - Übersetzung von abstraktem Code in eine physische Form, wo ein falscher Code sofort als "Loch" in der Struktur sichtbar wird.
# Die Daten-Schicht (Synchronous Transcription Events)

**Empfänger:** Citizen Science Projekte
**Kategorie:** Zivilgesellschaft / Ehrenamt
**Urteil:** `besetzt` (Amélie-Prüfung am 24.09.2026)

## Das Problem
Citizen Science Transkriptions-Plattformen isolieren Volunteers in asynchroner Einzelarbeit.

## Die Idee
Eine Transkriptions-Plattform, die absichtlich die meiste Zeit geschlossen ist und nur für intensive, geplante 30-Minuten-"Schichten" öffnet, bei denen Hunderte von Volunteers gleichzeitig tippen.

## Befund: Besetzt
Das Konzept von synchronen Transkriptions-Events ist unter dem Begriff "Transcribathons" (z.B. von Europeana) bereits etabliert.

---

## 6. Neue Ideen (Lacunar Bisociation - 24.09.2026)

**Gestalt-Prüfung (Sensory Validation of Data Entry)** — **M**
Während ein Volunteer historische Zahlen abtippt, werden die Werte in Echtzeit in eine kontinuierliche Kurve oder einen Ton übersetzt. Ein Tippfehler erzeugt einen sofortigen sensorischen Ausschlag. Der Volunteer korrigiert den Fehler intuitiv selbst, wodurch die fehleranfällige und teure Doppel-Eingabe (Mehrfachtranskription zur QS) durch eine zweite Person entfällt. (Zustand: `frei`)

**Die Daten-Schicht (Synchronous Transcription Events)** — **S**
Eine Transkriptions-Plattform, die nur für intensive, geplante 30-Minuten-"Schichten" öffnet, bei denen Hunderte von Volunteers gleichzeitig tippen. (Zustand: `besetzt` durch Europeana Transcribathons)
