# Dossier: Policy Evolution Explorer: Git-Powered Legislative Change Analysis with Local AI

## Problem Statement
Citizens and public administrators face challenges in tracking and comprehending the impact of frequent legislative changes. This leads to reduced civic engagement and operational inefficiencies. The current practice of understanding legislative amendments is often cumbersome, time-consuming, and requires legal expertise that is not always readily accessible.

## Project Idea
A browser-native tool that leverages legislative texts (e.g., from federal or state law repositories, if available in versioned formats) to enable users (citizens, administrative staff, NGOs) to:

1.  **Visualize Changes Over Time**: Interactive timelines and visual diffs that highlight not only textual differences but also the *semantic meaning* of changes.
2.  **Local AI Analysis**: Utilize a local (WASM/WebGPU) LLM instance to answer questions such as "What are the key changes in this new version of the law?" or "How does this amendment affect group X?".
3.  **Track Specific Passages**: The ability to follow specific articles or paragraphs across different versions and understand their evolution.
4.  **Show Dependencies**: Potential visualization of references and dependencies between different legal texts or paragraphs.

## Technological Approach
*   **Frontend**: Modern web technologies for an appealing and intuitive user interface.
*   **Git Integration**: Use of Git repositories (or similar version control systems) as the primary source for legislative texts and their history.
*   **WASM/WebGPU**: Deployment of WebAssembly and WebGPU for efficient text processing, diff algorithms, and the execution of local, smaller language models (LLMs) directly in the browser.
*   **Local LLMs**: Integration of specialized, compressed LLMs trained to understand legislative texts and explain them in plain language, without needing to send data to external servers.

## Civic Utility
*   **Transparency and Participation**: Increases citizens' understanding of legislative processes and fosters informed participation.
*   **Administrative Efficiency**: Supports administrative staff in quickly grasping legislative changes and understanding their impact on their work.
*   **Education**: Serves as a valuable teaching tool for students and trainees in the public sector.
*   **Data Privacy**: Local LLMs ensure that sensitive inquiries and data remain within the user's browser.

## Target Institution
Senatsverwaltung für Justiz und Verbraucherschutz Berlin (Berlin Senate Department for Justice and Consumer Protection), as it is responsible for legal frameworks and the accessibility of laws.
