# Schema-Forge: Git-Based Version Management for Public Data Schemas

## Short Description
Schema-Forge is an Amélie tool that applies the power of Git to the version control and transparent evolution of structured data schemas (e.g., JSON Schema, OpenAPI specifications) and public document templates. It enables universities, municipalities, and NGOs to track changes to their data structures reproducibly, develop them collaboratively, and clearly communicate semantic differences, much like Git manages code changes.

## Problem Statement
In public administration, academia, and civil society, there's a growing need to publish structured data and documents whose schemas or templates must evolve over time. This often happens ad-hoc, without clear version control or a way to transparently track changes. This leads to:
*   **Data Inconsistencies:** Consumers of public data are unaware of when and how data schemas have changed.
*   **Reproducibility Issues:** In research, evolving data models are difficult to audit and reproduce.
*   **Collaboration Hurdles:** Collaborative development of reporting standards or data models is arduous and error-prone without a robust tool.
*   **Lack of Transparency:** Citizens or external partners cannot easily inspect the evolution of data structures.

## The Amélie Solution: Schema-Forge
Schema-Forge offers a solution by porting the proven principles of Git – version control, branching, merging, and audit trails – to the management of schemas and structured templates. It's not just a 'text diff tool', but understands the *semantic* changes within a schema (e.g., a property was added, the type of a property changed, a field became required).

### How it Works
1.  **Schema Tracking:** Imports and manages schemas (e.g., JSON Schema, YAML, XML Schema) within a Git repository.
2.  **Semantic Diff Analysis:** Generates understandable reports on changes between different schema versions, going beyond mere line-by-line differences.
3.  **Branching & Merging for Schemas:** Allows for parallel development of schema versions for future adaptations or experiments.
4.  **Auditability:** Every schema change is recorded with author, timestamp, and justification in an immutable history.
5.  **API/CLI:** Provides an interface for integration into existing open data pipelines or development workflows.

## Technical Details
Schema-Forge will be developed as an open-source tool, preferably in TypeScript/JavaScript for broad platform compatibility. It uses `git` as its backend for version control. Core functionality includes:
*   **Schema Parsers:** Support for common schema formats (JSON Schema, OpenAPI, etc.).
*   **Diff Algorithms:** Implementation of algorithms to detect semantic changes (e.g., property added/removed, type changed, constraint modified).
*   **Git Integration:** Seamless interaction with local and remote Git repositories.
*   **Optional Web UI:** A simple user interface for visualizing schema histories and diffs.

## Potential Use Cases
*   **Municipal Open Data Portals:** Cities can make the evolution of their data schemas transparent, allowing users to subscribe to changes or review past versions.
*   **University Research:** Research groups can version data management plans and research data schemas to ensure reproducibility and long-term archiving.
*   **NGO Reporting:** NGOs submitting complex reports with structured data to funders or governments can collaboratively develop the underlying reporting structures and formally track changes.
*   **Standardization Bodies:** Development and maintenance of open data standards (e.g., for mobility, environment) with a clear version history.

## Why Amélie?
Schema-Forge is a prime example for the Amélie initiative because it applies a robust, proven technology (Git) to an unmet need in the civil sector. It promotes transparency, enhances data quality, and enables more efficient, collaborative work on critical data structures that are vital for universities, municipalities, and NGOs. It is a tool that strengthens digital sovereignty and lays the foundation for trustworthy public data.