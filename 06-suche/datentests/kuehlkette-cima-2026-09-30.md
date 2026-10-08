# Datentest Kühlkette (CIMA), 30.09.2026

**Frage** (Reviewer-Restrisiko zu `kuehlketten-steckbrief`, Farmacia-Runde): Sagt die Fachinformation überhaupt, wie lange ein Kühlprodukt außerhalb des Kühlschranks bei welcher Temperatur hält? Ohne zitierbare Zahl trägt der Steckbrief nicht.

**Methode:** `node scripts/datentest-kuehlkette.mjs`. Für 20 Kühlprodukte (Insuline, GLP-1, Biologika, Impfstoffe, Augenmittel) die Abschnitte 6.3 und 6.4 der Ficha técnica über die offene CIMA-API (`docSegmentado/contenido/1`) geholt, HTML-Entitäten dekodiert und nach Hinweisen auf Lagerung außerhalb der Kühlung gesucht, mit Temperatur **und** Dauer im selben Textfenster. Quelle live abgerufen [Seite].

**Ergebnis:** 17 der 20 Produkte fanden sich als Kühlware im Handel; bei **13 von 17 (76 %)** steht eine zitierbare Temperatur mit Dauer, etwa Humira „hasta 25 ºC durante hasta 14 días“, Enbrel „hasta 4 semanas“, Mounjaro „hasta 21 días … por debajo de 30 ºC“, Eylea „24 horas por debajo de 25 ºC“, Skyrizi „24 horas“. Ohne Treffer: Tresiba, Stelara, Orencia, Fluenz.

**Grenzen:**
- Das Muster ist eng. Die vier Fehlanzeigen können Formulierungen sein, die es nicht trifft, oder es fehlt die Klausel wirklich. Stelara nennt im Abschnitt 6.3 eine Stabilität nur für das rekonstituierte Produkt. Die Zahl 76 % ist damit eine **Untergrenze**, keine Schätzung der echten Rate.
- Stichprobe von 17 bekannten Markenprodukten, nicht zufällig.
- Spanische Fachinformation. Die deutsche liegt hinter fachinfo.de (ABDATA) und ist nicht frei abrufbar (Reviewer-Befund).
- Der Test prüft nur, ob eine Zahl **dasteht**. Ob die Klausel für die Situation in der Offizin passt (mehrere Exkursionen, Gesamtdauer, Summe aus Teilzeiten), prüft er nicht. Der Steckbrief darf deshalb nie „verwendbar“ sagen, nur „von der Fachinformation gedeckt / nicht gedeckt“.

**Folge für das Urteil:** Ground Truth (V7) ist für den Spanien-Teil belegt. Damit steht `kuehlketten-steckbrief` (23/35, Gate 24) zur Neubewertung durch den Reviewer an. Der Datentest ersetzt die Bewertung nicht.
