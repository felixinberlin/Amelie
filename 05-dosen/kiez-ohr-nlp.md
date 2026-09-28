# Dose: Kiez-Ohr: Browser-Native NLP for Citizen Reports

## Problem Statement
Many Berlin district offices and specialized departments receive a multitude of citizen concerns daily via free-text fields on their websites (e.g., "Ordnungsamt Online," platforms for reporting public space defects). The manual review, categorization, and forwarding of these concerns are time-consuming, error-prone, and lead to long processing times. This frustrates citizens and ties up valuable administrative resources.

## The Amélie Solution: Kiez-Ohr
"Kiez-Ohr" (Neighborhood Ear) is an open-source tool that leverages a local, browser-based Large Language Model (LLM) to automatically analyze free-text citizen reports and extract structured information. Without needing to send data to external servers, Kiez-Ohr can:

1.  **Categorize concerns**: E.g., "Waste Disposal," "Broken Streetlight," "Graffiti," "Noise Disturbance."
2.  **Extract entities**: E.g., the exact location (street, house number, district), the affected object (park bench, playground equipment), the urgency level.
3.  **Analyze sentiment**: Assess the urgency or frustration level of the citizen.
4.  **Suggest forwarding**: Based on categorization, recommend the responsible department or division.

## Technical Approach
The core of Kiez-Ohr is a lightweight LLM optimized for text classification and entity extraction, running directly in the administrative staff's browser (via WebAssembly/WebGPU). This ensures maximum data security and privacy, as no sensitive citizen data leaves the local environment. An intuitive user interface allows staff to quickly review and, if necessary, adjust the categorizations suggested by the LLM. The system can be continuously improved through user feedback (administrative staff) via active learning.

## Potential and Impact
Kiez-Ohr would significantly accelerate the processing of citizen concerns, improve data quality, and enable administrations to respond more quickly and precisely to citizens' needs. It builds a bridge between modern LLM technology and the practical challenges of public administration, fully in line with the Amélie initiative: decentralized, data protection compliant, and citizen-centric.