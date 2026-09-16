# Bugs → Spaced Repetition

**One sentence:** Every fixed bug automatically becomes a flashcard — symptom on the front, root cause on the back. After three months you know which error class is really costing you.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** the Anki ecosystem (as an add-on) · secondary: incident/postmortem tooling, bootcamps and team leads
**Verdict:** 🔨 build a skeleton first, then give away — a weekend

---

## The problem

Postmortems get written and never read again. That's not a lack of discipline, it's a format problem: a document that gets read once cannot, by construction, change a habit.

At the same time, the information is fully present and machine-readable. A bugfix commit contains both: the symptom (the test that's now green, the issue, the error message) and the cause (the diff). That's already the front and back of a flashcard. It just never gets flipped.

The actual question nobody can answer: **which error class is costing me the most?** Not by feel, but by count. Off-by-one? Nullable mix-ups? Time zones? Race conditions in this one specific module? After a year of work you have the data and no analysis.

Who suffers: individuals with recurring mistakes; teams where the same class of bug moves through three people; bootcamps that want to teach error culture and only have anecdotes.

## Why now

1. **Turning a diff into a good question is the hard part — and it's solved.** Capturing "what was the root cause here" as a flashcard that still makes sense in three months used to be manual work. That part is now automatable.
2. **Error classification across many commits.** "These seventeen fixes are the same class" is the analysis that carries the actual value, and it used to be unaffordable.
3. **Everything else has existed for decades.** Spaced-repetition algorithms, Anki add-on architecture, git hooks. Only the bridge is missing.

## Sketch

- **Trigger:** a commit recognizable as a fix (convention, closed issue, a test going from red to green).
- **Card:** front = the symptom, as it showed up — error message, test case, observation. Back = the root cause and the line that fixed it, linked to the commit.
- **Classification:** every card gets an error class. Over months that produces a sorted list: *this* is what's costing you the most.
- **Export to Anki** instead of a custom learning app. The repetition logic is a solved problem, nothing to gain by rebuilding it.
- **Curation is mandatory:** not every fix is worth a card. Propose, human confirms. Automatically generated decks don't get studied.

**Not included:** no custom learning app, no team leaderboard, no productivity metric.

## First step

**Ticket: ten fix commits, ten cards.**

A script over a repo's own git history: find fix commits, propose cards, export as an Anki deck.

**Done when:** you can't answer three of the ten cards on the first try after four weeks. If you can answer all of them, they were the wrong bugs.

## Where it breaks

**The risk that this turns into a surveillance metric.** The moment a team lead sees "error classes per person," the tool becomes an evaluation instrument, and nobody writes honest commit messages anymore. That's not an edge case, it's the most likely way something like this arrives inside companies. **Countermeasure baked into the design: cards are personal and local. No team dashboard. Aggregated classes only when a human deliberately shares them.**

**Second risk:** the deck sprawls. Nobody studies two hundred cards from a year of commits. So classification matters more than the individual card — the value is in "three classes cost you 60% of your debugging time," not in two hundred individual cases.

**Third risk:** many bugs aren't instructive. A typo isn't a lesson. The proposal threshold has to be high; better too few cards than too many.

## Who's already tried it

Research, September 2026: the **spaced-repetition ecosystem is large and mature** — Anki and numerous alternatives, terminal clients, plugin architectures. There are guides on how programmers use Anki to learn code.

**I didn't find the bridge from git history to flashcard.** Every existing tool assumes a human writes the card — and that's exactly where it fails, because after a bugfix nobody feels like making flashcards. **The value is in automating the exact moment you're least motivated.**

## Prior work

- **Anki** — open add-on architecture, largest user base, documented export formats. Don't rebuild, plug in.
- **Incident/postmortem tooling** — owns the error data and the postmortem ritual, but no learning loop afterward. A company, reachable without code.
- **Bootcamps and team leads** — "our three most expensive error classes this quarter" is onboarding material nobody else has.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
