# Jobcenter-Portal verständlich erschließen: Recherche und Umsetzungsplan

**Stand:** 17.10.2026 · **Status:** Recherche und Architekturvorschlag, keine Implementierung oder fachjuristische Freigabe · **Lizenz:** eigene Texte CC0; verlinkte fremde Inhalte nicht automatisch CC0.

## 1. Auftrag und Ergebnis

Félix möchte die vielen Menüs und Funktionen hinter seinem Jobcenter-Login verstehen und daraus eine einfachere Hilfe für alle machen.

**Empfehlung:** Einen auf Anliegen ausgerichteten Wegweiser als Ergänzung des vorhandenen Gründungsnavigators bauen. Ausgangspunkt sind offizielle Anleitungen und eine kontrollierte manuelle Bestandsaufnahme. Ein flächendeckender authentifizierter Scraper ist nicht der empfohlene Einstieg.

Die BA-Nutzungsbedingungen nennen Robots/Webspider als unzulässig und beschränken die zweckfremde Schnittstellennutzung zur Datensammlung [S01, Abschnitt 2a]. Deshalb enthält dieser Plan keinen Crawler-Auftrag. Eine spätere automatisierte Integration benötigt zunächst eine belastbare Vereinbarung über erlaubten Umfang und Zugangsweg.

Der Produktnutzen liegt in der Übersetzung von „Was möchte ich erledigen?“ in einen geprüften Weg durch das offizielle Angebot. Das lässt sich weitgehend ohne Zugriff auf Nutzerkonten erreichen.

### Grenzen dieser Sitzung

- Recherche ausschließlich in öffentlich erreichbaren Primärquellen; kein Login, kein Kontozugriff und kein Absenden.
- Die konkrete Login-Adresse von Félix wurde noch nicht bestätigt. jobcenter.digital/BA ist die Arbeitshypothese. Ein örtliches anderes Portal braucht eine eigene Prüfung.
- Keine Vollerfassung der angemeldeten Oberfläche. Keine beobachteten privaten Menüpfade behaupten.
- Kein vollständiger Rechts- oder Datenschutz-Audit. Offene Fragen werden als solche erhalten.
- Repository-Bezug: main bei `1f40b33ee3a9560db860a9721d314f1349d2e890`. Der separate Präzisionsplan liegt auf `docs/gruendungsnavigator-legal-precision-plan`; dieser Branch basiert unabhängig auf main.

## 2. Quellenbefunde und ihre Bedeutung

### 2.1 Zugang und Konten sind nicht dasselbe wie eine Pflicht zur Online-Nutzung

Die BA beschreibt für den Leistungsantrag auch persönliche, telefonische und schriftliche Wege [S02]. Daraus folgt: Unser Werkzeug darf aus „Konto für Online-Service erforderlich“ keine allgemeine Kontopflicht machen. Für jede konkrete Handlung ist der geeignete Kanal gesondert zu prüfen.

Die Serviceübersicht nennt Anträge, Weiterbewilligung, Änderungen, Abwesenheitsanfragen, Nachrichten, Termine und Bescheide [S03]. Das ist ein belegter Startkatalog, keine vollständige private Menüinventur.

### 2.2 Ein Login zeigt nicht allen dieselbe Oberfläche

Die BA unterscheidet Konto und Profile. Funktionen hängen unter anderem vom Profiltyp und der zugeordneten Kundennummer ab; Freischaltung und Online-Kommunikation spielen ebenfalls eine Rolle [S04]. Der Wegweiser muss deshalb „Menü fehlt“ erklären können.

Die aktuelle Nutzungsbedingung nennt mehrere Anmeldeverfahren einschließlich zweitem Faktor [S01, Abschnitt 2b]. Wir implementieren keinen eigenen BA-Login und sammeln keine Zugangsdaten.

### 2.3 Nicht alle Jobcenter sind technisch gleich

Die amtliche Trägerübersicht unterscheidet gemeinsame Einrichtungen und zugelassene kommunale Träger [S05]. Sie belegt Organisationsformen, nicht die konkrete Software jeder Stelle. Eine lokale Quelle muss das tatsächlich verwendete Portal bestätigen. Kein Automatismus „kommunal = Portal X“.

Die BA erläutert am Nürnberger Beispiel regionale Inhalte und Weiterleitungen aus der App ins Portal [S06]. Schlussfolgerung: Web, App und örtliche Variante getrennt erfassen; keine landesweite Funktionsgleichheit aus einem Beispiel ableiten.

### 2.4 Kritischer Unterschied: Nachricht versus Rechtsbehelf

Das Jobcenter Köln warnt ausdrücklich davor, eine Postfachnachricht oder einen dort angehängten unterschriebenen Widerspruch mit seinem vorgesehenen Online-Widerspruchsverfahren gleichzusetzen. Es verweist hierfür auf einen eigenen eService und Identifizierung [S07].

Dies ist ein belegter örtlicher Hinweis, keine abgeschlossene Prüfung sämtlicher bundesweiter Formvoraussetzungen. Produktanforderung: Nachrichten und förmliche Rechtsbehelfe niemals allein wegen ähnlicher Schaltflächen gleich behandeln. Auch eine Versandbestätigung ersetzt nicht die Prüfung des richtigen Übermittlungswegs.

### 2.5 Fristen richten sich nicht schlicht nach „gelesen“

§ 37 Abs. 2a SGB X enthält für die Bereitstellung zum Abruf eine Regel zur Bekanntgabe am vierten Tag nach Absendung der Benachrichtigung, Nachweisfragen sowie Ausnahmen, bei denen ein tatsächlicher Abruf relevant sein kann [S08].

Folgerung: Weder „ungelesen bedeutet fristlos“ noch „jeder Klick startet die Frist“ ist eine tragfähige Produktregel. Benachrichtigung, Bereitstellung, Abruf und rechtliche Bekanntgabe sind getrennte Ereignisse. Die konkrete Anwendung auf einen Vorgang bleibt fachlich zu prüfen. Ein automatisierter Abruf ist deshalb kein neutraler Forschungsschritt, auf dessen Folgen wir blind vertrauen dürfen.

### 2.6 Vorhandene Angebote nutzen

Die BA hat bereits eine Jobcenter-App [S09] und eine Erklärung zur Barrierefreiheit mit benannten verbleibenden Hindernissen [S10]. Unser Mehrwert muss in besserer Orientierung und überprüfbarer Verständlichkeit liegen; die Existenz dieser Angebote ist kein Nachweis, dass alle Nutzer problemlos zurechtkommen.

Die gefundenen amtlichen API-Unterlagen betreffen statistische Aggregatdaten [S11]. Sie sind kein Nachweis einer freigegebenen Schnittstelle zu persönlichen Postfächern. Eine öffentlich dokumentierte Integrations-API oder ein freies Demo-/Testkonto für genau diesen Zweck wurde in dieser begrenzten Recherche nicht verifiziert. Das ist kein Beweis ihrer Nichtexistenz.

### 2.7 Quellen sind nicht automatisch wiederveröffentlichbar

Die BA beansprucht Rechte an Portal, Struktur, Inhalten und Formularen [S01, Abschnitt 3]. Eigene Erklärungen und Quellenlinks bevorzugen. Für Screenshots, Videos, größere Textübernahmen oder ein öffentliches Portalabbild Nutzungsrechte gesondert klären. Keine fremden Assets unter die CC0-Lizenz des Projekts stellen.

## 3. Was wir tatsächlich erfassen sollten

Nicht „alle Seiten herunterladen“, sondern ein versioniertes Verzeichnis der Wege zu konkreten Zielen:

| Nutzeranliegen | Zu erfassender Ablauf | Entscheidende Prüfgrenze |
|---|---|---|
| Ich möchte einen Nachweis schicken. | Dienst wählen, Empfänger prüfen, Datei auswählen, prüfen, senden, Bestätigung sichern. | Dateiauswahl und Upload sind nicht dasselbe wie abgeschickte Nachricht. |
| Mein Bewilligungszeitraum endet. | Passenden Weiterbewilligungsdienst finden, Voraussetzungen und Entwurf erklären. | Entwurf nicht als Antragseingang darstellen. |
| Meine Miete oder mein Einkommen hat sich geändert. | Passende Änderungsmitteilung und Nachweise identifizieren. | Fallabhängige Pflichtangaben nicht erfinden. |
| Ich möchte eine Entscheidung prüfen lassen. | Entscheidung und Belehrung identifizieren, geeigneten Rechtsbehelfsweg klären. | Postfach nicht pauschal zum Widerspruchskanal erklären. |
| Ich finde meinen Bescheid nicht. | Profil, Freischaltung, Kommunikationsstatus und offizielle Hilfe erklären. | Keine Fristberechnung nur anhand des sichtbaren Lesestatus. |
| Ich komme nicht ins Konto. | Offizielle Wiederherstellung und technische Hilfe verlinken. | Keine Umgehung von Anmeldung, MFA oder Identitätsprüfung. |
| Ich möchte mich selbständig machen. | Offizielle einschlägige Services mit bestehendem Navigator verbinden. | Anspruch, Antrag und Ermessensentscheidung nicht verwechseln. |

Die Tabelle beschreibt gewünschte Forschungsfelder, nicht bereits verifizierte Klickfolgen.

### Datenmodell als Spezifikation

Jeder Workflow braucht:
- stabile ID, Nutzerziel und verständliche Suchbegriffe;
- Portalbetreiber, Geltungsbereich und bekannte Varianten;
- Einstieg über offizielle öffentliche URL, keine Session-/Token-Links;
- erforderlichen Konto-/Profilzustand und ggf. Authentifizierungsniveau;
- Schritte mit erwartetem sichtbarem Ergebnis;
- Alternative bei fehlendem Menü oder nicht funktionierendem Dienst;
- Kennzeichnung möglicher Wirkung: Orientierung, Entwurfsänderung, Upload, Übermittlung, Abruf, Kontoeinstellung;
- getrennte Nachweise für Existenz des Dienstes, beobachteten Menüpfad und rechtliche Eignung;
- Quellen-ID, Beobachtungsdatum, Gerätevariante, Reviewstatus und offene Fragen;
- Beschreibung der Bestätigung und ihrer begrenzten Aussagekraft.

**Belegstatus pro Feld:** offiziell dokumentiert, manuell beobachtet, fachlich geprüft, ungeklärt, veraltet. Ein bestätigter Einstieg macht nicht automatisch jeden Folgeschritt bestätigt.

## 4. Technische Optionen und Entscheidung

| Option | Nutzen | Aufwand / Begrenzung | Empfehlung |
|---|---|---|---|
| Eigenständiger Wegweiser mit offiziellen Links | Sofort nutzbare Orientierung ohne Konto bei uns. | Menüänderungen manuell nachführen. | MVP. |
| Synthetische Übungsoberfläche | Abläufe gefahrlos erklären, auch offline und mehrsprachig. | Darf keine ungeprüfte Portal-Kopie oder vermeintlich echte Abgabe sein. | Nach Workflow-Verifikation. |
| Nutzer importiert gezielt eigene Datei | Später z. B. freiwillige Dokumenterklärung. | Separater Datenschutz- und Rechtsumfang, kein Menü-Mapping. | Nicht Teil des MVP. |
| Browser-Erweiterung mit Seitenhilfe | Kontextbezogene Hinweise im echten Portal. | Zugriffsrechte, DOM-Daten, Weiterleitung, Wartung und Bedingungen gesondert prüfen. Lokal bedeutet nicht automatisch unproblematisch. | Zurückstellen. |
| Automatisierter Portalzugriff im Nutzerauftrag | Potenziell stärkere Integration. | Zugangsvereinbarung, Schnittstelle, Nebenwirkungen und Haftung ungeklärt. | Nur als spätere Kooperationsoption. |
| Serverseitiger Login-Proxy | Zentraler Zugriff auf fremde Sitzungen. | Hohe Sicherheits-, Datenschutz- und Betriebsbelastung. | Für dieses Projekt nicht wählen. |

Kein iframe als Kernarchitektur voraussetzen: Einbettbarkeit wurde nicht verifiziert; Authentifizierung und Navigation gehören in das offizielle Angebot. Kein Replay interner Endpunkte, kein Service-Worker-Abgriff fremder Sitzungen und kein Netzwerkexport als Abkürzung.

**MVP-Fluss:** Anliegen auswählen → minimale Kontextfrage → verifizierte Anleitung → offizielle Seite öffnen → Nutzer führt Handlung selbst aus → Checkliste zur Bestätigung. Eine angeklickte Verlinkung setzt unseren Fortschritt niemals automatisch auf „eingereicht“.

## 5. Manuelle Bestandsaufnahme: konkreter Ablauf

### Vorher
1. Tatsächlichen Portalnamen und öffentliche Adresse feststellen. Weiterleitungsziele einzeln verifizieren.
2. Offizielle Anleitungen lesen; aktuelle dienstspezifische Bedingungen prüfen.
3. Für die Recherche zuerst einen auf persönliche Inhalte verzichtenden Beobachtungsbogen vorbereiten.
4. Falls mit der BA abgestimmt möglich, Demo-/Schulungssystem erfragen. Der Plan beauftragt keine Kontaktaufnahme.
5. Félix meldet sich selbst an. Passwort, MFA-Geheimnis, Freischaltcode und Sitzung werden nicht in Amélie gespeichert.

### Währenddessen
- Mensch navigiert gezielt; kein rekursiver Autoklicker und keine massenhafte DOM-Sammlung.
- Nur Menünamen, Reihenfolge, allgemeine Hilfetexte in eigener Beschreibung und sichtbare Voraussetzungen notieren.
- Übersicht mit persönlichen Daten nicht aufzeichnen. Keine echten Anträge „zum Testen“ starten oder ändern.
- Vor Bescheidabruf, Nachrichtenöffnung, Upload, Sendeschritt, Zustimmung oder Kontoeinstellung stoppen. Für solche Beobachtungen einen gesonderten konkreten Zweck und etwaige Folgen klären.
- Auch vermeintliches Lesen kann Zustand ändern; keine pauschale „read-only“-Garantie für das Portal.
- Live-Sitzungen nicht in Playwright-Traces, HAR-Dateien, Browserprofile, Videos oder unbereinigte Screenshots exportieren.

### Danach
- Rohnotizen auf Namen, Nummern, Dateinamen, URLs und Inhalte Dritter prüfen.
- Relevante Struktur als eigene, synthetische Beschreibung übertragen. Bildliche Belege nur nach gesonderter Rechte- und Datenschutzprüfung.
- Zweite Person prüft die bereinigte Fassung vor Git-Veröffentlichung.
- Erst dann Workflow freigeben. Persönliche Informationen nicht erst nach Commit entfernen; Git-Historie würde sie erhalten.

Ein Konto reicht für einen beobachteten Fall. Varianten über freiwillige strukturierte Rückmeldungen erfassen: nur fehlender Menüpunkt, Portaltyp, Gerätevariante und Datum; keine Pflicht zum Screenshot und keine Sozialdaten verlangen.

## 6. Datenschutz und Vertrauen als Produktanforderungen

Eigene Designentscheidung, keine pauschale Rechtskonformitätsbehauptung:
- Wegweiser ohne zusätzliches Konto, ohne Tracking und ohne Verbindung zum BA-Postfach.
- Keine automatischen Netzwerkaufrufe beim Import persönlicher Angaben.
- Kein persönlicher Text in URL, Telemetrie, Fehlerbericht oder Supportformular.
- Suchbegriffe lokal verarbeiten; Ergebnisse aus einem überprüften Katalog statt frei erfundener Klickanleitungen.
- Öffentliche Inhalte und persönliche Arbeitshilfen in Speicherung und Export auseinanderhalten.
- Bei späterer Dateiverarbeitung: gesondertes Konzept zu Rechtsgrundlage, Rollen, Löschung, Drittdiensten und Gerätenutzung; lokale Verarbeitung allein reicht als Begründung nicht.
- Klare Kennzeichnung als unabhängige Hilfe, keine amtliche Gestaltung oder vorgetäuschte BA-Partnerschaft.
- Rechtsprüfung des verbundenen Präzisionsplans übernehmen; aus einer Bedienhilfe darf nicht unbemerkt individualisierte ungeprüfte Rechtsberatung werden.

## 7. Umsetzungstickets

Alle IDs sind Arbeitsplan-IDs, keine angelegten GitHub-Issues. Abnahmekriterien sind vorgeschlagen, noch nicht erfüllt.

### JCP-01 — Portal und Umfang bestätigen (P0)
**Ergebnis:** dokumentiertes Betreiber-/Portalprofil mit öffentlichen Einstiegen, Kontovarianten und offenen Zugangsfragen.
**Abnahme:** tatsächliche Login-Domain bestätigt; lokale Variante nicht geraten; Bedingungen datiert; erlaubter Forschungsweg festgelegt; kein Kontozugriff dafür notwendig.

### JCP-02 — Quellen und bestehende Hilfen inventarisieren (P0)
**Ergebnis:** kleine Quellenmatrix aus diesem Dokument, offiziellen Anleitungen und belegten Diensten.
**Abnahme:** pro Aussage Fundstelle und Geltungsbereich; ältere Anleitung nicht still zur aktuellen Beobachtung erklärt; Quellenrechte getrennt von eigener Lizenz dokumentiert. Kein automatisierter Sammellauf.

### JCP-03 — Workflow-Schema und fünf priorisierte Anliegen (P0)
**Ergebnis:** validierbarer Katalog für Nachweise, Weiterbewilligung, Änderung, Bescheid finden und Kontozugang.
**Abnahme:** IDs und Quellen auflösbar; unbekannte Schritte bleiben unbekannt; Gebiet/Profil/Datum Pflicht; Rechtsbehelf bekommt getrennten Prüfstatus statt generischer Nachrichtenroute.
**Repo:** bestehende Datenarchitektur unter `07-demos/gruendungsnavigator/data/` erweitern, endgültigen Dateinamen erst bei Umsetzung festlegen.

### JCP-04 — Manuelle Walkthroughs und Varianten (P0)
**Ergebnis:** bereinigte Beobachtungsberichte nach Abschnitt 5.
**Abnahme:** Desktop und mobile Ansicht mindestens je einmal; ein fehlendes Menü und ein nicht freigeschalteter Zugang erfasst, soweit tatsächlich beobachtbar; keine erfundenen Testzustände. Persönliche Rohdaten nicht in Git. Nicht beobachtbare Varianten ausdrücklich offen.

### JCP-05 — Anliegenbasierter Wegweiser (P1)
**Ergebnis:** Integration in bestehende Jobcenter-Hilfe.
**Abnahme:** Alltagssprache, wenige notwendige Fragen, Originalbezeichnungen sichtbar, offizielle Links, Druck, Tastatur/Screenreader und offline lesbare Anleitung. Offline klar sagen, dass keine Übermittlung erfolgt. Kein zusätzlicher Login.

### JCP-06 — Verfahren, Kanal und Bestätigung prüfen (P0 vor Veröffentlichung)
**Ergebnis:** fachlich geprüfte Zuordnung der Handlung zum Übermittlungsweg.
**Abnahme:** Postfach versus Rechtsbehelf, Entwurf versus Absenden, Versand versus Sachentscheidung sowie Benachrichtigung versus Abruf getrennt. Kein Datum aus „gelesen“ ableiten. Aussagen mit konkreter Quelle und Einschränkungen versehen.
**Abhängigkeit:** GN-P01 bis GN-P03 und GN-P06 des separaten Präzisionsplans.

### JCP-07 — Verständlichkeit und Barrierefreiheit testen (P1)
**Ergebnis:** Vergleichstest offizieller Einstieg allein versus Wegweiser plus offizieller Einstieg.
**Abnahme:** kleiner formativer Test mit z. B. fünf freiwilligen Personen verschiedener Digitalkompetenz; kein statistischer Wirksamkeitsbeweis. Aufgabenerfolg, falsche Kanalwahl, Hilfebedarf und Verständnis messen; kritische Fehlleitung verhindert Freigabe. Kein Zwang zu echten Einreichungen. Wenig Deutschkenntnisse und assistive Nutzung berücksichtigen.

### JCP-08 — Aktualisierung und Fehlermeldung (P1)
**Ergebnis:** Verantwortlichkeit und überprüfbarer Review-Zyklus.
**Abnahme:** sichtbarer Prüfstand; Vorschlag: monatliche manuelle Stichprobe, zusätzlich anlassbezogen bei Änderungshinweisen. „Menü sieht anders aus“ ohne Personendaten meldbar. Betroffener Workflow kann gezielt als unbestätigt markiert werden. HTTP-Erreichbarkeit allein zählt nicht als Funktionsprüfung.

### JCP-09 — Kooperationsoption vorbereiten (P2, optional)
**Ergebnis:** interne Fragenliste zu Demo-Zugang, erlaubter Navigationserhebung, Nutzungsrechten und dokumentierten Schnittstellen.
**Abnahme:** keine Behauptung einer vorhandenen Partnerschaft/API; keine Kontaktaufnahme aus diesem Ticket ohne gesonderten Auftrag. Falls später zugelassen: minimaler, zweckgebundener Pilot mit dokumentierter Vereinbarung.

## 8. Validierung und Auslieferung

Dieser Commit enthält nur Dokumentation; keine Anwendungstests ausgeführt. Bei Umsetzung gelten aktuelles AGENTS.md, gezielte Daten-/Engine-Tests und UI-Prüfungen. Browser-Tests auf synthetischer eigener Übungsoberfläche oder ausdrücklich vereinbartem Testsystem ausführen; keine CI gegen persönliche Produktivkonten.

Sinnvolle Regressionen:
- Nutzer sagt „Ich habe es hochgeladen“: nicht automatisch „eingereicht“ ausgeben.
- Nutzer hat kein Konto: passende belegte Alternative anbieten.
- Profil fehlt: Konto nicht fälschlich als defekt erklären.
- Nicht verifizierter Menüpfad: keine genaue Klickfolge generieren.
- Rechtsbehelf: generischen Nachrichtenweg nicht automatisch empfehlen.
- Veraltete Quelle/offline: ursprünglichen Prüfstand anzeigen.
- Sitzungstoken in vorgeschlagener URL: Veröffentlichung ablehnen.

## 9. Offene Fragen

1. Welche konkrete Portaladresse verwendet Félix?
2. Gibt es einen geeigneten offiziellen Demo-/Schulungszugang?
3. Welche Pfade funktionieren nach Anmeldung und Weiterleitung zuverlässig ohne persönliche URL-Parameter?
4. Welche Rechte bestehen für konkrete illustrative Screenshots?
5. Welche lokalen Portale sollen zuerst abgedeckt werden?
6. Wie unterscheiden sich Authentifizierungsanforderungen je konkretem Dienst?
7. Wer übernimmt Fachreview und laufende Pflege?
8. Wie viel Orientierung liefert der Wegweiser zusätzlich zur vorhandenen BA-App tatsächlich?

Keine dieser Fragen blockiert die Quellenmatrix und das Workflow-Schema. Authentifizierte Erhebung und zuverlässige öffentliche Klickanleitungen hängen hingegen von den entsprechenden Antworten ab.

## 10. Quellenverzeichnis

Abruf-/Sichtungstag für alle Quellen: 17.10.2026. HTML-Seiten wurden geöffnet bzw. über amtliche Suchergebnisse ausgewertet wie angegeben; keine privaten Seiten. Zusammenfassungen sind keine verbindliche Rechtsauskunft.

| ID | Primärquelle / URL | Sichtung und relevante Fundstelle |
|---|---|---|
| S01 | [BA Nutzungsbedingungen](https://www.arbeitsagentur.de/nutzungsbedingungen) | HTML geöffnet; Stand 08.07.2026; 2a, 2b, 3. |
| S02 | [BA Antrag und Bescheid](https://www.arbeitsagentur.de/grundsicherung/finanziell-absichern/antrag-bescheid) | HTML geöffnet; Abschnitt Antragstellung, Versandbestätigung. |
| S03 | [BA Online-Services im Überblick](https://www.arbeitsagentur.de/grundsicherung/online-services-im-ueberblick) | Amtliches Suchergebnis mit Serviceübersicht; konkrete private Pfade nicht beobachtet. |
| S04 | [BA Ein Konto, mehrere Profile](https://www.arbeitsagentur.de/ein-konto-mehrere-profile) | HTML geöffnet; Konto/Profil, Freischaltung, verfügbare Funktionen. |
| S05 | [BA Statistik: Gebietsstruktur der Grundsicherungsträger](https://statistik.arbeitsagentur.de/DE/Navigation/Grundlagen/Klassifikationen/Regionale-Gliederungen/Gebietsstruktur-Traeger-Grundsicherung-Nav.html) | Amtliches Suchergebnis; Gebietsstand August 2026, Organisationsformen. XLSX nicht geprüft. |
| S06 | [BA Nürnberg: Jobcenter wird digitaler](https://www.arbeitsagentur.de/vor-ort/nuernberg/presse/2024-40-mehr-service-weniger-burokratie-das-jobcenter-wird-digitaler-und-burgernaher) | Amtliches Suchergebnis; Mitteilung vom 18.12.2024, regionale App-Inhalte und Portalweiterleitung; historischer Kontext. |
| S07 | [Jobcenter Köln: jobcenter.digital](https://www.jobcenterkoeln.de/online/jobcenter-digital/) | HTML geöffnet; Abschnitt Online-Widerspruch, örtlicher Geltungsbereich. |
| S08 | [§ 37 SGB X](https://www.gesetze-im-internet.de/sgb_10/__37.html) | Amtlicher Normtext geöffnet; insbesondere Abs. 2a, keine Einzelfallprüfung. |
| S09 | [BA Jobcenter-App](https://www.arbeitsagentur.de/apps/jobcenter-app) | Amtliches Suchergebnis; bestehendes Angebot. |
| S10 | [BA Erklärung zur Barrierefreiheit](https://www.arbeitsagentur.de/erklaerung-barrierefreiheit) | HTML geöffnet; Stand 28.08.2026; genannte Barrieren. |
| S11 | [BA Statistik: API Eckwerte SGB II](https://statistik.arbeitsagentur.de/DE/Statischer-Content/Service/API/API-GRUSI.html) | Amtliches Suchergebnis; Statistik-Schnittstelle, keine Kontointegration belegt. |

### Quellenmeldung für BIB

Neue externe Quellenhinweise S01–S11 stehen in diesem Arbeitsdokument, nicht im zentralen Register. Nur der Bibliothekar übernimmt sie nach Projektworkflow und mit passender Kennzeichnung der Sichtungstiefe. Kein Empfänger angeschrieben, keine Quellenvektoren vergeben, kein Existenzurteil oder Dosenstatus verändert. Anschluss an den separaten Präzisionsplan; keine automatische Freigabe durch diese Recherche.
