# Stand-in-Läufe: Claude-Subagenten statt Vertex-Modell

Stand 14.10.2026 (Félix hat die Übernahme der Lab-Methode freigegeben). Vorlage: `Amelie-lab/docs/STAND-IN-RUNS.md` (Lab-Commit 3bb78ee2).

## Wann

Solange Vertex-Modellaufrufe gestoppt sind (`AGENTS.md` §4, „Vertex-Credits"), ein Engine-Lauf aber gewünscht ist: `ideen-scout` / `amelie-ideenrunde` (Existenzprüfung), `bisoziations-kollider`, `inversions-agent`, `constraint-release-agent`, `idea-reviewer`. Ein Claude-Subagent übernimmt das Denken Stufe für Stufe und folgt dem Skill- bzw. Direktiventext der Engine. Er schreibt nur seine Ergebnisdatei bzw. seinen Logabschnitt, keinen Code.

**Nicht für Mark / Ventures:** Dort müssen alle zitierten Seiten geholt und Fakten geprüft werden; ein Stand-in würde das vortäuschen. Auf Vertex warten.

## Regeln

1. **Ein Stand-in ersetzt nie einen Live-Lauf.** Sagt Félix, dass Vertex wieder da ist, wird dieselbe Absicht live wiederholt und verglichen.
2. **Kennzeichnung:** Im Lab-Lauf steht `stand-in` im Feld `model` (`"claude-subagent (stand-in, Vertex unavailable; searches: Lab grounded search service)"`). In Amélie-Logs und im Prüfprotokoll steht `[stand-in]` im Beleg bzw. in der Abschnittseinleitung der Runde.
3. **Zitierbar als `[Seite]` / `evidenz=seite` ist nur, was eine Suche tatsächlich als Seite geliefert hat.** Jede Suche behält ihre Seiten im Protokoll. Keine Seite, kein `seite`: dann `schnipsel`.
4. **Keine Interna in Suchfragen** (Vokabular, Urteile, Pfade von Amélie): Die Schwärzungsschranke des Dienstes lehnt sie ab. Fragen einfach, klar, in sich verständlich formulieren.
5. **Existenzurteile (`frei`/`besetzt`/…) fällt Amélie**, nicht der Lab-Lauf. Treffer des Dienstes sind Spuren, keine Urteile.

## Suche: Dienst oder WebSearch

**Standard: Googles geerdeter Suchdienst des Labs** (eine Gemini-Flash-Anfrage mit Google Search je Frage, Projekt `amelie-agents`). Er läuft durch die Schwärzungsschranke, zählt gegen die Quote und archiviert die Rohantwort (lokal, git-ignoriert).

```sh
cd /home/felix/amelie/Amelie-lab && \
GOOGLE_GENAI_USE_VERTEXAI=true GOOGLE_CLOUD_PROJECT=amelie-agents GOOGLE_CLOUD_LOCATION=us-central1 \
.venv/bin/python -m agents.search_service "<einfache Frage>" \
  --run-id <id> --n <k> --requester <name> --language de --max-queries 3 --json
```

* `--run-id` z. B. `<engine>-<YYYYMMDDTHHMMSS>-<slug>`; `--n` zählt die Suchen des Laufs hoch (Anfrage-ID `<run-id>-s<n>`); `--requester` ist der Engine-/Agentenname.
* `--json` liefert `request_id`, `status`, `pages`, `queries`, `queries_used`, `answer`. Nur die gelieferten `pages` dürfen als Beleg stehen.
* Quote vorher ansehen: `cd /home/felix/amelie/Amelie-lab && .venv/bin/python runner.py --status`.
* Voraussetzung: Lab-`.venv` und Vertex-Zugangsdaten (Application Default Credentials). Der Dienst ist **kein** Modellaufruf der gestoppten Engines, aber Vertex-Verbrauch: Nutzung mit Félix abgesprochen (14.10.2026).

**WebSearch/WebFetch** nur, wenn der Dienst nicht läuft (`.venv`/Zugangsdaten fehlen, Fehlerstatus, Quote leer) oder um eine vom Dienst gelieferte Seite selbst zu lesen. Dann im Beleg ausdrücklich `[stand-in, Suche: WebSearch]` vermerken; nichts ist archiviert oder gezählt, also jede Suche mit ihren gelieferten Seiten festhalten.

Faustregel: Entdecken und Existenzspuren (viele, breite Fragen) über den Dienst; eine bekannte Seite lesen oder Wortlaut prüfen über WebFetch.

## Tore vor der Übergabe (wie bei einem Live-Lauf)

* Lab-Seite: `cd /home/felix/amelie/Amelie-lab && .venv/bin/python -m agents.standin_check results/<engine>/<run_id>.json` bis 0 Probleme (vor dem Eintragen in Amélie, sonst meldet der „schon versucht"-Test das eigene Paar).
* Amélie-Seite: jeden Kandidaten mit `npm run bib -- find --stamm <Begriffe>` gegen den Bestand halten (Exit 2 = Nachprüfung); `protokoll add` mit `--evidenz seite|schnipsel` und `[stand-in]` im Beleg; `npm run check:protokoll`; Quellenmeldungen im Format von `bib quellen formate`, Import erst mit `--dry-run`; zum Schluss `npm run bib -- abschluss`.

## Lab-Chargen annehmen (Lehre vom 14.10.2026)

Erzeugte Läufe (AI-Studio-Jobcenter-Suite) rutschten als Lab-Chargen herein. Eine Lab-Charge nur annehmen, wenn
1. die **Rohantworten archiviert** sind (Archiv unter `data/archive/<run_id>/` vorhanden, Anfrage und Antwort je Suche) und
2. **Stichproben-URLs auflösen** (mindestens einige zitierte Seiten selbst holen; tote oder erfundene Adressen = ablehnen).

Fehlt eines davon, ist der Lauf nicht belegbar: nicht buchen, Befund in der Prüfung festhalten.
