# Dossier: TopicTapestry – Semantic Navigator for Public Policy Documents

## The Problem
Berlin's Senate Administrations, research institutions, and NGOs produce an enormous volume of text documents: policy papers, expert reports, citizen participation protocols, research findings. These documents are often siloed, difficult to survey, and their semantic connections remain unrecognised. This leads to information loss, duplicated efforts, and hinders coherent policy-making and public information. Manual analysis of these text volumes is time-consuming and prone to error.

## The Amélie Solution: TopicTapestry
TopicTapestry is a browser-native tool, powered by local, privacy-preserving AI models (WASM/WebGPU), designed to semantically analyse and visualise large collections of public documents. It creates an interactive 'Topic Tapestry' where documents and concepts are represented as nodes in a dynamic graph. Users can 'drift' through this semantic landscape, identifying clusters of similar themes, uncovering connections between seemingly unrelated documents, and recognising new, emergent discussion points.

### How it Works:
1.  **Local Embedding:** Documents are transformed into semantic vectors client-side (or via a trusted local API) using a specialised embedding model.
2.  **Interactive Visualization:** A WebGL-based visualisation displays these vectors as an interactive graph, where node proximity indicates semantic similarity.
3.  **Micro-Agent Harness:** Small, specialised agents can, upon user request, 'query' the tapestry, e.g., 'Show me all documents discussing both 'sustainability' and 'digital infrastructure'' or 'What unconnected topic clusters have emerged in the last 6 months?'. This allows for deeper exploration and the identification of trends or gaps.
4.  **Zero-Latency Feedback:** All interaction occurs within the browser, enabling fluid and immediate exploration – a true VibeCoding experience.

## Civic Impact & Delight
TopicTapestry transforms the often tedious work of document analysis into a playful journey of discovery. It not only promotes internal efficiency and coherence within public authorities but also makes complex policy landscapes more accessible and understandable for citizens. The joy of discovering hidden connections and gaining an overview of vast amounts of information fosters intrinsic motivation and strengthens trust in transparent administrative processes.

### Target Audience:
*   Employees of Senate Administrations (e.g., SUMVK, Senate Chancellery) for policy development and coordination.
*   NGOs and civil society initiatives for analysing legislative drafts, reports, and identifying advocacy points.
*   Universities and research institutions for analysing literature and research landscapes.

TopicTapestry is a prime example of an Amélie tool: it leverages innovative, open AI technologies to solve a pressing public administration problem in a playful and citizen-friendly manner, while adhering to high standards of data privacy and transparency.