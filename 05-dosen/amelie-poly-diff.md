# Amélie Poly-Diff: Semantic Git History for Civic Data & Documents

## Problem
Public administrations routinely handle a diverse array of documents and data – from policy drafts and urban planning maps to budget spreadsheets. However, tracking changes, ensuring transparent collaboration, and auditing these non-code assets often remain deficient. Email attachments and poorly versioned shared drives hinder both internal work and public understanding.

## Solution
Amélie Poly-Diff is a browser-native, local-first tool that applies Git concepts to non-code civic data and documents. It enables the storage and visualization of the history of files like ODT, DOCX, CSV, GeoJSON, and SVG within an interactive Git graph. Instead of line-by-line code deltas, Poly-Diff provides semantic diffs, highlighting changes to paragraphs, data points in tables, or geometric shapes in maps. WASM modules handle local file processing, while small AI agents can summarize the nature of changes (e.g., "budget adjustment," "street name change").

## Institutional Partner
Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin – This administration is a prime example of the need for transparent version control for urban planning documents, building regulations, and geodata.

## Added Value
*   **Transparency & Auditability**: Citizens and authorities can easily track changes in public documents and data.
*   **Efficient Collaboration**: Improves internal and external collaboration on complex projects.
*   **Local Sovereignty**: All data processing occurs locally in the browser, maximizing data privacy and performance.
*   **Accessibility**: Makes version control accessible and usable even for non-developers.