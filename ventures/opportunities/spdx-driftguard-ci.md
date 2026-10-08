# Commercial Opportunity: SPDX DriftGuard CI

**ID:** `spdx-driftguard-ci`  
**Amélie Twin:** `git-license-spdx-drift-guard` (PR #90 / #102)  
**Status:** Architecture Validated  
**Category:** Developer Infrastructure / Compliance CLI  
**Target Buyer:** Commercial SaaS Companies, Enterprises, M&A Tech Due Diligence Teams, Open-Core Startups  

---

## 1. The Core Commercial Problem
Enterprise engineering teams and commercial SaaS startups unknowingly introduce viral copyleft licenses (GPL-2.0, GPL-3.0, AGPL-3.0, SSPL) into proprietary codebases through transitive package dependencies.
- **The Pain:** Legal infringement litigation, forced open-sourcing of proprietary intellectual property, failed M&A tech diligence audits, and compliance fire-drills before IPOs.
- **The Current Alternative:** Heavy enterprise platforms like FOSSA, Snyk, or Black Duck that cost $10,000 to $50,000+ per year, require cumbersome sales calls, and send proprietary dependency graphs to third-party cloud servers.
- **The Solution:** A lightweight, privacy-first, zero-cloud CI/CD binary (GitHub Action & standalone CLI). It parses lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`, `poetry.lock`), resolves SPDX 2.3 Boolean expressions, checks against an approved organizational license whitelist, and fails the pull request immediately upon license drift.

---

## 2. The 5 Commercial Vectors

| Vector | Rating | Analysis |
|---|:---:|---|
| **1. Pain & WTP** | **5/5** | Existential legal risk. CTOs and Tech Leads willingly expense $79–$299 on corporate credit cards to avoid multi-thousand-dollar legal exposure or M&A deal delays. |
| **2. Time-to-Ship** | **5/5** | **$\le 5$ days.** Pure TypeScript/Node CLI or Go binary using deterministic SPDX AST parsers (`spdx-satisfies`, `spdx-expression-parse`). Zero database, zero cloud backend. |
| **3. Distribution** | **5/5** | GitHub Marketplace Action, developer communities (`r/programming`, `r/ClaudeCode`, Hacker News), and targeted SEO ("block AGPL in CI", "SPDX license check github action"). |
| **4. Monetization** | **4/5** | $99 solo developer license (one-time) / $299 team license (perpetual) on Lemon Squeezy, or $19–$49/month GitHub Marketplace app for organizations. |
| **5. Defensibility** | **4/5** | Deterministic SPDX Boolean expression resolution and dual-license resolution trees (e.g. `(MIT OR GPL-3.0)` vs `(MIT AND GPL-3.0)`), where generic LLM prompt wrappers fail. |

---

## 3. Minimum Viable Product (MVP) Scope
1. **Engine:** Lockfile parser for `npm`, `pnpm`, `Cargo`, `go` $\to$ extraction of SPDX identifiers.
2. **Policy Config:** `.driftguard.json` defining `allowedLicenses: ["MIT", "Apache-2.0", "BSD-3-Clause"]` and `forbiddenLicenses: ["GPL-*", "AGPL-*", "SSPL"]`.
3. **GitHub Action:** Exit code 1 with clean Markdown summary in PR comments highlighting offending dependency tree path.
4. **Distribution:** Published on npm (`@driftguard/cli`) and GitHub Actions Marketplace.
