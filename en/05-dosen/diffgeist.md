# Diffgeist

**One sentence:** Not a changelog for everyone, but the part your code actually calls — "React 20 changes X, you use X in four places, here they are."

**As of:** September 2026 · **Recheck by:** March 2027 (fast-moving field)
**Recipient:** Andrew Nesbitt / Ecosyste.ms · secondary: Renovate (Mend), Socket.dev
**Verdict:** 🎁 give away — rank 2/5, no code needed

---

## The problem

Release notes are written for an anonymous audience. For you, 95% of it is irrelevant and the remaining 5% is critical — but which 5%, nobody says.

The result is the usual behavior: nobody reads them. Dependabot and Renovate PRs get merged because the tests are green, and the one behavioral change your tests don't cover goes through. That's not negligence, it's a rational response to a bad format.

Who suffers: any team with more than fifty dependencies — so, every team.

## Why now

Three things had to come together, and that's only recently been the case:

1. **Release notes can now be reliably broken down into statements.** Extracting "what changed, which symbol is affected, is it breaking" from prose is robust enough today for an automated run — it used to be heuristics applied to headings.
2. **Call-graph analysis is cheap.** "Do you call this API, and where" gets answered in seconds per repo.
3. **The ecosystem data layer exists openly.** Without an open source of package metadata and releases across all registries, the data-acquisition part would be more expensive than the actual idea. Ecosyste.ms has built exactly this layer.

The combination is the point: only once all three are cheap does a personalized changelog per repo and update become worthwhile.

## Sketch

- Trigger: a dependency-update PR (Renovate/Dependabot) or a manual run.
- Step 1: fetch the release notes for the affected version(s) and break them into individual changes, each with the affected symbol and severity.
- Step 2: search the repo for actual usage of exactly these symbols.
- Step 3: post the **intersection** as a comment on the PR — "three of 47 changes affect you, here's where."
- An empty intersection is also a result: "none of these changes touch code you call" is the most valuable message there is.

**Not included:** no custom update bot. This is a complement to Renovate, not competition.

## First step

**Ticket: one language, one package, one PR comment.**

For JS/TS: fetch a package's release notes, extract symbols, search the repo for imports and calls of those symbols, output the result as Markdown.

**Done when:** on a real major update of a popular package, the output is shorter than the release notes and nothing relevant is missing. The test is recall, not elegance: better one irrelevant change too many than one relevant one too few.

## Where it breaks

**False negatives are fatal, false positives are merely annoying.** If the tool misses a breaking change, it's worse than having no tool — it creates trust that isn't backed up. So the threshold has to be deliberately generous, and the tool has to say what it *couldn't* check (dynamic calls, reflection, transitive dependencies).

**Second risk:** transitive dependencies. The dangerous changes often sit three levels down, where you can't see the call. Honest scope: v1 handles only direct dependencies.

## Who's already tried it

Research, September 2026, re-checked 19 Sept 2026: changelog tooling is a large market, and almost all of it revolves around **generating** changelogs for your own product. The reverse direction — filtering someone else's changelog against your own usage — is now taken by **security/SCA vendors**, though: **Aikido** (“Upgrade impact analysis”) assesses breaking changes from library changelogs and scans the codebase for usage; the pull request names the affected files and lines (JavaScript, Python, Java, Go, .NET, PHP, Clojure). **Endor Labs** has an Upgrade Impact Analysis for JS/TS (a weaker match: risk rating via program analysis). The first search did not cover this class of vendor. The evidence is search summaries; the vendor pages were not read, and two arXiv preprints named by a tester (BreakGuard, DepRepair) are unchecked.

**What remains open:** Aikido and similar tools cover **breaking changes**, inside their platform. The *non-breaking* release-note content (new features, deprecations, behaviour changes), personalised to your own code and without a security platform, was not found. The verdict in the check log is therefore `verengt` (narrowed; previously `frei`).

## Prior work

- **Ecosyste.ms** — an open data layer over package ecosystems, including work on downstream testing. Without it the idea is expensive; with it, a weekend.
- **Renovate / Mend** — supplies the PR the result belongs in.
- **Socket.dev** — already analyzes what an update actually does.

---

This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.

CC0 / Public Domain. — Félix, Berlin · github.com/felixinberlin
