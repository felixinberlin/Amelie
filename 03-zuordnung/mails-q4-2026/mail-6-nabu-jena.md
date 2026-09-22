# Mail 6 — Glasanflug-Ampel → NABU Jena (Upstream des Vogelschlagmelders)

**Status: ENTWURF, nicht gesendet.**
**An:** Kontaktweg von nabu-jena.de kopieren oder Issue im Codeberg-Repo `nabu-jena/Vogelschlagmelder` — Adresse nicht raten.
**Betreff:** Modul zum Mitnehmen: LAG-VSW-Bewertung als Regeldatei plus Funktion (CC0)
**Dose:** `05-dosen/glasanflug-ampel.md` · **Code:** `04-werkzeug/glasanflug-ampel/`
**Regel 4:** Einzelmaintainer, unbezahlt. Diese Mail geht nur mit Code — der liegt bei.

---

Hallo Herr Schätz,

kurz und ohne Feature-Wunsch: Ich habe etwas gebaut, das zu Ihrem Melder passen könnte, und lege es Ihnen hin, ohne dass daraus eine Verpflichtung entsteht.

Der Vogelschlagmelder sammelt pro Meldung Fotos, Fassadenausrichtung und Adresse. Das sind fast genau die Eingangsgrößen, nach denen das Bewertungsschema der Vogelschutzwarten fragt (Beschluss 21/01, Stand 2023) — vier Kriterien mit je 1 bis 4 Punkten, Summe 4 bis 16, drei Risikostufen. Nur ist das Schema bisher ein PDF.

Beigelegt: das Schema als Regeldatei mit den Wortlauten und einer Versionsangabe, eine reine Funktion, die daraus Punktsumme, Stufe und Begründung rechnet, und eine Testsuite mit allen elf durchgerechneten Beispielen aus dem Anhang des Beschlusses. Python, einzige Abhängigkeit ist YAML, keine Bilderkennung, CC0 — also in einem GPLv3-Projekt verwendbar.

Zwei Sachen, die beim Nachrechnen auffielen und die Sie vielleicht interessieren. Erstens: Der Anhang rechnet elf Gebäude durch, und bei einem stehen die Gebäudefaktoren 3 und 3 und darunter „Summe 7". Folgenlos für die Risikostufe, aber ein Argument dafür, das Addieren der Software zu überlassen. Zweitens: Wenn Glasanteil 4 und Fassadengestaltung 1 zusammentreffen, fordern die beiden Vorrangregeln des Schemas das Gegenteil voneinander, und der Beschluss regelt den Fall nicht. Mein Rechner entscheidet ihn deshalb auch nicht, sondern meldet ihn.

Was daraus werden könnte, steht auf einer Seite: <Link>. Kurzfassung: Die drei Situationsfaktoren ließen sich aus den Fotos schätzen, die Sie ohnehin haben — der Glasanteil ist in der Gebäudeenergie-Forschung als Fenster-Wand-Verhältnis aus Straßenbildern schon gelöst. Aus der Meldung würde damit ein prüfbares Blatt für den Eigentümer statt einer Zeile in der Statistik.

Wenn das nicht in Ihre Richtung passt oder Sie schlicht keine Zeit haben: völlig in Ordnung, ich fasse nicht nach. Der Code liegt unter CC0 und wartet nicht auf mich.

Viele Grüße
Félix
