# Git DataViz Delta: Semantic & Visual Diff for Non-Code Assets

## Problem Statement
Universities, NGOs, and municipalities increasingly use Git and GitHub to version non-code assets such as research data (CSV, JSON), policy documents (Markdown, YAML), geospatial data (GeoJSON), or configuration files. However, standard Git diffs are often inadequate for these file types, as they display line-based text differences rather than highlighting *semantic* changes in data content or visual differences in charts or maps. This leads to a lack of transparency, complicates collaboration, and can result in inconsistent data states, as changes are not immediately comprehensible.

## Project Idea: Git DataViz Delta
"Git DataViz Delta" is an open-source tool that provides semantic and visual diff functionalities for common non-code file formats within Git repositories. It aims to enable users to understand changes in datasets, documents, and geospatial data in an intuitive and meaningful way.

### Core Features:
1.  **Semantic Diff Engine**: Detects changes in structured data (e.g., new rows/columns in CSV, changed keys/values in JSON/YAML, modifications to features in GeoJSON). It compares the *content* and *structure*, not just text lines.
2.  **Visual Representation**: Generates interactive HTML reports or images that graphically represent the differences (e.g., highlighted changes in data tables, side-by-side view of JSON structures with colored markers, overlay of GeoJSON changes on a map).
3.  **Git Integration**: Can be integrated as a CLI tool, pre-commit hook, post-receive hook, or within CI/CD pipelines to automatically generate diff reports when relevant files are modified.
4.  **Supported Formats (Initial)**: CSV, JSON, GeoJSON, YAML, Markdown (with a focus on structural changes).

## Use Cases for Target Institutions
*   **Universities (e.g., TU Berlin Open Science Lab)**: Researchers can visually track changes in their datasets (e.g., measurement series, survey results), improving reproducibility and transparency of research findings. Ideal for Open Science practices.
*   **NGOs (e.g., Open Knowledge Foundation Germany)**: Organizations versioning open data or policy documents can more easily review and communicate changes in their data publications or legislative drafts. Promotes accountability in political processes.
*   **Municipalities (e.g., Berlin Senate Department for Urban Development)**: For versioning geospatial data (e.g., zoning plans, tree cadastre, infrastructure data) or open data portals, changes to datasets can be visually verified instantly, ensuring data quality and facilitating public communication.

## Technological Approach
The tool would be developed in TypeScript and could leverage existing libraries for data parsing (e.g., `papaparse` for CSV, `json-diff` for JSON) and visualization (e.g., D3.js, Vega-Lite for data visualizations, Leaflet/Mapbox GL JS for GeoJSON). Outputting as HTML allows for easy browser viewing or embedding in web applications.

## Impact and Sustainability
"Git DataViz Delta" would significantly increase the adoption of Git for non-code-based projects within target institutions. It promotes transparency, improves data quality, and facilitates collaboration by providing an intuitive and understandable history of data changes. As an open-source tool, it can be extended and maintained by the community to support new formats and visualizations.