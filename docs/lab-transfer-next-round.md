# Wünsche für künftige Lab-Transfers — Erkenntnisse vom 11.10.2026

Diese Empfehlungen stammen aus der Bearbeitung von 72 Batches mit 159 Ideen.
Sie ändern den bestehenden Receipt-Vertrag nicht automatisch. Verbindliche
Schemaänderungen müssen im Lab und in Amélie gemeinsam versioniert werden.

## Was gut funktioniert hat

Die unveränderlichen Receipts enthalten auch Research-Pakete, Blindreviews,
Zitatfehler, verworfene Ansätze und Läufe ohne Survivor. Dadurch konnten wir
Nullausbeute erklären und alte Prüfungen wiederfinden. Producer-IDs und lokale
Ideen-IDs vermeiden technische Kollisionen. Amélies getrennte Bearbeitungsdateien
und Worker-Leases erlauben Entscheidungen, ohne Originalmaterial umzuschreiben.

## Die wichtigsten Verbesserungen

1. **Vor einem Lauf den Amélie-Bestand abgleichen.** Lab bekommt einen datierten
   Bestandssnapshot mit Commit, Dosen-, Kandidaten- und Grab-IDs sowie offenen
   PRs. Ein früher geprüfter Lauf soll seine Amélie-Fundstelle nennen. Heute
   konnten 55 Vorschläge früheren Prüfungen zugeordnet werden; ein anderer
   Schmetterlingslauf musste dagegen neu geprüft werden. Gleicher Themenname
   ist keine gleiche Idee. PR187 und die Jobcenter-Läufe zeigen außerdem,
   warum offene PRs vor einer zweiten Packrunde sichtbar sein müssen.
2. **Pro Behauptung eine belastbare Quellenstelle liefern.** Benötigt werden
   konkrete Primär-URL, Publikations-/Versionsdatum, Abrufdatum, Seite oder
   Abschnitt, kurzer Beleg und eine Erklärung, was dieser Beleg tatsächlich
   trägt. Ein Quellen-Link für einen ganzen Absatz genügt nicht. Zugang
   getrennt notieren: Volltext gelesen, Suchschnipsel, nicht zugänglich.
   `not_found` oder `fuzzy` beim Zitatcheck soll den Anspruch senken, nicht
   durch das Etikett „Refereed“ unsichtbar werden. Fehlgeschlagener Abruf
   beweist weder Nichtexistenz noch Falschheit.
3. **Norm, Entwurf und Vollzugshilfe getrennt abliefern.** §9 EnEfG,
   BT-Drs.21/8027, BAFA-Merkblatt und EED haben unterschiedliche Aussagen und
   Personenkreise. Jede Frist braucht ihren Auslöser; jede Schwelle ihre
   Einheit und Bezugsperiode. Eine nachweislich verkündete Fassung darf erst
   dann als geltendes Recht geführt werden. BAFA erlaubt das
   Unternehmensregister als Veröffentlichungsort; daraus folgt weder ein
   Fachaggregator noch dessen Abwesenheit.
4. **Zahlen mit Nenner und Studiendesign liefern.** Jobcenter-Effekte wie
   <4%, 35–45% oder >80% blieben ungeprüft, obwohl plausible Institutionen
   genannt waren. Jede Zahl braucht Originalpublikation, Jahr, Population,
   Stichprobe, Vergleichsgruppe und Endpunkt. Ländertransfer und eine
   prozentuale Zeitersparnis sind jeweils neue Behauptungen. Qualitative
   Interviews bestätigen keine quantitativen Wirksamkeitsquoten.
5. **Den falsifizierbaren Datentest vor dem technischen Versprechen liefern.**
   Für Foto-, Audio- und 3D-Ideen brauchen wir ein zugängliches Referenzsample,
   Datenlizenz, unabhängige Zielwerte, Fehlermaß und mindestens einen
   Gegenfall. Bewegung an der Wasseroberfläche misst keine Tiefe; Farbe
   bescheinigt keine mikrobiologische Sicherheit; Übereinstimmung mehrerer
   Kartierer ist keine Wahrheit. Funktionierende OCR ist noch keine korrekte
   Rechtsauslegung. Ein kleiner ehrlicher Test ist wertvoller als eine lange
   Liste unbelegter Fähigkeiten.
6. **Empfängermandat und Betriebsaufwand konkret beschreiben.** Institution,
   offizielle Zuständigkeitsseite, tatsächlicher Prozess und erlaubter
   Datenzugang fehlen oft. GPS schafft keine verfügbaren Beistände; ein
   Plattformkonzept schafft keine Moderation; offene Software schafft keine
   Registerzugriffsrechte. Die nächste Lieferung sollte unterscheiden:
   abgeschlossener Offline-Baustein, laufend gepflegter Datensatz,
   Hardwarebetrieb, soziale Dienstleistung oder Gesetzesreform. Institutionen
   auf offiziellen Websites prüfen; Namen ohne Verifikation als offen führen.
7. **Kommerzielle und gemeinwohlorientierte Kernen trennen.** Die 19 Mark-Läufe
   mit 40 Angeboten sind erhalten, aber außerhalb des CC0-main-Mandats
   archiviert. Das ist kein Markt-Kill und keine Venture-Freigabe. Falls ein
   kommerzieller Lauf einen unabhängigen CC0-Baustein enthält, diesen als
   ausdrücklich getrennten Vorschlag mit eigener Lücke, Datenbasis und
   Betriebsannahme liefern. Gebührenmodelle nicht einfach aus einem Angebot
   löschen und den Rest als schlüsselfertiges Geschenk etikettieren.
8. **Weniger Wiederholungen, mehr belegte Änderungen.** Varianten von
   BürgerRechte-Copilot, HandyFoto und KiezBeistand brauchen gemeinsame
   Clusterreferenzen. Neue Revisionen sollen sagen, welche konkrete Lücke
   seit der letzten Prüfung geschlossen wurde. Forschungsnachlieferungen
   bleiben eigenständige Receipts, auch wenn sie dieselbe Dose betreffen;
   ihre akzeptierten, widerlegten und weiterhin offenen Claims werden in
   Amélie getrennt zugeordnet.

## Vorschlag für die nächste Übergabe

Zusätzlich zum unveränderten Receipt-Vertrag eine kurze Begleitdatei liefern:

- Producer, Run, Revision, vollständige Idea-IDs und Basis-Commit von Amélie.
- Vorherige Amélie-IDs/Review-Fundstellen und bekannte offene PRs.
- Claims-Tabelle: Behauptung → Primärstelle → Zugang → belegter Umfang → Grenze.
- Datentest: erlaubtes Sample, Referenz, Fehlermetrik, Gegenfall, Ergebnis.
- Recipient: offizielle Mandatsseite und ungeklärte Zuständigkeit.
- Betriebsmodell und klare Route: CC0-Prüfung, Research-Nachlieferung oder Venture.
- Nullausbeute: alle ursprünglichen Kills und Gründe; keine künstlichen Survivors.
- Forschungsauftrag: genau das fehlende Artefakt, das eine Neubewertung erlaubt.

Lab darf weiterhin **keine Amélie-Existenzurteile, Scores oder Workflowstatus
setzen**. Diese Begleitinformationen sind Hinweise, kein automatischer Review.
Amélie entscheidet über Bibliothekar, Reviewer und Packer.

## Technischer Transfer und Veröffentlichung

- Create-only Producer-Dateien über GitHub übertragen; alle Engines aggregieren,
  nicht den gemeinsamen Index aus einem einzelnen Lab ersetzen.
- Schema-, Manifest- und Receipt-Abgleich vor Import; vollständige 72/159-artige
  Bilanz mit Research-Paketen und eingebetteten Runs, nicht nur Survivorzahl.
- Prüfreferenzen und Fingerprints getrennt von Original-Receipts speichern.
  Vollständige CLI-Ausgaben direkt in Dateien schreiben: bei großen JSON-Paketen
  gab es heute abgeschnittene Pipe-Ausgaben, die vor dem Review erneut gelesen
  werden mussten. JSON parse-validieren, bevor daraus gerechnet wird.
- Leases nur über denselben autoritativen Workspace/Koordinator vergeben.
  Separate Git-Klone sind kein verteilter Lock. Claim unmittelbar vor Arbeit,
  Übergang mit Review-Fundstelle, keine verwaisten aktiven Leases veröffentlichen.
- `received`, `processed`, `needs_research` und `archived` nicht mit
  Existenzurteilen verwechseln. Besonders Archivierung außerhalb des Mandats
  darf später nicht als `besetzt` interpretiert werden.
- Exporte, Inventory, Register, zweisprachige Dosen und Tests gemeinsam
  veröffentlichen. Testfehler mit Umgebung unterscheiden; bestehende Zeitlimits
  nicht für einen grünen Lauf hochsetzen.
- Keine Vertex-Aufrufe ohne erneute ausdrückliche Credits-Freigabe; keine
  kostenpflichtigen Google-Maps-APIs. Kein Outreach im Intake-Workflow.

Das wichtigste nächste Paket ist keine weitere Ideensammlung: Es sind die
konkreten Primärpublikationen hinter den Jobcenter-Quoten und kleine unabhängige
Referenztests für die stärksten noch offenen Messideen. Die vollständigen
Nachprüfaufträge stehen im [Intake-Review](../06-suche/lab-intake-review-20261011.md).
