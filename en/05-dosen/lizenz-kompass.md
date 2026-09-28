```markdown
# License Compass for Open Data

## Project Overview
The License Compass is an open-source tool designed to enhance the reusability of open data by providing an interactive visualization and guidance on data license compatibility. Many public administrations publish data, but the legal frameworks for its use, especially when combining different datasets, are often unclear. This tool aims to bridge this gap by helping both data providers and users understand and correctly apply licenses.

## Problem Statement
The world of open data is complex. While much data is freely available, licenses (e.g., Creative Commons, ODC-BY, German Data License) vary significantly in their requirements (attribution, share-alike, commercial use, etc.). This leads to two main problems:
1.  **For Data Providers (e.g., municipalities, agencies):** Uncertainty in selecting the 'right' license for newly published datasets that offers the desired level of openness and protection.
2.  **For Data Users (e.g., researchers, NGOs, startups):** Difficulties in assessing legal compatibility when combining multiple datasets with different licenses. This hinders the development of innovative applications and analyses.

## Target Audience
*   **Public Administrations and Agencies:** For the correct and consistent licensing of their open data.
*   **Universities and Research Institutions:** For licensing research data and understanding license compatibilities in interdisciplinary projects.
*   **NGOs and Civil Society Organizations:** To assess data reusability and advocate for better data policies.
*   **Developers and Data Analysts:** Who want to use open data for projects and applications.

## Functionalities
1.  **License Recognition and Analysis:** A module that identifies common license designations and extracts their core characteristics (e.g., attribution, share-alike, commercial use).
2.  **Interactive Compatibility Matrix:** A visual representation indicating which licenses are compatible with each other and what restrictions or conditions arise when combining them.
3.  **License Selection Assistant:** A guided process that suggests suitable licenses based on intended use (e.g., "Is attribution required?", "Is commercial use allowed?").
4.  **Integration with Data Portals:** An API or plugin to import license information directly from open data portals (e.g., CKAN instances) and assess the compatibility of datasets within a portal.
5.  **Educational Resource:** Detailed explanations for each license and best-practice examples.

## Technical Approach (MVP)
*   **Frontend:** A modern web application (e.g., React/Vue/Svelte) for the interactive user interface and data visualization.
*   **Backend/Logic:** TypeScript/JavaScript for the core logic of license analysis and compatibility checking. License data and compatibility rules could be stored in a static JSON file or a simple database.
*   **Data Sources:** A curated list of open data licenses (e.g., based on SPDX, Creative Commons, GovData standards) and their properties.

## Impact and Added Value
The License Compass would drastically increase legal certainty in dealing with open data. It would not only facilitate data reuse but also improve the quality of licensing during publication. This leads to a more efficient use of public resources and promotes innovations based on open data.

## Next Steps
*   Detailed analysis of the most common open data licenses in Germany and Europe.
*   Development of a prototype for the compatibility matrix.
*   Collaboration with legal experts for open data and the Open Knowledge Foundation Germany.

```