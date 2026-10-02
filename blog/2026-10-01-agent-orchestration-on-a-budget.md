# Try agent orchestration without going broke
## What a repo with seven agents reveals about write permissions, duplicates and compute costs

*By Félix and Claude · Berlin, 1 October 2026 · All content CC0 (public domain)*

> You do not need an investor, a team or a brand to understand agent orchestration. You need a repo that demonstrates it and a command that costs nothing.

---

## 1. Why this article is for you, whatever your stack

Do you work in TYPO3, Rails, Go, data engineering or cloud infrastructure? The orchestration in this repo depends on none of them. It consists of Markdown files (`.claude/agents/`), a few Node scripts and one rule: **many agents may read and propose, only one may write.** The topic of a round is interchangeable: ours is ideas to give away, yours could be migrations, code reviews, test gaps or grant applications.

Amélie is a project that gives ideas to the people who need them (see `README.md`). A team round runs: three discovery engines in parallel, a merge, an independent reviewer, a packer, a demo builder, a librarian. Seven subagents, 44 packed tins, 141 buried ideas. The numbers matter less than what went wrong while building it.

## 2. Seven lessons, each with evidence from the repo

**1. One writer, many readers.** Agents have disjoint write permissions; the shared memory (check log, graves, sources) is written by the librarian alone, through `bib apply` all-or-nothing with snapshot, journal, rollback and ledger. Why: two sessions in the same repo once doubled the search on the same topic. Every round therefore starts with a preflight (`git fetch`, foreign branches, open PRs).

**2. Without deduplication, orchestration floods you.** Automatic batch runs produced over 100 pull requests, many stubs or duplicates. Two triage rounds closed 92 of them. Lesson: plan the merge before the start, not after. For us that is the convergence merge, for you perhaps a cluster lead per topic.

**3. The reviewer must not be the engine.** Discovery engines rate their own finds too kindly. An independent checker with its own rubric (eight vectors, a gate at 24 of 35 points) keeps the rate honest: in several rounds not a single idea got through.

**4. A format contract beats a beautiful prompt.** In one test round three of four reports delivered their source notes in the wrong format. Since then every crew agent report ends with a validated JSON block plus one repair call, and writing happens only with `--write`, by the program and not by the model. In PR review a failed agent never rejects: it ends with exit code 3 instead of simulating a verdict.

**5. Mock mode first.** The whole chain runs offline with scripted models and never writes (`--mock`). That found bugs in the CLI without spending a token, for example a library command that read the wrong return fields and always rejected graves and tins. There is now a regression test over the real CLI call.

**6. Lint is the best colleague.** The dossiers exist twice (Markdown and front-end data). Instead of hoping someone remembers, `npm run lint` checks for congruence, log coverage, graveyard, sources and diagrams. Agents running against a barrier become useful faster than agents with a longer prompt.

**7. Premise before verdict.** Several ideas died because their basic assumption was wrong (a removal duty that does not exist; a data source that delivers only the current state, never the previous value). Make agents check the premise before they judge. That holds for code reviews just as well.

## 3. Start without paying

Everything here has been tried and runs today:

```bash
git clone https://github.com/felixinberlin/Amelie && cd Amelie && npm ci
npm run agent -- list                       # the roles and their write permissions
npm run teamrunde -- "Holz" --mock          # whole chain offline, never writes
```

Then, in this order:

1. **A cheap model, dry run only.** Copy `scripts/model-compare/models.example.json` to `models.local.json`, enter a model (Gemini free tier, a small Claude model, a local one). Without `--write` the round writes nothing; you read the dossier under `06-suche/agent-runs/`.
2. **Measure prices, do not guess.** `npm run vergleich -- models|run|judge|score` runs the same round over several models. Honestly: our first real measurement is still outstanding, and the prices in the example configuration are placeholders. Check them against your provider’s price page.
3. **Your own roles.** Copy a definition from `.claude/agents/`, change brief and tools, run it through `npm run agent`. Start with two roles: a reader and a checker. The writer comes last.

## 4. If it does cost money: where credits can come from

We collected this in the front end (Research, funding compass, tab "AI credits & runway") and in `en/06-suche/amelie-ai-credits-and-runway.md`. The honest short version:

- **Free, immediately:** Gemini API free tier (limits change, not guaranteed), Microsoft Founders Hub (idea tier, reportedly $1,000 Azure credit), Mistral free plan.
- **Open-source programmes:** Anthropic "Claude for Open Source" gives 6 months of Max 20x, **no API credits**. Beware: many aggregators cite 5,000 stars and a deadline; the official terms state neither. They list six criteria (for example 100 merged PRs in others’ repos in 12 months, or 20 external contributors), a GitHub account older than two years and an OSI licence. Contributions to any OSI project count, not only your own. OpenAI’s Codex Open Source Fund cites up to $25,000 in API credits.
- **Company programmes:** Anthropic for Startups gives credits only with equity from an institutional investor; Google Cloud has a $2,000 start tier for companies under 24 months with an MVP. As an individual without a company you are not eligible.
- **Nonprofit:** Claude for Nonprofits and Google for Nonprofits require a recognised charitable organisation.
- **Money instead of credits:** Prototype Fund (up to €47,500 for individuals, apply by 30 Nov 2026) and NLnet (deadline 3 Nov 2026). Both want open licences; NLnet requires disclosure of all AI use including prompts and rejects AI-generated projects.

The evidence is mostly search snippets. Verify amount, deadline and eligibility on the primary page before applying, and never inflate metrics: Anthropic’s terms name that explicitly as grounds for revocation.

## 5. And income?

No grant replaces ongoing work. Whether you know TYPO3, WordPress, Kubernetes or databases: maintenance, migrations, audits and subcontracting are the most reliable runway. Many ecosystems also have their own pots (the TYPO3 Association awards money through its Community Budget in 2026, the Sovereign Tech Agency and the PHP Foundation fund core technology). Look for the counterpart in your stack.

## 6. What we do not know

- What a team round really costs with which model. The cost line exists, the real measurement does not.
- Whether the Claude adapters work against live APIs; so far only Gemini via Vertex AI has run live.
- Whether orchestration brings you more than one good agent plus a linter. Our impression: the gain comes from write permissions, contracts and checkers, not from the number of agents.

---

*The orchestration is CC0. Take it, rebuild it, give it on. Documentation: `06-suche/amelie-kommandozeile.md`, orchestrator skill: `skills/amelie-orchestrator/`.*
