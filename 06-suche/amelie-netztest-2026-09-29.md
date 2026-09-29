# Netztest Cloud-Sitzung (29.09.2026)

Getestet mit `curl` über den Agent-Proxy der Cloud-Umgebung, User-Agent `Mozilla/5.0 AmelieResearch/1.0`. Geprüft wurden Status, Größe und bei den Social-/Trend-Quellen auch der Inhalt. Bei den Behörden-Seiten wurden nur Status und Größe geprüft, nicht der Text. Evidenz ist eine Momentaufnahme. Das Register (`src/data/quellen.json`) ist nicht verändert; Nachzug über den Bibliothekar (`npm run quellen -- rate|log`).

## 1. Trending / „most growing" auf GitHub

| Weg | Ergebnis |
|---|---|
| `github.com/trending`, `api.github.com/search/...`, `github.com/topics/...`, `github.com/search` direkt | **403**, Sitzung ist an das eigene Repo gebunden |
| **`https://r.jina.ai/https://github.com/trending`** (auch `?since=weekly`, `/python?since=monthly`) | **funktioniert**: Markdown mit Repos, Sprache, Gesamt-Sterne, Forks und **„N stars today"** |
| `trendshift.io` | 200, Trend-Rangliste (Repo-Namen im HTML) |
| `gitstar-ranking.com/repositories` | 200, nur Allzeit-Ranking (kein Wachstum) |
| `api.ossinsight.io/v1/trends/repos` | 200, aber **leere Zeilen** (`row_count: 0`) |
| `gitterapp`, `gh-trending-api` (herokuapp) | 404, tot |
| `hf.co/api/models?sort=trendingScore` | 200, Hugging-Face-Trending als JSON |
| `hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=created_at_i>…` | 200, Show HN der letzten 7 Tage mit Punkten |
| `registry.npmjs.org/-/v1/search`, `api.npmjs.org/downloads`, `crates.io/api`, `pypi.org/pypi/<x>/json` | 200 (Registries, keine Trendliste) |
| `raw.githubusercontent.com/<beliebig>/...` | 200 (Dateien fremder Repos lesbar) |
| `star-history.com` API | 403 („GitHub refused access") |

**Empfehlung:** Jina-Reader für Trending nutzen, mit `since=daily|weekly|monthly` und Sprachpfad. Beispiel der Ausgabe (Stichprobe): `debpalash/VoiceStudio` (3.221 Sterne heute), `paperclipai/paperclip` (3.197), `vectorize-io/hindsight` (4.561). Ergänzend `trendshift.io`, HN-Algolia und Hugging Face.

Vorbehalt: Jina ist ein Drittdienst; abgerufene URL und Suchbegriffe gehen dorthin. Für private oder sensible Ziele nicht nutzen.

## 2. Reddit (r/SideProject u. ä.)

| Weg | Ergebnis |
|---|---|
| `www.reddit.com/r/<sub>/top.rss?t=week`, `new.rss` (Atom) | **funktioniert**: 25 Einträge mit Titel, Datum. **Streng ratenbegrenzt** (Header `x-ratelimit-remaining: 0`, Reset ca. 50 s). Bei schnellen Folgeabrufen **429** |
| `.json`, `api.reddit.com` | **403** („blocked by network security") |
| `old.reddit.com/r/<sub>/top/` | 200, aber **Startseiten-Platzhalter** („Welcome to Reddit"), kein Subreddit-Inhalt, für alle Subs gleich |
| `r.jina.ai/https://www.reddit.com/...` | 403 |
| `reddit.com/search.rss`, Kommentar-Feeds | 429/nicht zuverlässig |

Erfolgreich mit Inhalt gelesen (jeweils in der Sitzung): r/SideProject (`top`), r/startups (`top`, `new`), r/ClaudeCode (`top`), r/SaaS (`new`), r/AppIdeas (`new`), r/opensource (`top`), r/coolgithubprojects (`top`). Bei r/indiehackers, r/selfhosted, r/ClaudeAI, r/webdev, r/programming, r/Entrepreneur, r/civictech, r/opendata, r/germany, r/de, r/LocalLLaMA, r/MachineLearning, r/datasets kam nur 429. **Das ist ein Rate-Limit, keine Sperre**; Erreichbarkeit dort ist ungeklärt, nicht verneint.

**Empfehlung für eine Reddit-Ansicht:** pro Subreddit ein RSS-Abruf, **etwa 1 Abruf pro 65 s, streng seriell**, Ergebnisse cachen (z. B. nächtlicher Lauf, JSON in `public/data/`). Der Feed liefert **keine Scores**; Ranking nur über `top.rss?t=week|month` (die Reihenfolge ist das Signal). Das Limit gilt offenbar für die gemeinsame Proxy-IP und ist damit nicht sicher planbar. Kein Live-Abruf aus dem Browser der Nutzer.

## 3. Weitere Social-/Trend-Quellen (Typ X)

| Quelle | Ergebnis |
|---|---|
| Hacker News (`news.ycombinator.com`, Firebase-API, Algolia) | 200, JSON |
| Lobsters `lobste.rs/hottest.json` | 200, JSON |
| dev.to API | 200, JSON |
| Stack Exchange API | 200, JSON |
| Mastodon `mastodon.social/api/v1/trends/links` | 200, JSON |
| Bluesky `bsky.app` | 200 (nur Startseite geprüft) |
| X `x.com`, YouTube, indiehackers.com | 200 (nur Startseite, ohne Login kaum Inhalt) |
| arXiv `list/cs.AI/recent` | 200 |
| Product Hunt, GitLab (explore), npmjs.com/browse | **403** Cloudflare-Challenge |
| Codeberg explore | 200, aber Redirect-Stub |
| grep.app | 429 |
| Google/Bing HTML-Suche | 200, Ergebnislinks nicht extrahierbar (nicht zuverlässig) |

## 4. Behörden und Normtexte

Mit `curl -L` liefern 200 mit HTML: bafa.de, baua.de, osha.europa.eu, bundeswirtschaftsministerium.de (bmwk.de leitet um), lfu.bayern.de, dibt.de, bge.de, deneff.org (leitet auf ohne `www`), dazu direkt bgbau.de, gesetze-im-internet.de, bundestag.de, umweltbundesamt.de, igbauernhaus.de. Ausnahmen:

* `thuenen.de`: 302 auf sich selbst, 138 Byte, kein Inhalt.
* `bgr.bund.de`: 400 mit Cookie-Check-Weiterleitung (Cookie-Jar nicht versucht).
* eur-lex Volltext-URL: 202, 0 Byte (WAF-Challenge).
* `publications.europa.eu/resource/celex/<CELEX>`: 200, aber nur RDF-Metadaten. Der Cellar-Zugriff mit `Accept: text/html` ist nicht getestet.

Die früheren Sperrvermerke (lfu.bayern.de, thuenen.de, eur-lex, duh.de) sind damit teils überholt. Inhalt wurde nicht gelesen, nur Status und Größe.

## 5. Konsequenz fürs Register

* Typ X ist nicht mehr pauschal „Egress gesperrt": Reddit-RSS, HN, Lobsters, dev.to, Mastodon, Hugging Face und Trending über Jina sind erreichbar. Q1–Q6 bleiben `basis: auto`; bewertet wird erst, wenn eine Runde die Quelle wirklich anfasst.
* Offen: Cellar-Text für ESPR/DVO, BGR mit Cookie-Jar, Tiefe der Reddit-Abdeckung (Rate-Limit), Verifikation, ob `r.jina.ai` dauerhaft nutzbar ist.
