# Amélie — Internationalization & XLIFF Localization Architecture

> **English is the canonical source language.**  
> Translations for German (`de`) and Spanish (`es`) are maintained via standardized **OASIS XLIFF** (XML Localization Interchange File Format) 1.2 files.

---

## 1. Why XLIFF?

Traditional ad-hoc `.json` files frequently suffer from:
- Silent key drift when source strings change
- Lack of contextual metadata for human translators
- Incompatibility with industry-standard Computer-Assisted Translation (CAT) tools and translation management systems (e.g. Poedit, OmegaT, Crowdin, Lokalise)

**XLIFF (`.xlf`)** is the international OASIS standard. Each translation unit (`<trans-unit>`) explicitly binds:
- A unique `id`
- `<source>` text (canonical English)
- `<target>` text (German or Spanish translation)
- Status attributes (`state="translated"`, `state="needs-translation"`)
- Translator context notes (`<note>`) explaining the Amélie philosophy, metaphors, and tone.

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

## 3. Translation Unit Example (XLIFF 1.2)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="en" target-language="es" datatype="plaintext" original="amelie-core">
    <body>
      <trans-unit id="app.tagline" resname="app.tagline">
        <source>Ideas that belong to someone else — after Amélie Poulain &amp; the Kula Ring</source>
        <target state="translated">Ideas que pertenecen a alguien más — según Amélie Poulain y el Anillo Kula</target>
        <note priority="1">Main tagline displayed in the navigation header.</note>
      </trans-unit>
      
      <trans-unit id="manifest.rule1.title" resname="manifest.rule1.title">
        <source>The delivery is the gift, not the find</source>
        <target state="translated">La entrega es el regalo, no el hallazgo</target>
        <note priority="1">First core rule of the Amélie Manifesto.</note>
      </trans-unit>
    </body>
  </file>
</xliff>
```

---

## 4. How to Update or Add Translations

### With a GUI Translation Tool (Poedit or OmegaT)
1. Open `src/i18n/messages.de.xlf` or `src/i18n/messages.es.xlf` in **Poedit** or any XLIFF-compatible CAT tool.
2. Translate or revise any string marked `needs-translation`.
3. Save the file.

### In Code
1. If adding a new key, add the source English unit to `messages.en.xlf`.
2. Add the corresponding target translation unit to `messages.de.xlf` and `messages.es.xlf`.
3. Update `src/i18n/index.ts` so the TypeScript dictionary reflects the updated units.

---

## 5. Supported Languages in the Web Application

| Code | Language | Role | Status |
|---|---|---|---|
| `en` | **English** | Primary / Canonical | Source |
| `de` | **Deutsch** | Secondary / Original | Fully translated |
| `es` | **Español** | Regional / Global | Fully translated |
