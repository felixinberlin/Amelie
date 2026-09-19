# Amélie Project Roadmap

*A strategic vision for growing the Kula-Ring of open software ideas into a decentralized, resilient public-interest movement.*

---

## Vision & Long-Term Purpose

Amélie began with a simple premise: **ideas that you will never build belong to someone who can.**

Too many valuable software architectures remain locked in private notebooks, Notion pages, and headspaces because developer runways are finite. Meanwhile, civic tech organizations, researchers, universities, non-profits, and grant applicants (Prototype Fund, Sovereign Tech Fund, NLnet, NGI) frequently lack the technical blueprints needed to apply for funding or solve critical public problems.

Our objective is to transform Amélie from a single personal collection into a **federated, reproducible standard for gift-economy ideation**.

---

## Phase 1: Foundations (Q3–Q4 2026) — *Complete & Active*

- [x] **Canonical Collection**: 19 thoroughly researched ideas triaged into 15 packed tins and 4 documented discards.
- [x] **Web Application & Visualizer**: Interactive single-page application featuring:
  - Responsive tins gallery with bilingual dossiers (German, English, Spanish).
  - Recipient matrix & delivery planner.
  - Interactive "Pack a Tin" editor with instant Markdown & JSON generator.
  - Whimsy & Goodness ("Heiter & Besser") philosophy explorer.
  - Normal Jobs & Public Good index.
- [x] **Zero-Cost Static Hosting**: Fully configured for **GitHub Pages** deployment with relative asset resolution and automated CI/CD workflow (`.github/workflows/deploy.yml`).
- [x] **OASIS XLIFF Internationalization**: Strict translation schema separating canonical English from German and Spanish translations to prevent semantic drift.
- [x] **Public Domain / CC0 Foundation**: All ideas released without IP claims or moral debt.

---

## Phase 2: Decentralized Distribution & Federation (Q1–Q2 2027)

- [ ] **Standardized Open Ideas Specification (`amelie-spec.v1`)**:
  - Finalize JSON Schema (`public/data/amelie-schema.json`) for cross-project compatibility.
  - Define standard machine-readable YAML frontmatter for Markdown dossiers across any static site generator (Hugo, Astro, Jekyll, Zola).
- [ ] **Federated Amélie Feeds**:
  - Provide an RSS/Atom/JSON Feed (`/feed.json` and `/feed.xml`) notifying subscribers whenever a new tin is packed or released.
  - Allow other communities (e.g. climate tech collectives, civic hacking clubs, university labs) to maintain their own Amélie instances and cross-pollinate ideas.
- [ ] **Defensive Publication Pipeline**:
  - Direct integration with **TDCommons** (Technical Disclosure Commons) and **Zenodo** to automatically mint DOIs for published tins, establishing definitive prior art against patent trolls.
- [ ] **Standalone Offline Reader / PWA**:
  - Progressive Web App support enabling full offline access to all dossiers during travels, hackathons, or conferences.

---

## Phase 3: Grant & Builder Pairing (Q2–Q3 2027)

- [ ] **Public Interest Grant Matcher**:
  - Annotate each tin with matching open funding calls:
    - *Prototype Fund* (Germany)
    - *NLnet Foundation / NGI* (EU)
    - *Sovereign Tech Fund (STF)*
    - *BMBF Datensouveränität & Open Science*
    - *Sloan Foundation & Mozilla Open Source Support (MOSS)*
  - Provide ready-made grant application snippets ("Antragshilfe") directly in the tin view.
- [ ] **Anonymous "Picked Up" Tracker**:
  - A lightweight status flag where teams who begin building a tin can anonymously register their repository or deployment, helping other builders avoid duplicate work while respecting privacy.
- [ ] **Delivery Verification Log**:
  - Track dispatched tins and open-source outcomes without violating the "Deliver once and walk away" non-stalking rule.

---

## Phase 4: Developer Tooling & Automation (Q4 2027)

- [ ] **Amélie CLI (`npx amelie`)**:
  - `npx amelie pack`: Interactive terminal wizard for scaffolding a new `.md` tin with verified frontmatter.
  - `npx amelie check`: Automated preliminary scan against GitHub Search API, npm, PyPI, and Hugging Face to detect existing prior art before drafting.
  - `npx amelie export`: Export formatted Markdown dossiers into PDF, EPUB, or print-ready zines.
- [ ] **Prior Art Radar (GitHub Action)**:
  - Periodic automated check searching ArXiv, Google Scholar, and newly starred GitHub repos for terms matching existing tins, alerting maintainers if an idea has been built.

---

## Phase 5: Cultural & Community Growth (2028+)

- [ ] **"The Unbuilt Weekend" (Hackathon Format)**:
  - Organize community hackathons where participants are explicitly forbidden from pitching their own ideas; instead, teams randomly draw an Amélie tin from a physical box and build a prototype in 48 hours.
- [ ] **Physical Tin Boxes & Zines**:
  - Printable folding templates for miniature tin-box wrappers and pocket dossiers for physical distribution at chaos communication congresses, academic symposia, and maker faires.
- [ ] **Expanded Language Support**:
  - French (`fr`), Italian (`it`), and Portuguese (`pt`) translations via our XLIFF localization pipeline.

---

## How to Help Implement This Roadmap

Check out [`CONTRIBUTING.md`](./CONTRIBUTING.md) to see how you can claim an item from this roadmap. If you have suggestions or want to sponsor a work package, please open an Issue labeled `roadmap`.
