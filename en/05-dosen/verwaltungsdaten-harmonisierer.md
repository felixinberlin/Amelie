# Dossier: AI-Powered Dataset Harmonizer for Public Administration

## 1. Problem Statement
Public administrations, especially at the municipal level, generate and manage a vast amount of data. Many of these datasets are invaluable for open data initiatives and data-driven policymaking. However, they frequently suffer from significant quality issues:

*   **Heterogeneous Formats:** Data from different departments or over various time periods often exhibit inconsistent formats (e.g., date formats, address spellings).
*   **Missing Metadata:** Standardized descriptions of data fields, units, or collection periods are frequently absent.
*   **Inconsistent Entries:** Free-text fields or categorical data contain typos, abbreviations, or synonyms that hinder aggregation or analysis (e.g., "Berlin", "berlin", "Bln").
*   **Lack of Interoperability:** Without a common semantic basis, data from different sources can hardly be linked.

These issues lead to high manual effort in data cleaning and integration, complicating the use of open data and impairing administrative efficiency.

## 2. The Amélie Solution: Public Data Harmonizer
The "Public Data Harmonizer" is an open-source tool that leverages Artificial Intelligence, particularly Large Language Models (LLMs), to automatically standardize and enrich tabular datasets from public administration. The goal is to significantly enhance the quality and usability of public sector data.

### 2.1 Core Features
*   **Intelligent Schema Inference:** Analyzes column names and content to automatically detect data types (date, text, number, geo-coordinates, etc.) and suggest canonical column names (e.g., "Date of Collection" instead of "Coll_Dt").
*   **Inconsistency Detection & Correction:** Identifies and suggests corrections for inconsistent entries (e.g., unifying city names, address components, spellings).
*   **Metadata Generation:** Based on dataset content, the tool generates suggestions for metadata such as descriptions, tags, relevant ontologies (e.g., Schema.org, DCAT-AP.de), and license information.
*   **Rule-Based Standardization:** Users can review, adjust, and save AI-suggested rules to apply them to similar datasets.
*   **Data Enrichment:** Suggestions for adding missing information from external sources or deriving it from existing data (e.g., postal code from address).
*   **Interactive Dashboard:** A user-friendly interface for visualizing data quality, reviewing AI suggestions, and implementing corrections.

### 2.2 Technical Approach
The tool will be developed as a web application that can run in a browser or on a local server. A modular architecture is planned for the AI components:

*   **LLM Integration:** Utilization of open-source LLMs (e.g., via Ollama) for semantic analysis, named entity recognition, and rule generation. API integration for more powerful models (e.g., OpenAI, Anthropic) is optionally foreseen.
*   **Data Parsing & Transformation:** Use of established libraries for CSV, Excel, JSON, etc.
*   **User Interface:** Modern frontend frameworks (e.g., React/Vue/Svelte) for intuitive data auditing and rule management.
*   **Rule Engine:** A flexible engine for defining, applying, and storing normalization and enrichment rules.

## 3. Target Institution & Benefits

*   **Berlin Senate Department for Economics, Energy and Public Enterprises (Open Data Unit Berlin):** Direct support in preparing data for the Berlin Open Data Portal, increasing data quality and quantity.
*   **Statistical Offices:** More efficient preparation of datasets for statistical evaluations.
*   **Universities & NGOs:** Provision of a tool for analyzing and preparing public data for research and civil society projects.

The primary benefit lies in automating time-consuming processes, improving data quality, and fostering a data-driven, transparent administration. This leads to higher acceptance and usability of open data and supports the development of innovative digital applications based on this data.

## 4. Long-Term Vision
The Harmonizer could become a central component in the public administration's data pipeline, ensuring continuous improvement in data quality. By enabling the learning and sharing of organization-specific rules, a 'knowledge network' for data standardization could emerge. It could also serve as a teaching tool for data literacy within public administration.