# Dossier: Git Lore Ledger – Semantic History for Public Documents

## Core Idea
The 'Git Lore Ledger' is a browser-native tool that applies `git`'s version control principles to public documents. It enables authorities and citizens to not only securely track the evolution of laws, regulations, urban development plans, and other crucial texts, but also to understand the *semantic* changes between versions using local AI models.

## Problem Statement
Public administrations manage an immense volume of documents whose history and changes are often opaque or difficult to access. Who changed what in a building plan and when? How has a legal text evolved over decades? Answering these questions is arduous, error-prone, and hinders transparency and citizen participation.

## Proposed Solution
The Git Lore Ledger offers a visually appealing interface, powered by WASM and WebGPU, to perform `git`-like operations (commit, diff, blame, branch) directly in the browser. For text documents (e.g., Markdown, JSON, XML, but also converted PDFs), it creates a semantic history:

1.  **Version Control:** Every change to a document is stored as a 'commit,' with author, date, and a descriptive message.
2.  **Semantic Diffs:** Instead of just line-based differences, small AI models running in the browser (e.g., transformer models optimized for WebGPU) analyze the *meaning* of the changes and summarize them (e.g., 'Section 3.1 was expanded with requirement X, while Y was removed').
3.  **Lore View:** An interactive timeline visualizes the document's evolution, highlighting significant changes and allowing navigation through different versions. A 'Blame' function could indicate which department or role was responsible for specific text passages.
4.  **Natural Language Queries:** Citizens and staff can ask questions like 'Show me all changes regarding tree protection regulations in district Mitte between 2000 and 2010,' which are interpreted by a local AI model and translated into the document history.

## Target Audience
Senate Administrations (e.g., for Urban Development, Environment and Climate Protection), municipal administrations, archives, universities, and interested citizens.

## Technological Basis
Browser-native `git` implementations (WASM), small, optimized NLP models (e.g., for WebGPU or ONNX Runtime Web), intuitive visualization tools (e.g., D3.js, Svelte/Vue/React).