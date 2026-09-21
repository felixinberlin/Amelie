# Mail 4 — Beobachtungsposten mit Übergabe → CityLAB Berlin

**Status: ENTWURF, nicht gesendet.** Félix entscheidet, ob und wann.
**An:** info@citylab-berlin.org — dieselbe allgemeine Adresse wie Mail 2; die Kontaktseite nennt sie ausdrücklich für Projektideen und leitet intern weiter.
**Betreff:** Eine Idee zu verschenken: was mit einer Patenschaft passiert, wenn niemand mehr gießt

**Vor dem Senden — drei Dinge, ohne die die Mail nicht raus darf:**
1. **Issues und Discussions von `technologiestiftung/giessdenkiez-de` von Hand durchsehen.** In der Recherchesession waren sie nicht lesbar (GitHub-API gesperrt, Issue-Seiten per robots.txt untersagt). Wenn das Thema dort bereits diskutiert wird, gehört der Hinweis in die Mail — sonst wirkt sie wie ungefragte Belehrung.
2. **Dose-Link prüfen** (Datei muss auf `main` liegen).
3. Zeitpunkt: Mail 2 ging am 21.09.2026 an dieselbe Adresse. **Nicht hinterherschicken.** Mindestens einige Wochen Abstand, sonst ist es Nachfassen unter anderem Namen — und das verbietet Regel 3.

**Nicht erwähnen:** Prototype Fund. Geprüft am 20.09.2026: nur Freiberufler:innen/Selbstständige und GbR sind antragsberechtigt, eine Stiftung nicht.

---

Hallo CityLAB-Team,

ich recherchiere Software-Ideen und verschenke die, die ich nicht selbst baue. Diese hier ist bei Ihnen entstanden, beim Lesen Ihres Codes, und gehört deshalb Ihnen.

In Gieß den Kiez steht über das Adoptieren: „lässt Du Deine Nachbarschaft wissen, dass für diese Bäume gesorgt wird. So gelingt ein koordiniertes Engagement." Das ist ein Versprechen an die Nachbarschaft, und ich finde es richtig so formuliert.

Mir ist aufgefallen, dass dieses Versprechen nie zurückgenommen wird. Im Adoptions-Store gibt es `adoptTree` und `unadoptTree`, und `unadoptTree` muss die Patin selbst auslösen. Wer wegzieht, krank wird oder es schlicht vergisst, hinterlässt einen Baum, der auf der Karte als versorgt markiert bleibt. Über Jahre sammelt sich das an: Je länger das Projekt läuft, desto mehr Marken stehen für eine Fürsorge, die es nicht mehr gibt — und desto schwerer wird es, den Baum zu finden, der wirklich jemanden braucht.

Die Idee ist ein Zustand zwischen „betreut" und „nie dagewesen": Der Posten altert sichtbar und wechselt irgendwann auf „sucht Nachfolge". Nicht die Person läuft ab — der Baum meldet sich. Und wer übernimmt, führt dieselbe Reihe weiter, statt bei null anzufangen.

Der erste Schritt braucht keine KI und keine neue Datenquelle: Die Gießvorgänge haben bereits Zeitstempel. Das Signal liegt in Ihrer Datenbank, es wird nur nicht ausgewertet.

Drei Dinge, die ich beim Nachdenken dazugelernt habe und die Ihnen Arbeit sparen könnten:

Erstens ist Ihre Adoption **nicht exklusiv** — mehrere Menschen können denselben Baum adoptieren, die Oberfläche sagt das auch. Altern darf deshalb nicht die Patenschaft einer Person, sondern die Versorgung des Baums. Wer das verwechselt, baut eine Funktion, die niemandem hilft.

Zweitens kippt die Sache sofort ins Unangenehme, wenn der Verfall am Menschen hängt statt am Baum. „Deine Patenschaft läuft ab" vertreibt genau die Leute, die man halten will.

Drittens, weil es die naheliegende Erweiterung ist und ich sie ausdrücklich **nicht** vorschlage: Man könnte daraus einen Wettbewerb machen — andere fordern die Patenschaft heraus, es gibt eine Verteidigungsfrist. Die Mechanik ist aus Standortspielen bestens erprobt. Sie richtet sich dort gegen virtuelle Objekte, hier würde sie sich gegen Ehrenamtliche richten. Ich halte das für den Punkt, an dem die Idee schlecht wird.

Meine Hausaufgaben, offen auf den Tisch: Nature's Notebook (USA National Phenology Network) kann eine Übergabe — aber auf Gruppenebene und nur, solange die scheidende Person sie vorher auslöst. Genau der Fall, um den es geht, ist damit nicht gelöst: Aufhören ist das Gegenteil von Handeln. GrowApp (GLOBE Niederlande) hat das technische Herzstück für den zweiten Schritt bereits gebaut — die neue Aufnahme wird am halbtransparenten vorigen Foto ausgerichtet —, bindet die Reihe aber ans Nutzerkonto.

Eine Seite mit Skizze, erstem Ticket und den vier Stellen, an denen es kippt:
https://github.com/felixinberlin/Amelie/blob/main/05-dosen/fugenduell-patenschaft.md

CC0, keine Bedingungen, keine Nennung nötig. Eine Antwort ist nicht nötig, ich fasse nicht nach. Falls das bei Ihnen längst als Issue steht, ignorieren Sie die Mail bitte einfach — dann habe ich nur schlecht gesucht.

Viele Grüße
Félix
Berlin · github.com/felixinberlin/Amelie
