# Amélie Dossier: Open Science Verifier (Wissenschafts-Prüfstand)

## 1. Problem Statement (Friction & Enforcement Gap)

Scientific studies play an increasingly critical role in public discourse and policy-making. However, the accessibility and verifiability of the underlying research data, methodologies, and software code are often severely restricted. This leads to an asymmetric distribution of information: while researchers and commissioning parties have full insight, civil society actors, journalists, and even municipalities often lack the means to transparently examine the scientific foundations of recommendations and decisions. This opacity creates friction and an enforcement gap in evidence-based policy-making and public accountability. It hinders informed civic participation and allows scientific claims to be used as a basis for decisions without sufficient independent scrutiny.

## 2. Solution Approach (Asymmetric Inversion)

The "Open Science Verifier" is an open-source tool designed to invert this asymmetry. It enables non-academic actors to quickly and systematically assess the reproducibility and transparency of scientific publications. Instead of waiting for the often lengthy and opaque academic peer-review process, the tool provides an initial evaluation of a study's openness and auditability. By offering an easily understandable "Transparency Score" and highlighting critical metadata, the tool strengthens civil society's ability to critically question scientific evidence and engage in informed discussions.

## 3. Core Features

*   **Document Upload & Analysis**: Users can upload scientific articles (PDFs) or provide URLs to studies. The tool automatically extracts relevant information.
*   **Metadata Extraction**: Identification of authors, institutions, funders (to detect potential conflicts of interest), publication date, and journal.
*   **Reproducibility Indicators**: Scanning the document for signs of open data (e.g., links to repositories like Zenodo, OSF, Dryad), open code (e.g., GitHub links), and detailed methodology sections.
*   **Transparency Score**: An aggregated rating based on the availability of data, code, and detailed methodological descriptions. A high score indicates high reproducibility.
*   **Key Claim Identification**: Extraction and summarization of the study's main claims and findings.
*   **Structured Report**: Generation of a clear report summarizing the extracted information and the Transparency Score, including direct links to found repositories or relevant sections in the original document.

## 4. Target Groups & Use Cases

*   **Universities and Open Science Labs**: For promoting and teaching open science practices, as a self-assessment tool for students and researchers (e.g., TU Berlin Open Science Lab).
*   **Civil Society Organizations (NGOs)**: For independent verification of studies influencing policy decisions (e.g., Umweltbundesamt, Transparency International Deutschland, BUND Berlin).
*   **Investigative Journalism**: For quickly assessing the credibility and verifiability of scientific sources during investigations.
*   **Municipalities and City Administrations**: When evaluating expert opinions and studies that form the basis for local projects or regulations.

## 5. Technological Basis

The tool would be built upon a combination of PDF parsing libraries (e.g., `pdf-parse`, `pdf.js`), text analysis (regular expressions, potentially light LLM integration for semantic extraction of key claims and contextualization), and a web-based user interface. The architecture would be modular to allow for future extensions such as integration with external databases for conflicts of interest or the analysis of specific methodology types.

## 6. Contribution to Amélie

The Open Science Verifier embodies the Amélie ideal of empowering civil society actors through open-source technologies. It transforms complex scientific information into understandable, verifiable formats, thereby fostering informed and transparent democracy. By inverting information asymmetry, it actively contributes to the quality of public debate and increases the accountability of decision-makers.