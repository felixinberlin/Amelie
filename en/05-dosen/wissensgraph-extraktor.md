# Amélie Initiative: Knowledge Graph Extractor

## 1. Overview

The **Knowledge Graph Extractor** is an open-source tool designed to assist universities, municipalities, and NGOs in extracting structured, verifiable knowledge from large volumes of unstructured texts (e.g., research reports, legislative documents, meeting minutes, public consultation documents). Instead of laboriously manually identifying and cataloging data points, this tool enables the definition of a *knowledge schema*, which a Large Language Model (LLM) then uses to automatically identify, extract, and output relevant information in a structured format (e.g., JSON-LD or compatible with graph databases). A central feature is **provenance**: every extracted piece of information is directly linked to the relevant text passages in the source document, significantly increasing verifiability and transparency.

## 2. The Problem: Information Overload and Manual Hurdles

In the public sector and academia, organizations face an exponentially growing amount of information. Reports, studies, laws, and public comments often exist as lengthy, unstructured text documents. The manual process of reading, understanding, and extracting relevant facts for analysis, decision-making, or generating new documents is:
*   **Time-consuming and costly:** Experts spend hours on repetitive data collection.
*   **Error-prone:** Human fatigue and interpretive differences lead to inconsistencies.
*   **Not scalable:** As data volume increases, manual processing breaks down.
*   **Lacking verifiability:** Without direct references to original sources, tracing the origin of data points is difficult.

This creates "friction" in knowledge processing, hindering innovation and impairing the efficiency of public services.

## 3. The Solution: Asymmetric Inversion through Knowledge Graph Extraction

The **Knowledge Graph Extractor** inverts this manual, inefficient process (asymmetric inversion). It offers an automated, schema-driven method for knowledge acquisition:
1.  **Schema Definition:** Users flexibly define the type of knowledge to be extracted (e.g., "Policy X affects demographic group Y in region Z with impact A"). This can be done using tools like Zod (TypeScript) or Pydantic (Python).
2.  **Document Input:** Unstructured texts (PDFs, Markdown, HTML, TXT) are fed into the system.
3.  **LLM-driven Extraction:** An open-source or commercial LLM (e.g., Llama 3, GPT-4) processes the text and extracts information according to the defined schema.
4.  **Provenance Anchoring:** Each extracted piece of information is provided with direct references (e.g., paragraph number, page range) to the original text. This enables immediate verification and builds trust.
5.  **Structured Output:** Results are output as structured data (e.g., JSON objects that can be imported into a graph database).

## 4. Use Cases and Target Groups

*   **Universities (e.g., TU Berlin Open Science Lab, political science departments):** Automation of literature reviews, extraction of study results, analysis of legislative texts and their impacts.
*   **Municipal Administrations (e.g., Senatsverwaltung Berlin):** Accelerating the analysis of public consultations, extracting relevant passages from new regulations, summarizing meeting minutes for policymakers.
*   **NGOs and Think Tanks:** Efficient data collection for advocacy work, analysis of reports and studies, generation of fact sheets.

## 5. Technical Details

*   **Languages:** TypeScript (frontend/backend logic), Python (for LLM interaction/orchestration).
*   **LLMs:** Integration with various (open-source) LLMs via APIs (z.B. Hugging Face, Ollama) or commercial providers.
*   **Schema Definition:** Zod (TypeScript) or Pydantic (Python) for robust and validatable data models.
*   **Database:** Optional integration with graph databases (e.g., Neo4j, DGraph) for storing and querying the extracted knowledge graph.
*   **User Interface:** A simple web interface (e.g., React/Vue) for schema definition, document upload, and visualization/export of results.

## 6. Amélie 8-Vector Evaluation

*   **Novelty:** 9/10 – Specific application of KG extraction with strong provenance for the civic/academic sector, beyond generic LLM summarization.
*   **Complexity:** 8/10 – Requires robust NLP/LLM engineering, schema management, and citation linking.
*   **Possibility:** 9/10 – Current LLM capabilities, Zod/Pydantic, and graph databases make this highly feasible.
*   **Longevity:** 8/10 – The problem of information overload and the need for structured knowledge is enduring.
*   **CivicSWOT:** 9/10 – Addresses a critical friction in public sector knowledge work.
*   **TechTreeFit:** 9/10 – Leverages modern LLM APIs/OSS, TypeScript, graph databases; easily integratable.
*   **GroundTruth:** 9/10 – Empirically observed pain point in research, policy analysis, and NGO operations.
*   **Fun:** 9/10 – Satisfying to transform unstructured information into structured, queryable knowledge.

## 7. Conclusion

The Knowledge Graph Extractor offers a transformative solution to the challenge of knowledge processing in the public sector. By automating extraction and ensuring provenance, it not only increases efficiency but also improves the quality and verifiability of decision-making foundations. It is a prime example of "asymmetric inversion" of manual labor into scalable, technology-supported processes.