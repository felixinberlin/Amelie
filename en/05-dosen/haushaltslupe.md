# Haushaltslupe (Budget Magnifier): Differential Analysis of Municipal Budgets and Supplementary Budgets

## Problem Statement
Municipal budgets are the financial blueprints of our cities and communities, dictating how public funds are raised and spent. However, for citizens, journalists, and even NGOs, it is often extremely difficult to understand these complex documents, let alone track changes over time or between different planning stages (e.g., the original budget plan and subsequent supplementary budgets). These documents are frequently provided as difficult-to-search PDFs, are inconsistently structured, and require enormous manual effort for comparison. This information asymmetry hinders effective public oversight and informed citizen participation.

## The Amélie Solution: Haushaltslupe
The 'Haushaltslupe' (Budget Magnifier) is an open-source tool designed to reverse this asymmetry. It enables automated extraction, structuring, and differential comparison of municipal budget data. A particular focus is on the analysis of supplementary budgets (Nachtragshaushalte) – the often-opaque additions and changes to the original budget plan.

### How it Works
1.  **Document Upload & Parsing**: Users can upload municipal budget plans (typically PDFs). The tool uses OCR and intelligent text recognition to extract relevant financial data (revenues, expenditures, items, areas, projects).
2.  **Structuring & Categorization**: The extracted data is converted into a standardized, machine-readable format and classified according to predefined or user-defined categories.
3.  **Differential Analysis**: This is the core of the Haushaltslupe. Users can compare two versions of a budget plan (e.g., original vs. supplementary, or Year X vs. Year Y). The tool automatically identifies and visualizes all changes: new items, deleted items, changes in amounts, shifts between categories.
4.  **Visualization & Export**: Results are presented in interactive charts and tables that instantly show *where*, *what*, and *how much* has changed. Export options allow further processing by journalists or researchers.

## Asymmetric Inversion & Friction Points
The Haushaltslupe inverts asymmetry by neutralizing the administrative advantage in interpreting complex financial data. The friction point lies in the manual, error-prone, and time-consuming work required to track budget changes. The tool closes this gap by automating this process, empowering citizens to actively monitor and question their municipalities' financial decisions.

## Target Audience
*   **Citizens**: To better understand the use of their tax money.
*   **Local Journalists**: For in-depth research and reporting on municipal finances.
*   **NGOs and Citizen Initiatives**: To provide a basis for advocacy or to verify electoral promises.
*   **Universities and Research Institutions**: For the analysis of public finance and governance studies.

## Technological Basis
Modern web technologies (React/Vue), data visualization libraries (D3.js, Vega-Lite), server-side components for robust PDF-parsing (Python with `camelot`, `pdfminer.six`, or LLM-based extraction), and a lightweight database (SQLite).