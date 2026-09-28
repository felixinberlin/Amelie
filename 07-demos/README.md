# 07-demos — demos and pitches for tins

Presentation layer only: nothing here changes a tin's claims, verdicts or recipients. Every demo is a mockup and says so on screen.

| Tin | What | Built | What is faked |
|---|---|---|---|
| `altbau-thermal` | 8-slide pitch; interactive demo lives in the app ("Old Building" tab) | 2026-09-19 | Rule-of-thumb U-values, steady state only, no weather year, no floor-plan recognition |
| `agent-postmortem-recorder` | Patch for claude-reflect (4 new files, 340 tests green) + maintainer notes; rendered in the tin's book | 2026-09-24 | Nothing faked — but Windows CI not run here, and clustering is word-based |
| `abbundzeichen-fundbuch` | Sequence checker for carpenters' marks (parser, 5 rules graded only hint/suspicion, JSON export); engine in `src/engine/abbundzeichen-fundbuch/`, 44 tests | 2026-09-27 | Kernel not faked, but all fixtures are synthetic — no published mark register transcribed yet; field mapping to VA 49/1 unverified; static offline page not built |
| `vernichtungs-offenlegungsregister` | Checker for Art. 24 ESPR disclosures on destroyed unsold goods (6 rules phrased as questions, register with only "found" / "no disclosure found (as of, search path)", CSV export); engine in `src/engine/vernichtungs-offenlegungsregister/`, 28 tests | 2026-09-28 | Kernel not faked, but the Annex I schema is provisional (legal text of IR 2026/2 not read, fields are labelled assumptions from secondary sources) and all fixtures are synthetic — Signify FY 2025 not yet transcribed |
