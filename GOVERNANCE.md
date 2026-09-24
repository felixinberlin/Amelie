# Amélie Project Governance

*How decisions are made, how ideas are curated, and how the collection remains trusted, sustainable, and free from commercial enclosure.*

---

## 1. Overview & Philosophy

Amélie is an open-source, public-domain initiative dedicated to releasing researched software ideas to the world.

Because the value of Amélie lies in the **high density of research and zero fluff**, curation is deliberate. We value having **15 verified, razor-sharp tins** far more than having 500 unvetted brainstorming notes.

This document describes how the project is governed, how new tins are approved, and how maintainers operate.

---

## 2. Roles & Responsibilities

### Stewards (Maintainers)
- **Current Lead Steward**: Félix (Berlin)
- **Responsibilities**:
  - Reviewing and merging Pull Requests for new tins, translations, and software features.
  - Ensuring the integrity of the CC0 Public Domain commitment.
  - Maintaining the technical infrastructure (web app, GitHub Pages deployment, schema validation).
  - Moderating discussions and enforcing the [Code of Conduct](./CODE_OF_CONDUCT.md).

### Tin Curators
- Experienced contributors who have demonstrated a track record of rigorous prior-art checking and domain research.
- Curators have the authority to triage incoming proposals, verify failure modes, and request revisions before a tin is merged.

### Contributors
- Anyone who submits a pull request, research finding, translation, or bug report.

---

## 3. The Amélie Triage Protocol

Every submitted idea passes through a strict 4-stage evaluation funnel:

```
[ Unpacked Idea / Proposal ]
            │
            ▼
    1. Prior Art Check  ──(Already exists?)──► [ Graveyard 08-friedhof ]
            │ (No exact match)                 (Document evidence)
            ▼
   2. Technical Feasibility & "Why Now"
            │ (Lacks real trigger) ──► Request Revisions / Defer
            ▼
     3. Failure Mode & Recipient Match
            │ (Ready)
            ▼
     [ Packed Tin (Dose) ]
     (CC0 Public Domain)
```

### The 3 Approval Verdicts:
1. **🎁 Gift (`verdict: "gift"`)**: Ready for immediate unconditioned release and delivery to target organizations.
2. **🔨 Build First (`verdict: "build_first"`)**: Technically compelling, but requires a minimal proof-of-concept / scaffold before a recipient can evaluate it.
3. **📦 Keep (`verdict: "keep"`)**: The author has committed to building this themselves within a defined timeframe (limited to max 2 ideas at a time).

---

## 4. Discarding Is a Success State

In traditional projects, rejecting a submission is considered negative. In Amélie, **burying an idea in the graveyard (`08-friedhof/`, with cause of death) is celebrated as a major victory**.

If research reveals that an idea:
- Already exists as a healthy, active product or library,
- Relies on an unfixable legal or regulatory blocker,
- Or has proven repeatedly fatal in real-world prior attempts without a new technical countermeasure,

the tin is added to the discarded register with full citations. This prevents future developers from wasting months rediscovering the same roadblock.

---

## 5. Decision Making & Consensus

- **Technical Changes (App & Code)**: Consensus among active software maintainers. Standard GitHub PR review process with at least one approval.
- **Content & Tins**: Curators evaluate against the [Amélie Quality Standard](./CONTRIBUTING.md#the-amélie-quality-standard). If there is debate over whether an idea already exists, the burden of proof is on demonstrating a distinctive, viable "Why Now" angle.
- **Licensing & Ethical Changes**: Any change affecting the public domain status, recipient protection rules, or anti-enclosure invariants requires unanimous consent of the Stewards.

---

## 6. Succession & Continuity

If the original maintainers become inactive or unavailable:
1. Active Curators may elect a new Lead Steward by majority vote on an open GitHub Issue.
2. Because the entire dataset and codebase are **CC0 and static-first**, any member of the community has the irrevocable right to fork the repository, host their own instance on GitHub Pages, and continue the Kula-Ring.
