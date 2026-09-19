# Contributing to Amélie

> *"This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will."*  
> — **The Amélie Pledge**

Thank you for your interest in contributing to **Amélie**!

Amélie is not just a repository; it is a **method, a curated public archive, and an emerging gift-economy (Kula-Ring)** for software ideas that deserve to exist in the world, but which their discoverers do not have the time, runway, or mission to build themselves.

Whether you want to pack a new tin, research prior art, connect an orphan idea to the right recipient organization, translate documentation, or improve the web application, this guide explains how we work together.

---

## Quick Navigation

1. [Core Principles & The Five Rules](#core-principles--the-five-rules)
2. [Ways to Contribute](#ways-to-contribute)
   - [1. Pack a Tin (Add an Idea)](#1-pack-a-tin-add-an-idea)
   - [2. Triage & Research Candidate Ideas](#2-triage--research-candidate-ideas)
   - [3. Prior Art & "Where It Breaks" Verification](#3-prior-art--where-it-breaks-verification)
   - [4. Recipient Matching & Delivery Research](#4-recipient-matching--delivery-research)
   - [5. Web Application Development](#5-web-application-development)
   - [6. Translations & Internationalization (i18n / XLIFF)](#6-translations--internationalization-i18n--xliff)
3. [The Amélie Quality Standard](#the-amélie-quality-standard)
4. [Contribution Workflow (PRs & Issues)](#contribution-workflow-prs--issues)
5. [Licensing & Public Domain Commitment](#licensing--public-domain-commitment)

---

## Core Principles & The Five Rules

Before submitting any content, familiarize yourself with our governing principles:

1. **The delivery is the gift, not the find.**  
   An idea on a napkin is worth nothing. A researched one-page dossier—with technical proof, prior art, failure modes, and a named recipient who actually needs it—is a genuine gift. Spend **1 hour checking**, and **2 hours finding the right recipient** for every 1 hour spent drafting (the 1:2 budget rule).
2. **Sign it, but demand nothing.**  
   All ideas are released under **CC0 1.0 (Public Domain)**. You put your name on it for accountability and defensive publication, but you place no legal conditions, moral debt, or licensing traps on whoever picks it up.
3. **Deliver once, then walk away.**  
   We never spam, nag, or send follow-up emails to recipients. You leave the tin box in the phone booth and step into the background.
4. **If nobody asked for it, give tools, not an uninvited project.**  
   Bare ideas without working code go to companies, research consortia, grant makers, and funded non-profits. To unpaid open-source maintainers, we *only* propose things if we bring working pull requests or concrete scaffolding.
5. **Don't turn gifting into an excuse not to build.**  
   Keep at most two ideas for yourself, and actually build them. Giving things away feels productive, but it is not a substitute for shipping.

---

## Ways to Contribute

### 1. Pack a Tin (Add an Idea)

Every idea in the archive is called a **Dose** (Tin). A tin is strictly **one page** (approx. 350–550 words). If it takes two pages, your architecture section is too long or your problem definition is unfocused.

#### The Mandatory 7 Sections
Every tin file in `05-dosen/<slug>.md` must contain:

```markdown
---
id: "slug-name"
title: "Clear, Unpretentious Title"
date: "YYYY-MM-DD"
review_after: "YYYY-MM-DD" # 12 months after release
domain: "civic | climate | scientific | tooling | health | cultural"
verdict: "gift | build_first | keep"
recipients: "Named institution, research lab, or non-profit"
tags: ["relevant", "keywords"]
license: "CC0-1.0 (Public Domain / Kula-Ring)"
---

# Title

**One sentence:** What it is, without buzzwords, marketing adjectives, or corporate fluff.
**Date:** YYYY-MM-DD · **Review after:** YYYY-MM-DD
**Recipient:** Specific target organization or team
**Verdict:** 🎁 Gift / 🔨 Build First / 📦 Keep

---

## The Problem
Who suffers, from what, how often? Name concrete real-world roles (e.g. "building energy consultants in Brandenburg", not "one could..."). 2–4 sentences.

## Why Now
What was impossible, too expensive, or technically unfeasible 18 months ago that is now practical? (New open sensor data, WebGPU, local LLM inference, revised EU directive, standardized API). This is the core research value of the tin.

## Architecture Sketch
5 lines of clean ASCII, a bulleted pipeline, or data flow. Enough for a senior engineer to nod. Explicitly state **what does NOT belong**.

## First Step
The single GitHub issue / ticket someone starts on Monday morning, with a clear "Done when:" completion criteria.

## Where It Breaks (Failure Mode)
The primary fatal risk (regulatory trap, distribution dead end, maintenance burden) and the only known countermeasure. **Never omit this.**

## Prior Art
MANDATORY. What already exists, by whom, and how far did it get? If the exact product exists: discard the idea. If it partially exists: narrow your scope and disclose the overlap.

---
*This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will. CC0 / Public Domain.*
```

---

### 2. Triage & Research Candidate Ideas

In `00-quelle/` and `src/data/unpacked.ts`, we maintain a queue of **unpacked ideas** (raw prompts, observations, and hunches).

You can help by:
- Picking an unpacked candidate idea and applying the search protocol from `06-suche/amelie-suchplaybook.md`.
- Verifying whether an existing open-source tool already solved it.
- Moving checked candidates to either `05-dosen/` (if viable) or `05-dosen/_entsorgt.md` (if already solved or structurally flawed).

---

### 3. Prior Art & "Where It Breaks" Verification

The most valuable contribution is often **finding that an idea already exists**.

- If you find an existing company, open-source library, or academic project that does what a proposed tin outlines, please open an Issue with the label `prior-art`.
- We celebrate moving ideas to the `_entsorgt.md` (Discarded) archive: **killing a redundant idea saves hundreds of developer hours.**

---

### 4. Recipient Matching & Delivery Research

A tin is worthless if it sits unread. In `03-zuordnung/amelie-matrix.md` and `amelie-zustellplan-q4-2026.md`, we research suitable recipients.

Good recipients:
- Public interest bodies (associations, municipalities, libraries, museums).
- Research consortia with active EU or national grants looking for work packages.
- Early-stage grant applicants (Prototype Fund, Sovereign Tech Fund, NLnet, NGI).
- Independent teams who explicitly signaled they are looking for domain problems to solve.

Unsuitable recipients:
- Overworked solo open-source maintainers who didn't ask for ideas.
- Generic startup incubator inboxes (Y Combinator, general VC lists).

---

### 5. Web Application Development

The Amélie web app is built with:
- **TypeScript 5.x** + **React 18** + **Vite**
- **Tailwind CSS** with our custom vintage editorial typography palette (Burgundy, Gold, Cream, Dark Coffee, Courier typewriter headers)
- **Zero-backend architecture**: 100% static, runs on GitHub Pages with relative asset resolution (`base: './'`)
- Local-first browser storage (`localStorage`) + optional Firebase Auth & Google synchronization.

#### Local Development Setup
```bash
# Clone repository
git clone https://github.com/felixinberlin/amelie.git
cd amelie

# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript typechecks and linter
npm run lint

# Compile production bundle (outputs to dist/)
npm run build
```

#### Synchronizing Static Data for GitHub Pages
If you edit or add tins in TypeScript (`src/data/dosen.ts` or `src/data/unpacked.ts`), run the static data export script:
```bash
npx tsx scripts/export-static-data.ts
```
This updates `/public/data/amelie-ideas.json` and keeps the standalone JSON/Markdown database current.

---

### 6. Translations & Internationalization (i18n / XLIFF)

Amélie uses **OASIS XLIFF standard files** (`.xlf`) to prevent translation drift:
- Canonical language: **English** (`src/i18n/messages.en.xlf`)
- Target translations:
  - German: `src/i18n/messages.de.xlf`
  - Spanish: `src/i18n/messages.es.xlf`

You can edit `.xlf` files using standard translation tools such as **Poedit**, **OmegaT**, or any plain-text XML editor. See [`04-werkzeug/amelie-i18n-xliff.md`](./04-werkzeug/amelie-i18n-xliff.md) for detailed guidelines.

---

## The Amélie Quality Standard

Before submitting a Pull Request for a new tin or documentation, check:

- [ ] **No buzzwords**: No "disruptive", "AI-powered revolution", "supercharge", "next-gen". State what it physically or computationally does.
- [ ] **Specific failure mode**: Does the "Where It Breaks" section mention a real danger, or just a vague "if people don't use it"?
- [ ] **Rigorous prior art check**: Did you search GitHub, PyPI, npm, Hacker News, Hugging Face, Google Scholar, and Product Hunt?
- [ ] **No enclosure**: Ensure the idea does not enclose or patent common knowledge; we encourage defensive publication (e.g. on TDCommons / Zenodo).
- [ ] **Bilingual integrity**: Tins and UI strings must have accurate representations in English and German.

---

## Contribution Workflow (PRs & Issues)

1. **Fork the repository** on GitHub.
2. **Create a topic branch**: `git checkout -b feature/pack-tin-altbau` or `git checkout -b fix/i18n-spanish`.
3. **Verify builds and formatting**:
   ```bash
   npm run lint
   npm run build
   ```
4. **Commit with conventional messages**:
   - `feat(tin): add urban-canopy-radar idea dossier`
   - `docs(research): update prior art for altbau-thermal`
   - `i18n(es): update translations for matrix view`
   - `fix(app): ensure relative assets load on github pages`
5. **Open a Pull Request**: Use the PR template and link any relevant issues.

---

## Licensing & Public Domain Commitment

By contributing to this repository:
- All **idea dossiers, concepts, and documentation** are irrevocably dedicated to the public domain under the **Creative Commons CC0 1.0 Universal License**.
- All **software, web application source code, and scripts** are licensed under the **MIT License** or dedicated to **CC0** as specified in the root [LICENSE](./LICENSE) file.

You agree that anyone in the world may use, copy, modify, distribute, or commercialize the ideas without paying royalties, without seeking permission, and without giving attribution.

*Thank you for helping good ideas leave the drawer and find their makers.*
