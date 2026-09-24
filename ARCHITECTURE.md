# Amélie System Architecture & Developer Guide

*Technical documentation for developers, system architects, and open-source contributors.*

---

## 1. Architectural Principles

Amélie is engineered according to four foundational technical principles:

1. **Static-First & Zero-Maintenance**:
   - The application runs **100% in the browser** and can be hosted statically on GitHub Pages, Cloudflare Pages, Vercel, or any simple file server without runtime server costs, microservices, or database lock-in.
2. **Local-First Data Ownership**:
   - User edits, new drafts, and custom imported tins persist in browser `localStorage`. No mandatory sign-up or remote database is required to explore or author ideas.
3. **Dual-Persistence Model**:
   - Primary: Static JSON (`public/data/amelie-ideas.json`) + Markdown files.
   - Optional: Firebase Authentication & Google Workspace synchronization for cloud backups across devices.
4. **Standardized Internationalization (OASIS XLIFF)**:
   - Canonical English source text with target German and Spanish translations managed via industry-standard XLIFF 1.2 / 2.0 files.

---

## 2. Directory Structure

```
├── .github/
│   ├── workflows/deploy.yml       # GitHub Actions CI/CD to GitHub Pages
│   └── ISSUE_TEMPLATE/            # Structured issue & PR templates
├── 00-quelle/                     # Original raw idea seeds & notes
├── 01-konzept/                    # Manifest, principles, & loop guidelines
├── 02-recherche/                  # Landscape research & movement studies
├── 03-zuordnung/                  # Recipient matrix & delivery schedules
├── 04-werkzeug/                   # Boilerplate, templates & i18n manuals
├── 05-dosen/                      # The packed tins (.md); _entsorgt.md is a redirect
├── 08-friedhof/                   # Graveyard: README (rules + generated patterns), nachrufe.md, grabbeigaben/
├── 06-suche/                      # Search playbooks & audit logs
├── public/
│   ├── data/
│   │   ├── amelie-ideas.json      # Machine-readable complete database
│   │   ├── amelie-schema.json     # JSON Schema validation definition
│   │   ├── dosen.json             # Static tins array
│   │   └── unpacked.json          # Unpacked candidate ideas array
│   └── favicon.svg
├── scripts/
│   └── export-static-data.ts      # Node/tsx script compiling ts data -> static JSON
├── src/
│   ├── components/                # Modular React UI components
│   │   ├── DosenGallery.tsx       # Main tins explorer & filter grid
│   │   ├── DoseDetailModal.tsx    # Dossier reader with copy/download tools
│   │   ├── GitHubPagesDataHub.tsx # Export center for JSON, .md & Git guides
│   │   ├── PackTinModal.tsx       # Interactive tin packaging editor
│   │   ├── MatrixView.tsx         # Recipient matching & outreach table
│   │   ├── UnpackedIdeasView.tsx  # Unpacked candidate ideas backlog
│   │   ├── GoogleAccountImporter.tsx # Google Drive / Firebase sync UI
│   │   └── ...
│   ├── data/
│   │   ├── dosen.ts               # Bundled canonical tins dataset
│   │   ├── unpacked.ts            # Bundled candidate ideas dataset
│   │   ├── matrix.ts              # Recipient mapping data
│   │   └── deliveries.ts          # Outreach letters & status logs
│   ├── i18n/
│   │   ├── index.ts               # i18n helper & language hooks
│   │   ├── messages.en.xlf        # OASIS XLIFF source (Canonical English)
│   │   ├── messages.de.xlf        # OASIS XLIFF target (German)
│   │   └── messages.es.xlf        # OASIS XLIFF target (Spanish)
│   ├── services/
│   │   ├── storageService.ts      # LocalStorage & Static JSON export engine
│   │   └── googleIdeas.ts         # Google OAuth & Drive import services
│   ├── App.tsx                    # Top-level application router & layout
│   └── types.ts                   # Core TypeScript types & data interfaces
├── vite.config.ts                 # Vite config with base: './' for GitHub Pages
└── metadata.json                  # Application descriptor
```

---

## 3. Data Model & Schema

The core domain model is centered around the `DoseItem`:

```typescript
export interface DoseItem {
  id: string;                      // Unique slug (e.g. 'altbau-thermal')
  title: string;                   // Human-readable title
  date: string;                    // Release date (YYYY-MM-DD)
  reviewAfter: string;             // Audit date (YYYY-MM-DD)
  domain: string;                  // Category: civic, climate, tooling, etc.
  verdict: 'gift' | 'build_first' | 'keep';
  status: 'researched' | 'drafted' | 'delivered' | 'adopted';
  oneLinerDe: string;              // German summary
  oneLinerEn: string;              // English summary
  recipientsDe: string;            // Target recipient in German
  recipientsEn: string;            // Target recipient in English
  problemDe: string;
  problemEn: string;
  whyNowDe: string[];              // Technical enablers / triggers
  whyNowEn: string[];
  sketchDe: string;                // Architecture sketch / constraints
  sketchEn: string;
  firstStepDe: { ticket: string; criteria: string };
  firstStepEn: { ticket: string; criteria: string };
  failureModeDe: string;           // Critical risk & countermeasure
  failureModeEn: string;
  priorArtDe: string;              // Existing solutions & citations
  priorArtEn: string;
  tags: string[];
  contactPerson?: string;
  contactEmail?: string;
}
```

### The Book Behind the Tin

Every tin may carry a *book*: the raw research it grew out of. Chapters are registered in `src/data/doseBooks.ts` by repo-relative path:

```ts
DOSE_BOOKS['eurobirdcast'] = [
  { slug: 'besetzung', path: '02-recherche/eurobirdcast-besetzung-2026-09-22.md', kind: 'md', ... }
];
```

Two design choices are deliberate:

1. **No copy into `public/`.** Chapters are read from the repository through `import.meta.glob` (`src/utils/bookSources.ts`), lazily, one chunk per file. A copy would be a second version of the truth that silently drifts; this way the file in the repo is the only one, and a wrong path fails the build instead of 404-ing on the reader.
2. **`npm run check:books` fails the lint on a dead path.** Rename a research file without updating the registry and CI stops. For a project whose entire value is verifiability, a chapter link pointing at nothing is the most expensive small bug available.

Chapters link to the file on GitHub *and* to its commit history — for the recipient, the history is part of the evidence: it shows when a claim was checked and whether a verdict was later corrected. Non-Markdown chapters (`kind: 'pdf'`) are listed and linked, not rendered.

Deep link to a chapter: `#dose=<id>&buch=<slug>`.

### JSON Schema Validation
All static exports conform to `public/data/amelie-schema.json`. You can validate any exported JSON against this schema using standard validators (e.g., `ajv-cli`):
```bash
npx ajv validate -s public/data/amelie-schema.json -d public/data/amelie-ideas.json
```

---

## 4. Static Export & Build Pipeline

To ensure the web app functions with zero external dependencies on GitHub Pages:
1. **Relative Asset Paths**:
   In `vite.config.ts`, `base: './'` is configured. All JS, CSS, and image assets load properly regardless of whether the site is hosted at the root domain (`https://example.com/`) or a GitHub Pages subpath (`https://username.github.io/amelie/`).
2. **Static JSON Generation**:
   `scripts/export-static-data.ts` reads `src/data/dosen.ts` and `src/data/unpacked.ts` and outputs formatted JSON to `/public/data/`.
3. **Automated CI/CD**:
   `.github/workflows/deploy.yml` triggers on every push to the `main` branch, running `npm run build` and publishing the `dist/` directory via GitHub Pages Actions.

---

## 5. Internationalization (i18n)

Amélie adheres to the **OASIS XLIFF (XML Localization Interchange File Format)** standard:
- English is the **canonical source language**.
- When adding or modifying UI labels, define the source string in `src/i18n/index.ts` and `src/i18n/messages.en.xlf`.
- Run automated linting to ensure all language files contain matching translation keys.

---

## 6. Styling & Visual Identity

The visual presentation embodies the **Amélie Aesthetic**—a fusion of 1950s French editorial typography, warm parchment tones, and crisp modern typography:
- **Fonts**:
  - `Playfair Display` & `Fraunces` (`font-amelie`): Display headings and philosophical quotes.
  - `Courier Prime` / Monospace (`font-typewriter`): Metadata badges, postal codes, and tags.
  - `Plus Jakarta Sans` / System Sans (`font-sans`): Body text and dense data grids.
- **Palette**:
  - Warm Parchment canvas: `#fbf7f0` / `#fffefb`
  - Vintage Burgundy accent: `#8c1d40` (hover: `#741533`)
  - Warm Ochre & Gold: `#f6bd60`
  - Deep Coffee text: `#2b1e16`
  - Soft Sepia borders: `#dfd1be`
