# Mail 8 — Glasanflug-Ampel → LAG VSW (Eigentümerin des Schemas)

**Status: ENTWURF, nicht gesendet.** Kein Empfänger im Sinne des Manifests — kein Bauträger, sondern die Stelle, die das Schema verantwortet. Diese Mail schenkt keine Idee, sie liefert eine Rückmeldung und bittet um Korrektur.
**An:** Adresse aus dem Beschluss übernehmen (Kontaktblock Seite 1: Bayerisches Landesamt für Umwelt, Staatliche Vogelschutzwarte) — vor dem Senden auf der Seite vogelschutzwarten.de gegenprüfen.
**Betreff:** Beschluss 21/01 maschinenlesbar — zwei Rückfragen aus dem Nachrechnen
**Code:** `04-werkzeug/glasanflug-ampel/`

---

Sehr geehrte Damen und Herren,

ich habe Ihren Beschluss 21/01 in der Fassung von 2023 in eine maschinenlesbare Form gebracht — die vier Kriterien aus Tabelle 3 mit ihren Punktwerten und Wortlauten, die Risikostufen aus Tabelle 4, die Schwellenwerte der drei Gebäudekategorien und die acht Anwendungsgrundsätze. Dazu eine kleine Funktion, die daraus Punktsumme, Risikostufe und Begründung rechnet, und eine Testsuite, die alle elf durchgerechneten Beispiele aus Ihrem Anhang nachrechnet. Das Ganze steht unter CC0 und ist damit frei verwendbar, auch von Ihnen, ohne dass ich etwas davon habe.

Der Anlass ist nicht, Ihnen ein Produkt anzubieten, sondern zwei Dinge zurückzumelden, die beim Nachrechnen aufgefallen sind.

Erstens: Im Anhang, beim Beispiel „Berlin, Forschungszentrum", stehen die Gebäudefaktoren 3 und 3 und darunter „Summe 7"; der Gesamtwert ist mit 13 angegeben. Nachgerechnet ergeben sich 6 und damit 12. An der Risikostufe ändert das nichts — beide Werte liegen in „hoch" —, aber falls es eine überarbeitete Fassung gibt, wäre das eine Zeile.

Zweitens, und das ist die eigentliche Frage: Tabelle 3 enthält zwei Vorrangregeln, die die Punktsumme überstimmen. Ein Glasanteil von 4 Punkten führt zur Gesamtbewertung „hoch", eine Lochfassade mit Fensteröffnungen bis 1,5 Quadratmeter zur Gesamtbewertung „gering". Treffen beide zu — etwa eine Lochfassade mit einer freistehenden, vollverglasten Windschutzeinfriedung im selben Abschnitt —, fordern die Regeln das Gegenteil voneinander. Der Beschluss regelt diesen Fall nach meinem Lesen nicht. Meine Umsetzung entscheidet ihn deshalb nicht selbst, sondern meldet ihn als Konflikt und fällt auf die Punktsumme zurück. Falls es dazu eine Auslegung gibt, würde ich sie gerne wortgetreu abbilden statt sie zu erfinden.

Hintergrund, kurz: Ich recherchiere Softwareideen und verschenke die, die ich nicht selbst baue. Hier geht es um die Frage, ob sich die drei situationsbezogenen Kriterien — Glasanteil, Umgebung, Abstand zu Gehölzen — aus einem Fassadenfoto und offenen Geodaten schätzen lassen, damit Ihre Einschätzung nicht mehr an einem Ortstermin hängt. Die Ausgabe wäre ausdrücklich kein Urteil, sondern ein ausgefülltes Blatt mit sichtbaren Eingangswerten und der Angabe, was unbestimmt blieb. Die Beschreibung liegt hier: <Link>

Mir ist wichtig, dass so etwas Ihre Fassung wortgetreu abbildet und von Ihnen korrigierbar bleibt — sonst entstehen zwei Verfahren, und das hilft niemandem.

Eine Antwort ist nicht nötig, ich fasse nicht nach.

Mit freundlichen Grüßen
Félix
