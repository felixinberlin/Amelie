# Dataset Historian (OpenDataGit)

## Hypothesis
The lack of transparent, auditable versioning and clear contribution pathways for public datasets on municipal and NGO open data portals creates friction for data users and hinders data quality improvements.

## Problem
Open data is a cornerstone of modern, transparent governance and civil society work. However, in practice, data users, researchers, and the public often face significant challenges:
*   **Lack of Versioning:** Datasets are frequently published as static snapshots without a clear history. It is difficult to ascertain when and how data has changed.
*   **Missing Traceability:** When data changes occur, it is often unclear who made them, when, and why. This erodes trust in the data.
*   **Difficult Contribution:** Citizens or experts who discover errors or wish to suggest additions rarely have a simple, standardized way to do so. The process is often opaque and reactive.
*   **High Manual Effort:** Data stewards must painstakingly document or manage changes manually, which is error-prone and inefficient.

These deficiencies complicate the use of open data for research, analysis, and civic engagement, and impede the quality development of the data itself.

## Solution: Dataset Historian (OpenDataGit)
The "Dataset Historian" is an open-source tool that extends the power of Git – the standard for code version control – to structured, public datasets. It provides a user-friendly interface to transparently track and manage data changes and foster collaboration.

### Core Features
1.  **Automated Version Control:** Monitors configured datasets (e.g., CSV, JSON, GeoJSON) within a Git repository. Detected changes are automatically saved as new versions (commits).
2.  **Detailed Change Overview (Diffs):** Generates human-readable diffs that not only show technical differences but highlight semantic changes (e.g., "Row X changed: Field 'Name' from 'Old' to 'New'").
3.  **Transparent History:** Offers an intuitive web interface to browse the entire data history, compare any two versions, and trace every single change.
4.  **Collaboration Workflow:** Allows external users (e.g., researchers, interested citizens) to propose corrections or additions to datasets. These "data pull requests" can be reviewed, discussed, and, if approved by data stewards, merged into the main dataset.
5.  **Rollback Functionality:** Easy reversion of datasets to previous versions in case of errors or undesirable changes.
6.  **API Access:** Provides a simple API to retrieve current or historical versions of datasets.

## Benefits
*   **Increased Transparency & Trust:** Every data change is traceable, which strengthens trust in published data.
*   **Improved Data Quality:** The collaborative approach enables the community to contribute to error correction and data enrichment.
*   **Efficient Data Management:** Automates version control, reducing manual effort for data stewards.
*   **Facilitates Research & Analysis:** Researchers can analyze data changes over time and base their studies on verifiable data versions.
*   **Promotes Citizen Participation:** Offers a low-threshold opportunity for citizens to actively participate in the maintenance of public data.

## Target Institutions
*   **Municipal Administrations:** For open data portals (e.g., Senatsverwaltung Berlin, Open Data Portal), for transparent management of planning data, budget data, environmental data.
*   **Universities & Research Institutions:** For version control of research datasets and to enable collaborative data maintenance in open science projects.
*   **Non-Governmental Organizations (NGOs):** For transparent publication and management of monitoring data, project reports, and environmental data, often with a citizen science component.

The "Dataset Historian" transforms open data portals from static archives into dynamic, trustworthy, and collaborative data sources.