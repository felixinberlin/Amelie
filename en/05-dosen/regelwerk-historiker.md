# Regulatory Historian: Semantic Drift Analysis for Public Ordinances

## Problem Statement
Public administrations and institutions are custodians of complex regulatory frameworks, guidelines, and data schemas that evolve over years or decades. These documents are often drafted in heterogeneous formats (PDF, Word, Markdown, XML) and undergo incremental changes. Manually tracking the cumulative impact of these changes – known as 'policy drift' or 'regulatory drift' – is extremely laborious, error-prone, and leads to a lack of transparency. While existing version control systems like Git provide line-by-line diffs, they fail to capture the semantic meaning of changes or their implications for the overall consistency of the regulatory framework. This significantly hinders civic participation, consistency checks, and the evaluation of policy measures.

## Solution Approach: Amélie "Regulatory Historian"
The "Regulatory Historian" is an open-source tool that leverages Git as its primary version control system, enhanced with advanced AI-driven semantic analysis. The system transforms disparate regulatory documents into a standardized, Git-friendly format (e.g., structured Markdown, JSON-LD). Subsequently, Large Language Models (LLMs) are employed to identify not only textual but also *conceptual* changes between different versions. 

### Core Functions:
1.  **Document Ingestion & Normalization**: Automatic reading and parsing of regulatory texts from various sources and formats into a uniform, machine-readable structure.
2.  **Git Integration**: Versioning of each normalized document in a dedicated Git repository to ensure an immutable, decentralized change history.
3.  **Semantic Diff Analysis**: Utilizing LLMs to discern the *meaning* of changes. Instead of just 'line X changed to line Y', the system identifies 'The scope of paragraph Z has been expanded' or 'Definition A has been refined, with implications for section B'.
4.  **Drift Detection & Quantification**: Identification of gradual, cumulative changes over extended periods that may lead to an unexpected shift in original intent or inconsistencies.
5.  **Impact Analysis**: Assessment of the potential effects of changes on other parts of the regulatory framework or on affected stakeholders (e.g., citizens, businesses).
6.  **Human-Readable Summaries & Visualization**: Generation of understandable summaries of changes and their impacts, complemented by visualizations of drift trends and dependencies.
7.  **Consistency Checking**: Automatic detection of contradictions or redundancies introduced by changes within the regulatory framework.

## Technological Basis
*   **Version Control**: Git (Core)
*   **Document Processing**: Parsing and structuring using specialized libraries (e.g., `pandoc`, `textract`, `markdown-it`)
*   **Semantic Analysis**: LLMs (e.g., open-source models like Llama.cpp, or API-based services) with specific prompt engineering strategies and potentially Retrieval-Augmented Generation (RAG).
*   **Data Storage**: Possibly complemented by a graph database to map dependencies and relationships within the regulatory framework.
*   **Frontend**: An interactive web application for visualizing and exploring the change history.

## Target Institutions
This project is aimed at institutions managing complex and evolving regulatory frameworks, such as the German Federal Environmental Agency (Umweltbundesamt), Berlin Senate Administrations (e.g., for Environment, Urban Development, Finance), open science research institutions, or NGOs advocating for transparency and good governance.

## Civic Benefit
The "Regulatory Historian" creates unprecedented transparency in the evolution of public regulations. It enables citizens, NGOs, and researchers to better understand the reasons and impacts of changes. For administrations, it leads to increased consistency, reduces administrative effort in review, and helps identify unintended consequences of regulatory changes early. This strengthens trust in public administration and fosters informed debate on governance issues.