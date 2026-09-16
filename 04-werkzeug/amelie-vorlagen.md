# Amélie — Vorlagen

Alles, was du brauchst, um eine Idee in zwanzig Minuten zu verpacken und loszuwerden.

---

## 1. Die Dose (der Einseiter)

*Benannt nach der Blechdose hinter der Fliese: sie war vierzig Jahre wertlos, weil niemand wusste, wem sie gehört.*

Dateiname: `ideen/<slug>.md` im Repo. Eine Seite, nicht mehr. Wenn es zwei werden, ist Teil 3 zu lang.

```markdown
# <Name>

**Ein Satz:** <Was es ist, ohne Adjektive.>
**Stand:** <Datum> · **Prüfen ab:** <Datum + 12 Monate>

## Das Problem
<Wer leidet, woran, wie oft. Namen von Rollen, keine „man könnte".
Zwei bis vier Sätze. Wenn du hier nicht konkret wirst, ist die Idee nicht reif.>

## Warum das jetzt geht
<Was bis vor kurzem zu teuer oder zu unzuverlässig war und heute nicht mehr.
Das ist der Teil, für den dich jemand liest — deine eigentliche Recherche.>

## Skizze
<Architektur in fünf Zeilen oder einem Kasten. Genug, dass ein Fachmensch nickt.
Explizit: was NICHT dazugehört.>

## Erster Schritt
<Das eine Ticket, mit dem man Montag anfängt, inkl. „fertig wenn".>

## Wo es kippt
<Das Risiko, das das Projekt killt, und die einzige Gegenmaßnahme, die du kennst.
Dieser Abschnitt macht dich glaubwürdig. Nie weglassen.>

## Wer es schon versucht hat
<PFLICHT. Was existiert bereits, von wem, wie weit? Wenn es die Idee schon gibt:
Dose entsorgen, nicht schönreden. Wenn es sie halb gibt: Prämisse verengen und
das offenlegen. Dieser Abschnitt ist der Unterschied zwischen einem Geschenk und
einer Blamage.>

## Vorarbeit
<Paper, Repos, APIs, Datenquellen, die es schon gibt. Verlinkt.>

---
Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir
nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du
nicht bauen wirst, gib sie jemandem, der es tut.
CC0 / Public Domain. — Félix, Berlin · <link>
<optional, bei patentgefährdeten Ideen:>
Defensiv publiziert auf TDCommons am <Datum>: <DOI/Link> — damit ist das hier
Stand der Technik und niemand kann es mehr einzäunen.
```

---

## 2. Kaltmail an eine Organisation (deutsch)

Betreff: **Idee zu verschenken: <Name> — <Problem in vier Wörtern>**

```
Hallo <Name>,

ich recherchiere Apps, die erst seit Kurzem technisch möglich sind, baue aber
nur wenige davon selbst. Diese hier passt zu euch, nicht zu mir, also schenke
ich sie euch.

<Ein Satz: das Problem, das SIE haben oder lösen wollen.>
<Ein Satz: was die Idee tut.>
<Ein Satz: warum ausgerechnet ihr — Bezug auf ein konkretes Projekt von ihnen.>

Eine Seite mit Skizze, erstem Ticket und der Stelle, an der es schiefgeht:
<Link>

Keine Bedingungen, CC0. Wenn ihr längst dran seid: ignoriert das hier einfach,
ich melde mich nicht nochmal.

Viele Grüße
Félix
<Link auf das Repo>
```

**Warum das funktioniert:** benennt die Motivation sofort (kein Vertrieb), macht den Bezug konkret, legt die Arbeit in den Anhang statt in die Mail und gibt explizit die Erlaubnis, nicht zu antworten. Letzteres ist der Satz, der die Antwortquote hebt.

---

## 3. Cold mail to a company or lab (English)

Subject: **Free idea: <Name> — <problem in four words>**

```
Hi <Name>,

I research apps that only became possible in the last couple of years, and I
build maybe one in twenty. This one belongs with you, not with me, so it's
yours.

<One sentence: the problem, framed as theirs.>
<One sentence: what the idea does.>
<One sentence: why you specifically — reference something they actually shipped.>

One page with the sketch, the first ticket, and the part most likely to kill it:
<link>

CC0, no strings, no follow-up. If it's already on your roadmap, just ignore this.

Félix, Berlin
<link>
```

---

## 4. GitHub Discussion (für Firmen-Repos wie spec-kit, GitLens, Renovate)

> **Titel:** Idea, free to take: <Name>
>
> Not a feature request and not something I'm asking anyone to build for me — I
> research ideas like this and give away the ones I won't build.
>
> **Problem:** …
> **Why now:** …
> **Sketch:** …
> **First step:** …
> **Where it breaks:** …
>
> CC0. Happy to answer questions, won't be following up.

**Nie** in Repos einzelner unbezahlter Maintainer posten, außer du bringst einen PR mit. Siehe Manifest.

---

## 5. Repo-README (`felixinberlin/amelie`)

```markdown
# Amélie

*Ideen, die jemand anderem gehören.*

Apps, die es ohne die letzten Jahre KI-Fortschritt nicht geben könnte. Ich finde
mehr davon, als ich bauen kann — ungefähr eine von zwanzig baue ich. Die anderen
neunzehn liegen hier, und zu den meisten steht dabei, wem sie vermutlich gehören.

**Nimm sie.** CC0, keine Bedingungen, keine Nennung nötig. Wenn du eine baust,
freue ich mich über eine Zeile, brauche sie aber nicht.

Jede Idee ist eine Datei in `ideen/` und ein Issue mit Label `up-for-grabs`:
Problem, warum es jetzt geht, Skizze, erstes Ticket, und wo es kippt. Dazu ein
Datum — „warum es jetzt geht" ist eine Behauptung mit Haltbarkeit. Was nicht
mehr stimmt, wird gelöscht statt archiviert.

Dieses Repo ist ein Archiv, keine Zeitschrift. Die Ideen werden einzeln an
Leute geschickt, für die sie passen; hier liegen sie nur, damit sie eine
dauerhafte Adresse haben.

Was hier NICHT steht: die zwei, die ich selbst baue.
```

Issue-Template: Titel = Ideenname, Body = Einseiter, Labels: `up-for-grabs`,
Größe (`S`/`M`/`L`), Domäne (`tooling`, `physik`, `berlin`, `kultur`).
Wenn jemand eine nimmt: Issue schließen mit Link auf das entstandene Repo. Die
geschlossenen Issues sind später der Beweis, dass das Ganze funktioniert.

---

## 6. Antragskurzfassung (Prototype Fund & ähnliche Töpfe)

Fördertexte fragen fast immer dasselbe. Wenn der Einseiter steht, ist das eine
Stunde Arbeit:

| Feld im Antrag | Kommt aus dem Einseiter |
|---|---|
| Problembeschreibung | *Das Problem* |
| Stand der Technik / Abgrenzung | *Vorarbeit* + *Warum das jetzt geht* |
| Lösungsansatz | *Skizze* |
| Arbeitsplan, 6 Monate | *Erster Schritt* + Phasenliste |
| Risiken | *Wo es kippt* |
| Gesellschaftlicher Nutzen | neu schreiben — der einzige echte Zusatz |
| Open-Source-Lizenz | steht schon drunter |

Du musst nicht selbst beantragen. Ein Hinweis an die passende Organisation
(„falls ihr jemanden sucht, der das baut: hier ist der Topf, Bewerbung ab
1. Oktober") ist oft der wertvollere Teil des Geschenks.

---

## 7. Checkliste vor dem Abschicken

- [ ] **Existenzprüfung gemacht — gibt es das Ding schon?** (Eine Stunde Suche, *bevor* die Dose geschrieben wird. Von 19 Ideen waren vier bereits gebaut.)
- [ ] **Hat der Empfänger es selbst schon gebaut?** (Die EnergyMap-Lektion: eine Mail, die ihre eigene Arbeit übersieht, ist der schlechteste denkbare Erstkontakt.)
- [ ] Steht in der Mail, warum ich das verschenke? (Sonst klingt es nach Vertrieb.)
- [ ] Ist der Bezug zum Empfänger konkret — ein Projekt, ein Produkt, ein Paper?
- [ ] Ist „Wo es kippt" drin?
- [ ] Ist der Empfänger eine Firma, Forschung, ein Topf oder eine Community — und **kein** unbezahlter Einzelmaintainer? (Falls doch: liegt Code bei?)
- [ ] Steht die Lizenz drunter — **und mein Name**? (Bedingungslos heißt nicht anonym.)
- [ ] Steht ein Datum in der Dose?
- [ ] Bei Hardware-/Verfahrensideen: defensiv publiziert, bevor sie rausgeht?
- [ ] Steht drin, dass sie nicht antworten müssen?
- [ ] Eintrag in der Statusliste auf `zugestellt` gesetzt?
- [ ] Kein Nachfassen geplant. Wirklich nicht.
