---
name: amelie-orchestrator
description: Orchestriert eine vollständige Amélie-Teamrunde mit allen Skills und Agenten — drei Entdeckungs-Engines parallel (ideen-scout, bisoziations-kollider, inversions-agent), Konvergenz-Merge, unabhängiger Reviewer, Packer, Demo-Builder und Bibliothekar — von der Themenwahl bis zum grünen Lint/Test und Commit. Use whenever the user asks for an agent orchestration, a team round, "alle Agenten", "alle Skills", "Orchestrierung", "Teamrunde", "full pipeline", or wants new ideas worked end-to-end rather than one method alone.
---

# Amélie — Orchestrator (Teamrunde)

Eine Teamrunde ist die Holz-Runde (27.09.2026) als wiederholbares Verfahren. Dort zeigte sich: drei Engines auf **ein** Thema ergeben eine **Konvergenzprobe** — ein Doppelfund ist ein stärkeres Signal als jeder Einzelscore. Diese Skill macht daraus einen festen Ablauf mit klaren Schreibrechten, damit parallele Agenten sich nicht gegenseitig die Zustandsdateien überschreiben.

## Das Team

| Rolle | Agent (`.claude/agents/`) | Skill | Darf schreiben |
|---|---|---|---|
| Orchestrator | — (Hauptsitzung) | diese | Rundenplan, Merge-Tabelle (Scratchpad), Projektstand in `AGENTS.md`, Commit |
| Engine 1 | `ideen-scout` | `amelie-ideenrunde` | nichts (liefert Text) |
| Engine 2 | `bisoziations-kollider` | `lacunar-bisociation` | `06-suche/amelie-bisoziation-log.md` |
| Engine 3 | `inversions-agent` | `asymmetric-inversion` | `06-suche/amelie-inversions-log.md` |
| Prüfer | `idea-reviewer` | `idea-reviewer` | `06-suche/amelie-classification-log.md` |
| Packer | `dose-packer` | `dose-packer` | `05-dosen/`, `en/05-dosen/`, `src/data/dosen.ts` (`DOSEN_DATA`), `scripts/dosen-review-metadata.json`, `public/data/`, die eine Gepackt-Zeile im Prüfprotokoll |
| Gerüstbauer | `demo-builder` | `demo-builder` | `07-demos/<id>/`, `07-demos/README.md`, `src/engine/<id>/`, `src/data/doseBooks.ts` |
| Gedächtnis | `bibliothekar` | — | Prüfprotokoll, Playbook, Quellen, `08-friedhof/`, `DISCARDED_DATA` in `src/data/dosen.ts` |

**Eine Datei, ein Schreiber.** Das ist die wichtigste Regel dieser Skill. Parallel laufen nur Agenten mit disjunkten Schreibrechten.

Wenn die Agenten-Definitionen in der laufenden Sitzung nicht als `subagent_type` verfügbar sind (sie werden beim Sitzungsstart geladen), startet der Orchestrator `general-purpose`-Agenten und gibt ihnen als erste Anweisung: „Lies `.claude/agents/<rolle>.md` und handle danach."

## Ablauf

```
Phase 0  Vorflug (Orchestrator)  ─ Retro lesen, Thema wählen, Netz prüfen, Friedhofsgang, Baseline lint/test
Phase 1  Entdeckung (parallel)   ─ ideen-scout ‖ bisoziations-kollider ‖ inversions-agent
Phase 2  Konvergenz-Merge        ─ Orchestrator: deduplizieren, Doppelfunde markieren, gegen Protokoll/Atlas halten
Phase 3  Review                  ─ idea-reviewer auf alle frei/verengt-Kandidaten
Phase 4  Verpacken (optional)    ─ dose-packer, dann demo-builder, je Dose Ready (max. 1–2 pro Runde)
Phase 5  Gedächtnis              ─ bibliothekar (nach Phase 4: teilt src/data/dosen.ts mit dem Packer)
Phase 6  Abschluss               ─ Orchestrator: npm run lint && npm test, Commit, Push, Bericht
```

### Phase 0 · Vorflug

1. **Retro lesen:** letzte Retro in `06-suche/amelie-suchplaybook.md` sowie in Inversions- und Bisoziations-Log. Ein „Nächstes Mal"-Punkt, der schon zweimal übertragen wurde, hat Vorrang vor freier Themenwahl.
2. **Thema wählen:** Vorgabe des Nutzers, sonst der älteste offene Retro-Punkt. Vorher gegen den Besetzungsatlas halten — ein `dicht`-Feld ist kein Rundenthema (Runde 14 Cannabis: 0 frei).
3. **Netz prüfen** (Holz-Retro): `curl -s -o /dev/null -w '%{http_code}' <Behörden-URL>`. Bei `000` gilt: Engines markieren jede Evidenz als `[Schnipsel]`, WebFetch zusätzlich versuchen, und der Bericht sagt es ausdrücklich.
4. **Förderlandschaft:** `06-suche/amelie-foerderlandschaft.md` nach Geldgebern und Preisen zum Thema durchsehen (geförderte Projekte = Besetzt-Signal, Ausschreibungstexte = Problemquelle, Preisträger/Programmbüros = Empfänger). Treffer gehen als Hinweis in alle Engine-Prompts; Abschnitt „Fristen" im Katalog auf abgelaufene Einträge prüfen.
5. **Friedhofsgang:** `08-friedhof/README.md` — Todesursachen, die zum Thema passen, gehen als Warnliste in alle Engine-Prompts.
6. **Baseline:** `npm run lint && npm test` grün, sonst erst reparieren oder melden.

### Phase 1 · Entdeckung

Drei Agenten **in einer Nachricht** starten, gleiches Thema, gleiche Warnliste, verschiedene Methode. Jeder Prompt enthält: Thema, Rundenname, Datum, Warnliste, Netzstatus, Schreibrechte, Rückgabeformat (siehe Agenten-Definitionen). Nicht vorab Ideen vorgeben — das würde die Konvergenzprobe entwerten.

### Phase 2 · Konvergenz-Merge

Eine Tabelle über alle Kandidaten:

| Kandidat | Engines | Doppelfund? | Urteil(e) | Evidenz | → Reviewer? |

- Gleiche Idee in anderem Kleid = ein Kandidat; alle Engines nennen.
- Abweichende Urteile (eine Engine `frei`, eine `besetzt`) → das strengere gilt, bis der Reviewer entscheidet.
- `besetzt` geht nicht zum Reviewer, sondern direkt zum Bibliothekar.

### Phase 3 · Review

Ein `idea-reviewer` bekommt die Merge-Tabelle plus alle Belege. Ergebnis je Kandidat: `Dose Ready` · `Needs Research` · `Baustein von <dose>` · `Friedhof`.

### Phase 4 · Verpacken

Nur bei `Dose Ready` und Summe ≥ 24/35. Höchstens eine, ausnahmsweise zwei Dosen pro Runde (GOVERNANCE: 15 scharfe Dosen > 500 Notizen). Packer und Demo-Builder laufen **nacheinander** (der Builder braucht die Dose-`id` und das Dossier).

### Phase 5 · Gedächtnis

Läuft **nach** dem Packer, weil Gräber in `DISCARDED_DATA` (`src/data/dosen.ts`) stehen und der Packer dieselbe Datei bearbeitet. Ohne Phase 4 darf er direkt nach Phase 3 starten.

Der Bibliothekar bekommt: Merge-Tabelle, Reviewer-Urteile, Engine-Retros, Netzstatus. Er schreibt Protokoll, Playbook (Trefferquote, Atlas, Retro), Quellen und Friedhof. Die Retro enthält einen Abschnitt **„Orchestrierung"**: Was hat die Parallelität gebracht (Doppelfunde, Widersprüche), was hat sie gekostet.

### Phase 6 · Abschluss

1. `npm run lint && npm test` — beide grün, sonst zurück an den zuständigen Agenten.
2. Diff lesen: Hat ein Agent außerhalb seiner Schreibrechte geschrieben? Rückgängig machen.
3. Commit (ein Commit pro Phase ist gut lesbar), Push auf den Arbeitszweig.
4. Bericht an den Nutzer: Zahlen (geprüft / frei / verengt / unklar / besetzt), Doppelfunde, Dosen, Gräber, offene Punkte, Evidenz-Warnung falls `[Schnipsel]`. **Keine Mail wird versendet** — Zustellung bleibt Félix' Entscheidung.

## Stoppregeln

- Jede Engine liefert 0 `frei`/`verengt` → Thema ist dicht: Atlas-Eintrag, keine Phase 3/4, trotzdem Phase 5.
- Reviewer findet keine `Dose Ready` → das ist ein Erfolg, kein Fehler (GOVERNANCE §4). Kein Packen erzwingen.
- Ein Agent schreibt eine fremde Datei → Änderung verwerfen, in der Retro vermerken.
