# Dossier Chronoscribe: Semantic Git for Public Regulations

## Problem Statement
Public administrations, particularly those managing legal texts, ordinances, and guidelines (e.g., the Berlin Senate Department for Justice and Consumer Protection), face the challenge of maintaining complex, prose-based documents with robust version control, collaborative capabilities, and semantic traceability. Existing document management systems often offer only rudimentary version control, while technical solutions like Git are inaccessible to non-developers and optimized for code diffs, not prose changes. This leads to inefficiencies, errors in policy amendments, and a lack of transparency.

## The Amélie Solution: Chronoscribe
Chronoscribe is a browser-native (WASM/WebGPU) tool that combines the power of Git with semantic understanding and an intuitive, visual user interface for prose-based documents. It enables public authorities to:

1.  **Semantic Diffs**: Instead of line-based differences, Chronoscribe identifies changes at the paragraph, section, or even conceptual level, supported by small, local language models (LLMs). E.g., "This amendment expands the scope of §X from Y to Z."
2.  **Visual Version History ("Time-Travel UI")**: A highly interactive, visual timeline of document evolution, allowing non-technical users to effortlessly navigate revisions, compare versions side-by-side, and grasp *what* has semantically changed at a glance.
3.  **"Prose Blame"**: Identifies who changed which paragraphs or sections, and when, with clear (potentially AI-assisted) commit messages.
4.  **Structured Document Analysis**: Understands document structure (headings, paragraphs, lists, footnotes) for more intelligent diffs and merges.
5.  **Agentic Micro-Harnesses**:
    *   **Commit Message Suggestion**: Generates human-readable, policy-relevant commit messages based on semantic changes.
    *   **Impact Analysis**: Estimates the impact of a change on related sections or external regulations.
    *   **Consistency Checker**: Flags potential inconsistencies introduced by changes.

Chronoscribe is not a generic wrapper or dashboard, but a specialized Git client that meets the specific needs of public administration in handling legal texts and guidelines. It leverages local AI and a playful UX to make complex processes accessible and more error-resistant.

## Target Audience
Employees of the Berlin Senate Department for Justice and Consumer Protection, federal ministries, universities, and other public institutions responsible for creating, maintaining, and publishing extensive text documents.

## Technological Basis
Browser-native (WASM/WebGPU), local AI models, open-source Git libraries, modern frontend frameworks.