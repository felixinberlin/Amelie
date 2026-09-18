# Amélie — Internationalization & XLIFF Localization Architecture

> **English is the canonical source language.**  
> Translations for German (`de`) and Spanish (`es`) are maintained via standardized **OASIS XLIFF** (XML Localization Interchange File Format) 1.2 files.

---

## 1. Why XLIFF?

Traditional ad-hoc `.json` files frequently suffer from key drift and lack translator metadata.

**XLIFF (`.xlf`)** is the international OASIS standard. Each translation unit (`<trans-unit>`) explicitly binds:
- A unique `id`
- `<source>` text (canonical English)
- `<target>` text (German or Spanish translation)
- Status attributes (`state="translated"`, `state="needs-translation"`)
- Translator context notes (`<note>`).

---

## 2. Directory Layout

All XLIFF translation catalogs reside in `src/i18n/`:

```
src/i18n/
├── messages.en.xlf    # Canonical English source strings
├── messages.de.xlf    # German localization catalog (XLIFF 1.2)
├── messages.es.xlf    # Spanish localization catalog (XLIFF 1.2)
└── index.ts           # Runtime typed i18n loader & helpers
```

---

## 3. Supported Languages in the Web Application

| Code | Language | Role | Status |
|---|---|---|---|
| `en` | **English** | Primary / Canonical | Source |
| `de` | **Deutsch** | Regional / Original | Fully translated |
| `es` | **Español** | Regional / Global | Fully translated |
