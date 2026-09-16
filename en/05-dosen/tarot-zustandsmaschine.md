# Tarot as a State Machine

**One sentence:** A spread is already a program — positions are slots, cards are typed transitions, meaning is a function of adjacency. It just never got written down that way.

**As of:** September 2026 · **Recheck by:** September 2027
**Recipient:** indie game devs (card-game engines) · secondary: deck artists on crowdfunding platforms, Labyrinthos, education ("state machines for non-programmers")
**Verdict:** 🎁 give away **as a specification**, not as an app — narrowed, see below

---

## The problem

Spreads have been passed down in prose for two hundred years: "Card 1 is the situation, card 2 crosses it, card 3 is the foundation." That's a specification, but an imprecise one — the interesting rules never make it in:

- What does "crosses" mean? A relationship between two slots, with direction and type — never formalized anywhere.
- How does a reversed card change the meaning of its **neighbors**? Every reader knows it does. No system writes it down.
- How does the same spread differ between two decks with different card counts?

The result: every tarot app hardwires its spreads. A new spread means new code. A deck with custom cards means a new app.

Who suffers: deck artists who can't code and want a digital companion for their deck — a whole milieu that crowdfunds decks and then gets stuck on the software. And indie devs who build card mechanics and start from zero every time.

## Why now

The honest part: **this was always possible.** A DSL for spreads could have been written in 2010. What's new is two things:

1. **Translation from prose.** The thousands of spreads described in free text can now be automatically converted into a formal structure — the existing body of work becomes accessible instead of having to be transcribed one at a time.
2. **Interpretation as a function, not a lookup table.** The meaning of a card *in this position, next to this card, in this deck* used to only be possible as prescribed text. Now it can be computed — which is what actually makes the formal structure useful.

## Sketch

A small language, not a product:

- **Slot:** a position with a role, coordinate, optional conditions.
- **Relation:** a directed edge between slots — `crosses`, `supports`, `leads to`, `opposes`. Typed, so a renderer knows how to draw it and an interpreter knows how to read it.
- **Deck contract:** what card count a spread requires, so a 78-card system fails cleanly when a 40-card deck shows up.
- **Modifiers:** how reversal and adjacency change the reading — as a rule, not as prose.
- Two reference implementations: a renderer (layout falls out of the structure) and an interpreter.

**The gift is the JSON schema plus two examples.** Not the app. One page of specification that someone can implement in their own language.

## First step

**Ticket: the Celtic Cross as a file.**

Describe the best-known spread fully formally, including the "crosses" relation, and draw the layout from the file alone.

**Done when:** someone adds a second spread without changing a line of code.

## Where it breaks

**Over-formalization.** Tarot lives on ambiguity; a language that tries to capture every nuance grows bigger than the problem and nobody uses it. The boundary has to be drawn hard: **the DSL describes structure, not meaning.** What a card means stays text, and stays the deck's business.

**Second risk, the milieu:** a technically framed tool can read as disrespectful in this scene — as reducing a practice to a data structure. The framing decides: it's a **notation**, like sheet music for musicians, not a replacement for the practice. Get that framing wrong and you lose exactly the people it's meant for.

## Who's already tried it

Research, September 2026, and it narrows this tin: there are **tarot datasets as JSON**, libraries for generating digital decks, open reflection engines with spreads and journaling, and even websites that collect and compare spreads as **schemas**.

**What I didn't find:** a formal, deck-independent language for spreads with typed relations between positions. The data side (what cards exist) is solved; the structure side (how positions relate) is not.

The gap is narrow. Whoever takes this should check whether the existing schema collections aren't already 80% of the way there — in which case the right move is a contribution there, not a new specification.

## Prior work

- Existing **tarot JSON datasets** — nobody needs to redo the card side.
- **Collections of spread schemas** — the best starting point and possibly the right recipient.
- **Labyrinthos** — a learning app with its own deck and a didactic bent; a notation for spreads is exactly their teaching problem.
- **The indie game scene** — deckbuilder engines are looking for card-as-rule representations.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
